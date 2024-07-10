<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ray Foods Order Form</title>
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
        <img src="images/logo.png" alt="Ray Foods Logo" class="logo">
    </header>
    <section>
        <h1>Order Your Food</h1>
        <div class="product-container">
            <div class="product">
                <img src="images/product1.jpg" alt="Product 1">
                <h2>Product 1</h2>
                <button onclick="showOrderForm('Product 1')">Order Now</button>
            </div>
            <div class="product">
                <img src="images/product2.jpg" alt="Product 2">
                <h2>Product 2</h2>
                <button onclick="showOrderForm('Product 2')">Order Now</button>
            </div>
        </div>
    </section>
    <section id="orderForm" style="display: none;">
        <h2>Order Form</h2>
        <form id="orderFormElement">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <br>
            <label for="phone">Phone:</label>
            <input type="text" id="phone" name="phone" required>
            <br>
            <label for="product">Product:</label>
            <input type="text" id="product" name="product" readonly required>
            <br>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" required>
            <br>
            <button type="submit">Submit Order</button>
        </form>
    </section>
    <section id="orderSlip" style="display: none;">
        <h2>Order Slip</h2>
        <div id="slipDetails"></div>
    </section>
    <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-database.js"></script>
    <script>
        const firebaseConfig = {
            apiKey: "AIzaSyBMoiFP-9cX_fvxqTch9HQ99DQHmnwevoQ",
            authDomain: "rayfoodsorders.firebaseapp.com",
            projectId: "rayfoodsorders",
            storageBucket: "rayfoodsorders.appspot.com",
            messagingSenderId: "372992480542",
            appId: "1:372992480542:web:335e9f2c5fa0fd04f8a50f",
            measurementId: "G-2EP1CX8717",
            databaseURL: "https://rayfoodsorders-default-rtdb.firebaseio.com/"
        };

        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

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

            const orderData = {
                name,
                phone,
                product,
                quantity,
                orderNumber,
                currentDate,
                currentTime
            };

            firebase.database().ref('orders/' + orderNumber).set(orderData)
            .then(() => {
                alert('Order submitted successfully!');
                document.getElementById('orderForm').style.display = 'none';
                document.getElementById('orderFormElement').reset();
                document.getElementById('orderSlip').style.display = 'block';
                const slipDetails = `
                    Order Number: ${orderNumber}<br>
                    Name: ${name}<br>
                    Phone: ${phone}<br>
                    Product: ${product}<br>
                    Quantity: ${quantity}<br>
                    Date: ${currentDate}<br>
                    Time: ${currentTime}
                `;
                document.getElementById('slipDetails').innerHTML = slipDetails;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting your order. Please try again.');
            });
        });
    </script>
</body>
</html>
