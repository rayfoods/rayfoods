const scriptURL = 'https://script.google.com/macros/s/AKfycbyar30DQyAndHYC2ZMNYJb5i3Bn6b4u1mEjKh6JmFwF/dev';

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

    orderNumber--;

    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();

    const orderSlipDetails = `
        Order Number: ${orderNumber}\n
        Name: ${name}\n
        Product: ${product}\n
        Quantity: ${quantity}\n
        Date: ${currentDate}\n
        Time: ${currentTime}
    `;

    document.getElementById('orderSlip').style.display = 'block';
    document.getElementById('slipDetails').innerHTML = orderSlipDetails.replace(/\n/g, '<br>');

    const logoImage = new Image();
    logoImage.src = 'images/logo.png';
    logoImage.onload = function() {
        const { jsPDF } = window.jspdf;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = logoImage.width;
        canvas.height = logoImage.height;

        ctx.globalAlpha = 0.2;
        ctx.drawImage(logoImage, 0, 0, logoImage.width, logoImage.height);

        const imgData = canvas.toDataURL('image/png');

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [logoImage.width, logoImage.height]
        });

        doc.addImage(imgData, 'PNG', 0, 0, logoImage.width, logoImage.height);
        doc.setFontSize(74);
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(orderSlipDetails, logoImage.width - 40);
        doc.text(lines, 20, 60);

        doc.save(`OrderSlip_${orderNumber}.pdf`);
    };

    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, phone, product, quantity, orderNumber, currentDate, currentTime })
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
