console.log("script.js loaded");

let invoiceItems = [];
let products = loadProducts();
let buyers = loadBuyers();

// Populate product and buyer dropdowns on load
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded fired");
    populateProductDropdown();
    populateBuyerDropdown();
    loadSavedInvoice(); // Try to load any previously saved invoice data
});

function loadProducts() {
    try {
        const storedProducts = localStorage.getItem('products');
        const loadedProducts = storedProducts ? JSON.parse(storedProducts) : [];
        console.log("Loaded products:", loadedProducts);
        return loadedProducts;
    } catch (error) {
        console.error("Error loading products:", error);
        return [];
    }
}

function loadBuyers() {
    try {
        const storedBuyers = localStorage.getItem('buyers');
        return storedBuyers ? JSON.parse(storedBuyers) : [];
    } catch (error) {
        console.error("Error loading buyers:", error);
        return [];
    }
}

function populateProductDropdown() {
    const productSelect = document.getElementById('product-select');
    if (productSelect) {
        productSelect.innerHTML = '<option value="">Select Product</option>';
        products.forEach((product, index) => {
            const option = document.createElement('option');
            option.value = index; // Use index as value
            option.textContent = `${product.name} ($${product.price ? product.price.toFixed(2) : '0.00'})`;
            productSelect.appendChild(option);
        });
    } else {
        console.error("Error: 'product-select' element not found!");
    }
}

function populateBuyerDropdown() {
    const buyerSelect = document.getElementById('buyer-select');
    if (buyerSelect) {
        buyerSelect.innerHTML = '<option value="">Select Buyer</option>';
        buyers.forEach((buyer, index) => {
            const option = document.createElement('option');
            option.value = index; // Use index as value
            option.textContent = buyer.name;
            buyerSelect.appendChild(option);
        });
    } else {
        console.error("Error: 'buyer-select' element not found!");
    }
}

function addProductToInvoice() {
    const productSelect = document.getElementById('product-select');
    const quantityInput = document.getElementById('product-quantity');

    if (productSelect && quantityInput) {
        const selectedIndex = productSelect.value;
        const quantity = parseInt(quantityInput.value);

        if (selectedIndex !== "" && !isNaN(quantity) && quantity > 0) {
            console.log("Selected product index:", selectedIndex);
            console.log("Products array:", products);
            const selectedProduct = products[selectedIndex];
            console.log("Selected product:", selectedProduct);

            if (selectedProduct) {
                const existingItemIndex = invoiceItems.findIndex(item => item.name === selectedProduct.name);

                if (existingItemIndex !== -1) {
                    invoiceItems[existingItemIndex].quantity += quantity;
                    invoiceItems[existingItemIndex].total = (invoiceItems[existingItemIndex].price || 0) * invoiceItems[existingItemIndex].quantity;
                } else {
                    invoiceItems.push({
                        name: selectedProduct.name,
                        price: selectedProduct.price || 0,
                        quantity: quantity,
                        total: (selectedProduct.price || 0) * quantity
                    });
                }
                renderInvoiceItems();
                quantityInput.value = 1; // Reset quantity
                productSelect.selectedIndex = 0; // Reset product selection
            } else {
                console.error("Error: Selected product is undefined!");
            }
        } else {
            alert('Please select a product and enter a valid quantity.');
        }
    } else {
        console.error("Error: 'product-select' or 'product-quantity' element not found!");
    }
}

function removeInvoiceItem(index) {
    invoiceItems.splice(index, 1);
    renderInvoiceItems();
}

function renderInvoiceItems() {
    const invoiceBody = document.getElementById('invoice-body');
    const invoiceTotalElement = document.getElementById('invoice-total');

    if (invoiceBody && invoiceTotalElement) {
        invoiceBody.innerHTML = '';
        let totalAmount = 0;

        console.log("Rendering invoice items:", invoiceItems); // Log before rendering

        invoiceItems.forEach((item, index) => {
            console.log("Rendering item:", item); // Log each item being rendered
            const row = invoiceBody.insertRow();
            const nameCell = row.insertCell();
            const priceCell = row.insertCell();
            const quantityCell = row.insertCell();
            const totalCell = row.insertCell();
            const actionCell = row.insertCell();

            nameCell.textContent = item.name;
            priceCell.textContent = `$${item.price ? item.price.toFixed(2) : '0.00'}`;
            quantityCell.textContent = item.quantity;
            totalCell.textContent = `$${item.total ? item.total.toFixed(2) : '0.00'}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeInvoiceItem(index);
            actionCell.appendChild(removeButton);

            totalAmount += item.total || 0;
        });

        invoiceTotalElement.textContent = `Total: $${totalAmount.toFixed(2)}`;
    } else {
        console.error("Error: 'invoice-body' or 'invoice-total' element not found!");
    }
}

// ... (rest of your script.js file remains the same) ...
function generateInvoice() {
    const buyerSelect = document.getElementById('buyer-select');
    const previewBuyerName = document.getElementById('preview-buyer-name');
    const previewBuyerAddress = document.getElementById('preview-buyer-address');
    const previewInvoiceBody = document.getElementById('preview-invoice-body');
    const previewInvoiceTotal = document.getElementById('preview-invoice-total');
    const invoicePreview = document.getElementById('invoice-preview');

    if (buyerSelect && previewBuyerName && previewBuyerAddress && previewInvoiceBody && previewInvoiceTotal && invoicePreview) {
        const selectedBuyerIndex = buyerSelect.value;

        if (selectedBuyerIndex !== "") {
            const selectedBuyer = buyers[selectedBuyerIndex];
            previewBuyerName.textContent = `Name: ${selectedBuyer.name}`;
            previewBuyerAddress.textContent = `Address: ${selectedBuyer.address}`;
        } else {
            previewBuyerName.textContent = `Buyer: Not Selected`;
            previewBuyerAddress.textContent = ``;
        }

        previewInvoiceBody.innerHTML = '';
        let totalAmount = 0;

        invoiceItems.forEach(item => {
            const row = previewInvoiceBody.insertRow();
            const nameCell = row.insertCell();
            const priceCell = row.insertCell();
            const quantityCell = row.insertCell();
            const totalCell = row.insertCell();

            nameCell.textContent = item.name;
            priceCell.textContent = `$${item.price ? item.price.toFixed(2) : '0.00'}`;
            quantityCell.textContent = item.quantity;
            totalCell.textContent = `$${item.total ? item.total.toFixed(2) : '0.00'}`;

            totalAmount += item.total || 0;
        });

        previewInvoiceTotal.textContent = `Total: $${totalAmount.toFixed(2)}`;
        invoicePreview.style.display = 'block';
    } else {
        console.error("Error: One or more preview elements not found!");
    }
}

function saveInvoice() {
    const buyerSelect = document.getElementById('buyer-select');
    const invoiceData = {
        buyerIndex: buyerSelect ? buyerSelect.value : "",
        items: invoiceItems
    };
    localStorage.setItem('currentInvoice', JSON.stringify(invoiceData));
    alert('Invoice data saved locally.');
}

function loadInvoice() {
    const savedData = localStorage.getItem('currentInvoice');
    if (savedData) {
        const invoiceData = JSON.parse(savedData);
        const buyerSelect = document.getElementById('buyer-select');
        if (buyerSelect && invoiceData.buyerIndex !== "") {
            buyerSelect.value = invoiceData.buyerIndex;
        }
        invoiceItems = invoiceData.items || [];
        renderInvoiceItems();
        alert('Invoice data loaded.');
    } else {
        alert('No invoice data found locally.');
    }
}

function loadSavedInvoice() {
    const savedData = localStorage.getItem('currentInvoice');
    if (savedData) {
        const invoiceData = JSON.parse(savedData);
        invoiceItems = invoiceData.items || [];
        renderInvoiceItems();
        const buyerSelect = document.getElementById('buyer-select');
        if (buyerSelect && invoiceData.buyerIndex !== "") {
            buyerSelect.value = invoiceData.buyerIndex;
        }
    }
}

        function sendInvoice()

