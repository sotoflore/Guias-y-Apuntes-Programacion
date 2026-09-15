# AWS Organizations

A medida que las empresas crecen y escalan, la administración y la gobernanza de distintas cuentas de AWS pueden ser un desafío. Ahí es donde **AWS Organizations** puede ayudar.

## 1. AWS Organizations

![AWS Organizations](/icons/aws-organizations.svg)

Este servicio ayuda a administrar y controlar su entorno de forma centralizada a medida que crece y escala sus recursos de AWS. Le permite administrar las políticas de los grupos de cuentas y automatizar la creación de cuentas.

### 1.1 Beneficios

Organizations ofrece varios beneficios, como escalar rápidamente su entorno mediante la creación programática de nuevas cuentas de AWS para los recursos y los equipos. También ayuda al simplificar la administración de permisos a través de las políticas de control de servicios (service control policies, SCP) y a administrar y optimizar los costos en sus cuentas y recursos de AWS.

### 1.2 Casos de uso

Se puede usar para automatizar la creación de cuentas de AWS, proporcionar herramientas y acceso a sus equipos de seguridad, controlar el acceso de los usuarios a los servicios designados y compartir recursos comunes entre cuentas.

### 1.3 Conceptos clave de Organizations

Una **organización** es un conjunto de cuentas de AWS que puede administrar de forma centralizada y organizar en una estructura jerárquica similar a un árbol, con **una raíz en la parte superior** y **unidades organizativas** (UO) anidadas debajo de la raíz. Cada cuenta se puede ubicar directamente en la raíz o en una de las UO de la jerarquía.

**Cómo funciona AWS Organizations**

![Conceptos clave de Organizations](/aws/monitoreo/conceptos-clave-de-organizations.png)

1. **AWS Organizations**. AWS Organizations se usa para consolidar y administrar varias cuentas de AWS en una ubicación central. Cuando crea una organización, se crea automáticamente una raíz, que es el contenedor principal de todas las cuentas de su organización.

2. **Cuenta de administración**. La cuenta de administración es la cuenta central de AWS que crea y administra la organización. Es responsable del control y la gobernanza a nivel general.

3. **Unidad organizativa (UO)**. Una unidad organizativa (UO) es una agrupación lógica de cuentas en una organización de AWS. Las UO pueden contener cuentas de miembros o UO anidadas.

4. **Políticas de control de servicios (SCP)**. Una SCP es una política que le permite restringir los servicios, los recursos y las acciones individuales de la API de AWS a los que pueden acceder los usuarios y los roles de cada cuenta. Las SCP se pueden aplicar a las UO o a las cuentas de miembros individuales.

5. **La cuenta de miembro no está en una UO.** Si tiene una cuenta de miembro que tiene requisitos únicos que no se superponen con los de una unidad organizativa, puede agregarlos a la organización. No es necesario colocarlos bajo una UO. Esta cuenta aún puede aprovechar beneficios como la facturación unificada.

Al diseñar su organización, debe tener en cuenta las necesidades empresariales, de seguridad y reglamentarias de cada departamento. Utilice esa información para decidir qué departamentos se agrupan en las UO.

---

**Referencias recomendadas**:

- [AWS Organizations Documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)
- [AWS Organizations](https://aws.amazon.com/organizations/)