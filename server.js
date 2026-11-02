
const express = require('express');
const cors = require('cors');

const app = express();

// Importar las rutas
const productoRoutes = require('./src/routes/productoRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Configuraciones
app.use(cors());
app.use(express.json());

// Página web
app.use(express.static('public'));

// Rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);

// Ruta de comprobación
app.get('/api/estado', (req, res) => {
    res.status(200).json({
        mensaje: 'API de ModaPlus funcionando correctamente'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`ModaPlus funcionando en el puerto ${PORT}`);
});
