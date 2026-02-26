# 📊 Sistema de Gestión de Indicadores Financieros

Este proyecto es una aplicación web diseñada para el registro y monitoreo de variaciones diarias en indicadores económicos (Dólar, UDIS, TIIE), desarrollada bajo estándares de **Jakarta EE 10**.

## 🚀 Arquitectura Implementada

Se utilizó una **Arquitectura en Capas** para garantizar el orden y la escalabilidad del sistema:

* **Presentación:** Interfaz construida con HTML5 y JavaScript (Fetch API) para una experiencia de usuario rápida y dinámica.
* **Negocio (EJB):** Lógica centralizada en componentes EJB que validan los datos y ejecutan el algoritmo de alertas.
* **Persistencia (JPA):** Gestión de base de datos mediante Java Persistence API, facilitando el manejo de la información sin depender de SQL nativo.

**Justificación:** Esta arquitectura permite separar la vista de la lógica, lo que facilita el mantenimiento y permite que el sistema crezca de forma organizada.



## 🛠️ Patrones de Diseño

* **Repository / DAO:** Implementado a través de JPA para abstraer el acceso a los datos. El código no "habla" directamente con la base de datos, sino a través de un gestor de objetos.
* **Inyección de Dependencias (CDI):** Utilizado para conectar los servicios con la API de forma limpia y desacoplada.

## 📈 Algoritmo de Variaciones Bruscas

El sistema protege la integridad de los datos mediante las siguientes reglas:
1.  **Validación:** Bloqueo automático de valores negativos y fechas futuras.
2.  **Detección:** Al ingresar un valor, el sistema lo compara con el último registro del mismo indicador.
3.  **Alerta:** Si la variación es mayor al **5%**, el registro se marca como **"ALERTA"** y se resalta en **color rojo** en la tabla de resultados.

## 🔄 Guía de Migración (Oracle a SQL Server)

Gracias al uso de **JPA**, migrar este sistema de Oracle a SQL Server es sumamente sencillo:
1.  **Driver:** Se cambia el controlador JDBC en el servidor GlassFish.
2.  **Dialecto:** Se actualiza la propiedad del dialecto en el archivo `persistence.xml`.
3.  **Código:** No es necesario modificar el código Java, ya que JPA se encarga de traducir las operaciones al lenguaje específico de SQL Server automáticamente.

---
*Evaluación Técnica - Analista de Sistemas*
