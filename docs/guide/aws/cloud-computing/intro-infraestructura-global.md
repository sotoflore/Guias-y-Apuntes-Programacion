# Introducción a la infraestructura global de AWS

¿Alguna vez te has preguntado cómo AWS logra mantener sus servicios funcionando prácticamente sin interrupciones, sin importar dónde te encuentres en el mundo? La respuesta está en su infraestructura global, una red física cuidadosamente diseñada que sostiene todo lo que construyes en la nube.

En esta lección descubrirás cómo está organizada esta infraestructura y por qué su configuración única le permite ofrecer beneficios clave como alta disponibilidad y tolerancia a errores. Conocerás los conceptos fundamentales —centros de datos, zonas de disponibilidad y regiones de AWS— que son la base sobre la que se apoya todo lo demás.

Este es solo el primer paso: más adelante, en una lección posterior de esta formación, profundizarás en los componentes más avanzados de la infraestructura. Por ahora, entender estos fundamentos te dará la base necesaria para avanzar con confianza en tu camino hacia AWS.

## 1. Regiones y zonas de disponibilidad de AWS

La **infraestructura global de AWS** consta de ubicaciones físicas en todo el mundo que contienen grupos de centros de datos. 

![Introducción a la infraestructura global de AWS](/aws/cloud-img/cloud-computing-intro-infraestructura-global.jpg)

1. **Regiones de AWS**. Son ubicaciones físicas en todo el mundo que contienen grupos de centros de datos. Estos grupos de centros de datos se denominan zonas de disponibilidad. Cada región de AWS consta de un mínimo de tres zonas de disponibilidad físicamente separadas dentro de un área geográfica.

2. **Zonas de disponibilidad**. Una zona de disponibilidad consiste en uno o más centros de datos con alimentación, redes y conectividad redundantes. Las regiones y las zonas de disponibilidad están diseñadas para proporcionar acceso a los servicios con baja latencia y tolerancia a errores para los usuarios de un área determinada.

## 2. Cómo alcanzar la alta disponibilidad con la infraestructura global de AWS

La **infraestructura de AWS** está diseñada teniendo en cuenta la **alta disponibilidad** y la **tolerancia a errores**. Las zonas de disponibilidad (AZ) se configuran como recursos aislados y cada una de ellas está equipada con alimentación, redes y conectividad.

Se recomienda distribuir los recursos en varias AZ. De este modo, si una AZ sufre una interrupción, sus aplicaciones empresariales seguirán funcionando con normalidad. Con este enfoque de redundancia y aislamiento de recursos, los clientes de AWS pueden obtener los beneficios de la alta disponibilidad y la tolerancia a errores.

---

**Referencias recomendadas:**

- [Regiones y zonas de disponibilidad](https://aws.amazon.com/es/about-aws/global-infrastructure/regions_az/)