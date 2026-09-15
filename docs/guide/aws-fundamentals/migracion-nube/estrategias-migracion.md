# Estrategias de Migración

Las **estrategias de migración** en AWS son diferentes enfoques que una organización puede utilizar para trasladar sus aplicaciones, datos y cargas de trabajo desde una infraestructura existente hacia AWS. La estrategia adecuada depende de factores como los objetivos del negocio, la complejidad de la aplicación, los costos, el tiempo disponible y el nivel de modernización que se desea alcanzar.

Cuando una empresa migra a la nube de AWS, tiene muchas opciones. Hay siete estrategias de migración para que las organizaciones alcancen sus objetivos. La empresa puede elegir ciertas estrategias según sus necesidades específicas y los tipos de aplicaciones, el punto de partida y los planes a futuro.

Una forma sencilla de visualizarlo es:

>**Retire → Retain → Rehost → Relocate → Repurchase → Replatform → Refactor**

## 1. Siete estrategias de migración

Cuando los clientes migran aplicaciones a la nube, pueden usar siete estrategias de migración comunes. La decisión sobre qué estrategia usar depende de factores como la complejidad de las aplicaciones existentes, los objetivos empresariales, las limitaciones de tiempo y los recursos disponibles. Con frecuencia, las organizaciones utilizan una combinación de estas estrategias en toda su cartera de aplicaciones. Al considerar cuidadosamente cada opción y alinearla con aplicaciones y objetivos específicos, las organizaciones pueden crear un plan de migración personalizado que maximice los beneficios de la adopción de la nube y minimice los riesgos y las interrupciones.

![Siete estrategias de migración](/aws/migracion/migracion-estrategias-migracion.png)

1. **Reubicar** (Relocate). Es cambiar la ubicación del alojamiento a la nube. Esto podría ocurrir si las aplicaciones ya son máquinas virtuales (VM) o contenedores que se ejecutan en las instalaciones y luego se trasladan a la nube.

2. **Realojar** (Rehost). Volver a alojar, también conocida como levantar y mover, implica mover las aplicaciones sin cambios. En un escenario de migración de sistemas heredados de gran envergadura, en el que la empresa busca implementar su migración y escalar rápidamente para cumplir con un caso empresarial, la mayoría de las aplicaciones se vuelven a alojar.

3. **Redefinir la plataforma** (Replatform). También conocida como levantar, remendar y mover, implica llevar a cabo algunas optimizaciones en la nube para lograr un beneficio tangible. La optimización se logra sin cambiar la arquitectura central de la aplicación.

4. **Refactorizar** (Refactor). También conocida como reestructurar, implica volver a pensar la forma en que se diseña y desarrolla una aplicación mediante el uso de características creadas para la nube. La refactorización está impulsada por una fuerte necesidad empresarial de agregar características, escalar o mejorar el rendimiento que, de otro modo, serían difíciles de lograr en el entorno actual de la aplicación.

5. **Recomprar** (Repurchase). Volver a comprar implica pasar de una licencia tradicional a un modelo de software como servicio (SaaS). **Por ejemplo**, una empresa puede optar por implementar la estrategia de recompra migrando de un sistema de administración de relaciones con los clientes (customer relationship management, CRM) a un nuevo software de fuerza de ventas.

6. **Retener** (Retain). La retención consiste en mantener las aplicaciones críticas para el negocio en el entorno de origen. Esto podría incluir aplicaciones que requieran una gran refactorización a fin de poder migrarse o trabajos que pueden posponerse para más adelante.

7. **Retirar** (Retire). El retiro es el proceso de eliminar aplicaciones que ya no son necesarias.

Las **7 Rs** ayudan a decidir qué hacer con cada carga de trabajo durante una migración: retirarla, conservarla, trasladarla, reemplazarla, modificarla o rediseñarla.

La diferencia fundamental está en cuánto cambia la aplicación:

>**Rehost** → pocos cambios
>
>**Replatform** → algunos cambios
>
>**Refactor** → muchos cambios / rediseño

:::info Recuerda
- **Retire (retirar)**: retirar aplicaciones que ya no son necesarias.
- **Retain (retener)**: mantener una aplicación en el entorno actual.
- **Rehost (realojar)**: trasladar la aplicación prácticamente sin modificaciones (lift and shift).
- **Relocate (reubicar)**: trasladar cargas de trabajo a otra infraestructura o servicio con pocos cambios.
- **Repurchase (recomprar)**: reemplazar una aplicación existente por otra solución, normalmente adoptando un producto o servicio diferente.
- **Replatform (redefinir la plataforma)**: realizar algunas modificaciones para aprovechar beneficios de AWS sin rediseñar completamente la aplicación.
- **Refactor (refactorizar)**: rediseñar la aplicación para aprovechar al máximo las capacidades nativas de la nube.

:::

---

**Referencias recomendadas:**

- [Siete estrategias de migración (7 R)](https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html)