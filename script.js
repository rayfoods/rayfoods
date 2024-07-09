<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ray Foods</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        header {
            background: #f4f4f4;
            padding: 20px;
            text-align: center;
        }

        header img.logo {
            width: 150px;
            height: auto;
        }

        section {
            padding: 20px;
        }

        .product-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .product {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
            text-align: center;
            width: 200px;
        }

        .product img {
            max-width: 100%;
            height: auto;
        }

        #orderForm {
            background: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            margin-top: 20px;
        }

        #orderSlip {
            background: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            margin-top: 20px;
        }

        #slipDetails {
            font-size: 18px;
        }
    </style>
</head>
<body>
    <header>
        <img src="img/logo.png" alt="Ray Foods Logo" class="logo">
    </header>
    <section>
        <h1>Welcome to Ray Foods</h1>
        <p>Quality cattle food for your farm.</p>
        <div class="product-container">
            <div class="product">
                <img src="img/product1.jpg" alt="25KG BAG">
                <h3>25KG BAG</h3>
                <button onclick="showOrderForm('25KG BAG')">Order Now</button>
            </div>
            <div class="product">
                <img src="img/product2.jpg" alt="50KG BAG">
                <h3>50KG BAG</h3>
                <button onclick="showOrderForm('50KG BAG')">Order Now</button>
            </div>
        </div>
        <div id="orderForm" style="display: none;">
            <h2>Order Form</h2>
            <form id="orderFormElement">
                <input type="text" id="name" name="name" placeholder="Your Name" required>
                <input type="tel" id="phone" name="phone" placeholder="Your Phone Number" required>
                <input type="hidden" id="product" name="product" required>
                <input type="number" id="quantity" name="quantity" placeholder="Quantity" min="1" max="9999" required>
                <button type="submit">Place Order</button>
            </form>
        </div>
        <div id="orderSlip" style="display: none;">
            <h2>Order Slip</h2>
            <div id="slipDetails"></div>
        </div>
    </section>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"></script>
    <script>
        let orderNumber = 100000000000;

        function showOrderForm(productName) {
            document.getElementById('orderForm').style.display = 'block';
            document.getElementById('product').value = productName;
        }

        document.getElementById('orderFormElement').addEventListener('submit', async function(event) {
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
                Order Number: ${orderNumber}\n
                Name: ${name}\n
                Phone: ${phone}\n
                Product: ${product}\n
                Quantity: ${quantity}\n
                Date: ${currentDate}\n
                Time: ${currentTime}
            `;

            // Display the order slip
            document.getElementById('orderSlip').style.display = 'block';
            document.getElementById('slipDetails').innerHTML = orderSlipDetails.replace(/\n/g, '<br>');

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
                doc.setFontSize(74); // Increase font size to 74
                doc.setTextColor(0, 0, 0); // Set text color to black
                const lines = doc.splitTextToSize(orderSlipDetails, logoImage.width - 40); // Wrap text to fit the image width
                doc.text(lines, 20, 60); // Adjust the position as needed

                // Save the PDF
                doc.save(`OrderSlip_${orderNumber}.pdf`);
            };

            // Send order data to Google Sheets
            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbxORxNRtVq4W5K2K83xbSCBW0waj0LRM0eaDYJVJ2ceENl7nHfxqHxVxT5KgcQR0z2vIg/exec', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, phone, product, quantity, orderNumber, currentDate, currentTime })
                });
                const result = await response.json();
                if (result.result === 'success') {
                    alert('Order submitted successfully!');
                    document.getElementById('orderForm').style.display = 'none';
                } else {
                    alert('There was an error submitting your order. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('There was an error submitting your order. Please try again.');
            }
        });
    </script>
</body>
</html>


