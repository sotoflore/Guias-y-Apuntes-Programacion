# Almacenamiento de caché en memoria

Los servicios de **almacenamiento de caché** en memoria están optimizados para proporcionar una latencia inferior a milisegundos para las operaciones de lectura y escritura.

## 1. Cachés en memoria

Una **caché en memoria** es una capa de almacenamiento de alta velocidad que **almacena temporalmente los datos a los que se accede con frecuencia** en la memoria principal (RAM) de un equipo. La recuperación de datos de la RAM proporciona velocidades de procesamiento y recuperación extremadamente rápidas, a menudo cientos o miles de veces más rápidas que las de los sistemas de almacenamiento tradicionales basados en disco.

Cuando las aplicaciones necesitan información específica, primero comprueban la memoria caché antes de solicitarla al origen de datos inicial. Esto reduce la carga en las bases de datos primarias y acelera los tiempos de respuesta para los usuarios finales. Las cachés en memoria son ideales para almacenar datos de sesión, respuestas de API, resultados de consultas a bases de datos y otra información que las aplicaciones requieren repetidamente.

## 2. Amazon ElastiCache

![Amazon ElastiCache](/icons/amazon-elasticache.svg)

**ElastiCache** es un servicio de almacenamiento de caché en memoria completamente administrado que se creó para ayudar a reducir la complejidad de la administración de los sistemas de almacenamiento de caché en memoria. Esto significa que puede seguir usando las mismas herramientas y configuraciones de **Redis**, **Valkey** o **Memcached** para escalar sus cargas de trabajo. Detecta y reemplaza automáticamente los nodos con errores, lo que lo hace ideal para las aplicaciones que necesitan un alto rendimiento constante.

**Características principales**

- **Rendimiento**. Latencia de microsegundos
- **Escalabilidad**. Escalar horizontal y verticalmente
- **Disponibilidad**. Multi-AZ con failover automático
- **Seguridad**. Cifrado en reposo y en tránsito
- **Gestión completa**.	Sin infraestructura que administrar
- **Compatible**. API compatible con Redis y Memcached

### 2.1 Casos de uso

Algunos ejemplos de casos de uso prácticos de ElastiCache son la administración de datos de sesión, la mejora de las consultas de bases de datos y las tablas de clasificación de juegos, cola de mensajes.

### 2.2 Beneficios

- **Alto rendimiento para instancias de Redis, Valkey o Memcached**. ElastiCache optimiza la implementación y el mantenimiento de los entornos de almacenamiento de caché en memoria, ya que ofrece una alta disponibilidad para Redis, Valkey y Memcached al gestionar automáticamente el aprovisionamiento de hardware, los parches de software y la supervisión. ElastiCache ofrece una escalabilidad sin complicaciones para que pueda agregar o eliminar nodos a medida que cambie la demanda.

- **Alta disponibilidad**. ElastiCache proporciona alta disponibilidad mediante la supervisión constante de los nodos principales para detectar posibles errores. Cuando se detectan problemas, mantiene la disponibilidad de las aplicaciones y promueve que un nodo de réplica se convierta en el nuevo nodo principal sin intervención manual. Por lo general, todo el proceso de recuperación finaliza en cuestión de minutos, lo que minimiza el tiempo de inactividad y preserva las operaciones durante las interrupciones de la infraestructura.

- **Replicación en varias zonas de disponibilidad**. ElastiCache permite la replicación automática en varias zonas de disponibilidad para brindar protección frente a errores en la infraestructura. Puede configurar los nodos principales y de réplica en diferentes zonas de disponibilidad según sus requisitos de durabilidad. Esto ayuda a garantizar que los datos permanezcan accesibles incluso si una zona sufre una interrupción.

- **Cifrado de datos**. ElastiCache admite mecanismos de cifrado de datos para proteger la información confidencial durante todo su ciclo de vida. El cifrado en reposo protege los datos mientras están almacenados en el almacenamiento en disco y en las copias de seguridad automatizadas. El cifrado en tránsito protege los datos que se trasladan entre los clientes y los nodos de caché mediante el uso de la seguridad de la capa de transporte (transport layer security, TLS) para las conexiones cifradas.

---

**Referencias recomendadas**:

- [Amazon ElastiCache](https://aws.amazon.com/es/elasticache/)
- [Amazon ElastiCache Documentation](https://docs.aws.amazon.com/elasticache/)
- [¿Qué es un servicio de almacenamiento de caché en memoria?](https://aws.amazon.com/es/caching/aws-caching/)