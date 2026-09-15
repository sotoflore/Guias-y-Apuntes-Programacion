# Protección de los Datos

La **protección de los datos** en AWS consiste en implementar mecanismos que permitan mantener la confidencialidad, integridad y disponibilidad de la información almacenada y procesada en la nube. Los datos son uno de los activos más importantes de cualquier organización, por lo que AWS proporciona diferentes servicios y controles para protegerlos durante todo su ciclo de vida.

La protección comienza con el **cifrado de los datos**, tanto cuando están almacenados (data at rest) como cuando se transmiten entre sistemas (data in transit). Servicios como **AWS Key Management Service** (AWS KMS) permiten crear y administrar claves criptográficas utilizadas para proteger información en diferentes servicios de AWS.

En términos simples:

>**Datos → Cifrado → Control de acceso → Backup/Recuperación → Monitoreo**

## 1. Cifrado de datos

Una gran parte de lo que se hace en AWS se basa en datos. Mantener estos datos seguros es importante para garantizar que las aplicaciones funcionen sin problemas y mantener la confianza de los clientes.

El cifrado es un componente clave de la protección de datos. Repasemos cómo funciona el cifrado de datos.

### 1.1 Conceptos básicos del cifrado

El **cifrado de datos** funciona como un mecanismo con cerradura y llave. Si se tiene la clave correcta, se puede acceder a los datos cifrados. De lo contrario, no se puede acceder a ellos. **Por ejemplo**, supongamos que protege el perfil de un cliente. Para esto, se utiliza una clave de cifrado a fin de convertir la información del perfil en un conjunto aleatorio de caracteres. Para acceder a la información del cliente, se utiliza una clave de descifrado, tal como su nombre, solo cuando la aplicación la necesita.

![cifrado de datos](/aws/security-img/proteccion-datos-cifrado.png)

### 1.2 Tipos de cifrado de datos

El cifrado de datos se presenta de estas dos formas: 

- **Cifrado de datos en reposo**: los datos están inactivos y no se mueven, como cuando se encuentran almacenados en una base de datos.

- **Cifrado de datos en tránsito**: los datos se mueven de una ubicación a otra, como cuando se envían desde una base de datos a una aplicación. Los certificados SSL/TLS se usan para establecer conexiones de red cifradas de un sistema a otro.

![Tipos de cifrado de datos](/aws/security-img/proteccion-datos-tipos-cifrado.png)

## 2. Protección de datos de AWS

AWS cuenta con una variedad de métodos para proteger datos. Entre ellos se incluye la protección de datos integrada para opciones de almacenamiento y los servicios diseñados específicamente para mejorar la protección de datos.

Repasemos algunos de estos métodos de protección de datos. 

### 2.1 Protección de datos integrada de AWS

Las opciones de almacenamiento de AWS que cuentan con protección de datos integrada: 

#### 2.1.1 Amazon S3

Todos los **buckets** de S3 nuevos tienen cifrado configurado y todos los **objetos** cargados se cifran en reposo de forma predeterminada.

![Amazon S3](/icons/amazon-simple-storage.svg)

#### 2.1.2 Amazon EBS

![Amazon EBS](/icons/elastic-block-store.svg)

Los **volúmenes** y las **instantáneas** de Amazon EBS se pueden cifrar en reposo, incluidos los volúmenes de arranque y de datos de una instancia de Amazon EC2.

#### 2.1.3 Amazon DynamoDB

![Amazon DynamoDB](/icons/amazon-dynamodb.svg)

El **cifrado en reposo** del lado del servidor está habilitado en todos los **datos** de las tablas de DynamoDB por medio de las claves de cifrado que están almacenadas en AWS Key Management Service (AWS KMS).

### 2.2 Servicios de protección de datos de AWS

AWS también ofrece los siguientes servicios que ayudan a proteger sus datos.

#### 2.2.1 AWS Key Management Service (AWS KMS)

![AWS Key Management Service](/icons/amazon-key-management-service.svg)

Puede utilizar **AWS KMS** para crear y administrar claves criptográficas. Luego, estas claves se pueden utilizar para cifrar y descifrar sus datos. También puede controlar el uso de claves en una amplia gama de servicios y en sus aplicaciones. **Por ejemplo**, puede especificar qué usuarios y roles de IAM tienen permitido administrar las claves. Sus claves nunca salen de AWS KMS, y puede deshabilitarlas temporalmente para que no se puedan utilizar.

>Una clave criptográfica es una cadena aleatoria de dígitos que se usa para bloquear (cifrar) y desbloquear (descifrar) datos.

#### 2.2.2 Amazon Macie

![Amazon Macie](/icons/amazon-macie.svg)

Con **Amazon Macie**, puede supervisar su información confidencial en reposo y asegurarse de que esté segura. Macie utiliza el **machine learning** (ML) y la **automatización** para descubrir información confidencial almacenada en Amazon S3. Puede utilizar Macie para evaluar su posición de seguridad, lo que resulta especialmente útil a la hora de satisfacer los requisitos de cumplimiento.

#### 2.2.3 AWS Certificate Manager (ACM)

![AWS Certificate Manager](/icons/amazon-certificate-manager.svg)

**ACM** centraliza la administración de los **certificados SSL/TLS** que proporcionan el cifrado de datos en tránsito. Se puede utilizar para proteger varios servicios de AWS y sus recursos conectados en las instalaciones.

>Los certificados SSL/TLS se usan para establecer conexiones de red cifradas de un sistema a otro.

---

**Referencias recomendadas**:

- [AWS Key Management Service (AWS KMS)](https://aws.amazon.com/kms/)
- [Amazon Macie](https://aws.amazon.com/macie/)
- [AWS Certificate Manager (ACM)](https://aws.amazon.com/certificate-manager/)