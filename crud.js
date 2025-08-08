// Sample initial data
let currentItemId = null;

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
    } else {
        // Add new item
        let newId = generateRandomId();
        while (items.hasOwnProperty(newId)) {
          newId = generateRandomId();
        }
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

