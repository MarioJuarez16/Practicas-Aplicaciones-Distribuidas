// monitor-discord.js - Monitor de Temperatura con Notificación por Discord
const axios = require('axios');

// Configuración
const CONFIG = {
    servicioURL: 'http://localhost:3000/api/temperatura',
    intervalo: 30000, // 30 segundos
    umbralTemperatura: 39,
    vecesConsecutivas: 3
};

// Configuración de Discord
const DISCORD_CONFIG = {
    webhookURL: 'TU_WEBHOOK_URL_AQUI' // Cambia esto
};

// Variables de estado
let contadorAltas = 0;
let historialTemperaturas = [];
let alertaEnviada = false;

// Función para enviar mensaje por Discord
async function enviarDiscord(temperaturas) {
    const embed = {
        title: '🚨 ALERTA DE TEMPERATURA',
        description: `Se han detectado **3 temperaturas consecutivas** superiores a ${CONFIG.umbralTemperatura}°C`,
        color: 0xff0000, // Rojo
        fields: temperaturas.map((t, i) => ({
            name: `Lectura ${i + 1}`,
            value: `${t}°C`,
            inline: true
        })),
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Monitor de Temperatura'
        }
    };

    try {
        await axios.post(DISCORD_CONFIG.webhookURL, {
            embeds: [embed]
        });
        console.log('✅ Mensaje de Discord enviado correctamente');
    } catch (error) {
        console.error('❌ Error al enviar mensaje de Discord:', error.message);
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
            await enviarDiscord(historialTemperaturas.slice(-3));
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
console.log('💬 Monitor de temperatura con Discord iniciado');
console.log(`📊 Consultando cada ${CONFIG.intervalo/1000} segundos`);
console.log(`🔥 Umbral: ${CONFIG.umbralTemperatura}°C (${CONFIG.vecesConsecutivas} veces consecutivas)\n`);

// Primera ejecución
monitorear();

// Ejecuciones periódicas
setInterval(monitorear, CONFIG.intervalo);