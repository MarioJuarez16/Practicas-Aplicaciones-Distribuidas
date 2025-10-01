// server.js - Servicio Web de Temperaturas Aleatorias
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Función para generar número aleatorio entre min y max
function generarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Endpoint para obtener temperatura aleatoria
app.get('/api/temperatura', (req, res) => {
    const temperatura = generarNumeroAleatorio(15, 45);
    
    res.json({
        temperatura: temperatura,
        unidad: '°C',
        timestamp: new Date().toISOString()
    });
});

// Endpoint de prueba
app.get('/', (req, res) => {
    res.send('Servicio de Temperatura Aleatoria activo');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🌡️  Servicio de temperatura ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Endpoint: http://localhost:${PORT}/api/temperatura`);
});