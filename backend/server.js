const express = require('express');
const mongoose = require('mongoose');
const contactRoutes = require('./routes/contactRoutes');
const logger = require('./middleware/logger');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Conexión a MongoDB Atlas sin opciones obsoletas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error al conectar MongoDB:', err));

app.use('/api/contacts', contactRoutes);

// Ruta para consumir API externa (ejemplo chistes)
app.get('/api/joke', async (req, res) => {
try {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    const joke = await response.json();
    res.json(joke);
} catch (error) {
    res.status(500).json({ error: 'Error obteniendo chiste' });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
