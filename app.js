import express from 'express';
import paymentRoutes from './routes/payment.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config(); // Cargar las variables de entorno

// Definir __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Configurar la carpeta 'public' para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usar las rutas de pago en '/api/payment'
app.use('/api/payment', paymentRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
