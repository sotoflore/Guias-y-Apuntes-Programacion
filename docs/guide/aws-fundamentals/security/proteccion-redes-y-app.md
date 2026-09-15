# Protección de Redes y Aplicaciones

La protección de redes y aplicaciones en AWS consiste en aplicar diferentes mecanismos de seguridad para proteger la infraestructura, los servicios, las aplicaciones y los datos frente a accesos no autorizados, ataques y otras amenazas. AWS proporciona un conjunto amplio de servicios y funcionalidades que permiten implementar seguridad tanto a nivel de red como a nivel de aplicación.

AWS ofrece servicios especializados para proteger las aplicaciones frente a amenazas. Por ejemplo, **AWS WAF** permite filtrar solicitudes HTTP/HTTPS y bloquear patrones de ataques comunes, mientras que **AWS Shield** proporciona protección frente a ataques de denegación de servicio distribuido (DDoS). También existen servicios como **AWS Network Firewall** para implementar controles de tráfico más avanzados a nivel de red.

La protección no se limita únicamente a bloquear tráfico malicioso. También es fundamental utilizar el principio de mínimo privilegio, cifrar los datos, controlar quién puede acceder a los recursos y monitorear continuamente la actividad del entorno.

En términos simples:

> **Usuario → Protección de aplicación → Protección de red → Recursos AWS → Datos**

Cada capa incorpora controles de seguridad diferentes para reducir el riesgo de accesos no autorizados y ataques.

## 1. Ataques a redes y aplicaciones

Otro componente vital para un entorno seguro en AWS es la protección de redes y aplicaciones. Repasemos cómo funcionan estos ataques.

### 1.1 Ataques de DoS
En los **ataques de denegación de servicio**, el atacante inunda una aplicación web con un tráfico de red excesivo. Las solicitudes legítimas de los clientes son rechazadas si la aplicación web se sobrecarga y deja de responder.

![Ataques de DoS](/aws/security-img/proteccion-redes-app-ataque-dos.png)

### 1.2 Ataques de DDoS

En un **ataque de denegación de servicio distribuida** (DDoS), el atacante puede utilizar varios equipos infectados (denominados bots zombi) para enviar tráfico excesivo a una aplicación web sin saberlo.

![Ataques de DDoS](/aws/security-img/proteccion-redes-app-ataque-ddos.png)

## 2. Protección de redes y aplicaciones de AWS

AWS protege a sus usuarios de forma automática frente a los ataques de fuerza bruta de bajo nivel, como los **DDoS**, mediante su infraestructura y arquitectura de redes integradas. La infraestructura de AWS se extiende por todo el mundo e incluye varias regiones, zonas de disponibilidad y ubicaciones periféricas. Está diseñada para complicar a los atacantes la tarea de abrumar el sistema.

Repasemos algunas de las formas en que la infraestructura y los servicios de AWS protegen las redes y aplicaciones.

### 2.1 Protección de AWS por medio de la infraestructura

- **Grupos de seguridad**. Los **grupos de seguridad** solo permiten el tráfico de solicitudes adecuado. Estos operan al nivel de la red de AWS para poder hacer caso omiso de los ataques masivos que utilizan toda la capacidad de la región de AWS.

- **Elastic Load Balancing (ELB)**. ELB gestiona el tráfico antes de transferirlo, de modo que su servidor de frontend no se vea abrumado. Al igual que los grupos de seguridad, este funciona a nivel regional.

- **Regiones de AWS**. La enorme capacidad de las regiones hace que superarlas sea una tarea extremadamente difícil. Hacerlo sería realmente caro.

### 2.2 Protección de AWS por medio de los servicios

AWS también ofrece los siguientes servicios que ayudan a proteger su red y sus aplicaciones.

#### 2.2.1 AWS Shield

![AWS Shield](/icons/aws-shield.svg)

**AWS Shield Estándar** está diseñado para proteger de forma automática a los clientes de AWS frente a los **ataques DDoS** más comunes y frecuentes sin costo alguno. Utiliza una variedad de técnicas de análisis para detectar y mitigar el tráfico de red entrante malicioso en tiempo real.

**AWS Shield Advanced** es un servicio pago que proporciona diagnósticos detallados de ataques y permite detectar y mitigar ataques DDoS sofisticados. También se integra con otros servicios, como Amazon CloudFront, Amazon Route 53 y ELB.

Además, puede integrar AWS Shield con AWS WAF por medio de la escritura de reglas personalizadas para mitigar los ataques DDoS complejos.

#### 2.2.2 AWS WAF

![WS WAF](/icons/aws-waf.svg)

**AWS WAF** es un firewall para aplicaciones web que supervisa las solicitudes de red entrantes. Cuando llega una solicitud a AWS WAF, este busca la dirección IP en una lista de control de acceso web (ACL web). Si la solicitud proviene de una dirección IP que está bloqueada en la ACL web, AWS WAF deniega el acceso. A las solicitudes legítimas se les da acceso.

---

**Referencias recomendadas**:

- [AWS Shield](https://aws.amazon.com/shield/)
- [AWS WAF](https://aws.amazon.com/waf/)