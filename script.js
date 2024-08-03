let orderNumber = 100000000000;

function showOrderForm(productName) {
    document.getElementById('orderForm').style.display = 'block';
    document.getElementById('product').value = productName;
}

document.getElementById('orderFormElement').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
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
        Order Number: ${orderNumber}<br>
        Name: ${name}<br>
        Phone: ${phone}<br>
        Product: ${product}<br>
        Quantity: ${quantity}<br>
        Date: ${currentDate}<br>
        Time: ${currentTime}
    `;

    // Display the order slip
    document.getElementById('orderSlip').style.display = 'block';
    document.getElementById('slipDetails').innerHTML = orderSlipDetails;

    // Hide the order form after submission
    document.getElementById('orderForm').style.display = 'none';
});
