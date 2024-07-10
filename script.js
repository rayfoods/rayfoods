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
    </style>
    <!-- Include Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js"></script>
    <script>
        // Your Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBMoiFP-9cX_fvxqTch9HQ99DQHmnwevoQ",
            authDomain: "rayfoodsorders.firebaseapp.com",
            databaseURL: "https://rayfoodsorders-default-rtdb.firebaseio.com",
            projectId: "rayfoodsorders",
            storageBucket: "rayfoodsorders.appspot.com",
            messagingSenderId: "372992480542",
            appId: "1:372992480542:web:335e9f2c5fa0fd04f8a50f",
            measurementId: "G-2EP1CX8717"
        };
        
        // Initialize Firebase
        const app = firebase.initializeApp(firebaseConfig);
        const database = firebase.database(app);
    </script>
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
        <div class="order-form" id="orderForm" style="display: none;">
            <h2>Order Form</h2>
            <form id="orderFormElement">
                <input type="text" id="name" placeholder="Your Name" required>
                <input type="tel" id="phone" placeholder="Your Phone Number" required>
                <input type="hidden" id="product" value="">
                <input type="number" id="quantity" placeholder="Quantity" min="1" max="9999" required>
                <button type="submit">Place Order</button>
            </form>
        </div>
        <div id="orderSlip" style="display: none;">
            <h2>Order Slip</h2>
            <div id="slipDetails"></div>
        </div>
    </div>
    <script>
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
            const orderNumber = 100000000000 - Math.floor(Math.random() * 100000);
            const date = new Date().toLocaleString();
            const slip = `
                <div style="width: 500px; margin: auto; padding: 20px; text-align: center;">
                    <div style="position: relative; width: 100%; height: 500px;">
                        <img src="img/logo.png" alt="Ray Foods Logo" style="width: 100%; height: 100%; opacity: 0.2; position: absolute; top: 0; left: 0; z-index: -1;">
                        <h1 style="font-size: 50px; color: #333;">Order Slip</h1>
                        <p style="font-size: 24px; color: #333;">Order Number: ${orderNumber}</p>
                        <p style="font-size: 24px; color: #333;">Date: ${date}</p>
                        <p style="font-size: 24px; color: #333;">Name: ${name}</p>
                        <p style="font-size: 24px; color: #333;">Phone: ${phone}</p>
                        <p style="font-size: 24px; color: #333;">Product: ${product}</p>
                        <p style="font-size: 24px; color: #333;">Quantity: ${quantity}</p>
                    </div>
                </div>
            `;
            const newWindow = window.open('', '', 'width=600,height=400');
            newWindow.document.write(slip);
            newWindow.document.close();
            newWindow.print();

            // Store order data in Firebase
            const orderData = {
                name,
                phone,
                product,
                quantity,
                orderNumber,
                date
            };
            firebase.database().ref('orders/' + orderNumber).set(orderData)
            .then(() => {
                alert('Order submitted successfully!');
                document.getElementById('orderForm').style.display = 'none'; // Hide form after submission
                document.getElementById('orderFormElement').reset(); // Reset form fields
                document.getElementById('orderSlip').style.display = 'none'; // Hide order slip section
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting your order. Please try again.');
            });
        });
    </script>
</body>
</html>
