---
title: Glosario
description: "Glosario alfabético de los servicios y conceptos de AWS tratados en AWS Fundamentals, orientado al examen AWS Certified Cloud Practitioner."
---

# Glosario

Este glosario reúne, en **orden alfabético**, los servicios, funciones y conceptos de AWS que se explican a lo largo de esta guía. Está pensado como herramienta de repaso para el examen **AWS Certified Cloud Practitioner**: es un recurso de consulta rápida, no un sustituto de los temas completos.

Cada entrada incluye:

- **Descripción**: qué es el servicio o concepto, en una o dos líneas.
- **Categoría**: a qué dominio pertenece (Compute, Storage, Database, Networking, Security & Identity, Governance & Monitoring, Cost & Pricing, Migration, AI/ML & Analytics, Global Infrastructure, Serverless, DevOps & CI/CD, Application Integration, Cloud Computing).
- **Referencia**: enlace al documento de esta guía donde se trata el tema en profundidad.
- **Clave para el examen**: el detalle que AWS Cloud Practitioner suele evaluar.

## Índice

- [Almacenamiento de archivos](#almacenamiento-de-archivos)
- [Almacenamiento de bloques](#almacenamiento-de-bloques)
- [Almacenamiento de objetos](#almacenamiento-de-objetos)
- [Alta disponibilidad](#alta-disponibilidad)
- [AMI - Amazon Machine Image](#ami-amazon-machine-image)
- [Amazon API Gateway](#amazon-api-gateway)
- [Amazon Aurora](#amazon-aurora)
- [Amazon Bedrock](#amazon-bedrock)
- [Amazon CloudFront](#amazon-cloudfront)
- [Amazon Cognito](#amazon-cognito)
- [Amazon Cognito Identity Pool](#amazon-cognito-identity-pool)
- [Amazon Cognito User Pool](#amazon-cognito-user-pool)
- [Amazon Data Lifecycle Manager](#amazon-data-lifecycle-manager)
- [Amazon Detective](#amazon-detective)
- [Amazon DocumentDB](#amazon-documentdb)
- [Amazon DynamoDB](#amazon-dynamodb)
- [Amazon EBS](#amazon-ebs)
- [Amazon EC2](#amazon-ec2)
- [Amazon EC2 Auto Scaling](#amazon-ec2-auto-scaling)
- [Amazon ECR](#amazon-ecr)
- [Amazon ECS](#amazon-ecs)
- [Amazon EFS](#amazon-efs)
- [Amazon EKS](#amazon-eks)
- [Amazon ElastiCache](#amazon-elasticache)
- [Amazon EventBridge](#amazon-eventbridge)
- [Amazon FSx](#amazon-fsx)
- [Amazon GuardDuty](#amazon-guardduty)
- [Amazon Inspector](#amazon-inspector)
- [Amazon Lightsail](#amazon-lightsail)
- [Amazon Macie](#amazon-macie)
- [Amazon MemoryDB for Redis](#amazon-memorydb-for-redis)
- [Amazon Neptune](#amazon-neptune)
- [Amazon RDS](#amazon-rds)
- [Amazon Redshift](#amazon-redshift)
- [Amazon Route 53](#amazon-route-53)
- [Amazon S3](#amazon-s3)
- [Amazon SageMaker](#amazon-sagemaker)
- [Amazon SNS](#amazon-sns)
- [Amazon SQS](#amazon-sqs)
- [Amazon Timestream](#amazon-timestream)
- [Amazon VPC](#amazon-vpc)
- [Análisis de datos en AWS](#análisis-de-datos-en-aws)
- [ARN - Amazon Resource Name](#arn-amazon-resource-name)
- [Ataques DoS y DDoS](#ataques-dos-y-ddos)
- [Autenticación y autorización](#autenticación-y-autorización)
- [AWS Application Migration Service](#aws-application-migration-service)
- [AWS Backup](#aws-backup)
- [AWS Batch](#aws-batch)
- [AWS Budgets](#aws-budgets)
- [AWS CAF - Cloud Adoption Framework](#aws-caf-cloud-adoption-framework)
- [AWS CDK - Cloud Development Kit](#aws-cdk-cloud-development-kit)
- [AWS Certificate Manager](#aws-certificate-manager)
- [AWS CloudFormation](#aws-cloudformation)
- [AWS CloudTrail](#aws-cloudtrail)
- [AWS CloudWatch](#aws-cloudwatch)
- [AWS CodeBuild](#aws-codebuild)
- [AWS CodeCommit](#aws-codecommit)
- [AWS CodeDeploy](#aws-codedeploy)
- [AWS CodePipeline](#aws-codepipeline)
- [AWS Control Tower](#aws-control-tower)
- [AWS Cost Explorer](#aws-cost-explorer)
- [AWS Database Migration Service](#aws-database-migration-service)
- [AWS DataSync](#aws-datasync)
- [AWS Direct Connect](#aws-direct-connect)
- [AWS Elastic Beanstalk](#aws-elastic-beanstalk)
- [AWS Elastic Disaster Recovery](#aws-elastic-disaster-recovery)
- [AWS Fargate](#aws-fargate)
- [AWS Global Accelerator](#aws-global-accelerator)
- [AWS Health](#aws-health)
- [AWS IAM](#aws-iam)
- [AWS IAM Identity Center](#aws-iam-identity-center)
- [AWS KMS](#aws-kms)
- [AWS Lambda](#aws-lambda)
- [AWS License Manager](#aws-license-manager)
- [AWS Migration Evaluator](#aws-migration-evaluator)
- [AWS Migration Hub](#aws-migration-hub)
- [AWS Network Firewall](#aws-network-firewall)
- [AWS Organizations](#aws-organizations)
- [AWS Outposts](#aws-outposts)
- [AWS Pricing Calculator](#aws-pricing-calculator)
- [AWS PrivateLink](#aws-privatelink)
- [AWS Schema Conversion Tool](#aws-schema-conversion-tool)
- [AWS Secrets Manager](#aws-secrets-manager)
- [AWS Security Hub](#aws-security-hub)
- [AWS Service Catalog](#aws-service-catalog)
- [AWS Shield](#aws-shield)
- [AWS Snow Family](#aws-snow-family)
- [AWS Storage Gateway](#aws-storage-gateway)
- [AWS STS - Security Token Service](#aws-sts-security-token-service)
- [AWS Support (planes de soporte)](#aws-support-planes-de-soporte)
- [AWS Systems Manager](#aws-systems-manager)
- [AWS Transit Gateway](#aws-transit-gateway)
- [AWS Trusted Advisor](#aws-trusted-advisor)
- [AWS WAF](#aws-waf)
- [AWS Well-Architected Framework](#aws-well-architected-framework)
- [Base de datos NoSQL](#base-de-datos-nosql)
- [Base de datos relacional](#base-de-datos-relacional)
- [Caché en memoria](#caché-en-memoria)
- [Características esenciales de la nube](#características-esenciales-de-la-nube)
- [CI/CD - Integración y entrega continuas](#cicd-integración-y-entrega-continuas)
- [Ciclo de vida de los datos en Amazon S3](#ciclo-de-vida-de-los-datos-en-amazon-s3)
- [Cifrado de datos](#cifrado-de-datos)
- [Cifrado de datos en reposo](#cifrado-de-datos-en-reposo)
- [Cifrado de datos en tránsito](#cifrado-de-datos-en-tránsito)
- [Clases de almacenamiento de Amazon S3](#clases-de-almacenamiento-de-amazon-s3)
- [Contenedores y orquestación](#contenedores-y-orquestación)
- [Elastic IP](#elastic-ip)
- [Elastic Load Balancing](#elastic-load-balancing)
- [Escalabilidad vertical y horizontal](#escalabilidad-vertical-y-horizontal)
- [Escalabilidad y elasticidad](#escalabilidad-y-elasticidad)
- [Estrategias de recuperación ante desastres](#estrategias-de-recuperación-ante-desastres)
- [Estrategias de migración (7R)](#estrategias-de-migración-7r)
- [Etiquetas (tags)](#etiquetas-tags)
- [Federación de identidades](#federación-de-identidades)
- [Grupos de IAM](#grupos-de-iam)
- [Grupos de seguridad](#grupos-de-seguridad)
- [IaaS, PaaS y SaaS](#iaas-paas-y-saas)
- [Instance Store](#instance-store)
- [Inteligencia artificial generativa](#inteligencia-artificial-generativa)
- [Internet Gateway](#internet-gateway)
- [Latencia](#latencia)
- [Machine learning en AWS](#machine-learning-en-aws)
- [MFA - Autenticación multifactor](#mfa-autenticación-multifactor)
- [Microservicios](#microservicios)
- [Modelo de responsabilidad compartida](#modelo-de-responsabilidad-compartida)
- [Modelos de despliegue en la nube](#modelos-de-despliegue-en-la-nube)
- [NAT Gateway](#nat-gateway)
- [Network ACLs](#network-acls)
- [Opciones de compra de Amazon EC2](#opciones-de-compra-de-amazon-ec2)
- [Pago por uso y Savings Plans](#pago-por-uso-y-savings-plans)
- [Políticas de IAM](#políticas-de-iam)
- [Principio de mínimo privilegio](#principio-de-mínimo-privilegio)
- [Regiones de AWS](#regiones-de-aws)
- [Roles de IAM](#roles-de-iam)
- [Serverless](#serverless)
- [Subredes](#subredes)
- [Tablas de rutas](#tablas-de-rutas)
- [Tipos de instancia de Amazon EC2](#tipos-de-instancia-de-amazon-ec2)
- [Ubicaciones periféricas](#ubicaciones-periféricas)
- [Usuarios de IAM](#usuarios-de-iam)
- [Usuario raíz de la cuenta AWS](#usuario-raíz-de-la-cuenta-aws)
- [Ventajas de la nube de AWS](#ventajas-de-la-nube-de-aws)
- [Virtualización e hipervisores](#virtualización-e-hipervisores)
- [VPC Peering](#vpc-peering)
- [Zonas de disponibilidad](#zonas-de-disponibilidad)

---

## Almacenamiento de archivos

**Descripción:** Modelo de almacenamiento basado en sistemas de archivos compartidos a los que se accede a través de una red, de modo que múltiples usuarios, aplicaciones e instancias accedan a los mismos datos de forma simultánea.

**Categoría:** Storage

**Referencia:** [almacenamiento/introduccion.md](./almacenamiento/introduccion.md)

**Clave para el examen:** Si el escenario indica "archivos compartidos accesibles por muchas instancias EC2", la respuesta suele ser un sistema de archivos (Amazon EFS o Amazon FSx).

---

## Almacenamiento de bloques

**Descripción:** Modelo de almacenamiento que entrega volúmenes persistentes y de baja latencia a nivel de bloques, conectados directamente a las instancias de Amazon EC2 (similar a discos duros).

**Categoría:** Storage

**Referencia:** [almacenamiento/introduccion.md](./almacenamiento/introduccion.md)

**Clave para el examen:** El bloque es el almacenamiento típico de sistemas operativos y bases de datos dentro de una instancia; su servicio principal es Amazon EBS.

---

## Almacenamiento de objetos

**Descripción:** Arquitectura que administra los datos como objetos en un espacio de direcciones plano (sin estructura de carpetas), con escalabilidad prácticamente ilimitada y apta para datos no estructurados.

**Categoría:** Storage

**Referencia:** [almacenamiento/introduccion.md](./almacenamiento/introduccion.md)

**Clave para el examen:** El objeto es el modelo de almacenamiento principal para contenido no estructurado en la nube; su servicio principal es Amazon S3.

---

## Alta disponibilidad

**Descripción:** Capacidad de un sistema para seguir operando y respondiendo ante fallos, minimizando el tiempo de inactividad mediante redundancia de componentes y diseño tolerante a fallos.

**Categoría:** Cloud Computing

**Referencia:** [cloud-computing/05-alta-disponibilidad.md](./cloud-computing/05-alta-disponibilidad.md)

**Clave para el examen:** Se logra eliminando puntos únicos de fallo: múltiples instancias, balanceadores de carga, réplicas de datos y despliegue multi-zona (AZ). Recuerda el concepto de "nueves" de disponibilidad (99,9 %, 99,99 %...).

---

## AMI - Amazon Machine Image

**Descripción:** Imagen de máquina de Amazon; plantilla que contiene el sistema operativo, la configuración, el software y los permisos de lanzamiento para crear una instancia de Amazon EC2.

**Categoría:** Compute

**Referencia:** [compute/amazon-ec2.mdx](./compute/amazon-ec2.mdx)

**Clave para el examen:** Las instancias EC2 se lanzan siempre a partir de una AMI; una misma AMI puede crear múltiples instancias.

---

## Amazon API Gateway

**Descripción:** Servicio que actúa como puerta de entrada para las APIs: enruta y transforma solicitudes, hace de *reverse proxy*, autentica, limita el ritmo (*rate limiting*), guarda en caché, termina TLS y registra métricas. Es un componente clave en arquitecturas serverless.

**Categoría:** Application Integration / Serverless

**Referencia:** [cloud-computing/api-gateway.md](./cloud-computing/api-gateway.md)

**Clave para el examen:** Es el endpoint público que conecta una interfaz (app web o móvil) con servicios como AWS Lambda. Se integra con Amazon Cognito y AWS IAM para la autenticación.

---

## Amazon Aurora

**Descripción:** Base de datos relacional administrada, compatible con MySQL y PostgreSQL, diseñada para la nube. Replica seis copias de los datos en tres zonas de disponibilidad y ofrece copias de seguridad continuas en Amazon S3.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-relacionales.md](./data-base/base-de-datos-relacionales.md)

**Clave para el examen:** Hasta 5 veces más rápido que MySQL y 3 veces más que PostgreSQL; hasta 15 réplicas de lectura; recuperación a un punto en el tiempo (*point-in-time recovery*); escalabilidad automática de 10 GB a 128 TB; disponibilidad del 99,99 %.

---

## Amazon Bedrock

**Descripción:** Servicio administrado para crear aplicaciones de inteligencia artificial generativa usando modelos fundamentales (FM) y modelos de lenguaje de gran tamaño (LLM) a través de una API.

**Categoría:** AI/ML & Analytics

**Referencia:** [ia-ml-y-analisis-datos/ia-generativa-aws.md](./ia-ml-y-analisis-datos/ia-generativa-aws.md)

**Clave para el examen:** Cuando se habla de IA generativa o de construir aplicaciones con modelos de lenguaje en AWS, el servicio clave es Amazon Bedrock.

---

## Amazon CloudFront

**Descripción:** Servicio de entrega de contenido (CDN, *Content Delivery Network*) que distribuye contenido web, videos, APIs y aplicaciones a los usuarios con baja latencia, sirviéndolo desde ubicaciones periféricas (*edge locations*) cercanas al usuario.

**Categoría:** Networking

**Referencia:** [redes/redes-globales.mdx](./redes/redes-globales.mdx)

**Clave para el examen:** Reduce la latencia al almacenar copias del contenido en caché en los puntos de presencia de AWS repartidos por el mundo. AWS Shield Advanced se integra con CloudFront para mitigar DDoS.

---

## Amazon Cognito

**Descripción:** Servicio administrado de identidad y acceso para usuarios finales de aplicaciones web y móviles. Gestiona el registro, el inicio de sesión, la MFA y el control de acceso, y actúa como puente entre la aplicación y los servicios de AWS.

**Categoría:** Security & Identity

**Referencia:** [security/cognito.md](./security/cognito.md)

**Clave para el examen:** Cognito es para **usuarios finales de la aplicación**; IAM es para **identidades internas de la cuenta AWS**. Sus dos componentes son User Pool (autentica) e Identity Pool (entrega credenciales de AWS).

---

## Amazon Cognito Identity Pool

**Descripción:** Catálogo de identidades federadas que cambia los tokens JWT del User Pool por credenciales temporales de AWS emitidas por STS, asignando roles de IAM distintos según la identidad (autenticada o invitada).

**Categoría:** Security & Identity

**Referencia:** [security/cognito.md](./security/cognito.md)

**Clave para el examen:** No confundir con el User Pool: el **User Pool autentica** y emite tokens; el **Identity Pool autoriza** el acceso a recursos de AWS mediante credenciales temporales. El cliente nunca guarda claves de AWS permanentes.

---

## Amazon Cognito User Pool

**Descripción:** Directorio de usuarios finales administrado (proveedor OIDC) que gestiona el registro, el inicio de sesión, la MFA y la recuperación de contraseñas, y emite tokens JWT (ID Token, Access Token y Refresh Token).

**Categoría:** Security & Identity

**Referencia:** [security/cognito.md](./security/cognito.md)

**Clave para el examen:** Responde "¿quién es el usuario?". Soporta inicio de sesión social (Google, Facebook, Apple) y federación SAML/OIDC. Los tokens se validan sin llamar a Cognito usando las claves públicas JWKS.

---

## Amazon Data Lifecycle Manager

**Descripción:** Servicio que automatiza la creación, retención y eliminación de instantáneas (snapshots) de Amazon EBS, programando copias fuera de las horas pico y eliminando las copias obsoletas.

**Categoría:** Storage

**Referencia:** [almacenamiento/almacenamiento-bloques.mdx](./almacenamiento/almacenamiento-bloques.mdx)

**Clave para el examen:** Permite cumplir las políticas de copias de seguridad de EBS sin intervención manual, reduciendo costos y esfuerzo operativo.

---

## Amazon Detective

**Descripción:** Servicio de investigación de amenazas que, mediante visualizaciones interactivas, analiza la causa raíz de los hallazgos de seguridad y muestra las interacciones entre recursos y usuarios en una línea de tiempo.

**Categoría:** Governance & Monitoring

**Referencia:** [security/deteccion-y-respuesta-incidentes.md](./security/deteccion-y-respuesta-incidentes.md)

**Clave para el examen:** Se usa **después** de la detección para investigar una alerta (GuardDuty/Inspector detectan y analizan; Detective investiga). Forma parte del ciclo prevenir → detectar → investigar → responder.

---

## Amazon DocumentDB

**Descripción:** Base de datos de documentos administrada, compatible con MongoDB, que gestiona documentos JSON con esquemas dinámicos y escala automáticamente hasta 64 TB.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-adicionales.md](./data-base/base-de-datos-adicionales.md)

**Clave para el examen:** Compatible con MongoDB; ideal para contenido, catálogos, inventarios y perfiles de usuario (datos JSON). Hasta 15 instancias de réplica de lectura compartiendo el almacenamiento.

---

## Amazon DynamoDB

**Descripción:** Base de datos NoSQL totalmente administrada y serverless, de tipo clave-valor y documentos, con latencia de un solo dígito en milisegundos a cualquier escala y cifrado en reposo automático.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-nosql.mdx](./data-base/base-de-datos-nosql.mdx)

**Clave para el examen:** Disponibilidad del 99,999 % con datos replicados en varias AZ; escala automáticamente y no requiere administrar servidores; DynamoDB Streams procesa eventos y Global Tables replica tablas entre regiones.

---

## Amazon EBS

**Descripción:** Servicio de almacenamiento de bloques **persistente** para instancias de Amazon EC2. Los volúmenes actúan como discos duros externos: se respaldan con instantáneas, se redimensionan y se reconectan, con cifrado de datos en reposo.

**Categoría:** Storage

**Referencia:** [almacenamiento/almacenamiento-bloques.mdx](./almacenamiento/almacenamiento-bloques.mdx)

**Clave para el examen:** A diferencia del instance store, **EBS persiste los datos** al detener la instancia. Las instantáneas son **incrementales** y se almacenan en Amazon S3. Un volumen EBS y su instancia deben estar en la misma zona de disponibilidad.

---

## Amazon EC2

**Descripción:** Servicio de computación que proporciona máquinas virtuales seguras y redimensionables (instancias) bajo demanda. Cada instancia se lanza desde una AMI con un tipo de instancia, claves de conexión, grupos de seguridad, almacenamiento (EBS o instance store) y red.

**Categoría:** Compute

**Referencia:** [compute/amazon-ec2.mdx](./compute/amazon-ec2.mdx)

**Clave para el examen:** Es el servicio de servidores virtuales por excelencia. El patrón correcto para que una aplicación dentro de EC2 acceda a otros servicios AWS es asignarle un **rol de IAM**, no credenciales embebidas.

---

## Amazon EC2 Auto Scaling

**Descripción:** Servicio que ajusta automáticamente la cantidad de instancias EC2 según la demanda, manteniendo una capacidad mínima, deseada y máxima, y sustituyendo instancias no saludables.

**Categoría:** Compute

**Referencia:** [compute/escalado-amazon-ec2.mdx](./compute/escalado-amazon-ec2.mdx)

**Clave para el examen:** Proporciona **escalabilidad** (agregar recursos) y **elasticidad** (capacidad que sube y baja con la demanda). Trabaja junto con Elastic Load Balancing; admite escalado dinámico y predictivo.

---

## Amazon ECR

**Descripción:** Registro administrado de imágenes de contenedores Docker, donde se almacenan y distribuyen las imágenes que luego ejecutan ECS, EKS y Fargate.

**Categoría:** DevOps & CI/CD

**Referencia:** [serverless/contenedores-y-orquestacion.mdx](./serverless/contenedores-y-orquestacion.mdx)

**Clave para el examen:** Es el "repositorio" de imágenes de contenedores de AWS, equivalente privado y gestionado a un registro Docker.

---

## Amazon ECS

**Descripción:** Servicio de orquestación de contenedores totalmente administrado que permite ejecutar y escalar contenedores Docker en clústeres, sin gestionar la infraestructura de orquestación.

**Categoría:** DevOps & CI/CD / Compute

**Referencia:** [serverless/contenedores-y-orquestacion.mdx](./serverless/contenedores-y-orquestacion.mdx)

**Clave para el examen:** Es la opción nativa de AWS para orquestar contenedores; junto con AWS Fargate (mote serverless) o instancias EC2 subyacentes.

---

## Amazon EFS

**Descripción:** Sistema de archivos (NFS) totalmente administrado, elástico y compartido, que escala automáticamente a petabytes y permite que múltiples instancias EC2 accedan simultáneamente a los mismos datos en varias zonas de disponibilidad.

**Categoría:** Storage

**Referencia:** [almacenamiento/almacenamiento-archivos.mdx](./almacenamiento/almacenamiento-archivos.mdx)

**Clave para el examen:** Es regional (multi-AZ) y compatible con Linux/POSIX. A diferencia de EBS (una sola AZ que no escala solo), EFS crece y se contrae según la demanda.

---

## Amazon EKS

**Descripción:** Servicio administrado de Kubernetes para ejecutar clústeres de contenedores, sin necesidad de instalar, operar ni mantener el plano de control de Kubernetes.

**Categoría:** DevOps & CI/CD / Compute

**Referencia:** [serverless/contenedores-y-orquestacion.mdx](./serverless/contenedores-y-orquestacion.mdx)

**Clave para el examen:** EKS = Kubernetes administrado; ECS = orquestación nativa de AWS. Ambos pueden ejecutarse con AWS Fargate.

---

## Amazon ElastiCache

**Descripción:** Servicio de caché en memoria totalmente administrado, compatible con Redis, Valkey y Memcached, que reduce la carga de las bases de datos acelerando el acceso a los datos de uso frecuente.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-en-cache.md](./data-base/base-de-datos-en-cache.md)

**Clave para el examen:** Latencia de microsegundos, replicación, escalado horizontal y vertical, multi-AZ con failover automático y cifrado. Un caché acelera lecturas repetidas pero **no sustituye** a la base de datos.

---

## Amazon EventBridge

**Descripción:** Bus de eventos (arquitectura orientada a eventos) que conecta fuentes de eventos con destinos, enrutando eventos entre servicios de AWS y aplicaciones.

**Categoría:** Application Integration

**Referencia:** [compute/mensajeria-colas.mdx](./compute/mensajeria-colas.mdx)

**Clave para el examen:** Resume su función en "enrutar eventos" entre componentes y servicios; es la evolución de CloudWatch Events. Se usa para respuestas automáticas a cambios o eventos del sistema.

---

## Amazon FSx

**Descripción:** Familia de sistemas de archivos totalmente administrados de alto rendimiento que admite varios protocolos: FSx for Windows File Server, FSx for Lustre, FSx for OpenZFS y FSx for NetApp ONTAP.

**Categoría:** Storage

**Referencia:** [almacenamiento/almacenamiento-archivos.mdx](./almacenamiento/almacenamiento-archivos.mdx)

**Clave para el examen:** Alternativa a EFS cuando se necesita soporte de Windows, Lustre (HPC/ML) u ONTAP, o migración de sistemas de archivos existentes con un coste total de propiedad menor.

---

## Amazon GuardDuty

**Descripción:** Servicio de detección de amenazas que supervisa de forma continua la actividad de la cuenta (flujos de metadatos y de red) usando inteligencia artificial, detección de anomalías y listas de IP maliciosas conocidas.

**Categoría:** Governance & Monitoring

**Referencia:** [security/deteccion-y-respuesta-incidentes.md](./security/deteccion-y-respuesta-incidentes.md)

**Clave para el examen:** Detecta amenazas de forma **continua** y genera hallazgos con pasos de corrección; se integra con AWS Lambda para automatizar la respuesta.

---

## Amazon Inspector

**Descripción:** Servicio de evaluaciones de seguridad automatizadas para instancias EC2, contenedores y funciones Lambda, que detecta vulnerabilidades y desviaciones de las prácticas recomendadas.

**Categoría:** Governance & Monitoring

**Referencia:** [security/deteccion-y-respuesta-incidentes.md](./security/deteccion-y-respuesta-incidentes.md)

**Clave para el examen:** Ordena los hallazgos por severidad y ofrece recomendaciones; se centra en vulnerabilidades de las cargas de trabajo (no en la gestión de identidades).

---

## Amazon Lightsail

**Descripción:** Servicio de VPS sencillo y de precio predecible para cargas de trabajo ligeras (sitios web, blogs, aplicaciones pequeñas), con instancias, almacenamiento y red empaquetados.

**Categoría:** Compute

**Referencia:** [compute/servicios-adicionales.md](./compute/servicios-adicionales.md)

**Clave para el examen:** Pensado para proyectos sencillos que quieren un precio fijo/mensual sin la complejidad de EC2; no es la opción para arquitecturas complejas o escalables.

---

## Amazon Macie

**Descripción:** Servicio que usa machine learning y automatización para descubrir y supervisar información confidencial (por ejemplo, datos personales PII) almacenada en Amazon S3, y evaluar la posición de seguridad.

**Categoría:** Security & Identity

**Referencia:** [security/proteccion-datos.md](./security/proteccion-datos.md)

**Clave para el examen:** Pareja "datos sensibles en S3 + cumplimiento" → Amazon Macie.

---

## Amazon MemoryDB for Redis

**Descripción:** Base de datos en memoria compatible con Redis y **persistente** (durable), para aplicaciones que requieren latencia muy baja y alta disponibilidad con los datos conservados.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-en-cache.md](./data-base/base-de-datos-en-cache.md)

**Clave para el examen:** A diferencia de un caché efímero, MemoryDB persiste los datos en memoria; se elige cuando se necesita durabilidad además de velocidad.

---

## Amazon Neptune

**Descripción:** Base de datos de grafos totalmente administrada para conjuntos de datos altamente conectados, compatible con modelos de propiedades (Property Graph) y RDF, que procesa miles de millones de relaciones en milisegundos.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-adicionales.md](./data-base/base-de-datos-adicionales.md)

**Clave para el examen:** "Relaciones", "grafos", "redes sociales", "detección de fraude" → Amazon Neptune. Escala automáticamente hasta 64 TB.

---

## Amazon RDS

**Descripción:** Servicio de bases de datos relacionales administrado que automatiza el aprovisionamiento de hardware, las copias de seguridad, los parches y la replicación. Soporta MySQL, PostgreSQL, MariaDB, Oracle, SQL Server y Amazon Aurora.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-relacionales.md](./data-base/base-de-datos-relacionales.md)

**Clave para el examen:** Multiaz (multi-AZ) con failover automático; escalado vertical y horizontal; cifrado en reposo y en tránsito; monitoreo con Amazon CloudWatch y Performance Insights. En RDS, AWS gestiona la infraestructura; tú gestionas las bases de datos.

---

## Amazon Redshift

**Descripción:** Almacén de datos (data warehouse) en la nube para ejecutar consultas analíticas complejas en grandes volúmenes de datos estructurados y semiestructurados.

**Categoría:** Database

**Referencia:** [data-base/introduccion.md](./data-base/introduccion.md)

**Clave para el examen:** "Analítica", "grandes volúmenes", "data warehouse", "inteligencia de negocio" → Amazon Redshift.

---

## Amazon Route 53

**Descripción:** Servicio de DNS (Domain Name System) y enrutamiento de tráfico que traduce nombres de dominio a direcciones IP y dirige a los usuarios hacia los recursos de AWS, con alta disponibilidad y baja latencia.

**Categoría:** Networking

**Referencia:** [redes/redes-globales.mdx](./redes/redes-globales.mdx)

**Clave para el examen:** Es el "DNS de AWS": resuelve dominios y enruta el tráfico de los usuarios. Se integra con CloudFront y Route 53 con AWS Shield para la protección.

---

## Amazon S3

**Descripción:** Servicio de almacenamiento de objetos totalmente administrado y de alta disponibilidad. Almacena archivos como **objetos** dentro de **buckets** y ofrece una durabilidad del 99,999999999 % (11 nueves).

**Categoría:** Storage

**Referencia:** [almacenamiento/almacenamiento-objetos.mdx](./almacenamiento/almacenamiento-objetos.mdx)

**Clave para el examen:** Almacenamiento prácticamente ilimitado; se paga solo por lo usado; **privado por defecto**; los buckets tienen nombre único global; los objetos pueden medir hasta 5 TB; el cifrado en reposo está habilitado por defecto en los buckets nuevos.

---

## Amazon SageMaker

**Descripción:** Servicio administrado de machine learning que cubre todo el ciclo: preparar los datos, construir y entrenar el modelo, y desplegarlo en producción, sin gestionar la infraestructura.

**Categoría:** AI/ML & Analytics

**Referencia:** [ia-ml-y-analisis-datos/ia-ml-aws.mdx](./ia-ml-y-analisis-datos/ia-ml-aws.mdx)

**Clave para el examen:** Tareas completas de ML (entrenar modelos propios) → Amazon SageMaker. Para capacidades de IA listas para usar, AWS ofrece servicios de IA específicos.

---

## Amazon SNS

**Descripción:** Servicio de notificaciones *publish/subscribe* (publicador-suscriptor) gestionado. Un mensaje se publica en un tema y se **envía (push)** a todos los suscriptores (aplicaciones, correos, SMS).

**Categoría:** Application Integration

**Referencia:** [compute/mensajeria-colas.mdx](./compute/mensajeria-colas.mdx)

**Clave para el examen:** Modelo **pub/sub** con entrega **push** a múltiples destinatarios; se usa para notificaciones y fan-out. Se compara directamente con SQS (cola, **pull**) en el examen.

---

## Amazon SQS

**Descripción:** Servicio de colas de mensajes totalmente administrado que desacopla los componentes de una aplicación. Los mensajes permanecen en la cola hasta que un consumidor los **leye (pull)** y los procesa.

**Categoría:** Application Integration

**Referencia:** [compute/mensajeria-colas.mdx](./compute/mensajeria-colas.mdx)

**Clave para el examen:** Modelo de **cola** con sondeo (**pull/polling**); cada mensaje lo procesa un consumidor. Desacoplar microservicios o suavizar picos de tráfico → SQS.

---

## Amazon Timestream

**Descripción:** Base de datos administrada para almacenar y analizar datos de **series temporales**, como métricas de sensores IoT, aplicaciones operativas y telemetría.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-adicionales.md](./data-base/base-de-datos-adicionales.md)

**Clave para el examen:** "Series temporales", "IoT", "sensores", "métricas en el tiempo" → Amazon Timestream.

---

## Amazon VPC

**Descripción:** Red virtual aislada dentro de AWS que permite lanzar recursos en una red definida por ti: subredes públicas y privadas, tablas de rutas, Internet Gateway, NAT Gateway, grupos de seguridad y Network ACLs.

**Categoría:** Networking

**Referencia:** [redes/introduccion.mdx](./redes/introduccion.mdx)

**Clave para el examen:** VPC es el elemento base de la red en AWS. Distingue: Internet Gateway (salida a internet), NAT Gateway (instancias privadas salen sin recibir tráfico entrante), Security Groups (a nivel de instancia) y Network ACLs (a nivel de subred).

---

## Análisis de datos en AWS

**Descripción:** Conjunto de servicios para ingerir, procesar y analizar datos a escala: tuberías ETL, procesamiento de eventos y almacenes de datos que convierten datos brutos en información accionable.

**Categoría:** AI/ML & Analytics

**Referencia:** [ia-ml-y-analisis-datos/analisis-datos.mdx](./ia-ml-y-analisis-datos/analisis-datos.mdx)

**Clave para el examen:** Para almacenar y consultar datos a gran escala, combina servicios de ingesta y procesamiento con almacenes de datos como Amazon Redshift.

---

## ARN - Amazon Resource Name

**Descripción:** Identificador único que AWS asigna a cada recurso (formato `arn:partition:service:region:account:resource`), usado en las políticas de IAM para referenciar exactamente sobre qué recursos se conceden permisos.

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md)

**Clave para el examen:** Las políticas de IAM usan ARNs en el campo `Resource` para acotar el alcance de los permisos.

---

## Ataques DoS y DDoS

**Descripción:** En un ataque de denegación de servicio (DoS) un atacante inunda una aplicación con tráfico excesivo para sobrecargarla; en el DDoS (distribuido) se usan muchos equipos infectados (bots zombi) para enviar ese tráfico simultáneamente.

**Categoría:** Security & Identity

**Referencia:** [security/proteccion-redes-y-app.md](./security/proteccion-redes-y-app.md)

**Clave para el examen:** AWS protege por infraestructura (capacidad regional, grupos de seguridad, ELB) y por servicio (AWS Shield para DDoS y AWS WAF para tráfico HTTP/S).

---

## Autenticación y autorización

**Descripción:** La autenticación verifica **quién eres** (credenciales, contraseña, MFA); la autorización decide **qué puedes hacer** (permisos sobre recursos) una vez autenticado. En AWS: autenticar con IAM/Cognito, autorizar con políticas y roles.

**Categoría:** Security & Identity

**Referencia:** [security/introduccion.md](./security/introduccion.md) · [security/cognito.md](./security/cognito.md)

**Clave para el examen:** Primero autenticar, después autorizar. Cognito User Pool autentica; las políticas de IAM/autorización deciden el acceso.

---

## AWS Application Migration Service

**Descripción:** Servicio de migración que facilita el *rehosting* (lift-and-shift) de servidores físicos o virtuales a AWS, replicándolos y lanzándolos como instancias EC2.

**Categoría:** Migration

**Referencia:** [migracion-nube/servicios-migracion.mdx](./migracion-nube/servicios-migracion.mdx)

**Clave para el examen:** Migrar "tal cual" servidores a la nube (misma estrategia de rehost) → AWS Application Migration Service.

---

## AWS Backup

**Descripción:** Servicio centralizado que automatiza las copias de seguridad de múltiples servicios de AWS (RDS, EBS, EFS, DynamoDB...) desde un único panel, con cifrado, copias entre regiones y registros de auditoría.

**Categoría:** Storage

**Referencia:** [data-base/base-de-datos-adicionales.md](./data-base/base-de-datos-adicionales.md)

**Clave para el examen:** "Panel único" y "políticas de backup centralizadas" en múltiples servicios → AWS Backup.

---

## AWS Batch

**Descripción:** Servicio para ejecutar trabajos por lotes (batch jobs) a escala, aprovisionando automáticamente los recursos de cómputo necesarios según los trabajos enviados.

**Categoría:** Compute

**Referencia:** [compute/servicios-adicionales.md](./compute/servicios-adicionales.md)

**Clave para el examen:** "Trabajos por lotes", "procesamiento batch", "computación a gran escala bajo demanda" → AWS Batch.

---

## AWS Budgets

**Descripción:** Servicio de gestión de costos que permite fijar presupuestos personalizados y recibir alertas cuando el uso o el gasto se acercan o superan los límites definidos.

**Categoría:** Cost & Pricing

**Referencia:** [precios-soporte/precio-aws.mdx](./precios-soporte/precio-aws.mdx)

**Clave para el examen:** AWS Budgets = "presupuestos y alertas de costos"; AWS Cost Explorer = "analizar y visualizar el gasto histórico". Ambos son herramientas clave del pilar de optimización de costos.

---

## AWS CAF - Cloud Adoption Framework

**Descripción:** Marco de referencia de AWS que guía paso a paso la adopción de la nube, agrupando procesos y capacidades de la organización (negocio, personas, tecnología, entre otras) para planear y ejecutar la migración.

**Categoría:** Migration

**Referencia:** [migracion-nube/aws-caf.mdx](./migracion-nube/aws-caf.mdx)

**Clave para el examen:** El CAF organiza la adopción en perspectivas/capacidades (Negocio, Personas, Procesos y Tecnología en el material) y consta de fases guiadas (evaluar, planificar, migrar, validar y optimizar, según el material de migración).

---

## AWS CDK - Cloud Development Kit

**Descripción:** Framework de Infrastructure as Code (IaC) que permite definir la infraestructura de AWS con **lenguajes de programación** (TypeScript, Python, etc.) en lugar de plantillas declarativas.

**Categoría:** DevOps & CI/CD

**Referencia:** [devops/cdk.md](./devops/cdk.md)

**Clave para el examen:** Diferenciar: **CDK = infraestructura en código** (lenguajes de programación) vs **CloudFormation = infraestructura en plantillas** (JSON/YAML). Ambos generan stacks.

---

## AWS Certificate Manager

**Descripción:** Servicio que centraliza la administración de **certificados SSL/TLS**, que proporcionan el cifrado de los datos **en tránsito** entre sistemas.

**Categoría:** Security & Identity

**Referencia:** [security/proteccion-datos.md](./security/proteccion-datos.md)

**Clave para el examen:** "Certificados SSL/TLS", "cifrado en tránsito" → AWS Certificate Manager.

---

## AWS CloudFormation

**Descripción:** Servicio de Infrastructure as Code (IaC) que crea y administra recursos de AWS a partir de **plantillas declarativas** (JSON/YAML), definiendo toda la infraestructura como stacks reproducibles y versionables.

**Categoría:** DevOps & CI/CD

**Referencia:** [devops/cloudformation.md](./devops/cloudformation.md)

**Clave para el examen:** "Definir infraestructura en plantillas", "despliegue repetible", "stacks" → AWS CloudFormation. Es la respuesta clásica para aprovisionamiento automatizado.

---

## AWS CloudTrail

**Descripción:** Servicio que registra la **actividad de la API** en la cuenta (quién hizo qué, cuándo y desde dónde), ofreciendo un registro de auditoría para monitoreo, cumplimiento y respuesta a incidentes.

**Categoría:** Governance & Monitoring

**Referencia:** [security/deteccion-y-respuesta-incidentes.md](./security/deteccion-y-respuesta-incidentes.md)

**Clave para el examen:** "Auditoría", "rastrear acciones de API", "quién hizo qué" → AWS CloudTrail. Distinto de CloudWatch (métricas y logs de recursos).

---

## AWS CloudWatch

**Descripción:** Servicio de monitoreo de los recursos y aplicaciones de AWS: recopila métricas, genera alarmas, almacena logs y permite supervisar el estado de la infraestructura.

**Categoría:** Governance & Monitoring

**Referencia:** [monitoreo-cumplimiento/supervision-y-cumplimiento.mdx](./monitoreo-cumplimiento/supervision-y-cumplimiento.mdx)

**Clave para el examen:** "Métricas, alarmas, supervisión de recursos" → Amazon CloudWatch.

---

## AWS CodeBuild

**Descripción:** Servicio de CI/CD que **compila y ejecuta pruebas** de código fuente, creando artefactos listos para desplegar, sin necesidad de gestionar servidores.

**Categoría:** DevOps & CI/CD

**Referencia:** [devops/cicd.md](./devops/cicd.md)

**Clave para el examen:** "Construir y probar código" → CodeBuild. Forma parte del pipeline de CI/CD junto con CodePipeline (orquestación), CodeDeploy (despliegue) y CodeCommit (repositorio).

---

## AWS CodeCommit

**Descripción:** Servicio de repositorios Git seguros y gestionados para almacenar el código fuente de los proyectos.

**Categoría:** DevOps & CI/CD

**Referencia:** [devops/cicd.md](./devops/cicd.md)

**Clave para el examen:** "Repositorio/versionado del código" → CodeCommit (equivalente gestionado de GitHub).

---

## AWS CodeDeploy

**Descripción:** Servicio de CI/CD que automatiza el **despliegue** de aplicaciones en instancias EC2, contenedores y otros destinos, soportando estrategias como Blue/Green o Canary.

**Categoría:** DevOps & CI/CD

**Referencia:** [devops/cicd.md](./devops/cicd.md)

**Clave para el examen:** "Desplegar la aplicación con actualizaciones progresivas (Blue/Green, Canary)" → CodeDeploy.

---

## AWS CodePipeline

**Descripción:** Servicio de CI/CD que **orquesta las etapas** del pipeline: construir, probar y desplegar automáticamente, integrando CodeCommit, CodeBuild, CodeDeploy y herramientas de terceros.

**Categoría:** DevOps & CI/CD

**Referencia:** [devops/cicd.md](./devops/cicd.md)

**Clave para el examen:** Es el "conductor" del pipeline CI/CD que encadena integración y despliegue continuos.

---

## AWS Control Tower

**Descripción:** Servicio de gobernanza que automatiza la creación y gestión de **landing zones** multi-cuenta, aplicando políticas y controles centralizados para organizaciones con varias cuentas.

**Categoría:** Governance & Monitoring

**Referencia:** [monitoreo-cumplimiento/gobernanza.md](./monitoreo-cumplimiento/gobernanza.md)

**Clave para el examen:** "Gobernanza multi-cuenta", "landing zone", "configuración estandarizada de cuentas nuevas" → AWS Control Tower.

---

## AWS Cost Explorer

**Descripción:** Herramienta de análisis de costos que permite **visualizar, filtrar y comprender** el gasto y el uso de los recursos de AWS a lo largo del tiempo.

**Categoría:** Cost & Pricing

**Referencia:** [precios-soporte/precio-aws.mdx](./precios-soporte/precio-aws.mdx)

**Clave para el examen:** "Analizar el gasto histórico", "visualizar costos por servicio" → AWS Cost Explorer.

---

## AWS Database Migration Service

**Descripción:** Servicio que migra bases de datos a AWS manteniendo la base de origen **en funcionamiento** durante el proceso, soportando migraciones homogéneas (misma tecnología) y heterogéneas (tecnologías distintas).

**Categoría:** Migration

**Referencia:** [data-base/base-de-datos-adicionales.md](./data-base/base-de-datos-adicionales.md)

**Clave para el examen:** Migraciones heterogéneas se acompañan de **AWS Schema Conversion Tool** para convertir el esquema entre motores. DMS mantiene el origen operativo (downtime mínimo).

---

## AWS DataSync

**Descripción:** Servicio que automatiza el **movimiento de datos en línea** entre almacenamiento on-premises y AWS (y entre servicios de AWS), con cifrado y validación.

**Categoría:** Migration

**Referencia:** [migracion-nube/servicios-migracion.mdx](./migracion-nube/servicios-migracion.mdx)

**Clave para el examen:** "Transferir datos a la nube por red, en línea y de forma continua" → AWS DataSync (frente a la transferencia física de AWS Snow Family).

---

## AWS Direct Connect

**Descripción:** Conexión de red **privada y dedicada** entre un centro de datos on-premises y AWS, que no viaja por la internet pública, con latencia y seguridad más predecibles.

**Categoría:** Networking

**Referencia:** [redes/formas-conectar.mdx](./redes/formas-conectar.mdx)

**Clave para el examen:** Dedicado y privado vs Site-to-Site VPN (sobre internet pública) vs Client VPN (usuarios individuales) vs PrivateLink (acceso a servicios de AWS sin exponerlos a internet).

---

## AWS Elastic Beanstalk

**Descripción:** Servicio de plataforma como servicio (PaaS): subes tu código y AWS gestiona automáticamente la infraestructura (instancias, balanceador, escalado, monitoreo) para desplegarlo.

**Categoría:** Compute

**Referencia:** [compute/servicios-adicionales.md](./compute/servicios-adicionales.md)

**Clave para el examen:** "Desplegar una aplicación sin gestionar la infraestructura (PaaS)" → AWS Elastic Beanstalk.

---

## AWS Elastic Disaster Recovery

**Descripción:** Servicio de recuperación ante desastres que replica continuamente los discos (a nivel de bloque) de servidores físicos o virtuales hacia AWS, permitiendo recuperar cargas de trabajo en minutos con pruebas no disruptivas.

**Categoría:** Storage / Migration

**Referencia:** [almacenamiento/recuperacion-elastica-ante-desastres.md](./almacenamiento/recuperacion-elastica-ante-desastres.md)

**Clave para el examen:** RPO/RTO muy bajos con replicación continua; elimina la necesidad de un centro de datos secundario propio.

---

## AWS Fargate

**Descripción:** Motor de cómputo **serverless** para contenedores: ejecuta ECS/EKS sin aprovisionar ni gestionar instancias EC2, cobrando por los recursos realmente consumidos.

**Categoría:** Serverless / DevOps & CI/CD

**Referencia:** [serverless/contenedores-y-orquestacion.mdx](./serverless/contenedores-y-orquestacion.mdx)

**Clave para el examen:** "Contenedores sin gestionar servidores" → AWS Fargate. Los tres niveles: ECS/EKS sobre EC2 (tú gestionas las instancias) vs ECS/EKS sobre Fargate (AWS gestiona todo).

---

## AWS Global Accelerator

**Descripción:** Servicio que mejora la **disponibilidad y el rendimiento** de las aplicaciones globales dirigiendo el tráfico de los usuarios a través de la red perimetral de AWS, con direcciones IP estáticas (anycast).

**Categoría:** Networking

**Referencia:** [redes/redes-globales.mdx](./redes/redes-globales.mdx)

**Clave para el examen:** Enruta el tráfico por la infraestructura de AWS (no por internet pública) y permite cambiar el destino sin cambiar las IPs públicas.

---

## AWS Health

**Descripción:** Servicio que ofrece información sobre el **estado de los servicios y recursos** de AWS: eventos, interrupciones y avisos que afectan a tu cuenta en una región.

**Categoría:** Governance & Monitoring

**Referencia:** [monitoreo-cumplimiento/estado-recursos.md](./monitoreo-cumplimiento/estado-recursos.md)

**Clave para el examen:** "Saber si hay un problema conocido de AWS que afecte tus recursos" → AWS Health.

---

## AWS IAM

**Descripción:** Servicio para administrar identidades y accesos dentro de la cuenta de AWS: usuarios, grupos, roles y políticas. IAM es **global y gratuito**, y por defecto todo está denegado (principio de acceso mínimo).

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md)

**Clave para el examen:** Reglas: IAM es global (no se elige región) y gratuito; denegado por defecto hasta que una política permita; un **Deny explícito siempre gana** a cualquier Allow; aplica mínimo privilegio; las políticas se asignan a grupos (buena práctica), no a usuarios individuales.

---

## AWS IAM Identity Center

**Descripción:** Servicio que centraliza la administración de identidades y el acceso (SSO, inicio de sesión único) de los **empleados** a múltiples cuentas AWS y aplicaciones, admitiendo identidad federada.

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md) · [security/permiso-y-acceso-usuario.md](./security/permiso-y-acceso-usuario.md)

**Clave para el examen:** "Personas", "SSO", "múltiples cuentas", "acceso centralizado" → IAM Identity Center. Se combina con AWS Organizations para administrar el acceso a las cuentas de la organización.

---

## AWS KMS

**Descripción:** Servicio que crea y administra **claves criptográficas** para cifrar y descifrar datos; controla quién puede usar cada clave en los servicios de AWS y en las aplicaciones.

**Categoría:** Security & Identity

**Referencia:** [security/proteccion-datos.md](./security/proteccion-datos.md)

**Clave para el examen:** Las claves **nunca salen de AWS KMS**, se pueden deshabilitar temporalmente y permiten el cifrado de datos en reposo en servicios como S3, EBS y DynamoDB.

---

## AWS Lambda

**Descripción:** Servicio de cómputo serverless que ejecuta **funciones** en respuesta a **eventos** (S3, API Gateway, SQS, etc.), cobrando por solicitud y tiempo de ejecución, sin aprovisionar servidores.

**Categoría:** Serverless

**Referencia:** [serverless/aws-lambda.mdx](./serverless/aws-lambda.mdx)

**Clave para el examen:** Serverless por excelencia: escala automáticamente, se paga por invocación, sus permisos se asignan mediante un **rol de ejecución IAM**. Ten en cuenta el concepto de *cold start* al elegir Lambda para cargas sensibles a la latencia.

---

## AWS License Manager

**Descripción:** Servicio para **administrar licencias de software** (de proveedores como Microsoft, Oracle, SAP) y ayudar a controlar el uso de esas licencias en AWS.

**Categoría:** Governance & Monitoring

**Referencia:** [monitoreo-cumplimiento/gobernanza.md](./monitoreo-cumplimiento/gobernanza.md)

**Clave para el examen:** "Gestionar y encontrar licencias de software permitidas en la nube" → AWS License Manager.

---

## AWS Migration Evaluator

**Descripción:** Servicio que ayuda a **evaluar la infraestructura on-premises** (inventario y costos) y elaborar un plan de negocio para migrar a AWS.

**Categoría:** Migration

**Referencia:** [migracion-nube/servicios-migracion.mdx](./migracion-nube/servicios-migracion.mdx)

**Clave para el examen:** "Evaluar/analizar el entorno local antes de migrar" → AWS Migration Evaluator.

---

## AWS Migration Hub

**Descripción:** Panel central que permite **rastrear y supervisar** el avance de las migraciones de aplicaciones y bases de datos hacia AWS desde un único lugar.

**Categoría:** Migration

**Referencia:** [migracion-nube/servicios-migracion.mdx](./migracion-nube/servicios-migracion.mdx)

**Clave para el examen:** "Seguimiento y visibilidad de todas las migraciones en un solo panel" → AWS Migration Hub.

---

## AWS Network Firewall

**Descripción:** Firewall de red administrado que implementa controles avanzados de tráfico (filtrado por direcciones, protocolos y puertos) para proteger las subredes de una VPC.

**Categoría:** Networking

**Referencia:** [security/proteccion-redes-y-app.md](./security/proteccion-redes-y-app.md)

**Clave para el examen:** Protección de red en profundidad para la VPC, más allá de Security Groups y Network ACLs (nivel 3/4). AWS WAF y Shield protegen la capa de aplicación.

---

## AWS Organizations

**Descripción:** Servicio para crear y gobernar **varias cuentas AWS** desde un punto central: cuenta de gestión (management account), cuentas miembro, unidades organizativas (OUs) y políticas de control de servicios (SCP), con facturación consolidada.

**Categoría:** Governance & Monitoring

**Referencia:** [security/iam.md](./security/iam.md) · [monitoreo-cumplimiento/aws-organizations.md](./monitoreo-cumplimiento/aws-organizations.md)

**Clave para el examen:** "Organizar cuentas", "OUs", "gobernanza centralizada", "SCP" → AWS Organizations. Las SCP aplican límites de permisos a todas las cuentas de la organización.

---

## AWS Outposts

**Descripción:** Servicio que lleva **infraestructura y servicios de AWS a tus instalaciones** (racks de AWS en tu centro de datos), ofreciendo experiencia AWS en el entorno on-premises.

**Categoría:** Compute

**Referencia:** [compute/servicios-adicionales.md](./compute/servicios-adicionales.md)

**Clave para el examen:** "Ejecutar AWS en el centro de datos local" → AWS Outposts (requisitos de baja latencia o residencia de datos).

---

## AWS Pricing Calculator

**Descripción:** Herramienta que permite **estimar los costos** de los servicios de AWS antes de desplegarlos, configurando recursos para calcular el gasto mensual aproximado.

**Categoría:** Cost & Pricing

**Referencia:** [precios-soporte/precio-aws.mdx](./precios-soporte/precio-aws.mdx)

**Clave para el examen:** "Estimar el costo de una solución antes de construirla" → AWS Pricing Calculator.

---

## AWS PrivateLink

**Descripción:** Servicio que permite acceder a servicios de AWS (o servicios expuestos por otras cuentas) de forma **privada dentro de la VPC**, sin exponer el tráfico a la internet pública.

**Categoría:** Networking

**Referencia:** [redes/formas-conectar.mdx](./redes/formas-conectar.mdx)

**Clave para el examen:** "Acceso privado a un servicio desde la VPC sin atravesar internet" → AWS PrivateLink.

---

## AWS Schema Conversion Tool

**Descripción:** Herramienta que **convierte el esquema y el código** de una base de datos de origen a un motor de destino distinto, usada junto con AWS DMS en migraciones heterogéneas.

**Categoría:** Migration

**Referencia:** [data-base/base-de-datos-adicionales.md](./data-base/base-de-datos-adicionales.md)

**Clave para el examen:** "Cambiar de tecnología de base de datos" (heterogénea) → DMS + Schema Conversion Tool.

---

## AWS Secrets Manager

**Descripción:** Servicio que almacena, **rota y recupera con seguridad** credenciales de bases de datos, claves de API y otros secretos durante todo su ciclo de vida.

**Categoría:** Security & Identity

**Referencia:** [security/permiso-y-acceso-usuario.md](./security/permiso-y-acceso-usuario.md)

**Clave para el examen:** "Administrar secretos/contraseñas con rotación automática" → AWS Secrets Manager.

---

## AWS Security Hub

**Descripción:** Panel centralizado de seguridad que **agrega los hallazgos** de varios servicios (GuardDuty, Inspector, Macie, etc.) y de socios, los organiza y permite la corrección automatizada.

**Categoría:** Governance & Monitoring

**Referencia:** [security/deteccion-y-respuesta-incidentes.md](./security/deteccion-y-respuesta-incidentes.md)

**Clave para el examen:** "Un solo lugar para ver el estado de seguridad de la cuenta" → AWS Security Hub. Detecta y organiza; no sustituye a los servicios que generan los hallazgos.

---

## AWS Service Catalog

**Descripción:** Servicio que crea y administra **catálogos de servicios TI aprobados** que las organizaciones pueden desplegar de forma estandarizada y controlada.

**Categoría:** Governance & Monitoring

**Referencia:** [monitoreo-cumplimiento/gobernanza.md](./monitoreo-cumplimiento/gobernanza.md)

**Clave para el examen:** "Catálogo de productos/plantillas aprobados para que otros los despleguen" → AWS Service Catalog.

---

## AWS Shield

**Descripción:** Servicio de protección frente a ataques **DDoS**. **AWS Shield Standard** protege automáticamente y sin costo frente a los ataques más comunes; **AWS Shield Advanced** es de pago y ofrece diagnósticos y mitigación de ataques sofisticados.

**Categoría:** Security & Identity

**Referencia:** [security/proteccion-redes-y-app.md](./security/proteccion-redes-y-app.md)

**Clave para el examen:** Standard = gratuito y automático (incluido); Advanced = pago, con integración con CloudFront, Route 53 y ELB, y se combina con AWS WAF.

---

## AWS Snow Family

**Descripción:** Conjunto de **dispositivos físicos** (Snowcone, Snowball, Snowmobile) que AWS envía para transferir grandes volúmenes de datos hacia y desde AWS cuando la red no es práctica o es muy lenta.

**Categoría:** Migration

**Referencia:** [migracion-nube/servicios-migracion.mdx](./migracion-nube/servicios-migracion.mdx)

**Clave para el examen:** "Migrar datos masivos fuera de línea / con muy poca conectividad" → Snow Family. Es la alternativa física a la transferencia en línea (DataSync).

---

## AWS Storage Gateway

**Descripción:** Servicio de almacenamiento híbrido que integra entornos on-premises con la nube de AWS, con caché local para baja latencia. Incluye: **S3 File Gateway** (acceso a archivos en S3), **Volume Gateway** (volúmenes iSCSI en modo caché o almacenado) y **Tape Gateway** (cintas virtuales respaldadas en S3).

**Categoría:** Storage

**Referencia:** [almacenamiento/aws-storage-gateway.md](./almacenamiento/aws-storage-gateway.md)

**Clave para el examen:** "Ampliar el almacenamiento local a la nube con acceso de baja latencia" → Storage Gateway. El modo volumen almacenado mantiene los datos completos en local con respaldo en la nube; el modo caché mantiene los datos principales en la nube.

---

## AWS STS - Security Token Service

**Descripción:** Servicio que **emite credenciales temporales** (Access Key ID, Secret Access Key y Session Token) al asumir un rol de IAM; las credenciales caducan automáticamente (de 15 minutos a 12 horas).

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md)

**Clave para el examen:** STS permite a aplicaciones y usuarios asumir roles temporalmente en lugar de usar credenciales de larga duración, reduciendo el riesgo de filtración.

---

## AWS Support (planes de soporte)

**Descripción:** Conjunto de planes de soporte de AWS con distintos niveles: **Basic** (gratuito), **Developer**, **Business** y **Enterprise** (y Enterprise On-Ramp), que difieren en respuestas, canales y herramientas (Technical Account Manager, Trusted Advisor avanzado, etc.).

**Categoría:** Cost & Pricing

**Referencia:** [precios-soporte/soporte-aws.mdx](./precios-soporte/soporte-aws.mdx)

**Clave para el examen:** Conocer la jerarquía de planes y qué añade cada uno; la orientación de arquitectura y el soporte técnico de mayor nivel están en los planes superiores.

---

## AWS Systems Manager

**Descripción:** Suite de gestión que ofrece una **vista centralizada de los nodos** (instancias y servidores) de la cuenta, y automatiza tareas operativas como parches de seguridad, administración de usuarios y configuraciones.

**Categoría:** Governance & Monitoring

**Referencia:** [security/permiso-y-acceso-usuario.md](./security/permiso-y-acceso-usuario.md)

**Clave para el examen:** "Vista centralizada y automatización de parches/gestión de nodos" → AWS Systems Manager.

---

## AWS Transit Gateway

**Descripción:** Servicio de enrutamiento que conecta **múltiples VPCs y redes on-premises** a través de un único punto central de tránsito, simplificando la topología de red.

**Categoría:** Networking

**Referencia:** [redes/introduccion.mdx](./redes/introduccion.mdx)

**Clave para el examen:** "Conectar muchas VPCs entre sí de forma centralizada" → Transit Gateway. Para dos VPCs concretas se usa VPC Peering.

---

## AWS Trusted Advisor

**Descripción:** Servicio que analiza la cuenta y ofrece **recomendaciones en cinco categorías**: optimización de costos, seguridad, rendimiento, tolerancia a fallos y límites de servicio.

**Categoría:** Governance & Monitoring

**Referencia:** [monitoreo-cumplimiento/aws-trusted-advisor.md](./monitoreo-cumplimiento/aws-trusted-advisor.md)

**Clave para el examen:** "Revisar buenas prácticas y optimización" → Trusted Advisor. Algunos chequeos solo están disponibles en planes de soporte superiores.

---

## AWS WAF

**Descripción:** Firewall de aplicaciones web que **filtra las solicitudes HTTP/HTTPS** y bloquea patrones de ataques comunes (por IP, reglas, listas de control web) antes de que lleguen a la aplicación.

**Categoría:** Security & Identity / Networking

**Referencia:** [security/proteccion-redes-y-app.md](./security/proteccion-redes-y-app.md)

**Clave para el examen:** Protección de la **capa de aplicación** (nivel 7); AWS WAF es la respuesta para "filtrar tráfico web malicioso".

---

## AWS Well-Architected Framework

**Descripción:** Marco de referencia de AWS para diseñar y evaluar arquitecturas, organizado en **pilares**: excelencia operativa, seguridad, fiabilidad, eficiencia del rendimiento, optimización de costos y sostenibilidad.

**Categoría:** Arquitectura

**Referencia:** [arquitectura/marco-aws-well.mdx](./arquitectura/marco-aws-well.mdx)

**Clave para el examen:** Los seis pilares del Well-Architected son tema recurrente del Cloud Practitioner: opera, asegura, confía, rinde, optimiza costos y sostiene.

---

## Base de datos NoSQL

**Descripción:** Modelo de base de datos con esquemas **flexibles** (pares clave-valor, documentos) en lugar de filas y columnas rígidas; permite añadir o quitar atributos en cualquier momento y escala horizontalmente con alto rendimiento.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-nosql.mdx](./data-base/base-de-datos-nosql.mdx)

**Clave para el examen:** "Esquema flexible", "escala masiva", "alto rendimiento" → NoSQL. Su servicio principal en AWS es Amazon DynamoDB.

---

## Base de datos relacional

**Descripción:** Modelo de base de datos que almacena los datos en **tablas con filas y columnas relacionadas**, con esquema rígido, administradas y consultadas mediante SQL.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-relacionales.md](./data-base/base-de-datos-relacionales.md)

**Clave para el examen:** "Datos estructurados con relaciones y consultas SQL" → base de datos relacional; su servicio administrado en AWS es Amazon RDS (o Aurora).

---

## Caché en memoria

**Descripción:** Capa de almacenamiento de **alta velocidad en RAM** que guarda los datos de uso frecuente para acelerar las lecturas, reduciendo la carga de las bases de datos primarias.

**Categoría:** Database

**Referencia:** [data-base/base-de-datos-en-cache.md](./data-base/base-de-datos-en-cache.md)

**Clave para el examen:** Un caché es cientos o miles de veces más rápido que el disco (latencia de microsegundos). Su servicio principal es Amazon ElastiCache.

---

## Características esenciales de la nube

**Descripción:** Las cinco características fundamentales (NIST) de la computación en la nube: autoservicio bajo demanda, acceso amplio a la red, agrupación de recursos (multi-tenant), elasticidad rápida y servicio medido (pago por uso).

**Categoría:** Cloud Computing

**Referencia:** [cloud-computing/caracteristicas-cloud.md](./cloud-computing/caracteristicas-cloud.md)

**Clave para el examen:** Pregunta clásica: saber listar e identificar estas cinco características en un escenario.

---

## CI/CD - Integración y entrega continuas

**Descripción:** Práctica de automatizar el ciclo de desarrollo: integrar el código continuamente (CI), construir, probar y desplegar automáticamente (CD), con despliegues progresivos como Blue/Green o Canary.

**Categoría:** DevOps & CI/CD

**Referencia:** [devops/cicd.md](./devops/cicd.md)

**Clave para el examen:** "Automatizar integración y despliegue" → servicios de CI/CD: CodePipeline (orquesta), CodeCommit, CodeBuild y CodeDeploy.

---

## Ciclo de vida de los datos en Amazon S3

**Descripción:** Reglas (lifecycle policies) que **automatizan las transiciones** entre clases de almacenamiento y la eliminación de objetos según su antigüedad o frecuencia de acceso.

**Categoría:** Storage

**Referencia:** [almacenamiento/almacenamiento-objetos.mdx](./almacenamiento/almacenamiento-objetos.mdx)

**Clave para el examen:** Ejemplo típico del examen: transición a Standard-IA tras 30 días, a Glacier tras 60 días y eliminación tras 365 días; gestiona las acciones de transición y de vencimiento.

---

## Cifrado de datos

**Descripción:** Mecanismo con "cerradura y llave" que convierte los datos en caracteres aleatorios mediante una **clave de cifrado**, y los restaura con una clave de descifrado para que solo los autorizados accedan a ellos.

**Categoría:** Security & Identity

**Referencia:** [security/proteccion-datos.md](./security/proteccion-datos.md)

**Clave para el examen:** El cifrado se aplica de dos formas sobre los datos: en reposo y en tránsito; el control de las claves se centraliza con AWS KMS.

---

## Cifrado de datos en reposo

**Descripción:** Cifrado de los datos **almacenados** (inactivos), por ejemplo los objetos en un bucket de S3, los volúmenes EBS o las tablas de DynamoDB.

**Categoría:** Security & Identity

**Referencia:** [security/proteccion-datos.md](./security/proteccion-datos.md)

**Clave para el examen:** S3 cifra los objetos nuevos por defecto y DynamoDB cifra en reposo vía KMS automáticamente; en EBS los volúmenes e instantáneas se pueden cifrar.

---

## Cifrado de datos en tránsito

**Descripción:** Cifrado de los datos **mientras se mueven** de un lugar a otro (por ejemplo, de la base de datos a la aplicación), protegidos por **certificados SSL/TLS**.

**Categoría:** Security & Identity

**Referencia:** [security/proteccion-datos.md](./security/proteccion-datos.md)

**Clave para el examen:** SSL/TLS es el mecanismo para conexiones cifradas; los certificados se administran con AWS Certificate Manager.

---

## Clases de almacenamiento de Amazon S3

**Descripción:** Niveles de almacenamiento de S3 según uso y costo: S3 Standard, S3 Express One Zone, S3 Standard-IA, S3 One Zone-IA, S3 Glacier Instant Retrieval, S3 Glacier Flexible Retrieval, S3 Glacier Deep Archive, S3 Intelligent-Tiering y S3 Outposts.

**Categoría:** Storage

**Referencia:** [almacenamiento/almacenamiento-objetos.mdx](./almacenamiento/almacenamiento-objetos.mdx)

**Clave para el examen:** Elegir la clase según la frecuencia de acceso y el costo. Datos fríos que se archivan → Glacier; datos con solo una AZ suficiente → One Zone; datos con acceso cambiante → Intelligent-Tiering. S3 Glacier Deep Archive es la de menor costo.

---

## Contenedores y orquestación

**Descripción:** Los **contenedores** empaquetan una aplicación con sus dependencias (virtualizando el sistema operativo) y la **orquestación** gestiona su despliegue, escalado y ciclo de vida en clústeres.

**Categoría:** DevOps & CI/CD / Compute

**Referencia:** [serverless/contenedores-y-orquestacion.mdx](./serverless/contenedores-y-orquestacion.mdx)

**Clave para el examen:** En AWS: **ECS** (orquestación nativa), **EKS** (Kubernetes administrado), **Fargate** (serverless) y **ECR** (registro de imágenes).

---

## Elastic IP

**Descripción:** Dirección IP pública **estática** asociada a una cuenta de AWS que se puede asignar y reasignar a instancias, manteniendo la misma IP aunque la instancia cambie.

**Categoría:** Networking

**Referencia:** [compute/amazon-ec2.mdx](./compute/amazon-ec2.mdx)

**Clave para el examen:** "Necesitar una IP pública fija que no cambie" → Elastic IP. Se cobra mientras no esté asociada a una instancia en uso.

---

## Elastic Load Balancing

**Descripción:** Servicio que **distribuye automáticamente el tráfico entrante** entre varias instancias y recursos, gestionando el tráfico antes de llegar a las aplicaciones. Incluye Application Load Balancer (HTTP/HTTPS, capa 7), Network Load Balancer (TCP/UDP, capa 4), Gateway Load Balancer (appliances) y Classic Load Balancer (legacy).

**Categoría:** Networking

**Referencia:** [compute/direccion-trafico.mdx](./compute/direccion-trafico.mdx)

**Clave para el examen:** ELB reparte la carga y trabaja con EC2 Auto Scaling para alta disponibilidad; actúa a nivel regional y mitiga sobrecargas (incluso algún tipo de ataques).

---

## Escalabilidad vertical y horizontal

**Descripción:** Escalabilidad **vertical** (scale up/down): aumentar o reducir los recursos de una misma máquina (CPU/RAM), con el límite del hardware. Escalabilidad **horizontal** (scale out/in): añadir o quitar más instancias; es la base del modelo de nube.

**Categoría:** Cloud Computing

**Referencia:** [cloud-computing/04-escalabilidad.md](./cloud-computing/04-escalabilidad.md)

**Clave para el examen:** Pregunta clásica: distinguir "máquina más grande" (vertical) de "más máquinas" (horizontal). La nube destaca por la escalabilidad horizontal.

---

## Escalabilidad y elasticidad

**Descripción:** La **escalabilidad** es la capacidad de agregar recursos según crece la demanda; la **elasticidad** es la capacidad de ajustar la capacidad automáticamente, subiendo y bajando con el uso.

**Categoría:** Compute

**Referencia:** [compute/escalado-amazon-ec2.mdx](./compute/escalado-amazon-ec2.mdx)

**Clave para el examen:** Amazon EC2 Auto Scaling proporciona ambas: no solo crece, sino que también se reduce cuando baja la demanda (elasticidad).

---

## Estrategias de recuperación ante desastres

**Descripción:** Conjunto de planes para restaurar la operación ante un desastre, desde el respaldo y restauración hasta la réplica activa en varias regiones (por ejemplo, Backup and Restore, Pilot Light, etc.).

**Categoría:** Global Infrastructure

**Referencia:** [infraestructura-global/implementacion-recursos.mdx](./infraestructura-global/implementacion-recursos.mdx)

**Clave para el examen:** La elección de estrategia depende del **RTO (tiempo para recuperar)** y el **RPO (datos que se pueden perder)** tolerados; menos tiempo de recuperación suele implicar más costo.

---

## Estrategias de migración (7R)

**Descripción:** Conjunto de estrategias para migrar a la nube: Retire (retirar), Retain (conservar), Rehost (relocalizar la máquina), Relocate, Repurchase (recomprar/SaaS), Replatform (cambiar la plataforma) y Refactor (reescribir).

**Categoría:** Migration

**Referencia:** [migracion-nube/estrategias-migracion.md](./migracion-nube/estrategias-migracion.md)

**Clave para el examen:** Para Cloud Practitioner es importante reconocer los términos principales: **Rehost** (lift-and-shift), **Replatform** (cambiar sin reescribir) y **Refactor** (reescribir la aplicación).

---

## Etiquetas (tags)

**Descripción:** Metadatos (pares clave-valor) que se asignan a los recursos de AWS para **organizarlos, filtrarlos y atribuirles costos**, facilitando la optimización de costos según áreas, proyectos o fines.

**Categoría:** Cost & Pricing

**Referencia:** [precios-soporte/optmizacion-costos.md](./precios-soporte/optmizacion-costos.md)

**Clave para el examen:** "Identificar costos por proyecto/equipo y organizar recursos" → etiquetas, combinadas con herramientas como Cost Explorer y Budgets.

---

## Federación de identidades

**Descripción:** Sistema que permite a los usuarios acceder a múltiples aplicaciones, servicios o dominios con un **único conjunto de credenciales**, reutilizando una identidad ya existente en otro proveedor (SSO, login social, SAML, OIDC).

**Categoría:** Security & Identity

**Referencia:** [security/permiso-y-acceso-usuario.md](./security/permiso-y-acceso-usuario.md) · [security/cognito.md](./security/cognito.md)

**Clave para el examen:** AWS IAM Identity Center y Amazon Cognito son las piezas clave de identidad federada en AWS (empleados y usuarios finales, respectivamente).

---

## Grupos de IAM

**Descripción:** Conjunto de usuarios de IAM que agrupa permisos: al adjuntar una política al grupo, todos los usuarios del grupo la heredan. Los grupos **no pueden contener otros grupos**.

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md)

**Clave para el examen:** Buena práctica: asignar permisos a **grupos**, no a usuarios individuales. Pregunta trampa: un grupo IAM **no** puede contener otros grupos.

---

## Grupos de seguridad

**Descripción:** Firewall virtual a **nivel de instancia/recursos** que define reglas de entrada y salida. Son **stateful** y **solo permiten** tráfico (reglas *allow*); el tráfico no permitido se deniega implícitamente.

**Categoría:** Networking

**Referencia:** [redes/seguridad-control-acceso.md](./redes/seguridad-control-acceso.md) · [redes/componentes-redes.mdx](./redes/componentes-redes.mdx)

**Clave para el examen:** **Security Groups = stateful, permiten (allow) por defecto nada y se configuran a nivel de instancia**; **Network ACLs = stateless, nivel de subred, y admiten allow/deny**. No confundirlos.

---

## IaaS, PaaS y SaaS

**Descripción:** Modelos de servicio en la nube: **IaaS** (infraestructura: servidores, redes, almacenamiento; máximo control), **PaaS** (plataforma: gestionas la app y AWS gestiona la plataforma) y **SaaS** (software listo para usar).

**Categoría:** Cloud Computing

**Referencia:** [cloud-computing/modelos-servicio.md](./cloud-computing/modelos-servicio.md)

**Clave para el examen:** Identificar en un escenario "quién gestiona qué": en IaaS gestionas SO y superiores; en PaaS solo la aplicación y los datos; en SaaS solo los datos del cliente. AWS Elastic Beanstalk es un ejemplo de PaaS.

---

## Instance Store

**Descripción:** Almacenamiento de bloques **temporal** conectado físicamente a la instancia EC2. **No persiste** los datos si la instancia se detiene o termina (ni ante fallos de hardware); aporta latencia muy baja y no tiene costo adicional.

**Categoría:** Storage

**Referencia:** [almacenamiento/almacenamiento-bloques.mdx](./almacenamiento/almacenamiento-bloques.mdx)

**Clave para el examen:** "Datos temporales como cachés o búferes" → instance store; "datos persistentes" → EBS. Es una pregunta clásica del examen.

---

## Inteligencia artificial generativa

**Descripción:** Rama de la IA capaz de **generar contenido nuevo** (texto, imágenes, código) a partir de **modelos fundamentales (FM)** y modelos de lenguaje de gran tamaño (LLM), entrenados con *deep learning*.

**Categoría:** AI/ML & Analytics

**Referencia:** [ia-ml-y-analisis-datos/ia-generativa-aws.md](./ia-ml-y-analisis-datos/ia-generativa-aws.md)

**Clave para el examen:** Crear aplicaciones con modelos fundamentales/LLM en AWS → Amazon Bedrock.

---

## Internet Gateway

**Descripción:** Componente de red de la VPC que permite la **comunicación entre las subredes (públicas) y la red de internet**, tanto de entrada como de salida.

**Categoría:** Networking

**Referencia:** [redes/componentes-redes.mdx](./redes/componentes-redes.mdx)

**Clave para el examen:** Una subred "pública" es la que tiene una tabla de rutas que apunta a un Internet Gateway. Las instancias con IP pública solo reciben tráfico de entrada a través de él.

---

## Latencia

**Descripción:** Tiempo que tarda un paquete en viajar y volver entre dos puntos (RTT, medido en milisegundos). Baja latencia significa menor distancia y menos saltos de red.

**Categoría:** Cloud Computing / Networking

**Referencia:** [cloud-computing/latencia.md](./cloud-computing/latencia.md)

**Clave para el examen:** Latencia ≠ ancho de banda. Reducir la latencia del usuario → elegir la **región más cercana** y usar CDN (CloudFront) / red global (Global Accelerator).

---

## Machine learning en AWS

**Descripción:** Pila de servicios de IA/ML de AWS que abarca desde servicios de IA listos para usar (capacidades preentrenadas), pasando por Amazon SageMaker para construir y entrenar modelos propios, hasta la infraestructura y los chips para entrenamiento.

**Categoría:** AI/ML & Analytics

**Referencia:** [ia-ml-y-analisis-datos/ia-ml-aws.mdx](./ia-ml-y-analisis-datos/ia-ml-aws.mdx)

**Clave para el examen:** "Servicios de IA automática/capacidades preentrenadas" corresponden a los servicios de IA de AWS; "entrenar modelos propios" → Amazon SageMaker.

---

## MFA - Autenticación multifactor

**Descripción:** Método de autenticación que requiere al menos **dos factores de verificación** para iniciar sesión (por ejemplo, contraseña + código de la aplicación o dispositivo). En AWS, el usuario raíz debe tenerla activada.

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md)

**Clave para el examen:** La MFA es un **segundo factor que complementa la contraseña, no la sustituye**. El acceso con MFA se recomienda (o exige) para el usuario raíz y los usuarios con privilegios.

---

## Microservicios

**Descripción:** Arquitectura en la que una aplicación se divide en servicios pequeños e independientes que se comunican entre sí mediante mensajes y colas, en contraste con la arquitectura **monolítica** (una sola aplicación que lo hace todo).

**Categoría:** Application Integration

**Referencia:** [compute/mensajeria-colas.mdx](./compute/mensajeria-colas.mdx)

**Clave para el examen:** "Descomposición de aplicaciones en componentes desacoplados" → microservicios; para comunicarlos se usan SQS (colas) y SNS (notificaciones).

---

## Modelo de responsabilidad compartida

**Descripción:** Modelo que divide la seguridad del entorno en dos partes: AWS es responsable de la **seguridad DE la nube** (hardware, redes, instalaciones, infraestructura global y de los servicios administrados), y el cliente de la **seguridad EN la nube** (datos, configuraciones, control de accesos e IAM).

**Categoría:** Security & Identity

**Referencia:** [responsabilidad-compartida.md](./responsabilidad-compartida.md) · [cloud-computing/intro-responsabilidad-compartida.mdx](./cloud-computing/intro-responsabilidad-compartida.mdx)

**Clave para el examen:** Pregunta clásica: quien opera y decide en el entorno (cliente) es responsable de lo que ocurre **dentro** de los servicios; AWS responde por la infraestructura física y de los servicios gestionados.

---

## Modelos de despliegue en la nube

**Descripción:** Formas de desplegar la computación en la nube: **nube pública** (recursos de un proveedor tercero como AWS), **nube privada** (uso exclusivo de una organización), **nube híbrida** (pública + privada conectadas) y **nube comunitaria** (compartida por varias organizaciones).

**Categoría:** Cloud Computing

**Referencia:** [cloud-computing/modelos-despliegue-cloud.md](./cloud-computing/modelos-despliegue-cloud.md)

**Clave para el examen:** "Combinar on-premises con nube pública" → híbrida; "una sola organización" → privada; AWS es el ejemplo por excelencia de nube pública (con modelos híbridos).

---

## NAT Gateway

**Descripción:** Componente de red que permite a las instancias de **subredes privadas** iniciar conexiones **salientes a internet** (por ejemplo, para descargar parches) sin permitir tráfico entrante desde internet.

**Categoría:** Networking

**Referencia:** [redes/componentes-redes.mdx](./redes/componentes-redes.mdx)

**Clave para el examen:** "Subred privada necesita salir a internet sin recibir conexiones entrantes" → NAT Gateway.

---

## Network ACLs

**Descripción:** Listas de control de acceso a **nivel de subred** que filtran el tráfico de entrada y salida. Son **stateless** (evalúan cada paquete sin estado previo) y permiten reglas de **allow y deny**.

**Categoría:** Networking

**Referencia:** [redes/componentes-redes.mdx](./redes/componentes-redes.mdx)

**Clave para el examen:** Opuesto a los Security Groups (stateful, nivel de instancia, solo allow). Pregunta trampa clásica del examen.

---

## Opciones de compra de Amazon EC2

**Descripción:** Modelos de pago de EC2: **On-Demand** (pago por uso, flexible), **Reserved Instances** (descuento por compromiso, Standard/Convertible/Scheduled), **Savings Plans** (compromiso de uso), **Spot** (hasta 90 % de descuento, interrumpibles), **Dedicated Hosts / Dedicated Instances** y **Capacity Reservations**.

**Categoría:** Cost & Pricing

**Referencia:** [compute/amazon-ec2.mdx](./compute/amazon-ec2.mdx)

**Clave para el examen:** Cargas estables → Reserved/Savings Plans; cargas tolerantes a interrupciones → Spot; cargas impredecibles de corta duración → On-Demand.

---

## Pago por uso y Savings Plans

**Descripción:** En AWS se paga **solo por lo que se consume** (bajo demanda, por segundos/horas y sin contratos). Los **Savings Plans** ofrecen un descuento a cambio de un compromiso de uso (por hora) durante 1 o 3 años.

**Categoría:** Cost & Pricing

**Referencia:** [precios-soporte/precio-aws.mdx](./precios-soporte/precio-aws.mdx)

**Clave para el examen:** El modelo de pago por uso convierte el gasto fijo (CAPEX) en variable (OPEX); los Savings Plans y las Reserved Instances bajan el precio a cambio de compromiso.

---

## Políticas de IAM

**Descripción:** Documentos **JSON** que definen permisos (Effect: Allow/Deny, Action, Resource, Condition) para conceder o denegar el acceso a los recursos de AWS. Se aplican a usuarios, grupos, roles (identity-based) o a recursos (resource-based).

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md)

**Clave para el examen:** Evaluación de permisos: por defecto todo está **denegado**; se necesita un **Allow** explícito; un **Deny explícito siempre gana** sobre cualquier Allow.

---

## Principio de mínimo privilegio

**Descripción:** Principio de seguridad que dicta que las personas y los sistemas deben tener **exactamente los permisos que necesitan y nada más**.

**Categoría:** Security & Identity

**Referencia:** [security/permiso-y-acceso-usuario.md](./security/permiso-y-acceso-usuario.md)

**Clave para el examen:** Es la respuesta correcta casi siempre que se comparan permisos amplios (AdministratorAccess) frente a permisos específicos: gana el de **permisos mínimos** ajustados a la tarea.

---

## Regiones de AWS

**Descripción:** Ubicaciones geográficas donde AWS opera centros de datos, cada una con al menos tres zonas de disponibilidad. Al elegir una región se decide la **latencia**, el **cumplimiento** y la **disponibilidad** de los recursos.

**Categoría:** Global Infrastructure

**Referencia:** [infraestructura-global/introduccion.mdx](./infraestructura-global/introduccion.mdx)

**Clave para el examen:** Elegir región cercana a los usuarios reduce latencia; algunas regiones existen por requisitos de residencia o cumplimiento de datos.

---

## Roles de IAM

**Descripción:** Identidad que se **asume temporalmente** para obtener permisos (con credenciales de STS que caducan). Al asumir un rol se abandonan los permisos anteriores y se reciben los del nuevo rol.

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md)

**Clave para el examen:** "Una aplicación en EC2/Lambda necesita acceder a otros servicios AWS sin guardar credenciales" → asignar un **rol de IAM**. Un rol lo pueden asumir múltiples principales (no pertenece a un único usuario).

---

## Serverless

**Descripción:** Modelo de computación en el que **no se gestionan servidores**: se sube el código (o se usan servicios) y el proveedor se encarga de ejecutar, escalar, mantener y cobrar por uso.

**Categoría:** Serverless

**Referencia:** [serverless/introduccion.mdx](./serverless/introduccion.mdx) · [cloud-computing/serverles.md](./cloud-computing/serverles.md)

**Clave para el examen:** FaaS (funciones Lambda), BaaS (servicios backend como Cognito), y servicios serverless como DynamoDB, S3, SQS/SNS y API Gateway; se paga por invocación.

---

## Subredes

**Descripción:** Segmentos de la VPC dentro de una zona de disponibilidad donde se lanzan los recursos. Las **subredes públicas** tienen salida a internet (vía Internet Gateway) y las **privadas** no.

**Categoría:** Networking

**Referencia:** [redes/componentes-redes.mdx](./redes/componentes-redes.mdx)

**Clave para el examen:** Las subredes se asocian a una única AZ y a una tabla de rutas que decide su conectividad (pública vs privada).

---

## Tablas de rutas

**Descripción:** Componente de la VPC que define **hacia dónde enviar el tráfico** de cada subred (por ejemplo, hacia el Internet Gateway, la NAT Gateway o las redes privadas). Cada subred usa una tabla de rutas.

**Categoría:** Networking

**Referencia:** [redes/componentes-redes.mdx](./redes/componentes-redes.mdx)

**Clave para el examen:** Subred pública = tabla de rutas con destino al Internet Gateway; subred privada = ruta hacia NAT Gateway para salida segura.

---

## Tipos de instancia de Amazon EC2

**Descripción:** Familias de instancias EC2 optimizadas para distintos usos: **propósito general**, **cómputo optimizado** (CPU), **memoria optimizada**, **almacenamiento optimizado**, **aceleración** (GPU/FPGA) y **HPC**.

**Categoría:** Compute

**Referencia:** [compute/amazon-ec2.mdx](./compute/amazon-ec2.mdx)

**Clave para el examen:** Asociar el tipo de carga de trabajo al tipo de instancia: procesamiento intensivo → cómputo; bases de datos/aplicaciones con mucha RAM → memoria; ML/gPU → acelerado; mucho acceso a disco → almacenamiento.

---

## Ubicaciones periféricas

**Descripción:** Puntos de presencia (PoPs / *edge locations*) de AWS distribuidos por el mundo donde se coloca contenido en caché (CloudFront) y se da servicio de red, para acercar los recursos a los usuarios y reducir la latencia.

**Categoría:** Global Infrastructure

**Referencia:** [redes/redes-globales.mdx](./redes/redes-globales.mdx) · [cloud-computing/intro-infraestructura-global.md](./cloud-computing/intro-infraestructura-global.md)

**Clave para el examen:** Las ubicaciones periféricas **no** son regiones ni AZs: son puntos de entrega de contenido y de red a nivel mundial (CloudFront, Global Accelerator, Route 53).

---

## Usuarios de IAM

**Descripción:** Identidad de IAM con **credenciales permanentes** que representa a una persona o aplicación que accede de manera recurrente a la cuenta; cada usuario tiene el suyo propio (no se comparten).

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md)

**Clave para el examen:** Un usuario IAM por persona; los permisos se asignan idealmente vía grupos. Para aplicaciones dentro de AWS se recomienda usar **roles** en lugar de usuarios con claves de acceso.

---

## Usuario raíz de la cuenta AWS

**Descripción:** Identidad que da el acceso absoluto e irrevocable a la cuenta; no puede limitarse con políticas. Debe protegerse con MFA y **no usarse para tareas diarias**; algunas acciones solo las puede realizar el root (cerrar la cuenta, cambiar el plan de soporte, etc.).

**Categoría:** Security & Identity

**Referencia:** [security/iam.md](./security/iam.md)

**Clave para el examen:** El usuario raíz **no** puede tener permisos limitados por políticas (trampa común); se protege con MFA y se crean identidades IAM para el trabajo diario.

---

## Ventajas de la nube de AWS

**Descripción:** Las seis ventajas de adoptar la nube de AWS: cambiar gasto fijo por variable, obtener economías de escala, eliminar la capacidad anticipada, aumentar la velocidad y agilidad, no gastar en centros de datos y tener alcance global en minutos.

**Categoría:** Cloud Computing

**Referencia:** [cloud-computing/introduccion.mdx](./cloud-computing/introduccion.mdx)

**Clave para el examen:** Las "seis ventajas" de la nube son un tema clásico: saber identificarlas cuando se pregunta por el valor económico y operativo de migrar a AWS.

---

## Virtualización e hipervisores

**Descripción:** La virtualización permite ejecutar **múltiples máquinas virtuales (VMs) en un mismo host físico** mediante un hipervisor (Type 1 "bare-metal" o Type 2 sobre un sistema operativo). Los contenedores, en cambio, virtualizan el sistema operativo en lugar del hardware.

**Categoría:** Compute

**Referencia:** [cloud-computing/virtualizacion.md](./cloud-computing/virtualizacion.md)

**Clave para el examen:** La base técnica de la nube: EC2 entrega VMs sobre la infraestructura virtualizada de AWS. Recuerda la diferencia VM (virtualiza hardware) vs contenedor (virtualiza SO).

---

## VPC Peering

**Descripción:** Conexión de red privada **entre dos VPCs** (de la misma u otras cuentas) que permite comunicarlas directamente sin pasar por internet ni por un punto central.

**Categoría:** Networking

**Referencia:** [redes/introduccion.mdx](./redes/introduccion.mdx)

**Clave para el examen:** "Conectar dos VPCs entre sí" → VPC Peering. Para muchas VPCs, el patrón más adecuado es AWS Transit Gateway.

---

## Zonas de disponibilidad

**Descripción:** Centros de datos **aislados** (con alimentación y red redundantes) dentro de una región. El fallo de una AZ no afecta a las demás, por lo que desplegar en varias AZ da alta disponibilidad y resiliencia.

**Categoría:** Global Infrastructure

**Referencia:** [infraestructura-global/introduccion.mdx](./infraestructura-global/introduccion.mdx)

**Clave para el examen:** "Multi-AZ" = alta disponibilidad. Un recurso de una sola AZ (como un volumen EBS o una subred) no tolera el fallo de esa AZ; las regiones tienen al menos tres AZs.

---

> **Nota de alcance:** este glosario se construyó exclusivamente a partir del contenido de la carpeta `docs/guide/aws-fundamentals`. Si un servicio no aparece aquí, significa que no se trata en los temas de esta guía y no es objetivo directo del curso del Cloud Practitioner en este material.