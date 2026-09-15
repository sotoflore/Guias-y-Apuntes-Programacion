# Latencia

La latencia es uno de los conceptos más importantes en redes y Cloud Computing. Si la entiendes bien, comprenderás por qué unas aplicaciones responden instantáneamente y otras tardan varios segundos.

## ¿Qué es la latencia?

La **latencia** es el tiempo que tarda un dato en viajar desde un punto de origen hasta un punto de destino y regresar con una respuesta.

En otras palabras:

>La **latencia** es el tiempo de espera entre enviar una solicitud y recibir una respuesta.

Se mide normalmente en **milisegundos (`ms`)** y un **`1`** segundo equivale a **`1000`** milisegundos.

**Por ejemplo:**

- 5 ms → Muy rápida
- 20 ms → Rápida
- 80 ms → Aceptable
- 200 ms → Lenta
- 1000 ms = 1 segundo → Muy lenta

:::tip Ejemplo sencillo
Supongamos que abres YouTube. Tu computadora envía esta petición: **"Quiero abrir youtube.com"**.

La solicitud viaja por Internet hasta un servidor. El servidor responde: **"Aquí está la página."**

![ejemplo de latencia](/cloud-img/latencia-ejemplo.png)

Todo ese recorrido tiene un tiempo. Ese tiempo es la latencia. Todo ese recorrido se mide en milisegundos.
:::

### ¿Qué significa una latencia alta?

Una **latencia alta** significa que existe un mayor tiempo de espera entre el momento en que un usuario envía una solicitud y el momento en que recibe la respuesta del servidor. 

>En otras palabras, los datos tardan más en viajar por la red y regresar al usuario.

Desde la perspectiva del usuario, la aplicación puede sentirse lenta, poco fluida o incluso parecer que se quedó pensando antes de responder.

![ejemplo de latencia alta](/cloud-img/latencia-alta-ejemplo.png)

**Impacto de una latencia alta**

- **Mayor tiempo de carga:** Las páginas, aplicaciones o servicios tardan más en mostrarse.
- **Retrasos en las acciones del usuario:** Al hacer clic en un botón o enviar un formulario, la respuesta puede demorar varios segundos.
- **Experiencia de usuario deficiente:** La sensación de lentitud puede generar frustración.
- **Pérdida de productividad:** En aplicaciones empresariales, los usuarios realizan menos trabajo debido a las constantes esperas.
- **Menor retención de usuarios:** Los usuarios pueden abandonar una aplicación o sitio web si las respuestas son demasiado lentas.
- **Problemas en aplicaciones en tiempo real:** Videojuegos, videollamadas, streaming y aplicaciones financieras pueden verse gravemente afectados por el retraso.

> **Ejemplo:** Si una aplicación tiene una latencia de **800 ms (0.8 segundos)**, cada acción del usuario tendrá un retraso perceptible antes de recibir una respuesta.

### ¿Qué significa una latencia baja?

Una **latencia baja** significa que el tiempo que tarda una solicitud en llegar al servidor y regresar con una respuesta es muy pequeño. Esto permite que la comunicación entre el usuario y el sistema sea rápida y eficiente.

Desde la perspectiva del usuario, la aplicación se siente **ágil**, **fluida** y responde casi de forma inmediata a cada interacción.

![ejemplo de latencia baja](/cloud-img/latencia-baja-ejemplo.png)

**Impacto de una latencia baja**

- **Carga rápida de aplicaciones y páginas web.**

- **Respuestas casi instantáneas** al interactuar con botones, formularios o menús.

- **Mejor experiencia de usuario (User Experience - UX).**

- **Mayor productividad**, ya que los usuarios esperan menos tiempo entre acciones.

- **Mayor rendimiento de las aplicaciones**, especialmente en sistemas distribuidos y servicios en la nube.

- **Mayor satisfacción y retención de usuarios**, quienes tienden a permanecer más tiempo en aplicaciones rápidas y confiables.

- **Mejor funcionamiento de aplicaciones en tiempo real**, como videoconferencias, videojuegos en línea, plataformas de streaming y sistemas IoT.

> **Ejemplo:** Si una aplicación tiene una latencia de **20 ms**, el usuario percibe que las acciones ocurren prácticamente al instante, proporcionando una experiencia mucho más fluida.

## ¿De qué depende la latencia?

La latencia no depende únicamente de la velocidad de Internet. El tiempo que tarda una solicitud en viajar desde un dispositivo hasta un servidor y regresar está influenciado por diversos factores físicos y tecnológicos.

Comprender estos factores permite identificar por qué una aplicación puede responder rápidamente en algunos casos y presentar retrasos en otros.

### 1. Distancia entre el usuario y el servidor

La **distancia física** es uno de los factores que más influye en la latencia. Cuanto mayor sea la distancia que deben recorrer los datos, mayor será el tiempo de viaje.

Aunque la información viaja a velocidades muy altas a través de fibra óptica y otros medios de transmisión, no puede hacerlo de manera instantánea. Por ello, un servidor ubicado en otro continente normalmente tendrá una latencia mayor que uno ubicado en la misma ciudad o país.

```txt
Mayor distancia = Mayor latencia
Menor distancia = Menor latencia
```

**Ejemplo:**

* Usuario en Bogotá → Servidor en Bogotá → Latencia baja.
* Usuario en Bogotá → Servidor en Tokio → Latencia considerablemente mayor.

### 2. Cantidad de saltos (Network Hops)

Los datos no viajan directamente desde el dispositivo del usuario hasta el servidor. En su recorrido pasan por múltiples equipos de red, como **routers**, **switches** y otros dispositivos de comunicación.

Cada uno de estos dispositivos recibe el paquete de datos, determina la mejor ruta y lo reenvía hacia su destino. Este proceso añade un pequeño tiempo de procesamiento en cada paso.

A este recorrido intermedio se le conoce como **saltos** (*network hops*).

```txt
Más saltos = Mayor tiempo de recorrido = Mayor latencia
```

**Ejemplo:**

Un paquete que atraviesa 5 routers llegará más rápido que otro que debe atravesar 20 routers para alcanzar el mismo destino.

### 3. Calidad y congestión de la red

La infraestructura de red también influye significativamente en la latencia.

Cuando una red se encuentra congestionada debido a un gran volumen de tráfico, los paquetes de datos deben esperar antes de ser transmitidos, aumentando el tiempo de respuesta.

Una buena analogía es una autopista:

* **Autopista despejada:** Los vehículos avanzan rápidamente.
* **Autopista congestionada:** Los vehículos deben reducir la velocidad o detenerse.

Lo mismo ocurre con los paquetes de datos en una red.

**Factores que pueden generar congestión:**

* Gran cantidad de usuarios conectados simultáneamente.
* Saturación del proveedor de Internet (ISP).
* Equipos de red sobrecargados.
* Enlaces de comunicación con poco ancho de banda.

### 4. Tiempo de procesamiento del servidor

La latencia no solo depende del tiempo que tardan los datos en viajar por la red. Una vez que la solicitud llega al servidor, este debe procesarla antes de enviar una respuesta.

Si el servidor dispone de suficientes recursos (CPU, memoria y almacenamiento), responderá rápidamente. Sin embargo, si está ejecutando muchas tareas al mismo tiempo o sus recursos son limitados, el tiempo de procesamiento aumentará y, con ello, la latencia total.

**Ejemplo:**

* Un servidor con baja carga puede responder en pocos milisegundos.
* Un servidor sobrecargado puede tardar cientos de milisegundos o incluso varios segundos en responder.

### 5. Tipo de conexión de red

No todas las tecnologías de conexión ofrecen la misma latencia.

Algunas están diseñadas para proporcionar respuestas muy rápidas, mientras que otras priorizan la cobertura o el ancho de banda, sacrificando el tiempo de respuesta.

En términos generales, el comportamiento suele ser el siguiente:

| Tipo de conexión   | Latencia típica | Características                                                                                            |
| ------------------ | --------------: | ---------------------------------------------------------------------------------------------------------- |
| Fibra óptica       |        Muy baja | Alta velocidad, gran estabilidad y excelente para aplicaciones en tiempo real.                             |
| Ethernet (cable)   |        Muy baja | Conexión estable y con poca variación en la latencia.                                                      |
| Wi-Fi              |    Baja a media | Depende de la distancia al router y de las interferencias.                                                 |
| Red móvil 4G       |           Media | Puede variar según la cobertura y la congestión de la red.                                                 |
| Red móvil 5G       |            Baja | Menor latencia que 4G y mejor rendimiento para aplicaciones en tiempo real.                                |
| Internet satelital |            Alta | Los datos recorren grandes distancias hasta el satélite, lo que incrementa significativamente la latencia. |

:::info Resumen
La latencia está determinada por la combinación de varios factores:

* **La distancia** entre el usuario y el servidor.
* **La cantidad de saltos** que deben recorrer los paquetes de datos.
* **La calidad y el nivel de congestión de la red.**
* **El tiempo que necesita el servidor para procesar la solicitud.**
* **La tecnología de conexión** utilizada para transmitir los datos.

En entornos de **Cloud Computing**, reducir la latencia es uno de los principales objetivos. Por esta razón, los proveedores de servicios en la nube distribuyen sus centros de datos en diferentes regiones del mundo, acercando los recursos a los usuarios y disminuyendo el tiempo de respuesta.
:::

## ¿Cómo se mide la latencia?

Una vez comprendido qué es la latencia y cuáles son los factores que la afectan, surge una pregunta importante:

> **¿Cómo podemos conocer la latencia entre nuestro dispositivo y un servidor?**

Para responder esta pregunta existen diversas herramientas de diagnóstico de red que permiten medir el tiempo de respuesta entre dos equipos conectados a una red. La más conocida y utilizada es **Ping**, aunque también existen herramientas como **Traceroute (tracert)**, **MTR** y plataformas de monitoreo de redes.

El objetivo de estas herramientas es medir cuánto tiempo tarda una solicitud en llegar a su destino y cuánto tarda la respuesta en regresar al origen.

### ¿Qué mide realmente la latencia?

Cuando un dispositivo se comunica con un servidor, ocurre el siguiente proceso:

1. El dispositivo envía una solicitud al servidor.
2. La solicitud viaja a través de Internet.
3. El servidor recibe la solicitud y la procesa.
4. El servidor envía una respuesta.
5. La respuesta regresa al dispositivo.

El tiempo total que transcurre desde que se envía la solicitud hasta que se recibe la respuesta es una medida de la latencia.

![mide realmente la latencia](/cloud-img/latencia-medicion.png)

### El Ping

El **ping** es una herramienta de diagnóstico de red utilizada para comprobar si un dispositivo o servidor es accesible y para medir el tiempo que tarda una comunicación en realizar un recorrido de ida y vuelta (Round-Trip Time o RTT). **Ping** envía un pequeño paquete de datos al servidor y espera que este responda. Cuando la respuesta regresa, calcula el tiempo total que tardó el recorrido.

Este tiempo se expresa en **milisegundos (ms)**.

**¿Cómo funciona Ping?**

El proceso puede resumirse en cuatro pasos:

1. El dispositivo envía un pequeño paquete al servidor.
2. El servidor recibe el paquete.
3. El servidor responde inmediatamente.
4. Ping calcula el tiempo total de ida y vuelta.

![funcionamiento de ping](/cloud-img/latencia-funcionamiento-ping.png)

**Ejemplo**

En Windows, Linux o macOS puedes ejecutar el siguiente comando desde la terminal:

```bash id="jvzzqc"
ping google.com
```

![ejemplo ping](/cloud-img/latencia-ping-ejemplo.png)

:::warning Importante
El **ping** no mide la velocidad de internet ni el ancho de banda. Solo mide el tiempo de respuesta (latencia) entre dos dispositivos.
:::

### ¿Qué es el RTT (Round-Trip Time)?

El tiempo que muestra Ping recibe el nombre de **Round-Trip Time (RTT)** o **Tiempo de Ida y Vuelta**.

El RTT representa el tiempo total que tarda un paquete en:

* viajar desde el dispositivo hasta el servidor,
* ser procesado por el servidor,
* regresar nuevamente al dispositivo.

Puede representarse de la siguiente manera:

![Qué es el RTT](/cloud-img/latencia-rtt.png)

Por esta razón, cuando Ping muestra **18 ms**, significa que **todo el recorrido** tomó aproximadamente **18 milisegundos**, no únicamente el viaje de ida.

:::warning Importante
El RTT puede variar en cada medición debido a la congestión de la red, la distancia, la carga del servidor y otros factores.
:::

### ¿Cómo interpretar el resultado?

No existe un valor universal que determine si una latencia es buena o mala, ya que depende del tipo de aplicación y de la distancia al servidor. Sin embargo, como referencia general:

|          Latencia | Interpretación                                                                  |
| ----------------: | ------------------------------------------------------------------------------- |
|     **0 - 20 ms** | Excelente. Ideal para videojuegos, videollamadas y aplicaciones en tiempo real. |
|    **20 - 50 ms** | Muy buena. La respuesta se percibe prácticamente instantánea.                   |
|   **50 - 100 ms** | Buena. Adecuada para navegación web y la mayoría de aplicaciones.               |
|  **100 - 200 ms** | Aceptable. Puede comenzar a percibirse un pequeño retraso.                      |
| **Más de 200 ms** | Alta. La lentitud puede ser evidente para el usuario.                           |

### Otras herramientas para medir la latencia

Aunque Ping es la herramienta más utilizada, existen otras utilidades que proporcionan información adicional sobre la comunicación en la red.

| Herramienta                   | ¿Para qué sirve?                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| **Ping**                      | Mide el tiempo de respuesta (latencia) entre dos equipos.                                |
| **Traceroute (tracert)**      | Muestra cada router o salto que recorre un paquete hasta llegar al destino.              |
| **MTR (My Traceroute)**       | Combina Ping y Traceroute para monitorear continuamente la ruta y la latencia.           |
| **Herramientas de monitoreo** | Permiten medir la latencia de forma continua en servidores y aplicaciones en producción. |

##  Latencia vs Velocidad

Es común confundir los conceptos de **velocidad** y **latencia**, ya que ambos están relacionados con el rendimiento de una red. Sin embargo, representan aspectos completamente distintos de la comunicación.

* **Velocidad (Bandwidth o Ancho de banda):** indica la cantidad de datos que una conexión puede transmitir en un período de tiempo. Generalmente se mide en **Mbps (Megabits por segundo)** o **Gbps (Gigabits por segundo)**.

* **Latencia:** indica el tiempo que transcurre desde que un dispositivo envía una solicitud hasta que comienza a recibir la primera respuesta del servidor. Se mide en **milisegundos (ms)**.

En otras palabras:

* La **velocidad** responde a la pregunta: **¿Cuántos datos puedo transferir por segundo?**
* La **latencia** responde a la pregunta: **¿Cuánto tiempo debo esperar para empezar a recibir la respuesta?**

> **Una conexión puede tener una velocidad muy alta y, aun así, presentar una latencia elevada. Del mismo modo, una conexión con menor velocidad puede ofrecer una latencia muy baja.** Por ello, ambos conceptos deben evaluarse de forma independiente.

:::tip Analogía: dos camiones de carga

Imagina que debes transportar mercancía utilizando dos camiones.

![ejemplo de latencia vs velocidad](/cloud-img/latencia-vs-velocidad-ejemplo.png)

En este escenario:

* El **Camión `A`** representa una **latencia baja**, porque inicia el viaje de inmediato, aunque transporte menos información.
* El **Camión `B`** representa una **velocidad mayor**, ya que puede transportar mucha más carga, pero tiene una **latencia alta** porque tarda más tiempo en comenzar el recorrido.

:::

La diferencia fundamental es la siguiente:

* **Velocidad:** determina cuánta información puede transportarse una vez que la transmisión ha comenzado.
* **Latencia:** determina cuánto tiempo debes esperar para que esa transmisión empiece.

::: tip Ejemplo en Internet

Supongamos que deseas descargar un archivo de **5 GB**.

![ejemplo de latencia vs velocidad](/cloud-img/latencia-vs-velocidad-ejemplo_v2.png)
:::

## ¿Qué aplicaciones necesitan baja latencia?

Las aplicaciones interactivas requieren una latencia reducida para ofrecer una buena experiencia de usuario, por ejemplo:

* Videojuegos en línea.
* Videollamadas.
* Aplicaciones de realidad virtual y aumentada.
* Trading financiero.
* Sistemas IoT.
* Aplicaciones web con interacción en tiempo real.

En estos casos, una diferencia de apenas unos pocos milisegundos puede ser perceptible para el usuario.

## ¿Qué aplicaciones necesitan mayor velocidad?

Las aplicaciones que transfieren grandes volúmenes de datos dependen principalmente de una alta velocidad de transmisión, por ejemplo:

* Descarga de archivos grandes.
* Streaming de video en alta resolución (4K u 8K).
* Copias de seguridad en la nube.
* Transferencia de bases de datos.
* Sincronización de grandes cantidades de información.

En estos escenarios, una mayor velocidad reduce significativamente el tiempo total de transferencia.

## Tabla Comparativa

| Velocidad                                                        | Latencia                                                          |
| ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| Mide la cantidad de datos que pueden transferirse por segundo.   | Mide el tiempo que tarda en comenzar la comunicación.             |
| Se expresa en Mbps o Gbps.                                       | Se expresa en milisegundos (ms).                                  |
| Influye en el tiempo total de transferencia de grandes archivos. | Influye en la rapidez con la que se obtiene la primera respuesta. |
| Es fundamental para transferencias de gran volumen.              | Es fundamental para aplicaciones interactivas y en tiempo real.   |

> En una red, la velocidad y la latencia son métricas complementarias. Una conexión ideal combina un alto ancho de banda (gran velocidad) con una baja latencia, proporcionando tanto una rápida capacidad de transferencia como tiempos de respuesta casi inmediatos.
