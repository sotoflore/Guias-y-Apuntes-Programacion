# Detección y Respuesta a Incidentes de Seguridad

La **detección y respuesta a incidentes de seguridad** en AWS consiste en **identificar rápidamente actividades sospechosas o amenazas dentro de una infraestructura** en la nube y tomar las medidas necesarias para contener, investigar y resolver el incidente. En un entorno cloud, no basta con prevenir los ataques; también es fundamental disponer de mecanismos que permitan detectar cuándo ocurre una actividad anómala y responder de manera rápida y organizada.

AWS proporciona diferentes servicios que ayudan a construir esta capacidad de seguridad. **Por ejemplo**, **AWS CloudTrail** registra las acciones realizadas mediante la API de AWS, **Amazon GuardDuty** analiza continuamente el entorno para detectar posibles amenazas y comportamientos maliciosos, mientras que AWS Security Hub permite centralizar y priorizar los hallazgos de seguridad provenientes de diferentes servicios.

El proceso normalmente comienza con la **detección de una actividad sospechosa**. Posteriormente, se realiza una **investigación** para determinar qué ocurrió, qué recursos fueron afectados y cuál es el alcance del incidente. Después se aplican **acciones de respuesta y contención**, como aislar recursos comprometidos, revocar credenciales o bloquear determinadas actividades. Finalmente, se **busca recuperar los servicios, analizar las causas y aplicar medidas preventivas** para evitar que el incidente vuelva a ocurrir.

En términos simples:

>**Prevenir → Detectar → Investigar → Responder → Recuperar → Mejorar**

El objetivo es reducir el **tiempo necesario para detectar y responder** a una amenaza, limitar su impacto y mantener la seguridad y disponibilidad de los recursos y datos de AWS.

## 1. Servicios de detección y respuesta

La prevención y la protección contra amenazas de seguridad son dos métodos que se utilizan para resguardar los recursos de AWS. También debería prepararse para detectar los incidentes de seguridad y responder antes los que puedan ocurrir. AWS ofrece una variedad de servicios que puede emplear para detectar los incidentes de seguridad y responder ante ellos.

Repasemos cuáles son estos servicios.

### 1.1 Amazon Inspector

![Amazon Inspector](/icons/amazon-inspector.svg)

**Amazon Inspector** ayuda a mejorar la seguridad y el cumplimiento de las aplicaciones mediante la ejecución de evaluaciones de seguridad automatizadas para las instancias de Amazon EC2, los contenedores y las funciones de Lambda. Comprueba si hay vulnerabilidades de seguridad y desviaciones de las prácticas recomendadas de seguridad en las aplicaciones, como el acceso abierto a instancias de EC2 y las instalaciones de versiones de software vulnerables.

La consola de **Amazon Inspector** le permite ver las evaluaciones finalizadas. Estas incluyen una lista de hallazgos de seguridad ordenados por nivel de severidad. Cada problema de seguridad que se identifica incluye una descripción detallada y una recomendación acerca de cómo solucionarlo. También puede recuperar hallazgos a través de una API.

### 1.2 Amazon GuardDuty

![Amazon GuardDuty](/icons/amazon-guardDuty.svg)

**Amazon GuardDuty** proporciona detección inteligente de amenazas en toda la infraestructura y los recursos. **GuardDuty** identifica las amenazas por medio de la supervisión continua de los flujos de metadatos de su cuenta y de la actividad de red en su entorno. Utiliza direcciones IP maliciosas conocidas, detección de anomalías y machine learning para identificar amenazas con más precisión.

Puede revisar los hallazgos detallados acerca de todas las amenazas que GuardDuty detecta desde la Consola de administración de AWS. Esos hallazgos incluyen los pasos recomendados para resolver la situación. También puede configurar las funciones de AWS Lambda para que lleven a cabo los pasos de corrección de forma automática.

### 1.3 Amazon Detective

![Amazon Detective](/icons/amazon-detective.svg)

Una vez detectada una amenaza, puede utilizar **Amazon Detective** para investigar más a fondo la causa raíz. **Detective** le ayuda a analizar las amenazas mediante visualizaciones interactivas contenidas en una vista unificada de la Consola de administración de AWS. Estas visualizaciones incluyen las interacciones entre los recursos y los usuarios a lo largo de un cronograma que se puede configurar, junto con los pasos recomendados para la corrección.

### 1.4 AWS Security Hub

![AWS Security Hub](/icons/amazon-security-hub.svg)

**Security Hub** reúne varios servicios de seguridad en un solo lugar y formato. Con este servicio, puede ver rápidamente su estado de seguridad y cumplimiento en una vista integrada. **Security Hub** agrega los hallazgos de seguridad de AWS y los servicios de los socios de forma automática y los organiza en grupos procesables y útiles, lo que se denomina información. Puede acelerar el tiempo de resolución (TTR) con la ayuda de la corrección automatizada.

---

**Referencias recomendadas**:

- [Amazon Inspector](https://aws.amazon.com/inspector/)
- [Amazon GuardDuty](https://aws.amazon.com/guardduty/)
- [Amazon Detective](https://aws.amazon.com/detective/)
- [AWS Security Hub](https://aws.amazon.com/security-hub/)