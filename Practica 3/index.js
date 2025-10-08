const express = require('express');
const app = express();
app.use(express.json());

app.post('/saludo', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'Falta el nombre en el cuerpo de la solicitud' });
  }
  res.json({ mensaje: `Hola ${nombre}` });
});



app.post('/calcular', (req, res) => {
  const { a, b, operacion } = req.body;

  if (typeof a !== 'number' || typeof b !== 'number' || typeof operacion !== 'string') {
    return res.status(400).json({ error: 'Parámetros inválidos. Debes enviar { a, b, operacion }' });
  }

  let resultado;

  switch (operacion) {
    case 'suma':
      resultado = a + b;
      break;
    case 'resta':
      resultado = a - b;
      break;
    case 'multiplicacion':
      resultado = a * b;
      break;
    case 'division':
      if (b === 0) {
        return res.status(400).json({ error: 'No se puede dividir entre cero' });
      }
      resultado = a / b;
      break;
    default:
      return res.status(400).json({ error: 'Operación no válida. Usa suma, resta, multiplicacion o division' });
  }

  res.json({ resultado });
});


// ==========================================
// Ejercicio 3: Gestor de Tareas (CRUD)
// ==========================================


let tareas = [];
let contadorId = 1;

// POST /tareas - Crear nueva tarea
app.post('/tareas', (req, res) => {
  const { titulo, completada } = req.body;
  
  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  
  const nuevaTarea = {
    id: contadorId++,
    titulo: titulo,
    completada: completada !== undefined ? completada : false
  };
  
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// GET /tareas - Listar todas las tareas
app.get('/tareas', (req, res) => {
  res.json(tareas);
});

// GET /tareas/:id - Obtener una tarea específica
app.get('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find(t => t.id === id);
  
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  res.json(tarea);
});

// PUT /tareas/:id - Actualizar una tarea
app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, completada } = req.body;
  
  const indice = tareas.findIndex(t => t.id === id);
  
  if (indice === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  if (titulo !== undefined) {
    tareas[indice].titulo = titulo;
  }
  if (completada !== undefined) {
    tareas[indice].completada = completada;
  }
  
  res.json(tareas[indice]);
});

// DELETE /tareas/:id - Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = tareas.findIndex(t => t.id === id);
  
  if (indice === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  const tareaEliminada = tareas.splice(indice, 1);
  res.json({ mensaje: 'Tarea eliminada exitosamente', tarea: tareaEliminada[0] });
});




app.post('/validar-password', (req, res) => {
  const { password } = req.body;
  
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Debes enviar una contraseña válida' });
  }
  
  const errores = [];
  
  // Validar mínimo 8 caracteres
  if (password.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  // Validar al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  // Validar al menos una minúscula
  if (!/[a-z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  // Validar al menos un número
  if (!/[0-9]/.test(password)) {
    errores.push('La contraseña debe contener al menos un número');
  }
  
  const esValida = errores.length === 0;
  
  res.json({
    esValida: esValida,
    errores: errores
  });
});


app.post('/convertir-temperatura', (req, res) => {
  const { valor, desde, hacia } = req.body;
  
  // Validaciones
  if (typeof valor !== 'number') {
    return res.status(400).json({ error: 'El valor debe ser un número' });
  }
  
  if (!desde || !hacia) {
    return res.status(400).json({ error: 'Debes especificar "desde" y "hacia"' });
  }
  
  const escalasValidas = ['C', 'F', 'K'];
  if (!escalasValidas.includes(desde) || !escalasValidas.includes(hacia)) {
    return res.status(400).json({ error: 'Las escalas deben ser C, F o K' });
  }
  
  let valorConvertido;
  
  // Conversiones desde Celsius
  if (desde === 'C' && hacia === 'F') {
    valorConvertido = (valor * 9/5) + 32;
  } else if (desde === 'C' && hacia === 'K') {
    valorConvertido = valor + 273.15;
  }
  // Conversiones desde Fahrenheit
  else if (desde === 'F' && hacia === 'C') {
    valorConvertido = (valor - 32) * 5/9;
  } else if (desde === 'F' && hacia === 'K') {
    valorConvertido = (valor - 32) * 5/9 + 273.15;
  }
  // Conversiones desde Kelvin
  else if (desde === 'K' && hacia === 'C') {
    valorConvertido = valor - 273.15;
  } else if (desde === 'K' && hacia === 'F') {
    valorConvertido = (valor - 273.15) * 9/5 + 32;
  }
  // Misma escala
  else if (desde === hacia) {
    valorConvertido = valor;
  }
  
  // Redondear a 2 decimales
  valorConvertido = Math.round(valorConvertido * 100) / 100;
  
  res.json({
    valorOriginal: valor,
    valorConvertido: valorConvertido,
    escalaOriginal: desde,
    escalaConvertida: hacia
  });
});


// ==========================================
// Ejercicio 6: Búsqueda en Arreglo


// Endpoint POST /buscar
app.post('/buscar', (req, res) => {
  const { array, elemento } = req.body;
  
  // Validar que se reciban ambos parámetros
  if (!array || elemento === undefined) {
    return res.status(400).json({ 
      error: "Faltan parámetros. Se requiere 'array' y 'elemento'" 
    });
  }
  
  // Validar que array sea un arreglo
  if (!Array.isArray(array)) {
    return res.status(400).json({ 
      error: "El parámetro 'array' debe ser un arreglo" 
    });
  }
  
  // Buscar el elemento en el array
  const indice = array.indexOf(elemento);
  const encontrado = indice !== -1;
  
  // Obtener el tipo del elemento
  const tipoElemento = typeof elemento;
  
  // Responder con el formato solicitado
  res.json({
    encontrado: encontrado,
    indice: indice,
    tipoElemento: tipoElemento
  });
});



//Ejercicio 7: Generador de Números Aleatorios

// Endpoint POST /contar-palabras
app.post('/contar-palabras', (req, res) => {
  const { texto } = req.body;
  
  // Validar que se reciba el parámetro texto
  if (texto === undefined || texto === null) {
    return res.status(400).json({ 
      error: "Falta el parámetro 'texto'" 
    });
  }
  
  // Validar que texto sea un string
  if (typeof texto !== 'string') {
    return res.status(400).json({ 
      error: "El parámetro 'texto' debe ser un string" 
    });
  }
  
  // Contar caracteres totales (incluyendo espacios)
  const totalCaracteres = texto.length;
  
  // Contar palabras (separadas por espacios)
  // Filtrar strings vacíos que resultan de múltiples espacios
  const palabras = texto.trim().split(/\s+/).filter(palabra => palabra.length > 0);
  const totalPalabras = texto.trim() === '' ? 0 : palabras.length;
  
  // Contar palabras únicas (sin duplicados)
  const palabrasUnicas = new Set(palabras.map(p => p.toLowerCase()));
  const totalPalabrasUnicas = palabrasUnicas.size;
  
  // Responder con el formato solicitado
  res.json({
    totalPalabras: totalPalabras,
    totalCaracteres: totalCaracteres,
    palabrasUnicas: totalPalabrasUnicas
  });
});


//Ejercicio No.8 Generador de Perfiles de Usuario


// Importar crypto para generar UUID (añadir al inicio si no está)
const crypto = require('crypto');

// Endpoint POST /generar-perfil
app.post('/generar-perfil', (req, res) => {
  const { nombre, edad, intereses } = req.body;
  
  // Validar que se reciban todos los parámetros
  if (!nombre || edad === undefined || !intereses) {
    return res.status(400).json({ 
      error: "Faltan parámetros. Se requiere 'nombre', 'edad' e 'intereses'" 
    });
  }
  
  // Validar tipos de datos
  if (typeof nombre !== 'string') {
    return res.status(400).json({ 
      error: "El parámetro 'nombre' debe ser un string" 
    });
  }
  
  if (typeof edad !== 'number') {
    return res.status(400).json({ 
      error: "El parámetro 'edad' debe ser un número" 
    });
  }
  
  if (!Array.isArray(intereses)) {
    return res.status(400).json({ 
      error: "El parámetro 'intereses' debe ser un array" 
    });
  }
  
  // Generar UUID
  const id = crypto.randomUUID();
  
  // Obtener timestamp actual
  const fechaCreacion = new Date().toISOString();
  
  // Determinar categoría basada en la edad
  let categoria;
  if (edad < 18) {
    categoria = "junior";
  } else if (edad >= 18 && edad < 60) {
    categoria = "senior";
  } else {
    categoria = "veterano";
  }
  
  // Construir el objeto de respuesta
  const perfil = {
    usuario: {
      nombre: nombre,
      edad: edad,
      intereses: intereses
    },
    id: id,
    fechaCreacion: fechaCreacion,
    categoria: categoria
  };
  
  // Responder con el perfil generado
  res.json(perfil);
});


//Ejercicio 9: Sistema de calificaciones
// Endpoint POST /calcular-promedio
app.post('/calcular-promedio', (req, res) => {
  const { calificaciones } = req.body;
  
  // Validar que se reciba el parámetro calificaciones
  if (!calificaciones) {
    return res.status(400).json({ 
      error: "Falta el parámetro 'calificaciones'" 
    });
  }
  
  // Validar que calificaciones sea un array
  if (!Array.isArray(calificaciones)) {
    return res.status(400).json({ 
      error: "El parámetro 'calificaciones' debe ser un array" 
    });
  }
  
  // Validar que el array no esté vacío
  if (calificaciones.length === 0) {
    return res.status(400).json({ 
      error: "El array de calificaciones no puede estar vacío" 
    });
  }
  
  // Validar que todas las calificaciones sean números entre 0 y 10
  for (let i = 0; i < calificaciones.length; i++) {
    const cal = calificaciones[i];
    if (typeof cal !== 'number' || cal < 0 || cal > 10) {
      return res.status(400).json({ 
        error: `La calificación en la posición ${i} debe ser un número entre 0 y 10` 
      });
    }
  }
  
  // Calcular el promedio
  const suma = calificaciones.reduce((acc, cal) => acc + cal, 0);
  const promedio = suma / calificaciones.length;
  
  // Encontrar la calificación más alta
  const calificacionMasAlta = Math.max(...calificaciones);
  
  // Encontrar la calificación más baja
  const calificacionMasBaja = Math.min(...calificaciones);
  
  // Determinar el estado basado en el promedio
  const estado = promedio >= 6 ? "aprobado" : "reprobado";
  
  // Responder con el formato solicitado
  res.json({
    promedio: promedio,
    calificacionMasAlta: calificacionMasAlta,
    calificacionMasBaja: calificacionMasBaja,
    estado: estado
  });
});


//Ejercicio No.10 API de productos con filtros



// Array en memoria para almacenar productos
let productos = [
  { id: 1, nombre: "Laptop", categoria: "electrónica", precio: 15000 },
  { id: 2, nombre: "Mouse", categoria: "electrónica", precio: 250 },
  { id: 3, nombre: "Teclado", categoria: "electrónica", precio: 800 },
  { id: 4, nombre: "Silla", categoria: "muebles", precio: 2500 },
  { id: 5, nombre: "Escritorio", categoria: "muebles", precio: 5000 },
  { id: 6, nombre: "Lámpara", categoria: "iluminación", precio: 400 },
  { id: 7, nombre: "Monitor", categoria: "electrónica", precio: 3500 }
];

// Contador para IDs únicos de productos
let contadorIdProducto = 8;

// Endpoint GET /productos con filtros
app.get('/productos', (req, res) => {
  const { categoria, precioMin, precioMax } = req.query;
  
  // Iniciar con todos los productos
  let productosFiltrados = [...productos];
  
  // Filtrar por categoría si se proporciona
  if (categoria) {
    productosFiltrados = productosFiltrados.filter(
      producto => producto.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }
  
  // Filtrar por precio mínimo si se proporciona
  if (precioMin) {
    const min = parseFloat(precioMin);
    if (!isNaN(min)) {
      productosFiltrados = productosFiltrados.filter(
        producto => producto.precio >= min
      );
    }
  }
  
  // Filtrar por precio máximo si se proporciona
  if (precioMax) {
    const max = parseFloat(precioMax);
    if (!isNaN(max)) {
      productosFiltrados = productosFiltrados.filter(
        producto => producto.precio <= max
      );
    }
  }
  
  // Responder con los productos filtrados
  res.json({
    total: productosFiltrados.length,
    productos: productosFiltrados
  });
});

// Endpoint POST /productos para agregar productos
app.post('/productos', (req, res) => {
  const { nombre, categoria, precio } = req.body;
  
  // Validar que se reciban todos los parámetros
  if (!nombre || !categoria || precio === undefined) {
    return res.status(400).json({ 
      error: "Faltan parámetros. Se requiere 'nombre', 'categoria' y 'precio'" 
    });
  }
  
  // Validar tipos de datos
  if (typeof nombre !== 'string') {
    return res.status(400).json({ 
      error: "El parámetro 'nombre' debe ser un string" 
    });
  }
  
  if (typeof categoria !== 'string') {
    return res.status(400).json({ 
      error: "El parámetro 'categoria' debe ser un string" 
    });
  }
  
  if (typeof precio !== 'number' || precio < 0) {
    return res.status(400).json({ 
      error: "El parámetro 'precio' debe ser un número positivo" 
    });
  }
  
  // Crear el nuevo producto
  const nuevoProducto = {
    id: contadorIdProducto++,
    nombre: nombre,
    categoria: categoria,
    precio: precio
  };
  
  // Agregar el producto al array
  productos.push(nuevoProducto);
  
  // Responder con el producto creado
  res.status(201).json({
    mensaje: "Producto agregado exitosamente",
    producto: nuevoProducto
  });
});









app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

app.listen(3000, () => console.log('Servidor escuchando en puerto 3000'));
