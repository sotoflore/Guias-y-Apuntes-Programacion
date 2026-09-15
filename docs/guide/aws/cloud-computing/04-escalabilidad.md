# Escalabilidad en Cloud Computing

La **escalabilidad** es uno de los conceptos más importantes en Cloud Computing. Gracias a ella, las aplicaciones pueden adaptarse automáticamente al aumento o disminución de la demanda, utilizando más o menos recursos según sea necesario.

## ¿Qué es la escalabilidad?

La **escalabilidad** es la capacidad que tiene un sistema, una aplicación o una infraestructura para adaptarse a cambios en la demanda, aumentando o disminuyendo sus recursos sin perder rendimiento, disponibilidad o estabilidad.

En otras palabras, un sistema escalable puede atender a más usuarios, procesar más información o ejecutar más tareas sin que su funcionamiento se degrade significativamente.

:::info Definición
La **escalabilidad** es la capacidad de un sistema para incrementar o reducir su capacidad de procesamiento mediante la incorporación o mejora de recursos computacionales (CPU, memoria, almacenamiento o servidores), con el objetivo de mantener un rendimiento adecuado frente a variaciones en la carga de trabajo.
:::

### ¿Qué significa "escalar"?

Escalar significa aumentar o reducir la capacidad de un sistema según la cantidad de trabajo que debe realizar.

Por ejemplo, un servidor tiene:

- 4 `CPU`
- 8 GB de `RAM`

Con esa capacidad puede atender aproximadamente a 500 usuarios simultáneos. Si ahora llegan 5,000 usuarios, será necesario escalar el sistema.

Esto puede hacerse de dos formas:

- **Escalando verticalmente**: hacer más potente ese servidor (más **`CPU`** y más **`RAM`**).
- **Escalando horizontalmente**: agregar más servidores para repartir el trabajo.

La escalabilidad busca que un sistema pueda:

- Atender un mayor número de usuarios.
- Procesar más solicitudes por segundo.
- Mantener tiempos de respuesta bajos.
- Evitar interrupciones del servicio.
- Adaptarse al crecimiento del negocio.
- Optimizar el uso de recursos y los costos.

### ¿Qué recursos se pueden escalar?

La escalabilidad no solo consiste en agregar servidores. También puede implicar aumentar otros recursos del sistema, como:

- **`CPU`**: para realizar más cálculos por segundo.
- **Memoria `RAM`**: para mantener más información disponible rápidamente.
- **Almacenamiento**: para guardar un mayor volumen de datos.
- **Ancho de banda de red**: para soportar más tráfico.
- **Número de servidores**: para distribuir la carga de trabajo.

### ¿Qué ocurre si un sistema no es escalable?

Cuando un sistema no puede crecer junto con la demanda, suelen aparecer problemas como:

- Lentitud en la aplicación.
- Errores frecuentes.
-  Caídas del servicio.
- Mala experiencia para los usuarios.
- Pérdida de clientes y ventas.
- Mayor dificultad para hacer crecer el negocio.

**Por ejemplo**, una tienda en línea durante un evento como Black Friday podría perder miles de ventas si su infraestructura no soporta el incremento de visitantes.

## Tipos de escalabilidad

Existen dos tipos principales.

![tipos de escalabilidad](/cloud-img/escalabilidad-tipos.png)

### 1. Escalabilidad Vertical

Consiste en **incrementar** o **reducir** la capacidad de un único servidor o máquina, agregando o quitando recursos de hardware como: **`CPU`**, Memoria **`RAM`**, Almacenamiento (**`SSD/HDD`**), Potencia de procesamiento, Tarjetas especializadas (**`GPU`**)

En otras palabras:
>la aplicación continúa ejecutándose en el mismo servidor, pero dicho servidor se vuelve más potente.

Por eso se conoce como **Scale Up** (escalar hacia arriba) cuando aumentan los recursos y **Scale Down** (escalar hacia abajo) cuando se reducen.

#### ¿Cómo funciona?

##### Scale Up

![escalabilidad vertical up](/cloud-img/escalabilidad-vertical-up.png)

Supongamos que tienes un servidor con:

- 2 **`CPU`**
- 4 **`GB RAM`**

Cuando la aplicación comienza a recibir más usuarios, decides mejorar ese mismo servidor. Después de la actualización tendrá:

- 8 **`CPU`**
- 32 **`GB RAM`**

La aplicación sigue siendo exactamente la misma. Lo único que cambió fue la potencia del servidor.

![escalabilidad vertical up](/cloud-img/escalabilidad-vertical-up_v2.png)

##### Scale Down

![escalabilidad vertical down](/cloud-img/escalabilidad-vertical-down.png)

También es posible reducir los recursos cuando la demanda disminuye.

![escalabilidad vertical down](/cloud-img/escalabilidad-vertical-down_v2.png)

#### Ventajas y Desventajas

**Ventajas**

- **Muy fácil de implementar**. No es necesario modificar la arquitectura de la aplicación. Solo se cambia el tamaño del servidor.

- **No requiere balanceadores**. Como existe un único servidor, no hace falta distribuir las peticiones.

- **Ideal para aplicaciones monolíticas**. Muchas aplicaciones antiguas funcionan perfectamente con este enfoque.

- **Menor complejidad**. No hay sincronización entre múltiples servidores. No existen problemas de consistencia entre nodos.

- **Menor esfuerzo administrativo**. Se administra un único servidor.

**Desventajas**

- **Existe un límite físico**. No puedes aumentar recursos infinitamente. Llegará un momento en que el servidor más potente disponible ya no será suficiente.

- **Punto único de fallo (Single Point of Failure)**. Si el servidor falla: toda la aplicación deja de funcionar. No existe redundancia.

- **Escalamiento costoso**. Los servidores muy potentes son considerablemente más caros.

- **Algunas ampliaciones requieren reiniciar**. En determinados entornos es necesario detener la máquina para aumentar memoria o **`CPU`**. Aunque los proveedores cloud permiten hacerlo con menos interrupciones, no siempre es transparente.

#### Casos de uso

La escalabilidad vertical suele ser adecuada para:

- Bases de datos relacionales (PostgreSQL, MySQL, SQL Server).
- Aplicaciones monolíticas.
- Sistemas internos empresariales.
- Servidores con baja o media concurrencia.
- Aplicaciones heredadas (Legacy).

#### ¿Cuándo utilizarla?

Cuando:

- el crecimiento esperado es moderado,
- la aplicación no fue diseñada para múltiples servidores,
- se necesita una solución rápida y sencilla,
- el costo adicional es aceptable.

### 2. Escalabilidad Horizontal

Consiste en **aumentar** o **disminuir** el número de servidores que ejecutan la misma aplicación, en lugar de incrementar la potencia de un único servidor. Cada servidor mantiene especificaciones similares, pero el trabajo se reparte entre todos ellos mediante un **balanceador de carga** (Load Balancer).

Cuando se agregan nuevos servidores se habla de **Scale Out**, y cuando se eliminan servidores porque ya no son necesarios se denomina **Scale In**.

Este enfoque es la base de la arquitectura de la mayoría de aplicaciones modernas en la nube, ya que permite crecer prácticamente sin límites y mejorar la disponibilidad del servicio.

:::info Balanceador de Carga
Consiste en di­s­tri­buir las consultas de los usuarios entre varios se­r­vi­do­res de forma tra­n­s­pa­re­n­te. 
:::

#### ¿Cómo funciona?

##### Scale Out

![escalabilidad horizontal out](/cloud-img/escalabilidad-horizontal-out.png)

Supongamos que una aplicación comienza con un único servidor. Si la cantidad de usuarios aumenta, en lugar de reemplazar el servidor por uno más potente, se agregan nuevos servidores que ejecutan exactamente la misma aplicación.

Un **Load Balancer** distribuye automáticamente las solicitudes entre todos los servidores disponibles, evitando que uno solo se sobrecargue. De esta forma, la capacidad total del sistema aumenta gracias al trabajo conjunto de varios servidores.

![escalabilidad horizontal out](/cloud-img/escalabilidad-horizontal-out_v2.png)

##### Scale In

![escalabilidad horizontal in](/cloud-img/escalabilidad-horizontal-in.png)

Cuando disminuye la demanda, es posible retirar servidores para reducir costes sin afectar el funcionamiento de la aplicación.

![escalabilidad horizontal in](/cloud-img/escalabilidad-horizontal-in_v2.png)

#### Ventajas y Desventajas

**Ventajas**

- **Escalabilidad prácticamente ilimitada**. Es posible seguir agregando servidores conforme aumenta la demanda, sin depender de un único equipo extremadamente potente.

- **Alta disponibilidad**. Si uno de los servidores falla, los demás continúan atendiendo las solicitudes, reduciendo el riesgo de interrupciones.

- **Mayor tolerancia a fallos**. La pérdida de un nodo no implica la caída completa del sistema.

- **Mejor distribución de la carga**. El balanceador reparte el tráfico entre todos los servidores, evitando cuellos de botella.

- **Elasticidad**. Permite crear y eliminar servidores automáticamente según el nivel de uso, optimizando el coste en entornos cloud.

**Desventajas**

- **Mayor complejidad arquitectónica**. Es necesario diseñar la aplicación para funcionar correctamente en varios servidores.

- **Requiere un balanceador de carga**. Se necesita un componente adicional que distribuya las solicitudes entre los distintos nodos.

- **Gestión del estado de la aplicación**. Si la aplicación mantiene sesiones de usuario en memoria, será necesario utilizar técnicas como sesiones compartidas o almacenamiento externo para que cualquier servidor pueda atender una petición.

- **Sincronización de datos**. Cuando varios servidores acceden a los mismos datos, es necesario garantizar la consistencia y evitar conflictos.

#### Casos de uso

La escalabilidad horizontal es la opción preferida para:

- Aplicaciones web modernas.
- Microservicios.
- APIs REST.
- Plataformas de comercio electrónico.
- Servicios de streaming.
- Aplicaciones SaaS.
- Plataformas de videojuegos en línea.

#### ¿Cuándo utilizarla?

Es recomendable cuando:

- se espera un crecimiento significativo del número de usuarios,
- se requiere alta disponibilidad,
- el servicio debe seguir funcionando incluso si un servidor falla,
- se desea aprovechar la elasticidad y el pago por uso del cloud.

## Escalabilidad Vertical vs Horizontal

| Característica        | Escalabilidad Vertical                            | Escalabilidad Horizontal                       |
| --------------------- | ------------------------------------------------- | ---------------------------------------------- |
| ¿Qué se incrementa?   | Recursos del mismo servidor                       | Número de servidores                           |
| Término               | Scale Up / Scale Down                             | Scale Out / Scale In                           |
| Infraestructura       | Un único servidor                                 | Varios servidores                              |
| Complejidad           | Baja                                              | Alta                                           |
| Balanceador de carga  | No necesario                                      | Necesario                                      |
| Tolerancia a fallos   | Baja                                              | Alta                                           |
| Punto único de fallo  | Sí                                                | No (si hay redundancia)                        |
| Límite de crecimiento | Limitado por el hardware                          | Muy alto o prácticamente ilimitado             |
| Coste inicial         | Menor                                             | Mayor (más componentes)                        |
| Escalado automático   | Limitado                                          | Muy común                                      |
| Casos de uso          | Monolitos, bases de datos, aplicaciones heredadas | Microservicios, aplicaciones cloud, APIs, SaaS |

## Escalado automático

Una de las mayores ventajas del Cloud Computing es que la escalabilidad puede ser automática.

![escalabilidad automatico](/cloud-img/escalabilidad-automatico.png)

El proveedor de nube monitorea continuamente el uso de recursos (CPU, memoria, número de solicitudes, etc.) y agrega o elimina servidores según reglas definidas.

**Ejemplo de escalado en el tiempo**:

![escalabilidad automatico](/cloud-img/escalabilidad-automatico-ejemplo.png)

- Si el uso de CPU supera el 80 % durante varios minutos, se crea un nuevo servidor.
- Si el uso baja al 20 %, los servidores sobrantes se eliminan.

El sistema ajusta automáticamente la capacidad segun la demanda en tiempo real. Esto permite pagar solo por los recursos utilizados.

**Beneficios del escalado automático**

- Alta disponibilidad y mejor experiencia de usuario
- Optmización de costos, pagas solo por lo que usas
- Respuesta automática y rápida ente cambios en la demanda
- Flexibilidad y adaptación continuas
- Mayor resiliencia y estabilidad del sistema
