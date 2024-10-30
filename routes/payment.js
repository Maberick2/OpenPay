import express from 'express';
import fetch from 'node-fetch'; // Asegúrate de tener node-fetch instalado
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/process', async (req, res) => {
    const { token_id, amount } = req.body;

    // Validar los datos de entrada
    if (!token_id || !amount) {
        return res.status(400).json({ error: 'Datos de pago incompletos' });
    }

    try {
        // Lógica para procesar el pago con OpenPay
        const response = await fetch(`https://sandbox.openpay.mx/v1/${process.env.OPENPAY_MERCHANT_ID}/charges`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${process.env.OPENPAY_PRIVATE_KEY}:`).toString('base64')}`
            },
            body: JSON.stringify({
                token_id,
                amount,
                description: 'Descripción del pago',
                order_id: '1234' // Puedes añadir un ID de orden si es necesario
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Manejar el error según la respuesta de OpenPay
            return res.status(response.status).json({ error: data.description });
        }

        // Responder con éxito si todo está bien
        res.json({ success: true, message: 'Pago procesado con éxito', data });
    } catch (error) {
        // Manejo de errores generales
        console.error('Error al procesar el pago:', error);
        res.status(500).json({ error: 'Error interno al procesar el pago' });
    }
});

// Exportar el router como exportación por defecto
export default router;
