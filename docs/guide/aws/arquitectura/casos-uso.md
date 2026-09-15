# Casos de uso especializados

La arquitectura para casos de uso especializados en AWS se refiere al diseño de soluciones de nube orientadas a necesidades específicas de una organización o industria, combinando diferentes servicios de AWS para resolver problemas concretos de manera segura, escalable, eficiente y rentable.

A diferencia de una arquitectura genérica, estas soluciones se diseñan teniendo en cuenta los requisitos particulares del caso de uso. **Por ejemplo**, una arquitectura para analizar grandes volúmenes de datos será diferente de una diseñada para procesar imágenes, conectar dispositivos IoT, ejecutar cargas de machine learning o proporcionar servicios de recuperación ante desastres.

Una **arquitectura especializada** en AWS combina los servicios adecuados para satisfacer los requisitos específicos de un caso de uso, aplicando las buenas prácticas de AWS Well-Architected.

Una forma sencilla de entender el proceso es:

>**Caso de uso → Requisitos → Servicios AWS → Arquitectura → Seguridad → Optimización**

## 1. Arquitectura de casos de uso especializados

Ofrecer soluciones a los clientes mediante la combinación de servicios especializados de AWS. En los siguientes diagramas de arquitectura, se muestra cómo puede combinar los servicios de AWS de diferentes maneras para resolver problemas empresariales específicos.

### 1.1 Backend web sin servidor supervisado por X-Ray

Se trata de un típico backend web sin servidor, en el que X-Ray supervisa el entorno. Para revisar los componentes de esta solución, seleccione cada uno de los tres marcadores numerados.

![Backend web sin servidor supervisado por X-Ray](/aws/arquitectura/arquitectura-backend-web.png)

1. **Recibir tráfico**. Amazon API Gateway recibe y valida las solicitudes HTTP. 
2. **Desencadenar la función de Lambda**. API Gateway desencadena una función de Lambda que envía solicitudes a Amazon DynamoDB.
3. **Supervisar el tráfico**. X-Ray rastrea las solicitudes a través de API Gateway, Lambda y DynamoDB y las devuelve al cliente. Esto ayuda a los desarrolladores a solucionar cualquier problema.

### 1.2 Sitio web estático sin servidor con formulario de contacto

Esta configuración sin servidor muestra un sitio web estático con un formulario de contacto alojado en Amazon S3. Para revisar los componentes de esta solución, seleccione cada uno de los tres marcadores numerados.

![Sitio web estático sin servidor](/aws/arquitectura/arquitectura-sitio-web-estatico.png)

1. **Aceptar información de clientes**. Los clientes envían sus preguntas mediante un formulario de contacto que se encuentra en un sitio web estático de Amazon S3.
2. **Recibir solicitud**. API Gateway recibe y valida la solicitud del formulario de contacto.
3. **Enviar correo electrónico**. A continuación, API Gateway invoca una función de Lambda que envía un correo electrónico al propietario de la empresa mediante Amazon SES. 

### 1.3 Atención al cliente con la opción de devolución de llamadas

Esta solución de atención al cliente ofrece un canal alternativo y una opción de devolución de llamadas para que los clientes puedan evitar largos tiempos de espera. Para revisar los componentes de esta solución, seleccione cada uno de los tres marcadores numerados.

![Atención al cliente](/aws/arquitectura/arquitectura-atención-cliente.png)

1. **Iniciar contacto**. Un cliente llama o envía un mensaje de texto a un centro de atención al cliente. Las llamadas se realizan en el sistema de respuesta de voz interactiva (interactive voice response, IVR) de Amazon Connect. Los mensajes de texto se envían a Amazon Connect desde CloudFront.
2. **Conectarse con el agente**
Amazon Connect intenta conectar al cliente con un agente en vivo.
3. **Ofrecer opciones**. En el caso de las llamadas con largas colas de espera, los clientes pueden optar por que el agente les devuelva la llamada o pueden cambiar a la comunicación mediante mensajes de texto con una función de Lambda.


---

**Referencias recomendadas:**

- [Centro de arquitectura de AWS](https://aws.amazon.com/es/architecture/?cards-all.sort-by=item.additionalFields.sortDate&cards-all.sort-order=desc&awsf.content-type=*all&awsf.methodology=*all&awsf.tech-category=*all&awsf.industries=*all&awsf.business-category=*all)
- [Blog de arquitectura de AWS](https://aws.amazon.com/es/blogs/architecture/)
