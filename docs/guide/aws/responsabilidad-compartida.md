# Modelo de Responsabilidad Compartida de AWS

El **Modelo de Responsabilidad Compartida** (Shared Responsibility Model) es un principio fundamental en el cloud computing que define claramente qué aspectos de la seguridad y la gestión operativa están a cargo del proveedor de servicios en la nube y cuáles son responsabilidad exclusiva del cliente (la organización o el usuario que utiliza el servicio).

En otras palabras:

>El proveedor protege la infraestructura de la nube, mientras que el cliente protege todo aquello que coloca dentro de ella.

![responsabilidad compartida](/aws/responsabilidad-compartida-intro.jpg)

## 1. ¿Qué es el Modelo de Responsabilidad Compartida?

El **Modelo de Responsabilidad Compartida** (*Shared Responsibility Model*) es un marco fundamental que define de forma explícita qué aspectos de la seguridad, la operación y el cumplimiento normativo son responsabilidad de AWS como proveedor de servicios en la nube, y cuáles corresponden al cliente que utiliza dichos servicios.

:::info No se trata de un simple acuerdo verbal
Es un modelo operativo que determina quién protege qué componente, quién administra qué capa del sistema y quién responde ante un incidente de seguridad. Cada parte tiene obligaciones claras y definidas.
:::

Se divide en dos grandes responsabilidades:

- **Seguridad de la nube** (Security of the Cloud) → responsabilidad del proveedor.
- **Seguridad en la nube** (Security in the Cloud) → responsabilidad del cliente.

### 1.1 ¿Por qué existe?

Antes de la nube, una empresa era responsable de **absolutamente todo**: contratar guardias para el centro de datos, comprar servidores, instalar sistemas de refrigeración, actualizar el sistema operativo, parchear la aplicación y proteger los datos. La carga completa recaía en una sola organización.

Con la llegada de la nube, esa carga se **divide**. AWS asume la responsabilidad de la infraestructura física y la plataforma subyacente, mientras que el cliente conserva el control sobre sus datos, aplicaciones y configuraciones de seguridad. Sin un modelo claro, surgirían problemas graves:

- **Ambigüedad**: nadie sabría quién debe responder ante una brecha de seguridad.
- **Riesgo**: si ambos asumen que el otro se encarga, ninguno actúa.
- **Incumplimiento normativo**: los auditores necesitan saber exactamente quién controla cada componente.

### 1.2 ¿Qué problema intenta resolver?

El modelo resuelve el problema de la **incertidumbre de responsabilidades** en un entorno donde la infraestructura es compartida. Establece límites claros para que:

1. AWS se enfoque en lo que mejor sabe hacer: construir y mantener infraestructura global de clase mundial.
2. El cliente se centre en su negocio: desarrollar aplicaciones, proteger sus datos y configurar sus servicios correctamente.

### 1.3 ¿Qué significa exactamente "responsabilidad compartida"?

**Responsabilidad compartida no significa responsabilidad igualitaria.** No es un 50/50. La distribución varía según el servicio AWS utilizado:

- En **Amazon EC2** (máquinas virtuales), el cliente tiene muchas responsabilidades.
- En **AWS Lambda** (serverless), AWS asume la mayoría de las capas de infraestructura.
- En **Amazon S3** (almacenamiento de objetos), hay una mezcla específica de responsabilidades.

La palabra clave es **"compartida"**, no **"dividida equitativamente"**.

:::tip Analogía de la vida real: el apartamento
Imagina que alquilas un apartamento en un edificio residencial:

![responsabilidad compartida](/aws/responsabilidad-compartida.jpg)

| Aspecto | Responsable |
|---|---|
| Estructura del edificio | Propietario/Administración |
| Cerraduras de las puertas principales | Propietario/Administración |
| Energía eléctrica del edificio | Empresa de servicios públicos |
| Seguridad del edificio (cámaras, portero) | Propietario/Administración |
| **Cerradura de tu puerta principal** | **Tú** |
| **Lo que guardas dentro del apartamento** | **Tú** |
| **Quién tiene llave de tu apartamento** | **Tú decides** |
| **Si instalas una alarma adicional** | **Tú decides** |
| **Si contratas un seguro para tus pertenencias** | **Tú decides** |

El edificio te protege de la lluvia, del frío y de intrusos en las áreas comunes. Pero si dejas la puerta abierta y te roban, la responsabilidad es tuya. Si compartes la llave con alguien que no debía tenerla, es tu responsabilidad.
:::

AWS es como la administración del edificio: mantiene toda la infraestructura funcionando y segura. Tú eres el inquilino: decides qué guardar, quién entra y cómo proteger lo que es tuyo.


## 2. Conceptos Fundamentales

### 2.1 ¿Qué significa "Seguridad DE la nube"?

Se refiere a todo lo que AWS protege como **infraestructura subyacente**. Es la capa que el cliente nunca toca ni ve directamente. AWS garantiza que la plataforma sobre la que se ejecutan los servicios sea segura, disponible y resiliente.

Las responsabilidades de AWS incluyen:

- **Seguridad física**: Protección de los centros de datos mediante monitoreo las 24 horas, los 7 días de la semana, controles de acceso biométricos y salvaguardas ambientales estrictas.
- **Infraestructura global**: Mantenimiento y seguridad del hardware, las redes y los sistemas subyacentes que alimentan los servicios de AWS.
- **Servicios gestionados**: AWS garantiza aspectos como la durabilidad de los objetos en Amazon S3 y la aplicación de parches en el software subyacente para servicios como Amazon RDS.
- **Certificaciones**: Obtención y mantenimiento de certificaciones de cumplimiento de seguridad de la industria, tales como ISO, SOC, PCI y HIPAA, para asegurar que la plataforma cumple con los estándares globales.

**Ejemplos concretos de "seguridad DE la nube":**

- AWS mantiene centros de datos con acceso biométrico, guardias 24/7, cámaras de vigilancia y sistemas de detección de incendios. El cliente no necesita preocuparse por que un intruso fisicamente acceda a un servidor.
- AWS reemplaza hardware defectuoso (discos duros, memorias, procesadores) sin que el cliente siquiera lo note. Si un disco falla, AWS lo cambia automáticamente.
- AWS administra el hipervisor (el software que crea máquinas virtuales) y lo mantiene parcheado. El cliente ejecuta su máquina virtual sobre esta capa sin necesidad de administrarla.
- AWS protege la red física que conecta los servidores dentro de un data center y entre data centers. El cliente usa esa red, pero no la administra.
- AWS gestiona la infraestructura de energía eléctrica (generadores, UPS, conexiones a la red eléctrica pública) para garantizar que los servidores nunca se apaguen.

#### 2.1.1 Responsabilidades de AWS

| Componente | Responsable |
|---|---|
| Centros de datos | AWS |
| Hardware físico | AWS |
| Seguridad física | AWS |
| Red física | AWS |
| Energía y refrigeración | AWS |
| Hipervisor / Virtualización | AWS |
| Infraestructura global | AWS |
| Mantenimiento de hardware | AWS |
| Reparación de componentes | AWS |

> **Clave para el examen:** Cualquier pregunta que mencione "infraestructura física", "data center", "hardware", "energía", "refrigeración" o "seguridad física" se refiere a responsabilidad de **AWS**, nunca del cliente.

### 2.2 ¿Qué significa "Seguridad EN la nube"?

Se refiere a todo lo que el cliente configura, administra y protege **dentro** de los servicios AWS que utiliza. AWS pone la plataforma a disposición, pero el cliente es quien decide cómo usarla.

El cliente es responsable de todo aquello que coloca dentro de la nube y de cómo configura los servicios AWS que utiliza. Estas responsabilidades varían según el servicio, pero hay elementos que siempre o casi siempre son del cliente.

Sus principales responsabilidades incluyen:

- **Gestión de datos**: Asegurarse de que los datos almacenados y las aplicaciones desplegadas estén configurados de forma segura.
- **Gestión de identidades (IAM)**: Administrar usuarios, grupos y políticas para garantizar que solo las personas autorizadas tengan acceso a los recursos.
- **Configuración de red**: Controlar la configuración de VPC, grupos de seguridad y Network ACLs para evitar exposiciones no deseadas a internet.
- **Cifrado**: Aunque AWS proporciona las herramientas, el cliente es responsable de cifrar la información sensible y administrar sus propias claves de cifrado.

**Ejemplos concretos de "seguridad EN la nube":**

- El cliente decide qué datos sube a Amazon S3 y si los cifra o no. AWS almacena los datos de forma duradera, pero no controla si están encriptados.
- El cliente configura los usuarios de AWS IAM, les asigna permisos y decide quién puede acceder a qué recursos. AWS ejecuta las políticas que el cliente define, pero no decide quién tiene acceso.
- El cliente configura los Security Groups y las Network ACLs que actúan como firewalls virtuales para sus instancias EC2. AWS provee la funcionalidad, pero el cliente define las reglas.
- El cliente es responsable de parchear el sistema operativo de su instancia EC2 (Windows o Linux). AWS no actualiza el SO de una instancia que el cliente controla.
- El cliente decide si su bucket de S3 es público o privado. Si lo hace público por error y se exponen datos, la responsabilidad es del cliente.

> **Recuerda:** AWS te da la casa construida y segura. Tú decides quién entra, qué guardas adentro y cómo lo proteges.

#### 2.2.1 Responsabilidad del Cliente

| Componente | Responsabilidad del Cliente |
|------------|---------------------------|
| Datos y cifrado | ✅ Completa |
| Gestión de identidades (IAM) | ✅ Completa |
| Configuración de red (SGs, NACLs) | ✅ Completa |
| Parches del SO (si usas EC2) | ✅ Completa |
| Firewall de aplicaciones | ✅ Completa |
| Certificados SSL/TLS | ✅ Completa |
| Selección de servicios | ✅ Completa |
| Compliance regulatorio | ✅ Completa |

:::info Para recordar
**AWS** es responsable de la **seguridad DE la nube (Security of the Cloud).** El **cliente** es responsable de la **seguridad EN la nube (Security in the Cloud).**
:::

> **Importante:** En servicios administrados como **AWS Lambda**, **Amazon RDS** o **Amazon DynamoDB**, AWS administra el sistema operativo. La responsabilidad del SO **solo recae en el cliente** cuando utiliza servicios de tipo IaaS como EC2.

### 2.3 Responsabilidades Compartidas 

Son aquellas áreas de la seguridad donde tanto AWS como el cliente deben colaborar, ya que ninguna de las partes es responsable de la totalidad del proceso.

- **Parcheo del sistema operativo**: El cliente es responsable de actualizar el sistema operativo en instancias como EC2, mientras que en servicios gestionados como RDS, AWS se encarga de los parches.
- **Seguridad de las aplicaciones**: AWS proporciona la infraestructura segura, pero el cliente es responsable de construir y configurar sus aplicaciones de manera segura.
- **Registro y monitoreo**: Aunque AWS provee herramientas como CloudTrail, CloudWatch y GuardDuty, es deber del cliente configurarlas y supervisar los registros de su entorno.
- **Copia de seguridad y recuperación**: AWS garantiza la durabilidad del almacenamiento, pero el cliente debe diseñar y ejecutar sus propias estrategias de respaldo y planes de recuperación ante desastres.

No todas las responsabilidades del cliente son iguales para cada servicio:

| Servicio            | Modelo                         | AWS administra principalmente                                                             | Cliente administra principalmente                                                              | Nivel de responsabilidad del cliente |
| ------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Amazon EC2**      | IaaS                           | Hardware físico, red física, hipervisor y disponibilidad de la infraestructura            | Sistema operativo, parches, software, configuración de red, aplicación, datos, IAM y cifrado   |  **Alto**                          |
| **Amazon S3**       | Almacenamiento administrado    | Infraestructura de almacenamiento, durabilidad, replicación y disponibilidad del servicio | Datos, permisos, políticas del bucket, cifrado, acceso público/privado, versionado y lifecycle |  **Medio**                         |
| **Amazon RDS**      | Base de datos administrada     | Hardware, SO subyacente, motor de BD, parches, backups y Multi-AZ                         | Datos, usuarios, permisos, parámetros de BD, red, cifrado y monitoreo                          |  **Medio-bajo**                    |
| **Amazon DynamoDB** | Base de datos NoSQL serverless | Infraestructura, SO, motor de BD, parches, replicación, escalado y disponibilidad         | Datos, diseño de tablas e índices, IAM, configuración de capacidad, cifrado y monitoreo        |  **Bajo**                          |
| **AWS Lambda**      | Computación serverless         | Servidores, SO, parches, runtime, escalado y disponibilidad                               | Código, dependencias, configuración, IAM, variables de entorno, datos y seguridad del código   |  **Bajo**                          |

![responsabilidad compartida](/aws/responsabilidad-compartida_v1.jpg)

:::info Para recordar
Los **datos** y la **configuración** siempre son responsabilidad del cliente, independientemente del servicio. Lo que cambia es si el sistema operativo y la infraestructura subyacente son del cliente o de AWS.
:::

## 3. IaaS, PaaS y servicios administrados

El modelo de responsabilidad compartida está directamente relacionado con los niveles de abstracción en cloud computing. A mayor abstracción (más cosas administra AWS), menor es la carga operativa del cliente. Pero **menor administración no significa ausencia de responsabilidad**.

### 3.1 IaaS — Infrastructure as a Service

**Ejemplo representativo:** Amazon EC2

En IaaS, AWS provee la infraestructura virtualizada (máquina virtual, almacenamiento, red virtual). El cliente administra todo lo demás: sistema operativo, middleware, runtime, datos y aplicaciones.

```
┌─────────────────────────────────┐
│         Datos                   │ ← Cliente
├─────────────────────────────────┤
│       Aplicación                │ ← Cliente
├─────────────────────────────────┤
│    Sistema Operativo            │ ← Cliente
├─────────────────────────────────┤
│    Virtualización               │ ← AWS
├─────────────────────────────────┤
│     Servidores                  │ ← AWS
├─────────────────────────────────┤
│       Red física                │ ← AWS
├─────────────────────────────────┤
│    Centro de datos              │ ← AWS
└─────────────────────────────────┘
```

### 3.2 PaaS — Platform as a Service

**Ejemplo representativo:** Amazon RDS, AWS Elastic Beanstalk

En PaaS, AWS administra la infraestructura, el sistema operativo, el runtime y a veces el motor de base de datos. El cliente se enfoca en la aplicación, los datos y la configuración.

```
┌─────────────────────────────────┐
│         Datos                   │ ← Cliente
├─────────────────────────────────┤
│       Aplicación                │ ← Cliente
├─────────────────────────────────┤
│    Configuración                │ ← Cliente
├─────────────────────────────────┤
│  Runtime / Motor de BD          │ ← AWS
├─────────────────────────────────┤
│    Sistema Operativo            │ ← AWS
├─────────────────────────────────┤
│    Virtualización               │ ← AWS
├─────────────────────────────────┤
│     Servidores + Red            │ ← AWS
└─────────────────────────────────┘
```

### 3.3 Servicios administrados — Managed Services

**Ejemplo representativo:** AWS Lambda, Amazon DynamoDB, Amazon S3

En servicios administrados, AWS prácticamente administra todo excepto los datos, el código y la configuración del cliente.

```
┌─────────────────────────────────┐
│         Datos                   │ ← Cliente
├─────────────────────────────────┤
│         Código                  │ ← Cliente
├─────────────────────────────────┤
│    Configuración                │ ← Cliente
├─────────────────────────────────┤
│  Permisos IAM                   │ ← Cliente
├─────────────────────────────────┤
│   Todo lo demás                 │ ← AWS
│   (SO, runtime, hardware,       │
│    escalado, disponibilidad)    │
└─────────────────────────────────┘
```

:::warning Cuidado con esto
**"Menos administración"** **no** significa "sin responsabilidad". Incluso con Lambda o DynamoDB, el cliente sigue siendo responsable de:
- Sus datos.
- Sus permisos IAM.
- La configuración del servicio.
- La seguridad de su código.

El cliente **nunca** está completamente libre de responsabilidades.
:::

## 4. Escenarios Prácticos

### 4.1 Ejemplo Amazon EC2

> Una empresa ejecuta una aplicación web en una instancia EC2 con Amazon Linux 2. La aplicación conecta a una base de datos, maneja usuarios autenticados y almacena archivos en S3.

Este es el escenario con **más responsabilidades para el cliente** dentro de los servicios comunes de AWS.

| Componente | AWS | Cliente | Notas |
|---|---|---|---|
| Centro de datos | Si | No | AWS opera las instalaciones físicas |
| Hardware físico | Si | No | AWS reemplaza discos, memorias, procesadores |
| Red física | Si | No | Cableado, switches, routers físicos |
| Hypervisor | Si | No | AWS gestiona la capa de virtualización |
| Sistema operativo | No | Si | El cliente instala y parchea Linux/Windows |
| Parches del SO | No | Si | Si no parchea, es vulnerabilidad del cliente |
| Software en la instancia | No | Si | Servidor web, librerías, dependencias |
| Aplicación | No | Si | Código backend, lógica de negocio |
| Datos | No | Si | Datos de la aplicación, archivos, BD local |
| IAM | No | Si | Usuarios, roles, políticas, permisos |
| Security Groups | No | Si | Reglas de firewall a nivel de instancia |
| VPC / Red virtual | No | Si | Configuración de red privada virtual |
| Credenciales | No | Si | Access Keys, contraseñas, tokens |
| Cifrado de datos | No | Si | Cifrado en reposo y en tránsito |

### Elementos que generan confusión

- **¿AWS administra el sistema operativo de EC2?**

    **NO.** En EC2, el cliente elige, instala y administra el sistema operativo. AWS solo provee la máquina virtual y el hardware subyacente. Esto es diferente a RDS o Lambda, donde AWS sí administra el SO.

- **¿AWS protege los datos en EC2?**

    AWS protege la infraestructura donde se almacenan los datos (los discos físicos), pero **no protege los datos a nivel de contenido**. Si el cliente no cifra los datos en su instancia EC2 y un atacante accede, la responsabilidad es del cliente.

- **¿AWS aplica parches de seguridad?**

    AWS aplica parches al **hipervisor** y a la **infraestructura de virtualización**, pero **no** aplica parches al sistema operativo de la instancia EC2. Esa es responsabilidad exclusiva del cliente.

### 4.2 Ejemplo Amazon S3

> Una empresa almacena documentos corporativos, imágenes de productos y registros de auditoría en Amazon S3. Necesita que los documentos sean accesibles solo por empleados autorizados, pero algunas imágenes deben ser públicas para su sitio web.

**Distribución de responsabilidades**

| Componente | AWS | Cliente | Notas |
|---|---|---|---|
| Infraestructura de almacenamiento | Si | No | AWS maneja los discos y servidores de S3 |
| Durabilidad (11 9s) | Si | No | AWS replica datos entre AZ automáticamente |
| Disponibilidad del servicio | Si | No | AWS garantiza uptime del servicio |
| Datos almacenados | No | Si | El cliente sube y gestiona sus archivos |
| Bucket policies | No | Si | El cliente define quién puede acceder |
| IAM (usuarios y permisos) | No | Si | El cliente crea usuarios y asigna permisos |
| ACLs del bucket | No | Si | Control de acceso a nivel de bucket/objeto |
| Configuración pública/privada | No | Si | El cliente decide si el bucket es público |
| Cifrado de datos | No | Si | El cliente habilita SSE-S3, SSE-KMS, etc. |
| Logging de acceso | No | Si | El cliente habilita S3 Access Logs |
| Lifecycle policies | No | Si | El cliente define retención y eliminación |

AWS se encarga de la **infraestructura de almacenamiento** y garantiza una durabilidad extraordinaria (11 9s, o 99,999999999%). Esto significa que si subes 10 millones de objetos a S3, estadísticamente podrías perder un solo objeto cada 10,000 años. AWS logra esto replicando automáticamente los datos entre al menos 3 Availability Zones.

Sin embargo, **AWS no controla quién accede a tus datos**. Si configuras un bucket como público, cualquiera en internet puede leer su contenido. Si no habilitas cifrado, los datos se almacenan sin cifrar.

:::warning Tener en cuenta
Muchos creen que porque AWS almacena los datos de forma segura, automáticamente están protegidos contra acceso no autorizado. **Falso.** AWS protege la infraestructura de almacenamiento, pero **no controla el acceso a nivel de aplicación**. Si tú haces un bucket público, AWS no lo bloquea (para buckets creados antes de abril de 2023, el bloqueo de acceso público no estaba habilitado por defecto).
:::

### 4.3. Ejemplo Amazon RDS

Cuando ejecutas una base de datos en **EC2**, eres responsable de prácticamente todo. Cuando migras a **RDS**, AWS asume muchas de esas responsabilidades.

```text
Base de datos en EC2
┌─────────────────────────────────┐
│  Datos                          │ ← Cliente
│  Aplicación                     │ ← Cliente
│  Configuración de BD            │ ← Cliente
│  Usuarios de BD                 │ ← Cliente
│  Motor de BD (MySQL, etc.)      │ ← Cliente
│  Parches del motor de BD        │ ← Cliente
│  Parches del SO                 │ ← Cliente
│  SO (Linux/Windows)             │ ← Cliente
│  Virtualización                 │ ← AWS
│  Hardware                       │ ← AWS
└─────────────────────────────────┘

        VS

Base de datos en RDS
┌─────────────────────────────────┐
│  Datos                          │ ← Cliente
│  Configuración de BD            │ ← Cliente
│  Usuarios de BD                 │ ← Cliente
│  Parches del motor de BD        │ ← AWS
│  Parches del SO                 │ ← AWS
│  SO (Linux/Windows)             │ ← AWS
│  Copias de seguridad            │ ← AWS
│  Replicación                    │ ← AWS
│  Alta disponibilidad            │ ← AWS
│  Virtualización + Hardware      │ ← AWS
└─────────────────────────────────┘
```

**Qué se reduce para el cliente con RDS**

Al usar RDS en lugar de EC2, el cliente ya **no** es responsable de:

- Instalar y mantener el sistema operativo.
- Aplicar parches de seguridad al SO.
- Instalar y actualizar el motor de base de datos.
- Aplicar parches al motor de base de datos.
- Configurar copias de seguridad automatizadas.
- Configurar replicación para alta disponibilidad.
- Gestionar el hardware subyacente.
- Monitorear la salud del servidor de la base de datos.

**Qué permanece como responsabilidad del cliente**

Incluso con RDS, el cliente sigue siendo responsable de:

- Los datos almacenados en la base de datos.
- La configuración de la base de datos (tamaño de instancia, almacenamiento, parámetros).
- Los usuarios y permisos de la base de datos.
- La configuración de red (VPC, Security Groups).
- El cifrado de los datos en la base de datos.
- Las alertas y monitoreo (CloudWatch).

> Con RDS, AWS administra el **sistema operativo** y el **motor de base de datos**. Con EC2, el cliente administra ambas cosas.

### 4.4 Ejemplo AWS Lambda

> Una empresa ejecuta una función Lambda en Python que procesa imágenes subidas a S3, las redimensiona y las guarda en otro bucket. La función se ejecuta automáticamente cuando se sube una imagen.

**Distribución de responsabilidades**

| Componente | AWS | Cliente | Notas |
|---|---|---|---|
| Servidores subyacentes | Si | No | AWS provee la infraestructura de cómputo |
| Sistema operativo | Si | No | AWS administra el SO de los servidores |
| Parches del SO | Si | No | AWS aplica parches automáticamente |
| Runtime (Python, Node, etc.) | Si | No | AWS mantiene los runtimes actualizados |
| Escalado automático | Si | No | Lambda escala según la demanda |
| Disponibilidad | Si | No | AWS gestiona la alta disponibilidad |
| Código de la función | No | Si | El cliente escribe y despliega el código |
| Dependencias (librerías) | No | Si | El cliente gestiona las dependencias |
| Configuración de la función | No | Si | Memoria, timeout, variables de entorno |
| Permisos IAM | No | Si | El cliente define qué puede hacer la función |
| Datos que procesa | No | Si | Datos de entrada y salida de la función |
| Configuración de red | No | Si | VPC, subnets, si se necesita acceso a recursos privados |
| Seguridad del código | No | Si | Vulnerabilidades, validación de entradas |

**¿Por qué Lambda no significa "sin responsabilidades"?**

El término **serverless** puede ser engañoso. No significa que no haya servidores (los hay, pero AWS los administra). Y no significa que el cliente no tenga responsabilidades.

Con Lambda, el cliente **deja de administrar**:
- Servidores.
- Sistemas operativos.
- Parches.
- Escalado.
- Disponibilidad.

Pero el cliente **sigue siendo responsable de**:
- Su código (si tiene vulnerabilidades, es culpa del cliente).
- Sus datos (si los procesa de forma insegura, es culpa del cliente).
- Sus permisos IAM (si la función tiene permisos excesivos, es culpa del cliente).
- La configuración (si el timeout es muy largo o la memoria insuficiente, es culpa del cliente).

> **Recuerda:** Serverless reduce la carga operativa, pero no elimina la responsabilidad sobre la seguridad, los datos y la configuración.

---

**Referencias recomendadas:**

- [Modelo de responsabilidad compartida de AWS](https://aws.amazon.com/es/compliance/shared-responsibility-model/)
