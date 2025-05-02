console.log("products.js loaded");

let products = loadProducts();
console.log("Loaded products on load:", products);
renderProducts();

function loadProducts() {
    try {
        const storedProducts = localStorage.getItem('products');
        const loaded = storedProducts ? JSON.parse(storedProducts) : [];
        console.log("loadProducts returning:", loaded);
        return loaded;
    } catch (error) {
        console.error("Error loading products from local storage:", error);
        return [];
    }
}

function saveProducts() {
    try {
        localStorage.setItem('products', JSON.stringify(products));
        console.log("Saved products:", products);
    } catch (error) {
        console.error("Error saving products to local storage:", error);
    }
}

function addProduct() {
    const nameInput = document.getElementById('new-product-name');
    const priceInput = document.getElementById('new-product-price');
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (name && !isNaN(price) && price >= 0) {
        products.push({ name, price });
        saveProducts();
        renderProducts();
        nameInput.value = '';
        priceInput.value = '';
    } else {
        alert('Please enter a valid product name and price.');
    }
}

function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        products.splice(index, 1);
        saveProducts();
        renderProducts();
        // Optionally, update the product list on the main invoice page if it's open
        if (window.opener && !window.opener.closed && window.opener.document.getElementById('product-select')) {
            window.opener.populateProductDropdown();
        }
    }
}

function renderProducts() {
    const productBody = document.getElementById('product-body');
    console.log("renderProducts called. productBody element:", productBody);
    if (productBody) {
        try {
            productBody.innerHTML = '';
            products.forEach((product, index) => {
                const row = productBody.insertRow();
                const nameCell = row.insertCell();
                const priceCell = row.insertCell();
                const actionCell = row.insertCell();

                nameCell.textContent = product.name;
                priceCell.textContent = `$${product.price.toFixed(2)}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteProduct(index);
                actionCell.appendChild(deleteButton);
            });
            console.log("Products rendered successfully.");
        } catch (error) {
            console.error("Error rendering products:", error);
        }
    } else {
        console.error("Error: 'product-body' element NOT FOUND in products.html during renderProducts!");
    }
}

// Ensure renderProducts is called even if loadProducts returns nothing initially
if (!products || products.length === 0) {
    renderProducts();
}
