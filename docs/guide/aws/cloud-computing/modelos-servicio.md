# Modelos de Servicio

Los modelos de servicio en **Cloud Computing** definen qué responsabilidades asume el proveedor de la nube y cuáles permanecen bajo el control del cliente.

La principal diferencia entre ellos no está en la tecnología, sino en quién administra cada parte de la infraestructura y del software, es decir qué parte administra el proveedor de nube y qué parte administra el cliente.

Algunas empresas quieren administrar absolutamente todo. Otras solo quieren desarrollar aplicaciones. Y otras simplemente quieren utilizar un software sin preocuparse por nada técnico. Para cubrir estas necesidades existen tres modelos de servicio principales:

- **`IaaS` (Infrastructure as a Service)**: tú administras casi todo.
- **`PaaS` (Platform as a Service)**: administras solo tu aplicación.
- **`SaaS` (Software as a Service)**: únicamente utilizas el software.

![tipos de modelos de servicio](/aws/cloud-img/modelos-servicio-intro_v2.png)

Mientras más avanzamos de **`IaaS`** hacia **`SaaS`**:

- Disminuye la responsabilidad del cliente.
- Aumenta la responsabilidad del proveedor.
- Es más rápido comenzar a trabajar.

**Por ejemplo**, Imagina que quieres abrir un restaurante. Puedes hacerlo de tres formas:

![analogia a modelos de servicio](/aws/cloud-img/modelos-servicio-intro.jpg)

## 1. ¿Qué administra cada uno?

![qué administra cada uno](/aws/cloud-img/modelos-servicio-administrar.png)

:::warning Importante
Aunque en **`SaaS`** el proveedor administra la aplicación, los datos siguen siendo responsabilidad del cliente.
:::

## 2. Tipos de Servicio

### 2.1 IaaS (Infrastructure as a Service)

Infrastructure as a Service significa Infraestructura como Servicio. El proveedor de nube alquila infraestructura tecnológica. En lugar de comprar servidores físicos, simplemente los alquilas por Internet. Es el modelo que ofrece más control, pero también implica más responsabilidades.

El proveedor administra:

- Centros de datos
- Hardware
- Redes
- Servidores físicos
- Virtualización

Tú administras:

- Sistema operativo
- Configuración
- Aplicaciones
- Bases de datos
- Seguridad del sistema operativo
- Actualizaciones
- Usuarios

:::tip Ejemplo
Necesito un servidor Ubuntu para instalar mi API en NestJS y una base de datos PostgreSQL. Elijo Amazon EC2, Azure Virtual Machines o Google Compute Engine.
:::

### 2.2 PaaS (Platform as a Service)

Platform as a Service significa Plataforma como Servicio. Aquí el proveedor administra casi toda la infraestructura. El desarrollador solo se preocupa por escribir código. No necesita instalar servidores. No necesita configurar Linux. No necesita administrar máquinas virtuales. Simplemente publica la aplicación.

El proveedor administra:

- Hardware
- Redes
- Sistema operativo
- Runtime
- Servidor web
- Escalabilidad
- Parches
- Infraestructura

Tú administras:

- Código
- Configuración de la aplicación
- Base de datos (según el servicio)
- Datos

:::tip Ejemplo
Ya desarrollé mi aplicación y solo quiero publicarla sin preocuparme por la infraestructura. Elijo AWS Elastic Beanstalk, Azure App Service o Google App Engine.
:::

### 2.3 SaaS (Software as a Service)

Software as a Service significa Software como Servicio. Es el modelo más conocido. El usuario simplemente utiliza una aplicación ya creada. No instala servidores. No configura infraestructura. No desarrolla software. Solo inicia sesión y trabaja.

El proveedor administra prácticamente todo:

- Hardware
- Redes
- Servidores
- Sistema operativo
- Aplicación
- Actualizaciones
- Seguridad
- Escalabilidad

El usuario administra únicamente:

- sus datos
- permisos
- configuración de la cuenta

:::tip Ejemplo
Solo quiero enviar correos, almacenar archivos o colaborar con mi equipo. Utilizo Gmail, Dropbox, Slack o Notion.
:::

## 3. ¿Cómo elegir el modelo adecuado?

La elección depende principalmente del nivel de control que necesitas, de quién administrará la infraestructura y del objetivo del proyecto.

| Si necesitas...                                         | Modelo recomendado | ¿Por qué?                                                                                                                           |
| ------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Máximo control sobre el servidor y el sistema operativo | **IaaS**           | Puedes instalar cualquier software, configurar la red y personalizar completamente el entorno.                                      |
| Desarrollar aplicaciones sin administrar servidores     | **PaaS**           | El proveedor se encarga de la infraestructura y la plataforma, permitiendo que el equipo se enfoque en escribir y desplegar código. |
| Utilizar una aplicación lista para trabajar             | **SaaS**           | No requiere instalación ni administración técnica; solo debes acceder y usar el servicio.                                           |

**Guía rápida para decidir**

Elige **`IaaS`** si:

- Necesitas configuraciones específicas del sistema operativo.
- Vas a migrar servidores o aplicaciones heredadas (legacy).
- Tu equipo tiene experiencia administrando infraestructura.

Elige **`PaaS`** si:

- Tu prioridad es desarrollar y publicar aplicaciones rápidamente.
- Quieres reducir las tareas de mantenimiento de servidores.
- Buscas escalado y despliegues automáticos.

Elige **`SaaS`** si:

- Solo necesitas consumir una aplicación (correo, CRM, almacenamiento, colaboración, etc.).
- No deseas administrar infraestructura ni actualizaciones.
- Buscas la solución más rápida y sencilla para los usuarios finales.

:::info Resumen
Una forma sencilla de recordarlo es:

- **`IaaS`** = "Me dan el servidor".
- **`PaaS`** = "Me dan una plataforma para desarrollar".
- **`SaaS`** = "Me dan el software listo para usar".

:::