<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Indicadores Económicos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .alerta-roja { background-color: #f8d7da !important; color: #842029; font-weight: bold; }
        .contenedor { max-width: 800px; margin: 40px auto; }
    </style>
</head>
<body class="bg-light">
<div class="container contenedor">
    <div class="card shadow-sm p-4 mb-4">
        <h4 class="mb-3">Registrar Valor Diario</h4>
        <form id="formRegistro" class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Indicador</label>
                <select id="selInd" class="form-select" required>
                    <option value="1">Dólar Fix</option>
                    <option value="2">UDIS</option>
                    <option value="3">TIIE</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Valor</label>
                <input type="number" step="0.0001" id="txtVal" class="form-control" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">Fecha</label>
                <input type="date" id="txtFec" class="form-control" required>
            </div>
            <div class="col-12 text-end">
                <button type="submit" class="btn btn-primary">Registrar Valor</button>
            </div>
        </form>
    </div>

    <div class="card shadow-sm p-4">
        <h5>Historial (Últimos 30 días)</h5>
        <table class="table mt-3">
            <thead class="table-dark">
                <tr>
                    <th>Indicador</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody id="tablaBody"></tbody>
        </table>
    </div>
</div>

<script>
    // CAMBIA 'ModuloGestion' por el nombre de tu proyecto en NetBeans
    const URL_API = "http://localhost:8080/ModuloGestion/api/indicadores";

    async function cargarTabla() {
        const res = await fetch(`${URL_API}/historial`);
        const lista = await res.json();
        document.getElementById('tablaBody').innerHTML = lista.map(v => `
            <tr class="${v.estado === 'ALERTA' ? 'alerta-roja' : ''}">
                <td>${v.indicador.nombre}</td>
                <td>${v.fecha}</td>
                <td>${v.valor.toFixed(4)}</td>
                <td><span class="badge ${v.estado === 'ALERTA' ? 'bg-danger' : 'bg-success'}">${v.estado}</span></td>
            </tr>
        `).join('');
    }

    document.getElementById('formRegistro').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            indicador: { id: parseInt(document.getElementById('selInd').value) },
            valor: parseFloat(document.getElementById('txtVal').value),
            fecha: document.getElementById('txtFec').value
        };

        const res = await fetch(`${URL_API}/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            cargarTabla();
            e.target.reset();
        } else {
            const err = await res.json();
            alert("Error: " + err.error);
        }
    });

    document.addEventListener("DOMContentLoaded", cargarTabla);
</script>
</body>
</html>
