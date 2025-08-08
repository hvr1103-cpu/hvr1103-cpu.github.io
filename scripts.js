// Sample initial data
let items = {};
let activeFilter = 'all';
let maxPrice = 2000;

// Initialize the gallery
document.addEventListener('DOMContentLoaded', async function() {
    items = await getItemList();
    renderGallery();
    setupFilterListeners();
    setupPriceSlider();
});

// Set up filter click listeners
function setupFilterListeners() {
    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            filterItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the tag from data attribute
            activeFilter = this.getAttribute('data-tag');
            
            // Re-render gallery with filter
            renderGallery();
        });
    });
}

// Set up price slider
function setupPriceSlider() {
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    priceRange.addEventListener('input', function() {
        maxPrice = parseInt(this.value);
        priceValue.textContent = `₱${maxPrice}`;
        renderGallery();
    });
}

// Render gallery items with filtering
function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    // Filter items based on active filter and price range
    //let filteredItems = items.filter(item => item.price <= maxPrice);
    let filteredItems = Object.fromEntries( Object.entries(items).filter(([key, item]) => item.price <= maxPrice) );
    
    if (activeFilter !== 'all') {
        //filteredItems = filteredItems.filter(item => item.tags.includes(activeFilter));
        filteredItems = Object.fromEntries( Object.entries(items).filter(([key, item]) => item.tags.includes(activeFilter)) );
    }
    
    //if (filteredItems.length === 0) {
    if (Object.keys(filteredItems).length === 0) {
        gallery.innerHTML = '<div class="no-items">No items found for this filter. Try adjusting your filters!</div>';
        return;
    }
    
    for (const [id, item] of Object.entries(filteredItems)) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card-img">
            <div class="card-content">
                <h3 class="card-title">${item.name}</h3>
                <div class="card-price">₱${item.price.toFixed(2)}</div>
                <div class="card-details">
                    <div><strong>Colors:</strong> ${item.colors.join(', ')}</div>
                    <div><strong>Sizes:</strong> ${item.sizes.length > 0 ? item.sizes.join(', ') : 'Not specified'}</div>
                </div>
                <div class="tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="card-actions">
                <button class="edit-btn" onclick="editItem('${id}')">Edit</button>
                <button class="delete-btn" onclick="deleteItem('${id}')">Delete</button>
            </div>
        `;
        gallery.appendChild(card);
    }
}

// Get item list from DB
async function getItemList() {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
}
