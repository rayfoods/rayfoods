let orderNumber = 100000000000;

function showOrderForm(productName) {
    document.getElementById('orderForm').style.display = 'block';
    document.getElementById('product').value = productName;
}

document.getElementById('orderFormElement').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const product = document.getElementById('product').value;
    const quantity = document.getElementById('quantity').value;

    // Decrease the order number for each new order
    orderNumber--;

    // Get the current date and time
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();

    // Generate the order slip details
    const orderSlipDetails = `
        Order Number: ${orderNumber}\n
        Name: ${name}\n
        Product: ${product}\n
        Quantity: ${quantity}\n
        Date: ${currentDate}\n
        Time: ${currentTime}
    `;

    // Display the order slip
    document.getElementById('orderSlip').style.display = 'block';
    document.getElementById('slipDetails').innerHTML = orderSlipDetails.replace(/\n/g, '<br>');

    // Reset the form and hide it
    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('orderFormElement').reset();

    // Send order data to the server (if needed)
    fetch('https://script.google.com/macros/s/AKfycbxHNcWgPWwRYihUaLRkqOJ73sCZDrQEqiH5NaaSI6vZrYR7rL3mQT6WMS2Wk1CY3HbrwQ/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, product, quantity, orderNumber, currentDate, currentTime })
    })
    .then(response => response.json())
    .then(data => {
        alert('Order submitted successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your order. Please try again.');
    });
});

