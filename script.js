// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuRSgzMgCuf3kGPwwzyVQGyLqQ3bVSi8A",
    authDomain: "rayfood-60514.firebaseapp.com",
    projectId: "rayfood-60514",
    storageBucket: "rayfood-60514.appspot.com",
    messagingSenderId: "301733056070",
    appId: "1:301733056070:web:75bf3134524f4ae1478447",
    measurementId: "G-JKK282PCRY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

    // Load the logo image and create the PDF
    const logoImage = new Image();
    logoImage.src = 'images/logo.png'; // Ensure this path is correct
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

    // Save order to Firestore
    db.collection('orders').add({
        name: name,
        product: product,
        quantity: quantity,
        orderNumber: orderNumber,
        date: currentDate,
        time: currentTime
    })
    .then(function() {
        alert('Order submitted successfully!');
        document.getElementById('orderForm').style.display = 'none';
    })
    .catch(function(error) {
        console.error('Error adding order: ', error);
    });
});
