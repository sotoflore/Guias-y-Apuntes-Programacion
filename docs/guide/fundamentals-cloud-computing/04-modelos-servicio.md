# Modelos de Servicio

Cuando hablamos de **Cloud Computing**, no todas las empresas necesitan el mismo nivel de control.

Algunas empresas quieren administrar absolutamente todo. Otras solo quieren desarrollar aplicaciones. Y otras simplemente quieren utilizar un software sin preocuparse por nada técnico.

Para cubrir estas necesidades existen tres modelos de servicio principales:

- **`IaaS` (Infrastructure as a Service)**: tú administras casi todo.
- **`PaaS` (Platform as a Service)**: administras solo tu aplicación.
- **`SaaS` (Software as a Service)**: únicamente utilizas el software.

La diferencia entre ellos está en qué parte administra el proveedor de nube y qué parte administra el cliente.

Mientras más avanzamos de **`IaaS`** hacia **`SaaS`**:

- disminuye la responsabilidad del cliente.
- aumenta la responsabilidad del proveedor.
- es más rápido comenzar a trabajar.

## ¿Qué administra cada uno?

| Componente        | On-Premise | IaaS      | PaaS      | SaaS      |
| ----------------- | ---------- | --------- | --------- | --------- |
| Redes             | Tú         | Proveedor | Proveedor | Proveedor |
| Servidores        | Tú         | Proveedor | Proveedor | Proveedor |
| Almacenamiento    | Tú         | Proveedor | Proveedor | Proveedor |
| Virtualización    | Tú         | Proveedor | Proveedor | Proveedor |
| Sistema Operativo | Tú         | Tú        | Proveedor | Proveedor |
| Runtime           | Tú         | Tú        | Proveedor | Proveedor |
| Aplicación        | Tú         | Tú        | Tú        | Proveedor |
| Datos             | Tú         | Tú        | Tú        | Tú        |

:::warning Importante
Aunque en **`SaaS`** el proveedor administra la aplicación, los datos siguen siendo responsabilidad del cliente.
:::

## Modelos

### IaaS (Infrastructure as a Service)

Infrastructure as a Service significa Infraestructura como Servicio.

El proveedor de nube alquila infraestructura tecnológica. En lugar de comprar servidores físicos, simplemente los alquilas por Internet. Es el modelo que ofrece más control, pero también implica más responsabilidades.

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

**Ejemplo**

Necesito un servidor Ubuntu para instalar mi API en NestJS y una base de datos PostgreSQL. Elijo Amazon EC2, Azure Virtual Machines o Google Compute Engine.

### PaaS (Platform as a Service)

Platform as a Service significa Plataforma como Servicio.

Aquí el proveedor administra casi toda la infraestructura. El desarrollador solo se preocupa por escribir código. No necesita instalar servidores. No necesita configurar Linux. No necesita administrar máquinas virtuales. Simplemente publica la aplicación.

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

**Ejemplo**

Ya desarrollé mi aplicación y solo quiero publicarla sin preocuparme por la infraestructura. Elijo AWS Elastic Beanstalk, Azure App Service o Google App Engine.

### SaaS (Software as a Service)

Software as a Service significa Software como Servicio.

Es el modelo más conocido. El usuario simplemente utiliza una aplicación ya creada. No instala servidores. No configura infraestructura. No desarrolla software. Solo inicia sesión y trabaja.

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

**Ejemplo**

Solo quiero enviar correos, almacenar archivos o colaborar con mi equipo. Utilizo Gmail, Dropbox, Slack o Notion.

## ¿Cómo elegir el modelo adecuado?

| Si necesitas...                                     | Modelo recomendado |
| --------------------------------------------------- | ------------------ |
| Control total del servidor                          | IaaS               |
| Desarrollar aplicaciones sin administrar servidores | PaaS               |
| Utilizar una aplicación lista para usar             | SaaS               |


:::info Resumen
Una forma sencilla de recordarlo es:

- **`IaaS`** = "Me dan el servidor".
- **`PaaS`** = "Me dan una plataforma para desarrollar".
- **`SaaS`** = "Me dan el software listo para usar".

:::