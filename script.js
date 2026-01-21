async function loadListings() {
    try {
        const response = await fetch('listings.json');
        const data = await response.json();
        
        // Get first 50 listings
        const listings = data.slice(0, 50);
        
        displayStats(listings);
        displayListings(listings);
        
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error loading listings:', error);
        document.getElementById('loading').innerHTML = '<p>Error loading listings. Please try again.</p>';
    }
}

function displayStats(listings) {
    const avgPrice = (listings.reduce((sum, l) => sum + parseFloat(l.price.replace('$', '')), 0) / listings.length).toFixed(2);
    const superhosts = listings.filter(l => l.host_is_superhost === 't').length;
    const avgRating = (listings.reduce((sum, l) => sum + (l.review_scores_rating || 0), 0) / listings.length).toFixed(2);

    document.getElementById('stats').innerHTML = `
        <div class="stat-card">📊 ${listings.length} Listings</div>
        <div class="stat-card">💰 Avg $${avgPrice}/night</div>
        <div class="stat-card">⭐ ${superhosts} Superhosts</div>
        <div class="stat-card">🌟 ${avgRating} Avg Rating</div>
    `;
}

function parseAmenities(amenitiesStr) {
    try {
        return JSON.parse(amenitiesStr.replace(/'/g, '"'));
    } catch {
        return [];
    }
}

function displayListings(listings) {
    const container = document.getElementById('listings');
    
    listings.forEach((listing, index) => {
        const amenities = parseAmenities(listing.amenities);
        const topAmenities = amenities.slice(0, 5);
        
        const card = document.createElement('div');
        card.className = 'listing-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        const description = listing.description
            ? listing.description.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').substring(0, 150) + '...'
            : 'Cozy place to stay in San Francisco';
        
        card.innerHTML = `
            <img src="${listing.picture_url}" 
                 alt="${listing.name}" 
                 class="listing-image"
                 onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'">
            
            <div class="listing-content">
                <div class="listing-header">
                    <div class="listing-title">${listing.name}</div>
                    <div class="price-tag">${listing.price}/night</div>
                </div>
                
                ${listing.review_scores_rating ? `
                    <div class="rating">⭐ ${listing.review_scores_rating} (${listing.number_of_reviews} reviews)</div>
                ` : ''}
                
                <div class="host-info">
                    <img src="${listing.host_picture_url}" 
                         alt="${listing.host_name}" 
                         class="host-avatar"
                         onerror="this.src='https://via.placeholder.com/50?text=Host'">
                    <div class="host-details">
                        <div class="host-name">
                            ${listing.host_name}
                            ${listing.host_is_superhost === 't' ? '<span class="superhost-badge">Superhost</span>' : ''}
                        </div>
                        <div class="host-since">Host since ${new Date(listing.host_since).getFullYear()}</div>
                    </div>
                </div>
                
                <div class="description">${description}</div>
                
                ${topAmenities.length > 0 ? `
                    <div class="amenities">
                        <div class="amenities-title">Top Amenities</div>
                        <div class="amenities-list">
                            ${topAmenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="listing-stats">
                    <div class="stat-item">
                        <div class="stat-value">${listing.bedrooms || 'Studio'}</div>
                        <div class="stat-label">Bedrooms</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${listing.beds || 1}</div>
                        <div class="stat-label">Beds</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${listing.accommodates}</div>
                        <div class="stat-label">Guests</div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Load listings when page loads
window.addEventListener('DOMContentLoaded', loadListings);
```

