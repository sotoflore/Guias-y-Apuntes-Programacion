# AWS IAM (Identity and Access Management)

![iam icono](/icons/amazon-iam.svg)

**`AWS IAM`** (**Gestión de Identidad y Acceso**) es el servicio **gratuito** y **global** de **`AWS`** que permite administrar de forma centralizada **quién puede acceder** a los servicios y recursos de una cuenta (**autenticación**) y **qué acciones puede hacer** cada identidad una vez dentro (**autorización**).

Gracias a este servicio, puedes definir diferentes niveles de acceso para usuarios, aplicaciones y otros servicios, aplicando el principio de **mínimo privilegio**: cada identidad debe tener únicamente los permisos que necesita para realizar su trabajo.

![iam intro](/aws/security-img/iam-intro.jpg)

Sin **`IAM`**, sería mucho más difícil proteger una cuenta de AWS. Una persona con acceso sin restricciones podría modificar configuraciones, eliminar recursos, cambiar permisos o acceder a información confidencial.

> `IAM` es un servicio **global** (no se selecciona región al usarlo se encuentra disponible en todas las regiones de AWS) y **no tiene costo adicional**: se paga por los recursos a los que da acceso, no por usarlo. Permite controlar **quién** puede acceder a **qué** recursos y **qué acciones** puede realizar sobre ellos.

## 1. ¿Qué es AWS IAM?

AWS **Identity and Access Management** **`IAM`** es un servicio web que le permite controlar de forma segura el acceso a los recursos de AWS. Con IAM, puede administrar los permisos que controlan a qué recursos de AWS pueden acceder los usuarios. Utilice IAM para controlar quién está autenticado (ha iniciado sesión) y autorizado (tiene permisos) para utilizar recursos. IAM proporciona la infraestructura necesaria para controlar la autenticación y la autorización de su Cuentas de AWS.

Sus características principales son:

- **Global:** **`IAM`** no es regional. Aunque los recursos (instancias **`EC2`**, buckets **`S3`**, funciones **`Lambda`**) se crean en regiones específicas, las identidades y políticas de **`IAM`** se aplican a toda la cuenta, en todas las regiones.
- **Gratuito:** todas las características de **`IAM`** se ofrecen sin costo. Solo se paga por los recursos que los usuarios y roles utilizan.
- **Incluido por defecto:** toda cuenta de **`AWS`** ya tiene **`IAM`** habilitado; no hay que instalar ni activar nada.
- **Acceso granular:** los permisos se definen a nivel de acción individual (`s3:GetObject`, `ec2:StartInstances`, `dynamodb:PutItem`) e incluso se pueden condicionar por dirección IP, hora del día, uso de MFA, entre otros.
- **Seguridad centralizada:** Un solo punto para gestionar credenciales y permisos.
- **Federación:** Integración con proveedores de identidad externos (Active Directory, Google, etc.).
- **Auditoría:** Integración con CloudTrail para registro de actividad. 

### 1.1 ¿Para qué sirve?

**`IAM`** sirve para responder dos preguntas fundamentales antes de permitir cualquier operación en la nube:

1. **¿Quién eres?** — Mediante identidades (**users**, **roles**) y credenciales (contraseñas, access keys, tokens temporales).
2. **¿Qué puedes hacer?** — Mediante políticas (**policies**) que definen acciones permitidas y denegadas sobre recursos específicos.

En la práctica, con **`IAM`** puedes:

- Crear y administrar **usuarios** para personas y aplicaciones.
- Agrupar usuarios para asignar permisos de forma colectiva.
- Crear **roles** que servicios y aplicaciones asumen temporalmente para obtener permisos.
- Definir **políticas** JSON con permisos granulares.
- Habilitar **MFA** (autenticación multifactor) para proteger inicios de sesión.
- Permitir la **federación de identidades**: que usuarios externos (por ejemplo, de Microsoft Active Directory o de una aplicación móvil) accedan a **`AWS`** sin crear usuarios **`IAM`** dedicados.

### 1.2 ¿Qué problema resuelve?

Imagina una empresa que empieza a usar **`AWS`** con una sola cuenta. Sin **`IAM`**, todos tendrían que compartir el usuario principal de la cuenta (el *root user*) y su contraseña. Esto genera problemas graves:

| Problema sin IAM | Cómo lo resuelve IAM |
| --- | --- |
| Todos usan las mismas credenciales | Cada persona tiene su propio **IAM User** individual |
| No se sabe quién hizo qué | Las acciones quedan asociadas a cada identidad y auditables (con **`AWS CloudTrail`**) |
| Todo el mundo tiene acceso total | Los permisos se ajustan al rol de cada persona mediante **policies** |
| Una credencial filtrada compromete toda la cuenta | Se puede revocar acceso de una identidad sin afectar a las demás, y **MFA** añade una capa extra |
| Aplicaciones almacenan contraseñas en el código | Las aplicaciones usan **roles** con credenciales temporales rotadas automáticamente |

En resumen, **`IAM`** resuelve el problema de la **administración centralizada de identidades y accesos**: permite escalar de 1 persona a miles, dando a cada una exactamente el acceso que necesita.

:::info Autenticación y autorización
**`IAM`** combina dos procesos complementarios que conviene distinguir desde el inicio:

- **Autenticación (authentication):** el proceso de verificar la identidad. Ocurre cuando introduces tu contraseña en la consola, presentas unas access keys en la **`CLI`** o entregas un token temporal. Es decir: *probar que eres quien dices ser*.
- **Autorización (authorization):** el proceso de verificar qué acciones puede realizar esa identidad ya autenticada. Se basa en las políticas adjuntas a la identidad. Es decir: *determinar si tienes permiso para esa operación concreta*.

Ambos ocurren en orden: primero se autentica, después se autoriza. Nadie llega a la fase de autorización sin pasar primero por la autenticación.
:::

## 2. Conceptos fundamentales

Antes de estudiar los componentes, es necesario dominar siete conceptos base que **`AWS`** usa de forma consistente en toda su documentación.

### 2.1 Identidad

Una **identidad** es cualquier representación de un actor —una persona, una aplicación o un servicio— que puede autenticarse y recibir permisos en **`AWS`**. En **`IAM`**, las identidades principales son los **users** y los **roles** (los **groups** agrupan usuarios pero no inician sesión por sí mismos).

El concepto clave es que **`AWS`** no concede permisos "a personas" directamente, sino a **identidades**. Un desarrollador llamado Ana no tiene permisos porque sea Ana; los tiene porque existe una identidad **`IAM`** (por ejemplo, el user `ana-developer`) que representa su acceso a la cuenta.

### 2.2 Autenticación

La **autenticación** es el proceso de verificar una identidad antes de concederle acceso. **`IAM`** soporta varios mecanismos según el canal de acceso:

- **Contraseña:** para iniciar sesión en la **Consola de Administración de AWS** (interfaz web).
- **Access Keys:** un par formado por un *Access Key ID* y un *Secret Access Key*, usado para firmar peticiones desde la **AWS CLI**, los **SDKs** o llamadas directas a la API.
- **Tokens temporales:** credenciales de corta duración emitidas por **`AWS STS`** (*Security Token Service*), típicamente asociadas a roles.
- **MFA:** un código adicional generado por un dispositivo físico o virtual que refuerza la autenticación.

Si la autenticación falla (contraseña incorrecta, access key inválida), el proceso termina ahí: nunca se evalúa ningún permiso.

### 2.3 Autorización

La **autorización** es el proceso que determina **qué** puede hacer una identidad autenticada. **`IAM`** la realiza evaluando las políticas asociadas a la identidad contra cada solicitud: la acción solicitada (`s3:GetObject`), el recurso destino (`arn:aws:s3:::empresa-reportes/*`) y las condiciones del contexto (IP de origen, momento del día, presencia de MFA).

Una regla mental útil: la autenticación abre la puerta del edificio; la autorización decide qué puertas puedes cruzar una vez dentro.

### 2.4 Permisos

Un **permiso** es la autorización explícita para realizar una acción específica sobre un recurso específico. Por ejemplo: *"permitir `s3:GetObject` sobre los objetos del bucket `empresa-reportes`"*.

Los permisos en **`IAM`** tienen tres propiedades importantes:

- **Se expresan en políticas:** nunca se concede un permiso "sueltto"; siempre vive dentro de un documento JSON llamado política.
- **Se deniegan por defecto:** si ninguna política concede un permiso, la acción queda implícitamente denegada (*implicit deny*).
- **La denegación explícita gana:** si una política dice Allow y otra dice Deny para la misma acción, **siempre gana el Deny**.

### 2.5 Principio de mínimo privilegio

El **principio de mínimo privilegio** (*least privilege principle*) establece que cada identidad debe tener **únicamente los permisos estrictamente necesarios** para realizar su tarea, y nada más. Es la práctica de seguridad más importante de **`IAM`** y un tema recurrente en el examen.

:::tip Ejemplo
Un pasante de marketing que solo sube imágenes a un bucket no necesita permisos para borrar bases de datos ni para lanzar instancias. Concederle solo `s3:PutObject` sobre ese bucket concreto limita el daño potencial si sus credenciales se filtran. La sección 12 desarrolla este concepto con ejemplos incorrectos y correctos.
:::

### 2.6 Credenciales

Las **credenciales** son los mecanismos que una identidad usa para probar quién es durante la autenticación. **`IAM`** gestiona varios tipos:

| Tipo de credencial | Se usa para | Ejemplo |
| --- | --- | --- |
| Contraseña (*password*) | Iniciar sesión en la Consola web | `Mi-C0ntraseña-Segura!` |
| Access Keys (ID + Secret) | Firmar llamadas desde CLI, SDK o API | `AKIAIOSFODNN7EXAMPLE` + secreto |
| Códigos MFA | Añadir un segundo factor a la autenticación | Código de 6 dígitos rotativo |
| Tokens temporales de STS | Acceso temporal vía roles | Token válido 15 min - 12 h |

Dos reglas prácticas: las credenciales son **personales e intransferibles** (cada identidad usa las suyas) y deben **rotarse** periódicamente, especialmente las access keys de larga duración.

### 2.7 Políticas de acceso

Una **política de acceso** (*access policy*) es un **documento JSON** que define formalmente permisos: qué acciones (*Effect* + *Action*) están permitidas o denegadas sobre qué recursos (*Resource*) y bajo qué condiciones (*Condition*).

Es importante fijar desde ahora la relación conceptual correcta, porque es la base de todo **`IAM`**:

```text
La POLÍTICA define los permisos.
El USER / GROUP / ROLE recibe esas políticas y, con ellas, obtiene los permisos.
```

Las políticas son el "lenguaje" común con el que se escriben todos los permisos de **`AWS`**. En la sección 5 se estudia su estructura JSON elemento por elemento.

## 3. Componentes principales

**`IAM`** se compone de cuatro componentes fundamentales **Users**, **Groups**, **Roles** y **Policies** que trabajan juntos para definir quién tiene acceso a qué recursos de AWS.

![iam arquitectura](/aws/security-img/iam-arquitectura.jpg)

### 3.1 IAM Users

Un **IAM User** es una identidad que representa a una persona o aplicación que interactúa con **`AWS`** y posee **credenciales permanentes** (de larga duración hasta que alguien las rote o elimine): una contraseña para la consola y/o unas access keys para CLI/SDK/API.

Sirve para dentificar de forma única a cada actor humano o sistema que necesita acceso recurrente a la cuenta, permitiendo auditar sus acciones individualmente.

**Cuándo utilizarlo** 

Cuando pocas personas necesitan acceder de forma habitual a **`AWS`** con credenciales propias. Para equipos grandes lo recomendable es federar identidades externas; para aplicaciones que corren dentro de **`AWS`**, la recomendación oficial es usar **roles**, no users.

**Qué problema resuelve** 

Elimina el uso compartido de credenciales: cada persona tiene su propia identidad, su propia contraseña y su propio registro de actividad. Si alguien deja la empresa, se desactiva su user sin afectar a nadie más.

:::tip Ejemplo práctico 
Se crea el user `ana-desarrollo` para una programadora: pertenece al grupo `Developers`, inicia sesión en la consola con su contraseña + MFA y usa sus access keys para desplegar desde su portátil con la **`CLI`**.
:::

#### 3.1.1 Usuario Root

El **root user** es la identidad propietaria de la cuenta de **`AWS`**. Se crea automáticamente al registrarse y se identifica con el correo electrónico y la contraseña usados al crear la cuenta. No pertenece a **`IAM`**: existe por encima de él y **no puede ser limitado por ninguna política de IAM**.

**¿Qué puede hacer?**

El root tiene acceso absoluto e irrevocable a todos los recursos y servicios, incluyendo tareas exclusivas suyas que ningún usuario de **`IAM`**, por administrador que sea, puede realizar:

- Cambiar la configuración de la cuenta (correo, nombre de cuenta, datos de contacto, contraseña root).
- Cerrar la cuenta de **`AWS`** definitivamente.
- Activar el acceso de **`IAM`** a la consola de Billing.
- Cambiar o cancelar el plan de soporte (**AWS Support**).
- Restaurar permisos de usuarios de IAM si un administrador se revocó accidentalmente a sí mismo.
- Configurar *MFA Delete* en buckets de **`S3`**.
- Ver ciertas facturas fiscales (*tax invoices*).

#### 3.1.2 Credenciales de acceso

**Contraseña.** Habilita el acceso a consola. Debe cumplir la **password policy** de la cuenta, que el administrador configura con requisitos como longitud mínima, tipos de carácter, rotación periódica, impedir reutilización y permitir reseteo administrativo.

**Access Keys.** Par de valores compuesto por:

| Parte | Ejemplo | Característica |
| --- | --- | --- |
| Access Key ID | `AKIAIOSFODNN7EXAMPLE` | Identificador público de la clave |
| Secret Access Key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | Secreto de firma; **solo se muestra una vez** al crearla |

Buenas prácticas con access keys: crearlas solo si son realmente necesarias, usar una clave por aplicación/herramienta, rotarlas regularmente y nunca incrustarlas en código fuente o repositorios.

#### 3.1.3 Buenas prácticas

1. **Un user por persona:** nunca compartir usuarios ni contraseñas.
2. **Permisos vía grupos:** adjunta políticas al grupo, no al usuario individual.
3. **MFA activado:** especialmente para usuarios con permisos elevados.
4. **Rotación de credenciales:** cambia contraseñas y access keys periódicamente.
5. **Eliminar credenciales no usadas:** revisa el informe de credenciales (*credential report*) y desactiva lo obsoleto.

:::info Diferencia entre root user e IAM User
El **root user** es la identidad dueña de la cuenta, creada automáticamente al registrarse, con acceso total e irrestri­ngido. Un **IAM User** es una identidad creada dentro de la cuenta cuyos permisos dependen exclusivamente de las políticas que reciba.

**Tabla comparativa**

| Característica | Root user | IAM User |
| --- | --- | --- |
| Origen | Nace con la cuenta | Lo creas tú en IAM |
| Permisos | Totales, sin límite | Solo los definidos por sus policies |
| Restringible con políticas | No | Sí |
| Uso diario | Prohibido por buenas prácticas | Recomendado |
| MFA | Obligatorio | Altamente recomendado |
| Access keys | Deben no existir | Solo si son necesarias |
| Tareas exclusivas | Sí (cerrar cuenta, soporte…) | No puede realizarlas |

:::

### 3.2 IAM Users Groups

Un **IAM User Group** es una colección de usuarios que facilita administrar permisos de forma colectiva: se adjuntan políticas al grupo y todos sus miembros heredan esos permisos. Conceptualmente funciona igual que los grupos de usuarios de un sistema operativo: agrupas por perfil, no por persona.

Sirve para vitar configurar permisos usuario por usuario. Cambias la política del grupo una vez y afecta automáticamente a todos sus miembros.

Reglas que definen su comportamiento:

- Un grupo **contiene users**, no roles ni otros grupos.
- Un user puede pertenecer a **varios grupos a la vez** (límite predeterminado de 10).
- No existe un grupo "todos los usuarios" por defecto; si quieres uno, créalo manualmente.
- **No puedes iniciar sesión como grupo:** los grupos no autentican, solo distribuyen permisos.

**Cuándo utilizarlo** 

Siempre que varias personas compartan el mismo perfil de acceso (todos los administradores, todos los desarrolladores, todos los auditores). Es la mejor práctica estándar: *asignar permisos a grupos, no a usuarios individuales*.

**Qué problema resuelve** 

La escalabilidad administrativa. En una empresa de 50 desarrolladores, sin grupos habría que mantener 50 conjuntos de políticas individuales; con un grupo `Developers` se mantiene uno. Restricciones importantes: los grupos **no pueden contener otros grupos** (sin anidamiento) y un usuario puede pertenecer a varios grupos a la vez (límite predeterminado de 10).

:::tip Ejemplo práctico 
El grupo `Admins` contiene a `ana-desarrollo` y `carlos-devops`, y tiene adjunta la política administrada por AWS `AdministratorAccess`. Cuando se incorpora una tercera persona, basta añadirla al grupo para que tenga acceso administrativo.
:::

#### 3.2.1 Ventajas de utilizar grupos

- **Administración centralizada:** cambias la política una vez, afecta a todos los miembros.
- **Incorporaciones rápidas:** un empleado nuevo se añade al grupo correcto y hereda todos sus accesos.
- **Salidas limpias:** al retirar a alguien del grupo, pierde esos permisos instantáneamente sin tocar políticas.
- **Auditoría clara:** para saber qué puede hacer un desarrollador basta mirar las políticas del grupo `Developers`.

#### 3.2.2 Cómo asignar permisos a grupos

El proceso estándar tiene tres pasos:

```text
1. Crear la(s) policy (o usar una managed policy existente).
2. Adjuntarla al grupo.
3. Añadir users al grupo → heredan los permisos.
```

:::tip Ejemplo de grupo para administradores

Grupo: `Admins` — Política adjunta: `AdministratorAccess` (managed policy de AWS que concede `Action: "*"`, `Resource: "*"`).

```text
Admins (group)
   ├── ana-desarrollo (user)
   ├── carlos-devops (user)
   └── AdministratorAccess (policy)
         → Action: *
         → Resource: *
```

Úsalo con moderación: solo personas responsables de operar la infraestructura completa. Es frecuente que sea un grupo con 1-3 miembros.
:::

### 3.3 Roles

Un **Role** es una identidad de **`IAM`** con permisos definidos por políticas, diseñada para ser **asumida** (assumed) en lugar de estar vinculada permanentemente a una persona concreta. Cuando una identidad o servicio asume un rol, **`AWS STS`** (*Security Token Service*) emite **credenciales temporales** —compuestas por un Access Key ID, un Secret Access Key y un Session Token— que caducan automáticamente (por defecto tras 1 hora; configurable típicamente entre 15 minutos y 12 horas).

Un rol tiene dos mitades complementarias:

- **Trust policy** (política de confianza): define **quién puede asumir** el rol (el *principal*: un servicio, un user, otra cuenta…).
- **Permissions policies** (políticas de permisos): definen **qué puede hacer** quien asuma el rol.

**Cuándo utilizarlo** 

Cuando el actor que necesita permisos no es un humano fijo de tu organización: una instancia **`EC2`**, una función **`Lambda`**, un auditor externo por unos días, o una aplicación móvil de tus clientes. También cuando un humano necesita elevar privilegios puntualmente.

**Qué problema resuelve** 

Elimina la necesidad de almacenar credenciales en código o servidores. Una aplicación en **`EC2`** con un rol obtiene sus credenciales automáticamente del entorno, ya rotadas y caducables, lo que reduce drásticamente el riesgo de filtración.

:::tip Ejemplo práctico
Una aplicación web desplegada en **`EC2`** necesita leer archivos de **`S3`**. En lugar de guardar unas access keys en el servidor, se crea el rol `RolAppWeb-LecturaS3` con permisos de lectura y una trust policy que permite asumirlo al servicio `ec2.amazonaws.com`; luego se adjunta ese rol a la instancia. La aplicación simplemente funciona, sin gestionar credenciales.
:::

#### 3.3.1 ¿Cómo funciona?

```text
1. El actor (usuario/servicio/app) solicita asumir el rol (sts:AssumeRole).
2. STS valida la trust policy: ¿este actor tiene permitido asumirlo?
3. Si sí → STS entrega credenciales temporales con vencimiento.
4. El actor usa esas credenciales contra el servicio destino (ej. S3).
5. IAM evalúa las permissions policies del rol.
6. Al vencer las credenciales, hay que renovarlas (los SDK lo hacen solo).
```

:::info ¿Por qué un rol no pertenece permanentemente a una persona?
Porque su diseño responde a otro problema distinto al de los users. Un user responde a *"esta persona necesita acceso continuo"*. Un rol responde a *"algo necesita permisos durante un tiempo, sin importar exactamente quién o qué sea"*.

Consecuencias prácticas de ese diseño:

- **No tiene credenciales propias permanentes:** nadie "inicia sesión" con el rol; se obtiene acceso temporal asumiéndolo.
- **Es intercambiable:** hoy lo asume una instancia **`EC2`**, mañana un auditor externo; la trust policy decide quién.
- **Reduce superficie de riesgo:** aunque las credenciales del rol se filtren, caducan solas en minutos u horas.

:::

#### 3.3.2 Cómo otorga permisos temporales

La clave está en **`AWS STS`** (*Security Token Service*). Las credenciales que emite llevan incorporados el momento de expiración y el session token. Pasado ese tiempo, **`AWS`** rechaza cualquier petición firmada con ellas. Esto convierte el acceso temporal en el comportamiento normal, sin depender de que un administrador "recuerde" revocar accesos.

#### 3.3.4 Roles para servicios AWS

Es el caso más común. Servicios como **`EC2`**, **`Lambda`**, **`ECS`** o **`CloudFormation`** necesitan actuar en tu nombre (leer S3, escribir logs, crear recursos) y para ello asumen roles que tú les asignas.

Ejemplo: rol `RolAppWeb-LecturaS3` para una instancia **`EC2`**:

Trust policy (quién lo asume):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "ec2.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Permission policy (qué puede hacer):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::empresa-reportes/*"
    }
  ]
}
```

Al adjuntar este rol a la instancia (mediante un *instance profile*), toda aplicación que corra dentro puede leer el bucket sin que exista ninguna credencial almacenada en disco. Este patrón elimina la categoría entera de incidentes "access keys filtradas en un servidor".

#### 3.3.5 Roles para usuarios

Los humanos también asumen roles, típicamente para **elevar privilegios temporalmente**. 

:::tip Ejemplo
Un ingeniero trabaja a diario con permisos básicos y, ante una incidencia, asume el rol `RolSoporteEmergencias` que le concede permisos ampliados durante esa sesión. Terminada la sesión, vuelve automáticamente a su nivel base. Esto también deja huella en auditoría: queda registrado qué rol se asumió y cuándo.
:::

#### 3.3.6 Roles para aplicaciones y federación

Aplicaciones fuera de **`AWS`** (móviles, SPA web) pueden obtener acceso temporal mediante **federación de identidades**:

- **Web identity federation:** la app autentica al usuario con proveedores como Amazon Cognito, Login with Amazon, Facebook o Google, y a cambio recibe credenciales temporales asociadas a un rol.
- **SAML 2.0:** empleados de una empresa inician sesión en su Active Directory corporativo y acceden a la consola de **`AWS`** con roles mapeados, sin tener users de **`IAM`**.

>**Amazon Cognito** es el servicio orientado a federar identidades de usuarios finales (web/móvil) hacia roles de **`IAM`**.

#### 3.3.7 Cross-account roles

Un rol puede ser asumido por identidades de **otra cuenta de AWS**. Esto es la base de las arquitecturas multi-cuenta: la cuenta A confía en la cuenta B delegando acceso puntual, sin duplicar usuarios.

Trust policy del rol en la cuenta A (cuenta receptora):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::999988887777:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

El principal apunta al "root" de la cuenta `999988887777`, que significa "los administradores de esa cuenta pueden decidir quiénes de sus usuarios asumen este rol". Además, los usuarios que intenten asumirlo deben tener una identity policy en su propia cuenta que les permita `sts:AssumeRole` sobre ese ARN: **ambas partes deben permitirlo**.

Flujo completo:

```text
User de la cuenta B (999988887777)
        ↓ sts:AssumeRole
Rol "RolAuditorExterno" de la cuenta A (111122223333)
        ↓ credenciales temporales
Recursos de la cuenta A
```


### 3.4 IAM Policies

Una **IAM Policy** es un documento JSON que define permisos y reglas de acceso. Cada política contiene uno o más **statements** (declaraciones), y cada statement define un efecto (**Effect**), especifica una o más acciones (**Action**) que pueden estar permitidas (**Allow**) o denegadas (**Deny**), y determina sobre qué recursos (**Resource**) se aplican. Además, un statement puede incluir condiciones (**Condition**) que restringen cuándo se aplica el permiso.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::mi-bucket"
    },
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mi-bucket/*"
    }
  ]
}
```

Aquí tienes:

```txt
POLICY
│
├── Statement 1
│   ├── Effect: Allow
│   ├── Action: s3:ListBucket
│   └── Resource: mi-bucket
│
└── Statement 2
    ├── Effect: Allow
    ├── Action: s3:GetObject
    └── Resource: mi-bucket/*
```

Las **políticas** son el único mecanismo por el cual existe un permiso en **`AWS`**. Sin política no hay acceso: el comportamiento predeterminado ante cualquier solicitud es la denegación implícita.

>Users, Groups y Roles obtienen sus permisos exclusivamente a través de políticas.

**Cuándo utilizarla** 

Siempre. Ningún componente de **`IAM`** concede acceso por sí mismo: hay que escribir (o reutilizar) políticas y adjuntarlas a las identidades.

**Qué problema resuelve** 

Convierte la seguridad en algo **explícito, auditable y versionable**. En lugar de confiar en acuerdos verbales ("Ana puede tocar S3"), el acceso queda descrito en JSON revisable, copiable entre cuentas y compatible con herramientas de automatización como **`CloudFormation`**.

**Ejemplo práctico.** Esta política permite únicamente descargar objetos del bucket `empresa-reportes`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PermitirLecturaReportes",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::empresa-reportes/*"
    }
  ]
}
```

#### 3.4.1 Estructura JSON de una policy

Toda política sigue esta estructura general:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "identificador-opcional",
      "Effect": "Allow | Deny",
      "Action": ["servicio:Accion"],
      "Resource": ["arn-de-recurso"],
      "Condition": { "operador": { "clave": "valor" } }
    }
  ]
}
```

Sus elementos:

- **`Version`:** fija siempre el valor `"2012-10-17"`. No es la fecha de creación de tu política: es la versión del lenguaje de políticas que usas. Es el valor vigente desde hace años.
- **`Statement`:** lista de declaraciones. Puede contener una o muchas.
- **`Sid`:** (*Statement ID*) etiqueta opcional para documentar cada statement. Útil para leer políticas complejas.
- **`Effect`:** obligatorio. Solo admite dos valores: `"Allow"` o `"Deny"`.
- **`Action`:** acción u operaciones afectadas, con formato `servicio:acción`. Admite comodines: `"s3:*"` (todas las acciones de S3) o `"*"` (todas las acciones de todos los servicios).
- **`Resource`:** recurso u recursos afectados, expresados como **ARN** (*Amazon Resource Name*). En identity-based policies es obligatorio (salvo uso de comodín); en resource-based policies no se usa porque el recurso ya es la propia política adjunta.
- **`Condition`:** opcional. Añade requisitos adicionales: IP de origen, presencia de MFA, rango horario, etiquetas, etc.

:::info Formato ARN
El formato **ARN** merece atención porque aparece en todas las políticas:

```text
arn:aws:s3:::empresa-reportes/*
 │    │   │   │        └── id del recurso (bucket y objetos)
 │    │   │   └── cuenta AWS (vacío en S3)
 │    │   └── región (S3 es global, vacío aquí)
 │    └── servicio
 └── partición (aws = nube pública)
```
:::

#### 3.4.2 Evaluación de Políticas

La evaluación de políticas sigue un proceso determinista que determina si una solicitud es permitida o denegada.

```mermaid
flowchart TD
    A[Solicitud de API] --> B{¿Existe política DENY explícita?}
    B -->|Sí| C[DENEGADO]
    B -->|No| D{¿Existe política ALLOW explícita?}
    D -->|No| C
    D -->|Sí| E{¿Pasa todas las condiciones?}
    E -->|No| C
    E -->|Sí| F{¿Alguna otra política DENY?}
    F -->|Sí| C
    F -->|No| G[PERMITIDO]
    
    style C fill:#f44336,color:#fff
    style G fill:#4CAF50,color:#fff
    style A fill:#2196F3,color:#fff
```

**Reglas de evaluación**

1. **Por defecto, todo está denegado** - No hay permisos implícitos
2. **Un DENY explícito siempre gana** - Si hay un DENY en cualquier política aplicable, la solicitud se deniega
3. **Se necesita un ALLOW explícito** - Para que una solicitud sea permitida, debe existir al menos un ALLOW
4. **Las políticas de recursos se evalúan junto con las políticas de identidad**
5. **Las políticas de control de servicios (SCPs) actúan como límites máximos**

>**Recuerda**: Dos Allows no se cancelan entre sí (se suman), pero basta un único Deny explícito para bloquear la operación aunque haya diez Allows que la concedan.

#### 3.4.3 Tipos de políticas

##### Tipos de políticas según su gestión

| Tipo | Quién la crea y mantiene | Reutilización | Uso recomendado |
| --- | --- | --- | --- |
| **AWS managed policy** | **`AWS`** (creada y actualizada por Amazon) | Alta: compartible entre todas tus identidades | Casos comunes como `AdministratorAccess`, `ReadOnlyAccess`, `AmazonS3FullAccess` |
| **Customer managed policy** | Tú, dentro de tu cuenta | Alta: se puede adjuntar a múltiples identidades y versionar | Permisos personalizados reutilizables; la mejor práctica para permisos propios |
| **Inline policy** | Tú, pero vive "dentro" de una única identidad | Nula: estrictamente 1 a 1 con su identidad | Relaciones estrictamente uno a uno o garantizar que una política nunca se aplique a otra identidad |

:::warning Diferencia práctica importante
Si modificas una **customer managed policy**, el cambio afecta inmediatamente a todas las identidades donde está adjunta. Si borras una **inline policy**, desaparece con su identidad sin afectar a nadie más. Por eso **`AWS`** recomienda políticas gestionadas (customer managed) para casos personalizados, y reservar inline para excepciones puntuales.
:::

##### Tipos según dónde se adjuntan

- **Identity-based policies:** se adjuntan a users, groups o roles. Definen qué puede hacer esa identidad. Son las más habituales.
- **Resource-based policies:** se adjuntan al propio recurso (por ejemplo, una *bucket policy* de **`S3`**). Definen quién puede hacer qué con ese recurso y sí incluyen el elemento `Principal` (la identidad beneficiaria).

**Ejemplo: lectura de un bucket S3 (identity-based)**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LeerObjetosDelBucketReportes",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::empresa-reportes/*"
    },
    {
      "Sid": "PermitirListarBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::empresa-reportes"
    }
  ]
}
```

Explicación línea por línea:

| Línea / bloque | Elemento | Qué hace |
| --- | --- | --- |
| `"Version": "2012-10-17"` | Versión del lenguaje | Formato vigente de políticas; valor fijo |
| `"Statement": [...]` | Lista de declaraciones | Aquí hay dos statements independientes |
| Primer statement, `"Effect": "Allow"` | Efecto | Permite (no deniega) |
| `"Action": ["s3:GetObject"]` | Acción | Solo permite descargar objetos; no permite subir ni borrar |
| `"Resource": "arn:aws:s3:::empresa-reportes/*"` | Recurso | Los objetos (`/*`) del bucket `empresa-reportes`. La barra final importa: sin `/*` hablarías del bucket, no de su contenido |
| Segundo statement, `"Action": ["s3:ListBucket"]` | Acción | Permite listar los objetos del bucket |
| `"Resource": "arn:aws:s3:::empresa-reportes"` (sin `/*`) | Recurso | El bucket en sí. `ListBucket` opera sobre el bucket; `GetObject` sobre objetos. Por eso hay dos statements con recursos distintos |

Este ejemplo ilustra un detalle técnico real: listar (`ListBucket`) y descargar (`GetObject`) actúan sobre niveles distintos (bucket vs. objetos), así que suelen necesitar statements separados.


## 4. Cómo se relacionan Users, Groups, Roles y Policies

Los cuatro componentes forman una arquitectura de dos planos bien diferenciada:

1. **Plano de definición:** las **Policies** describen permisos (qué acciones sobre qué recursos).
2. **Plano de identidades:** los **Users**, **Groups** y **Roles** son entidades que reciben (se les adjuntan) esas políticas y representan actores que pueden autenticarse o ser asumidos.

![aws iam relación](/aws/security-img/iam-relacion-componentes.png)

> **Concepto clave:** una **política define permisos**, mientras que un **usuario, grupo o rol puede recibir esas políticas**. Las políticas no "pertenecen" a nadie por sí solas: hasta que no se adjuntan a una identidad, son solo texto JSON sin efecto.

### 4.1 Flujo típico para personas humanas

![aws iam Flujo típico](/aws/security-img/iam-flujo_v1.jpg)

Leyendo el diagrama de arriba abajo:

1. **Usuario:** `ana-desarrollo` se autentica en **`AWS`**.
2. **Grupo:** `ana-desarrollo` pertenece al grupo `Developers`.
3. **Política:** el grupo `Developers` tiene adjunta una política que permite operaciones sobre **`S3`** y **`EC2`**.
4. **Recursos:** como resultado, `ana-desarrollo` puede listar buckets, subir objetos y consultar instancias.

Este flujo refleja la buena práctica recomendada: **no se adjuntan políticas directamente al usuario, sino al grupo**, y el usuario hereda permisos por pertenencia. Así, gestionar los accesos de 100 personas se reduce a gestionar 4 o 5 grupos.

### 4.2 Flujo típico para servicios y aplicaciones

![aws iam Flujo típico](/aws/security-img/iam-flujo_v2.jpg)

Leyendo el diagrama:

1. **Usuario/Servicio:** una aplicación en **`EC2`** (o una función **`Lambda`**, o un usuario que cambia de contexto) necesita realizar una operación.
2. **IAM Role:** la aplicación **asume** un rol previamente configurado; **`STS`** emite credenciales temporales.
3. **IAM Policy:** las políticas adjuntas al rol definen exactamente qué puede hacer mientras dure la sesión.
4. **Recurso:** la aplicación accede al recurso (por ejemplo, lee un objeto de **`S3`**) usando esas credenciales temporales.

Fíjate en que la estructura es la misma que en el flujo anterior: **una identidad obtiene permisos porque tiene adjuntas políticas**. La diferencia está en la naturaleza de la identidad (permanente vs. asumible) y de sus credenciales (larga duración vs. temporales).

### 4.3 Resumen visual de las relaciones

![aws iam relación](/aws/security-img/iam-relacion.jpg)

Errores conceptuales frecuentes que conviene evitar:

- "Un grupo puede contener otros grupos" → Falso, no hay anidamiento de grupos.
- "Una policy concede permisos sola" → Falso, debe adjuntarse a una identidad.
- "Un rol pertenece a un único usuario" → Falso, un rol puede ser asumido por múltiples identidades y servicios.
- Correcto: *el usuario obtiene permisos por pertenencia a grupos y/o políticas adjuntas; el rol entrega permisos temporales a quien lo asuma.*

## 5. Errores comunes y malas prácticas

Reconocer estos errores es tan importante como conocer las buenas prácticas; varios aparecen textualmente en preguntas del examen pidiendo identificar "el problema" o "la mejor solución".

| Mala práctica | Por qué es un problema | Solución correcta |
| --- | --- | --- |
| Usar constantemente el root user | Credenciales todopoderosas expuestas a cada uso; sin trazabilidad individual | Crear users/grupos administrativos; root solo para tareas exclusivas, con MFA |
| Compartir credenciales entre personas | Sin trazabilidad (¿quién hizo qué?); imposible revocar a una sola persona | Un user por persona; acceso por grupos |
| Crear Access Keys innecesariamente | Cada clave de larga duración es un secreto más que filtrar y rotar | Roles para cargas en AWS; claves solo cuando no hay alternativa |
| Otorgar `AdministratorAccess` a todos | Un filtro de credenciales compromete toda la cuenta; errores con impacto total | Mínimo privilegio por perfil/grupo |
| No utilizar MFA | Una contraseña robada basta para entrar | MFA en root (obligatorio) y usuarios, especialmente admins |
| No aplicar mínimo privilegio | Superficie de ataque y radio de explosión enormes | Empezar denegado, ampliar con evidencia, revisar con Access Advisor |
| Usar users IAM donde bastaría un rol | Credenciales permanentes en código/servidores = riesgo de fuga permanente | Roles para EC2/Lambda/aplicaciones y accesos temporales |
| Incrustar credenciales en código o repositorios | Los repos se copian, filtran e indexan; rotación dolorosa | Variables de entorno + roles; secretos en Secrets Manager |
| No rotar ni limpiar credenciales | Claves antiguas activas durante años son puertas olvidadas | Rotación periódica; credential report; borrar lo no usado |

Un patrón transversal: casi todos estos errores consisten en **conceder demasiado, a demasiados, durante demasiado tiempo**. Las buenas prácticas de la sección siguiente atacan exactamente esos tres ejes.

## 6. Buenas prácticas de seguridad de IAM

Consolidación de las recomendaciones oficiales de **`AWS`**:

1. **Bloquea el root user:** protégelo con MFA, guárdalo para emergencias/tareas exclusivas, elimina sus access keys.
2. **Crea usuarios individuales:** nunca compartas identidades; cada persona y sistema con la suya (o federación).
3. **Usa grupos para asignar permisos:** políticas adjuntas a grupos, usuarios heredan por pertenencia.
4. **Aplica mínimo privilegio:** concede lo justo; audita permisos no usados con *Access Advisor* y *IAM Access Analyzer*.
5. **Usa roles para aplicaciones:** nada de access keys incrustadas en EC2/Lambda/ECS.
6. **Habilita MFA en todo lo posible:** root primero, luego todos los humanos.
7. **Configura password policy:** longitud mínima, complejidad, rotación, prohibición de reuso.
8. **Rota credenciales regularmente** y elimina las que ya no se usan.
9. **Delega mediante roles, no compartiendo credenciales:** cross-account roles para otras cuentas, federación (SAML/Cognito) para identidades externas.
10. **Usa condiciones en las políticas:** restringe por IP, MFA, horario o etiquetas para endurecer aún más los Allows.
11. **Monitorea la actividad:** **`AWS CloudTrail`** registra quién hizo qué y cuándo en toda la cuenta.
12. **Audita la configuración periódicamente:** *credential report* (estado de todas las credenciales) y *IAM Access Analyzer* (recursos compartidos externamente).

Si tuvieras que quedarte con solo tres para el examen: **root protegido con MFA**, **mínimo privilegio**, **roles para aplicaciones**.

## 7. IAM Policy vs IAM Role vs IAM User vs IAM Group

Comparativa directa de los cuatro componentes:

| Aspecto | User | Group | Role | Policy |
| --- | --- | --- | --- | --- |
| ¿Qué es? | Identidad de persona/app con credenciales permanentes | Contenedor de users para asignar permisos colectivos | Identidad asumible con credenciales temporales | Documento JSON que define permisos |
| ¿Inicia sesión? | Sí (consola/CLI) | No | No "inicia sesión": se asume | N/A |
| Credenciales | Permanentes (password/access keys) | No tiene | Temporales vía STS | No tiene |
| ¿Recibe policies? | Sí (directas o por grupo) | Sí | Sí (+ trust policy propia) | Es la policy |
| Duración del acceso | Hasta que se rote/elimine | Mientras dure la pertenencia al grupo | Mientras duren las credenciales temporales | Hasta que se desadjunte |
| Caso típico | Empleado recurrente | Equipo con perfil común (Developers) | EC2/Lambda, auditor externo, cross-account | Definir cualquier permiso |
| Analogía | Tarjeta de empleado | Departamento | Uniforme temporal que cualquiera puede ponerse | El reglamento escrito |

Dos reglas mnemotécnicas que resumen toda la tabla:

- **"La policy define; las identidades reciben."**
- **"User = permanente; Role = temporal; Group = solo agrupa users."**

## 8. Flujo completo de autorización

Veamos qué ocurre exactamente cuando una identidad intenta acceder a un recurso de **`AWS`**:

![aws iam flujo de autorización](/aws/security-img/iam-flujo-autorizacion.jpg)

**Paso a paso**

1. **Identidad:** un actor (user, sesión con rol asumido, servicio actuando bajo un rol) decide realizar una operación, por ejemplo `s3:GetObject` sobre un objeto.
2. **Autenticación:** **`AWS`** valida las credenciales presentadas: contraseña+MFA si viene de consola, access keys o token temporal si viene de CLI/SDK. Si fallan, todo termina aquí con error de credenciales.
3. **Solicitud:** **`AWS`** construye el contexto completo de la petición: principal (quién), acción (qué), recurso (sobre qué), condiciones ambientales (IP de origen, hora, región, presencia de MFA…).
4. **Evaluación de políticas:** **`IAM`** recopila todas las políticas aplicables —las de identidad adjuntas al usuario/grupos/rol, más las resource-based del destino— y aplica las reglas de decisión.
5. **Autorización:** se emite un veredicto único: permitido o denegado.
6. **Recurso AWS:** si fue permitido, el servicio ejecuta la operación y devuelve el resultado; si no, devuelve `AccessDenied`.

**La lógica de decisión, en orden estricto**

```text
¿Existe algún Deny explícito que aplique?
        ├── Sí → DENEGADO (gana siempre)
        └── No → ¿Existe algún Allow explícito?
                       ├── Sí → PERMITIDO
                       └── No → DENEGADO (deny implícito / por defecto)
```

### 8.1 ¿Qué ocurre cuando el acceso es permitido?

El servicio procesa la operación con normalidad: descarga el objeto, crea la instancia, escribe el ítem. En **`CloudTrail`** queda registrado quién hizo qué, desde dónde y con qué resultado.

### 8.2 ¿Qué ocurre cuando es denegado?

La petición nunca llega al recurso: el servicio responde con un error de tipo *Access Denied* y la operación no produce ningún efecto. Importante para el examen: la denegación puede provenir de dos causas indistinguibles desde fuera —un Deny explícito o simplemente la ausencia de Allow (deny implícito)—.

> **Para el examen:** ante cualquier pregunta sobre evaluación de permisos, recuerda la tríada: **denegación por defecto → Allow explícito habilita → Deny explícito gana siempre**.

## 9. IAM Identity Center

**AWS IAM Identity Center** es un servicio de AWS que permite administrar de forma centralizada el acceso de los usuarios del personal a múltiples cuentas de AWS y aplicaciones.

Su objetivo principal es simplificar el acceso de las personas a los recursos de AWS mediante un sistema de inicio de sesión único (SSO) y una administración centralizada de usuarios, grupos y permisos.

En términos sencillos:

>IAM Identity Center = un lugar central para controlar qué usuarios pueden acceder a qué cuentas y aplicaciones de AWS.

Por ejemplo:

```txt

                    IAM Identity Center
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Usuario       Grupo       Proveedor
           /Grupo                    de identidad
              │
              ▼
       Acceso centralizado
              │
      ┌───────┼────────┐
      ▼       ▼        ▼
   Cuenta A Cuenta B Cuenta C
      │       │        │
      └───────┼────────┘
              ▼
        Aplicaciones AWS
```

### 9.1 ¿Qué problema resuelve?

Imagina una organización con:
```txt
10 cuentas AWS
20 aplicaciones
100 empleados
```

Sin una solución centralizada, administrar quién tiene acceso a cada cuenta puede convertirse en una tarea compleja.

IAM Identity Center permite centralizar ese proceso:'
```txt

                    IAM Identity Center
                           │
                    Usuarios y grupos
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        AWS Cuenta 1  AWS Cuenta 2  AWS Cuenta 3
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    Aplicaciones AWS
```

Así, un administrador puede definir:

- Los desarrolladores pueden acceder a Desarrollo.
- El equipo de seguridad puede acceder a Producción.
- Los auditores tienen acceso de solo lectura.

:::warning Concepto clave: acceso del personal
IAM Identity Center está diseñado principalmente para gestionar el acceso de personas.

Recuerda:

- IAM Identity Center → acceso de personas
- IAM Roles → acceso de aplicaciones, servicios y también usuarios cuando corresponde

:::

### 9.2 ¿Cómo funciona IAM Identity Center?

El funcionamiento general puede dividirse en cuatro pasos:

1. Habilitar IAM Identity Center
2. Configurar proveedor de identidad
3. Configurar usuarios y grupos
4. Asignar acceso a cuentas y aplicaciones

### 9.3 Integración con AWS Organizations

IAM Identity Center funciona especialmente bien junto con AWS Organizations.

Recuerda:

- AWS Organizations. Se ocupa principalmente de: organizar y gobernar cuentas AWS.
- IAM Identity Center. Se ocupa principalmente de: administrar el acceso de las personas a esas cuentas.

Podemos visualizarlo así:
```txt

                 AWS Organizations
                        │
              Administración de cuentas
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
     Cuenta A        Cuenta B        Cuenta C
        ▲               ▲               ▲
        │               │               │
        └───────────────┼───────────────┘
                        │
                IAM Identity Center
                        │
                Usuarios y grupos
                        │
                  Permission Sets
```
Esta combinación es extremadamente común en arquitecturas multi-account.

### 9.4 IAM Identity Center vs AWS Organizations
| AWS Organizations            | IAM Identity Center           |
| ---------------------------- | ----------------------------- |
| Administra múltiples cuentas | Administra acceso de usuarios |
| Organiza cuentas             | Organiza usuarios y grupos    |
| OUs                          | Permission Sets               |
| SCP                          | Acceso a cuentas              |
| Gobernanza                   | SSO                           |
| Facturación consolidada      | Acceso centralizado           |
| Control organizacional       | Identidad del personal        |

Una forma sencilla de recordarlo:

```txt
AWS Organizations
        │
        ▼
"¿Cómo organizo y gobierno
 mis cuentas AWS?"

IAM Identity Center
        │
        ▼
"¿Quién puede acceder
 a esas cuentas?"
```

## 10. AWS Organizations

**AWS Organizations** es un servicio que permite administrar y gobernar de forma centralizada múltiples cuentas de AWS.

Su objetivo principal es ayudarte a organizar las cuentas, aplicar controles de seguridad y gobernanza, administrar costos y simplificar la facturación.

La idea fundamental es:

>AWS Organizations = administrar múltiples cuentas AWS desde un punto central.

Por ejemplo:

```txt
                    AWS Organizations
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Producción     Desarrollo     Seguridad
        Cuenta AWS     Cuenta AWS     Cuenta AWS
```
En lugar de administrar cada cuenta completamente por separado, Organizations permite establecer una estructura y controles comunes.

### 10.1 ¿Por qué utilizar varias cuentas AWS?

AWS recomienda utilizar una estrategia multi-account cuando una organización crece.

Una cuenta AWS puede funcionar como un límite natural para:

- Seguridad
-Costos
- Facturación
- Permisos
- Cargas de trabajo
- Entornos

Por ejemplo:

```txt
Empresa
│
├── Cuenta de Producción
│   └── Aplicaciones reales
│
├── Cuenta de Desarrollo
│   └── Desarrollo y pruebas
│
├── Cuenta de Seguridad
│   └── Herramientas de seguridad
│
└── Cuenta de Auditoría
    └── Logs y cumplimiento
```

Esto permite aislar diferentes responsabilidades y cargas de trabajo.

### 10.2 Estructura de AWS Organizations

La estructura básica puede visualizarse así:
```txt

                    ORGANIZACIÓN
                         │
                 Management Account
                         │
              ┌──────────┴──────────┐
              │                     │
             UO                    UO
          Security              Workloads
              │                     │
        ┌─────┴─────┐        ┌──────┴──────┐
        ▼           ▼        ▼             ▼
    Security     Audit    Production    Development
     Account     Account    Account       Account

```

Los principales componentes que debes conocer son:

- **Organización**: Es el contenedor general que agrupa las cuentas AWS.
- **Management Account**: Es la cuenta que administra la organización.
- **Member Accounts**: Son las cuentas que pertenecen a la organización.
- **Organizational Units (OUs)**: Una Organizational Unit (OU) es una agrupación de cuentas dentro de AWS Organizations. Las OUs permiten organizar cuentas según diferentes criterios.
- **Policies**: Permiten aplicar controles de forma centralizada.

## 11. IAM para AWS Cloud Practitioner

### 11.1 Tener en cuenta para el examen

- Si la pregunta habla de empleados, SSO, múltiples cuentas AWS, grupos y acceso centralizado → IAM Identity Center.

- Si habla de organizar cuentas, OUs, gobernanza y SCP → AWS Organizations.

- Si habla de permisos de usuarios, roles o políticas dentro de AWS → IAM.

- Si habla de una aplicación que necesita acceder a otro servicio AWS sin guardar credenciales → IAM Role.

### 11.2 Errores y "preguntas trampa" frecuentes

1. *"Puede asignarse una política directamente a un usuario"* → Cierto, pero **no es buena práctica**: lo esperado como respuesta suele ser asignarla al grupo.
2. *"Un grupo IAM puede contener otros grupos"* → Falso. Sin anidamiento.
3. *"Un rol pertenece exclusivamente a un usuario"* → Falso. Lo asumen múltiples principales.
4. *"IAM cobra por usuario creado"* → Falso. IAM es gratuito.
5. *"Debes seleccionar la región al crear usuarios IAM"* → Falso. IAM es global.
6. *"El root user puede tener permisos limitados con políticas"* → Falso. Nadie lo restringe; por eso se protege y no se usa.
7. *"La forma más segura de dar acceso a una app en EC2 es crear access keys"* → Falso. Es el patrón incorrecto clásico; la respuesta correcta es un rol.
8. *"Con MFA ya no importa la contraseña"* → Trampa: MFA es un **segundo factor**, complementa la contraseña, no la sustituye.
9. Dos opciones parecidas donde una da `AdministratorAccess` y otra permisos específicos → casi siempre gana la específica por mínimo privilegio.

---

**Referencias recomendadas:**

- [AWS IAM – Guía del usuario](https://docs.aws.amazon.com/es_es/IAM/latest/UserGuide/introduction.html)
- [Buenas prácticas de seguridad en IAM](https://docs.aws.amazon.com/es_es/IAM/latest/UserGuide/best-practices.html)
- [Referencia de políticas JSON de IAM](https://docs.aws.amazon.com/es_es/IAM/latest/UserGuide/reference_policies.html)

- [AWS Organizations](https://640266960308-y7eumxnb.us-east-1.console.aws.amazon.com/organizations/v2/home#)
- [IAM Identity Center](https://640266960308-y7eumxnb.us-east-1.console.aws.amazon.com/singlesignon/home?region=us-east-1#/)

- [AWS IAM - Identidad and Access Management](https://www.datacamp.com/es/tutorial/aws-identity-and-access-management-iam-guide)
