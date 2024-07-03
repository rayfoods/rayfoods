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

    // Decrease the order number for each new order
    orderNumber--;

    // Get the current date and time
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();

    // Prepare form data to send to Google Apps Script
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('product', product);
    formData.append('quantity', quantity);
    formData.append('orderNumber', orderNumber);
    formData.append('currentDate', currentDate);
    formData.append('currentTime', currentTime);

    // Google Apps Script URL
    const url = 'https://script.google.com/macros/s/AKfycbyar30DQyAndHYC2ZMNYJb5i3Bn6b4u1mEjKh6JmFwF/exec';

    // Send data to Google Apps Script
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        
        // Display order slip details
        const orderSlipDetails = `
            Order Number: ${data.orderNumber}<br>
            Name: ${name}<br>
            Phone: ${phone}<br>
            Product: ${product}<br>
            Quantity: ${quantity}<br>
            Date: ${currentDate}<br>
            Time: ${currentTime}
        `;
        document.getElementById('orderSlip').style.display = 'block';
        document.getElementById('slipDetails').innerHTML = orderSlipDetails;

        // Load the logo image and create the PDF
        const logoImage = new Image();
        logoImage.src = 'img/logo.png'; // Ensure this path is correct
        logoImage.onload = function() {
            const { jsPDF } = window.jspdf;

            // Create a canvas to adjust the logo image opacity
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = logoImage.width;
            canvas.height = logoImage.height;

            // Draw the image on the canvas with reduced opacity
            ctx.globalAlpha = 0.2; // Set opacity to 20%
            ctx.drawImage(logoImage, 0, 0, logoImage.width, logoImage.height);

            // Get the modified image data URL
            const imgData = canvas.toDataURL('image/png');

            // Create a new PDF with the same dimensions as the logo
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [logoImage.width, logoImage.height]
            });

            // Add the modified logo image as the background
            doc.addImage(imgData, 'PNG', 0, 0, logoImage.width, logoImage.height);

            // Add the text over the image
            doc.setFontSize(24); // Adjust font size
            doc.setTextColor(0, 0, 0); // Set text color to black
            const lines = doc.splitTextToSize(orderSlipDetails, logoImage.width - 40); // Wrap text to fit the image width
            doc.text(lines, 20, 100); // Adjust the position as needed

            // Save the PDF
            doc.save(`OrderSlip_${data.orderNumber}.pdf`);
        };

        // Hide the order form after submission
        document.getElementById('orderForm').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your order. Please try again.');
    });
});

