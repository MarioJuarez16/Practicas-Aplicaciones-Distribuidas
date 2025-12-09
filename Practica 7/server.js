// Importamos Express para crear el servidor web
const express = require('express');

// Axios nos permite hacer peticiones HTTP a la API externa
const axios = require('axios');

// Morgan sirve para mostrar en consola un log sencillo de cada petición
const morgan = require('morgan');

// Creamos la aplicación Express
const app = express();

// Activamos el logger de peticiones
app.use(morgan('tiny'));

// Puerto donde escuchará el servidor (3000 por defecto)
const PORT = process.env.PORT || 3000;


// -----------------------------
//        CACHE LOCAL
// -----------------------------
// Aquí guardamos temporalmente la última tasa consultada
// para no estar pidiéndola a la API cada vez (ahorra tiempo y evita bloqueos)
let cache = {
  gbp_mxn: null, // Guardará { value: {base,buy,sell}, ts: timestamp }
};

// Tiempo de vida del caché (TTL): 60 segundos por defecto
const TTL_MS = parseInt(process.env.CACHE_TTL_MS || '60000', 10);



// ----------------------------------------------------------------
// Función que calcula los precios de compra y venta (-10%, +10%)
// ----------------------------------------------------------------
function computePrices(base) {
  // base viene siendo el MXN por 1 GBP (Libra Esterlina)
  const baseFixed = +base.toFixed(6);

  // Precio de compra → restamos 10%
  const buy = +(base * 0.9).toFixed(6);

  // Precio de venta → aumentamos 10%
  const sell = +(base * 1.1).toFixed(6);

  return { base: baseFixed, buy, sell };
}



// --------------------------------------------------------------------------------
// Función que obtiene la tasa GBP→MXN desde la API exchangerate.host (sin API key)
// --------------------------------------------------------------------------------
async function fetchFromExchangerateHost() {
  // Endpoint oficial para obtener tasas
  const url = 'https://api.exchangerate.host/latest?base=GBP&sxymbols=MXN';

  // Pedimos la información con un timeout de 8 segundos
  const resp = await axios.get(url, { timeout: 8000 });

  // Validamos que la respuesta venga bien estructurada
  if (!resp.data || !resp.data.rates || typeof resp.data.rates.MXN !== 'number') {
    throw new Error('Unexpected API response shape'); // Por si cambia la estructura
  }

  // Calculamos base, buy, sell
  return computePrices(resp.data.rates.MXN);
}



// ---------------------------------------------------------------------------
// Función principal: primero revisa el caché y si está vigente lo devuelve.
// Si no, pide a la API y actualiza el caché.
// ---------------------------------------------------------------------------
async function getGbpMxn() {
  const now = Date.now(); // Tiempo actual
  const cached = cache.gbp_mxn;

  // ↪ Si hay datos en caché y tienen menos de TTL_MS, devolvemos esos
  if (cached && (now - cached.ts) < TTL_MS) {
    return cached.value;
  }

  // ↪ Si no hay caché o ya expiró: consultamos API real
  const value = await fetchFromExchangerateHost();

  // Guardamos en caché
  cache.gbp_mxn = {
    value,
    ts: now, // Timestamp de almacenamiento
  };

  return value;
}



// -----------------------------------------------
//           ENDPOINT: /gbp
// Devuelve base, buy y sell en un solo JSON
// -----------------------------------------------
app.get('/gbp', async (req, res) => {
  try {
    const data = await getGbpMxn(); // obtiene {base,buy,sell}
    res.json(data);
  } catch (err) {
    console.error('Error /gbp:', err.message);
    res.status(500).json({
      error: 'Failed to fetch rate',
      detail: err.message
    });
  }
});



// -----------------------------------------------
//           ENDPOINT: /gbp/buy
// Devuelve solo el precio de compra (buy)
// -----------------------------------------------
app.get('/gbp/buy', async (req, res) => {
  try {
    const { buy } = await getGbpMxn();
    res.json({ buy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// -----------------------------------------------
//           ENDPOINT: /gbp/sell
// Devuelve solo el precio de venta (sell)
// -----------------------------------------------
app.get('/gbp/sell', async (req, res) => {
  try {
    const { sell } = await getGbpMxn();
    res.json({ sell });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// --------------------------------------------------------
//        Arrancamos el servidor API
// --------------------------------------------------------
app.listen(PORT, () => {
  console.log(`FX API server listening on http://localhost:${PORT}`);
});
