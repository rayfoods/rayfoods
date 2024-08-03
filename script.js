// Firebase configuration
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

// Initialize Firebase
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

    database.ref('orders/' + orderNumber).set(orderData)
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
