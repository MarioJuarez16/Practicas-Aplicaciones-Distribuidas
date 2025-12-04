const express = require("express");
const axios = require("axios");
const app = express();

// -----------------------------------------------------
// FUNCIÓN: Obtener tipo de cambio MXN → GBP desde HTML
// -----------------------------------------------------
async function getLibraDesdeMXN() {
  const url = "https://themoneyconverter.com/MXN/GBP";  // <- IMPORTANTE: MXN → GBP
  const response = await axios.get(url);
  const html = response.data;

  const startText = "1 MXN =";
  const endText = "GBP";

  const startIndex = html.indexOf(startText);
  if (startIndex === -1) return null;

  const valueStart = startIndex + startText.length;
  const endIndex = html.indexOf(endText, valueStart);
  if (endIndex === -1) return null;

  let rawValue = html.substring(valueStart, endIndex).trim();
  rawValue = rawValue.replace(/[^0-9.,]/g, "");

  // Convertir el valor a número
  const valorNumerico = parseFloat(rawValue.replace(",", ""));

  return valorNumerico; // 1 MXN en GBP
}

// -----------------------------------------------------
// RUTA: Prueba del servidor
// -----------------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando" });
});

// -----------------------------------------------------
// RUTA: Obtener solo el valor 1 MXN → GBP
// -----------------------------------------------------
app.get("/getMXNtoGBP", async (req, res) => {
  const valor = await getLibraDesdeMXN();

  if (!valor) {
    return res.status(500).json({
      message: "Error al obtener el valor desde MXN a GBP"
    });
  }

  res.json({
    descripcion: "Valor de 1 MXN en GBP",
    mxn_to_gbp: valor
  });
});

// -----------------------------------------------------
// RUTA: Convertir LIBRAS → PESOS usando MXN→GBP
// -----------------------------------------------------
// Si 1 MXN = X GBP, entonces:
// 1 GBP = 1 / X MXN
// Y si tienes L libras: L * (1 / X)
app.get("/convertirGBPtoMXN", async (req, res) => {
  const libras = parseFloat(req.query.gbp);

  if (isNaN(libras)) {
    return res.status(400).json({
      message: "Debes enviar un valor numérico en 'gbp'. Ejemplo: /convertirGBPtoMXN?gbp=20"
    });
  }

  const tasaMXNtoGBP = await getLibraDesdeMXN();
  if (!tasaMXNtoGBP) {
    return res.status(500).json({
      message: "No se pudo obtener la tasa actual MXN→GBP"
    });
  }

  // Cálculo
  const gbpToMXN = libras / tasaMXNtoGBP;

  res.json({
    descripcion: "Conversión de GBP a MXN usando la tasa real MXN→GBP",
    libras_ingresadas: libras,
    tasa_mxn_a_gbp: tasaMXNtoGBP,
    resultado_mxn: gbpToMXN.toFixed(4)
  });
});

// -----------------------------------------------------
// Iniciar servidor
// -----------------------------------------------------
app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
