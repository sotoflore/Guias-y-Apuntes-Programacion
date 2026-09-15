# Modelos de Despliegue Cloud

![modelos de despliegue](/aws/cloud-img/modelos-despliegue-intro.jpg)

Los modelos de despliegue definen **dónde se ejecutan los recursos de una organización** y **quién los opera**. Son la primera decisión que toma cualquier empresa que quiere usar la nube: ¿todo en el proveedor público? ¿en un centro de datos propio? ¿en ambos? ¿compartida con otras organizaciones?

Elegir bien el modelo condiciona el **coste, la seguridad, la escalabilidad y el control** de toda la infraestructura.

## 1. ¿Qué son los modelos de despliegue?

Los **modelos de despliegue** (Deployment Models) son formas de organizar, administrar y poner a disposición la infraestructura y los recursos de TI, como servidores, almacenamiento, redes, aplicaciones y servicios, según quién posee la infraestructura, quién la administra y quién puede acceder a ella.

En computación en la nube, los modelos de despliegue definen la **propiedad**, la **ubicación** y el **acceso a los recursos**. Es decir, determinan dónde se ejecutan las cargas de trabajo y bajo qué esquema de propiedad y acceso se proporcionan los recursos tecnológicos.

>Un **modelo de despliegue** responde a una pregunta concreta: **¿dónde vive mi infraestructura y quién la opera?**

:::warning Importante
No confundas **modelos de despliegue** con **modelos de servicio**. Un **modelo de despliegue** define cómo y dónde se implementan los recursos de TI y quién posee, administra y tiene acceso a la infraestructura utilizada para ejecutar las cargas de trabajo.

| Modelo de despliegue | Pregunta que responde                                  |
| -------------------- | ------------------------------------------------------ |
| Pública              | ¿Dónde está la infraestructura y quién la proporciona? |
| Privada              | ¿La infraestructura está dedicada a una organización?  |
| Híbrida              | ¿Se combinan entornos públicos y privados?             |
| Multicloud           | ¿Se utilizan varios proveedores cloud?                 |
| Community         | ¿Compartida con organizaciones con intereses comunes?                 |

Mientras que los **modelos de servicio** (IaaS, PaaS, SaaS) responden a qué nivel de recursos o servicios administra el proveedor y qué debe administrar el cliente.
:::

### 1.1 ¿Qué problemas resuelven?

| Problema | Solución que aportan los modelos |
|---|---|
| Costes altos de infraestructura propia | Nube pública: pago por uso, sin hardware. |
| Datos muy sensibles o regulados | Nube privada: control y cumplimiento totales. |
| Picos de demanda que un centro de datos no soporta | Nube híbrida: desbordar (burst) a la nube pública. |
| Requisitos normativos compartidos por varias entidades | Nube comunitaria: cumple reglas comunes con coste compartido. |

### 1.2 ¿Cómo ayudan a las organizaciones?

- **Económicamente**: pasan de gasto de capital (CAPEX) en hardware a gasto operativo (OPEX) según consumo.
- **Operativamente**: adaptan la capacidad a la demanda real.
- **Estratégicamente**: equilibran agilidad, seguridad y cumplimiento normativo.

:::info Idea clave
Los modelos de despliegue responden **dónde vive la infraestructura y quién la opera**. Existen porque cada organización necesita un equilibrio distinto entre **coste, control, seguridad y escalabilidad**. Es la primera gran decisión de arquitectura cloud.
:::

## 2. Tipos de modelos de despliegue

### 2.1 Nube Pública (Public Cloud)

Es un modelo en el que un **proveedor externo** (AWS, Microsoft Azure, Google Cloud, IBM Cloud, Oracle Cloud) pone a disposición de millones de usuarios recursos de computación a través de **Internet público**, con **pago por uso**.

Los recursos incluyen aplicaciones SaaS, máquinas virtuales, almacenamiento, infraestructuras completas a nivel empresarial y plataformas de desarrollo.

El proveedor de servicios en la nube pública posee, gestiona y asume toda la responsabilidad de los centros de datos, el hardware y la infraestructura en los que se ejecutan las cargas de trabajo de sus clientes. Por lo general, proporciona conectividad de red de gran ancho de banda para ayudar a garantizar un alto rendimiento y un acceso rápido a las aplicaciones y los datos.

![nube pública](/aws/cloud-img/modelos-despliegue-nube-publica.jpg)

>Muchas empresas usan la misma infraestructura física administrada por el proveedor, aunque sus datos permanecen **aislados** (multi-tenancy con aislamiento lógico).

#### 2.1.1 Características

- **Multi-tenancy**: muchos clientes comparten la infraestructura del proveedor.
- **Pago por uso (OPEX)**: solo facturas por lo consumido (horas de VM, GB almacenados).
- **Escalado y elasticidad**: de 1 a miles de servidores en minutos.
- **Self-service**: los recursos se aprovisionan por consola o API, sin intervención humana.
- **Sin gestión de hardware**: el proveedor opera el centro de datos completo.

#### 2.1.2 Ventajas y desventajas

**Ventajas**

- Coste inicial **mínimo** (sin CAPEX en hardware).
- Escalabilidad **inmediata** e ilimitada en la práctica.
- Alta disponibilidad con **Zonas de Disponibilidad** y regiones globales.
- Elimina el mantenimiento del hardware.
- Acceso desde cualquier lugar con Internet.

**Desventajas**

- **Menos control** sobre la infraestructura y el hardware.
- **Cumplimiento normativo limitado**: los datos residen en infraestructura de terceros.
- Posible **latencia** si el centro de datos queda lejos de los usuarios.
- Riesgo de **vendor lock-in** (dependencia del proveedor).
- Cumplir normativas estrictas (banca, salud) puede ser complejo.

#### 2.1.3 Casos de uso

- Startups y productos digitales que crecen rápido.
- Aplicaciones web y móviles con tráfico variable.
- Pruebas de concepto y entornos de desarrollo.
- Cargas de trabajo con picos estacionales (e-commerce).
- Almacenamiento masivo y análisis de datos (Big Data).

:::info Idea clave
La nube pública es el modelo donde **el proveedor es dueño y operador de todo**, y la empresa alquila recursos por Internet con pago por uso. Ganas **agilidad y coste variable**; pierdes **control y capacidad de cumplimiento** de normativas muy estrictas.
:::

### 2.2 Nube Privada (Private Cloud)

Es un modelo donde todos los recursos cloud se destinan a **una sola organización**. A diferencia de lo que a veces se cree, **no equivale exactamente a "on-premise"**: la nube privada puede alojarse en el centro de datos propio de la empresa o en infraestructura dedicada de un proveedor externo.

Proporcionan más control, seguridad y gestión de datos, al mismo tiempo que permiten que los usuarios internos se beneficien de un conjunto compartido de recursos de computación, almacenamiento y redes.

La **nube privada** combina muchos beneficios del cloud computing (incluidas la elasticidad, la escalabilidad y la facilidad de prestación de servicios) con el control de acceso, la seguridad y la personalización de recursos de la infraestructura local.

Una nube privada suele alojarse en las instalaciones del centro de datos del cliente. Sin embargo, también puede alojarse en la infraestructura de un proveedor de servicios en la nube independiente o crearse en una infraestructura alquilada alojada en un centro de datos externo.

![nube privada](/aws/cloud-img/modelos-despliegue-nube-privada.jpg)

#### 2.2.1 Beneficios

- **Control total** sobre hardware, software y datos.
- **Cumplimiento normativo** estricto (datos que no pueden salir de un país o una instalación).
- **Aislamiento absoluto**: sin vecinos compartiendo infraestructura.
- **Personalización profunda** del entorno.
- **Seguridad predecible** para datos confidenciales.

#### 2.2.2 Limitaciones

- **Coste alto**: hardware, energía, personal de operaciones.
- **Escalabilidad limitada** por la capacidad del centro de datos.
- **Mantenimiento propio**: parches, actualizaciones, renovaciones de hardware.
- No ofrece toda la elasticidad del cloud público de forma inmediata.

#### 2.2. Casos de uso

- Bancos e instituciones financieras (datos sensibles y regulados).
- Organismos gubernamentales y defensa.
- Hospitales con historiales clínicos sujetos a normativa (HIPAA, GDPR).
- Grandes empresas que ya invirtieron en centros de datos.
- Cargas de trabajo críticas con latencia ultrabaja.

> **Importante**: la nube privada ofrece las **características de cloud** (self-service, pooling, elasticidad) sobre infraestructura **exclusiva** de la organización. No es simplemente "tener servidores": es tener **cloud privado** con automatización y servicio bajo demanda.

:::info Idea clave
La nube privada es **infraestructura cloud exclusiva de una organización**: control total y cumplimiento normativo a cambio de coste alto y operación propia. No es igual a "on-premise": es cloud (con self-service y pooling) pero de uso exclusivo.
:::

### 2.3 Nube Híbrida (Hybrid Cloud)

Es un **entorno mixto** donde las aplicaciones se ejecutan combinando **nube pública y nube privada (u on-premises)**, conectadas entre sí para compartir datos y aplicaciones. Los enfoques híbridos están muy extendidos: hoy casi ninguna gran empresa depende de un único entorno.

![nube híbrida ](/aws/cloud-img/modelos-despliegue-nube-hibrida.jpg)

**Flujo de comunicación entre nube pública y privada**

![nube híbrida ejemplo](/aws/cloud-img/modelos-despliegue-nube-hibrida_ejemplo_v1.jpg)

**Ejemplo de una empresa con arquitectura híbrida**

![nube híbrida ejemplo](/aws/cloud-img/modelos-despliegue-nube-hibrida_ejemplo.jpg)

>La empresa mantiene los datos **sensibles** en su infraestructura privada y usa la nube pública para **ampliar capacidad**, servir tráfico web o ejecutar cargas de trabajo elásticas.

#### 2.3.1 Ventajas y desventajas

**Ventajas**

- **Flexibilidad**: cada carga de trabajo vive donde le conviene.
- **Optimización de costes**: se usa la nube pública solo cuando aporta valor (picos).
- **Migración gradual**: se migra aplicación a aplicación, sin "todo o nada".
- **Desbordamiento (cloud bursting)**: los picos de demanda se absorben en la nube pública.
- **Resiliencia**: un entorno puede respaldar al otro (DR).

**Desventajas**

- **Complejidad de integración**: gestionar dos mundos con herramientas distintas.
- **Requisitos de conectividad**: dependencia de la red entre ambos entornos.
- **Coste de la interconexión**: VPN/Direct Connect/ExpressRoute tienen precio.
- **Seguridad más difícil**: superficie de ataque ampliada (más puntos de entrada).
- **Gobernanza compleja**: políticas y cumplimiento que deben ser consistentes en ambos lados.

#### 2.3.2 Casos de uso

- Grandes empresas con **aplicaciones legacy** que no migran fácilmente.
- **Banca**: datos core en privado, analítica y web en la nube pública.
- **Industria/retail**: sistemas críticos on-premise + e-commerce elástico en la nube.
- **Recuperación ante desastres**: la nube pública como sitio de respaldo.

:::info Idea clave
La nube híbrida combina **lo mejor de ambos mundos**: control y cumplimiento de la privada, más agilidad y escala de la pública, unidos por conectividad dedicada. El precio es la **complejidad** de operar y proteger dos entornos como si fueran uno.
:::

### 2.4 Nube Comunitaria (Community Cloud)

Es un modelo en el que la infraestructura cloud se comparte entre **varias organizaciones** con **intereses, objetivos o requisitos normativos comunes** (por ejemplo, hospitales de una misma región, universidades de un consorcio, agencias de un gobierno). La infraestructura puede ser gestionada por una de las organizaciones, por un tercero, o por ambas.

![nube Comunitaria](/aws/cloud-img/modelos-despliegue-nube-comunity.jpg)

#### 2.4.1 Cómo funciona

- Varias organizaciones **se agrupan** y comparten una infraestructura cloud dedicada.
- Comparten **costes, experiencia y equipos de operación**.
- Aplican políticas de **cumplimiento comunes** (protección de datos de salud, clasificación de información de defensa, etc.).
- Cada organización conserva su **aislamiento lógico** dentro de la infraestructura compartida.

#### 2.4.2 Cuándo se utiliza

- Cuando **varias entidades del mismo sector** deben cumplir la misma normativa.
- Cuando el **coste de una nube privada individual** es demasiado alto para cada organización.
- Cuando se necesita colaborar **compartiendo datos** de forma segura (redes de salud, investigación académica).
- En **gobierno, salud, educación y defensa**, donde hay estándares comunes obligatorios.

#### 2.4.3 Ventajas y desventajas

**Ventajas**

- **Coste compartido** entre varias organizaciones (más barato que una privada individual).
- **Cumplimiento sectorial** centralizado: una sola solución normativa para todos.
- **Colaboración segura**: datos compartidos entre miembros bajo reglas pactadas.
- **Especialización**: infraestructura adaptada a las necesidades del sector.

**Desventajas**

- **Menos control** que una nube privada individual (hay que pactar gobernanza).
- **Aislamiento limitado**: compartes infraestructura con otras organizaciones.
- **Complejidad de gobernanza**: acuerdos, reglas de uso y reparto de responsabilidades.
- **Menos disponible en el mercado** que las nubes públicas y privadas.

:::info Idea clave
La nube comunitaria es la **"privada en grupo"**: varias organizaciones de un mismo sector comparten infraestructura para **repartir costes y cumplir normativa común**, a cambio de **gobernanza pactada** y menos control individual. Es muy relevante en gobierno, salud, educación y defensa.
:::

## 3. Multi-nube (Multi-cloud)

Aunque no es un modelo de implementación física, el enfoque multi-nube implica utilizar múltiples proveedores de nube pública (por ejemplo, AWS y Azure a la vez) para evitar la dependencia de un solo proveedor o para aprovechar las fortalezas específicas de cada uno.

![multi-nube](/aws/cloud-img/modelos-despliegue-multi-cloud.jpg)

## 4. Comparación entre modelos de despliegue

| Criterio | Pública | Privada | Híbrida | Comunitaria |
|---|---|---|---|---|
| **Costes** | Bajo (OPEX) | Alto (CAPEX) | Medio/optimizable | Compartido (bajo por organización) |
| **Seguridad** | Media (proveedor) | Alta (control propio) | Alta (segmentada) | Media-alta (reglas comunes) |
| **Escalabilidad** | Muy alta | Limitada | Muy alta (con la pública) | Media |
| **Flexibilidad** | Alta | Media | Máxima | Baja-media |
| **Control** | Bajo | Total | Medio | Medio (compartido) |
| **Cumplimiento** | Bajo-medio | Máximo | Alto (segmentado) | Alto (por sector) |
| **Rendimiento** | Variable por ubicación | Predecible (local) | Depende de la conectividad | Depende del consorcio |
| **Administración** | Mínima | Máxima | Compleja | Compartida |
| **Caso de uso ideal** | Cargas variables y ágiles | Datos regulados y críticos | Equilibrar control y escala | Sectores regulados con coste compartido |

:::info Idea clave
No hay un modelo "mejor": hay un **triángulo de compensaciones** entre coste, control y escala. La pública optimiza coste y escala; la privada, control y cumplimiento; la híbrida equilibra; la comunitaria reparte costes entre pares regulados. La tabla de cuatro columnas resume todas las decisiones.
:::