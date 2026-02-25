package com.indicadores.resource;

import com.indicadores.entity.ValorDiario;
import com.indicadores.service.IndicadorService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

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
                    .entity(guardado)
                    .header("Access-Control-Allow-Origin", "*") // Permite la conexión
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
        }
    }

    @GET
    @Path("/historial")
    public Response historial() {
        List<ValorDiario> lista = service.obtenerHistorial30Dias();
        return Response.ok(lista)
                .header("Access-Control-Allow-Origin", "*") // Permite la conexión
                .build();
    }

    // Método necesario para que el navegador no bloquee la petición antes de enviarla
    @OPTIONS
    @Path("{path : .*}")
    public Response options() {
        return Response.ok("")
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization")
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
                .build();
    }
}
