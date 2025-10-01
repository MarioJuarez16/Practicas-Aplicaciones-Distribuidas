// monitor-email.js - Monitor de Temperatura con Notificación por Email
const axios = require('axios');
const nodemailer = require('nodemailer');

// Configuración
const CONFIG = {
    servicioURL: 'http://localhost:3000/api/temperatura',
    intervalo: 1000, // 5 segundos para pruebas
    umbralTemperatura: 20,
    vecesConsecutivas: 3
};

// Configuración del email (Gmail)
const EMAIL_CONFIG = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'marioalexisjuarezangui@gmail.com', // ⬅️ CAMBIA ESTO
        pass: 'svdx qduc feyr sqas' // ⬅️ CAMBIA ESTO
    }
};

// Variables de estado
let contadorAltas = 0;
let historialTemperaturas = [];
let alertaEnviada = false;

// Crear transporter de nodemailer
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Función para enviar email
async function enviarEmail(temperaturas) {
    const mailOptions = {
        from: EMAIL_CONFIG.auth.user,
        to: EMAIL_CONFIG.auth.user, // Enviarlo a ti mismo para probar
        subject: '⚠️ ALERTA: Temperatura Alta Detectada',
        html: `
            <h2>🚨 Alerta de Temperatura</h2>
            <p>Se han detectado <strong>3 temperaturas consecutivas</strong> superiores a ${CONFIG.umbralTemperatura}°C</p>
            <h3>Temperaturas registradas:</h3>
            <ul>
                ${temperaturas.map((t, i) => `<li>Lectura ${i + 1}: ${t}°C</li>`).join('')}
            </ul>
            <p><em>Timestamp: ${new Date().toLocaleString()}</em></p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado correctamente');
    } catch (error) {
        console.error('❌ Error al enviar email:', error.message);
    }
}

// Función para obtener temperatura
async function obtenerTemperatura() {
    try {
        const response = await axios.get(CONFIG.servicioURL);
        return response.data.temperatura;
    } catch (error) {
        console.error('❌ Error al obtener temperatura:', error.message);
        return null;
    }
}

// Función principal de monitoreo
async function monitorear() {
    const temperatura = await obtenerTemperatura();
    
    if (temperatura === null) return;

    console.log(`🌡️  Temperatura actual: ${temperatura}°C`);
    
    if (temperatura > CONFIG.umbralTemperatura) {
        contadorAltas++;
        historialTemperaturas.push(temperatura);
        console.log(`⚠️  Temperatura alta (${contadorAltas}/${CONFIG.vecesConsecutivas})`);
        
        if (contadorAltas >= CONFIG.vecesConsecutivas && !alertaEnviada) {
            console.log('🚨 ¡ALERTA! 3 temperaturas altas consecutivas detectadas');
            await enviarEmail(historialTemperaturas.slice(-3));
            alertaEnviada = true;
        }
    } else {
        if (contadorAltas > 0) {
            console.log('✅ Temperatura normalizada - contador reiniciado');
        }
        contadorAltas = 0;
        historialTemperaturas = [];
        alertaEnviada = false;
    }
}

// Iniciar monitoreo
console.log('🔍 Monitor de temperatura iniciado');
console.log(`📊 Consultando cada ${CONFIG.intervalo/1000} segundos`);
console.log(`🔥 Umbral de alerta: ${CONFIG.umbralTemperatura}°C (${CONFIG.vecesConsecutivas} veces consecutivas)\n`);

monitorear();
setInterval(monitorear, CONFIG.intervalo);