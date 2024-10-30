document.getElementById('paymentForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    const token_id = await getTokenFromOpenPay(); // Llama a la función para obtener el token
    const amount = document.getElementById('amount').value;

    // Asegúrate de que se obtuvo un token
    if (!token_id) {
        alert('Error al obtener el token de la tarjeta.');
        return;
    }

    const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token_id, amount }),
    });

    const data = await response.json();

    if (data.error) {
        alert('Error: ' + data.error);
    } else {
        alert('Pago procesado: ' + JSON.stringify(data));
    }
});

// Función para obtener el token de OpenPay
async function getTokenFromOpenPay() {
    const cardNumber = document.getElementById('cardNumber').value;
    const expirationDate = document.getElementById('expirationDate').value;
    const cvv = document.getElementById('cvv').value;

    // Crear un objeto de la tarjeta
    const cardData = {
        card_number: cardNumber,
        holder_name: 'Nombre del Titular', // Cambia esto por el nombre del titular
        expiration_year: expirationDate.split('/')[1], // Año de expiración
        expiration_month: expirationDate.split('/')[0], // Mes de expiración
        cvv: cvv,
    };

    try {
        const response = await fetch(`https://sandbox.openpay.mx/v1/${process.env.OPENPAY_MERCHANT_ID}/tokens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${process.env.OPENPAY_PRIVATE_KEY}:`).toString('base64')}`,
            },
            body: JSON.stringify(cardData),
        });

        const data = await response.json();

        if (data.error) {
            alert('Error al crear el token: ' + data.error.message);
            return null; // Devuelve null si hay un error
        }

        return data.id; // Retorna el token ID
    } catch (error) {
        console.error('Error al obtener el token de OpenPay:', error);
        return null; // Devuelve null en caso de un error de red
    }
}
