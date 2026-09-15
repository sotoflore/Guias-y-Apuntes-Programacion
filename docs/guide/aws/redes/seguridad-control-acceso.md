# Seguridad y control de acceso en redes de AWS

La **seguridad y el control de acceso en las redes de AWS** son fundamentales para proteger los recursos y datos que se encuentran en la nube. AWS proporciona diferentes mecanismos que permiten **controlar quién puede acceder a los recursos, desde dónde puede hacerlo y qué tipo de tráfico de red está permitido**.

En una arquitectura de red, la seguridad se implementa mediante diferentes **capas de protección**. Por ejemplo, una **VPC** permite aislar lógicamente los recursos, mientras que las **subredes** ayudan a separar componentes públicos y privados. Los **Security Groups** y las **Network ACLs (NACLs)** permiten controlar el tráfico que entra y sale de los recursos y las subredes.

Además, AWS utiliza **IAM (Identity and Access Management)** para controlar el acceso a los servicios y recursos mediante **usuarios, roles y políticas**. Esto permite aplicar el principio de **mínimo privilegio**, otorgando únicamente los permisos necesarios para realizar una tarea.

## 1. Tráfico de red en una VPC

**El movimiento de los paquetes de datos que se trasladan a través de una red**

Cuando un cliente solicita datos de una aplicación alojada en la nube de AWS, la solicitud se envía como un paquete. Un paquete es una unidad de datos que se envía a través de internet o de una red.

Entra en una VPC a través de una puerta de enlace de internet. Antes de que un paquete pueda entrar en una subred o salir de ella, se someterá a varias comprobaciones de permisos, una de las cuales es una ACL de red asociada a la subred a la que se dirige el paquete. Los permisos que las ACL de red definen indican lo que está permitido o denegado. Esto se basa en quién envió el paquete y cómo este intenta comunicarse con los recursos de una subred.

![Tráfico de red en una VPC](/aws/redes/redes-seguridad-control-acceso-trafico-red.png)

El componente de VPC que revisa los permisos de paquetes para las subredes es una ACL de red.

## 2. ACL de red

**Firewall virtual que controla el tráfico**

Una **ACL** (Access Control List) de red es un firewall virtual que controla el tráfico entrante y saliente en el nivel de subred.

**Por ejemplo**, imagine que está en el aeropuerto. Los viajeros están tratando de ingresar a un país diferente. Puede pensar en los viajeros como paquetes y en el oficial de control de pasaportes como una ACL de red. Este oficial revisa las credenciales de los viajeros cuando ingresan al país y salen de él. Del mismo modo, una ACL de red revisa los permisos cada vez que un paquete atraviesa un límite de subred.

Cada cuenta de AWS incluye una ACL de red predeterminada. Cuando configura la VPC, puede utilizar la ACL de red predeterminada de su cuenta o crear ACL de red personalizadas. De forma predeterminada, la ACL de red predeterminada de su cuenta permite todo el tráfico entrante y saliente, pero usted puede modificarla y agregar reglas propias.

![ACL de red](/aws/redes/redes-seguridad-control-acceso-acl-red.png)

En el caso de las **ACL de red personalizadas**, se deniega todo el tráfico entrante y saliente hasta que se agreguen reglas para especificar qué tráfico permitir. Además, todas las ACL de red tienen una regla de denegación explícita. Esta regla garantiza que, si un paquete no coincide con ninguna de las otras reglas de la lista, se deniegue.

![ACL de red personalizadas](/aws/redes/redes-seguridad-control-acceso-acl-red-personalizada.png)

**Filtrado de paquetes sin estado**

Las ACL de red realizan el filtrado de paquetes sin estado. No recuerdan nada y comprueban los paquetes que cruzan el límite de la subred en cada sentido: entrante y saliente.

Recuerde el ejemplo anterior de un viajero que quiere ingresar a un país diferente. Esto se asemeja al envío de una solicitud desde una instancia de Amazon EC2 hacia internet.

![Filtrado de paquetes sin estado](/aws/redes/redes-seguridad-control-acceso-acl-red-filtrado-paquetes.png)

Cuando un paquete de respuesta para esa solicitud vuelve a la subred, la ACL de red no recuerda la solicitud anterior. La ACL de red comprueba la respuesta del paquete con la lista de reglas para determinar si se permite o se deniega.

## 3. Grupos de seguridad

**Controle el tráfico entrante y saliente al nivel de los recursos**

Una vez que un paquete entra a una subred, se deben evaluar sus permisos para los recursos dentro de la subred, como las instancias de Amazon EC2. Un grupo de seguridad es el componente de VPC que revisa los permisos de los paquetes para una instancia de Amazon EC2. Es un firewall virtual que controla el tráfico entrante y saliente de recursos de AWS específicos, como las instancias de Amazon EC2.

De forma predeterminada, un grupo de seguridad deniega todo el tráfico entrante y permite todo el tráfico saliente. Para este ejemplo, imagínese que se encuentra en un edificio de departamentos con un portero que recibe a los invitados en la puerta. Puede pensar en los invitados como paquetes y en el portero como un grupo de seguridad. Con la configuración predeterminada, los grupos de seguridad denegarán el acceso a todos y permitirán todo el tráfico saliente.

![Grupos de seguridad](/aws/redes/redes-seguridad-control-acceso-grupo-seguridad.png)

Con los grupos de seguridad, puede agregar reglas personalizadas para configurar qué tráfico que debe permitirse. En ese caso, se denegaría cualquier otro tráfico. Por ejemplo, las reglas personalizadas se pueden aplicar por separado para el tráfico entrante y saliente. A medida que los invitados llegan, el portero revisa una lista para asegurarse de que pueden entrar al edificio. Sin embargo, el portero no vuelve a revisar la lista cuando los invitados salen del edificio.

![Grupos de seguridad](/aws/redes/redes-seguridad-control-acceso-grupo-seguridad_v2.png)

> Si tiene varias instancias de Amazon EC2 dentro de la misma VPC, puede asociarlas al mismo grupo de seguridad o utilizar grupos de seguridad diferentes para cada instancia.

**Filtrado de paquetes con estado**

Los grupos de seguridad realizan el filtrado de paquetes con estado. Recuerdan decisiones anteriores que se tomaron para los paquetes entrantes.

Considere el mismo ejemplo de enviar una solicitud desde una instancia de Amazon EC2 a internet. Cuando una respuesta de paquete para esa solicitud vuelve a la instancia, el grupo de seguridad recuerda la solicitud anterior. El grupo de seguridad permite que la respuesta continúe, sin importar las reglas del grupo de seguridad de entrada.

![Filtrado de paquetes con estado](/aws/redes/redes-seguridad-control-acceso-grupo-seguridad-filtro-paquetes.png)

## 4. Grupos de seguridad vs ACL de red

Tanto con las ACL de red como con los grupos de seguridad, puede configurar reglas personalizadas para el tráfico de la VPC. A medida que obtenga más información sobre la seguridad y las redes de AWS, es importante que comprenda las diferencias entre ellas. La tabla siguiente le ayudará a entender cuál debe usar.

| Característica | Grupos de seguridad | ACL de red |
|---|---|---|
| **Alcance** | Nivel de instancia (conexión a instancias de EC2) | Nivel de subred (asociadas a subredes) |
| **Estado** | Con estado (recuerda el estado) | Sin estado (no recuerda el estado) |
| **Tipos de reglas** | Solo reglas del tipo "permitir" | Reglas del tipo "permitir" y "denegar" |
| **Tráfico de retorno** | El tráfico de retorno se permite automáticamente si se permite el tráfico entrante | El tráfico de retorno debe estar permitido implícitamente en ambas direcciones |
| **Usos** | Control detallado del tráfico para instancias de EC2 individuales | Amplio control del tráfico que entra y sale de las subredes |

**¿Recuerda el modelo de responsabilidad compartida de AWS?** Cuando se trata de proteger las subredes y los recursos de su VPC con ACL de red y grupos de seguridad, usted es el responsable. Estos componentes constituyen la protección del tráfico de redes y son defensas fundamentales al momento de proteger sus aplicaciones EN la nube.

![modelo de responsabilidad compartida de AWS](/aws/redes/redes-seguridad-control-acceso-responsabilidad-compartida.png)

---

**Referencias recomendadas**:

- [Lista de control de acceso de red (Network ACL)](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [Grupos de seguridad (Security Groups)](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html)

