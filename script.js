let invoiceItems = [];
let products = loadProducts();
let buyers = loadBuyers();

// Populate product and buyer dropdowns on load
document.addEventListener('DOMContentLoaded', () => {
    populateProductDropdown();
    populateBuyerDropdown();
    loadSavedInvoice(); // Try to load any previously saved invoice data
});

function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

function loadBuyers() {
    const storedBuyers = localStorage.getItem('buyers');
    return storedBuyers ? JSON.parse(storedBuyers) : [];
}

function populateProductDropdown() {
    const productSelect = document.getElementById('product-select');
    productSelect.innerHTML = '<option value="">Select Product</option>';
    products.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = index; // Use index as value
        option.textContent = `<span class="math-inline">\{product\.name\} \(</span>${product.price.toFixed(2)})`;
        productSelect.appendChild(option);
    });
}

function populateBuyerDropdown() {
    const buyerSelect = document.getElementById('buyer-select');
    buyerSelect.innerHTML = '<option value="">Select Buyer</option>';
    buyers.forEach((buyer, index) => {
        const option = document.createElement('option');
        option.value = index; // Use index as value
        option.textContent = buyer.name;
        buyerSelect.appendChild(option);
    });
}

function addProductToInvoice() {
    const productSelect = document.getElementById('product-select');
    const quantityInput = document.getElementById('product-quantity');
    const selectedIndex = productSelect.value;
    const quantity = parseInt(quantityInput.value);

    if (selectedIndex !== "" && !isNaN(quantity) && quantity > 0) {
        const selectedProduct = products[selectedIndex];
        const existingItemIndex = invoiceItems.findIndex(item => item.name === selectedProduct.name);

        if (existingItemIndex !== -1) {
            invoiceItems[existingItemIndex].quantity += quantity;
            invoiceItems[existingItemIndex].total = invoiceItems[existingItemIndex].price * invoiceItems[existingItemIndex].quantity;
        } else {
            invoiceItems.push({
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: quantity,
                total: selectedProduct.price * quantity
            });
        }
        renderInvoiceItems();
        quantityInput.value = 1; // Reset quantity
        productSelect.selectedIndex = 0; // Reset product selection
    } else {
        alert('Please select a product and enter a valid quantity.');
    }
}

function removeInvoiceItem(index) {
    invoiceItems.splice(index, 1);
    renderInvoiceItems();
}

function renderInvoiceItems() {
    const invoiceBody = document.getElementById('invoice-body');
    const invoiceTotalElement = document.getElementById('invoice-total');
    invoiceBody.innerHTML = '';
    let totalAmount = 0;

    invoiceItems.forEach((item, index) => {
        const row = invoiceBody.insertRow();
        const nameCell = row.insertCell();
        const priceCell = row.insertCell();
        const quantityCell = row.insertCell();
        const totalCell = row.insertCell();
        const actionCell = row.insertCell();

        nameCell.textContent = item.name;
        priceCell.textContent = `$${item.price.toFixed(2)}`;
        quantityCell.textContent = item.quantity;
        totalCell.textContent = `$${item.total.toFixed(2)}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeInvoiceItem(index);
        actionCell.appendChild(removeButton);

        totalAmount += item.total;
    });

    invoiceTotalElement.textContent = `Total: $${totalAmount.toFixed(2)}`;
}

function generateInvoice() {
    const buyerSelect = document.getElementById('buyer-select');
    const selectedBuyerIndex = buyerSelect.value;
    const previewBuyerName = document.getElementById('preview-buyer-name');
    const previewBuyerAddress = document.getElementById('preview-buyer-address');
    const previewInvoiceBody = document.getElementById('preview-invoice-body');
    const previewInvoiceTotal = document.getElementById('preview-invoice-total');
    const invoicePreview = document.getElementById('invoice-preview');

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
        priceCell.textContent = `$${item.price.toFixed(2)}`;
        quantityCell.textContent = item.quantity;
        totalCell.textContent = `$${item.total.toFixed(2)}`;

        totalAmount += item.total;
    });

    previewInvoiceTotal.textContent = `Total: $${totalAmount.toFixed(2)}`;
    invoicePreview.style.display = 'block';
}

function saveInvoice() {
    const buyerSelect = document.getElementById('buyer-select');
    const selectedBuyerIndex = buyerSelect.value;
    const currentBuyer = selectedBuyerIndex !== "" ? buyers[selectedBuyerIndex] : null;

    const invoiceData = {
        buyer: currentBuyer,
        items: invoiceItems
    };
    localStorage.setItem('currentInvoice', JSON.stringify(invoiceData));
    alert('Invoice data saved locally.');
}

function loadInvoice() {
    const savedData = localStorage.getItem('currentInvoice');
    if (savedData) {
        const invoiceData = JSON.parse(savedData);
        if (invoiceData.buyer) {
            const buyerIndex = buyers.findIndex(buyer => buyer.name === invoiceData.buyer.name && buyer.address === invoiceData.buyer.address);
            if (buyerIndex !== -1) {
                document.getElementById('buyer-select').value = buyerIndex;
            } else {
                document.getElementById('buyer-select').selectedIndex = 0;
                alert('Buyer from saved invoice not found in current buyer list.');
            }
        } else {
            document.getElementById('buyer-select').selectedIndex = 0;
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
        if (invoiceData.buyer) {
            const buyerIndex = buyers.findIndex(buyer => buyer.name === invoiceData.buyer.name && buyer.address === invoiceData.buyer.address);
            if (buyerIndex !== -1) {
                document.getElementById('buyer-select').value = buyerIndex;
            }
        }
    }
}


function sendInvoice() {
    alert('Sending as PDF functionality would typically involve a server-side component or a client-side PDF generation library (like jsPDF) which needs to be integrated.');
    // In a real-world scenario, you would:
    // 1. Use a library like jsPDF to generate a PDF from the invoice data.
    // 2. Potentially use the browser's `fetch` API to send the PDF data to a server for email sending.
}