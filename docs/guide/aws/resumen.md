# Guía de Estudio - AWS Certified Cloud Practitioner

## Cómputo en AWS

### 1. Amazon EC2

Amazon EC2 (Elastic Compute Cloud) es un servicio que ***permite crear y ejecutar servidores virtuales (llamados instancias) bajo demanda***, sin necesidad de comprar, configurar ni mantener hardware físico. Con EC2 puedes seleccionar características como ***CPU (capacidad de procesamiento), memoria (RAM), almacenamiento (normalmente mediante EBS), sistema operativo (Linux, Windows, etc) y red (dirección IP, VPC, seguridad, etc)***. AWS administra la infraestructura física, mientras tú tienes un mayor control sobre el sistema operativo y la configuración de la instancia, aplicar actualizaciones y configurar firewalls (grupos de seguridad).

Al lanzar una instancia de EC2, comience por seleccionar una ***imagen de máquina de Amazon (AMI)***. Una AMI es una ***plantilla o imagen de una máquina virtual*** que AWS utiliza para crear instancias EC2, puede incluir  el sistema operativo, la configuración, el software y los permisos de lanzamiento.

Los ***tipos de instancias EC2*** permiten elegir una combinación específica de CPU, memoria, almacenamiento y capacidad de red según las necesidades de la aplicación. AWS agrupa las instancias en familias optimizadas para diferentes tipos de cargas de trabajo.

Piensa en una pregunta muy sencilla:

> **¿Qué necesita más mi aplicación: equilibrio, CPU, memoria, almacenamiento o aceleración?**

| Tipo                      | ¿Está optimizado para...? | Palabra clave     |
| ------------------------- | ------------------------- | ----------------- |
| **General Purpose**       | Equilibrio entre recursos |  **Equilibrio** |
| **Compute Optimized**     | Procesador/CPU            |  **CPU**        |
| **Memory Optimized**      | Memoria RAM               |  **RAM**        |
| **Storage Optimized**     | Almacenamiento rápido     |  **Disco**      |
| **Accelerated Computing** | GPU/aceleradores          |  **GPU**        |

- **General Purpose**: Instancias que ofrecen un ***equilibrio entre CPU, memoria, red y almacenamiento***. Son buenas para aplicaciones que no tienen una necesidad extrema de un recurso específico, la carga de trabajo es incierto. **Por ejemplos:** Servidores web, Aplicaciones empresariales, Bases de datos pequeñas/medianas.

    >Si no necesitas especialmente mucha CPU, RAM o GPU → **General Purpose**.

- **Compute Optimized**: Instancias diseñadas para aplicaciones que necesitan ***mucho poder de procesamiento (CPU)***. **Por ejemplos:** Procesamiento por lotes, Servidores de videojuegos, Cálculos científicos, Procesamiento de datos,Servidores web de alto rendimiento.

    >Si el problema es **"necesito más capacidad de procesamiento"** → **Compute Optimized**.

- **Memory Optimized**: Instancias diseñadas para aplicaciones que necesitan ***grandes cantidades de memoria RAM***. Son útiles cuando necesitas mantener grandes cantidades de datos ***en memoria*** para acceder rápidamente. **Por ejemplos:** Bases de datos de alto rendimiento, Cachés, Análisis de grandes cantidades de datos, Procesamiento en memoria.

    >Si la pregunta habla de **grandes cantidades de datos en memoria** → **Memory Optimized**.

- **Storage Optimized**: Instancias diseñadas para aplicaciones que necesitan ***alto rendimiento y baja latencia de almacenamiento local***. Son especialmente útiles cuando la aplicación realiza muchas operaciones de ***lectura y escritura***. **Por ejemplos:** Bases de datos que requieren alta velocidad de I/O, Sistemas de archivos, Procesamiento de grandes cantidades de datos, Aplicaciones que realizan muchas operaciones de almacenamiento.

    >Si la pregunta habla de **muchas lecturas y escrituras rápidas** → **Storage Optimized**.

- **Accelerated Computing**: Instancias que utilizan aceleradores de  ***hardware especializado***, como ***GPU (unidades de procesamiento gráfico)***, para acelerar determinados tipos de procesamiento. **Por ejemplos:** Machine Learning, Inteligencia artificial, Procesamiento gráfico, Renderizado 3D, Cálculos científicos.

    >Si ves **IA, Machine Learning, GPU o gráficos** → **Accelerated Computing**.

**Categoría:** Computación / Máquinas virtuales

**Clave para el examen:**

* Máquinas virtuales en AWS
* Control sobre el sistema operativo
* Escalable
* Pago según el modelo de precios elegido
- La palabra Elastic es importante porque puedes aumentar o disminuir la capacidad de cómputo según tus necesidades.
- Cada instancia se ejecuta dentro de una zona de disponibilidad específica dentro de una región.

> **RECUERDA:** Amazon EC2 = **servidor virtual en AWS**.
> **Por ejemplo**, una empresa necesita ejecutar una aplicación web en un servidor Linux y quiere controlar el sistema operativo y la configuración. Puede utilizar una instancia EC2.
> **Truco de examen:** Si la pregunta habla de una máquina virtual, servidor virtual o necesidad de tener control sobre el sistema operativo, piensa en **EC2**.

>**RCUERDA**:
>
> **General Purpose** → equilibrio entre CPU, memoria y red.
>
> **Compute Optimized** → cargas que necesitan mucho CPU.
>
> **Memory Optimized** → cargas que necesitan mucha memoria.
>
> **Storage Optimized** → cargas que necesitan alto rendimiento de almacenamiento.
>
> **Accelerated Computing** → GPU y aceleradores especializados.

### 2. Amazon EC2 Auto Scaling

Es un servicio que permite ***aumentar o disminuir automáticamente la cantidad de instancias EC2 según la demanda*** de una aplicación, manteniendo una capacidad mínima, deseada y máxima, y sustituyendo instancias no saludables. Si aumenta el tráfico, Auto Scaling puede crear nuevas instancias EC2. Cuando el tráfico disminuye, puede eliminar instancias innecesarias para reducir costos. Esto permite mantener la capacidad necesaria, mejorar la disponibilidad y evitar pagar por instancias innecesarias.

**Categoría:** Escalabilidad automática

**Clave para el examen:**

* Aumenta instancias cuando aumenta la demanda
* Reduce instancias cuando disminuye la demanda
* Ayuda a mantener la disponibilidad
* Puede utilizar políticas de escalado
* Se puede combinar con Elastic Load Balancing

> **RECUERDA:** EC2 Auto Scaling = **ajusta automáticamente la cantidad de instancias EC2 según la demanda**.EC2 Auto Scaling no balancea el tráfico. Su función principal es ajustar la cantidad de instancias. Para distribuir tráfico entre ellas normalmente se utiliza Elastic Load Balancing (ELB). **Por ejemplo**, si una aplicación recibe mucho tráfico durante el día, Auto Scaling puede agregar instancias EC2. Cuando disminuye el tráfico, puede eliminarlas.
> **Truco de examen:** Si la pregunta habla de **agregar o eliminar automáticamente instancias EC2 según la demanda**, piensa en **EC2 Auto Scaling**.

### 3. Elastic Load Balancing (ELB)

Elastic Load Balancing (Equilibrio de carga elástico) es un servicio que **distribuye automáticamente el tráfico entrante entre varias instancias o recursos**, como instancias EC2, evitando que todo el tráfico llegue a un único servidor. Ayuda a mejorar la disponibilidad, escalabilidad y tolerancia a fallos de las aplicaciones.

**Categoría:** Balanceo de carga

**Clave para el examen:**

* Distribuye tráfico
* Puede trabajar con múltiples instancias
* Alta disponibilidad y tolerancia a fallos
* Detecta instancias que no están saludables
- Actúa a nivel regional y mitiga sobrecargas (incluso algún tipo de ataques).
* Se integra con EC2 Auto Scaling

> **RECUERDA:** ELB = **distribuye el tráfico entre servidores**. Elastic Load Balancing distribuye automáticamente las solicitudes entrantes entre múltiples recursos para mejorar la disponibilidad, escalabilidad y rendimiento de una aplicación. ELB no crea ni elimina instancias EC2. Esa función corresponde a EC2 Auto Scaling
> **Truco de examen:** Si una aplicación tiene varias instancias EC2 y necesitas distribuir las solicitudes entre ellas, piensa en **Elastic Load Balancing**.

### 4. Amazon SNS

Amazon SNS (Simple Notification Service) es un servicio de ***mensajería y publicación/suscripción (Pub/Sub)*** que ***permite enviar mensajes o notificaciones*** a múltiples suscriptores. Puede enviar mensajes a diferentes destinos como aplicaciones, funciones Lambda, colas SQS, correo electrónico y otros endpoints compatibles.

**Categoría:** Mensajería / Notificaciones

**Clave para el examen:**

* Comunicación de tipo publish/subscribe (publicador-suscriptor). 
* Envía mensajes a múltiples destinos
* Puede integrarse con SQS
* Utilizado para notificaciones y eventos.
- Enviar notificaciones por email.
- Crear sistemas de notificaciones.

> **RECUERDA:** SNS = **enviar/distribuir notificaciones y mensajes a múltiples destinatarios.**.
> **Ejemplo:** Una aplicación genera un evento "pedido realizado". SNS puede distribuir ese evento a diferentes sistemas interesados.
> **Truco de examen:** Si la pregunta habla de nviar una notificación a múltiples suscriptores, piensa en **SNS**.

### 5. Amazon SES

Amazon Simple Email Service (SES) es un servicio de AWS que ***permite enviar y recibir correos electrónicos*** utilizando la infraestructura de AWS. Su función principal es ***enviar emails desde aplicaciones***, por ejemplo, correos de registro, recuperación de contraseña, facturas o notificaciones.

**Categoría:** Mensajería / Email

**Clave para el examen:** ¿Para qué se utiliza?

- Enviar correos transaccionales.
- Enviar códigos de verificación.
- Recuperación de contraseñas.
- Enviar facturas o recibos.
- Enviar campañas de correo electrónico.
- También permite recibir emails y procesarlos.

> **RECUERDA:** Amazon SES = **servicio de AWS para enviar y recibir correos electrónicos**. **Ejemplo:** Una empresa necesita que su aplicación envíe automáticamente correos de confirmación de registro a sus usuarios. ¿Qué servicio debería utilizar? **Amazon SES**.

### 6. Amazon SQS

Amazon SQS (Simple Queue Service) es un servicio administrado de ***colas de mensajes que permite desacoplar componentes de una aplicación***. Este almacena mensajes temporalmente en una cola para que una aplicación pueda procesarlos de forma asíncrona. Los productores envían mensajes a una cola y los consumidores procesan esos mensajes posteriormente.

**Categoría:** Mensajería / Colas

**Clave para el examen:**

* Permite procesar mensajes de forma asíncrona
* Ayuda a manejar picos de tráfico
* No requiere administrar servidores
* Tipos principales: Standard y FIFO

> **RECUERDA:** SQS = **guardar mensajes para procesarlos después**.
> **Ejemplo:** Supongamos que tienes una tienda online y un usuario realiza una compra. La aplicación no tiene que procesar el pedido inmediatamente. Lo coloca en SQS y otro servicio lo recoge y procesa posteriormente.
> **Truco de examen:** Si la pregunta habla de desacoplar aplicaciones, poner mensajes en una cola o procesarlos posteriormente, piensa en **SQS**.

### 7. Amazon EventBridge

Es un servicio sin servidor que ***permite conectar aplicaciones y servicios mediante eventos***, detectando cuando ocurre algo y enviando automáticamente ese evento al servicio correspondiente.

**Categoría:** Eventos

**Clave para el examen:** ¿Para qué se utiliza?

- Conectar diferentes aplicaciones.
- Automatizar acciones cuando ocurre un evento.
- Crear arquitecturas orientadas a eventos (event-driven).
- Integrar servicios AWS.
- Ejecutar Lambda, enviar mensajes a SQS/SNS, iniciar workflows, etc.

> **RECUERDA:** Amazon EventBridge = **servicio que detecta eventos y los dirige automáticamente hacia los servicios que deben reaccionar a ellos**. **Por ejemplo**, Una empresa quiere ejecutar automáticamente una función Lambda cuando se crea un nuevo objeto en S3. ¿Qué servicio puede utilizar para detectar el evento y dirigirlo a Lambda? **Amazon EventBridge**. Diferencia importante: EventBridge decide cuándo y hacia dónde enviar un evento. Lambda ejecuta el código que realiza la acción.

### 8. AWS Elastic Beanstalk

Es un servicio administrado que permite ***desplegar y administrar aplicaciones rápidamente*** sin tener que configurar manualmente gran parte de la infraestructura subyacente. El desarrollador proporciona el código y Elastic Beanstalk se encarga de aprovisionar recursos como EC2, balanceadores de carga, Auto Scaling y monitoreo.

**Categoría:** Plataforma como servicio (PaaS)

**Clave para el examen:**

* Desplegar una aplicación sin gestionar la infraestructura (PaaS)
* AWS administra gran parte de la infraestructura
* Utiliza servicios como EC2, ELB y Auto Scaling
* El desarrollador se concentra principalmente en el código
* No es un servicio exclusivo de contenedores

> **RECUERDA:** Elastic Beanstalk = **sube tu código y AWS administra gran parte de la infraestructura**. Elastic Beanstalk NO es serverless, a diferencia de AWS Lambda, en Beanstalk normalmente tienes servidores subyacentes, como EC2, aunque AWS se encarga de gran parte de su administración. **Por ejemplo**, Supongamos que tienes una aplicación Node.js. Tú proporcionas el código de tu aplicación y Beanstalk automatiza buena parte del despliegue y configuración de los recursos necesarios.
> **Truco de examen:** Si quieres desplegar una aplicación rápidamente sin administrar manualmente toda la infraestructura, piensa en **Elastic Beanstalk**.

### 9. AWS Batch

Es un servicio administrado que ***permite ejecutar trabajos de procesamiento por lotes*** a gran escala. AWS Batch aprovisiona automáticamente los recursos de computación necesarios y permite ejecutar trabajos según las necesidades de procesamiento.

- **Trabajo por lotes**: Es un trabajo que no necesita ejecutarse inmediatamente y puede procesarse de manera automática.

**Categoría:** Procesamiento por lotes

**Clave para el examen:**

* Ejecuta trabajos por lotes
* Procesamiento de grandes cantidades de trabajos
* Aprovisionamiento automático de recursos
* Adecuado para cargas que no necesitan ejecutarse continuamente
* Puede utilizar diferentes tipos de recursos de computación
-  Programa, administra y escala automáticamente los recursos de computación

> **RECUERDA:** AWS Batch = **ejecutar trabajos por lotes a gran escala de forma automática.**.
> **Truco de examen:** Si la pregunta habla de procesamiento por lotes, simulaciones, análisis o trabajos programados, piensa en **AWS Batch**.

### 10. Amazon Lightsail

Es un servicio de nube que ofrece ***servidores privados virtuales (virtual private servers, VPS), almacenamiento, bases de datos y redes*** a un precio mensual predecible. Está orientado especialmente a usuarios que quieren una experiencia más sencilla que trabajar directamente con EC2

**Categoría:**Computación / VPS (servidores virtuales)

**Clave para el examen:**

* Recursos preconfigurados
* Precio predecible
* Ideal para aplicaciones pequeñas
* Alojar páginas web y aplicaciones sencillas.
- Ejecutar WordPress y otros CMS.
- Crear entornos pequeños de desarrollo.
* Alternativa simplificada a EC2

> **RECUERDA:** Lightsail = **AWS fácil para proyectos sencillos**. Piensa en Lightsail como un VPS simplificado de AWS. Lightsail no reemplaza a EC2. Está pensado principalmente para aplicaciones y cargas de trabajo simples, donde no necesitas toda la complejidad y flexibilidad de EC2.
> **Truco de examen:** Si una pequeña empresa necesita ejecutar un sitio web sencillo y busca simplicidad y precios predecibles, piensa en **Lightsail**.

### 11. AWS Outposts

Es una solución en la nube híbrida completamente administrada que ***extiende la infraestructura y los servicios de AWS a los centros de datos en las instalaciones del cliente (on-premises)***. Proporciona una experiencia coherente entre las instalaciones y la nube de AWS, y ofrece componentes de computación, almacenamiento y redes.

**Categoría:** Infraestructura híbrida / On-premises

**Clave para el examen:**

* AWS en las instalaciones del cliente
* Infraestructura híbrida
* Hardware administrado por AWS
* Permite ejecutar servicios AWS localmente
* Útil cuando existen requisitos de baja latencia o procesamiento local
- Ideal para aplicaciones de baja latencia, procesamiento de datos en ubicaciones remotas, migración y modernización de aplicaciones heredadas y cumplimiento de los requisitos de residencia de datos o conformidad normativa.

> **RECUERDA:** Outposts = **AWS dentro de tu propio centro de datos (data center)**. Permite utilizar servicios y APIs de AWS localmente, mientras AWS administra el hardware de Outposts. Outposts no significa mover toda AWS a tu empresa. Es una extensión de la infraestructura de AWS hacia tu entorno on-premises para crear una arquitectura híbrida.
> **Truco de examen:** Si la empresa necesita ejecutar servicios de AWS localmente/on-premises por requisitos de latencia, residencia de datos o procesamiento local, piensa en **AWS Outposts**.

### 12. AWS Lambda

Es un servicio de computación sin servidor (serverless) que ***ejecuta código en respuesta a eventos***, sin necesidad de aprovisionar o administrar servidores.

**Categoría**: Computación / Serverless

**Clave para el examen:**

- Escalado automático: De 0 a miles de instancias en segundos
- Pago por uso: Solo pagas por los milisegundos de ejecución
- Event-driven: Se ejecuta en respuesta a eventos de otros servicios
- Integraciones nativas: Se conecta con +200 servicios de AWS y SAAS

> **RECUERDA:** Lambda = **ejecuta código sin administrar servidores**. Lambda no es un servidor virtual. Es un servicio serverless y basado en funciones.

## Contenedores en AWS

### 1. Amazon ECR

Amazon ECR (Elastic Container Registry) es un ***registro administrado de imágenes de contenedores*** que ***permite almacenar, administrar y desplegar imágenes*** Docker y OCI (Open Container Initiative). Se integra directamente con servicios como ECS y EKS.

**Categoría:** Registro de imágenes / Contenedores

**Clave para el examen:**

* Almacena imágenes de contenedores
- Proporcionar imágenes a servicios como ECS y EKS.
* Registro privado administrado
* Compatible con imágenes Docker y OCI
* Se integra con ECS y EKS
* Puede utilizarse en procesos CI/CD

> **RECUERDA:** Amazon ECR = **almacena y administra imágenes de contenedores.**. Amazon ECR NO ejecuta los contenedores. Amazon ECR guarda las imágenes. **Por ejemplo**, Supongamos que tienes una aplicación Node.js y creas su imagen Docker. Amazon ECR almacena las imágenes para que otros servicios de AWS puedan descargarlas y ejecutarlas.

### 2. Amazon ECS

Amazon ECS (Elastic Container Service) es un servicio de ***orquestación de contenedores*** completamente administrado por AWS. ***Permite ejecutar y administrar contenedores*** Docker a gran escala, sin gestionar la infraestructura de orquestación. Puede ejecutar contenedores utilizando EC2 o AWS Fargate. Amazon ECS ofrece dos opciones principales, la diferencia fundamental está en quién administra los servidores:

- **Amazon ECS con Amazon EC2**: Es ideal para las pequeñas y medianas empresas que necesitan un control total de la infraestructura. Adecuado para aplicaciones personalizadas que requieren configuraciones de red o hardware específicas.
- **Amazon ECS con AWS Fargate**: Es ideal para startups o equipos pequeños que crean aplicaciones web con tráfico variable. Es una opción sin servidor, por lo que los equipos pueden centrarse en el desarrollo mientras Amazon ECS se ocupa del escalado y la orquestación.

**Categoría:** Orquestación de contenedores

**Clave para el examen:**

* Servicio de contenedores de AWS
* No requiere administrar Kubernetes
- Ejecutar contenedores.
- Escalar la cantidad de contenedores.
* Integración con otros servicios AWS

> **RECUERDA:** Amazon ECS = **servicio que administra y ejecuta tus contenedores. Orquestador de contenedores de AWS**.
> **Truco de examen:** Si quieres ejecutar contenedores y no necesitas Kubernetes, piensa en **ECS**.

### 3. Amazon EKS

Amazon EKS (Elastic Kubernetes Service) es un servicio administrado que ***permite ejecutar Kubernetes en AWS***. AWS administra el plano de control de Kubernetes, mientras que dependiendo de la configuración puedes utilizar EC2 o Fargate para ejecutar las cargas de trabajo.

- **Amazon EKS con Amazon EC2**: ideal para queienes necesitan un control total de la infraestructura. Ofrece una personalización profunda de las instancias de EC2 junto con la escalabilidad de Kubernetes, lo que resulta ideal para cargas de trabajo complejas a gran escala.

- **Amazon EKS con AWS Fargate**: es ideal para los equipos que desean la flexibilidad de Kubernetes sin tener que administrar servidores.

**Categoría:** Kubernetes / Orquestación de contenedores

**Clave para el examen:**

* Kubernetes administrado
* AWS administra el control plane
* Puede utilizar EC2
* Puede utilizar Fargate
* Compatible con herramientas y aplicaciones del ecosistema Kubernetes

> **RECUERDA:** Amazon EKS = **Kubernetes administrado por AWS**.
> **Truco de examen:** Si la pregunta menciona específicamente Kubernetes, piensa en **EKS**.

### 4. AWS Fargate

Es un servicio de AWS que ***permite ejecutar contenedores sin tener que administrar servidores (Serverless) o instancias EC2***. Fargate es una plataforma de alojamiento de contenedores y paga solo por los recursos necesarios para ejecutar los contenedores. Fargate puede utilizarse con servicios como **Amazon ECS y Amazon EKS**.

**Categoría:** Contenedores / Serverless

**Clave para el examen:**

* Ejecuta contenedores
* No necesitas administrar servidores
* No necesitas administrar instancias EC2
* Compatible con ECS y EKS
* AWS administra la infraestructura subyacente
- Contenedores sin gestionar servidores

> **RECUERDA:** Fargate = **contenedores sin servidores que administrar**. Fargate no es un reemplazo de ECS o EKS. Fargate es el motor de ejecución que puede utilizarse con: Amazon ECS y Amazon EKS.

Esta diferencia es muy importante para el examen:

| Servicio    | Función                                          | Recuerda                     |
| ----------- | ------------------------------------------------ | ---------------------------- |
| **ECS**     | Orquestación de contenedores de AWS              |  **Contenedores con AWS**  |
| **EKS**     | Kubernetes administrado                          |  **Kubernetes**            |
| **ECR**     | Almacenar imágenes                               |  **Imágenes**              |
| **Fargate** | Ejecutar contenedores sin administrar servidores |  **Serverless containers** |

# Tabla rápida para el examen

| Servicio               | Función principal                                                     | Recuerda                             |
| ---------------------- | --------------------------------------------------------------------- | ------------------------------------ |
| **EC2**                | Servidores virtuales                                                  | **Máquina virtual**                  |
| **EC2 Instance Types** | Elegir recursos según la carga                                        | **CPU / RAM / almacenamiento / GPU** |
| **EC2 Auto Scaling**   | Aumentar o reducir instancias EC2 automáticamente                     | **Más/menos servidores**             |
| **ELB**                | Distribuir tráfico entre recursos                                     | **Reparte tráfico**                  |
| **SNS**                | Publicar y distribuir mensajes a múltiples suscriptores               | **Notificaciones / Pub-Sub**         |
| **SES**                | Enviar y recibir correos electrónicos                                 | **Email**                            |
| **SQS**                | Almacenar mensajes en una cola para procesarlos después               | **Cola / desacoplar**                |
| **EventBridge**        | Detectar y enrutar eventos                                            | **Eventos → acciones**               |
| **Elastic Beanstalk**  | Desplegar aplicaciones administrando gran parte de la infraestructura | **Sube código → AWS gestiona**       |
| **AWS Batch**          | Ejecutar trabajos por lotes                                           | **Batch = lotes**                    |
| **Lightsail**          | VPS sencillo con precios predecibles                                  | **AWS fácil / VPS**                  |
| **AWS Outposts**       | Ejecutar infraestructura AWS en instalaciones propias                 | **AWS on-premises**                  |
| **Lambda**             | Ejecutar código sin administrar servidores                            | **Funciones serverless**             |
| **ECR**                | Almacenar imágenes de contenedores                                    | **Guarda imágenes**                  |
| **ECS**                | Ejecutar y administrar contenedores                                   | **Orquestador AWS**                  |
| **EKS**                | Ejecutar Kubernetes administrado                                      | **Kubernetes**                       |
| **Fargate**            | Ejecutar contenedores sin administrar servidores                      | **Serverless containers**            |

**Las diferencias que más conviene memorizar**

**EC2 vs Elastic Beanstalk**

> **EC2** = tú administras mucho más de la infraestructura y del sistema operativo.
> **Elastic Beanstalk** = proporcionas el código y AWS administra gran parte de la infraestructura.

**EC2 vs Lambda**

> **EC2** = ejecutas aplicaciones en un servidor virtual que tú administras.
> **Lambda** = ejecutas código sin administrar servidores.

**EC2 vs Lightsail**

> **EC2** = mayor control, flexibilidad y opciones de configuración.
> **Lightsail** = experiencia simplificada, recursos preconfigurados y precios más predecibles.

**EC2 vs AWS Batch**

> **EC2** = proporciona servidores virtuales para ejecutar aplicaciones y cargas de trabajo.
> **AWS Batch** = ejecuta y administra trabajos de procesamiento por lotes a gran escala.

**EC2 Auto Scaling vs ELB**

> **EC2 Auto Scaling** = aumenta o disminuye automáticamente la cantidad de instancias EC2.
> **ELB** = distribuye el tráfico entre múltiples instancias o recursos.

> **Recuerda:** Auto Scaling crea/elimina capacidad; ELB distribuye tráfico.

**SNS vs SQS**

> **SNS** = publica y distribuye mensajes a múltiples suscriptores.
> **SQS** = almacena mensajes en una cola para que los consumidores los procesen posteriormente.

> **Recuerda:** SNS = distribuir; SQS = cola.

**SNS vs SES**

> **SNS** = envía mensajes y notificaciones a múltiples destinos.
> **SES** = se utiliza principalmente para enviar y recibir correos electrónicos.

> **Recuerda:** SNS = **notificaciones**; SES = **email**.

**SQS vs EventBridge**

> **SQS** = almacena mensajes en una cola hasta que un consumidor los procesa.
> **EventBridge** = detecta eventos y los enruta automáticamente hacia un destino.

> **Recuerda:** SQS = mensajes esperando; EventBridge = eventos que activan acciones.

**SNS vs EventBridge**

> **SNS** = distribuye mensajes a múltiples suscriptores mediante un modelo Pub/Sub.
> **EventBridge** = detecta eventos, aplica reglas y los enruta hacia destinos.

> **Recuerda:** SNS = publicar/distribuir; EventBridge = eventos/reglas.

**ECR vs ECS**

> **ECR** = almacena y administra imágenes de contenedores.
> **ECS** = ejecuta y administra contenedores.

> **Recuerda:** ECR = guardar la imagen; ECS = ejecutar el contenedor.

**ECR vs EKS**

> **ECR** = almacena imágenes de contenedores.
> **EKS** = ejecuta Kubernetes administrado por AWS.

**ECS vs EKS**

> **ECS** = servicio de orquestación de contenedores propio de AWS.
> **EKS** = servicio administrado para ejecutar Kubernetes.

> **Recuerda:** ECS = contenedores AWS; EKS = Kubernetes.

**ECS vs Fargate**

> **ECS** = administra y orquesta los contenedores.
> **Fargate** = proporciona la infraestructura serverless donde se ejecutan los contenedores sin administrar servidores.

> **Recuerda:** ECS = orquestador; Fargate = ejecución serverless.

**EKS vs Fargate**

> **EKS** = proporciona Kubernetes administrado para orquestar contenedores.
> **Fargate** = permite ejecutar esos contenedores sin administrar servidores.

> **Recuerda:** EKS = Kubernetes; Fargate = sin servidores.

**ECS con EC2 vs ECS con Fargate**

> **ECS + EC2** = tú administras las instancias EC2 que ejecutan los contenedores.
> **ECS + Fargate** = AWS administra los servidores subyacentes y tú te concentras en los contenedores.

**ECR vs ECS vs Fargate**

> **ECR** = almacena las imágenes de los contenedores.
> **ECS** = orquesta y administra los contenedores.
> **Fargate** = ejecuta los contenedores sin administrar servidores.

**Elastic Beanstalk vs Lambda**

> **Elastic Beanstalk** = despliegas una aplicación y AWS administra gran parte de la infraestructura subyacente.
> **Lambda** = ejecutas funciones individuales en un entorno serverless sin administrar servidores.

> **Recuerda:** Beanstalk = aplicación; Lambda = función.

**Lambda vs Fargate**

> **Lambda** = ejecuta funciones/código en respuesta a eventos sin administrar servidores.
> **Fargate** = ejecuta contenedores sin administrar servidores.

> **Recuerda:** Lambda = funciones; Fargate = contenedores.

**Lightsail vs Elastic Beanstalk**

> **Lightsail** = proporciona recursos simplificados como VPS para aplicaciones pequeñas y sencillas.
> **Elastic Beanstalk** = facilita el despliegue de aplicaciones y administra gran parte de la infraestructura.

> **Recuerda:** Lightsail = **VPS sencillo**; Beanstalk = **despliegue de aplicaciones**.

**AWS Outposts vs AWS Cloud**

> **AWS Cloud** = ejecutas tus recursos en la infraestructura de AWS.
> **AWS Outposts** = ejecutas infraestructura y servicios de AWS dentro de tus propias instalaciones.

> **Recuerda:** Outposts = AWS on-premises.

**AWS Batch vs Lambda**

> **AWS Batch** = está diseñado para ejecutar trabajos por lotes que requieren procesamiento a gran escala.
> **Lambda** = ejecuta funciones individuales en respuesta a eventos.

> **Recuerda:** Batch = trabajos por lotes; Lambda = funciones/eventos.

**EventBridge vs Lambda**

> **EventBridge** = detecta y enruta eventos hacia un destino.
> **Lambda** = ejecuta el código que realiza la acción.

> **Recuerda:** EventBridge = detecta/ruta; Lambda = ejecuta.


## Redes en AWS

### 1. Amazon VPC

Amazon VPC (Virtual Private Cloud) es un servicio que ***permite crear una red virtual aislada dentro de AWS***, donde puedes ejecutar recursos como EC2, RDS y otros servicios. Te permite controlar aspectos de la red como ***rangos de direcciones IP, subredes, tablas de rutas, gateways y reglas de seguridad***.

**Categoría:** Red virtual

**Clave para el examen:**

* Red virtual aislada en AWS
* Permite crear subredes
* Controla el tráfico de red
* Utiliza tablas de rutas
* Puede conectarse a Internet mediante un Internet Gateway
* Puede conectarse con redes locales mediante VPN o Direct Connect
- Una VPC tiene alcance regional pertenece a una region.
- Ofrece tres beneficios: aumenta la seguridad, ahorro de tiempo y le otorga control total sobre la ubicación de sus recursos, la conectividad y la seguridad.

> **RECUERDA:** Amazon VPC = **tu propia red privada dentro de AWS**.
> **Truco de examen:** Si la pregunta habla de crear una red aislada, subredes, IPs y controlar el tráfico de recursos AWS, piensa en **Amazon VPC**.

### 2. Subred (Subnet)

Es una ***división de una VPC*** que permite organizar los recursos dentro de diferentes segmentos de red. Una subred está asociada a ***una única Zona de Disponibilidad (AZ)***. Puede ser ***pública*** si tiene una ruta hacia un Internet Gateway (puerta de enlace de internet), o ***privada*** si no tiene acceso directo a Internet mediante un Internet Gateway (puerta de enlace de internet).

**Categoría:** Red / Segmentación de VPC

**Clave para el examen:**

* Pertenece a una VPC
* Está asociada a una sola AZ
* Una subred pública puede tener acceso a Internet mediante un Internet Gateway
* Las subredes privadas normalmente utilizan NAT Gateway para acceso saliente a Internet

> **RECUERDA:** Subred = **una sección de tu VPC**.
> **Truco de examen:** Si preguntan dónde colocar recursos dentro de una VPC, piensa en **subredes**.

### 3. Internet Gateway

Una Internet Gateway (IGW - Puerta de enlace de Internet) es un componente de una VPC que ***permite la comunicación entre los recursos de una VPC e Internet***. Para que una instancia pueda comunicarse directamente con Internet, normalmente necesita una ruta hacia el Internet Gateway y una dirección IP pública o Elastic IP.

**Categoría:** Conectividad a Internet

**Clave para el examen:**

* Conecta una VPC con Internet
* Se utiliza principalmente con subredes públicas
* No proporciona por sí sola una dirección IP pública
* Debe existir una ruta hacia el Internet Gateway
- Permite entrada y salida de tráfico hacia Internet.

> **RECUERDA:** Internet Gateway = **puerta de la VPC hacia Internet**.
> **Truco de examen:** VPC → Internet = **Internet Gateway**. Una diferencia importante que hay que tener en cuenta es **Internet Gateway**, Conecta la VPC con Internet, mientras que **NAT Gateway**,	permite salida de subred privada hacia Internet.

### 4. NAT Gateway

Una NAT Gateway (Puerta de enlace de NAT) permite que los recursos de una ***subred privada puedan iniciar conexiones hacia Internet***, pero evita que Internet pueda iniciar conexiones directamente hacia esos recursos. Normalmente se coloca en una ***subred pública*** y las subredes privadas utilizan una ruta hacia ella.

**Categoría:** Conectividad / VPC

**Clave para el examen:**

* Permite tráfico saliente desde subredes privadas
* Los recursos privados no necesitan una IP pública
* Se coloca en una subred pública
* Utiliza un Internet Gateway para salir a Internet
- Subred privada necesita salir a internet sin recibir conexiones entrantes"
* Internet no puede iniciar directamente una conexión hacia el recurso privado a través de NAT Gateway
- Se usa principalmente para que servidores privados puedan descargar actualizaciones, acceder a APIs externas, etc.

> **RECUERDA:** NAT Gateway = **salida a Internet desde una subred privada, pero Internet no puede iniciar una conexión hacia ella.**.
> **Truco de examen:** Si una EC2 está en una subred privada y necesita descargar actualizaciones de Internet, piensa en **NAT Gateway**.

### 5. Virtual Private Gateway

Una Virtual Private Gateway (VGW - Puerta de enlace privada virtual) es un componente de AWS que ***permite conectar una VPC con una red externa mediante una VPN***, normalmente utilizando AWS Site-to-Site VPN. Se utiliza principalmente como extremo de AWS para establecer una conexión VPN con una red local.

**Categoría:** Conectividad híbrida / VPN

**Clave para el examen:**

* Se asocia a una VPC
* Se utiliza con Site-to-Site VPN
* Permite conectar una VPC con una red local (on-premises)
* Es administrada por AWS

> **RECUERDA:** Virtual Private Gateway = **puerta de entrada/salida de la VPC hacia una VPN.**. Solo recuerda que Virtual Private Gateway no es la VPN. Es el componente de AWS asociado a la VPC que participa en la conexión.
> **Truco de examen:** Si una empresa quiere conectar su **data center con una VPC mediante VPN**, piensa en **Virtual Private Gateway + Site-to-Site VPN**.

### 6. Virtual Private Network

Una Virtual Private Network (VPN - Red Privada Virtual) crea una ***conexión segura y cifrada*** que permite comunicar una red o dispositivo con otra red a través de Internet. En AWS, una Site-to-Site VPN conecta una red local (on-premises) con una VPC de forma segura.

**Categoría:** Conectividad red

**Clave para el examen:**

- Conexión segura y cifrada a través de Internet.

> **RECUERDA:** Virtual Private Network = **conexión segura y cifrada entre redes**. No confundas VPN con Virtual Private Gateway. La VPN es la conexión; Virtual Private Gateway es el componente de AWS que permite conectar esa VPN con la VPC.

### 7. Lista de control de acceso de red

Una Network ACL (NACL) es un firewall que ***controla el tráfico que entra y sale de una subred (subnet)*** dentro de una VPC. Las reglas pueden ***permitir (allow) o denegar (deny)*** tráfico y las NACL son ***stateless (sin estado)***, esto significa que debes controlar explícitamente entrada y salida.

**Categoría:** Seguridad de red

**Clave para el examen:**

* Se aplica a subredes (subnets)
* Controla tráfico entrante y saliente
* Permite reglas ALLOW y DENY
* Las reglas se evalúan en orden
* Debes considerar tráfico de entrada y salida por separado

> **RECUERDA:** NACL = **seguridad de la subred**.
> **Truco de examen:** Si la pregunta menciona subred + reglas ALLOW/DENY + stateless, piensa en **NACL**.

### 8. Grupos de seguridad

Los Security Groups (Grupos de seguridad) son firewalls virtuales que ***controlan el tráfico entrante y saliente al nivel de los recursos***, como instancias EC2. Son ***stateful (con estado)***, por lo que si se permite una conexión entrante, la respuesta correspondiente puede regresar automáticamente sin necesidad de crear una regla de salida específica para esa respuesta.

**Categoría:** Seguridad de red

**Clave para el examen:**

* Se asocian a recursos como EC2
* Controlan tráfico entrante y saliente
* Solo permiten reglas **ALLOW**
* No tienen reglas explícitas de DENY
- De forma predeterminada, un grupo de seguridad deniega todo el tráfico entrante y permite todo el tráfico saliente.

> **RECUERDA:** Security Group = **firewall virtual que controla el tráfico de una instancia o recurso.**.

### 9. DNS

El DNS (Domain Name System - Sistema de nombres de dominio) es el ***sistema que traduce nombres de dominio*** fáciles de recordar, como `example.com`, en direcciones IP que utilizan los dispositivos para comunicarse. En AWS, ***Amazon Route 53*** proporciona funcionalidades de DNS.

**Categoría:** Resolución de nombres

**Clave para el examen:**

* Traduce **dominios → direcciones IP**
* Facilita el acceso a aplicaciones mediante nombres
* Route 53 es el servicio DNS principal de AWS

> **RECUERDA:** DNS = **Sistema que traduce nombres de dominio en direcciones IP**.
> **Truco de examen:** Si una pregunta habla de resolver un dominio hacia una dirección IP, piensa en **DNS**.

### 10. AWS Client VPN

Es un servicio VPN administrado que permite a ***usuarios individuales conectarse de forma segura, desde Internet, a recursos privados dentro de una VPC o una red AWS utilizando una conexión VPN***. Es ideal para empleados que trabajan de forma remota y necesitan acceder a recursos internos privados.

**Categoría:** VPN / Acceso remoto

**Clave para el examen:**

* Conecta usuarios individuales.
* Utiliza una conexión VPN cifrada.
- Permite acceso remoto desde Internet.
* Permite acceder a recursos privados
* Es un servicio administrado
* Ideal para empleados que trabajan remotamente

> **RECUERDA:** Client VPN = **usuario → AWS/red corporativa**. Diferencia importante: Client VPN conecta usuarios, mientras que Site-to-Site VPN conecta redes completas. 
> **Truco de examen:** Si la pregunta habla de empleados remotos conectándose a recursos privados de AWS, piensa en **AWS Client VPN**.

### 11. AWS Site-to-Site VPN

AWS Site-to-Site VPN permite establecer una ***conexión VPN cifrada entre una red local (on-premises) y una VPC de AWS*** utilizando Internet. Está diseñada para ***conectar redes completas***, no usuarios individuales.

**Categoría:** VPN / Conectividad híbrida

**Clave para el examen:**

* Utiliza una conexión VPN cifrada
* Utiliza Internet como medio de transporte
* Permite conectar redes completas
- Conecta una red on-premises con AWS.
* Puede utilizar Virtual Private Gateway o Transit Gateway
- Se puede utilizar en la migración de aplicaciones y para lograr una comunicación segura 

> **RECUERDA:** Site-to-Site VPN = **conecta una red completa de tu empresa con una red en AWS**.
> **Truco de examen:**
> **Client VPN** = Una persona/empleado se conecta remotamente.
> **Site-to-Site VPN** = Una oficina o Data Center completo se conecta a AWS.

### 12. AWS PrivateLink

AWS PrivateLink ***permite acceder de forma privada a servicios de AWS o servicios de otros VPC*** sin enviar el tráfico a través de Internet público. Utiliza ***VPC endpoints*** para permitir que los recursos de una VPC consuman servicios de forma privada, incluso servicios ofrecidos desde otras VPC.

**Categoría:** Conectividad privada / VPC

**Clave para el examen:**

- Acceso privado a servicios.
- El tráfico no necesita pasar por Internet público.
* No requiere exponer servicios públicamente
- Permite consumir servicios de otras VPC.
* Utiliza VPC endpoints
- Se utiliza para conectar los clientes de su VPC a recursos, otras VPC y puntos de conexión.
- No es una VPN.

> **RECUERDA:** PrivateLink = **acceso privado a servicios sin pasar por Internet**. PrivateLink no es una VPN. Su objetivo principal es proporcionar acceso privado a servicios.
> **Truco de examen:** Si la pregunta dice "acceder a un servicio de forma privada sin utilizar Internet público", piensa en **AWS PrivateLink**.

### 13. AWS Direct Connect

AWS Direct Connect ***permite establecer una conexión de red dedicada entre una red local (on-premises) y la VPC en la nube de AWS***, evitando utilizar Internet como conexión principal. Proporciona una conexión más consistente y puede ayudar a reducir la latencia y mejorar el rendimiento.

**Categoría:** Conectividad híbrida / Conexión dedicada

**Clave para el examen:**

* Conexión dedicada entre on-premises y AWS.
* No utiliza Internet como camino principal
- Ofrece mayor consistencia y rendimiento.
* Útil para grandes cantidades de tráfico
- Puede proporcionar menor latencia y mayor ancho de banda.
- Puede combinarse con otras soluciones de seguridad, pero Direct Connect por sí solo no es una VPN cifrada.

> **RECUERDA:** Direct Connect = **conexión dedicada hacia AWS**.
> **Truco de examen:** Si la pregunta menciona conexión dedicada, alto ancho de banda, rendimiento consistente o grandes cantidades de datos entre on-premises y AWS, piensa en **Direct Connect**.

**Diferencia rápida para el examen**

| Servicio             | ¿Qué conecta?        | ¿Cómo?             | Palabra clave        |
| -------------------- | -------------------- | ------------------ | -------------------- |
| **Client VPN**       | Usuario → AWS/red | VPN                | **Usuario remoto**   |
| **Site-to-Site VPN** | Red → AWS         | VPN sobre Internet (utiliza Internet como medio de transporte) | **Su objetivo es conectar redes.**        |
| **PrivateLink**      | VPC → Servicio       | Conexión privada   | **Servicio privado** |
| **Direct Connect**   | On-premises → AWS | Conexión dedicada (No depende de Internet público como camino principal)  | **Dedicada**         |

### 14. Amazon Route 53

Es un servicio administrado de **DNS**, registro de dominios y enrutamiento de tráfico de AWS.

Servicio de ***DNS (Domain Name System), registro de dominios y enrutamiento de tráfico que traduce nombres de dominio a direcciones IP*** con alta disponibilidad y baja latencia. Permite dirigir usuarios hacia diferentes recursos y utilizar políticas de enrutamiento como ***simple, weighted, latency, failover (Conmutación por error) y geolocation***.

**Categoría:** DNS / Enrutamiento de tráfico

**Clave para el examen:**

* Servicio DNS de AWS
* Registro de dominios
* Health checks
* Enrutamiento basado en diferentes políticas
* Puede dirigir tráfico hacia recursos de AWS

> **RECUERDA:** Route 53 = **DNS + dominios + enrutamiento**.
> **Truco de examen:** Si la pregunta habla de DNS, nombres de dominio o dirigir usuarios hacia diferentes recursos, piensa en **Route 53**.

### 15. Amazon CloudFront

Servicio de ***red de entrega de contenido (CDN, Content Delivery Network)*** que distribuye contenido web, videos, APIs y aplicaciones a los usuarios con baja latencia, sirviéndolo desde ubicaciones periféricas (edge locations) cercanas al usuario.

**Categoría:** CDN / Distribución de contenido

**Clave para el examen:**

* CDN de AWS
* Utiliza edge locations
* Reduce la latencia
* Distribuye contenido estático y dinámico
* Puede integrarse con S3, ALB y otros orígenes

> **RECUERDA:** CloudFront = **contenido más cerca del usuario**.
> **Truco de examen:** Si la pregunta habla de reducir latencia al entregar contenido globalmente, piensa en **CloudFront**.

### 15. AWS Global Accelerator

Es un servicio que ***mejora la velocidad y disponibilidad*** de una aplicación global, haciendo que los usuarios se conecten a través de la ***red global de AWS***, en lugar de depender directamente de Internet hasta llegar a tu aplicación. Proporciona ***IPs anycast estáticas*** que dirigen a los usuarios hacia endpoints saludables y cercanos mediante la red de AWS.

**Categoría:** Rendimiento global / Networking

**Clave para el examen:**

* Mejora el rendimiento global
* Utiliza la red global de AWS
* Proporciona IPs estáticas
* Detecta endpoints saludables
* Puede realizar failover entre regiones

> **RECUERDA:** Global Accelerator = **acelera aplicaciones globales usando la red global de AWS + IPs Anycast estáticas + failover (Conmutación por error).** Una forma sencilla de recordarlo: mejor ruta de red (camino más rápido) hacia tu aplicación. **Truco de examen:**, Si te preguntan "¿Qué servicio mejora el rendimiento y disponibilidad de una aplicación global mediante la red global de AWS y proporciona IPs estáticas Anycast?", piensa **AWS Global Accelerator**.

### 16. Amazon Transit Gateway

Amazon Transit Gateway ***permite conectar múltiples VPCs y redes locales*** mediante un único gateway central. Funciona como un ***hub de red***, evitando tener que crear conexiones individuales entre cada VPC.

**Categoría:** Conectividad / Red centralizada

**Clave para el examen:**

* Conecta múltiples VPCs
* Puede conectar redes on-premises
* Arquitectura tipo **hub-and-spoke**
* Simplifica redes grandes
* Puede trabajar con Site-to-Site VPN y Direct Connect

> **RECUERDA:** Transit Gateway = **hub central para conectar muchas redes**.
> **Truco de examen:** Si una empresa tiene muchas VPCs y necesita conectarlas, piensa en **Transit Gateway**.

### 17. VPC Peering

***Conexión de red privada entre dos VPCs*** (de la misma u otras cuentas) que permite comunicarlas directamente sin pasar por internet ni por un punto central.

**Categoría**: Networking

> **RECUERDA:** VPC Peering = **Conectar dos VPCs entre sí**. Para muchas VPCs, el patrón más adecuado es AWS Transit Gateway.

### 18. Amazon API Gateway

Es un servicio administrado que permite ***crear, publicar, proteger, monitorear y administrar APIs***. Actúa como puerta de entrada para las APIs: enruta y transforma solicitudes, hace de reverse proxy, autentica, limita el ritmo (rate limiting), guarda en caché, termina TLS y registra métricas. Es un componente clave en arquitecturas serverless.

**Categoría:** API / Integración de aplicaciones

**Clave para el examen:**

* Crear y administrar APIs
* Puede integrarse con Lambda
* Controla acceso a APIs
* Permite monitoreo y gestión del tráfico
* Admite APIs REST, HTTP y WebSocket

> **RECUERDA:** API Gateway = **puerta de entrada para APIs**.
> **Truco de examen:** Si la pregunta habla de exponer una función Lambda mediante una API HTTP, piensa en **API Gateway**.

# Tabla rápida para el examen

| Servicio                    | Función principal                                         | Recuerda                      |
| --------------------------- | --------------------------------------------------------- | ----------------------------- |
| **Amazon VPC**              | Crear una red virtual aislada en AWS                      | Tu red en AWS           |
| **Subred**                  | Dividir una VPC en segmentos de red                       | División de VPC           |
| **Internet Gateway**        | Conectar una VPC con Internet                             | VPC ↔ Internet            |
| **Virtual Private Gateway** | Conectar una VPC mediante VPN                             | VPC ↔ VPN                |
| **AWS Client VPN**          | Conectar usuarios remotos con AWS                         | Usuario → AWS             |
| **AWS Site-to-Site VPN**    | Conectar una red local con AWS mediante VPN               | Red → AWS + VPN           |
| **AWS PrivateLink**         | Acceder privadamente a servicios                          | Sin Internet              |
| **AWS Direct Connect**      | Conectar una red local con AWS mediante conexión dedicada | Conexión dedicada         |
| **Network ACL**             | Controlar tráfico de una subred                           | Subred + Stateless        |
| **Security Group**          | Controlar tráfico de recursos                             | Recurso + Stateful        |
| **DNS**                     | Traducir dominios a direcciones IP                        | Nombre → IP               |
| **Amazon Route 53**         | DNS, dominios y enrutamiento                              | DNS + Routing             |
| **Amazon CloudFront**       | Distribuir contenido globalmente                          | CDN + Edge                |
| **AWS Global Accelerator**  | Acelerar tráfico hacia aplicaciones                       | Mejor ruta                |
| **Amazon Transit Gateway**  | Conectar múltiples VPC y redes                            | Hub de redes*             |
| **NAT Gateway**             | Permitir salida a Internet desde subredes privadas        | Privada → Internet        |
| **Amazon API Gateway**      | Crear y administrar APIs                                  | Puerta de entrada de APIs |

**Las diferencias que más conviene memorizar**

**VPC vs Subred**

> **VPC** = la red virtual completa en AWS.
> **Subred** = una división de esa VPC.

**Internet Gateway vs NAT Gateway**

> **Internet Gateway** = permite la comunicación entre una VPC y Internet.
> **NAT Gateway** = permite que recursos de subredes privadas salgan a Internet sin estar directamente expuestos.

**Security Group vs Network ACL**

> **Security Group** = protege recursos, como EC2; es stateful.
> **NACL** = protege subredes; es stateless.

**Client VPN vs Site-to-Site VPN**

> **Client VPN** = conecta usuarios individuales/remotos con AWS.
> **Site-to-Site VPN** = conecta una red completa con AWS.

**Site-to-Site VPN vs Direct Connect**

> **Site-to-Site VPN** = conexión cifrada mediante Internet.
> **Direct Connect** = conexión de red dedicada hacia AWS.

**Virtual Private Gateway vs Internet Gateway**

> **Virtual Private Gateway** = conecta una VPC con una VPN.
> **Internet Gateway** = conecta una VPC con Internet.

**PrivateLink vs Site-to-Site VPN**

> **PrivateLink** = acceso privado desde una VPC hacia servicios.
> **Site-to-Site VPN** = conexión entre una red local y AWS.

**Route 53 vs DNS**

> **DNS** = sistema que traduce nombres de dominio a IP.
> **Route 53** = servicio de AWS que proporciona DNS, registro de dominios y enrutamiento.

**CloudFront vs Global Accelerator**

> **CloudFront** = distribuye contenido mediante una CDN y edge locations.
> **Global Accelerator** = acelera el tráfico de red hacia aplicaciones utilizando la red global de AWS.

**Transit Gateway vs VPC Peering**

> **Transit Gateway** = conecta muchas VPC y redes mediante un hub central.
> **VPC Peering** = conecta dos VPC directamente.

**Transit Gateway vs Direct Connect**

> **Transit Gateway** = conecta y centraliza múltiples redes/VPCs.
> **Direct Connect** = proporciona una conexión dedicada entre una red local y AWS.

**API Gateway vs Internet Gateway**

> **API Gateway** = puerta de entrada para APIs y aplicaciones.
> **Internet Gateway** = puerta de entrada de una VPC hacia Internet.

## Almacenamiento en AWS

### 1. Almacén de instancias Amazon EC2

El almacén de instancias (Instance Store) es un ***almacenamiento de bloques temporal y físicamente conectado al host de una instancia EC2***. Proporciona un almacenamiento de muy baja latencia, pero los ***datos se pierden*** cuando la instancia se ***detiene, termina o falla***, dependiendo del escenario.

**Categoría:** Almacenamiento de bloques temporal para EC2

**Clave para el examen:**

* Datos temporales como cachés o búferes.
* Está físicamente conectado al host.
* Muy rápido y de baja latencia.
* Los datos pueden perderse cuando la instancia se detiene o termina.
* No es persistente como EBS.

> **RECUERDA:** Instance Store = **rápido pero temporal**.
> **Truco de examen:** Si la pregunta menciona datos temporales, caché, archivos temporales o almacenamiento de muy baja latencia asociado directamente a EC2, piensa en **Instance Store**. Si necesitas conservar los datos después de detener la instancia, piensa en **EBS**.

### 2. Amazon EBS

Amazon EBS (Elastic Block Store) proporciona ***volúmenes de almacenamiento de bloques persistentes para las instancias Amazon EC2***. Puedes utilizarlos como discos duros virtuales para almacenar sistemas operativos, aplicaciones y datos. Se respaldan con instantáneas (snapshots - copias de seguridad), se redimensionan y se reconectan, con cifrado de datos en reposo.

- **Instantáneas de EBS (snapshots)**: son copias de seguridad de un volumen de EBS en un momento dado. Se pueden utilizar para la recuperación de desastres, la migración de datos, el redimensionamiento de volúmenes y para crear copias de seguridad consistentes. Son incrementales y se almacenan en Amazon S3

**Categoría:** Almacenamiento de bloques persistente

**Clave para el examen:**

* Los datos son persistentes.
* Permite crear, modificar y eliminar volúmenes.
* Puede utilizarse como disco de arranque de EC2.
* Permite realizar snapshots (instantáneas - copias de seguridad)  y crear nuevos volúmenes EBS.
* Está diseñado para ofrecer almacenamiento de baja latencia y alta disponibilidad dentro de una zona de disponibilidad.

> **RECUERDA:** EBS = **disco duro virtual persistente para EC2**.
> **Truco de examen:** Si necesitas que una instancia EC2 tenga un disco persistente, piensa en **EBS**. No confundas EBS con S3: EBS es bloques, S3 es objetos.

### 3. Amazon Data Lifecycle Manager

Amazon Data Lifecycle Manager (DLM) ***permite automatizar la creación, retención y eliminación de snapshots (instantáneas) de EBS*** mediante políticas de ciclo de vida.

**Categoría:** Automatización de backups

**Clave para el examen:**

* Automatiza la administración de EBS Snapshots (instantáneas).
* Define cuándo crear snapshots (instantáneas).
* Define cuánto tiempo conservarlas.
* Puede eliminar automáticamente snapshots (instantáneas) antiguas.
* Reduce la necesidad de administrar backups manualmente.

> **RECUERDA:** DLM = **automatiza el ciclo de vida de las snapshots (instantáneas)**.
> **Truco de examen:** Si la pregunta dice, "crear snapshots automáticamente cada cierto tiempo y eliminar las antiguas", piensa en **Amazon Data Lifecycle Manager**.

### 4. Amazon S3

Amazon S3 (Simple Storage Service) es un servicio de ***almacenamiento de objetos de alta disponibilidad y completamente administrado para almacenar y recuperar cualquier cantidad de datos como objetos***. Ofrece una durabilidad, lo que significa que sus datos cuentan con una alta protección contra pérdidas. 

Amazon S3 almacena los archivos como objetos en contenedores, conocidos como ***buckets***, estos contenedores se usan para almacenar objetos en Amazon S3 y los buckets ***tienen un nombre único a nivel global*** en todo AWS. Un ***objeto*** en Amazon S3 es la unidad fundamental de almacenamiento de datos y pueden ser de cualquier tipo de archivo imágenes, videos, documentos o datos de aplicaciones, cada objeto está compuesto por los siguientes elementos: Clave (Key - ruta completa del objeto), Valor (Value - datos del objeto) y Metadatos (información asociada al objeto). 

Amazon S3 permiten elegir diferentes niveles de costo y acceso dependiendo de la frecuencia con la que se necesitan los datos.

- Acceso frecuente (Frequent Access)
    - **S3 Standard (uso normal/frecuente)**: Almacenamiento de uso general para aplicaciones, sitios web dinámicos, distribución de contenido. El objeto se agrega a S3 Standard de forma predeterminada.
    - **S3 Express One Zone**: Almacenamiento S3 de muy baja latencia y alto rendimiento, dentro de una única zona de disponibilidad.
- Acceso poco frecuente (Infrequent Access)
    - **S3 Standard-IA**: Se utiliza para los datos a los que se accede con menor frecuencia, pero que requieren un acceso rápido cuando es necesario. Ofrece la alta durabilidad, el alto rendimiento y la baja latencia de S3 Standard. Es ideal si desea almacenar copias de seguridad a largo plazo, archivos de recuperación de desastres, etc.
    - **S3 One Zone-IA**: Almacena los datos en una única zona de disponibilidad, lo que reduce los costos en comparación con S3 Standard-IA, que utiliza tres zonas. Es ideal para clientes que buscan un almacenamiento asequible para los datos de acceso poco frecuente sin necesidades de alta disponibilidad.
- Archivado y acceso muy poco frecuente
    - **S3 Glacier Instant Retrieval**: Almacenamiento para los datos archivados con acceso muy poco frecuente y que requieren una recuperación inmediata (en milisegundos). 
    - **S3 Glacier Flexible Retrieval**: Almacenamiento de bajo costo para los datos archivados a los que se accede una o dos veces al año. Con S3 Glacier Flexible Retrieval, se puede acceder a sus datos en tan solo 1 a 5 minutos mediante una recuperación acelerada.
    - **S3 Glacier Deep Archive**: Almacenamiento de menor costo de Amazon S3. Admite la retención a largo plazo y la preservación digital de datos a los que se accede tal vez una o dos veces al año. Tienen un tiempo de recuperación predeterminado de 12 horas. Está diseñado para clientes que retienen conjuntos de datos por un período de 7 a 10 años o más.
- **S3 Intelligent-Tiering**: Está diseñada para datos con patrones de acceso desconocidos o cambiantes. Almacena los objetos en tres niveles: un nivel de acceso frecuente, un nivel de acceso poco frecuente y un nivel de acceso instantáneo al archivo.
- **S3 Outposts**: Está diseñada para datos que necesitan ser almacenados en entornos locales, pero que también requieren integración con la nube. Ofrece almacenamiento de objetos a su entorno en las instalaciones de AWS Outposts mediante las características y la API de Amazon S3, y está pensado para cargas de trabajo con requisitos de residencia local de datos. 
**Categoría:** Almacenamiento de objetos

**Clave para el examen:**

- Ofrece una durabilidad del 99,999999999 % (11 nueves).
* Alta durabilidad.
* Escalabilidad prácticamente ilimitada.
* No funciona como un disco tradicional de EC2.
- Se paga solo por lo usado, privado por defecto.sola
- El cifrado en reposo está habilitado por defecto en los buckets nuevos.
- S3 ofrece capacidades de cifrado para proteger los datos en reposo y en tránsito.

> **RECUERDA:** S3 = **objetos dentro de buckets**.
> **Truco de examen:** Si necesitas almacenar archivos, imágenes, videos, backups o grandes cantidades de objetos, piensa en **S3**.

> **RECUERDA:**
>
>**S3 Standard**: Almacenamiento para datos a los que accedes frecuentemente. **Palabra clave**: Frequent access.
> 
>**S3 Express One Zone**: Almacenamiento S3 de muy baja latencia y alto rendimiento, dentro de una sola AZ. **Palabras clave**: Low latency + High performance + One AZ.
>
>**S3 Standard-IA (estándar, pero acceso poco frecuente)**: para datos que se almacenan durante mucho tiempo pero se acceden ocasionalmente. **PalabraS clave**: Infrequent access + Multi-AZ.
>
> **S3 One Zone-IA**: Es parecido a Standard-IA, pero está en una sola AZ. **Palabras clave**: poco acceso + una AZ + menor resiliencia.
>
>**S3 Glacier Instant Retrieval**: Almacenamiento de archivo para datos que se consultan raramente, pero cuando los necesitas quieres recuperarlos inmediatamente. **Palabras clave**: archivo + recuperación inmediata.
>
>**S3 Glacier Flexible Retrieval**: Es para datos archivados que no necesitas recuperar inmediatamente. La recuperación puede tardar desde minutos hasta horas dependiendo de la opción. **Palabras clave**: FLEXIBLE = puedo esperar.
>
>**S3 Glacier Deep Archive**: Es el almacenamiento para archivado a muy largo plazo y acceso extremadamente poco frecuente. **Palabras clave**: lo guardo y casi nunca lo toco.
>
>**S3 Intelligent-Tiering**: AWS mueve automáticamente los objetos entre niveles de acceso según cambien los patrones de acceso.
>
>**S3 Outposts**: S3 ejecutándose en AWS Outposts, es decir, almacenamiento S3 en tu entorno on-premises, manteniendo la infraestructura de AWS. **Palabras clave**: S3 fuera de la región AWS / en tu entorno local

### 5. Amazon EFS

Amazon EFS (Elastic File System) es un ***sistema de archivos administrado, elástico y compartido***, que escala automáticamente a petabytes y permite que múltiples instancias EC2 accedan simultáneamente a los mismos datos en varias zonas de disponibilidad. Funciona mediante el protocolo del sistema de archivos de red (NFS - Network File System) en Linux. Los tipos de almacenamiento de Amazon EFS:

- **EFS Standard y EFS Standard - Acceso poco frecuente (Standard-IA)** ofrecen resiliencia Multi-AZ y los niveles más altos de durabilidad y disponibilidad. Tienen un costo más alto debido a su mayor disponibilidad y durabilidad.
- **EFS One Zone y EFS One Zone - Acceso poco frecuente (EFS One Zone-IA)** proporcionan ahorros adicionales, ya que guardan los datos en una única zona de disponibilidad. 
- **EFS Archive** permite reducir los costos para los datos a los que se accede solo unas pocas veces al año o menos y que no requieren las latencias inferiores a milisegundos de EFS Standard. EFS Archive ofrece un precio de almacenamiento hasta un 50 % más bajo en comparación con EFS.

**Categoría:** Almacenamiento de archivos administrado

**Clave para el examen:**

* Sistema de archivos compartido.
* Es regional (multi-AZ) y compatible con Linux/POSIX.
* Puede ser utilizado simultáneamente por múltiples instancias.
* Escala automáticamente según las necesidades.
* Está diseñado para cargas de trabajo Linux.
* No necesitas administrar servidores de archivos.
-  EFS crece y se contrae según la demanda.

> **RECUERDA:** EFS = **carpeta compartida para Linux**.
> **Truco de examen:** Si varias instancias EC2 necesitan acceder simultáneamente al mismo sistema de archivos, piensa en **EFS**.

### 6. Amazon FSx

Es una familia de servicios administrados de alto rendimiento que proporciona ***sistemas de archivos especializados*** para diferentes necesidades y cargas de trabajo. El servicio Amazon FSx ofrece cuatro sistemas de archivos diferentes:

- **Amazon FSx para Windows File Server** brinda almacenamiento compartido completamente administrado creado a partir de Windows Server. Ofrece una amplia gama de capacidades para el acceso a datos, la administración de datos y las tareas administrativas. Windows Server y entornos Windows.
- **Amazon FSx para NetApp ONTAP** proporciona almacenamiento compartido completamente administrado en la nube de AWS con las populares capacidades de acceso y administración de datos de ONTAP. Migración, flexibilidad y continuidad del negocio
- **Amazon FSx para OpenZFS** proporciona almacenamiento compartido completamente administrado, que está creado a partir del sistema de archivos OpenZFS y al que se accede a través del protocolo NFS (sistema de archivos de red). Baja latencia, análisis de datos y desarrollo/pruebas.
- **Amazon FSx para Lustre** proporciona almacenamiento compartido completamente administrado con la escalabilidad y el rendimiento del popular sistema de archivos Lustre. Alto rendimiento diseñado para cargas de trabajo que requieren gran capacidad de procesamiento, machine Learning (ML), computación de alto rendimiento (HPC) y Big Data.

**Categoría:** Almacenamiento de archivos administrado

**Clave para el examen:**

* Sistemas de archivos completamente administrados.
* AWS administra la infraestructura.
* Ofrece diferentes sistemas de archivos.
* Permite elegir un sistema según la aplicación.
* Incluye Windows File Server, NetApp ONTAP, OpenZFS y Lustre.

> **RECUERDA:** FSx = **sistemas de archivos especializados administrados por AWS**.
> **Truco de examen:** Si la pregunta necesita un file system específico como Windows, NetApp, OpenZFS o Lustre, piensa en **FSx**.

### 7. AWS Storage Gateway

Es un servicio de ***almacenamiento en la nube híbrida*** que permite conectar el ***almacenamiento local (on-premises)*** con los servicios de almacenamiento de AWS. Con él, puede ampliar su almacenamiento local a la nube y, al mismo tiempo, mantener un acceso de baja latencia a los datos de uso frecuente. Storage Gateway ofrece tres tipos distintos de puertas de enlace:

- **Amazon S3 File Gateway** permite que aplicaciones locales accedan a Amazon S3 mediante una interfaz de sistema de archivos, utilizando protocolos de archivos estándar.
- **Volume Gateway** proporciona volúmenes de almacenamiento mediante una interfaz **iSCSI** para aplicaciones locales, mientras utiliza almacenamiento de AWS para respaldar los datos. Funciona como un puente entre la infraestructura en las instalaciones y el almacenamiento en la nube de AWS.
- **Tape Gateway** proporciona almacenamiento virtual de cintas para aplicaciones de backup existentes, permitiendo que las organizaciones almacenen sus backups en AWS sin tener que mantener físicamente una infraestructura de cintas.

**Categoría:** Almacenamiento híbrido

**Clave para el examen:**

* Conecta infraestructura **on-premises con AWS**.
* Permite acceder a almacenamiento en la nube desde entornos locales.
* Facilita migraciones y backups.
* Tiene diferentes tipos de gateways.
* Reduce la necesidad de mantener grandes cantidades de almacenamiento local.

> **RECUERDA:** Storage Gateway = **puente entre on-premises y AWS**.
> **Truco de examen:** Si una empresa quiere mantener aplicaciones on-premises pero utilizar almacenamiento de AWS, piensa en **Storage Gateway**.

> **RECUERDA:** S3 File Gateway = **archivos locales → objetos en S3**.
> **Truco de examen:** Si una aplicación local necesita acceder a S3 utilizando una interfaz de archivos, piensa en **S3 File Gateway**.

> **RECUERDA:** Tape Gateway = **cintas de backup → AWS**.
> **Truco de examen:** Si la pregunta habla de una empresa que utiliza cintas físicas o software de backup basado en cintas y quiere migrar a AWS, piensa en **Tape Gateway**.

> **RECUERDA:** Volume Gateway = **bloques + iSCSI + on-premises + AWS**.
> **Truco de examen:** Si la pregunta menciona una aplicación local que necesita acceder a volúmenes de bloques mediante iSCSI, piensa en **Volume Gateway**.

# Tabla rápida para el examen

| Servicio                    | Función principal                                    | Recuerda                   |
| --------------------------- | ---------------------------------------------------- | -------------------------- |
| **EC2 Instance Store**      | Almacenamiento de bloques temporal para EC2          | **Rápido / Temporal**      |
| **EBS**                     | Almacenamiento de bloques persistente para EC2       | **Disco persistente**      |
| **EBS Snapshots**           | Copias de seguridad de volúmenes EBS                 | **Backup de EBS**          |
| **Data Lifecycle Manager**  | Automatiza creación y eliminación de snapshots       | **Automatizar backups**    |
| **S3**                      | Almacenamiento de objetos                            | **Objetos / Buckets**      |
| **S3 Storage Classes**      | Diferentes opciones según frecuencia de acceso       | **Optimizar costos**       |
| **S3 Buckets**              | Contenedores donde se almacenan objetos              | **Contenedor de objetos**  |
| **EFS**                     | Sistema de archivos compartido y elástico            | **Archivos / Linux**       |
| **FSx**                     | Sistemas de archivos administrados especializados    | **File systems**           |
| **FSx Windows File Server** | Sistema de archivos para aplicaciones Windows        | **Windows / SMB / AD**     |
| **FSx NetApp ONTAP**        | Sistema de archivos empresarial basado en NetApp     | **NetApp / Empresarial**   |
| **FSx OpenZFS**             | Sistema de archivos basado en OpenZFS                | **OpenZFS / NFS**          |
| **FSx Lustre**              | Sistema de archivos de alto rendimiento              | **HPC / ML / Rendimiento** |
| **Storage Gateway**         | Conecta almacenamiento on-premises con AWS           | **On-premises ↔ AWS**      |
| **S3 File Gateway**         | Acceso a S3 mediante interfaz de archivos            | **Archivos → S3**          |
| **Tape Gateway**            | Emula cintas virtuales para backups                  | **Cintas / Backup**        |
| **Volume Gateway**          | Proporciona almacenamiento de bloques mediante iSCSI | **Bloques / iSCSI**        |

**Las diferencias que más conviene memorizar**

**EBS vs Instance Store**

> **EBS** = almacenamiento de bloques persistente para EC2.
> **Instance Store** = almacenamiento de bloques temporal y de muy baja latencia.

**EBS vs S3**

> **EBS** = bloques, funciona como un disco para EC2.
> **S3** = objetos, almacena archivos dentro de buckets.

**S3 vs EFS**

> **S3** = almacenamiento de objetos mediante buckets.
> **EFS** = sistema de archivos compartido que pueden utilizar múltiples instancias.

**EFS vs FSx**

> **EFS** = sistema de archivos elástico y compartido, principalmente para Linux.
> **FSx** = sistemas de archivos especializados como Windows, NetApp, OpenZFS y Lustre.

**FSx Windows vs FSx Lustre**

> **FSx Windows** = Windows + SMB + Active Directory.
> **FSx Lustre** = HPC + Machine Learning + alto rendimiento*.

**Storage Gateway vs S3**

> **Storage Gateway** = conecta on-premises con AWS.
> **S3** = servicio de almacenamiento de objetos en AWS.

**S3 File Gateway vs Tape Gateway vs Volume Gateway**

> **S3 File Gateway** = archivos → S3.
> **Tape Gateway** = cintas → AWS.
> **Volume Gateway** = bloques + iSCSI → AWS.

**EBS Snapshot vs Data Lifecycle Manager**

> **EBS Snapshot** = crea una copia de seguridad de EBS.
> **Data Lifecycle Manager** = automatiza cuándo crear, conservar y eliminar esas snapshots.

## Bases de datos en AWS

### 1. Amazon RDS

Amazon RDS (Relational Database Service) es un servicio administrado de AWS que ***permite crear, configurar y ejecutar bases de datos relacionales en la nube sin tener que administrar directamente los servidores, el sistema operativo, parches, copias de seguridad o gran parte del mantenimiento de la base de datos***. RDS es compatible con motores como MySQL, PostgreSQL, MariaDB, Oracle, SQL Server y Amazon Aurora. AWS administra la **infraestructura subyacente**, pero tú sigues siendo responsable de aspectos como: ***datos, permisos, configuración de acceso y seguridad de tu aplicación.***

**Categoría:** Base de datos relacional administrada

**Clave para el examen:**

* Soporta backups, recuperación y alta disponibilidad mediante características como Multi-AZ.
- Base de datos relacional
- AWS administra la infraestructura
- Parches y mantenimiento
- Backups automáticos

>**RECUERDA**: Amazon RDS = **base de datos relacional administrada por AWS.** **Por ejemplo**, Una aplicación necesita almacenar usuarios, productos y pedidos en una base de datos SQL. Puedes usar Amazon RDS para crear esa base de datos sin encargarte manualmente de instalar y mantener el servidor. **Truco de examen**: Si la pregunta habla de una base de datos SQL/relacional y quieres que AWS se encargue de gran parte de la administración del servidor, piensa en **Amazon RDS**.

### 2. Amazon Aurora

Base de datos relacional administrada, diseñada para ayudar a reducir las operaciones de E/S innecesarias, es ***compatible con MySQL y PostgreSQL***, diseñada para la nube. Replica seis copias de los datos en tres zonas de disponibilidad y ofrece copias de seguridad continuas en Amazon S3.

**Categoría:** Base de datos relacional

**Clave para el examen:**

* Compatible con MySQL y PostgreSQL.
* Alto rendimiento y alta disponibilidad.
* Almacenamiento distribuido.
* Administrada mediante Amazon RDS.

>**RECUERDA**: Amazon Aurora = **Motor relacional de AWS, compatible con MySQL/PostgreSQL, optimizado para rendimiento y disponibilidad**. **Por ejemplo**, una aplicación de comercio electrónico necesita una base de datos SQL que pueda manejar millones de consultas y crecer conforme aumenten los usuarios. Amazon Aurora puede proporcionar ese almacenamiento relacional con alta disponibilidad. **Truco de examen**: Si ves MySQL/PostgreSQL + alto rendimiento + alta disponibilidad + base de datos administrada por AWS, piensa en **Amazon Aurora**.

### 3. AWS DMS

AWS DMS (Database Migration Service) es un servicio administrado que ***permite migrar bases de datos relacionales, bases de datos no relacionales y otros tipos de almacenes de datos*** hacia AWS, minimizando el tiempo de interrupción.

**Categoría:** Migración de bases de datos

**Clave para el examen:**

- Migrar bases de datos.
- Puede migrar hacia AWS, desde AWS o entre bases de datos.
- Permite mantener la base de datos de destino sincronizada durante la migración.
- Puede realizar migraciones homogéneas y heterogéneas.

>**RECUERDA**: AWS DMS = **migrar bases de datos.** **Por ejemplo**, desde una base de datos local hacia AWS o entre diferentes motores de bases de datos. **Truco de examen**: Si aparece, como migrar una base de datos con mínimo tiempo de interrupción, piensa en **AWS DMS**.

### 4. Amazon DynamoDB

Es un servicio de ***base de datos NoSQL*** completamente administrado que proporciona un rendimiento rápido y predecible para las estructuras de ***datos de clave-valor y de documentos***. DynamoDB es sin servidor (serverless), lo que significa que no tienes que aprovisionar, aplicar parches ni administrar servidores.

**Categoría:** Base de datos NoSQL

**Clave para el examen:**

- Latencia de un solo dígito en milisegundos a cualquier escala.
- Cifrado en reposo automático.
* Clave-valor.
* Escalabilidad automática.
* Disponibilidad del 99,999 % con datos replicados en varias AZ;

>**RECUERDA**: Amazon DynamoDB = **Base de datos NoSQL, serverless, rápida y altamente escalable.** **Truco de examen**: Si la pregunta menciona, NoSQL, alta velocidad / baja latencia, escalabilidad automática, piensa en **Amazon DynamoDB**. 

### 5. Amazon ElastiCache

Es un servicio de ***almacenamiento de caché en memoria*** completamente administrado que permite almacenar temporalmente datos utilizados frecuentemente para reducir la carga de las bases de datos y mejorar el rendimiento de las aplicaciones. Funciona principalmente con Valkey, Redis OSS y Memcached.

**Categoría:** Caché/Base de datos en memoria

**Clave para el examen:**

* Datos en memoria.
* Reduce latencia.
* Reduce carga sobre bases de datos.
* Mejora rendimiento.
* Datos consultados frecuentemente.

>**RECUERDA**: Amazon ElastiCache = **guardar datos frecuentes en memoria para responder más rápido.** No lo confundas con **DynamoDB**, ya que este almacena los datos principales; **ElastiCache** almacena temporalmente datos para acelerar el acceso.

### 6. Amazon DocumentDB

Es un servicio de ***base de datos NoSQL orientada a documentos*** completamente administrado y compatible con las aplicaciones que utilizan **MongoDB**. Permite almacenar datos en documentos con formato similar a **JSON**, facilitando el manejo de datos flexibles y estructuras que pueden cambiar con el tiempo.

**Categoría:** Base de datos NoSQL / Documentos

**Clave para el examen:**

* Base de datos orientada a documentos.
* Compatible con MongoDB.
* Almacena datos en documentos similares a JSON.
* Es completamente administrado por AWS.
* Ideal para datos con estructuras flexibles.
* Permite escalar y manejar grandes cantidades de datos.

> **RECUERDA**: Amazon DocumentDB = **base de datos de documentos compatible con MongoDB**. No lo confundas con **DynamoDB**: ambos son NoSQL, pero **DocumentDB está orientado a documentos y es compatible con MongoDB**, mientras que **DynamoDB utiliza un modelo clave-valor y documentos**.

### 7. AWS Backup

Es un servicio ***completamente administrado*** que permite **centralizar, automatizar y administrar las copias de seguridad (backups)** de diferentes servicios de AWS desde un solo lugar. Permite crear políticas de backup para definir **qué recursos respaldar, cuándo hacerlo y durante cuánto tiempo conservar las copias**.

**Categoría:** Copias de seguridad / Protección de datos

**Clave para el examen:**

* Centraliza los backups de varios servicios de AWS.
* Automatiza las copias de seguridad.
* Permite definir políticas de backup.
* Permite establecer períodos de retención.
* Facilita la restauración de datos.
* Ayuda a proteger los datos frente a pérdidas o fallos.

> **RECUERDA**: AWS Backup = **servicio centralizado para automatizar y administrar backups de recursos de AWS**. **Backup = proteger y recuperar datos**, no almacenar datos para el uso normal de una aplicación.

### 8. Amazon Neptune

Es un servicio ***completamente administrado de base de datos de grafos*** diseñado para almacenar y consultar datos donde las **relaciones entre los elementos son muy importantes**. Permite representar los datos mediante **nodos y relaciones**, facilitando consultas sobre conexiones complejas.

**Categoría:** Base de datos de grafos

**Clave para el examen:**

* Base de datos orientada a **grafos**.
* Utiliza **nodos y relaciones**.
* Ideal para datos altamente conectados.
* Útil para redes sociales, recomendaciones y detección de fraudes.
* Servicio completamente administrado por AWS.
* Optimizado para consultar relaciones entre datos.

> **RECUERDA**: Amazon Neptune = **base de datos de grafos para trabajar con relaciones entre datos**. **Por ejemplo**, una red social puede utilizar Neptune para representar usuarios como nodos y sus amistades, seguidores o conexiones como relaciones. **Truco de examen**: Si en el examen aparecen conceptos como nodos, relaciones, conexiones, redes sociales o datos altamente conectados, piensa en **Amazon Neptune**.

# Tabla rápida para el examen

| Servicio                       | Función principal                          |  Recuerda                   |
| ------------------------------ | ------------------------------------------ | ----------------------------- |
| **RDS**                        | Base de datos relacional administrada      |  **SQL / Relacional**      |
| **RDS Security**               | Proteger RDS                               |  **Acceso + cifrado + red** |
| **Aurora**                     | Relacional compatible con MySQL/PostgreSQL |  **Relacional AWS**          |
| **DMS**                        | Migrar bases de datos                      |  **Mover BD**               |
| **DynamoDB**                   | NoSQL clave-valor/documentos               |  **NoSQL rápido**            |
| **ElastiCache**                | Caché en memoria                           |  **Acelerar**               |
| **DocumentDB**                 | Base de datos de documentos                |  **MongoDB compatible**     |
| **AWS Backup**                 | Backups centralizados                      |  **Copias de seguridad**    |
| **Neptune**                    | Base de datos de grafos                    |  **Relaciones**            |

**Las diferencias que más conviene memorizar**

**RDS vs Aurora**

>**RDS** = servicio administrado para bases de datos relacionales (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora).
>**Aurora** = un motor de base de datos relacional (Compatible con MySQL y PostgreSQL) creado por AWS que funciona dentro de RDS.

**RDS vs DynamoDB**

>**RDS** = Relacional, SQL, Tablas y relaciones.
>**DynamoDB** = NoSQL, Clave-valor / documentos. Escalabilidad y baja latencia.

**DynamoDB vs DocumentDB**

>**DynamoDB** = NoSQL, clave-valor / documentos.
>**DocumentDB** = NoSQL,Documentos, Compatible con MongoDB.

**DMS vs AWS Backup**

> **DMS** = migrar/mover datos.
> **AWS Backup** = copiar/proteger datos.

## IA/ML y análisis de datos en AWS

### 1. Amazon Comprehend

Servicio de procesamiento de lenguaje natural (NLP) que utiliza machine learning para ***analizar y comprender texto***.

**Categoría:** IA / NLP

**Clave para el examen:**

* Analiza texto.
* Detecta sentimientos.
* Identifica entidades.
* Extrae frases clave.
* Detecta información personal.
- Clasificación de contenido.
- Análisis del sentimiento de los clientes y supervisión del cumplimiento.

>**RECUERDA:** Comprehend = **comprender texto.** **Por ejemplo**, Si le das el texto: "Estoy muy satisfecho con el servicio de Amazon." **AmazonComprehend** puede detectar que el sentimiento es positivo y reconocer Amazon como una organización.

### 2. Amazon Polly

Es un servicio de inteligencia artificial de AWS que ***convierte texto escrito en voz hablada*** mediante tecnología de ***texto a voz*** (Text-to-Speech, TTS).

**Categoría:** IA / Texto a voz (TTS)

**Clave para el examen:**

- Convierte texto en audio
- Diferentes idiomas y voces
- Voz generada por IA
- Lectura de texto en voz alta
- Asistentes virtuales.

>**RECUERDA:** Amazon Polly = **convierte texto en voz**. **Por ejemplo**, si le das el texto: "Hola, bienvenido a AWS.", **Amazon Polly** puede generar un archivo de audio con la voz que dice esa frase.

### 3. Amazon Transcribe

Es un servicio de inteligencia artificial de AWS que ***convierte voz o audio en texto escrito automáticamente*** mediante tecnología de reconocimiento automático del habla (ASR).

**Categoría:** IA / Voz a texto (STT)

**Clave para el examen:**

- Voz a texto
- Transcripción de llamadas de clientes.
- Subtitulado automático y generación de metadatos para contenido multimedia
- Transcribir grabaciones
- Reconocimiento de diferentes idiomas

>**RECUERDA:** Amazon Transcribe = **Voz a texto**. **Por ejemplo**, Si tienes una grabación de una reunión donde alguien dice: "La reunión será mañana a las 10 de la mañana.", **Amazon Transcribe** puede convertir ese audio (grabación) en texto escrito.

### 4. Amazon Translate

Es un servicio de traducción automática que utiliza machine learning para ***traducir texto de un idioma a otro de forma automática***.

**Categoría:** IA / Traducción

**Clave para el examen:**

- Traducción automática
- Traducción entre idiomas
- Texto → texto traducido
- Machine Translation
- Múltiples idiomas
- Traducción en tiempo real

>**RECUERDA:** Amazon Translate = **traduce texto automáticamente**. **Por ejemplo**, si le das el texto: "Hello, how are you?" y le indicas que lo traduzca al español, **Amazon Translate** puede generar el texto: "Hola, ¿cómo estás?".

### 5. Amazon Kendra

Servicio de ***búsqueda inteligente*** basado en machine learning que permitee ***buscar información dentro de documentos y fuentes de datos de una organización utilizando lenguaje natural***.

**Categoría:** Búsqueda inteligente / Enterprise Search

**Clave para el examen:**

- Búsqueda inteligente.
- Buscar dentro de documentos.
- Comprende preguntas en lenguaje natural.
- Busca información empresarial.
- Base de conocimiento
- Puede conectarse a diferentes fuentes de datos.
- Chatbots e integración de búsqueda de aplicaciones

>**RECUERDA:** Amazon Kendra = **Buscador inteligente de documentos**. **Por ejemplo**, Una empresa tiene cientos de documentos internos sobre políticas, manuales y procedimientos. Un empleado pregunta: "¿Cuántos días de vacaciones tengo?", **Amazon Kendra** puede buscar en los documentos conectados y encontrar la información relevante.

### 6. Amazon Rekognition

Servicio de ***análisis de imágenes y videos*** que utiliza machine learning para detectar objetos, personas, actividades y otros elementos visuales.

**Categoría:** IA / Visión artificial

**Clave para el examen:**

- Análisis de imágenes y videos.
- Detección de personas y rostros.
- Reconocimiento de objetos.
- Reconocimiento facial y comparación facial.
- Moderación de contenido.
- Verificación de identidad.
- Análisis de contenido multimedia.

>**RECUERDA:** Amazon Rekognition = **Ver y reconocer imágenes/videos**. **Por ejemplo**, si le das una imagen de un perro, **Amazon Rekognition** puede identificar que es un perro y proporcionar información sobre la raza.

### 7. Amazon Textract

Servicio que utiliza machine learning para ***extraer texto, escritura y datos estructurados de documentos e imágenes***.

**Categoría:** IA / OCR y extracción de documentos

**Clave para el examen:**

- Extraer automáticamente texto de documentos
- OCR
- Extracción de texto de formularios 
- Documentos escaneados
- Extracción de datos
- Procesamiento automático de documentos

>**RECUERDA:** Amazon Textract = **extraer texto y datos de documentos.**

### 8. Amazon Lex

Servicio para crear ***interfaces conversacionales y chatbots*** utilizando reconocimiento automático de voz y procesamiento de lenguaje natural para entender lo que dice o escribe el usuario.

**Categoría:** IA / Chatbots

**Clave para el examen:**

* Chatbots.
* Conversaciones.
* Texto y voz
* Comprensión del lenguaje natural (NLP).
- Reconocimiento de voz (ASR)

>**RECUERDA:** Amazon Lex = **construir un Chatbot que entiende y conversa**. **Por ejemplo**, un cliente escribe: “Quiero reservar una mesa para mañana.” **Amazon Lex** puede entender la intención del usuario y obtener los datos necesarios para realizar la reserva. Un **truco de examen**: Si la pregunta habla de crear un chatbot o una interfaz conversacional que interactúe con usuarios mediante texto o voz, piensa en **Amazon Lex**.

### 9. Amazon Personalize

Es un servicio de inteligencia artificial y machine learning de AWS que ***crea recomendaciones personalizadas para cada usuario***, basándose en sus intereses, comportamiento e interacciones y preferencias de los usuarios.

**Categoría:** IA / Recomendaciones

**Clave para el examen:**

* Recomendaciones de productos.
* Contenido personalizado.
* Experiencias personalizadas.
* Basado en comportamiento del usuario.
- Recomendaciones personalizadas
- Recomendación de contenido
- Comportamiento del usuario

>**RECUERDA:** Amazon Personalize = **Recomendar según cada usuario**. **Por ejemplo**, Un usuario compra y consulta productos de tecnología. Amazon Personalize puede recomendarle: “También te puede interesar este teclado.” Las recomendaciones se adaptan al comportamiento de cada usuario. **truco de examen:** Si la pregunta habla de recomendar productos, películas, contenido o servicios basándose en el comportamiento y preferencias de cada usuario, piensa en **Amazon Personalize**.

### 10. IA de Amazon SageMaker

Es un servicio de AWS para ***crear, entrenar, personalizar, desplegar y administrar sus propios modelos de inteligencia artificial y machine learning*** a gran escala. Permite a los desarrolladores y científicos de datos trabajar con modelos de ML sin tener que administrar toda la infraestructura por su cuenta.

**Categoría:** Machine Learning

**Clave para el examen:**

- Machine Learning (ML)
- Inteligencia artificial
- Crear modelos
- Entrenar modelos
- Desplegar modelos
- Datos para entrenamiento
- Administrar modelos de ML

>**RECUERDA:** IA de Amazon SageMaker = **plataforma para construir y ejecutar de machine learning.** **Por ejemplo**, Una empresa tiene datos de ventas y quiere crear un modelo que prediga la demanda de sus productos. Puede utilizar SageMaker AI para entrenar el modelo y posteriormente ponerlo en producción. **Truco de examen**: Si la pregunta habla de desarrollar, entrenar y desplegar modelos de machine learning, piensa en **Amazon SageMaker AI**.

### 11. Amazon SageMaker JumpStart

Es un centro de machine learning dentro de la IA de SageMaker que ***acelera el proceso de creación, entrenamiento e implementación de modelos de ML***. SageMaker JumpStart ofrece una biblioteca de soluciones de machine learning prediseñadas en varios dominios, como la visión artificial, el NLP y los datos tabulares. En lugar de crear un modelo desde cero, ***puedes seleccionar un modelo existente, personalizarlo, entrenarlo y desplegarlo***.

**Categoría:** Machine Learning / Modelos preentrenados

**Clave para el examen:**

En lugar de empezar desde cero:

- Inicio rápido, para no empezar desde cero
- Modelos preentrenados listos para usar
- Modelos y soluciones prediseñadas

>**RECUERDA:** Amazon SageMaker JumpStart = **Hub de modelos preentrenados y soluciones de ML listas para usar dentro de SageMaker AI**. **Por ejemplo**, Una empresa quiere implementar rápidamente un modelo de IA para analizar texto. En lugar de desarrollar y entrenar un modelo desde cero, puede utilizar un modelo preentrenado disponible en SageMaker JumpStart y adaptarlo a sus necesidades. **Truco de examen**: Si la pregunta habla de utilizar modelos preentrenados o soluciones de ML para comenzar rápidamente un proyecto de IA, piensa en **Amazon SageMaker JumpStart**.

### 12. Amazon Bedrock

Es un servicio administrado que permite ***crear aplicaciones de inteligencia artificial generativa usando modelos fundacionales (FM) de distintos proveedores*** y modelos de lenguaje de gran tamaño (LLM) a través de una API unificada. Puedes utilizar ***modelos para generar texto, responder preguntas, resumir información, crear contenido y desarrollar aplicaciones de IA generativa***.

**Categoría:** IA generativa / Modelos fundacionales

**Clave para el examen:**

* IA generativa.
* Modelos fundacionales (FMs).
- Crear aplicaciones de IA generativa
* Agentes y aplicaciones generativas.
* Acceso a modelos de diferentes proveedores mediante APIs.

>**RECUERDA:** Amazon Bedrock = **construir aplicaciones de IA generativa usando modelos fundacionales.** **Por ejemplo**, Una empresa quiere crear un chatbot inteligente. Con Amazon Bedrock puede utilizar un modelo fundacional disponible en Bedrock para generar respuestas, sin tener que entrenar un modelo desde cero. **Truco de examen**: Si la pregunta habla de crear aplicaciones de IA generativa utilizando modelos fundacionales de distintos proveedores, piensa en **Amazon Bedrock**.

### 13. Amazon Q

Es un ***asistente de IA generativa que puede ayudar a las empresas a optimizar sus procesos, tomar decisiones con mayor rapidez y mejorar la productividad de sus empleados***. Puede ayudar a todos los empleados a obtener información acerca de sus datos y acelerar sus tareas. Se compone de los siguientes dos productos.

- **Amazon Q Business**: Es un asistente de IA generativa que puede responder a preguntas urgentes, ayudar a resolver problemas y realizar acciones con los datos y la experiencia que se encuentran en los repositorios de información de su empresa. 
- **Amazon Q Developer**:  Es un asistente de IA generativa para desarrolladores y profesionales de TI que ayuda a escribir, explicar, corregir y transformar código, además de ayudar con tareas relacionadas con AWS.

**Categoría:** IA generativa empresarial

**Clave para el examen:**

- Asistente de IA generativa
- Buscar información empresarial

>**RECUERDA:** Amazon Q = **Asistente de IA para el trabajo y AWS**. **Por ejemplo**, puede responder preguntas sobre documentación interna, datos de la empresa, AWS, código y procesos empresariales, dependiendo de la versión de Amazon Q utilizada.

## Streaming y procesamiento de datos en AWS

### 1. Amazon Kinesis Data Streams

Es un servicio de AWS que permite ***recopilar y procesar grandes cantidades de datos que llegan continuamente en tiempo real***, como eventos, registros, clics, transacciones o datos de dispositivos IoT.

**Categoría:** Streaming de datos

**Clave para el examen:**

- Datos en tiempo real
- Streaming de datos
- Flujos continuos de datos
- Procesamiento en tiempo real
- Grandes volúmenes de datos

>**RECUERDA:** Amazon Kinesis Data Streams = **datos que llegan continuamente y quieres procesar en tiempo real.** **Por ejemplo**, una aplicación recibe miles de clics de usuarios cada segundo. Kinesis Data Streams puede capturar esos eventos inmediatamente para que otras aplicaciones los procesen y analicen en tiempo real. **Truco de examen**: Si la pregunta habla de recopilar o procesar datos que llegan continuamente y en tiempo real, piensa en Amazon Kinesis Data Streams.

### 2. Amazon Data Firehose

Es un servicio de AWS que permite ***capturar, transformar y entregar datos de streaming de forma continua hacia destinos como Amazon S3, Redshift y OpenSearch***, sin tener que administrar servidores.

**Categoría:** Entrega de datos en streaming

**Clave para el examen:**

- Streaming de datos
- Entrega de datos
- Carga continua
- Transformación de datos

>**RECUERDA:** Amazon Data Firehose = **entrega los datos donde necesitas almacenarlos/analizarlos.** **Por ejemplo**, Una aplicación genera miles de eventos por segundo. Firehose puede recibir esos datos y entregarlos automáticamente a Amazon S3 para almacenarlos y analizarlos posteriormente. **Truco de examen**: Si la pregunta habla de recibir datos de streaming y entregarlos automáticamente a S3, Redshift u OpenSearch, piensa en **Kinesis Data Firehose**.

### 3. Amazon Redshift

Es un servicio de AWS de ***almacenamiento de datos (data warehouse) en la nube***, diseñado para ***almacenar y analizar grandes cantidades de datos mediante consultas SQL complejas***. Es especialmente útil para análisis, reportes y business intelligence (BI).

**Categoría:** Data Warehouse / Analítica

**Clave para el examen:** Se utiliza para:

* Consultas analíticas.
- Data warehouse
- Análisis de datos
- Consultas SQL complejas
- Grandes volúmenes de datos estructurados y semiestructurados.

>**RECUERDA:** Amazon Redshift =  **analiza grandes cantidades de datos en un data warehouse.** **Por ejemplo**, una empresa tiene millones de registros de ventas almacenados. Redshift puede analizar esos datos para responder preguntas como: “¿Cuáles fueron los productos más vendidos durante el último año?” **Truco de examen**, si la pregunta habla de: Analizar grandes cantidades de datos utilizando SQL complejas para generar reportes o análisis empresariales, piensa en **Amazon Redshift**.

### 4. Catálogo de datos de AWS Glue

Repositiorio centralizado de ***metadatos sobre los datos*** que permite ***registrar, organizar y describir los datos*** almacenados en diferentes fuentes, como Amazon S3. No almacena los datos en sí; ***almacena información sobre los datos***, por ejemplo: esquemas, nombre de las tablas, propiedades de los datos, columnas, tipos de datos y ubicación de los archivos.

**Categoría:** Catálogo de datos / Metadatos

**Clave para el examen:**

- Catálogo de datos
- Metadatos
- Ubicación de los datos
- Descubrimiento de datos
- Integración con Athena
- No almacena los datos

>**RECUERDA:** Glue Data Catalog = **Índice o inventario de tus datos**. **Por ejemplo**, Tienes archivos CSV en S3 con información de ventas. Glue Data Catalog puede registrar: `Tabla: ventas`, `Columnas: producto, fecha, precio`, `Ubicación: s3://empresa/ventas/`. Así, servicios como Amazon Athena pueden consultar esos datos fácilmente. **Truco de examen**: Si la pregunta habla de organizar, registrar o mantener metadatos sobre datos almacenados en diferentes fuentes, piensa en **AWS Glue Data Catalog**.

### 5. AWS Glue

Es un servicio ***serverless de integración y preparación de datos (ETL)*** que ***permite descubrir, extraer, transformar y cargar datos*** entre diferentes fuentes para prepararlos para análisis.

**Categoría:** ETL / Integración de datos

**Clave para el examen:**

- ETL (Extract, Transform, Load)
- Preparación y transformación de datos
- Descubrimiento de datos
- Integración de datos

>**RECUERDA:** AWS Glue = **prepara y transforma datos.** Piensa en Glue (pegamento): conecta diferentes fuentes de datos y los prepara para poder analizarlos. **Por ejemplo**, puede tomar datos de Amazon S3, limpiarlos y transformarlos, y dejarlos preparados para analizarlos con Amazon Athena o Amazon Redshift. **Truco de examen**: Si ves ETL + transformación + integración de datos + serverless, piensa en **AWS Glue**.

### 6. Amazon EMR

Amazon EMR (Elastic MapReduce) es un servicio de AWS que ***permite procesar y analizar grandes cantidades de datos utilizando frameworks de Big Data***, como Apache Hadoop y Apache Spark. Se utiliza cuando necesitas realizar ***procesamiento de datos a gran escala*** de manera distribuida.

**Categoría:** Big Data / Procesamiento distribuido

**Clave para el examen:**

* Big Data.
* Procesamiento distribuido.
* Grandes volúmenes de datos.
- Análisis de datos
- Procesamiento a gran escala

>**RECUERDA:** Amazon EMR = **Big Data a gran escala + procesamiento distribuido.** **Por ejemplo**, Una empresa tiene terabytes de registros de usuarios y necesita analizarlos para encontrar patrones de comportamiento. Amazon EMR puede distribuir el procesamiento entre varios servidores para realizar el trabajo de forma eficiente. **Truco de examen**: Si la pregunta habla de procesar grandes cantidades de datos utilizando Hadoop o Spark, piensa en **Amazon EMR**.

### 7. Amazon Athena

Es un servicio ***serverless de consultas interactivas*** que permite ***analizar datos almacenados en Amazon S3 utilizando SQL***, sin necesidad de cargar los datos en una base de datos.

**Categoría:** Consultas SQL / Análisis serverless

**Clave para el examen:**

- Consultas SQL sobre S3
- Analizar datos directamente en S3 sin mover ni cargar datos
- No requiere servidores
- Paga por consulta

>**RECUERDA:** Amazon Athena  = **SQL directamente sobre datos en S3.** **Por ejemplo**, Tienes millones de registros de ventas guardados como archivos CSV o Parquet en S3. Con Athena puedes ejecutar: `SELECT * FROM ventas WHERE precio > 1000`; y obtener resultados directamente desde los datos almacenados en S3. **Truco de examen**: Si la pregunta habla de consultar o analizar datos almacenados en S3 usando SQL sin administrar servidores, piensa en **Amazon Athena**.

### 8. Amazon QuickSight

Servicio de ***Business Intelligence (BI)*** que ***permite crear visualizaciones, dashboards e informes interactivos a partir de datos*** y sin tener que administrar la infraestructura.

**Categoría:** Business Intelligence / Visualización

**Clave para el examen:**

- Business Intelligence (BI)
- Visualización de datos
- Dashboards
- Gráficos e informes
- Insights basados en datos

>**RECUERDA:** Amazon QuickSight = **Ver y entender los datos**. **Por ejemplo**, una empresa puede conectar sus datos de ventas y crear un dashboard que muestre ventas por mes, productos más vendidos y rendimiento por región. **Truco de examen**: Si la pregunta habla de crear dashboards, gráficos, informes o visualizaciones para analizar datos empresariales, piensa en **Amazon QuickSight**.

### 9. Amazon OpenSearch Service

Es un servicio administrado de AWS que ***permite buscar, analizar y visualizar grandes cantidades de datos***, especialmente ***logs, registros y datos de aplicaciones***, casi en tiempo real. Es muy utilizado para búsqueda y análisis de logs y monitoreo de aplicaciones.

**Categoría:** Búsqueda y análisis de datos

**Clave para el examen:** Se utiliza frecuentemente para:

* Análisis de eventos.
* Visualizaciones.
- Búsqueda
- Logs / registros
- Monitoreo de aplicaciones

>**RECUERDA:** Amazon OpenSearch Service = **buscar + analizar + visualizar datos.** **Por ejemplo**, una aplicación genera millones de registros de actividad. OpenSearch puede ayudarte a buscar: `¿Cuántos errores 500 ocurrieron hoy?` y analizar esos registros rápidamente mediante búsquedas, gráficos y dashboards. **Truco de examen**: Si la pregunta habla de buscar y analizar logs, registros o datos de aplicaciones rápidamente, piensa en **Amazon OpenSearch Service**.

# Tabla rápida para el examen

| Servicio                 | Función principal                       |  Recuerda                      |
| ------------------------ | --------------------------------------- | -------------------------------- |
| **Comprehend**           | Analizar texto                          |  **Comprender texto**          |
| **Polly**                | Texto → voz                             |  **Habla**                    |
| **Transcribe**           | Voz → texto                             |  **Transcribe**               |
| **Translate**            | Traducción                              |  **Traduce**                   |
| **Kendra**               | Búsqueda empresarial inteligente        |  **Busca información**         |
| **Rekognition**          | Analizar imágenes/videos                |  **Ve**                       |
| **Textract**             | Extraer texto/datos de documentos       |  **Extrae documentos**         |
| **Lex**                  | Chatbots                                |  **Conversaciones**            |
| **Personalize**          | Recomendaciones                         |  **Personaliza**               |
| **SageMaker**            | Crear/entrenar/desplegar ML             |  **Construye ML**              |
| **JumpStart**            | Modelos/soluciones preentrenados        |  **Empieza rápido**            |
| **Bedrock**              | IA generativa con modelos fundacionales |  **Construye GenAI**            |
| **Q Business**           | Asistente empresarial                   |  **IA para empresa**           |
| **Q Developer**          | Asistente para desarrollo               |  **IA para programadores**  |
| **Kinesis Data Streams** | Streaming en tiempo real                |  **Datos en tiempo real**      |
| **Data Firehose**        | Entregar streaming a destinos           |  **Entrega datos**             |
| **S3**                   | Almacenamiento de objetos               |  **Almacena**                  |
| **Redshift**             | Data warehouse                          |  **Analiza grandes datos**     |
| **Glue Data Catalog**    | Metadatos                               |  **Catálogo**                  |
| **Glue**                 | ETL / integración de datos              |  **Transforma**                |
| **EMR**                  | Big Data / Spark                        |  **Procesamiento distribuido** |
| **Athena**               | SQL sobre S3                            |  **Consulta S3**               |
| **QuickSight**           | BI / dashboards                         |  **Visualiza**                 |
| **OpenSearch**           | Búsqueda y análisis                     |  **Busca y analiza**           |

**Las diferencias que más conviene memorizar**

**Polly vs Transcribe**

>**Polly** = Texto ─── Voz.
>**Transcrib**e = Voz ── Texto

**Rekognition vs Textract**

>**Rekognition** = Imagen / Video. Reconocer objetos, personas, contenido.
>**Textract** = Documento / PDF / Imagen. Extraer texto, tablas y formularios.

**Comprehend vs Translate**

> **Comprehend** =  analiza/comprende texto.
> **Translate** = traduce texto.

**Lex vs Bedrock**

> **Lex** = crear interfaces conversacionales/chatbots.
> **Bedrock** = crear aplicaciones de IA generativa usando modelos fundacionales.

**SageMaker vs Bedrock vs JumpStart**

>**SageMaker** = Plataforma de Machine Learning. Construir / entrenar / desplegar.
>**JumpStart** = Modelos y soluciones preentrenados. Empezar rápidamente.
>**Bedrock** = Modelos fundacionales. Aplicaciones de IA generativa.

**Kinesis Data Streams vs Data Firehose**

> **Data Streams** = procesar datos en tiempo real con mayor control.
> **Firehose** = entregar datos de streaming a destinos administrados.

**S3 vs Redshift vs Athena**

>**S3** = ALMACENAR datos.
>**Athena** = CONSULTAR datos de S3 con SQL.
>**Redshift** = DATA WAREHOUSE para análisis.

**Glue vs Glue Data Catalog**

>**AWS Glue**= ETL, Descubrir, Transformar, Integrar.
>**Glue Data Catalog** = Metadatos, Tablas, Esquemas, Ubicación de datos.

**Athena vs OpenSearch**

> **Athena** = consultas SQL sobre datos, especialmente en S3.
> **OpenSearch** = búsqueda y análisis de logs, eventos y otros datos.

## Servicios de seguridad de AWS

### 1. AWS IAM (Gestión de identidades y accesos de AWS)

Servicio que permite ***controlar quién puede acceder a recursos AWS y  qué acciones puede realizar (qué permisos tiene)***. Administra de forma segura las identidades (usuarios, grupos, roles) y el acceso (permisos de acceso a AWS) a los servicios y recursos de AWS.

| Concepto              | Definición                                                                                                                         |  Recuerda               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **Usuario root**      | Identidad principal de la cuenta AWS. Tiene **acceso completo** a todos los recursos y no se puede limitar mediante políticas IAM. |  **Dueño de la cuenta** |
| **Usuario IAM**       | Identidad creada dentro de AWS para una **persona o aplicación**, a la que se le pueden asignar permisos. Puede tener credenciales y permisos.                         |  **Una identidad**      |
| **Grupo IAM**         | Colección de **usuarios IAM** al que se le asignan políticas/permisos en común. fácilmente.                                   |  **Usuarios juntos**    |
| **Rol IAM**           | Identidad con permisos que puede ser **asumida temporalmente** por usuarios, aplicaciones o servicios AWS.                         |  **Asumir permisos**    |
| **Política (Policy)** | Documento json que define **qué acciones se permiten o deniegan**, sobre qué recursos y bajo qué condiciones.                           |  **Reglas de permisos** |

La forma más fácil de entender IAM en AWS es pensar que hay 4 piezas diferentes:

- **Usuario** = quién eres. Un **usuario IAM** representa a una persona o identidad específica. **Ejemplo típico de examen**: "Necesitas crear una identidad para un empleado específico."
- **Grupo** = dónde te clasifican. Un **grupo IAM** sirve para juntar varios usuarios que necesitan permisos similares. Un grupo contiene usuarios. Un grupo no contiene roles ni otros grupos. **Ejemplo típico de examen**: "Una empresa tiene 20 desarrolladores y todos necesitan los mismos permisos."**
- **Política** = qué puedes hacer. Una **política** es un documento json que define qué acciones están permitidas o denegadas. **Ejemplo típico de examen**: "¿Dónde se especifica que un usuario puede leer objetos de S3?"
- **Rol** = qué identidad/permiso puedes asumir temporalmente. El **rol IAM** es diferente porque no representa necesariamente a una persona permanente. Un rol es una identidad que puede ser asumida por alguien o algo. **Ejemplo típico de examen**: "Una aplicación ejecutándose en EC2 necesita acceder a S3 sin almacenar credenciales."

>**RECUERDA:** si ves "personas" piensa **Usuario/Grupo**; si ves "servicio AWS que necesita permisos" piensa **Rol**; si ves "Allow/Deny, Action, Resource" piensa **Política**.   

**Categoría:** Seguridad e Identidad

**Clave para el examen:**

* **IAM = ¿Quién puede hacer qué?**
* Usuarios → personas.
* Grupos → agrupan usuarios.
* Roles → permisos que pueden asumir usuarios/servicios.
* Políticas → definen los permisos.

>**RECUERDA:** IAM = **Identidad + Permisos. Controla quién puede hacer qué dentro de AWS**. Usuarios, grupos, roles y políticas.

### 2. AWS IAM Identity Center (Centro de identidades de AWS IAM)

Servicio que permite administrar el ***acceso centralizado de usuarios a múltiples cuentas y aplicaciones de AWS mediante inicio de sesión único (SSO)***. Admite identidad federada (identidad externa que AWS acepta), significa que AWS confía en una identidad que viene de otro sistema, en lugar de crear y administrar otro usuario directamente dentro de AWS (por ejemplo, Microsoft Entra ID, Active Directory, Google Workspace, etc).

**Categoría:** Seguridad e Identidad

**Clave para el examen:**

* Permite **un solo inicio de sesión** para acceder a varias cuentas AWS.
* Ideal para organizaciones con múltiples cuentas.
* Se utiliza para administrar acceso de empleados.

>**RECUERDA:** Identity Center = **usuarios + varias cuentas. Un solo inicio de sesión para acceder a varias cuentas AWS**. Ideal para empleados y organizaciones con múltiples cuentas.

**Diferencia con IAM:**

* **IAM:** controla acceso dentro de una cuenta.
* **IAM Identity Center:** administra acceso centralizado a múltiples cuentas.

### 3. AWS Secrets Manager (Administrador de secretos de AWS)

Servicio para ***almacenar, administrar y recuperar información secreta***, como contraseñas, claves API y credenciales.

**Categoría:** Seguridad e Identidad

**Clave para el examen:**

- Administrar secretos/contraseñas con rotación automática
* Contraseñas
* API Keys
* Credenciales de bases de datos
* Rotación automática de secretos

>**RECUERDA:** Secrets Manager = **guarda contraseñas,scretos, API Keys y credenciales de forma segura**. Puede rotarlas automáticamente.No confundir con **AWS KMS**, que se centra en **claves de cifrado**.

### 4. AWS Systems Manager (Administrador de sistemas de AWS)

Servicio que permite ***administrar y monitorear recursos de AWS y servidores*** de forma centralizada.

**Categoría:** Gobernanza y Monitoreo

**Clave para el examen:**

* Administrar EC2 y servidores.
* Ejecutar comandos remotamente.
* Automatiza tareas operativas como parches de seguridad, administración de usuarios y configuraciones.
* Administrar parámetros mediante Parameter Store.

>**RECUERDA:** Systems Manager = **administra servidores y EC2 de forma centralizada**. Permite ejecutar comandos, aplicar parches y administrar configuraciones.

### 5. AWS Shield

Servicio administrado de ***protección contra ataques DDoS (Denegación de Servicio Distribuida)***. Existen dos tipos: ***AWS Shield Standard*** protege automáticamente y sin costo frente a los ataques más comunes; ***AWS Shield Advanced*** es de pago y ofrece diagnósticos y mitigación de ataques sofisticados.

**Categoría:** Seguridad e Identidad

**Clave para el examen:**

* Protege aplicaciones contra ataques DDoS.
* **Shield Standard:** protección automática y sin costo adicional para determinados servicios AWS.
* **Shield Advanced:** pago, con integración con CloudFront, Route 53 y ELB, y se combina con AWS WAF.

>**RECUERDA:** AWS Shield = **protege contra ataques DDoS**. Shield Standard es automático; Shield Advanced ofrece protección avanzada de pago.

### 6. AWS WAF (Web Application Firewall)

Firewall de aplicaciones web que permite ***filtrar y controlar las solicitudes HTTP/HTTPS*** que llegan a una aplicación. Decide qué tráfico HTTP/HTTPS puede llegar a una aplicación web. Bloquea SQL Injection, XSS, IPs y solicitudes maliciosas mediante reglas.

**Categoría:** Seguridad e Identidad / Redes

**Clave para el examen:**
Puede bloquear:

* SQL Injection
* Cross-Site Scripting (XSS)
* IPs específicas
* Solicitudes maliciosas
* Tráfico según reglas

>**RECUERDA:** AWS WAF = **Filtra y bloquea tráfico malicioso contra aplicaciones web mediante reglas**.

### 7. AWS Key Management Service (AWS KMS)

Servicio para ***crear y administrar claves criptográficas utilizadas para cifrar y descifrar datos***. Controla quién puede usar cada clave en los servicios de AWS y en las aplicaciones.

**Categoría:** Seguridad e Identidad

**Clave para el examen:**

* Crea claves de cifrado.
* Administra claves.
* Permite controlar quién puede utilizarlas.
* Se integra con muchos servicios AWS.
- Las claves nunca salen de AWS KMS, se pueden deshabilitar temporalmente y permiten el cifrado de datos en reposo en servicios como S3, EBS y DynamoDB.

>**RECUERDA:** AWS KMS = **crea y administra las claves utilizadas para cifrar datos**. No guarda contraseñas , para eso está Secrets Manager; administra claves de cifrado.

### 8. Amazon Macie

Servicio que usa ***machine learning y automatización para descubrir y supervisar información confidencial*** (por ejemplo, datos personales PII) ***almacenada en Amazon S3***, y evaluar la posición de seguridad.

**Categoría:** Seguridad e Identidad

**Clave para el examen:**
Detecta información sensible como:

* Información personal.
* Datos financieros.
* Credenciales.
* Información confidencial.

>**RECUERDA:** Amazon Macie = **datos sensibles en S3 + cumplimiento**. Busca datos sensibles dentro de S3. Especialmente información personal, financiera o confidencial.

### 9. AWS Certificate Manager (ACM)

Servicio que permite ***aprovisionar, administrar y renovar certificados SSL/TLS*** utilizados para proteger conexiones HTTPS.

**Categoría:** Seguridad e Identidad

**Clave para el examen:**

* HTTPS
* SSL/TLS
* Certificados digitales
* Renovación automática de certificados administrados por AWS

>**RECUERDA:** aws ACM = **administra certificados SSL/TLS para HTTPS**. cifrado en tránsito.

### 10. Amazon Inspector

Servicio que ayuda a mejorar la seguridad y el cumplimiento de las aplicaciones mediante la ejecución de evaluaciones de seguridad automatizadas donde analiza continuamente recursos como ***EC2, contenedores y funciones Lambda*** para detectar ***vulnerabilidades de seguridad y exposición***. Ordena los hallazgos por severidad y ofrece recomendaciones.

**Categoría:** Gobernanza y Monitoreo

**Clave para el examen:**
Busca:

* Vulnerabilidades de software.
* Vulnerabilidades de paquetes.
* Exposición de recursos.
* Problemas de seguridad.

>**RECUERDA:** Amazon Inspector = **inspecciona vulnerabilidades**. busca vulnerabilidades en EC2, contenedores y Lambda. Piensa: “¿Qué vulnerabilidades tiene mi software?”.

### 11. Amazon GuardDuty

Servicio de ***detección inteligente de amenazas*** que supervisa de forma continua la actividad de la cuenta (flujos de metadatos y de red) usando inteligencia artificial, detección de anomalías y listas de IP maliciosas conocidas. Se integra con AWS Lambda para automatizar la respuesta.

**Categoría:** Gobernanza y Monitoreo

**Clave para el examen:**
Puede detectar:

* Comportamiento sospechoso.
* Credenciales comprometidas.
* Actividad maliciosa.
* Posibles ataques.
- Detecta amenazas y actividad maliciosa continuamente en tu entorno AWS.

>**RECUERDA:** Amazon GuardDuty = **detecta amenazas y actividad sospechosa en AWS**. Piensa: “¡Hay algo sospechoso!”

### 12. Amazon Detective

Servicio de ***investigación de amenazas*** que, mediante visualizaciones interactivas, analiza la causa raíz de los hallazgos de seguridad y muestra las interacciones entre recursos y usuarios en una línea de tiempo.

**Categoría:** Gobernanza y Monitoreo

**Clave para el examen:**

* Analiza eventos.
* Relaciona actividades.
* Ayuda a encontrar la causa de un incidente.
* Facilita las investigaciones después de detectar una amenaza.

>**RECUERDA:** Amazon Detective = **investiga qué pasó**. Investiga una amenaza que ya fue detectada. Busca entender qué pasó, cómo ocurrió y qué recursos estuvieron involucrados.
>
>**GuardDuty → detecta una amenaza** Mientras que **Detective → investiga la amenaza**

### 13. AWS Security Hub

Servicio que proporciona un ***panel centralizado de seguridad que agrega los hallazgos*** de varios servicios (GuardDuty, Inspector, Macie, etc.) y de socios, los organiza y permite la corrección automatizada.

**Categoría:** Gobernanza y Monitoreo

**Clave para el examen:**

* Centraliza hallazgos.
* Integra servicios como GuardDuty, Inspector y Macie.
* Ayuda a tener una visión general de la seguridad.
* Puede realizar comprobaciones de seguridad mediante estándares compatibles.

>**RECUERDA:** Security Hub = **centro de seguridad**. Reúne los hallazgos de seguridad en un solo lugar. Piensa: “un panel central de seguridad”.

### 14. IAM Access Analyzer

Servicio de AWS que ***analiza las políticas de IAM*** para detectar si tus recursos pueden ser accesibles ***desde fuera de tu cuenta o de forma no deseada***.

**Categoría:** Seguridad e Identidad

**Clave para el examen:**

- Analiza permisos y accesos

>**RECUERDA:** IAM Access Analyzer = **detecta quién puede acceder a tus recursos, especialmente desde fuera de tu cuenta**. Ayuda a detectar accesos no deseados.

### 14. Amazon Cognito

Es un servicio de AWS que permite agregar ***registro de usuarios, inicio de sesión, autenticación y control de acceso a aplicaciones web y móviles***, sin tener que desarrollar desde cero todo el sistema de gestión de identidades. En palabras sencillas, es como el sistema de cuentas de tu aplicación: permite que los usuarios se registren, inicien sesión, recuperen sus contraseñas y accedan de forma segura a las funcionalidades para las que tienen autorización. Amazon Cognito ofrece dos componentes principales:

- **User Pools (grupos de usuarios - autentica)**: administran el registro, el inicio de sesión, la recuperación de contraseñas, la autenticación multifactor (MFA) y los tokens de autenticación.
- **Identity Pools (grupos de identidades - entrega credenciales)**: permiten proporcionar credenciales temporales de AWS a usuarios autenticados o, según la configuración, invitados para acceder directamente a recursos de AWS autorizados.

**Categoría:** Seguridad e Identidad

**Clave para el examen:**

- Autenticación: comprueba la identidad de los usuarios.
- Registro y gestión de cuentas: administra las cuentas de usuario.
- Autenticación multifactor: añade una capa adicional de seguridad.
- Tokens y credenciales temporales: facilita el acceso seguro a API y recursos autorizados.

>**RECUERDA:** Amazon Cognito = **Identidad y autenticación para aplicaciones**. Cognito se relaciona con conocer quién es el usuario. Primero verifica su identidad; después, la aplicación y el backend deben comprobar qué puede hacer.
>
>**Por ejemplo**, Imagina que desarrollas una aplicación móvil para controlar deudas. Con Amazon Cognito puedes permitir que cada usuario: Se registre con su correo electrónico y contraseña. Recupere su contraseña. Obtenga tokens para acceder a tu API protegida. Tu backend debe seguir verificando los permisos y la propiedad de los datos para garantizar que cada usuario solo pueda consultar y modificar sus propias deudas.
>
>**Truco de examen**: Si una pregunta menciona registro de usuarios, inicio de sesión, recuperación de contraseñas, autenticación multifactor o acceso de usuarios a una aplicación web o móvil, considera Amazon Cognito.

**Diferencia entre Amazon Cognito e IAM**

| Servicio       | Función principal                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| Amazon Cognito | Gestiona la autenticación y las identidades de los usuarios de aplicaciones.                                |
| AWS IAM        | Controla quién puede acceder a los servicios y recursos de una cuenta de AWS y qué acciones puede realizar. |

>**Cognito** permite que un cliente inicie sesión en tu aplicación; **IAM** administra los permisos de los usuarios, roles y servicios que necesitan operar dentro de AWS.

# Tabla rápida para el examen

| Servicio                | ¿Para qué sirve?                        | Recuerda                            |
| ----------------------- | --------------------------------------- | ----------------------------------- |
| **IAM**                 | Usuarios y permisos                     | **Quién puede hacer qué**        |
| **IAM Identity Center** | Acceso centralizado a múltiples cuentas | **Un login → muchas cuentas**    |
| **Secrets Manager**     | Contraseñas y secretos                  | **Guarda secretos**              |
| **Systems Manager**     | Administrar servidores                  | **Administra infraestructura**  |
| **Shield**              | Protección DDoS                         | **Escudo DDoS**                 |
| **WAF**                 | Filtrar tráfico web                     | **Firewall web**                 |
| **KMS**                 | Claves de cifrado                       | **Cifra datos**                  |
| **Macie**               | Datos sensibles en S3                   | **Encuentra datos sensibles**    |
| **ACM**                 | Certificados SSL/TLS                    | **HTTPS** 
| **Inspector**           | Vulnerabilidades                        | **Inspecciona vulnerabilidades** |
| **GuardDuty**           | Detectar amenazas                       | **Detecta**                      |
| **Detective**           | Investigar incidentes                   | **Investiga**                   |
| **Security Hub**        | Centralizar seguridad                   |  **Centraliza**                   |

**Las diferencias que más conviene memorizar**

**IAM vs Identity Center**

> **IAM** = permisos y acceso a recursos.
> **Identity Center** = acceso centralizado/SSO a múltiples cuentas.

**Secrets Manager vs KMS**

> Secrets Manager = **contraseñas y secretos**.
> KMS = **claves criptográficas**.

**Shield vs WAF**

> Shield = **DDoS**.
> WAF = **tráfico HTTP/HTTPS malicioso**.

**Inspector vs GuardDuty**

> Inspector = **busca vulnerabilidades**.
> GuardDuty = **detecta amenazas**.

**GuardDuty vs Detective**

> GuardDuty = **detecta que algo sospechoso ocurre**.
> Detective = **investiga qué ocurrió y cómo**.

**Security Hub**

> Piensa en él como el **panel central** que reúne información de seguridad de otros servicios.

## Supervisión, cumplimiento y gobernanza en AWS

### 1. Amazon CloudWatch

Servicio de ***monitoreo y observabilidad*** que permite supervisar recursos, aplicaciones y métricas de AWS en tiempo real. También permite trabajar con logs, alarmas y eventos. Recopila ***métricas***, ***genera alarmas***, ***almacena logs*** (registros) y permite ***supervisar el estado*** de la infraestructura (paneles).

**Categoría:** Gobernanza y Monitoreo

**Clave para el examen:**

* Métricas, Logs, Alarmas
* Rendimiento
* Estado de aplicaciones y recursos

>**RECUERDA:** CloudWatch = **¿Cómo está funcionando mi infraestructura?**. Por ejemplo, una instancia EC2 tiene un uso de CPU muy alto → CloudWatch puede detectarlo y generar una alarma.

### 2. AWS CloudTrail

Servicio que ***registra la actividad (las acciones realizadas) de la API*** en la cuenta AWS (quién hizo qué, cuándo y desde dónde), ofreciendo un ***registro de auditoría para monitoreo, cumplimiento y respuesta a incidentes*** (realizadas desde la consola, CLI, SDKs y otros servicios).

**Categoría:** Gobernanza y Monitoreo

**Clave para el examen:**

* ¿Quién hizo algo?
* ¿Qué hizo?
* ¿Cuándo lo hizo?
* ¿Desde dónde?
* ¿Qué API utilizó?

>**RECUERDA:** CloudTrail = **¿Quién hizo qué?**. Por ejemplo, se elimina un bucket S3 y quieres saber quién realizó la acción. Diferencias: **CloudWatch** = monitorea el funcionamiento. Mientras que **CloudTrail** = registra las acciones.

### 3. AWS Artifact

Es un servicio que proporciona acceso gratuito y bajo demanda a los ***informes de seguridad y cumplimiento de AWS*** y a determinados acuerdos en línea. Consta de dos tipos: ***Acuerdos de AWS Artifac***, permite revisar, aceptar y administrar acuerdos de cumplimiento de AWS, como la Ley de Portabilidad y Responsabilidad de Seguros de Salud (HIPAA) e ***Informes de AWS Artifac***, permite descargar informes de auditorías que demuestran que AWS cumple con estándares y regulaciones de seguridad.

**Categoría:** Gobernanza y Monitoreo

**Clave para el examen:**

* Informes de cumplimiento.
* Certificaciones.
* Documentación de auditoría.
* Acuerdos legales.

>**RECUERDA:** Artifact = **documentos de cumplimiento de AWS.** Es importante tener en cuenta que: **AWS Artifact** = proporciona documentos e informes de AWS, mientras que **AWS Audit Manager** = ayuda a recopilar y organizar evidencia de tu uso de AWS para auditorías.


### 4. AWS Config

Es un servicio que puede utilizar para ***examinar, auditar y evaluar las configuraciones de sus recursos de AWS*** y comprobar si cumplen determinadas reglas.

**Categoría:** Gobernaza y Monitoreo

**Clave para el examen:**

* ¿Cómo está configurado mi recurso?
* ¿Cambió su configuración?
* ¿Cumple una regla?
* Historial de configuración.

>**RECUERDA:** Config = **¿Cómo está configurado?**. Por ejemplo, quieres comprobar si tus buckets S3 permiten acceso público → puedes utilizar reglas de **AWS Config**.Este puede integrarse con CloudTrail para relacionar cambios de configuración con eventos concretos.

### 5. AWS Audit Manager

Es un servicio que audita continuamente el uso de AWS para simplificar la ***evaluación de riesgos y cumplimiento***. Ayuda a ***recopilar pruebas, organizar y administrar los datos de auditoría y presentar evidencia*** para facilitar auditorías y demostrar el cumplimiento de requisitos y estándares.

**Categoría:** Auditoría y Cumplimiento

**Clave para el examen:**

* Recopila evidencia.
* Automatiza la recopilación de evidencias.
* Facilita auditorías.
* Ayuda a demostrar cumplimiento.

>**RECUERDA:** Audit Manager = **prepara la evidencia para una auditoría.** Diferencia con **AWS Config = comprueba configuraciones.** y **Audit Manager = recopila evidencia para auditorías.**

### 6. AWS Organizations

Servicio para ***administrar y organizar múltiples cuentas de AWS de manera centralizada***: cuenta de gestión (management account), cuentas miembro, unidades organizativas (OUs) y políticas de control de servicios (SCP), con facturación consolidada.

**Categoría:** Gobernanza y Monitoreo

**Clave para el examen:**

* Varias cuentas AWS.
* Administración centralizada.
* Unidades organizativas (OUs).
* Políticas de control.
* Consolidación de facturación.

>**RECUERDA:** Organizations = **muchas cuentas → una organización.** Podemos diferenciar que **AWS Organizations** administra cuentas AWS, mientras que **IAM Identity Center** administra el acceso de usuarios a múltiples cuentas y aplicaciones.

### 7. AWS Control Tower

Es un servicio que puede usar con el fin de ***aplicar y administrar las reglas de gobernanza para la seguridad, las operaciones y el cumplimiento*** a escala en todas sus organizaciones y cuentas en la nube de AWS. Automatiza la creación y gestión de landing zones multi-cuenta.

**Categoría:** Gobernanza multicuenta

**Clave para el examen:**

* Configura una **landing zone (zonas de aterrizaje)**.
* Gobierno de múltiples cuentas.
* Controles preventivos/detectivos.
* Automatiza la configuración de cuentas.
- Configuración estandarizada de cuentas nuevas
* Se integra con Organizations, IAM Identity Center, Config y otros servicios.

>**RECUERDA:** Control Tower = **configura y gobierna una organización multicuenta.**  Mientras que:
>
>**AWS Organizations** → organiza y administra cuentas.
>
>**IAM Identity Center** → administra usuarios y sus accesos.
>
>**AWS Control Tower** → establece y mantiene reglas, controles y buenas prácticas sobre esas cuentas.

### 8. AWS Service Catalog

Servicio que ***crea y administra catálogos de servicios TI aprobados*** que las organizaciones pueden desplegar de forma estandarizada y controlada siguiendo políticas y configuraciones predefinidas.

**Categoría:** Gobernanza y aprovisionamiento

**Clave para el examen:**

* Productos aprobados.
* Plantillas de infraestructura.
* Control sobre qué pueden implementar los usuarios.
* Estandarización.

>**RECUERDA:** Service Catalog = **catálogo de recursos aprobados.** Por ejemplo, una empresa permite que sus desarrolladores implementen únicamente: `Producto 1 → EC2 aprobada`, `Producto 2 → Base de datos aprobada`. En lugar de permitir que creen cualquier infraestructura. AWS lo describe como una forma de proporcionar a los usuarios plantillas de infraestructura preaprobadas y políticas IAM asociadas.

### 9. AWS License Manager

Servicio que permite ***administrar y controlar licencias de software*** de diferentes proveedores (Microsoft, Oracle, SAP) utilizadas en AWS y entornos locales.

**Categoría:** Administración de licencias

**Clave para el examen:**

* Licencias de software.
* BYOL (**Bring Your Own License - Trae tu propia licencia**).
* Seguimiento del uso.
* Límites y reglas de licencias.

>**RECUERDA:** License Manager = **controla licencias de software.** Por ejemplo, una empresa tiene 100 licencias de un software y quiere controlar que no se utilicen más de las permitidas.

### 10. AWS Trusted Advisor

Es un servicio que analiza continuamente el entorno de una cuenta AWS y proporciona ***recomendaciones para optimizar los recursos y seguir las prácticas recomendadas de AWS***. Su objetivo es ayudar a identificar oportunidades de mejora relacionadas con la ***seguridad, rendimiento, disponibilidad, optimización de costos, tolerancia a errores y límites de servicio***.

**Categoría:** Recomendaciones y buenas prácticas

**Clave para el examen:**

* Costos.
* Rendimiento.
* Seguridad.
* Tolerancia a fallos.
* Límites de servicio.

>**RECUERDA:** Trusted Advisor = **asesor que te dice qué puedes mejorar.** Ayuda a las organizaciones a reducir costos, mejorar la seguridad, aumentar el rendimiento y la disponibilidad, y mantener un entorno AWS más eficiente y alineado con las buenas prácticas. Por ejemplo, tienes recursos que podrían estar generando costos innecesarios.  Trusted Advisor puede señalar este tipo de oportunidades.

### 11. AWS Health

Es un servicio que proporciona información personalizada sobre el ***estado de los servicios y recursos de AWS*** que utiliza una cuenta. Su objetivo principal es ayudar a los usuarios y administradores a conocer rápidamente si existe algún problema, mantenimiento programado o evento que pueda afectar a sus aplicaciones y recursos en una región.

**Categoría:** Estado y salud de AWS

**Clave para el examen:**

* Problemas de servicios AWS.
* Mantenimiento.
* Eventos que afectan tus recursos.
* Notificaciones específicas de tu cuenta.

>**RECUERDA:** AWS Health = **te informa sobre problemas, cambios y mantenimiento de AWS que pueden afectarte**. Diferencias: **CloudWatch** = monitorea tus recursos y aplicaciones. Mientras que
**AWS Health** = informa sobre eventos/estado de los servicios AWS que pueden afectarte.

# Tabla rápida para el examen

| Servicio                | Función principal                     |  Recuerda                    |
| ----------------------- | ------------------------------------- | ------------------------------ |
| **CloudWatch**          | Monitorear recursos y aplicaciones    | **¿Cómo funciona?**         |
| **CloudTrail**          | Registrar acciones/API                |  **¿Quién hizo qué?**        |
| **Artifact**            | Informes y documentos de cumplimiento |  **Documentos**              |
| **Config**              | Evaluar configuraciones               |  **¿Cómo está configurado?** |
| **Audit Manager**       | Recopilar evidencia para auditorías   |  **Evidencias**              |
| **Organizations**       | Administrar múltiples cuentas         |  **Muchas cuentas**          |
| **Control Tower**       | Gobernar entorno multicuenta          |  **Gobernar cuentas**       |
| **Service Catalog**     | Productos/infraestructura aprobada    |  **Catálogo aprobado**       |
| **License Manager**     | Administrar licencias                 |  **Licencias**               |
| **Trusted Advisor**     | Recomendaciones de buenas prácticas   |  **Qué mejorar**             |
| **AWS Health**          | Estado/eventos de AWS                 |  **¿AWS está bien?**      |

**Las diferencias que más conviene memorizar**

**CloudWatch vs CloudTrail**

> **CloudWatch** = MONITOREA. Métricas, logs, rendimiento, alarmas.
> **CloudTrail** = REGISTRA. Quién hizo qué y cuándo.

**Config vs CloudTrail**

>**Config** = ¿Cómo está configurado el recurso?
>**CloudTrail** = ¿Quién realizó la acción que lo cambió?

**Config vs Audit Manager vs Artifact**

>**AWS Config** = Comprueba configuraciones. ¿Cumple esta regla?
>**Audit Manager** = Recopila evidencia. Demuestra que cumplo.
>**AWS Artifact** = Documentos de AWS. Muéstrame las certificaciones/informes de AWS

**Organizations vs Control Tower**

> **AWS Organizations** = Organiza y administra múltiples cuentas.
>**Control Tower** = Configura + gobierna el entorno multicuenta.

**CloudWatch vs AWS Health**

>**CloudWatch** = ¿Cómo están MIS recursos?
>**AWS Health** = ¿Hay algún evento/problema de AWS que afecte a MIS recursos?

**Trusted Advisor vs Config**

>**AWS Trusted Advisor** = Te recomiendo mejorar esto.
>**AWS Config** = Tu recurso NO cumple esta regla.

## Precios y Soporte en AWS

### 1. Precios de Amazon S3

Amazon S3 utiliza principalmente un ***modelo de pago por uso***. El costo depende de factores como ***almacenamiento*** utilizado, ***solicitudes***, **recuperación de datos** y **transferencia de datos**, según la clase de almacenamiento y operación.

**Categoría**: Precios de almacenamiento de objetos

**Clave para el examen:**

- Pagas por lo que utilizas.
- GB almacenados.
- Solicitudes.
- Transferencia de datos.
- Las diferentes clases de almacenamiento tienen diferentes costos.

>**RECUERDA:** Amzon S3 = **pagas por almacenamiento + operaciones + transferencia, según corresponda**.

### 2. Precios Amazon EC2

Amazon EC2 utiliza diferentes modelos de precios para ejecutar instancias, dependiendo de cuánto tiempo, capacidad y compromiso de uso necesites.

Los modelos importantes son:

- **Instancias bajo demanda**: Pago por segundo/hora de uso, sin compromisos a largo plazo. Cuando la carga de trabajo es impredecible o de corto plazo. Pago por uso, sin compromiso. 

- **Instancias reservadas**:  Ofrecen un precio significativamente menor a cambio de un compromiso. Ahorre hasta un 75% si se compromete a un plazo de 1 o 3 años para cargas de trabajo predecibles mediante el uso de familias de instancias y regiones de AWS específicas. vinculado a una instancia específica.

- **savings plans (planes de ahorro)**: Ofrecen un modelo de precios flexible, a cambio de comprometerse a un uso determinado constante (gasto por hora) durante el término de 1 o 3 años y poder ahorrar hasta un 72%. Es un compromiso de gasto (no de instancia específica) a cambio de un descuento. Quiero ahorrar durante 1 o 3 años y necesito flexibilidad = compromiso de gasto + flexibilidad.

- **Instacias spot**: Usas la capacidad sobrante de AWS (capacidad no utilizada de Amazon EC2) a precio muy reducido, pero AWS puede interrumpirla cuando necesite esa capacidad. ahorro significativo, que puede alcanzar hasta el 90%. Quiero el menor precio y puedo tolerar interrupciones = barato + AWS puede interrumpir.

- **Host dedicados**:  Permiten el uso exclusivo de servidores físicos y ofrecen un control total sobre la ubicación de las instancias y la asignación de recursos. Esto los hace ideales para cargas de trabajo que requieren altos niveles de seguridad,licencias o cumplimiento normativo. Más caro pero ofrece mayor control.

- **Instancias dedicadas**: Instancia que se ejecuta en hardware dedicado a tu cuenta, pero no tienes control sobre el servidor físico específico.

**Categoría**: Precios de computación

**Clave para el examen:**

- **On-Demand** = sin compromiso.
- **Reserved Instances / Savings Plans** = ahorro mediante compromiso.
- **Spot Instances** = capacidad EC2 con precios variables y posibilidad de interrupción.
- **Dedicated Hosts** = servidor físico dedicado.

>**RECUERDA:** Amazon EC2 = **el precio depende de cómo reservas/utilizas la capacidad**. Por ejemplo, si la pregunta dice: "Necesitas una instancia durante un período corto y no quieres comprometerte." eso es **On-Demand**, en cambio si dice: "Tienes una carga estable durante mucho tiempo y quieres reducir costos mediante compromiso." Considera **Savings Plans o Reserved Instances**.

### 3. Consola de facturación de AWS (AWS Billing Console)

Es la consola de AWS donde puedes ***consultar y administrar la facturación y los costos de tu cuenta de AWS***. Desde allí puedes revisar ***cuánto estás gastando***, qué servicios generan costos y tus facturas.

**Categoría:** Facturación, precios y gestión de costos

**Clave para el examen:**

Permite consultar información como:

* Facturas, Cargos, Costos, Pagos.
* Información de facturación.
- Ver los costos actuales de tu cuenta.
- Consultar y descargar facturas de AWS.
- Ver qué servicios están generando costos.
- Consultar costos por períodos de tiempo.
- Revisar información relacionada con pagos y métodos de pago.
- Analizar la evolución de tus gastos.

>**RECUERDA:** AWS Billing Console = **lugar donde revisas y administras tu facturación y costos de AWS**. Debemos tener en cuenta que: **AWS Billing Console** = Consultar y administrar facturación y costos. **AWS Budgets** = Crear presupuestos y alertas cuando los costos alcanzan determinados límites. **AWS Cost Explorer** = Analizar y visualizar los costos y el uso. **AWS Pricing Calculator** = Estimar cuánto costaría una arquitectura antes de implementarla.

### 4. AWS Billing and Cost Management Dashboard

El Panel de administración de facturación y costos de AWS, es el panel que proporciona una ***vista general de los costos, gastos y estado de facturación*** de AWS, para consultar y supervisar la facturación, los costos y el uso de los servicios de AWS.

En otras palabras, te permite tener una ***visión general de cuánto estás gastando y cómo se están generando esos costos***.

**Categoría:** Facturación, precios y gestión de costos

**Clave para el examen:**

Sirve para obtener una visión general de:

* Costos actuales.
* Facturación.
* Tendencias de gasto.
* Herramientas de administración de costos.

>**RECUERDA:** Billing and Cost Management Dashboard = **visión general de tus costos, facturación y uso de AWS**. Existe una diferencia pequeña entre **AWS Billing Console**, porque están estrechamente relacionados. **AWS Billing Console (Lugar/herramienta completa - administración)** = La consola completa donde administras facturación, costos, pagos, facturas y herramientas de gestión de costos. **Billing and Cost Management Dashboard (Vista general - resumen)** = El panel principal dentro de esa consola que muestra un resumen de tus costos y facturación. **Por ejemplo**, si la pregunta habla de: "Administrar la facturación, pagos, facturas y costos de AWS" es **AWS Billing Console**, si habla de: "Obtener una visión general/resumen de los costos y facturación" es **Billing and Cost Management Dashboard**

### 5. AWS Budgets

Servicio de gestión de costos que permite ***establecer presupuestos personalizados y recibir alertas cuando el uso o el gasto se acercan o superan los límites definidos***.

**Categoría:** Facturación, precios y gestión de costos.

**Clave para el examen:**

- Crear presupuestos y establecer alertas.

>**RECUERDA:** AWS Budgets = **establecer un presupuesto + recibir alertas de costos**. **Por ejemplo**, configuras un presupuesto de $50 al mes, **AWS Budgets** puede enviar una alerta cuando el costo o uso alcance el umbral configurado llega 80% y nuevamente si superas los $50. Es importante tener en cuenta que **AWS Budgets** **no significa que AWS detendrá automáticamente todos los recursos cuando llegues al presupuesto**. Principalmente proporciona seguimiento y alertas; puede integrarse con acciones específicas para determinados escenarios.

### 6. AWS Cost Explorer (Explorador de costos de AWS)

Herramienta que permite ***visualizar, analizar y comprender los costos y el uso de AWS con gráficos, informes y pronósticos interactivos a lo largo del tiempo***. Brinda información sobre los patrones de gasto, las tendencias y las recomendaciones de instancias reservadas.

**Categoría:** Facturación, precios y gestión de costos.

**Clave para el examen:**

Permite analizar:

* ¿Cuánto estoy gastando?
* ¿Qué servicio cuesta más?
* ¿Cómo ha cambiado mi gasto?
* ¿Cuánto gasté este mes?
* Tendencias de costos.
- Tendencias gasto histórico/actuales. 

>**RECUERDA:** Cost Explorer = **analizar y visualizar tus costos y uso.** Diferencia importante **AWS Budgets** = ALERTA. Avísame si llego a $100. **AWS Cost Explorer** = ANÁLISIS. Muéstrame dónde estoy gastando. **Por ejemplo**, una pregunta "Una empresa quiere analizar sus costos de AWS y visualizar cómo han cambiado durante los últimos meses. ¿Qué servicio debe utilizar?" **AWS Cost Explorer**.

### 7. AWS Pricing Calculator (Calculadora de precios de AWS)

Es un herramienta que te permite **estimar cuánto podrían costar los servicios de AWS antes de implementarlos**. Puedes seleccionar los servicios que planeas utilizar, configurar características como cantidad, región, almacenamiento, horas de uso, etc., y obtener una ***estimación del costo mensual aproximado***.

**Categoría:** Precios y estimación de costos.

**Clave para el examen:**

- Calcule los costos potenciales antes de la implementación.
- Compare los costos de los diferentes servicios y configuraciones de AWS.

>**RECUERDA:** AWS Pricing Calculator = **estimar costos antes de usar los servicios**. **Por ejemplo**, Una empresa está diseñando una nueva arquitectura y quiere conocer el costo estimado antes de implementarla. ¿Qué herramienta debe utilizar? **AWS Pricing Calculator**.

### 8. AWS re:Post

Es una ***comunidad de preguntas y respuestas de AWS*** donde los usuarios pueden ***hacer preguntas, buscar soluciones, hacer preguntas y aprender de problemas relacionados con los servicios de AWS***. Es como un ***foro técnico oficial de la comunidad de AWS***, donde participan otros usuarios, desarrolladores y expertos.

**Categoría:** Comunidad y soporte técnico

**Clave para el examen:**

* Preguntas y respuestas.
* Soluciones de problemas.
* Experiencias de otros usuarios.
* Contenido de AWS.
* Comunidad técnica.
- Alberga el AWS Knowledge Center, contiene artículos y videos sobre las preguntas y solicitudes más frecuentes de los clientes de AWS.

>**RECUERDA:** AWS re:Post = **comunidad para preguntar, buscar soluciones y aprender sobre AWS.** Si la pregunta dice: “¿Dónde puede un usuario de AWS hacer preguntas y encontrar respuestas de la comunidad sobre problemas técnicos?” **AWS re:Post**.

### 9. AWS Support

Es el servicio de AWS que proporciona ***ayuda, orientación y soporte técnico a los clientes para resolver problemas relacionados con sus servicios y recursos de AWS***. Dependiendo del ***plan de soporte***, tendrás acceso a diferentes niveles de asistencia, tiempos de respuesta y herramientas. Actualmente AWS ofrece estos planes principales: ***Basic, Business Support+, Enterprise Support y Unified Operations***.

| Plan                   | ¿Qué debes recordar?                                                                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Basic**           | Soporte básico para **cuenta y facturación**, foros, documentación y estado de los servicios.                                                                                 |
| **Business Support+**  | Soporte técnico **24/7** por teléfono, web y chat, además de asistencia con IA y más funciones de Trusted Advisor.                                                            |
| **Enterprise Support** | Incluye las capacidades de Business Support+ y añade un **Technical Account Manager (TAM)** y tiempos de respuesta de hasta **15 minutos** para casos críticos de producción. |
| **Unified Operations** | Diseñado para organizaciones que necesitan soporte y orientación operativa más amplia en AWS.                                                                                 |

>**RECUERDA:** AWS Support = **ayuda y soporte para utilizar y solucionar problemas en AWS.** Más necesidades empresariales, mayor nivel de soporte. Una pregunta típica: Una empresa necesita un **Technical Account Manager (TAM)** y tiempos de respuesta de hasta 15 minutos para problemas críticos de producción. ¿Qué plan corresponde? **AWS Enterprise Support**.

# Tabla rápida para el examen

| Servicio/concepto      | Función principal               | Recuerda                       |
| ---------------------- | ------------------------------- | --------------------------------- |
| **S3 Pricing**         | Precio de almacenamiento/uso S3 | **Pagas por uso**              |
| **EC2 Pricing**        | Modelos de precios de EC2       | **Cómo pagas la capacidad**   |
| **EC2 On-Demand**      | Capacidad sin compromiso        | **Flexibilidad**               |
| **Billing Console**    | Consultar facturación           | **Factura**                    |
| **Billing Dashboard**  | Vista general de costos         | **Resumen**                    |
| **AWS Budgets**        | Presupuestos y alertas          | **Avísame si llego al límite** |
| **Cost Explorer**      | Analizar gastos                 | **¿Dónde gasto?**              |
| **Pricing Calculator** | Estimar costos                  | **¿Cuánto costará?**           |
| **AWS re:Post**        | Comunidad                       | **Preguntar/solucionar**       |
| **AWS Support**        | Soporte oficial                 | **Ayuda de AWS**              |
| **Support Plans**      | Diferentes niveles de soporte   | **Nivel de ayuda**             |

**Las diferencias que más conviene memorizar**

**Pricing Calculator vs Cost Explorer vs Budgets**

>**AWS Pricing Calculator** = ESTIMAR. "¿Cuánto COSTARÍA?".
>**AWS Cost Explorer** = ANALIZAR. "¿Cuánto ESTOY GASTANDO?".
>**AWS Budgets** = ALERTAR. "AVÍSAME cuando llegue a X"

**Billing Dashboard vs Cost Explorer**

>**Billing Dashboard** = Vista general de facturación.
>**Cost Explorer** = Análisis detallado de costos y uso

**EC2 On-Demand vs opciones con compromiso**

>**On-Demand** = Sin compromiso, Flexible, Costo normalmente mayor.
>**Savings Plans / Reserved Instances** = Compromiso, Ahorro potencial, Para uso más predecible

## Migración a la nube de AWS

La migración a la nube de AWS es el ***proceso de trasladar aplicaciones, servidores, bases de datos, archivos y otros recursos desde un centro de datos local (on-premises) u otro entorno hacia AWS***. También puede implicar modernizar aplicaciones para aprovechar servicios administrados, escalabilidad y automatización. La migración a AWS suele organizarse en ***tres grandes fases***. Cada una tiene objetivos diferentes:

- **Evaluar**. En esta fase, usted elabora el caso empresarial para la migración y evalúa su preparación. Uno de los servicios que se utilizan en esta fase es ***Migration Evaluator***.

- **Movilizar**. En esta fase, usted prepara la organización y moviliza los recursos necesarios para la migración. Dos servicios que puede utilizar en esta fase son ***AWS Application Discovery Service*** y ***AWS Migration Hub***.

- **Migrar y modernizar**. En esta fase, utiliza su estrategia, su plan y las prácticas recomendadas para migrar y modernizar. Las herramientas que lo respaldan incluyen ***AWS Application Migration Service*** y ***AWS Database Migration Service (AWS DMS)***. Si va a transferir datos, puede usar ***AWS DataSync***, ***AWS Transfer Family*** y ***AWS Snow Family***.

>Si bien **AWS Migration Hub** lo ayuda a movilizar sus recursos, también puede usarlo como un lugar único para administrar durante la fase de migración y modernización.

> **RECUERDA**:
>
>**Evaluación (Assess - entender)**: comprender la infraestructura actual, las dependencias, los costes y la preparación de la organización.
> 
>**Movilización ( preparar)**: preparar el entorno de AWS, establecer procesos, resolver obstáculos y realizar pruebas piloto.
>
>**Migración y modernización (trasladar y mejorar)**: trasladar las cargas de trabajo y, cuando sea conveniente, mejorarlas para aprovechar la nube.
>
> **Por ejemplo**: Primero una empresa inventaría sus servidores; después prepara la red y los permisos de AWS; finalmente traslada sus aplicaciones y verifica su funcionamiento.
>
> **Truco de examen**: Si el escenario habla de descubrir dependencias y analizar la preparación, piensa en evaluación. Si habla de preparar la zona de aterrizaje (landing zone) y realizar pilotos, piensa en movilización.

### 1. AWS CAF

AWS CAF (Cloud Adoption Framework) es el Marco de Adopción de la Nube de AWS. Es una guía que ayuda a las empresas a ***planificar, organizar y ejecutar su transformación hacia la nube de AWS de forma estructurada***, teniendo en cuenta las personas, los procesos, la tecnología y los objetivos del negocio. AWS CAF le ***indica a una empresa qué debe preparar y mejorar para adoptar la nube con éxito***, antes, durante y después de la migración.

AWS CAF organiza sus recomendaciones en seis perspectivas que cubren las áreas principales de una organización.

1. **Negocio (Business)**. Asegura que la adopción de AWS contribuya a los objetivos empresariales, como aumentar ingresos, reducir costos o mejorar la experiencia del cliente. Pregunta clave: ***¿Para qué necesita la empresa la nube?***

2. **Personas (People)**. Prepara a los empleados mediante capacitación, cambios organizativos y desarrollo de nuevas habilidades. Pregunta clave: ***¿Quiénes trabajarán con la nube y qué necesitan aprender?***

3. **Gobernanza (Governance)**. Define cómo se controlan los proyectos, los riesgos, los presupuestos, el cumplimiento y el uso de los recursos en la nube. Pregunta clave: ***¿Cómo controlará la empresa su entorno de AWS?***

4. **Plataforma (Platform)**. Se enfoca en diseñar, construir y administrar la infraestructura, las aplicaciones, las redes y los datos en la nube. Pregunta clave: ***¿Qué tecnología e infraestructura se necesitan?***

5. **Seguridad (Security)**. Protege los datos, las identidades, las aplicaciones y la infraestructura mediante controles de acceso, detección de amenazas y gestión de riesgos de seguridad. Pregunta clave: ***¿Cómo se protegerán los sistemas y los datos?***

6. **Operaciones (Operations)**. Permite mantener los sistemas funcionando correctamente mediante supervisión, gestión de incidentes, disponibilidad y recuperación. Pregunta clave: ***¿Cómo se mantendrán funcionando los servicios?***

**Por ejemplo**, imagina que una empresa colombiana quiere migrar su aplicación bancaria a AWS.

| Perspectiva | ¿Qué haría la empresa?                                             |
| ----------- | ------------------------------------------------------------------ |
| Negocio     | Define los beneficios esperados de la migración.                   |
| Personas    | Capacita a sus desarrolladores y administradores.                  |
| Gobernanza  | Establece presupuestos, políticas y controles.                     |
| Plataforma  | Diseña la arquitectura con servicios como Amazon EC2 y Amazon RDS. |
| Seguridad   | Configura permisos, cifrado y protección de datos.                 |
| Operaciones | Implementa monitoreo, alertas y recuperación ante fallos.          |

Las seis perspectivas permiten abordar la transformación de manera integral, no únicamente desde el punto de vista técnico. No confundas ***AWS CAF*** con ***AWS Migration Hub***: AWS CAF ayuda a planificar y preparar la transformación organizativa; Migration Hub ayuda a descubrir, seguir y gestionar el progreso de las migraciones de aplicaciones mediante sus capacidades compatibles.

**Categoría**: Estrategia y adopción de la nube

**Clave para el examen**:

- Ayuda a evaluar la preparación de una organización.
- Identifica brechas, capacidades y riesgos.
- Orienta la transformación empresarial y tecnológica.
- Considera personas, procesos, gobernanza, seguridad y operaciones.
- No es una herramienta que migre servidores por sí misma.

> **RECUERDA**: AWS CAF = es un **marco de buenas prácticas** que ayuda a las organizaciones a evaluar su preparación para la nube, identificar brechas de capacidades y planificar su transformación digital mediante seis perspectivas: Negocio, Personas, Gobernanza, Plataforma, Seguridad y Operaciones.
>
> **Por ejemplo**: una empresa quiere trasladar sus servidores, bases de datos y aplicaciones desde sus instalaciones físicas hacia AWS. No basta con copiar los servidores a la nube: también debe preparar a sus empleados, revisar la seguridad, organizar los costos, adaptar sus procesos y definir una estrategia. AWS CAF ayuda a identificar y organizar todo ese trabajo.
>
> **Truco de examen**: Si la pregunta trata de estrategia, preparación organizativa o transformación empresarial, piensa en AWS CAF, no en una herramienta técnica de migración.

### 2. Siete estrategias de migración

Lo primero que debes entender es que las ***7 estrategias de migración son diferentes formas de decidir qué hacer con una aplicación cuando una empresa quiere trasladarla a la nube de AWS***. Imagina que una empresa tiene un sistema funcionando en sus propios servidores físicos. Ahora quiere llevarlo a AWS. ***¿Debe copiarlo tal como está? ¿Modificarlo? ¿Reescribirlo? ¿Comprar otro producto? ¿O dejarlo donde está?***. Cada una de esas decisiones corresponde a una estrategia diferente. AWS suele referirse a estas estrategias como las 7 Rs de la migración (7 migration strategies).

1. **Rehost — Reubicar (Mover sin modificar)**. Trasladar la aplicación a AWS prácticamente tal como está, con pocos o ningún cambio. Ejemplo: mover una máquina virtual a Amazon EC2 sin rediseñar la aplicación.

2. **Replatform — Cambiar la plataforma (Mover con ajustes)**. Trasladar la aplicación realizando algunas optimizaciones, pero sin cambiar su arquitectura principal. Ejemplo: migrar una base de datos y pasar a un servicio administrado como Amazon RDS, con los ajustes necesarios.

3. **Refactor / Re-architect — Refactorizar o rediseñar (Cambiar la arquitectura)**. Modificar considerablemente la aplicación para aprovechar mejor las capacidades de la nube. Ejemplo: transformar una aplicación monolítica en microservicios y utilizar servicios sin servidor como AWS Lambda.

4. **Repurchase — Recomprar /Readquirir (Cambiar de producto)**. Sustituir la aplicación actual por otra solución, normalmente un producto comercial o SaaS. Ejemplo: reemplazar un CRM instalado en servidores propios por una solución CRM ofrecida como servicio en la nube.

5. **Retire — Retirar (Eliminar)**. Apagar las aplicaciones que ya no se necesitan. Ejemplo: desactivar un sistema antiguo que ha sido reemplazado y que ya no aporta valor.

6. **Retain — Retener (Dejar donde está)**. Mantener la aplicación en el entorno actual, al menos por ahora. Ejemplo: conservar un sistema local por requisitos regulatorios, dependencias técnicas o porque aún no conviene migrarlo.

7. **Relocate — Reubicar la infraestructura (Trasladar el entorno completo)**. Mover un entorno de infraestructura completo a AWS con cambios mínimos, en lugar de migrar cada servidor individualmente. Ejemplo: trasladar un entorno VMware compatible a VMware Cloud on AWS como una unidad de infraestructura.

**Por ejemplo**, Imagina que las siete estrategias se aplican a una misma empresa que tiene un sistema antiguo de ventas. La pregunta es: ¿qué hacemos con ese sistema? Las decisiones posibles: 

- **¿Ya no sirve?** Si ya no se necesita, se aplica **Retire**: se apaga.
- **¿Todavía debe quedarse donde está?** Se aplica **Retain**: se conserva sin migrarlo por ahora.
- **¿Se necesita migrar y funciona bien como está?** Se puede aplicar **Rehost**: mover la aplicación tal cual.
- **¿Se necesita migrar toda una infraestructura virtual?** Se puede aplicar **Relocate**: trasladar el entorno compatible como una unidad.
- **¿Es mejor utilizar otro producto?** Se aplica **Repurchase**: cambiar la aplicación por otra solución.
- **¿Se puede mejorar sin reconstruirla?** Se aplica **Replatform**: migrar y hacer ajustes limitados.
- **¿Se necesita transformar profundamente?** Se aplica **Refactor**: modificar la arquitectura para aprovechar mejor la nube.

Las diferencias que más suelen confundirse en el examen:

- **Rehost vs. Relocate**. Ambas mueven sistemas sin rediseñarlos significativamente, pero el nivel al que se trasladan es diferente.

| Rehost                             | Relocate                                                    |
| ---------------------------------- | ----------------------------------------------------------- |
| Mueves una aplicación o servidor.  | Trasladas un entorno de infraestructura compatible.         |
| Ejemplo: migrar un servidor a EC2. | Ejemplo: trasladar un entorno VMware a VMware Cloud on AWS. |
| Piensa en mover una máquina.       | Piensa en mover un entorno completo.                        |

> **Rehost** = servidor; **Relocate** = infraestructura completa.

- **Rehost vs. Replatform vs. Refactor**. Estas tres son las más importantes para diferenciar por cuánto cambia la aplicación. Ejemplo: el mismo sistema instalado en una máquina EC2.

>**Rehost** = Cambio mínimo. La aplicación se traslada sin modificar sustancialmente su funcionamiento o arquitectura.
>
>**Replatform** = Cambio moderado. La aplicación se traslada y se realizan ajustes para aprovechar servicios administrados o capacidades de AWS, manteniendo su arquitectura principal. Ejemplo: migrar una base de datos a Amazon RDS sin rediseñar toda la aplicación.
>
>**Refactor** = Cambio profundo. La arquitectura se modifica sustancialmente para aprovechar capacidades nativas de la nube. Ejemplo: convertir un sistema monolítico en microservicios.

>**Regla para el examen**: si el enunciado dice sin modificar la aplicación, piensa en Rehost. Si habla de pequeñas optimizaciones, piensa en Replatform. Si habla de rediseñar la arquitectura para aprovechar la nube, piensa en Refactor.

- **Repurchase vs. Replatform**

>**Repurchase** = comprar otra solución. Cambias el producto. Por ejemplo, sustituyes un programa de contabilidad instalado localmente por un servicio SaaS.
>**Replatform** = cambiar la plataforma. Mantienes la aplicación principal, pero cambias o mejoras la plataforma donde se ejecuta.

- **Retain vs. Retire**

>**Retain** = conservar. El sistema sigue siendo necesario, pero se queda donde está por ahora.
>**Retire** = retirar de servicio. El sistema ya no se necesita y se desactiva.

**Cómo recordar las 7 Rs sin memorizar definiciones largas**, te recomiendo aprenderlas en tres grupos mentales:

>**Grupo 1: ¿Qué hago con el sistema?**
>
>**Retire** = Apagar.
>**Retain** = Conservar.
>
>Pregúntate si todavía necesitas la aplicación. Si no, Retire. Si sí, pero no la migrarás todavía, Retain.

>**Grupo 2: ¿Cómo la traslado?**
>
>**Rehost** = Tal cual.
>**Relocate** = Entorno.
>**Replatform** = Ajustar.
>
>Aquí piensa en el nivel de traslado: una aplicación sin cambios sustanciales, una infraestructura compatible completa o una aplicación con optimizaciones.

>**Grupo 3: ¿Cómo cambio la solución?**
>
>**Repurchase** = Reemplazar.
>**Refactor** = Rediseñar.
>
>Repurchase significa adoptar otro producto; Refactor significa transformar la arquitectura de la aplicación.

### 3. AWS Migration Evaluator

Es un servicio de AWS que ayuda a las empresas a ***analizar sus costos actuales de infraestructura y estimar cuánto podrían costar sus operaciones después de migrar a AWS***. Su objetivo principal es ayudar a la empresa a tomar una decisión informada antes de realizar la migración, mediante un ***análisis basado en datos*** y una ***estimación de los costos potenciales***. AWS Migration Evaluator ayuda a responder la pregunta: “¿Cuánto nos cuesta mantener nuestros servidores actuales y cuánto podríamos ahorrar o gastar si migramos a AWS?”.

>**¿Cómo funciona?**
>
>Imagina que una empresa tiene 100 servidores físicos y quiere trasladarlos a AWS. Antes de migrar, necesita conocer sus costos actuales y calcular cuánto podría costar ejecutarlos en la nube.
>
>1. **Infraestructura actual**. Servidores, uso de recursos y costos actuales.
>
> 2. **Recopilación y análisis**. Datos de infraestructura, utilización y costos.
>
>3. **Estimación de costos en AWS**. Escenarios de costos potenciales después de migrar.
>
>4. **Informe para tomar decisiones**. Evaluar viabilidad económica y planificar la migración

**Categoría**: Evaluación / Análisis de costes

**Clave para el examen**:

- Analiza la infraestructura existente.
- Ayuda a estimar costes potenciales en AWS.
- Evaluar la infraestructura on-premises (inventario y costos) y elaborar un plan de negocio para migrar a AWS.
- Facilita comparar el entorno actual con posibles escenarios en la nube.
- No es una herramienta que migre servidores directamente.

> **RECUERDA**: Migration Evaluator = **evaluar costes antes de migrar**. Es una herramienta de evaluación previa a la migración que analiza los recursos y la utilización de la infraestructura existente para estimar los costos de ejecutarla en AWS y ayudar a justificar la migración desde el punto de vista económico.
>
> **Por ejemplo**: Una empresa tiene 50 servidores locales y descubre que muchos utilizan solo una pequeña parte de su capacidad. Migration Evaluator puede ayudar a estimar qué recursos de AWS podrían cubrir esas necesidades y cuánto costaría ejecutar esas cargas de trabajo en la nube. Los resultados son estimaciones basadas en los datos y supuestos utilizados; no garantizan un ahorro específico.
>
> **Truco de examen**: Si la pregunta menciona analizar costos actuales, estimar costos futuros, calcular ahorros potenciales o construir un caso de negocio para migrar, piensa en **AWS Migration Evaluator**.

### 4. AWS Application Discovery Service

Es un servicio de AWS que ayuda a las empresas a ***descubrir y recopilar información sobre los servidores, las aplicaciones y sus dependencias dentro de su infraestructura actual (centro de datos on-premise)***, con el objetivo de planificar una migración a la nube. La información recopilada puede incluir configuraciones, utilización de recursos y dependencias de red, según el método de descubrimiento utilizado. En palabras sencillas, te ayuda a conocer qué tienes en tus servidores, cómo funcionan y qué sistemas dependen unos de otros antes de migrarlos a AWS. ¿Cómo recopila la información? Hay dos métodos principales:

- **Agentless discovery — Sin agente**. Utiliza el AWS Application Discovery Service Agentless Collector, que se despliega como una máquina virtual en un entorno VMware vCenter compatible. Permite descubrir máquinas virtuales y recopilar datos sin instalar un agente individual en cada servidor. Recuerda: no requiere instalar un agente en cada máquina.

- **Agent-based discovery — Con agente**. Instala el AWS Application Discovery Agent directamente en los servidores físicos o máquinas virtuales compatibles. Puede recopilar información más detallada, incluidos procesos en ejecución, métricas de rendimiento y conexiones de red. Recuerda: instalar un agente permite obtener información más detallada del sistema.

**Categoría**: Descubrimiento / Evaluación de infraestructura

**Clave para el examen**:

- Puede recopilar datos como (Inventario de servidores, CPU y memoria RAM, Almacenamiento, Sistemas operativos, etc.)	
- Recopila información técnica para planificar la migración.
- Ayuda a identificar dependencias entre servidores.
- Facilita decidir qué recursos migrar juntos.
- No realiza por sí mismo la migración de las aplicaciones.

> **RECUERDA**: AWS Application Discovery Service = **descubrir qué tienes antes de migrar**. Recopila información de configuración, utilización y dependencias de los servidores y bases de datos existentes para ayudar a planificar una migración a AWS.
>
> **Por ejemplo**: Imagina que una empresa tiene 200 servidores en sus propias instalaciones y quiere migrarlos a AWS. Antes de comenzar, necesita responder preguntas como: ¿Cuántos servidores tenemos?, ¿Qué sistema operativo utiliza cada uno?, ¿Cuánta memoria, CPU y almacenamiento necesita cada servidor?, Si migramos un servidor, ¿qué otras aplicaciones podrían verse afectadas?
>
> **Truco de examen**: Si la pregunta habla de inventariar servidores, conocer dependencias o recopilar información del centro de datos, piensa en Application Discovery Service.

### 5. AWS Application Migration Service

Es un servicio de AWS que ***permite migrar servidores desde entornos físicos, máquinas virtuales y servidores alojados en otras nubes hacia AWS***, automatizando gran parte del proceso de migración y reduciendo la necesidad de realizar cambios en las aplicaciones. Su enfoque es conocido como ***rehost*** o migración de tipo lift and shift, porque permite ***trasladar aplicaciones con cambios mínimos***. Su nombre abreviado es AWS MGN (AWS Application Migration Service).

>**¿Cómo funciona?**
>
>Imagina que una empresa tiene una aplicación instalada en un servidor local y quiere trasladarla a Amazon EC2.
AWS MGN realiza el proceso de forma general así:
>
>1. **Servidor de origen**. Servidor físico, máquina virtual o servidor compatible de otro entorno.
>
>2. **Replicación continua**. Se replican los datos de los discos hacia un entorno de preparación en AWS.
>
>3. **Pruebas de lanzamiento**. Se crean instancias de prueba en AWS para comprobar que la aplicación funciona correctamente.
>
>4. **Migración definitiva**. Se lanzan las instancias de producción y se realiza el cambio al entorno de AWS.
>
>El servicio replica los datos de los servidores de origen y los convierte para ejecutarse como instancias nativas de Amazon EC2.

**Categoría**: Migración de servidores / Rehost

**Clave para el examen**:

- Migra servidores hacia AWS.
- Replica datos de los servidores de origen.
- Facilita las pruebas antes del cambio definitivo.
- Reduce la necesidad de rediseñar las aplicaciones.
- Puede utilizarse para migrar servidores físicos y virtuales compatibles.

> **RECUERDA**: AWS MGN = **automatiza la migración de servidores físicos, virtuales o alojados en otras nubes hacia Amazon EC2** mediante replicación continua de datos, conversión automática y pruebas previas al cambio definitivo, reduciendo el trabajo manual y el tiempo de inactividad.
>
> **Por ejemplo**: Una empresa quiere trasladar un servidor Linux de su centro de datos a EC2 sin reconstruir la aplicación desde cero.
>
> **Truco de examen**: Si la pregunta habla de migrar servidores completos a EC2 conservando la aplicación, piensa en AWS Application Migration Service (MGN).

### 6. AWS Migration Hub

Es un servico que ***proporciona un lugar centralizado para supervisar y realizar seguimiento del progreso de las migraciones*** de aplicaciones hacia AWS. Permite consultar el estado de los recursos migrados mediante las herramientas compatibles e integradas, facilitando la coordinación de proyectos de migración. Su función principal es ***organizar el seguimiento de la migración y ayudar a conocer qué aplicaciones se han migrado, cuáles siguen en proceso y cuáles presentan tareas pendientes***, según las herramientas y los datos integrados.

**Categoría**: Seguimiento / Gestión de migraciones

**Clave para el examen**:

- Seguimiento centralizado de migraciones.
- Visibilidad del progreso de los proyectos.
- Ayuda a coordinar diferentes migraciones.
- Se integra con herramientas de migración compatibles.
- No debe confundirse con una herramienta especializada que replica servidores o mueve bases de datos.

> **RECUERDA**: Migration Hub = **ver y seguir el progreso de la migración**. Migration Hub no sustituye necesariamente a las herramientas que realizan la migración. Su papel principal es ofrecer visibilidad y seguimiento centralizados.
>
> **Por ejemplo**: Una empresa está migrando 50 aplicaciones con diferentes herramientas y necesita consultar cuáles están pendientes, en curso o completadas.
>
> **Truco de examen**: Si la pregunta habla de un panel centralizado para supervisar migraciones, seguimiento del progreso o visibilidad de múltiples migraciones, piensa en AWS Migration Hub.

**Diferencia con los otros servicios de migración**

| Servicio                          | Función principal                                                    |
| --------------------------------- | -------------------------------------------------------------------- |
| AWS Migration Evaluator           | **Costos y caso de negocio**: ¿cuánto podría costar migrar a AWS? Estima los costos y ayuda a justificar económicamente la migración.  |
| AWS Application Discovery Service | **Inventario y dependencias**: ¿qué tenemos y cómo se relacionan nuestros sistemas? Descubre servidores, recopila información e identifica dependencias. |
| AWS Application Migration Service | **Ejecución de la migración**: ¿cómo trasladamos los servidores a AWS? Replica y migra servidores hacia AWS.                                |
| AWS Migration Hub                 | Centraliza el seguimiento y la visibilidad del proceso de migración. |

### 7. AWS DMS

AWS DMS (Database Migration Service) es un servicio que ***permite migrar bases de datos hacia AWS, entre diferentes motores de bases de datos o entre entornos compatibles***, manteniendo la disponibilidad de las aplicaciones en muchos escenarios. AWS DMS admite migraciones homogéneas y heterogéneas. 

- **Migración homogénea (mismo motor)**. El origen y el destino utilizan el mismo motor de base de datos, o motores compatibles para la modalidad elegida. Ejemplo: `PostgreSQL local → Amazon RDS for PostgreSQL`.

- **Migración heterogénea**. El origen y el destino utilizan motores de bases de datos diferentes.
Ejemplo: `Oracle → Amazon Aurora PostgreSQL-Compatible`. Para recordar: motores diferentes. Puede ser necesario convertir el esquema y el código antes de migrar los datos.

>**¿Cómo funciona?**
>
>Imagina que una empresa tiene una base de datos MySQL en sus propios servidores y quiere trasladarla a Amazon RDS. Sin una herramienta de migración, tendría que planificar cómo copiar los datos y cómo mantenerlos actualizados durante el proceso. AWS DMS facilita este trabajo:
>1. **Origen: MySQL local**. La base de datos continúa funcionando.
>
>2. **AWS DMS**. Copia los datos y puede replicar los cambios nuevos.
>
>3. **Destino: Amazon RDS**. La base de datos migrada recibe los datos.
>
>AWS DMS permite que la base de datos de origen siga operando durante la migración y está diseñado para reducir el tiempo de inactividad.

**Categoría**: Migración de bases de datos

**Clave para el examen**:

- Migra datos entre bases de datos compatibles.
- Admite migraciones homogéneas y heterogéneas.
- Puede replicar cambios continuos.
- Reduce el tiempo de inactividad en muchos escenarios.
- Puede utilizarse con bases de datos locales y servicios de bases de datos de AWS.

> **RECUERDA**: AWS DMS = **servicio administrado que permite migrar y replicar datos entre bases de datos compatibles, tanto con el mismo motor como entre motores diferentes**.
>
> **Por ejemplo**: Una empresa necesita migrar una base de datos PostgreSQL local a Amazon RDS o a otro destino compatible.
>
> **Truco de examen**: Si la pregunta habla de migrar o replicar datos entre bases de datos, piensa en AWS DMS.

### 8. AWS Schema Conversion Tool

AWS Schema Conversion Tool (AWS SCT) es una ***herramienta que ayuda a convertir esquemas y código de bases de datos desde un motor de origen hacia otro motor de destino cuando no son completamente compatibles***. Es especialmente útil en migraciones heterogéneas, por ejemplo, cuando se necesita pasar de una base de datos comercial a otra con un motor diferente.

>**¿Cómo funciona?**
>
>Supongamos que una empresa tiene una base de datos Oracle y quiere utilizar PostgreSQL en AWS.
>1. **Base de datos Oracle**. Tablas, columnas, vistas y procedimientos almacenados.
>2. **AWS Schema Conversion Tool**. Analiza y convierte los objetos que son compatibles.
>3. **PostgreSQL en AWS**. Esquema convertido y objetos que deben revisarse
>
>El proceso general es:
>1. Conectar la herramienta a la base de datos de origen y definir el destino.
>2. Analizar los esquemas y objetos existentes.
>3. Convertir automáticamente los elementos compatibles.
>4. Generar un informe con los elementos que requieren trabajo manual.
>5. Revisar, corregir y aplicar el esquema convertido al destino.
>
>AWS SCT no garantiza que todos los objetos puedan convertirse automáticamente; algunas funciones específicas del motor original pueden necesitar modificaciones manuales.

**Categoría**: Conversión de esquemas / Migración de bases de datos

**Clave para el examen**:

- Analiza la compatibilidad entre motores.
- Convierte esquemas y determinados objetos de bases de datos.
- Puede convertir código SQL y otros elementos compatibles.
- Ayuda a identificar trabajo manual pendiente.
- No debe confundirse con AWS DMS, que se centra en mover y replicar datos.

> **RECUERDA**: AWS SCT = **convertir la estructura y el código de la base de datos**.
>
> **Por ejemplo**: una empresa tiene una base de datos Oracle y quiere migrar a PostgreSQL. Como ambos motores tienen diferencias en sus tipos de datos, funciones, procedimientos almacenados y sintaxis SQL, no siempre basta con copiar los datos. AWS SCT ayuda a convertir los elementos compatibles y a identificar aquellos que requieren modificaciones manuales.

### 9. AWS DataSync

Es un servicio que sirve para ***automatizar y acelerar la transferencia de datos***. DataSync simplifica y acelera la transferencia de grandes cantidades de datos entre el almacenamiento en las instalaciones locales (on-premise) y los servicios de almacenamiento de AWS, como Amazon S3, Amazon EFS y Amazon FSx. Automatiza muchos aspectos del proceso de transferencia, que incluyen las instancias en ejecución, el cifrado y la optimización de la red.

>**¿Cómo funciona?**
>
>Imagina una empresa que tiene un servidor local con 5 TB de documentos y quiere trasladarlos a Amazon S3.
>1. **Servidor local**. 5 TB de documentos.
>2. **AWS DataSync**. Copia, automatiza y verifica los datos.
>3. **Amazon S3**. Documentos almacenados en AWS.
>
>La empresa configura la transferencia y DataSync se encarga de copiar los datos, comprobar su integridad y, si se necesita, ejecutar nuevas transferencias para copiar cambios.

**Categoría**: Transferencia de archivos y datos

**Clave para el examen**:

- Automatiza transferencias de datos.
- Mueve archivos y objetos entre ubicaciones compatibles.
- Permite programar transferencias.
- Puede utilizarse para migraciones y sincronización.
- No es la herramienta principal para convertir esquemas de bases de datos.

> **RECUERDA**: AWS DataSync = **Transfiere grandes volúmenes de datos entre almacenamiento on-premises y AWS** (o entre servicios AWS) de forma rápida y automatizada.
>
> **Por ejemplo**: Una empresa tiene varios terabytes de archivos en un servidor local y necesita transferirlos a Amazon S3 o Amazon EFS.
>
> **Truco de examen**: Si la pregunta menciona transferencia automatizada de archivos entre almacenamiento local y AWS, piensa en AWS DataSync.

### 10. AWS Transfer Family

Es un servicio administrado de AWS que ***permite transferir archivos hacia y desde servicios de almacenamiento de AWS***, como Amazon S3 y Amazon EFS, utilizando protocolos estándar de transferencia de archivos como SFTP, FTPS, FTP y AS2.

**Categoría**: Transferencia de archivos / Protocolos administrados

**Clave para el examen**:

- Permite utilizar protocolos conocidos de transferencia de archivos.
- Admite SFTP, FTPS y FTP, además de AS2 en escenarios compatibles.
- Se integra con destinos como Amazon S3 y Amazon EFS.
- Reduce la necesidad de administrar servidores de transferencia.
- Es útil cuando una empresa ya utiliza sistemas basados en esos protocolos.

> **RECUERDA**: AWS Transfer Family = **transferir archivos a AWS usando protocolos conocidos sin administrar tu propio servidor de transferencia.**.
>
> **Por ejemplo**: una empresa recibe diariamente archivos CSV de sus proveedores mediante SFTP. Con AWS Transfer Family, los proveedores pueden seguir enviando los archivos mediante ese protocolo, mientras la empresa los almacena en Amazon S3 para procesarlos posteriormente.
>
> **Truco de examen**: Si la pregunta menciona SFTP, FTPS, FTP o AS2 para transferir archivos a AWS, piensa en AWS Transfer Family.

### 11. AWS Snow Family

es una ***familia de dispositivos físicos (Snowcone, Snowball, Snowmobile)*** diseñados para ***mover grandes cantidades de datos hacia AWS, desde AWS***. Estos dispositivos son útiles cuando la transferencia por Internet sería demasiado lenta, costosa o difícil debido a las limitaciones de conectividad.

**Categoría**: Migración física de datos / Edge Computing

**Clave para el examen**:

- Dispositivos físicos para transferir datos.
- Adecuados para grandes volúmenes de información.
- Útiles en ubicaciones con conectividad limitada.
- Algunos dispositivos permiten procesar datos localmente.
- AWS Snowcone y AWS Snowball Edge son nombres importantes que puedes encontrar en materiales y preguntas sobre la familia Snow.

> **RECUERDA**: AWS Snow Family = **llevar físicamente los datos cuando la red no es suficiente**. Dispositivos físicos (Snowcone, Snowball, Snowmobile) para transferir grandes volúmenes de datos sin depender de la red
>
> **Por ejemplo**: Una empresa necesita trasladar decenas o cientos de terabytes desde una ubicación remota donde la conexión a Internet es limitada.
>
> **Truco de examen**: Si la pregunta habla de transferir grandes volúmenes de datos mediante dispositivos físicos, piensa en AWS Snow Family.

**Clave para el examen AWS Cloud Practitioner**

| Servicio            | ¿Qué debes recordar?                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| AWS Snow Family     | Dispositivos físicos para transferir grandes volúmenes de datos y realizar procesamiento en ubicaciones remotas. |
| AWS DataSync        | Transferencia y sincronización automatizada mediante la red.                                                     |
| AWS Transfer Family | Transferencia de archivos mediante protocolos como SFTP.                                                         |

# Tabla rápida para el examen

| Servicio o concepto                 | Función principal                                                                   | Recuerda                                  |
| ----------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------- |
| Migración a AWS                     | Trasladar aplicaciones y datos a la nube                                            | Mover a AWS                               |
| Tres fases de migración             | Evaluar, preparar y migrar                                                          | Assess / Mobilize / Migrate               |
| AWS CAF                             | Planificar la adopción de la nube                                                   | Estrategia empresarial                    |
| Las 7 Rs                            | Elegir cómo migrar cada aplicación                                                  | Estrategias de migración                  |
| Migration Evaluator                 | Analizar infraestructura y estimar costes                                           | Costes antes de migrar                    |
| Application Discovery Service       | Descubrir servidores y dependencias                                                 | Inventariar                               |
| Application Migration Service (MGN) | Migrar servidores a AWS                                                             | Servidores → EC2                          |
| Migration Hub                       | Supervisar el progreso de las migraciones                                           | Seguimiento centralizado                  |
| AWS DMS                             | Migrar y replicar datos entre bases de datos                                        | Mover datos de BD                         |
| AWS SCT                             | Convertir esquemas y código de bases de datos                                       | Convertir estructura                      |
| AWS DataSync                        | Transferir y sincronizar archivos y objetos                                         | Mover archivos                            |
| AWS Transfer Family                 | Transferir archivos mediante SFTP, FTPS, FTP y AS2                                  | Protocolos de transferencia               |
| AWS Snow Family                     | Transferir datos mediante dispositivos físicos y realizar ciertas tareas en el edge | Grandes volúmenes / conectividad limitada |

**Las diferencias que más conviene memorizar**

**AWS CAF vs Migration Evaluator**

> **AWS CAF (estrategia de adopción)** = ayuda a planificar la adopción de AWS desde el punto de vista empresarial, organizativo y técnico.
>**Migration Evaluator (análisis de costes)** = ayuda a analizar la infraestructura existente y estimar costes para justificar la migración.

**Application Discovery Service vs Application Migration Service**

> **Application Discovery Service** = descubre servidores, configuraciones y dependencias. 
>**Application Migration Service (MGN)** = migra servidores hacia AWS.

**AWS DataSync vs AWS Transfer Family**

> **DataSync** = automatiza y acelera transferencias y sincronizaciones de archivos y objetos. 
>T**ransfer Family** = permite intercambiar archivos mediante protocolos conocidos como SFTP, FTPS y FTP.

**AWS DataSync vs AWS Snow Family**

> **DataSync** = transferencia de datos mediante conectividad de red. 
>**Snow Family** = dispositivos físicos para transferir grandes volúmenes de datos y, según el dispositivo, ejecutar procesamiento local.

**Palabras clave que debes reconocer en el examen**

| Si la pregunta dice...                                              | Piensa en...                  |
| ------------------------------------------------------------------- | ----------------------------- |
| Evaluar la preparación de una organización                          | AWS CAF                       |
| Estimar costes de migración                                         | Migration Evaluator           |
| Descubrir servidores y dependencias                                 | Application Discovery Service |
| Migrar servidores completos a EC2                                   | Application Migration Service |
| Consultar el progreso de diferentes migraciones                     | Migration Hub                 |
| Migrar datos entre bases de datos                                   | AWS DMS                       |
| Convertir esquemas entre motores de bases de datos                  | AWS SCT                       |
| Transferir archivos automáticamente entre almacenamiento            | AWS DataSync                  |
| Transferir archivos por SFTP                                        | AWS Transfer Family           |
| Mover terabytes de datos sin suficiente conectividad                | AWS Snow Family               |
| Trasladar una aplicación con cambios mínimos                        | Rehost                        |
| Optimizar una aplicación sin rediseñarla por completo               | Replatform                    |
| Rediseñar una aplicación para aprovechar la nube                    | Refactor                      |
| Retirar aplicaciones innecesarias                                   | Retire                        |
| Mantener una aplicación en su entorno actual                        | Retain                        |
| Sustituir una aplicación por un producto SaaS                       | Repurchase                    |
| Trasladar una infraestructura compatible sin rediseño significativo | Relocate                      |


## Soluciones de AWS Well-Architected

Las soluciones de AWS Well-Architected son un ***conjunto de principios, prácticas recomendadas y herramientas*** que ayudan a diseñar, revisar y mejorar arquitecturas en AWS. Su objetivo es garantizar que las cargas de trabajo sean seguras, confiables, eficientes, rentables y sostenibles, de acuerdo con las necesidades del negocio.

### 1. AWS Well-Architected

Es un ***conjunto de buenas prácticas y recomendaciones*** de AWS que ayuda a diseñar, construir y mejorar sistemas en la nube para que sean seguros, eficientes, confiables y rentables. Su objetivo es ayudarte a comprobar si una arquitectura está bien diseñada y detectar problemas antes de que afecten a la aplicación.

**Categoría**: Diseño y evaluación de arquitecturas / Buenas prácticas en la nube.

**Clave para el examen**:

- Ayuda a revisar si una arquitectura sigue las buenas prácticas de AWS.
- Busca identificar riesgos, debilidades y oportunidades de mejora.
- No garantiza automáticamente que una arquitectura sea perfecta ni reemplaza la responsabilidad del arquitecto.

> **RECUERDA**: AWS Well-Architected = **es el enfoque general de AWS para evaluar y mejorar arquitecturas en la nube mediante buenas prácticas.**
>
>**Por ejemplo**, tienes una aplicación desplegada en AWS. Quieres asegurarte de que soporte muchos usuarios, proteja sus datos, no pierda información y no genere gastos innecesarios. AWS Well-Architected te orienta sobre qué aspectos debes revisar y mejorar.
>
>**Truco de examen**: Si la pregunta habla de revisar una arquitectura según las buenas prácticas de AWS, identificar riesgos o mejorar una carga de trabajo, piensa en AWS Well-Architected.

### 2. AWS Well-Architected Framework

El Marco de AWS Well-Architected (Well-Architected Framework) es la ***guía estructurada de principios, preguntas y buenas prácticas que permite evaluar una carga de trabajo frente a seis pilares***. Cada pilar representa un aspecto importante que debes considerar al diseñar o evaluar una carga de trabajo en la nube. Mientras que ***AWS Well-Architected*** es el concepto general de revisión y mejora de arquitecturas, el Framework es el marco de referencia que organiza las recomendaciones. Los seis pilares son:

1. **Excelencia operativa (Operational Excellence)**. Permite ejecutar, supervisar y mejorar continuamente los sistemas y sus procesos operativos. Ejemplo: automatizar despliegues y supervisar errores.

2. **Seguridad (Security)**. Protege los datos, los sistemas y los recursos mediante controles de acceso, cifrado y monitoreo. Ejemplo: utilizar IAM para controlar quién accede a los recursos.

3. **Fiabilidad (Reliability)**. Busca que los sistemas funcionen correctamente, se recuperen de fallos y estén disponibles cuando se necesiten. Ejemplo: distribuir recursos entre varias zonas de disponibilidad.

4. **Eficiencia del rendimiento (Performance Efficiency)**. Busca utilizar los recursos tecnológicos adecuados de manera eficiente para obtener un buen rendimiento y adaptarse a las necesidades. Ejemplo: elegir el tipo de instancia EC2 apropiado para una aplicación.

5. **Optimización de costos (Cost Optimization)**. Ayuda a evitar gastos innecesarios y a aprovechar eficientemente el dinero invertido en AWS. Ejemplo: eliminar recursos sin uso y elegir modelos de compra adecuados.

6. **Sostenibilidad (Sustainability)**. Busca reducir el impacto ambiental de las cargas de trabajo mediante el uso eficiente de los recursos. Ejemplo: evitar capacidad de cómputo innecesaria y optimizar su utilización.

**Categoría**: Marco de arquitectura / Buenas prácticas de diseño en AWS.

**Clave para el examen**:

- Está organizado en seis pilares: excelencia operativa, seguridad, fiabilidad, eficiencia del rendimiento, optimización de costos y sostenibilidad.
- Ayuda a identificar decisiones de diseño que pueden generar riesgos.
- Orienta las mejoras según las necesidades de cada carga de trabajo.
- No es un servicio que aprovisione recursos automáticamente.
- Los pilares deben considerarse en conjunto: optimizar uno no debe perjudicar innecesariamente a los demás.

> **RECUERDA**: AWS Well-Architected Framework = **guía que contiene los seis pilares y las buenas prácticas para diseñar cargas de trabajo en AWS**.
>
>**Por ejemplo**, antes de lanzar una aplicación de comercio electrónico, un equipo revisa su seguridad, capacidad de recuperación, rendimiento, costos y operación. Utiliza el marco para detectar problemas antes de que afecten a los usuarios.
>
>**Truco de examen**: Si la pregunta menciona los seis pilares, principios de diseño o buenas prácticas para evaluar una carga de trabajo, piensa en el AWS Well-Architected Framework.

### 3. AWS Well-Architected Tool

Es una herramienta de AWS que ***permite documentar y revisar una carga de trabajo mediante preguntas basadas en el Well-Architected Framework***, identificar riesgos y obtener recomendaciones para mejorar su arquitectura. Ayuda a organizar las revisiones de arquitectura y a dar seguimiento a los problemas detectados. En otras palabras, transforma las buenas prácticas del Framework en una evaluación práctica.

**Categoría**: Herramienta de evaluación / Revisión de arquitecturas.

**Clave para el examen**:

- Permite crear y documentar revisiones de cargas de trabajo.
- Utiliza preguntas alineadas con los pilares del marco.
- Ayuda a identificar riesgos de arquitectura.
- Permite registrar mejoras y hacer seguimiento de su estado.
- No corrige automáticamente todos los problemas detectados: el equipo debe evaluar e implementar las recomendaciones.

> **RECUERDA**: AWS Well-Architected Tool = **la herramienta que utilizas para revisar una carga de trabajo y registrar sus riesgos y mejoras**.
>
>**Por ejemplo**, una empresa utiliza AWS para ejecutar una aplicación bancaria. El equipo de arquitectura realiza una revisión con la herramienta y detecta riesgos relacionados con permisos, recuperación ante desastres y costos. Después documenta las acciones que debe realizar para reducirlos.
>
>**Truco de examen**: si la pregunta habla de una herramienta para evaluar cargas de trabajo, identificar riesgos y recibir recomendaciones basadas en los seis pilares, la respuesta es AWS Well-Architected Tool.

**Diferencia entre los tres conceptos**

| Concepto                   | ¿Qué es?                                                 | ¿Cómo recordarlo?             |
| -------------------------- | -------------------------------------------------------- | ----------------------------- |
| AWS Well-Architected       | El enfoque general de buenas prácticas de AWS.           | La filosofía. Te indica que debes diseñar bien tus sistemas.                |
| Well-Architected Framework | La guía organizada en seis pilares.                      | Las reglas y los criterios. Te explica qué aspectos debes evaluar.  |
| Well-Architected Tool      | La herramienta que ayuda a evaluar una carga de trabajo. | El instrumento de evaluación. Te ayuda a realizar la evaluación y detectar riesgos. |

### 4. AWS CodeBuild

Es un servicio de ***integración continua*** (CI) completamente administrado que ***permite compilar código fuente, ejecutar pruebas automatizadas y generar artefactos de software*** sin necesidad de configurar ni mantener servidores de compilación. En palabras sencillas, es como un ayudante automático que toma el código de tu proyecto, instala las dependencias necesarias, lo compila, ejecuta las pruebas y prepara los archivos para desplegar la aplicación.

**Categoría**: Herramientas para desarrolladores / Integración continua (CI).

**Clave para el examen**:

- Compila código y ejecuta pruebas automáticamente.
- No necesitas administrar servidores de compilación.
- Usa un archivo `buildspec.yml` para definir los pasos de compilación.
- Puede integrarse con CodePipeline para automatizar el proceso de entrega de software.

> **RECUERDA**: AWS CodeBuild = **compilar código y ejecutar pruebas**. No lo confundas con AWS CodeDeploy, que se encarga de automatizar despliegues, ni con AWS CodePipeline, que coordina las diferentes etapas del proceso CI/CD.
>
>**Por ejemplo**, cuando un desarrollador sube cambios a un repositorio, CodeBuild puede descargar el código, instalar las dependencias, ejecutar las pruebas y generar el paquete listo para desplegar.
>
>**Truco de examen**: Si la pregunta habla de compilar, probar código o generar artefactos sin administrar servidores, piensa en AWS CodeBuild.

**Diferencia entre AWS CodeBuild y AWS CodePipeline**

| Servicio         | Función principal                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------- |
| AWS CodeBuild    | Compila el código, ejecuta pruebas y genera artefactos.                                       |
| AWS CodePipeline | Coordina las etapas de un flujo de entrega, como obtener el código, compilarlo y desplegarlo. |

>Ambos servicios pueden trabajar juntos: CodePipeline organiza el proceso y CodeBuild realiza las tareas de compilación y pruebas.

### 5. AWS CodePipeline

Es un servicio de integración y entrega continuas (CI/CD) completamente administrado que ***automatiza las fases de creación, prueba e implementación del proceso de lanzamiento***. Esto ayuda a los desarrolladores a optimizar los flujos de trabajo del lanzamiento del software y a ofrecer nuevas características y correcciones de manera fiable, sin necesidad de aprovisionar servidores.

**Categoría**: DevOps / Integración y entrega continuas (CI/CD).

**Clave para el examen**:

- Automatiza el flujo completo de entrega de software.
- Organiza el proceso en etapas (stages) y acciones.
- Puede integrarse con CodeBuild para compilar el código.
- Puede coordinar despliegues mediante servicios como AWS CodeDeploy.
- CodePipeline coordina el proceso; no sustituye por sí solo a todas las herramientas que ejecutan cada etapa.

> **RECUERDA**: AWS CodePipeline = **orquestar el flujo de entrega del software**. Automatiza y coordina las diferentes etapas del proceso de entrega de software (CI/CD), desde obtener el código fuente hasta compilarlo, probarlo y desplegarlo en un entorno de destino.
>
>**Por ejemplo**, cuando un desarrollador actualiza el código de una aplicación, CodePipeline coordina los pasos necesarios para preparar y publicar esa nueva versión, utilizando otros servicios cuando sea necesario.
>
>**Truco de examen**: Si la pregunta menciona automatizar y coordinar las etapas de compilación, pruebas y despliegue, piensa en AWS CodePipeline.

### 6. AWS CodeDeploy

Es un servicio de AWS que ***automatiza el despliegue de aplicaciones*** en servidores y entornos compatibles, permitiendo actualizar el software de forma controlada, reducir errores manuales y mantener un proceso de publicación consistente.

**Categoría**: Despliegue de aplicaciones

**Clave para el examen**:

- Recibe la versión de la aplicación: utiliza los archivos y artefactos preparados previamente.
- Ejecuta el despliegue, instala los archivos, actualiza la aplicación o cambia la versión activa según la estrategia configurada.
- Permite conocer el estado del despliegue y detectar errores.
- Puede ejecutar acciones de reversión (rollback) cuando se configuran las condiciones y mecanismos correspondientes.

> **RECUERDA**: AWS CodeDeploy = **Desplegar aplicaciones**.
>
>**Por ejemplo**, Imagina que tienes una aplicación web ejecutándose en servidores Amazon EC2 y acabas de desarrollar una nueva versión. Con AWS CodeDeploy puedes: Distribuir los archivos de la nueva versión. Ejecutar scripts para detener, actualizar o iniciar la aplicación. Desplegar la actualización en las instancias configuradas.
>
>**Truco de examen**: Si una pregunta menciona automatizar la actualización de una aplicación en servidores, Amazon EC2, AWS Lambda o Amazon ECS, considera AWS CodeDeploy, según el escenario descrito.

**Diferencia entre CodeBuild, CodePipeline y CodeDeploy**

| Servicio         | Función principal                                                 |
| ---------------- | ----------------------------------------------------------------- |
| AWS CodeBuild    | Compila el código, ejecuta pruebas y genera artefactos.           |
| AWS CodePipeline | Coordina el flujo completo de entrega del software. Coordina las etapas del flujo CI/CD.               |
| AWS CodeDeploy   | Automatiza el despliegue de aplicaciones en destinos compatibles. |

>Los tres pueden trabajar juntos: **CodePipeline** coordina el flujo, **CodeBuild** prepara la aplicación y **CodeDeploy** realiza el despliegue cuando el destino y la configuración son compatibles.

### 7. AWS CodeCommit

Es un servicio de control de versiones basado en Git que ***permite almacenar, administrar y colaborar en el código fuente de proyectos dentro de repositorios privados alojados en AWS***. En palabras sencillas, es como un repositorio privado en la nube, similar a GitHub, donde los desarrolladores guardan el código de sus proyectos, registran los cambios realizados y colaboran con otros integrantes del equipo.

**Categoría**: Repositorio privado en AWS

**Clave para el examen**:

- Control de versiones: conserva el historial de cambios del código.
- Repositorios privados: almacena código con controles de acceso.
- Colaboración: facilita el trabajo con ramas y cambios compartidos.

> **RECUERDA**: AWS CodeCommit = **Almacenar y controlar versiones del código fuente mediante Git**.
>
>**Truco de examen**: Si una pregunta menciona repositorios Git privados para alojar código fuente en AWS, esa es la función que históricamente identificaba a CodeCommit.

### 8. AWS X-Ray

Es un servicio de AWS que ***permite analizar y rastrear las solicitudes*** que recorren una aplicación distribuida para identificar errores, cuellos de botella y problemas de rendimiento. En palabras sencillas, es como un sistema de seguimiento que te permite ver qué sucede cuando una solicitud pasa por diferentes componentes de una aplicación, cuánto tarda cada uno en responder y dónde se produce un problema.

**Categoría**: Observabilidad / Monitoreo y diagnóstico de aplicaciones.

**Clave para el examen**:

- Rastrea solicitudes a través de diferentes componentes.
- Ayuda a identificar dónde se producen errores o retrasos.
- Es útil en arquitecturas de microservicios y aplicaciones distribuidas.
- Complementa otras herramientas de monitoreo; no es un servicio para compilar o desplegar código.
- Mide los tiempos de respuesta.

> **RECUERDA**: AWS X-Ray = **Rastrear y diagnosticar solicitudes**. Seguir una solicitud para descubrir dónde falla o se ralentiza.
>
>**Por ejemplo**, una aplicación recibe una solicitud, consulta una función Lambda y después accede a una base de datos. Si la respuesta tarda demasiado, X-Ray puede ayudar a identificar qué componente está provocando la demora.
>
>**Truco de examen**: Si una pregunta describe una aplicación distribuida y necesitas identificar dónde se producen errores, retrasos o problemas de rendimiento durante el recorrido de una solicitud, considera AWS X-Ray.

**No lo confundas con otros servicios**

| Servicio          | ¿Para qué sirve?                                                                   |
| ----------------- | ---------------------------------------------------------------------------------- |
| AWS X-Ray         | Rastrea solicitudes y ayuda a diagnosticar problemas en aplicaciones distribuidas. |
| Amazon CloudWatch | Recopila métricas, registros y alarmas para supervisar recursos y aplicaciones.    |
| AWS CloudTrail    | Registra la actividad y las llamadas a la API realizadas en una cuenta de AWS.     |

>**X-Ray** funciona como una radiografía de una solicitud: te ayuda a ver por dónde pasa y dónde está el problema.

### 9. AWS AppSync

Es un servicio de ***GraphQL*** completamente administrado. Con AWS AppSync, los desarrolladores pueden ***crear una única API de GraphQL que pueda acceder, manipular y combinar*** de forma segura los datos de varios orígenes. Esto ayuda a los desarrolladores a conectar las aplicaciones de frontend con los datos de backend. Puede integrar fuentes como DynamoDB, Lambda y otros sistemas, permitiendo que el cliente solicite los datos que necesita mediante consultas GraphQL.

**Categoría**: Desarrollo de aplicaciones / API / GraphQL.

**Clave para el examen**:

- Facilita la creación y administración de API GraphQL.
- Conecta aplicaciones con múltiples fuentes de datos.
- Puede admitir actualizaciones en tiempo real mediante suscripciones, según la configuración.
- Ayuda a reducir el trabajo necesario para construir la capa de acceso a datos de una aplicación.

> **RECUERDA**: AWS AppSync = **API GraphQL y datos en tiempo real que conecta aplicaciones con datos**. AppSync significa Application Synchronization; asócialo con conectar aplicaciones y sincronizar datos.
>
>**Por ejemplo**, una aplicación móvil necesita consultar el perfil de un usuario, sus pedidos y el estado de sus notificaciones. AppSync puede ofrecer una API que reúna la información procedente de diferentes fuentes.
>
>**Truco de examen**: Si aparece GraphQL, acceso unificado a varias fuentes de datos o actualizaciones en tiempo real, piensa en AWS AppSync.

**Diferencia entre AWS AppSync y Amazon API Gateway**

| Servicio           | Función principal                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------- |
| AWS AppSync        | Crea API GraphQL y aplicaciones con capacidades de datos en tiempo real y sincronización. |
| Amazon API Gateway | Crea, publica, protege y administra API REST, HTTP y WebSocket.                           |

### 10. AWS Amplify

Es un conjunto de herramientas y servicios de AWS que permite a los desarrolladores ***crear, configurar y desplegar aplicaciones web y móviles conectándolas fácilmente con servicios de backend***, como autenticación, API, almacenamiento y bases de datos. En palabras sencillas, AWS Amplify facilita el desarrollo de aplicaciones porque proporciona herramientas para construir tanto el frontend como las funciones de backend que necesita una aplicación, sin tener que configurar manualmente toda la infraestructura desde cero.

**Categoría**: Desarrollo de aplicaciones web y móviles / Herramientas para desarrolladores.

**Clave para el examen**:

- Simplifica el desarrollo de aplicaciones frontend.
- Facilita la integración con servicios de AWS.
- Puede utilizarse para alojar y desplegar aplicaciones web.
- No es lo mismo que AppSync: Amplify es un conjunto más amplio de herramientas; AppSync se centra en API y acceso a datos.

> **RECUERDA**: AWS Amplify = **herramientas para construir y desplegar aplicaciones web y móviles**. Amplify ayuda a amplificar la productividad del desarrollador, simplificando la conexión entre la aplicación y los servicios de AWS.
>
>**Por ejemplo**, un desarrollador crea una aplicación web con React y necesita publicarla, configurar el acceso de usuarios y conectarla con una API. Amplify puede simplificar varias de esas tareas.
>
>**Truco de examen**: Si la pregunta menciona facilitar el desarrollo de frontend, conectar aplicaciones con AWS o alojar una aplicación web, piensa en AWS Amplify.

**Diferencia entre AWS Amplify y AWS AppSync**

| Servicio    | Función principal                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| AWS Amplify | Proporciona herramientas para desarrollar, conectar y desplegar aplicaciones web y móviles.                   |
| AWS AppSync | Proporciona capacidades para crear API GraphQL y sincronizar datos, incluidas actualizaciones en tiempo real. |

>Relación entre ambos: **Amplify** puede facilitar la integración de una aplicación con **AppSync** cuando necesitas una API GraphQL.

### 11. Amazon Connect

Es un servicio de **centro de contacto en la nube basado en IA que permite a las empresas gestionar la comunicación con sus clientes mediante llamadas telefónicas, chat y otros canales digitales***, sin necesidad de construir y mantener toda la infraestructura tradicional de un centro de llamadas. En palabras sencillas, es como una central de atención al cliente virtual que funciona en la nube y permite gestionar llamadas, atender consultas, crear menús automáticos y utilizar inteligencia artificial para mejorar la experiencia del cliente.

**Categoría**: Atención al cliente / Centro de contacto en la nube.

**Clave para el examen**:

- Permite crear centros de contacto en la nube.
- Facilita la gestión de llamadas y conversaciones con clientes.
- Permite configurar flujos de contacto y distribuir las interacciones a los agentes.
- Puede integrarse con otros servicios de AWS para incorporar análisis y capacidades de inteligencia artificial.

>**RECUERDA**: Amazon Connect = **Centro de contacto y atención al cliente en la nube**. Connect significa conectar. Amazon Connect conecta a los clientes con los agentes y servicios de atención de una empresa.
>
>**Por ejemplo**, una empresa necesita atender las consultas de sus clientes por teléfono y chat. Con Amazon Connect puede configurar las líneas de atención, crear menús automáticos y dirigir las consultas a los agentes adecuados.
>
>**Truco de examen**: Si una pregunta describe un servicio para gestionar llamadas, chats, atención al cliente, agentes y menús telefónicos automáticos sin mantener una central física, la respuesta es Amazon Connect.

### 12. Amazon AppStream 2.0

Es un servicio administrado de transmisión de aplicaciones que ***permite entregar aplicaciones de escritorio desde AWS a los usuarios a través de un navegador web***, sin tener que instalar y ejecutar localmente toda la aplicación en el dispositivo del usuario. En palabras sencillas, es como tener una aplicación instalada en un ordenador remoto de AWS y poder utilizarla desde tu propio computador a través de internet. La aplicación se ejecuta en la nube y tú recibes su interfaz en tu pantalla.

**Categoría**: Escritorios y aplicaciones virtuales / Transmisión de aplicaciones.

**Clave para el examen**:

- Transmite aplicaciones desde la nube al dispositivo del usuario.
- Las aplicaciones se ejecutan en la infraestructura de AWS.
- Aplicaciones de software como servicio (SaaS) y aplicaciones convertidas de escritorio a SaaS.
- Es útil cuando una organización necesita distribuir aplicaciones de escritorio de forma centralizada.

> **RECUERDA**: AppStream 2.0 = **transmitir aplicaciones individuales desde la nube**. AppStream significa que las aplicaciones llegan al usuario mediante un flujo de transmisión, como un vídeo, pero permitiendo interactuar con ellas.
>
>**Por ejemplo**, una universidad necesita que sus estudiantes utilicen un programa especializado que exige muchos recursos. En lugar de instalarlo en cada computadora, puede proporcionar acceso a la aplicación mediante AppStream 2.0.
>
>**Truco de examen**: Si una pregunta describe el acceso a aplicaciones de escritorio desde un navegador sin instalarlas localmente, considera Amazon AppStream 2.0.

**Diferencia entre Amazon AppStream 2.0 y Amazon WorkSpaces**

| Servicio             | Función principal                                         |
| -------------------- | --------------------------------------------------------- |
| Amazon AppStream 2.0 | Transmite aplicaciones individuales desde AWS al usuario. |
| Amazon WorkSpaces    | Proporciona un escritorio virtual completo en la nube.    |

>La diferencia clave es que **AppStream 2.0** se centra en ejecutar y transmitir aplicaciones, mientras que **WorkSpaces** ofrece un entorno de escritorio virtual completo.

### 13. Amazon WorkSpaces

Es un servicio administrado de AWS que ***permite crear y proporcionar escritorios virtuales en la nube***, para que los usuarios puedan acceder a un entorno de trabajo completo desde diferentes dispositivos a través de internet. En palabras sencillas, es como tener un computador alojado en los servidores de AWS al que puedes conectarte desde tu portátil, computador personal o dispositivo compatible. El escritorio, el sistema operativo y las aplicaciones se ejecutan en la nube, no directamente en tu equipo local.

**Categoría**: Escritorios virtuales / Virtual Desktop Infrastructure (VDI).

**Clave para el examen**:

- Proporciona escritorios virtuales en la nube.
- Permite centralizar la administración de los entornos de trabajo.
- Los usuarios acceden a un escritorio completo, con sus aplicaciones y configuración.
- Puede ayudar a facilitar el trabajo remoto y reducir la necesidad de administrar físicamente cada equipo.

> **RECUERDA**: Amazon WorkSpaces = **Un computador virtual en la nube**. WorkSpaces significa espacios de trabajo. AWS te proporciona un espacio de trabajo virtual completo, accesible desde donde lo necesites.
>
>**Por ejemplo**, una empresa tiene empleados que trabajan desde casa y necesita proporcionarles un entorno corporativo controlado. Puede asignarles escritorios virtuales a los que accedan desde sus computadoras personales.
>
>**Truco de examen**: Si la pregunta habla de escritorios virtuales completos para empleados o trabajo remoto, piensa en Amazon WorkSpaces.

**Diferencia entre Amazon WorkSpaces y Amazon AppStream 2.0**

| Servicio             | Función principal                                            |
| -------------------- | ------------------------------------------------------------ |
| Amazon WorkSpaces    | Proporciona un escritorio virtual completo en la nube.       |
| Amazon AppStream 2.0 | Transmite aplicaciones específicas desde la nube al usuario. |

>Si necesitas acceder a un computador virtual con varias aplicaciones, utiliza **WorkSpaces**. Si solo necesitas ejecutar una aplicación especializada desde el navegador, considera **AppStream 2.0**.

### 14. Amazon WorkSpaces Secure Browser

Es un servicio de ***navegación web*** administrada que ***permite a los usuarios acceder a sitios web y aplicaciones web desde una sesión de navegador alojada en AWS***, con controles de seguridad centralizados. En palabras sencillas, es como utilizar un navegador web remoto y protegido: el navegador se ejecuta en la infraestructura de AWS y el usuario interactúa con él desde su navegador habitual. Esto ayuda a las empresas a controlar el acceso a sus aplicaciones web y a reducir la exposición de datos corporativos en los dispositivos personales.

**Categoría**: Seguridad / Acceso seguro a aplicaciones web.

**Clave para el examen**:

- Proporciona acceso a aplicaciones web mediante sesiones de navegador remotas.
- Proporciona un entorno protegido.
- Ayuda a controlar el acceso a recursos web corporativos.
- Reduce la necesidad de permitir que los datos corporativos se descarguen directamente en el dispositivo del usuario, según las políticas configuradas.
- No proporciona el mismo tipo de entorno que un escritorio virtual completo de WorkSpaces.

> **RECUERDA**: WorkSpaces Secure Browser = **navegador remoto y controlado para acceder a aplicaciones web**. Secure Browser es solamente un navegador aislado.
>
>**Por ejemplo**, una empresa permite que sus contratistas accedan a una aplicación interna desde sus propios dispositivos. Con Secure Browser puede ofrecerles una sesión de navegador controlada sin tener que entregarles un escritorio corporativo completo.
>
>**Truco de examen**: Si la pregunta menciona acceso seguro a aplicaciones web mediante un navegador remoto, piensa en Amazon WorkSpaces Secure Browser.

### 15. AWS IoT Core

Es un servicio administrado que ***permite conectar dispositivos físicos a AWS de forma segura para que puedan enviar y recibir mensajes, intercambiar datos y comunicarse con otros servicios***. Está diseñado para trabajar con dispositivos conectados, sensores y sistemas del Internet de las cosas (IoT).

**Categoría**: Internet de las cosas (IoT) / Conectividad de dispositivos.

**Clave para el examen**:

- Permite conectar dispositivos IoT con AWS.
- Admite protocolos como MQTT y HTTPS, entre otros mecanismos compatibles.
- Facilita el intercambio seguro de mensajes entre dispositivos y la nube.
- Puede integrar los datos recibidos con otros servicios de AWS para procesarlos, almacenarlos o analizarlos.

> **RECUERDA**: AWS IoT Core = **conectar dispositivos físicos con la nube de AWS**. IoT Core es el servicio central que facilita la comunicación de esos dispositivos con AWS.
>
>**Por ejemplo**, una fábrica tiene sensores que miden la temperatura de sus máquinas. Los sensores pueden enviar mediciones a AWS IoT Core, que permite encaminar esos datos a otros servicios para analizarlos y detectar posibles problemas.
>
>**Truco de examen**: Si la pregunta menciona sensores, dispositivos conectados, mensajes MQTT o Internet de las cosas, piensa en AWS IoT Core.

### 15. AWS CloudFormation

Es un servicio de AWS que ***permite definir, aprovisionar y administrar recursos de infraestructura mediante plantillas declarativas***, en formatos como YAML o JSON. En palabras sencillas, es como un plano de construcción para tu infraestructura en AWS: describes qué recursos necesitas y CloudFormation se encarga de crearlos, configurarlos y gestionar sus cambios de forma automatizada.

**Categoría**: Infraestructura como código (IaC):

**Clave para el examen**:

- Automatización: reduce la configuración manual de recursos.
- Repetibilidad: facilita crear entornos similares.
- Gestión mediante stacks: agrupa recursos relacionados.
- Control de cambios: permite revisar y aplicar actualizaciones a la infraestructura.

> **RECUERDA**: AWS CloudFormation = **Crear y administrar infraestructura mediante plantillas**.
>
>**Truco de examen**: Si una pregunta menciona aprovisionar recursos automáticamente mediante archivos YAML o JSON, considera AWS CloudFormation.

### 16. AWS CDK

AWS CDK (Cloud Development Kit) es un framework de desarrollo de software de AWS que ***permite definir y aprovisionar infraestructura en la nube utilizando lenguajes de programación***, como TypeScript, Python, Java y C#. En palabras sencillas, en lugar de configurar manualmente cada recurso de AWS desde la consola, puedes escribir código que describa la infraestructura que necesitas, como servidores, bases de datos, redes y permisos. AWS CDK transforma ese código en plantillas de AWS CloudFormation, que se utilizan para crear y administrar los recursos.

**Categoría**: Herramientas para desarrolladores.

**Clave para el examen**:

- Infraestructura como código (IaC): defines recursos mediante código.
- Lenguajes de programación: utilizas variables, funciones, clases y estructuras reutilizables.
- Reutilización: puedes crear componentes de infraestructura que sirvan para distintos proyectos.
- Integración con CloudFormation: genera plantillas que CloudFormation utiliza para aprovisionar los recursos.

> **RECUERDA**: AWS CDK = **Definir infraestructura de AWS utilizando lenguajes de programación**.
>
>**Truco de examen**: Si una pregunta menciona crear infraestructura mediante TypeScript, Python u otros lenguajes compatibles, considera AWS CDK.

**Resumen comparativo para memorizar**

| Servicio           | ¿Para qué sirve?                                              | Palabra clave |
| ------------------ | ------------------------------------------------------------- | ------------- |
| AWS CDK            | Define infraestructura mediante lenguajes de programación.    | Código        |
| AWS CloudFormation | Aprovisiona y administra infraestructura mediante plantillas. | Plantillas    |

>**CDK** permite escribir la infraestructura en lenguajes de programación; **CloudFormation** utiliza plantillas para aprovisionar y administrar los recursos.

# Tabla rápida para el examen

| Servicio o concepto        | Función principal                                    | Recuerda                    |
| -------------------------- | ---------------------------------------------------- | --------------------------- |
| AWS CodeBuild              | Compilar código y ejecutar pruebas                   | Construir                   |
| AWS CodePipeline           | Automatizar el flujo de entrega                      | Orquestar CI/CD             |
| AWS X-Ray                  | Rastrear solicitudes y diagnosticar problemas        | Trazar y depurar            |
| AWS AppSync                | Crear API GraphQL y conectar fuentes de datos        | GraphQL                     |
| AWS Amplify                | Facilitar el desarrollo y despliegue de aplicaciones | Desarrollar y desplegar     |
| Amazon Connect             | Gestionar centros de contacto en la nube             | Atención al cliente         |
| Amazon AppStream 2.0       | Transmitir aplicaciones de escritorio                | Aplicaciones individuales   |
| Amazon WorkSpaces          | Proporcionar escritorios virtuales completos         | Escritorio en la nube       |
| WorkSpaces Secure Browser  | Acceder de forma controlada a aplicaciones web       | Navegador remoto            |
| AWS IoT Core               | Conectar dispositivos IoT con AWS                    | Dispositivos conectados     |
| AWS Well-Architected       | Orientar la evaluación y mejora de arquitecturas     | Mejores arquitecturas       |
| Well-Architected Framework | Organizar buenas prácticas en seis pilares           | Seis pilares                |
| Well-Architected Tool      | Documentar revisiones e identificar riesgos          | Evaluar y registrar mejoras |