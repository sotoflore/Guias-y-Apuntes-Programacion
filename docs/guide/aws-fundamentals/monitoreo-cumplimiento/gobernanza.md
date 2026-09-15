# Gobernanza en la nube de AWS

A medida que una organización escala verticalmente, puede tener dificultades para administrar los servicios y las cuentas, incluidas las nuevas cuentas de AWS, los servicios de AWS que eligen e incluso las licencias de software.

Los siguientes tres servicios de AWS pueden ayudar a administrar y controlar los servicios y las cuentas para cumplir con los requisitos de su empresa:

- AWS Control Tower
- AWS Service Catalog
- AWS License Manager

Si desea aplicar y administrar las reglas de seguridad en todas las organizaciones y cuentas, puede usar AWS Control Tower.

## 1. AWS Control Tower

![AWS Control Tower](/icons/aws-control-tower.svg)

**AWS Control Tower** es un servicio que puede usar con el fin de aplicar y administrar las reglas de gobernanza para la seguridad, las operaciones y el cumplimiento a escala en todas sus organizaciones y cuentas en la nube de AWS.

**Beneficios**

AWS Control Tower puede ayudarle a ahorrar tiempo y proporcionar gobernanza a la vez. Utiliza controles preconfigurados, que pueden ayudarle a configurar rápidamente entornos de cuentas múltiples, automatización con gobernanza integrada e integración de software de terceros a escala.

**Casos de uso**

Utilice AWS Control Tower para implementar aplicaciones rápidamente y aprovisionar cuentas de AWS que cumplan con las normas.

Las características de AWS Control Tower:

![características de AWS Control](/aws/monitoreo/monitoreo-aws-control-tower.png)

1. **Panel**. El panel de AWS Control Tower brinda una supervisión continua para ver las cuentas aprovisionadas en toda la empresa. AWS Control Tower también cuenta con controles para la aplicación de políticas y puede ayudar a detectar los recursos que no cumplen con las normas.

2. **Account Factory**. AWS Control Tower Account Factory es una plantilla de cuentas configurable que estandariza el aprovisionamiento de cuentas nuevas.

3. **Controles**. Los controles, a veces denominados barreras de protección, son reglas de alto nivel que proporcionan gobernanza para el entorno general de AWS.

4. **Zona de aterrizaje**. Una zona de aterrizaje es un entorno de cuentas múltiples bien diseñado que se basa en las prácticas recomendadas de seguridad y cumplimiento. Es el contenedor de toda la empresa que alberga todas las unidades organizativas (UO), cuentas, usuarios y recursos que desea regular para garantizar el cumplimiento.

Administrar las solicitudes de nuevos servicios o recursos de AWS por parte de los empleados puede llevar mucho tiempo, pero tampoco querrá que todo el mundo tenga que adivinar qué tipo de servicios y configuraciones deben usarse. Ahí es donde **Service Catalog** puede ayudar.

## 2. AWS Service Catalog

![AWS Service Catalog](/icons/aws-service-catalog.svg)

Con **Service Catalog**, puede crear, compartir y organizar a partir de un catálogo seleccionado de recursos de AWS. Puede implementar herramientas de seguridad y recursos de red básicos para las nuevas cuentas de AWS, de modo que pueda controlar de manera coherente.

**Beneficios**

Service Catalog ahorra tiempo al facilitar la búsqueda e implementación de recursos de nube de autoservicio aprobados. También le ayuda a mantenerse ágil y, al mismo tiempo, a mejorar la gobernanza de los recursos en varias cuentas.

**Casos de uso**

Utilícelo para aprovisionar recursos en las cuentas de AWS, aplicar controles de acceso y acelerar el aprovisionamiento de canalizaciones de integración continua y entrega continua (CI/CD).

![AWS Service Catalog](/aws/monitoreo/monitoreo-aws-service-catalog.png)

Cuando las empresas pasan del entorno en las instalaciones a la nube, deben decidir cómo gestionar sus licencias de software. Con el **modelo Bring Your Own License** (traiga su propia licencia, BYOL) de AWS, pueden usar las licencias de software existentes adquiridas directamente de proveedores, como Microsoft, en servicios de AWS, como hosts dedicados de Amazon EC2 y Amazon WorkSpaces. Esto puede suponer un ahorro de costos significativo en comparación con la compra de licencias directamente de AWS. Al usar BYOL con las licencias existentes en un entorno de nube, obtiene flexibilidad y posibles costos optimizados. El servicio que lo ayuda a administrar y controlar sus licencias de software es AWS License Manager.

## 3. AWS License Manager

![AWS License Manager](/icons/aws-license-manager.svg)

**License Manager** es un servicio que le ayuda a administrar sus licencias de software y ajustar los costos relacionados.

**Beneficios**

License Manager ayuda con la visibilidad y el control, el seguimiento y la administración de las licencias, y la reducción del riesgo de incumplimiento de las licencias.

**Casos de uso**

Uselo para optimizar la administración de licencias y simplificar la experiencia de movilidad de licencias de Microsoft a través de Software Assurance. También puede usarlo con el fin de automatizar la distribución y la activación de los derechos de software en las cuentas de AWS para los usuarios finales.

![AWS License Manager](/aws/monitoreo/monitoreo-aws-license-manager.png)

La administración de las licencias de software puede llevar mucho tiempo, ser costosa y difícil de aplicar. License Manager ayuda a reducir el riesgo de incumplimiento al aplicar los límites de uso de las licencias, bloquear los nuevos lanzamientos y utilizar otros controles.


:::info Los tres servicios de gobernanza
- **AWS Control Tower**. Un servicio que puede usar para configurar y controlar un entorno de AWS seguro, conforme y de cuentas múltiples según las prácticas recomendadas.
- **Service Catalog**. Un servicio que puede usar para crear, compartir y organizar los servicios y recursos de AWS a partir de un catálogo seleccionado por usted.
- **License Manager**
Un servicio que le ayuda a administrar sus licencias de software y ajustar los costos relacionados.

:::

---

**Referencias recomendadas**:

- [AWS Control Tower](https://aws.amazon.com/controltower/)
- [AWS Service Catalog](https://aws.amazon.com/servicecatalog/)
- [AWS License Manager](https://aws.amazon.com/license-manager/)