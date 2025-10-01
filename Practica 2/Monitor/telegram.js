// monitor-telegram.js - Monitor de Temperatura con Notificación por Telegram
const axios = require('axios');

// Configuración
const CONFIG = {
    servicioURL: 'http://localhost:3000/api/temperatura',
    intervalo: 1000, // 5 segundos
    umbralTemperatura: 30,
    vecesConsecutivas: 3
};

// Configuración de Telegram
const TELEGRAM_CONFIG = {
    botToken: '8228737440:AAFBm95ANEaXHgf9qfWR1q2UwG3340Hrcfk', // Cambia esto
    chatId: '7293526371' // Cambia esto
};

// Variables de estado
let contadorAltas = 0;
let historialTemperaturas = [];
let alertaEnviada = false;

// Función para enviar mensaje por Telegram
async function enviarTelegram(temperaturas) {
    const mensaje = `
🚨 *ALERTA DE TEMPERATURA*

⚠️ Se han detectado *3 temperaturas consecutivas* superiores a ${CONFIG.umbralTemperatura}°C

📊 *Temperaturas registradas:*
${temperaturas.map((t, i) => `  ${i + 1}. ${t}°C`).join('\n')}

🕐 Timestamp: ${new Date().toLocaleString()}
    `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    try {
        await axios.post(url, {
            chat_id: TELEGRAM_CONFIG.chatId,
            text: mensaje,
            parse_mode: 'Markdown'
        });
        console.log('✅ Mensaje de Telegram enviado correctamente');
    } catch (error) {
        console.error('❌ Error al enviar mensaje de Telegram:', error.message);
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

    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] 🌡️  Temperatura: ${temperatura}°C`);
    
    // Verificar si supera el umbral
    if (temperatura > CONFIG.umbralTemperatura) {
        contadorAltas++;
        historialTemperaturas.push(temperatura);
        console.log(`⚠️  Temperatura alta detectada (${contadorAltas}/${CONFIG.vecesConsecutivas})`);
        
        // Si alcanzamos 3 veces consecutivas
        if (contadorAltas >= CONFIG.vecesConsecutivas && !alertaEnviada) {
            console.log('🚨 ¡ALERTA! 3 temperaturas altas consecutivas');
            await enviarTelegram(historialTemperaturas.slice(-3));
            alertaEnviada = true;
        }
    } else {
        // Reset si la temperatura baja
        if (contadorAltas > 0) {
            console.log('✅ Temperatura normalizada - contador reiniciado');
        }
        contadorAltas = 0;
        historialTemperaturas = [];
        alertaEnviada = false;
    }
}

// Iniciar monitoreo
console.log('🤖 Monitor de temperatura con Telegram iniciado');
console.log(`📊 Consultando cada ${CONFIG.intervalo/1000} segundos`);
console.log(`🔥 Umbral: ${CONFIG.umbralTemperatura}°C (${CONFIG.vecesConsecutivas} veces consecutivas)\n`);

// Primera ejecución
monitorear();

// Ejecuciones periódicas
setInterval(monitorear, CONFIG.intervalo);