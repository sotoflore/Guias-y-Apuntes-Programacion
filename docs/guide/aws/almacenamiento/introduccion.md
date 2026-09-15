# Introducción al Almacenamiento en AWS

**AWS** ofrece muchas soluciones para almacenar y administrar los datos, además de acceder a ellos y realizar copias de seguridad, todo en la nube. Estos sistemas de almacenamiento virtual eliminan la necesidad de contar con hardware físico en los centros de datos y, a su vez, ofrecen la flexibilidad de escalar a medida que las necesidades cambian. **AWS** ofrece tres tipos distintos de almacenamiento en la nube para cubrir diversos requisitos y necesidades de aplicaciones: almacenamiento en bloque, almacenamiento de objetos y almacenamiento de archivos.

## 1. ¿Por qué existen diferentes tipos de almacenamiento?

No todos los datos se utilizan de la misma manera. Imagina una aplicación web que permite a los usuarios subir fotografías. La aplicación podría necesitar:

- **Guardar las fotografías** → almacenamiento de objetos.
- **Guardar datos de usuarios** y metadatos → una base de datos.
- **Ejecutar una aplicación** sobre un servidor → almacenamiento de bloques.
- **Compartir archivos entre múltiples servidores** → almacenamiento de archivos.
- **Conservar fotografías antiguas durante años** → almacenamiento de archivo.

Por esta razón, **AWS** proporciona diferentes modelos de almacenamiento. Los tres modelos fundamentales que debes reconocer son:

| Modelo      | Concepto                                       | Ejemplo AWS |
| ----------- | ---------------------------------------------- | ----------- |
| **Objeto**  | Guarda datos como objetos dentro de buckets    | Amazon S3   |
| **Bloque**  | Proporciona volúmenes de disco para servidores | Amazon EBS  |
| **Archivo** | Proporciona un sistema de archivos compartido  | Amazon EFS  |

Una forma sencilla de recordarlo:

>**S3** = objetos
>
>**EBS** = discos (bloques)
>
>**EFS** = archivos compartidos

## 2. Tipos de Almacenamiento

### 2.1 Almacenamiento en bloque

El **almacenamiento en bloque** brinda volúmenes de almacenamiento persistentes y de baja latencia a nivel de **bloques** que se conectan a instancias de **EC2**, como **discos duros físicos**. Los volúmenes de almacenamiento en bloque se pueden cifrar, respaldar mediante instantáneas (snapshots) y modificar mientras están en uso sin interrumpir la instancia. AWS ofrece dos servicios principales de almacenamiento en bloque:

- **Almacén de instancias Amazon EC2 (Instance Store)**. Un almacenamiento en bloque no administrado, no persistente y de alto rendimiento que se conecta de forma directa a las instancias de EC2 para datos temporales.

- **Amazon Elastic Block Store (EBS)**. Un servicio administrado que brinda volúmenes de almacenamiento en bloque persistentes para instancias de EC2 y ofrece varios tipos para cargas de trabajo diferentes.

### 2.2 Almacenamiento de objetos

El **almacenamiento de objetos** es una arquitectura de almacenamiento de datos que administra los datos como **objetos** en un espacio de direcciones plano. Ofrece escalabilidad ilimitada para que almacene grandes cantidades de datos no estructurados sin preocuparse por las restricciones de capacidad. El almacenamiento de objetos proporciona capacidades de metadatos mejoradas de modo que la administración, la búsqueda y el análisis de datos sean más eficientes en conjuntos de datos masivos.

Este es el servicio principal de almacenamiento de objetos de AWS:

- **Amazon Simple Storage Service (S3)**. Un servicio de almacenamiento de objetos escalable y completamente administrado para almacenar y recuperar cualquier cantidad de datos desde cualquier lugar.

### 2.3 Almacenamiento de archivos

Los servicios de **almacenamiento de archivos** de AWS brindan sistemas de **archivos compartidos** a los que se puede acceder a través de redes, de modo que varios usuarios y aplicaciones pueden acceder a los mismos datos de forma simultánea. Ofrecen escalabilidad y flexibilidad para que amplíe la capacidad de almacenamiento a medida que aumentan las necesidades sin tener que administrar la infraestructura física. AWS ofrece dos servicios principales de almacenamiento de archivos:

- **Amazon Elastic File System (EFS)**. Un sistema de archivos NFS (Network File System, Sistema de Archivos de Red) escalable y completamente administrado para utilizar con los servicios en la nube de AWS y los recursos en las instalaciones.

- **Amazon FSx**. Un servicio de almacenamiento de archivos completamente administrado para sistemas de archivos populares, como Windows, Lustre y NetApp ONTAP.


## 3. Servicios de almacenamiento adicionales

Estos servicios no encajan del todo en las categorías que definimos hasta ahora, pero son ofertas importantes de almacenamiento de AWS que debe conocer.

- **AWS Storage Gateway (Puerta de enlace de almacenamiento)**. Un servicio de almacenamiento en la nube híbrida completamente administrado que proporciona acceso en las instalaciones a almacenamiento en la nube casi ilimitado.

- **Recuperación elástica ante desastres de AWS**. Un servicio completamente administrado que optimiza la recuperación de sus servidores físicos, virtuales y basados en la nube en AWS.

## 4. Responsabilidad compartida de AWS

El modelo de responsabilidad compartida de AWS agrupa los servicios en tres categorías según la propiedad de las tareas administrativas. Estas categorías comprenden servicios completamente administrados, administrados y no administrados.

Para obtener más información sobre cómo se relacionan estas categorías con los servicios de almacenamiento, lee las tres categorías siguientes.

### 4.1 Servicios completamente administrados

En el caso de los servicios de **almacenamiento completamente administrados**, AWS es responsable de todo, desde el hardware y la infraestructura hasta la pila completa de almacenamiento. Esto incluye la durabilidad, la disponibilidad, el cifrado en reposo y la replicación de los datos. Los clientes solo son responsables de la administración de datos, los controles de acceso y la configuración adecuada de los servicios.

![completamente administrados](/aws/almacenamiento/responsabilidad-compartida-completamente-administrados.png)

### 4.2 Servicios administrados

En el caso de los servicios de **almacenamiento administrados**, AWS administra la infraestructura de almacenamiento subyacente, la redundancia del hardware y la replicación de volúmenes. Los clientes son responsables de las estrategias de copia de seguridad de los datos, la configuración del cifrado, la optimización del rendimiento de los volúmenes y la planificación de la capacidad.

![administrados](/aws/almacenamiento/responsabilidad-compartida-administrados.png)

### 4.3 Servicios no administrados

En el caso de los servicios de **almacenamiento no administrados**, los clientes asumen la responsabilidad total sobre la administración de datos, la copia de seguridad y la recuperación, el cifrado, la optimización del rendimiento y la durabilidad. AWS solo se encarga del hardware físico subyacente y de la infraestructura de red.

![no administrados](/aws/almacenamiento/responsabilidad-compartida-no-administrados.png)

## 5. Infografía de Estudio

![Infografía de almacenamiento en AWS](/aws/almacenamiento/almacenamiento-introduccion.png)