package com.indicadores.resource;

import com.indicadores.entity.ValorDiario;
import com.indicadores.service.IndicadorService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/indicadores")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class IndicadorResource {

    @Inject
    private IndicadorService service;

    @POST
    @Path("/registrar")
    public Response registrar(ValorDiario valor) {
        try {
            ValorDiario guardado = service.guardarValor(valor);
            return Response.status(Response.Status.CREATED)
                    .header("Access-Control-Allow-Origin", "*")
                    .entity(guardado).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .header("Access-Control-Allow-Origin", "*")
                    .entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }

    @GET
    @Path("/historial")
    public Response historial() {
        return Response.ok(service.obtenerHistorial30Dias())
                .header("Access-Control-Allow-Origin", "*")
                .build();
    }

    @OPTIONS
    @Path("{path : .*}")
    public Response options() {
        return Response.ok("")
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization")
                .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                .build();
    }
}
