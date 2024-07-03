let orderNumber = 100000000000;

function showOrderForm(productName) {
    document.getElementById('orderForm').style.display = 'block';
    document.getElementById('product').value = productName;
}

document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const product = document.getElementById('product').value;
    const quantity = document.getElementById('quantity').value;
    
    // Google Sheets URL and Sheet Name
    const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
    const sheetName = 'Sheet1'; // Replace with your sheet name
    
    // Decrease the order number for each new order
    orderNumber--;

    // Get the current date and time
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();

    // Prepare data to be sent to Google Sheets
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('product', product);
    formData.append('quantity', quantity);
    formData.append('orderNumber', orderNumber);
    formData.append('date', currentDate);
    formData.append('time', currentTime);

    // Send data to Google Sheets via Google Apps Script
    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // Display success message
        if (response.status === 200) {
            alert('Order submitted successfully!');
            document.getElementById('orderForm').style.display = 'none';
            document.getElementById('orderSlip').style.display = 'block';
            const orderSlipDetails = `
                Order Number: ${orderNumber}<br>
                Name: ${name}<br>
                Phone: ${phone}<br>
                Product: ${product}<br>
                Quantity: ${quantity}<br>
                Date: ${currentDate}<br>
                Time: ${currentTime}
            `;
            document.getElementById('slipDetails').innerHTML = orderSlipDetails;
        } else {
            alert('Error submitting order. Please try again later.');
        }
    })
    .catch(error => console.error('Error:', error));
});
