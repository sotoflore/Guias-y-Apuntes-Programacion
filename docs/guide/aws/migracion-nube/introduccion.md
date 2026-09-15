# Introducción a la migración

La **migración** a la nube hace referencia al proceso que implica trasladar los activos digitales, los recursos de TI, las aplicaciones y las bases de datos de su organización (on-premises) desde la infraestructura en las instalaciones a la nube de AWS. Esto supone la planificación estratégica, la implementación y la administración continua para lograr una transición fluida y exitosa. Generalmente, no es un movimiento que se realiza una sola vez. En el caso de grandes migraciones, las empresas pueden hacerlo por fases o etapas.

La migración permite a las organizaciones aprovechar las ventajas de la computación en la nube, como escalabilidad, flexibilidad, alta disponibilidad y un modelo de pago por uso, además de reducir la necesidad de mantener infraestructura física propia.

Sin embargo, migrar a AWS no consiste simplemente en "mover servidores". Es necesario analizar las aplicaciones y cargas de trabajo, evaluar dependencias, seleccionar una estrategia de migración adecuada y planificar aspectos como seguridad, costos, rendimiento y continuidad del negocio.

Una migración normalmente comienza con:

>**Evaluar → Planificar → Migrar → Validar → Optimizar**

## 1. Las tres fases del proceso de migración

AWS guía a las empresas durante el proceso de migración, que se puede dividir en tres fases secuenciales. Existen servicios y herramientas de AWS para respaldar su migración desde la primera fase hasta la última. Si bien esta no es una lista exhaustiva de todos los servicios de migración de AWS, estos servicios clave lo ayudarán a ponerse en marcha.

![fases del proceso de migración](/aws/migracion/migracion-fases.png)

1. **Evaluar**. En esta fase, usted elabora el caso empresarial para la migración y evalúa su preparación. Uno de los servicios que se utilizan en esta fase es **Migration Evaluator**.

2. **Movilizar**. En esta fase, usted prepara la organización y moviliza los recursos necesarios para la migración. Dos servicios que puede utilizar en esta fase son **AWS Application Discovery Service** y **AWS Migration Hub**.

3. **Migrar y modernizar**. En esta fase, utiliza su estrategia, su plan y las prácticas recomendadas para migrar y modernizar. Las herramientas que lo respaldan incluyen **AWS Application Migration Service** y **AWS Database Migration Service** (AWS DMS). Si va a transferir datos, puede usar **AWS DataSync**, **AWS Transfer Family** y **AWS Snow Family**.

Si bien **AWS Migration Hub** lo ayuda a movilizar sus recursos, también puede usarlo como un lugar único para administrar durante la fase de migración y modernización.

---

**Referencias recomendadas:**

- [Las tres fases de la migración](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-migration/overview.html)
