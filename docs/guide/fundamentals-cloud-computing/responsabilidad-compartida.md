# Modelo de Responsabilidad Compartida

El **Modelo de Responsabilidad Compartida** (Shared Responsibility Model) es un principio fundamental en el cloud computing que define claramente qué aspectos de la seguridad y la gestión operativa están a cargo del proveedor de servicios en la nube (como AWS, Microsoft Azure o Google Cloud Platform) y cuáles son responsabilidad exclusiva del cliente (la organización o el usuario que utiliza el servicio).

En otras palabras:

>El proveedor protege la infraestructura de la nube, mientras que el cliente protege todo aquello que coloca dentro de ella.

## ¿Qué es el Modelo de Responsabilidad Compartida?

Es un marco de trabajo utilizado por todos los proveedores de Cloud Computing para definir claramente qué aspectos de la infraestructura y la seguridad son responsabilidad del proveedor y cuáles corresponden al cliente.

El objetivo es evitar confusiones y establecer límites claros sobre quién debe proteger cada componente del sistema.

Se divide en dos grandes responsabilidades:

- **Seguridad de la nube** (Security of the Cloud) → responsabilidad del proveedor.
- **Seguridad en la nube** (Security in the Cloud) → responsabilidad del cliente.

**Beneficios**:

- Define claramente las responsabilidades de cada parte.
- Reduce ambigüedades en la gestión de la seguridad.
- Facilita el cumplimiento normativo al saber quién controla cada componente.
- Permite aprovechar servicios administrados, reduciendo la carga operativa del cliente.
- Promueve buenas prácticas de configuración, monitoreo y protección de datos.

### ¿Qué significa "Seguridad de la nube"?

Hace referencia a todo aquello relacionado con la infraestructura física y tecnológica donde funcionan los servicios en la nube. Esta responsabilidad pertenece completamente al proveedor del servicio.

Incluye aspectos como:

- Centros de datos.
- Energía eléctrica.
- Refrigeración.
- Servidores físicos.
- Redes físicas.
- Cableado.
- Equipos de almacenamiento.
- Virtualización.
- Hardware.

Todo esto es administrado por el proveedor. El cliente nunca tiene acceso físico a estos recursos.

### ¿Qué significa "Seguridad en la nube"?

Hace referencia a todo aquello que el cliente instala, configura o almacena dentro de los servicios cloud. Esta responsabilidad pertenece al cliente.

Por ejemplo:

- Usuarios.
- Contraseñas.
- Roles.
- Permisos.
- Bases de datos.
- Aplicaciones.
- Máquinas virtuales.
- Contenedores.
- Configuración de redes.
- Archivos almacenados.
- Copias de seguridad.
- Cifrado de datos.
- Actualizaciones del sistema operativo (dependiendo del servicio).

## Responsabilidades del proveedor Cloud

Generalmente incluyen:

**Infraestructura física**

- Centros de datos.
- Servidores.
- Redes.
- Cableado.
- Almacenamiento físico.

**Virtualización**

- Hipervisores.
- Hosts físicos.
- Clústeres.
- Balanceadores internos.

**Disponibilidad**

Mantener:

- redundancia
- tolerancia a fallos
- recuperación ante desastres
- mantenimiento del hardware

**Seguridad física**

Incluye:

- cámaras
- guardias
- control biométrico
- detección de incendios
- sistemas eléctricos

**Hardware**

- reemplazo de discos
- cambio de servidores
- mantenimiento de switches
- routers

## Responsabilidades del cliente

**Gestión de identidades (`IAM`)**

El cliente decide:

- quién puede ingresar
- qué permisos tiene
- qué recursos puede modificar

**Protección de datos**

El cliente debe decidir:

- qué datos almacenar
- cómo cifrarlos
- cuánto tiempo conservarlos
- quién puede acceder

**Configuración de redes**

Por ejemplo:

- Firewalls
- Security Groups
- ACL
- VPN
- Redes privadas

**Sistemas Operativos**

Cuando el cliente utiliza máquinas virtuales (IaaS), debe:

- instalar parches
- actualizar Windows
- actualizar Linux
- cerrar puertos
- eliminar software vulnerable

**Aplicaciones**

El cliente desarrolla:

- APIs
- Backend
- Frontend
- Microservicios

También debe:

- corregir errores
- actualizar librerías
- solucionar vulnerabilidades

**Base de datos**

El cliente administra:

- usuarios
- contraseñas
- permisos
- respaldos
- consultas

## Distribución de Responsabilidades por Capas

Una característica importante es que la cantidad de responsabilidades del cliente varía dependiendo del tipo de servicio contratado. Mientras más administrado sea el servicio, menos responsabilidades tendrá el cliente.

### Responsabilidad en IaaS

El proveedor administra

- Hardware
- Red física
- Virtualización
- Servidores físicos
- Almacenamiento

El cliente administra

- Sistema operativo
- Aplicaciones
- Datos
- Usuarios
- Firewalls
- Redes virtuales
- Parches
- Configuración

### Responsabilidad en PaaS

El proveedor administra además:

- Sistema operativo
- Middleware
- Runtime
- Escalabilidad
- Parches

El cliente únicamente administra:

- Código
- Aplicación
- Configuración
- Datos
- Usuarios

### Responsabilidad en SaaS

En **`SaaS`** casi todo es administrado por el proveedor. El cliente únicamente administra:

- Usuarios
- Contraseñas
- Permisos
- Información almacenada
- Configuración de la aplicación

No administras:

- servidores
- discos
- sistema operativo
- redes

Solo utilizas el software.

:::info Ejemplo práctico

Una empresa despliega una aplicación web en la nube utilizando una máquina virtual (IaaS).

**El proveedor se encarga de**:

- Mantener operativo el centro de datos.
- Reemplazar servidores defectuosos.
- Garantizar la conectividad de la red física.
- Administrar la plataforma de virtualización.

**La empresa (cliente) debe encargarse de**:

- Instalar y actualizar Linux.
- Configurar el firewall y las reglas de acceso.
- Instalar el servidor web y la aplicación.
- Crear usuarios con los permisos adecuados.
- Proteger la base de datos.
- Realizar copias de seguridad.
- Cifrar la información sensible.
- Monitorear la aplicación y responder ante incidentes.

Si un atacante accede porque la contraseña del administrador era débil o el puerto SSH estaba expuesto, **la responsabilidad recae en el cliente**, ya que el proveedor cumplió con proteger la infraestructura, pero la configuración de la carga de trabajo era responsabilidad de la empresa.
:::

## Buenas prácticas para el cliente

- Activar la autenticación multifactor (**`MFA`**).
- Aplicar el principio de mínimo privilegio en **`IAM`**.
- Mantener sistemas y aplicaciones actualizados.
- Cifrar datos sensibles tanto en tránsito como en reposo.
- Configurar y verificar periódicamente las copias de seguridad.
- Supervisar registros y eventos mediante herramientas de monitoreo y auditoría.
- Revisar regularmente las configuraciones de seguridad de los recursos en la nube.
- Automatizar la aplicación de políticas de seguridad cuando sea posible.

> En la nube, la seguridad no se delega por completo: se comparte. El proveedor asegura la plataforma sobre la que operan los servicios, y el cliente debe proteger todo aquello que implementa, configura y almacena dentro de ella.