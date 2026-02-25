package com.indicadores.service;

import com.indicadores.entity.Indicador;
import com.indicadores.entity.ValorDiario;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.time.LocalDate;
import java.util.List;

@Stateless
public class IndicadorService {

    @PersistenceContext(unitName = "IndicadoresPU")
    private EntityManager em;

    public ValorDiario guardarValor(ValorDiario nuevo) throws Exception {
        // 1. Validaciones de negocio
        if (nuevo.getFecha().isAfter(LocalDate.now())) throw new Exception("No se permiten fechas futuras");
        if (nuevo.getValor() < 0) throw new Exception("El valor no puede ser negativo");

        // 2. Corregir error null: Buscar el indicador real en la DB
        Indicador indDB = em.find(Indicador.class, nuevo.getIndicador().getId());
        if (indDB == null) throw new Exception("ID de Indicador no válido");
        nuevo.setIndicador(indDB);

        // 3. Algoritmo de Variación Brusca (5%)
        TypedQuery<ValorDiario> query = em.createQuery(
            "SELECT v FROM ValorDiario v WHERE v.indicador.id = :id ORDER BY v.fecha DESC", ValorDiario.class);
        query.setParameter("id", indDB.getId());
        query.setMaxResults(1);
        List<ValorDiario> historial = query.getResultList();

        nuevo.setEstado("OK");
        if (!historial.isEmpty()) {
            double vAnterior = historial.get(0).getValor();
            double variacion = Math.abs((nuevo.getValor() - vAnterior) / vAnterior);
            if (variacion > 0.05) {
                nuevo.setEstado("ALERTA");
            }
        }

        em.persist(nuevo);
        return nuevo;
    }

    public List<ValorDiario> obtenerHistorial30Dias() {
        return em.createQuery("SELECT v FROM ValorDiario v ORDER BY v.fecha DESC", ValorDiario.class)
                 .setMaxResults(30)
                 .getResultList();
    }
}
