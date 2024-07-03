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

    // Validate form fields
    if (!name || !phone || !product || !quantity) {
        alert('Please fill in all fields.');
        return;
    }

    // Decrease the order number for each new order
    orderNumber--;

    // Prepare data to send to Google Sheets
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('product', product);
    formData.append('quantity', quantity);
    formData.append('orderNumber', orderNumber);

    // Send data to Google Sheets via Google Apps Script web app
    const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Replace with your Google Apps Script URL
    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Order submitted successfully!');
            document.getElementById('orderForm').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an issue submitting your order. Please try again later.');
        });

    // Optionally, reset the form after submission
    document.getElementById('orderForm').reset();
});
