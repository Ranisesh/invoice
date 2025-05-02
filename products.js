let products = loadProducts();
renderProducts();

function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
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
    if (productBody) {
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
    } else {
        console.error("Error: 'product-body' element not found in products.html");
    }
}
