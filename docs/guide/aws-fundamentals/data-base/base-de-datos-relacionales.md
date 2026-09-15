# Bases de Datos Relacionales en AWS

Las **bases de datos relacionales** utilizan un esquema rígido que organiza las colecciones de datos en tablas con **filas** y **columnas**, donde se relacionan las diferentes tablas.

## 1. Bases de datos relacionales

Las **bases de datos relacionales** almacenan los datos de una manera que los relaciona con otros datos y utilizan el **lenguaje de consulta estructurada** (structured query language, SQL) para administrarlos y consultarlos. Este enfoque almacena los datos de una manera fácilmente comprensible, uniforme y escalable que funciona muy bien para las aplicaciones que requieren administración de datos estructurados.

**AWS** ofrece soluciones de bases de datos relacionales completamente administradas que eliminan la carga de la administración de bases de datos y, al mismo tiempo, mantienen un alto nivel de disponibilidad y seguridad. Las bases de datos relacionales de AWS son compatibles con motores de base de datos populares, como MySQL, PostgreSQL y Oracle, lo que facilita la migración de las bases de datos existentes a AWS.

Un ejemplo de base de datos relacional sería un sistema de administración de inventarios para un restaurante. Cada registro de la base de datos incluye datos de un solo elemento, como el nombre del producto, el tamaño, el precio, etc. La siguiente tabla muestra cómo se configura este tipo de datos en una base de datos relacional.

|id|Nombre del producto|Tamaño|Precio|
|--|------------------|------|-----|
|1|Café molido tostado medio|355 cm3|13,95 USD|
|2|Café de origen único en grano entero|355 cm3|21,95 USD|

## 2. Amazon Relational Database Service

![Amazon Relational Database Service](/icons/amazon-rds.svg)

**Amazon RDS** (Relational Database Service) es un servicio de bases de datos relacionales **administrado** que gestiona las tareas rutinarias de las bases de datos, como las **copias de seguridad**, la **aplicación de parches** y el **aprovisionamiento de hardware**. Amazon RDS admite varios tipos de clases de instancias de bases de datos que optimizan la memoria, el rendimiento o la entrada/salida (E/S).

Para mejorar la resiliencia de los datos, **Amazon RDS ofrece implementación multi-AZ** y **copias de seguridad automatizadas**, pero también puede crear copias de seguridad manualmente mediante instantáneas (snapshots) de base de datos. Se trata de copias de seguridad completas de toda la instancia de base de datos, que pueden resultar útiles para la recuperación a un momento dado o para el archivado de datos a largo plazo. Amazon RDS ofrece características de seguridad que incluyen el aislamiento de la red, el cifrado en tránsito y el cifrado en reposo. Puede escalar fácilmente los recursos de la base de datos vertical u horizontalmente según sea necesario.

**Características principales**

- **Gestión completa**. AWS administra hardware, parches, backups
- **Múltiples motores**. MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora
- **Alta disponibilidad**. Multi-AZ con failover automático
- **Escalabilidad**. Escalar instancia y almacenamiento en cualquier momento
- **Copias de seguridad**. Automáticas y manuales
- **Seguridad**. Cifrado, VPC, IAM
- **Monitoreo**. CloudWatch, Performance Insights

### 2.1 Casos de uso

Algunos ejemplos de casos de uso prácticos de Amazon RDS son las aplicaciones web, las cargas de trabajo empresariales y los inventarios de productos para plataformas de comercio electrónico.

### 2.2 Motores de base de datos compatibles

**Amazon RDS** admite diferentes motores de base de datos, optimizados para memoria, rendimiento o
entrada/salida (I/O). Los motores compatibles incluyen:

- Amazon Aurora
- PostgreSQL
- MySQL
- MariaDB
- Oracle Database
- Microsoft SQL Server

Los beneficios de Amazon RDS incluyen aplicación automática de parches, copias de seguridad, redundancia, conmutación por error (failover) y recuperación ante desastres, tareas que normalmente tendrías que administrar por tu cuenta. Esto hace que RDS sea una opción muy atractiva para los clientes de AWS, ya que permite centrarse en los problemas del negocio y no en el mantenimiento de las bases de datos.

### 2.3 Beneficios

- **Optimización de costos**. Amazon RDS elimina los altos costos iniciales que implica comprar y mantener la infraestructura de hardware de bases de datos. Solo debe pagar por los recursos de computación y almacenamiento que consume mediante un modelo flexible de pago por uso. Como servicio administrado, también reduce los gastos operativos al automatizar las tareas administrativas que consumen mucho tiempo, como las copias de seguridad, la aplicación de parches y la supervisión.

- **Implementación multi-AZ**. Amazon RDS mejora la fiabilidad de las bases de datos mediante las implementaciones multi-AZ. Replica automáticamente los datos en una instancia en espera en una zona de disponibilidad diferente. Durante los errores del sistema, el mantenimiento o las interrupciones de la zona, Amazon RDS realiza automáticamente la conmutación por error a la instancia en espera, sin intervención manual. Esto garantiza la continuidad de las operaciones de la base de datos con un tiempo de inactividad mínimo.

- **Optimización del rendimiento**. Amazon RDS mejora el rendimiento de las bases de datos mediante la administración automatizada de las tareas de asignación, supervisión y optimización de recursos. Incluye características como copias de seguridad automatizadas y réplicas de lectura que pueden ayudar a descargar el tráfico de lectura de la instancia principal. La Información de rendimiento de Amazon RDS proporciona supervisión y análisis de la carga de la base de datos en tiempo real para ayudarle a identificar y resolver rápidamente los cuellos de botella en el rendimiento.

- **Controles de seguridad**. Amazon RDS mejora la seguridad de las bases de datos mediante varias capas de protección, incluido el aislamiento de VPC y el cifrado en reposo y en tránsito. Aprovecha las copias de seguridad automatizadas y ofrece implementaciones multi-AZ para brindar resiliencia frente a posibles errores del sistema.

## 3. Amazon Aurora

![Amazon Aurora](/icons/amazon-aurora.svg)

**Aurora** es una base de datos relacional administrada diseñada para ayudar a reducir las operaciones de E/S innecesarias. Es compatible con MySQL y PostgreSQL, proporciona un alto rendimiento y disponibilidad, y se escala automáticamente en función de sus cargas de trabajo. Aurora replica los datos en varias zonas de disponibilidad para mejorar la durabilidad y la tolerancia a errores, y cuenta con copias de seguridad automatizadas, cifrado en reposo y supervisión continua.

>**Amazon Aurora** es la opción de base de datos relacional más administrada de AWS. Está disponible en dos variantes compatibles: MySQL y PostgreSQL. El documento indica que su precio puede ser una décima parte del costo de las bases de datos comerciales de nivel empresarial.

Considera **Amazon Aurora** si tus cargas de trabajo requieren alta disponibilidad. Replica seis copias de tus datos en tres zonas de disponibilidad y realiza copias de seguridad continuas de tus datos en Amazon S3. Por lo tanto, también obtienes recuperación a un momento determinado (point-in-time recovery), que permite recuperar datos de un período específico. También puedes implementar hasta 15 réplicas de lectura para descargar las operaciones de lectura y
escalar el rendimiento.

### 3.1 Casos de uso

Algunos ejemplos de casos de uso prácticos de Aurora son las aplicaciones de juegos, la administración de contenido y medios, y los análisis en tiempo real.

### 3.2 Beneficios

- **Alto rendimiento y disponibilidad**. Aurora ofrece un rendimiento hasta cinco veces mayor que el de MySQL estándar y tres veces el rendimiento de PostgreSQL. Utiliza un sistema de almacenamiento distribuido en varios nodos para proporcionar un alto rendimiento y disponibilidad.

- **Administración automatizada del almacenamiento y las copias de seguridad**. Aurora aumenta automáticamente el almacenamiento de 10 GB a 128 TB en función del uso real de los datos, lo que elimina las conjeturas en la planificación de la capacidad. También realiza copias de seguridad continuas de la base de datos en Amazon Simple Storage Service (Amazon S3) para proporcionar la recuperación a un momento dado.

- **Replicación avanzada y tolerancia a errores**. Aurora replica los datos en tres zonas de disponibilidad con seis copias de los datos y proporciona una disponibilidad del 99,99 %. Detecta automáticamente los errores en las bases de datos y redirige el tráfico a réplicas en buen estado sin perder datos en el proceso.

## 4. Infografía de Estudio

![Bases de Datos Relacionales en AWS](/aws/data-base/bases-de-datos-relacionales.png)

---

**Referencias recomendadas**:

- [Amazon RDS and Aurora Documentation](https://docs.aws.amazon.com/rds/)
- [Seguridad de Amazon RDS](https://aws.amazon.com/es/rds/features/security/)
- [Amazon Aurora](https://aws.amazon.com/es/rds/aurora/)
- [¿Qué es una base de datos relacional?](https://aws.amazon.com/es/rds/what-is-a-relational-database/)