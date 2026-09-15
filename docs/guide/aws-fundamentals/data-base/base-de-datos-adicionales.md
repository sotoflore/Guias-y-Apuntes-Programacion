# Servicios de bases de datos adicionales

Además de los servicios que exploró hasta ahora, hay algunos servicios de bases de datos especializados de AWS y sus tecnologías de soporte con los que debe familiarizarse. En esta lección, analizará los casos de uso y los beneficios de Amazon DocumentDB, AWS Backup y Neptune.

## 1. Amazon DocumentDB

![Amazon DocumentDB](/icons/amazon-documentdb.svg)

**Amazon DocumentDB** (compatible con MongoDB) es un servicio completamente administrado diseñado para gestionar datos semiestructurados, es decir, información que no se ajusta a esquemas relacionales rígidos. Amazon DocumentDB es una base de datos compatible con MongoDB, por lo que administra documentos similares a JSON con esquemas dinámicos.

**Amazon DocumentDB** es perfecto para aplicaciones que requieren cambios frecuentes de esquema y datos orientados a documentos. A diferencia de las bases de datos relacionales o no relacionales, puede iterar rápidamente sin depender de esquemas predefinidos. Amazon DocumentDB puede almacenar, consultar e indexar datos JSON sin esfuerzo, a la vez que se beneficia del escalado automático, la copia de seguridad continua y las características de seguridad de nivel empresarial.

### 1. Casos de uso
Algunos ejemplos de casos de uso prácticos de Amazon DocumentDB son los sistemas de administración de contenido, la administración de catálogos e inventarios y los sistemas de personalización y perfiles de usuario.

### 1.2 Beneficios

- **Compatibilidad con MongoDB**. Amazon DocumentDB es totalmente compatible con las cargas de trabajo de MongoDB y admite las API, los controladores y las herramientas de MongoDB. Esta compatibilidad implica que puede usar el código y las habilidades de MongoDB existentes sin modificaciones. También puede migrar las aplicaciones de MongoDB a Amazon DocumentDB con cambios mínimos en el código de la aplicación.

- **Rendimiento y escalabilidad**. Amazon DocumentDB escala automáticamente el almacenamiento hasta 64 TB en incrementos de 10 GB en función de las necesidades de sus aplicaciones. Puede gestionar millones de solicitudes por segundo con un rendimiento uniforme. También ofrece la opción de reducir o escalar verticalmente los recursos de computación según sea necesario.

- **Mayor rendimiento de lectura**. Amazon DocumentDB mejora el rendimiento de lectura de las aplicaciones de gran volumen al crear hasta 15 instancias de réplica que comparten el almacenamiento subyacente.

## 2. AWS Backup

![AWS Backup](/icons/aws-backup.svg)

**AWS Backup** optimiza la protección de datos en varios recursos de AWS e implementaciones en las instalaciones al proporcionar un panel único para supervisar y administrar las copias de seguridad. Elimina la complejidad de administrar varias estrategias de copia de seguridad, ya que admite varios tipos de almacenamiento, incluidos los volúmenes de Amazon Elastic Block Store (Amazon EBS), los sistemas de archivos de Amazon Elastic File System (Amazon EFS) y varias bases de datos.

**AWS Backup** centraliza y automatiza los procesos de protección de datos, lo que mejora la consistencia y reduce la sobrecarga administrativa. Ofrece opciones de programación flexibles, capacidades de cifrado y soporte de copias de seguridad entre regiones para mejorar la recuperación de desastres.

### 2.1 Casos de uso
Algunos ejemplos de casos de uso prácticos de AWS Backup son la recuperación de desastres centralizada, las políticas de copia de seguridad consistentes para satisfacer los requisitos de cumplimiento y la consolidación de varios procesos de copia de seguridad a través de una única interfaz.

### 2.2 Beneficios

- **Administración centralizada de copias de seguridad**. AWS Backup proporciona un panel único para administrar las copias de seguridad en varios servicios y cuentas de AWS. Puede supervisar los trabajos de copia de seguridad, los puntos de restauración y verificar el estado de cumplimiento desde una ubicación central para reducir la complejidad operativa y los posibles errores de configuración.

    Puede crear programas de copia de seguridad automatizados que se alineen con los requisitos empresariales y las necesidades de cumplimiento. Puede configurar políticas de copia de seguridad que protejan automáticamente los nuevos recursos a medida que se crean.


- **Redundancia de las copias de seguridad entre regiones**. AWS Backup permite la replicación automática de las copias de seguridad de los datos en diferentes regiones de AWS con fines de recuperación de desastres. Puede restaurar rápidamente los datos de las regiones secundarias si la región principal sufre una interrupción. La redundancia entre regiones le ayuda a satisfacer los requisitos de cumplimiento y, al mismo tiempo, garantiza la accesibilidad de los datos durante los errores regionales.

- **Mejor conformidad normativa**. AWS Backup mantiene registros e informes de auditoría detallados para demostrar el cumplimiento de los requisitos normativos. Puede usarlo para hacer cumplir las políticas de copia de seguridad en toda su organización y realizar un seguimiento de las actividades de copia de seguridad con fines de protección y cumplimiento.

## 3. Amazon Neptune

![Amazon DocumentDB](/icons/amazon-neptune.svg)

**Neptune** es un servicio de base de datos de gráficos personalizada completamente administrado que administra conjuntos de datos altamente conectados, como los que se usan en las aplicaciones de redes sociales. Se destaca en la comprensión de relaciones complejas que son difíciles de identificar en las bases de datos relacionales tradicionales, como las conexiones de usuarios, las redes de amigos y los patrones de interacción. Neptune puede mantener un alto rendimiento incluso a medida que aumenta la complejidad de los datos y ofrece una alta disponibilidad con copias de seguridad y conmutación por error automáticas.

### 3.1 Casos de uso
Algunos ejemplos de casos de uso prácticos de Amazon Neptune son el mapeo de conexiones de usuarios de redes sociales, los sistemas de detección de fraude y los sistemas de búsqueda y recomendación.

### 3.2 Beneficios

- **Personalizado para relaciones complejas**. Neptune se destaca en el almacenamiento y la consulta de datos altamente conectados mediante modelos gráficos. Es compatible con modelos gráficos de propiedades y de marcos de trabajo descripción de recursos (resource description framework, RDF), lo que lo hace ideal para aplicaciones de mapeo de relaciones y coincidencia de patrones.

- **Alto rendimiento y escalabilidad**. Neptune ofrece un rendimiento uniforme a escala y procesa miles de millones de relaciones en milisegundos. Aumenta automáticamente el almacenamiento hasta 64 TB en función de las necesidades de su aplicación. Su motor personalizado optimiza las consultas de grafos para facilitar un recorrido rápido a través de los puntos de datos conectados a escala.

## 4. Database Migration Service

![AWS Database Migration Service](/icons/migracion-database.svg)

Un servicio que proporciona una migración fluida de bases de datos entre las bases de datos de origen y destino, a la vez que mantiene operativa la base de datos de origen.

AWS **Database Migration Service** (AWS DMS) permite migrar bases de datos relacionales, bases de datos no relacionales y otros tipos de almacenes de datos.

**DMS** ayuda a los clientes a migrar bases de datos existentes a AWS de forma segura y sencilla. Con AWS DMS, mueves datos desde una base de datos de origen hacia una base de datos de destino. Las bases de
datos de origen y destino pueden ser del mismo tipo (migración homogénea) o de tipos diferentes (migración heterogénea).

Durante la migración, la base de datos de origen permanece operativa, lo que reduce el tiempo de
inactividad de las aplicaciones que dependen de ella.

En las migraciones heterogéneas se utiliza un proceso de dos pasos. Como las estructuras de esquema, los
tipos de datos y el código de las bases de datos son diferentes entre el origen y el destino, primero es
necesario convertirlos mediante **AWS Schema Conversion Tool**. Esta herramienta convierte el esquema y el código del origen para que coincidan con la base de datos de destino. Después se utiliza DMS para migrar los datos.

Por ejemplo, supongamos que tienes una base de datos MySQL almacenada localmente, en una instancia de
Amazon EC2 o en Amazon RDS. Considera esa base de datos MySQL como origen. Con AWS DMS podrías
migrar los datos a una base de datos de destino, como Amazon Aurora.

Otros casos de uso de AWS DMS:

- Migraciones de bases de datos para desarrollo y pruebas: permite a los desarrolladores probar
aplicaciones con datos de producción sin afectar a los usuarios de producción. Puedes migrar una copia
de la base de datos de producción a entornos de desarrollo o pruebas una sola vez o continuamente.
- Consolidación de bases de datos: combinar varias bases de datos en una base de datos central.
- Replicación continua: enviar copias continuas de tus datos a otros destinos en lugar de realizar una
migración única. Esto puede utilizarse para recuperación ante desastres o separación geográfica.

---

**Referencias recomendadas**:

- [Amazon DocumentDB](https://aws.amazon.com/es/documentdb/)
- [AWS Backup](https://aws.amazon.com/es/backup/)
- [Amazon Neptune](https://aws.amazon.com/es/neptune/)
- [AWS Database Migration Service](https://aws.amazon.com/es/dms/)