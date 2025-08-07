// Sample initial data
let items = {};
let currentItemId = null;
let activeFilter = 'all';
let maxPrice = 2000;

// Initialize the gallery
document.addEventListener('DOMContentLoaded', function() {
    items = {
        "e23z":{
            name: "Summer T-Shirt",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            colors: ["Red", "Blue", "White"],
            sizes: ["S", "M", "L"],
            tags: ["top"]
        }
    };
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
        priceValue.textContent = `$${maxPrice}`;
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
                <div class="card-price">$${item.price.toFixed(2)}</div>
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
    /*
    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card-img">
            <div class="card-content">
                <h3 class="card-title">${item.name}</h3>
                <div class="card-price">$${item.price.toFixed(2)}</div>
                <div class="card-details">
                    <div><strong>Colors:</strong> ${item.colors.join(', ')}</div>
                    <div><strong>Sizes:</strong> ${item.sizes.length > 0 ? item.sizes.join(', ') : 'Not specified'}</div>
                </div>
                <div class="tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="card-actions">
                <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        gallery.appendChild(card);
    });
    */
}

// Open add item modal
function addItem() {
    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('itemId').value = '';
    document.getElementById('itemForm').reset();
    document.getElementById('itemModal').style.display = 'flex';
}

// Open edit item modal
function editItem(id) {
    //const item = items.find(item => item.id === id);
    const item = items[id];
    if (!item) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemId').value = id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemPrice').value = item.price;
    
    // Reset checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Set colors
    item.colors.forEach(color => {
        const checkbox = document.getElementById(`color${color}`);
        if (checkbox) checkbox.checked = true;
    });
    
    // Set sizes
    item.sizes.forEach(size => {
        const checkbox = document.getElementById(`size${size}`);
        if (checkbox) checkbox.checked = true;
    });
    
    // Set tags
    item.tags.forEach(tag => {
        const checkbox = document.getElementById(`tag${tag.charAt(0).toUpperCase() + tag.slice(1)}`);
        if (checkbox) checkbox.checked = true;
    });
    
    document.getElementById('itemModal').style.display = 'flex';
}

// Get item list from DB
function getItemList() {
    fetch('data.json')
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(data => {
        console.log("Loaded JSON:", data);
        // Do something with the data here
    })
    .catch(error => {
        console.error("Failed to load JSON:", error);
    });
}

// Close modal
function closeModal() {
    document.getElementById('itemModal').style.display = 'none';
}

// Save item (add or edit)
function saveItem() {
    const id = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const imageFile = document.getElementById('itemImage').files[0];
    
    // Get selected colors
    const colorCheckboxes = document.querySelectorAll('input[id^="color"]:checked');
    const colors = Array.from(colorCheckboxes).map(cb => cb.value);
    
    // Get selected sizes
    const sizeCheckboxes = document.querySelectorAll('input[id^="size"]:checked');
    const sizes = Array.from(sizeCheckboxes).map(cb => cb.value);
    
    // Get selected tags
    const tagCheckboxes = document.querySelectorAll('input[id^="tag"]:checked');
    const tags = Array.from(tagCheckboxes).map(cb => cb.value);
    
    // Validation
    if (!name || !price || colors.length === 0 || tags.length === 0) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Handle image
    let imageUrl = '';
    if (imageFile) {
        // In a real app, you would upload the file to a server
        // For this demo, we'll create a data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result;
            processSave(id, name, price, imageUrl, colors, sizes, tags);
        };
        reader.readAsDataURL(imageFile);
    } else if (id) {
        // Editing without changing image
        const existingItem = items[id];//items.find(item => item.id === parseInt(id));
        if (existingItem) {
            imageUrl = existingItem.image;
            processSave(id, name, price, imageUrl, colors, sizes, tags);
        }
    } else {
        alert('Please upload an image.');
    }
}

// Process the save operation
function processSave(id, name, price, imageUrl, colors, sizes, tags) {
    if (id) {
        // Edit existing item
        items[id] = {
            name,
            price,
            image: imageUrl,
            colors,
            sizes,
            tags
        };
        /*
        const index = items.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            items[id] = {
                id: parseInt(id),
                name,
                price,
                image: imageUrl,
                colors,
                sizes,
                tags
            };
        }
        */
    } else {
        // Add new item
        //const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        let newId = generateRandomId();
        while (items.hasOwnProperty(newId)) {
          newId = generateRandomId();
        }
        /*
        items.push({
            name,
            price,
            image: imageUrl,
            colors,
            sizes,
            tags
        });
        */
        items[newId] = {
            name,
            price,
            image: imageUrl,
            colors,
            sizes,
            tags
        };
    }
    
    renderGallery();
    closeModal();
}

// Open delete confirmation
function deleteItem(id) {
    currentItemId = id;
    document.getElementById('confirmationModal').style.display = 'flex';
}

// Close confirmation modal
function closeConfirmation() {
    document.getElementById('confirmationModal').style.display = 'none';
    currentItemId = null;
}

// Confirm delete
function confirmDelete() {
    if (currentItemId !== null) {
        //items = items.filter(item => item.id !== currentItemId);
        delete items[currentItemId];
        renderGallery();
        closeConfirmation();
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const itemModal = document.getElementById('itemModal');
    const confirmationModal = document.getElementById('confirmationModal');
    
    if (event.target === itemModal) {
        closeModal();
    }
    
    if (event.target === confirmationModal) {
        closeConfirmation();
    }
};


// Download Items as JSON
function downloadItemsAsJSON() {
    const dataStr = JSON.stringify(items, null, 2); // pretty print
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "items.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function generateRandomId(length = 8) {
  return Math.random().toString(36).substring(2, length + 2);
}

