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
            text-align: center;
            background-color: #f4f4f4;
        }
        header {
            background-color: #333;
            color: #fff;
            padding: 10px 0;
        }
        header img {
            width: 150px;
        }
        .container {
            max-width: 1000px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .products {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
        .product {
            margin: 20px;
            text-align: center;
        }
        .product img {
            width: 200px;
            height: auto;
        }
        .order-form {
            margin-top: 30px;
        }
        .order-form input, .order-form select {
            padding: 10px;
            margin: 10px 0;
            width: calc(100% - 22px);
        }
        .order-form button {
            padding: 10px 20px;
            background-color: #333;
            color: #fff;
            border: none;
            cursor: pointer;
        }
        .order-form button:hover {
            background-color: #555;
        }
        #orderSlip {
            display: none;
            margin-top: 20px;
            text-align: left;
            padding: 10px;
            border: 1px solid #ddd;
            background-color: #fff;
        }
    </style>
</head>
<body>
    <header>
        <img src="img/logo.png" alt="Ray Foods Logo">
    </header>
    <div class="container">
        <h1>Welcome to Ray Foods</h1>
        <p>Quality cattle food for your farm.</p>
        <div class="products">
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
        <div class="order-form" id="orderForm">
            <h2>Order Form</h2>
            <form id="orderFormElement">
                <input type="text" id="name" name="name" placeholder="Your Name" required>
                <input type="tel" id="phone" name="phone" placeholder="Your Phone Number" required>
                <input type="hidden" id="product" name="product" required>
                <input type="number" id="quantity" name="quantity" placeholder="Quantity" min="1" max="9999" required>
                <button type="submit">Place Order</button>
            </form>
        </div>
        <div id="orderSlip">
            <h2>Order Slip</h2>
            <div id="slipDetails"></div>
        </div>
    </div>
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
                const response = await fetch('https://script.google.com/macros/s/AKfycbxrsJWaajjri_nmFEwbX2WzVh1u9yEr4o9r61u-wsNVPXYNisSAgLifU_yHCsQIrF_K1A/exec', {
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
                alert('There was an error submitting your order. Please try again.');
            }
        });
    </script>
</body>
</html>
