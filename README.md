<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Indicadores Financieros</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .table-danger-custom { background-color: #f8d7da !important; color: #842029; font-weight: bold; }
        .card { border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    </style>
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="text-center mb-4 fw-bold text-primary">📊 Módulo de Indicadores Económicos</h2>

        <div class="card p-4 mb-5">
            <h5 class="card-title mb-3">Capturar Valor del Día</h5>
            <form id="formIndicador" class="row g-3">
                <div class="col-md-4">
                    <label class="form-label fw-bold">Seleccionar Indicador</label>
                    <select id="selIndicador" class="form-select" required>
                        <option value="1">Dólar Fix (ID: 1)</option>
                        <option value="2">UDIS (ID: 2)</option>
                        <option value="3">TIIE (ID: 3)</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-bold">Valor</label>
                    <input type="number" step="0.0001" id="valValor" class="form-control" placeholder="0.0000" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-bold">Fecha</label>
                    <input type="date" id="valFecha" class="form-control" required>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button type="submit" class="btn btn-primary w-100 fw-bold">Registrar</button>
                </div>
            </form>
        </div>

        <div class="card p-4">
            <h5 class="card-title mb-3">Historial de los últimos 30 días</h5>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>Indicador</th>
                            <th>Fecha</th>
                            <th>Valor</th>
                            <th>Unidad</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody id="tablaHistorial">
                        </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        const API = "http://localhost:8080/NombreDeTuProyecto/api/indicadores";

        // Cargar historial al abrir la página
        window.onload = loadHistorial;

        async function loadHistorial() {
            try {
                const res = await fetch(`${API}/historial`);
                const data = await res.json();
                const tbody = document.getElementById('tablaHistorial');
                
                tbody.innerHTML = data.map(v => `
                    <tr class="${v.estado === 'ALERTA' ? 'table-danger-custom' : ''}">
                        <td>${v.indicador.nombre}</td>
                        <td>${v.fecha}</td>
                        <td>${v.valor.toFixed(4)}</td>
                        <td>${v.indicador.unidad}</td>
                        <td>
                            <span class="badge ${v.estado === 'ALERTA' ? 'bg-danger' : 'bg-success'}">
                                ${v.estado}
                            </span>
                        </td>
                    </tr>
                `).join('');
            } catch (e) { console.error("Error cargando historial", e); }
        }

        document.getElementById('formIndicador').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const payload = {
                indicador: { id: document.getElementById('selIndicador').value },
                valor: parseFloat(document.getElementById('valValor').value),
                fecha: document.getElementById('valFecha').value
            };

            const res = await fetch(`${API}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("¡Valor registrado con éxito!");
                loadHistorial();
                document.getElementById('formIndicador').reset();
            } else {
                const err = await res.json();
                alert("Error: " + err.error);
            }
        });
    </script>
</body>
</html>
