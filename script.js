const scriptURL = 'https://script.google.com/macros/s/AKfycbxrsJWaajjri_nmFEwbX2WzVh1u9yEr4o9r61u-wsNVPXYNisSAgLifU_yHCsQIrF_K1A/exec';

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
    const orderData = {
        name: name,
        phone: phone,
        product: product,
        quantity: quantity,
        orderNumber: orderNumber,
        currentDate: currentDate,
        currentTime: currentTime
    };

    // Display the order slip
    const slipDetails = `
        Order Number: ${orderNumber}<br>
        Name: ${name}<br>
        Product: ${product}<br>
        Quantity: ${quantity}<br>
        Date: ${currentDate}<br>
        Time: ${currentTime}
    `;
    document.getElementById('orderSlip').style.display = 'block';
    document.getElementById('slipDetails').innerHTML = slipDetails;

    // Send order data to the server
    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (response.ok) {
            alert('Order submitted successfully!');
            document.getElementById('orderFormElement').reset();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => alert('There was an error submitting your order. Please try again.'));
});

