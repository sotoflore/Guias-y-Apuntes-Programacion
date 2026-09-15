# AWS Storage Gateway

![AWS Storage Gateway](/icons/aws-storage-gateway.svg)

**AWS Storage Gateway** cierra la brecha entre la infraestructura tradicional y la nube. Es un servicio de almacenamiento en la nube híbrida que le brinda acceso en las instalaciones al almacenamiento en la nube casi ilimitado. En esta lección, aprenderá a implementar un entorno de almacenamiento híbrido con Storage Gateway.

## 1. Qué es AWS Storage Gateway

**Storage Gateway** es un servicio de **almacenamiento en la nube híbrida** que permite integrar sin problemas los entornos en las instalaciones con el almacenamiento en la nube de AWS. Con él, puede ampliar su **almacenamiento local a la nube** y, al mismo tiempo, mantener un acceso de baja latencia a los datos de uso frecuente.

Puede usar **Storage Gateway** para optimizar la administración del almacenamiento y reducir los costos en casos de uso prácticos de almacenamiento en la nube híbrida. **Por ejemplo**, puede trasladar copias de seguridad a la nube, usar los archivos compartidos en las instalaciones respaldados por el almacenamiento en la nube y proporcionar acceso de baja latencia a los datos en AWS para las aplicaciones en las instalaciones.

## 2. Beneficios

- **Integración perfecta**. Storage Gateway permite una conectividad fluida entre las aplicaciones en las instalaciones y el almacenamiento en la nube de AWS, ya que preserva los flujos de trabajo existentes y minimiza las interrupciones.

- **Administración de datos mejorada**. Storage Gateway proporciona una administración centralizada de los entornos de almacenamiento híbridos, lo que mejora la accesibilidad, la seguridad y el cumplimiento.

- **Almacenamiento en caché local**. Storage Gateway conserva de forma local los datos de acceso poco frecuente para lograr un acceso rápido y, al mismo tiempo, administra los datos menos utilizados en la nube.

- **Optimización de costos**. Storage Gateway reduce los costos de almacenamiento en las instalaciones, ya que utiliza el almacenamiento en la nube para archivar datos, realizar copias de seguridad y llevar a cabo la recuperación de desastres.

## 3. Tipos de Puertas de enlace

**Storage Gateway** ofrece tres tipos distintos de puertas de enlace (Gateway Types) para cubrir las diferentes necesidades de almacenamiento híbrido. Cada tipo de puerta de enlace está diseñado para abordar casos de uso y requisitos de cargas de trabajo específicos.

### 3.1 Amazon S3 File Gateway

![Amazon S3 File Gateway](/icons/aws-storage-gateway-file-gateway.png)

**Amazon S3 File Gateway** (Puerta de enlace de archivos) une su entorno local con Amazon S3. Brinda a las aplicaciones en las instalaciones acceso a un almacenamiento en la nube casi ilimitado a través de protocolos de archivos conocidos. S3 File Gateway permite almacenar y recuperar objetos en la nube mediante operaciones de archivos conocidas.

Cuando implementa S3 File Gateway, aparece en los sistemas locales como un servidor de archivos estándar. Los archivos escritos en este servidor se cargan de forma automática a Amazon S3 y, al mismo tiempo, se mantiene el acceso local a los datos de uso reciente mediante el almacenamiento en caché inteligente. Esto significa que sus aplicaciones pueden continuar trabajando con los archivos como de costumbre mientras los datos reales se almacenan de forma segura en la nube de AWS.

### 3.2 Volume Gateway

![Volume Gateway](/icons/aws-storage-gateway-volume-gateway.png)

Con **Volume Gateway**, puede crear volúmenes de almacenamiento virtual y, al mismo tiempo, mantener el acceso local a sus datos. En esencia, funciona como un puente entre la infraestructura en las instalaciones y el almacenamiento en la nube de AWS, ya que presenta los datos en la nube como volúmenes iSCSI que las aplicaciones existentes pueden montar.

**Volume Gateway** funciona en dos configuraciones principales:

- El **modo de volumen en caché** almacena los datos principales en la nube, mientras que los datos de acceso frecuente se almacenan en caché de forma local para lograr un acceso de baja latencia.

- El **modo de volumen almacenado** conserva de forma local el conjunto de datos completo y, al mismo tiempo, lo respalda de forma asincrónica en la nube como instantáneas de EBS.

### 3.3 Tape Gateway

![Tape Gateway](/icons/aws-storage-gateway-tape-gateway.png)

**Tape Gateway** permite reemplazar la infraestructura física de cintas por capacidades de cinta virtual y, al mismo tiempo, aprovechar la durabilidad y la escalabilidad del almacenamiento en la nube de AWS. Tape Gateway brinda una interfaz que funciona con el software existente de copias de seguridad en cinta, por lo que la transición de las cintas físicas al almacenamiento en la nube es fluida.

Cuando implementa Tape Gateway, se presenta ante las aplicaciones de copia de seguridad como hardware de cinta estándar. Su software de copias de seguridad escribe los datos en estas cintas virtuales del mismo modo que lo haría en las cintas físicas y se almacenan en Amazon S3. También puede configurar Tape Gateway para que transfiera de forma automática los datos de acceso menos frecuente a una clase de almacenamiento más rentable para una retención a largo plazo.

## 4. Infografía de estudio

![AWS Storage Gateway Infografía](/aws/almacenamiento/aws-storage-gateway-intro.png)

---

**Referencias recomendadas**:

- [AWS Storage Gateway](https://aws.amazon.com/es/storagegateway/)
- [AWS Storage Gateway Documentation](https://docs.aws.amazon.com/storagegateway/)
- [Amazon S3 File Gateway](https://aws.amazon.com/es/storagegateway/file/s3/)
- [Tape Gateway](https://aws.amazon.com/es/storagegateway/vtl/)
- [Volume Gateway](https://aws.amazon.com/es/storagegateway/volume/)