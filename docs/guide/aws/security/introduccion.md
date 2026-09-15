# Introducción a la seguridad en AWS

Crear y mantener un entorno seguro en la nube es una gran responsabilidad. AWS comparte esa responsabilidad con sus clientes. 

La protección de su cuenta de AWS comienza con una sólida comprensión de dos conceptos fundamentales: la **autenticación** y la **autorización**.

## 1. Conceptos clave

La **autenticación** y la **autorización** son dos mecanismos que desempeñan un papel importante a la hora de asegurar la privacidad de los datos y la protección del sistema. Repasemos estos conceptos y analicemos un poco más cómo funciona la seguridad dentro del modelo de responsabilidad compartida de AWS.

### 1.1 Autenticación y autorización

La **autenticación** es el proceso con el que se verifica la identidad de un usuario o entidad por medio de credenciales, tales como como una combinación de nombre de usuario y contraseña.

- **Caso de uso**: un empleado que inicia sesión en un portal de empleados.

La **autorización** otorga a los usuarios ciertos derechos y permisos de acceso que determinan qué acciones pueden llevar a cabo en un sistema o una aplicación.

- **Caso de uso**: un empleado solo puede acceder a sus propios registros dentro del portal de empleados.

![Autenticación y autorización](/aws/security-img/seguridad-intro-autenticacion-autorizacion.png)

### 1.2 Modelo de responsabilidad compartida de AWS

La seguridad en la nube es una responsabilidad que AWS comparte con los clientes.

#### 1.2.1 Clientes: seguridad en la nube

Al usar los servicios de AWS, los clientes mantienen el control total de su contenido. Como resultado, son responsables de proteger todo lo que crean y administran en la nube de AWS. Esto incluye lo siguiente:

- Administrar la seguridad de los datos, los sistemas y las aplicaciones.
- Decidir qué datos y cargas de trabajo almacenar o ejecutar en AWS.
- Determinar qué servicios de AWS utilizar.
- Controlar quién tiene acceso a los entornos y recursos.

#### 1.2.2 AWS: seguridad de la nube

AWS es responsable de la seguridad de la nube. AWS opera, administra y controla los componentes en cada una de las capas de la infraestructura. Como parte de esto, debe garantizar lo siguiente:

- el software básico que impulsa los servicios de AWS
- la capa de virtualización
- el hardware y la infraestructura global que sirven como soporte de los centros de datos desde los que operan los servicios. Esto incluye la protección de las regiones, las zonas de disponibilidad y las ubicaciones periféricas de AWS

> **AWS** protege la **infraestructura global que ejecuta sus servicios**: regiones, zonas de disponibilidad y ubicaciones de borde. Esto incluye la seguridad física de los centros de datos, hardware y software, infraestructura de red e infraestructura de virtualización. AWS también proporciona informes de auditores externos que verifican el cumplimiento de distintos estándares y regulaciones.

![Modelo de responsabilidad compartida de AWS](/aws/security-img/seguridad-intro-modelo-responsabilidad-compartida.png)

### 1.3 Controles de seguridad de AWS

AWS ofrece varios mecanismos de seguridad que protegen sus recursos en la nube. Estos controles pueden ser de ayuda para hacer lo siguiente:

- Prevenir los incidentes de seguridad mediante una administración adecuada de permisos y accesos.
- Proteger las redes, las aplicaciones y los datos.
- Detectar y responder a los incidentes de seguridad a medida que se producen.

---

**Referencias recomendadas**:

- [AWS Security Documentation](https://docs.aws.amazon.com/security/)
