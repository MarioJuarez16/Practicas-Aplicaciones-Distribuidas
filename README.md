<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Indicadores</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .alerta-roja { background-color: #f8d7da !important; color: #842029; font-weight: bold; }
        .contenedor { max-width: 800px; margin: 30px auto; }
        .tarjeta { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
    </style>
</head>
<body class="bg-light">

<div class="container contenedor">
    <h3 class="text-center mb-4">Módulo de Indicadores</h3>

    <div class="tarjeta shadow-sm mb-4">
        <form id="miFormulario" class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Indicador</label>
                <select id="idInd" class="form-select" required>
                    <option value="1">Dólar Fix</option>
                    <option value="2">UDIS</option>
                    <option value="3">TIIE</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Valor</label>
                <input type="number" step="0.0001" id="idVal" class="form-control" required>
            </div>
            <div class="col-md-3">
                <label class="form-label">Fecha</label>
                <input type="date" id="idFec" class="form-control" required>
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button type="submit" id="btnGuardar" class="btn btn-primary w-100">Registrar</button>
            </div>
        </form>
    </div>

    <div class="tarjeta shadow-sm">
        <table class="table table-hover">
            <thead class="table-dark">
                <tr>
                    <th>Indicador</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody id="tablaCuerpo"></tbody>
        </table>
    </div>
</div>

<script>
    // IMPORTANTE: Cambia "NombreTuProyecto" por el nombre real de tu proyecto en NetBeans
    const URL_API = "http://localhost:8080/NombreTuProyecto/api/indicadores";

    // Función para cargar los datos en la tabla
    async function cargarHistorial() {
        try {
            const res = await fetch(`${URL_API}/historial`);
            const datos = await res.json();
            const tabla = document.getElementById('tablaCuerpo');
            
            tabla.innerHTML = datos.map(item => `
                <tr class="${item.estado === 'ALERTA' ? 'alerta-roja' : ''}">
                    <td>${item.indicador.nombre}</td>
                    <td>${item.fecha}</td>
                    <td>${item.valor.toFixed(4)}</td>
                    <td><span class="badge ${item.estado === 'ALERTA' ? 'bg-danger' : 'bg-success'}">${item.estado}</span></td>
                </tr>
            `).join('');
        } catch (err) {
            console.error("Error al cargar datos:", err);
        }
    }

    // Evento para el botón de Registrar
    document.getElementById('miFormulario').addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const objetoEnviar = {
            indicador: { id: parseInt(document.getElementById('idInd').value) },
            valor: parseFloat(document.getElementById('idVal').value),
            fecha: document.getElementById('idFec').value
        };

        try {
            const respuesta = await fetch(`${URL_API}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objetoEnviar)
            });

            if (respuesta.ok) {
                alert("¡Registrado con éxito!");
                cargarHistorial(); // Actualiza la tabla sin recargar
                document.getElementById('miFormulario').reset(); // Limpia los campos
            } else {
                const errorJson = await respuesta.json();
                alert("Error: " + errorJson.error);
            }
        } catch (err) {
            alert("No se pudo conectar con el servidor (Backend)");
        }
    });

    // Cargar la tabla apenas abra la página
    document.addEventListener("DOMContentLoaded", cargarHistorial);
</script>

</body>
</html>
