let buyers = loadBuyers();
renderBuyers();

function loadBuyers() {
    const storedBuyers = localStorage.getItem('buyers');
    return storedBuyers ? JSON.parse(storedBuyers) : [];
}

function saveBuyers() {
    localStorage.setItem('buyers', JSON.stringify(buyers));
}

function addBuyer() {
    const nameInput = document.getElementById('new-buyer-name');
    const addressInput = document.getElementById('new-buyer-address');
    const name = nameInput.value.trim();
    const address = addressInput.value.trim();

    if (name && address) {
        buyers.push({ name, address });
        saveBuyers();
        renderBuyers();
        nameInput.value = '';
        addressInput.value = '';
    } else {
        alert('Please enter a valid buyer name and address.');
    }
}

function deleteBuyer(index) {
    if (confirm('Are you sure you want to delete this buyer?')) {
        buyers.splice(index, 1);
        saveBuyers();
        renderBuyers();
        // Optionally, update the buyer list on the main invoice page if it's open
        if (window.opener && !window.opener.closed && window.opener.document.getElementById('buyer-select')) {
            window.opener.populateBuyerDropdown();
        }
    }
}

function renderBuyers() {
    const buyerBody = document.getElementById('buyer-body');
    buyerBody.innerHTML = '';
    buyers.forEach((buyer, index) => {
        const row = buyerBody.insertRow();
        const nameCell = row.insertCell();
        const addressCell = row.insertCell();
        const actionCell = row.insertCell();

        nameCell.textContent = buyer.name;
        addressCell.textContent = buyer.address;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteBuyer(index);
        actionCell.appendChild(deleteButton);
    });
}