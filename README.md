# Practicas-Aplicaciones-Distribuidas
Prácticas de Aplicaciones Distribuidas, como se utiliza modulos de node js, en necesario que al ejecutar el programa en su equipo instalar los modulos de node js con npm install express, lo mismo para practicas de REACT, se deben de cargar dependencias



<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Sistema de Indicadores</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Estilo para resaltar las alertas en rojo */
        .fila-alerta { background-color: #f8d7da !important; color: #842029; }
        .contenedor-principal { max-width: 900px; margin: 40px auto; }
        .seccion-card { border: none; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 10px; padding: 20px; }
    </style>
</head>
<body class="bg-light">

<div class="container contenedor-principal">
    <h2 class="text-center mb-4">Panel de Indicadores</h2>

    <div class="card seccion-card mb-4">
        <h5 class="mb-3">Nuevo Registro</h5>
        <form id="formRegistro" class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Indicador</label>
                <select id="inputIndicador" class="form-select" required>
                    <option value="1">Dólar Fix</option>
                    <option value="2">UDIS</option>
                    <option value="3">TIIE</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Valor</label>
                <input type="number" step="0.0001" id="inputValor" class="form-control" required>
            </div>
            <div class="col-md-3">
                <label class="form-label">Fecha</label>
                <input type="date" id="inputFecha" class="form-control" required>
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button type="submit" class="btn btn-primary w-100">Guardar</button>
            </div>
        </form>
    </div>

    <div class="card seccion-card">
        <h5 class="mb-3">Historial Reciente</h5>
        <table class="table table-striped align-middle">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody id="cuerpoTabla">
                </tbody>
        </table>
    </div>
</div>

<script>
    // Ajusta esta URL al nombre de tu proyecto en NetBeans
    const URL_BASE = "http://localhost:8080/NombreDeTuProyecto/api/indicadores";

    // Cargar datos al inicio
    document.addEventListener("DOMContentLoaded", cargarDatos);

    async function cargarDatos() {
        try {
            const respuesta = await fetch(`${URL_BASE}/historial`);
            const lista = await respuesta.json();
            const tabla = document.getElementById('cuerpoTabla');
            
            tabla.innerHTML = lista.map(item => `
                <tr class="${item.estado === 'ALERTA' ? 'fila-alerta' : ''}">
                    <td>${item.indicador.nombre}</td>
                    <td>${item.fecha}</td>
                    <td>${item.valor.toFixed(4)}</td>
                    <td>
                        <span class="badge ${item.estado === 'ALERTA' ? 'bg-danger' : 'bg-success'}">
                            ${item.estado}
                        </span>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error("Error al cargar:", error);
        }
    }

    document.getElementById('formRegistro').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datos = {
            indicador: { id: document.getElementById('inputIndicador').value },
            valor: parseFloat(document.getElementById('inputValor').value),
            fecha: document.getElementById('inputFecha').value
        };

        const respuesta = await fetch(`${URL_BASE}/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            alert("Registrado correctamente");
            cargarDatos(); // Recargar tabla
            e.target.reset();
        } else {
            const errorData = await respuesta.json();
            alert("Error: " + (errorData.error || "No se pudo guardar"));
        }
    });
</script>

</body>
</html>
