# Introducción a las Bases de Datos en AWS

**AWS** ofrece una amplia gama de servicios de bases de datos para satisfacer diversas necesidades de almacenamiento y administración de datos. Estos servicios están diseñados para ser escalables, fiables y fáciles de usar para empresas de todos los tamaños. Los servicios de bases de datos de AWS incluyen opciones para **bases de datos relacionales**, **bases de datos no relacionales**, **cachés en memoria** y servicios diseñados específicamente para casos de uso, como la **administración de documentos**.

## Tipos de Bases de Datos en AWS

- **Bases de Datos Relacionales (RDS)**: AWS RDS permite configurar, operar y escalar bases de datos relacionales en la nube. Soporta motores como MySQL, PostgreSQL, MariaDB, Oracle y SQL Server.

- **Bases de Datos No Relacionales (DynamoDB)**: DynamoDB es un servicio de base de datos NoSQL totalmente administrado que proporciona rendimiento rápido y predecible con escalabilidad automática.

- **Cachés en Memoria (ElastiCache)**: ElastiCache es un servicio web que facilita la implementación, operación y escalado de cachés en memoria en la nube. Soporta Redis y Memcached.

- **Bases de Datos de Documentos (DocumentDB)**: Amazon DocumentDB es un servicio de base de datos de documentos compatible con MongoDB, diseñado para almacenar, consultar e indexar datos JSON.

- **Bases de Datos en Grafos (Neptune)**: Amazon Neptune es un servicio de base de datos de grafos rápido, confiable y totalmente administrado que facilita la creación y ejecución de aplicaciones que trabajan con conjuntos de datos altamente conectados.

- **Bases de Datos en Tiempo Real (Timestream)**: Amazon Timestream es un servicio de base de datos en la nube diseñado para almacenar y analizar datos de series temporales, como métricas de IoT y aplicaciones operativas.

- **Bases de Datos en Memoria (MemoryDB)**: Amazon MemoryDB es un servicio de base de datos en memoria compatible con Redis, diseñado para aplicaciones que requieren baja latencia y alta disponibilidad.

- **Bases de Datos en la Nube (Aurora)**: Amazon Aurora es un servicio de base de datos relacional compatible con MySQL y PostgreSQL, que combina la velocidad y disponibilidad de bases de datos comerciales con la simplicidad y rentabilidad de las bases de datos de código abierto.

- **Bases de Datos Analíticas (Redshift)**: Amazon Redshift es un servicio de almacenamiento de datos en la nube que permite ejecutar consultas analíticas complejas en grandes volúmenes de datos estructurados y semiestructurados.

## 2. Modelo de Responsabilidad Compartida

El modelo de responsabilidad compartida de AWS agrupa los servicios en tres categorías según la propiedad de las tareas administrativas. Estas categorías comprenden servicios completamente administrados, administrados y no administrados. Los servicios de AWS que explorará en este módulo son, en general, completamente administrados. También se incluyen algunos servicios administrados, pero no hay servicios no administrados.

Para obtener más información sobre cómo se relacionan estas categorías con los servicios de bases de datos, lee las tres categorías siguientes.

### 2.1. Servicios Completamente Administrados
En el caso de los servicios completamente administrados, AWS administra casi todas las tareas operativas, como el aprovisionamiento, el escalado, la aplicación de parches, las copias de seguridad, la optimización del rendimiento y los parches de seguridad. AWS también proporciona supervisión y métricas integradas. Los servicios de bases de datos de AWS completamente administrados solo requieren que los clientes se hagan cargo del diseño de las estructuras de datos y la administración de los controles de acceso.

![Servicios Completamente Administrados](/aws/data-base/responsabilidad-compartida-servicios-completamente-administrados.png)

### 2.2. Servicios Administrados
Con los servicios de bases de datos administrados, AWS administra las tareas rutinarias, como las copias de seguridad, la aplicación de parches y el aprovisionamiento de hardware, mientras que los clientes son responsables de la configuración de las bases de datos, la optimización de las consultas y las decisiones de ajuste del rendimiento.

![Servicios Administrados](/aws/data-base/responsabilidad-compartida-servicios-administrados.png)

### 2.3. Servicios No Administrados
Con las bases de datos no administradas, los clientes son responsables de la instalación, la configuración, la aplicación de parches, las tareas de mantenimiento, la seguridad de las bases de datos, las copias de seguridad, la configuración de alta disponibilidad y la optimización del rendimiento. Un ejemplo de base de datos no administrada en AWS sería un sistema de administración de bases de datos, como MySQL, instalado directamente en una instancia de Amazon Elastic Compute Cloud (Amazon EC2).

![Servicios no Administrados](/aws/data-base/responsabilidad-compartida-servicios-no-administrados.png)

---

**Referencias recomendadas**:

- [Modelo de responsabilidad compartida de AWS](https://aws.amazon.com/es/compliance/shared-responsibility-model/)
