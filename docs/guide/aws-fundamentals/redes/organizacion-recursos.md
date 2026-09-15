# Organización de los recursos en la nube de AWS

Imagine los millones de clientes que utilizan los servicios de AWS. Además, imagine los millones de recursos que estos clientes crearon, como instancias de Amazon EC2. Sin límites en todos estos recursos, el tráfico de red puede fluir entre ellos sin restricciones.

## 1. Establecer límites en los recursos de AWS

Cuando organice sus recursos en la nube de AWS, debe poder agrupar ciertas funciones y aislarlas del público o ponerlas a disposición de este. Ya cuenta con información acerca de lo que hacen las Amazon VPC. A continuación, analizará los beneficios.

### 1.1 Amazon VPC

![icono de Amazon VPC](/icons/amazon-vpc.svg)

Con **Amazon VPC**, puede aprovisionar una sección aislada de la nube de AWS. En esta sección aislada, puede lanzar recursos en una red virtual que usted defina. Ofrece **tres beneficios** principales. **Ayuda a aumentar la seguridad**, ya que puede proteger y supervisar las conexiones, controlar el tráfico y restringir el acceso a las instancias. Amazon VPC le otorga **control total** sobre la ubicación de sus recursos, la conectividad y la seguridad. La conveniencia de usar Amazon VPC se traduce en **menos tiempo** para configurar, administrar y validar su red virtual en comparación con la administración de redes en las instalaciones.

![Amazon VPC beneficios](/aws/redes/redes-organizacion-recursos-beneficios-vpc.png)

### 1.2 Subredes

Dentro de una **Amazon VPC**, puede organizar sus recursos en subsecciones o subredes. Una subred es una sección de una Amazon VPC que puede contener recursos, como instancias de Amazon EC2. Encontrará más información sobre las subredes en la lección siguiente.

**Conectar sus recursos con una puerta de enlace de internet**

Para permitir que el **tráfico público de internet** acceda a su VPC, adjunte una **puerta de enlace de internet** (internet gateway) a la VPC. Una puerta de enlace de internet es una conexión entre una VPC e internet. Puede pensar que una puerta de enlace de internet es similar a una puerta que utilizan los clientes para entrar a la cafetería. Sin una puerta de enlace de internet, nadie puede acceder a los recursos de su VPC.

![Conectar sus recursos con una puerta de enlace de internet](/aws/redes/redes-organizacion-recursos-subredes-internet-gateway.png)

## 2. Puertas de enlace privadas virtuales

¿Qué sucede si tiene una VPC que solo incluye recursos privados? En el siguiente ejemplo se muestra cómo funciona una **puerta de enlace privada virtual (Virtual Private Gateway - VGW)**. Puede pensar en internet como el camino entre su casa y la cafetería. Está abierto y cualquiera puede acceder a él. Lo ideal es encontrar una manera de proteger el tráfico que envía por internet del público, de los proveedores de servicios de internet y de otras personas que puedan intentar rastrearlo o interceptarlo. Aquí es donde una conexión de **red privada virtual (VPN)** interviene.

Una **VPN** crea una conexión que muy similar a un túnel seguro a través de internet. Mediante el cifrado, oculta y protege de los agentes externos todo lo que envía y recibe. Una **puerta de enlace privada virtual** es el componente de la nube de AWS que le permite conectar este tráfico protegido para ingresar a la VPC. Con una conexión de VPN, sus datos se trasladan de forma privada y segura, ya que están ocultos de las personas que utilizan la misma ruta.

Con una puerta de enlace privada virtual, puede establecer una conexión de VPN entre su VPC y una red privada, como un centro de datos en las instalaciones o una red corporativa interna. Además, una puerta de enlace de este tipo permite el tráfico a la VPC solo si procede de una red aprobada.

![Puertas de enlace privadas virtuales](/aws/redes/redes-organizacion-recursos-puerta-enlace-privadas-virtuales.png)

## 3. Componentes mencionados

Varios de los componentes de redes mencionados tienen abreviaturas similares y suelen confundirse. Estos son componentes básicos que utilizará en muchas soluciones en la nube de AWS.

- **Nube Virtual Privada (Virtual Private Cloud - VPC)**. Amazon VPC se utiliza para establecer límites en sus recursos de AWS.

- **Puerta de Enlace Privada Virtual (Virtual Private Gateway- VGW)**. Una puerta de enlace privada virtual permite que el tráfico de internet protegido entre en la VPC.

- **Red Privada Virtual (Virtual Private Network - VPN)**. Una VPN cifra el tráfico de internet, lo que ayuda a protegerlo de cualquier persona que intente interceptarlo o supervisarlo. permite comunicar una red externa con una red en AWS de forma segura a través de Internet.

---

**Referencias recomendadas**:

- [Amazon Virtual Private Cloud (VPC)](https://aws.amazon.com/vpc/)
- [Subred (Subnet)](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
- [Puerta de enlace privada virtual (Virtual Private Gateway)](https://docs.aws.amazon.com/vpn/latest/s2svpn/SetUpVPNConnections.html)
