# Permisos y Acceso de Usuario

En AWS, los permisos y el acceso de usuario son fundamentales para **controlar quién puede acceder** a los recursos de AWS, **qué acciones puede realizar** y sobre qué recursos puede ejecutarlas. Este concepto forma parte de la seguridad de AWS y busca aplicar el **principio de mínimo privilegio**, es decir, proporcionar a cada usuario o servicio únicamente los permisos que necesita para realizar su trabajo.

El servicio principal utilizado para administrar identidades y permisos es **AWS Identity and Access Management (IAM)**. Con IAM puedes crear y administrar **usuarios**, **grupos**, **roles** y **políticas**, y definir reglas precisas como, por ejemplo, permitir que un usuario consulte objetos de Amazon S3, pero impedirle eliminarlos.

![iam intro](/aws/security-img/iam-intro.jpg)

## 1. AWS Identity and Access Management

![iam](/icons/amazon-iam.svg)

Administre de forma segura las identidades y el acceso a los servicios y recursos de AWS.

Una de las mejores formas de prevenir incidentes relacionados con la seguridad antes de que ocurran es administrar los permisos y el acceso de manera adecuada. Con **IAM**, todas las acciones están denegadas de forma predeterminada. Se debe conceder permiso explícito a alguien antes de que esa persona pueda realizar cualquier acción en su cuenta.

Al conceder permisos, debe dar acceso únicamente cuando sea necesario. Este concepto se denomina principio de mínimo privilegio.

>El **principio de mínimo privilegio** dicta que las personas y los sistemas deben tener acceso a lo que necesitan y nada más.

IAM ofrece **usuarios**, **grupos** y **roles** para que pueda configurar el acceso en función de las necesidades operativas y de seguridad específicas de su empresa. Las **políticas** de IAM son las que definen el acceso necesario para estas identidades.

![AWS Identity and Access Management](/aws/security-img/seguridad-intro-iam.png)

1. **Usuario raíz de la cuenta de AWS**. Todas las cuentas de AWS reciben un usuario raíz. El usuario raíz es el propietario de la cuenta de AWS y tiene permiso para hacer cualquier cosa dentro de ella. Debe asociar una contraseña segura a esta cuenta privilegiada y activar la autenticación multifactor (MFA), que requiere al menos dos métodos de verificación para iniciar sesión. Para gestionar las tareas diarias, debe crear otras identidades de IAM, tales como los usuarios.

2. **Usuarios de IAM**. Un usuario de IAM representa a una persona o aplicación que interactúa con los servicios y los recursos de AWS. Consta de un nombre y credenciales. AWS recomienda crear usuarios de IAM individuales para cada persona que necesite tener acceso a la cuenta de AWS, de modo que cada una tenga su propio conjunto único de credenciales de seguridad.

3. **Grupos de IAM**. Un grupo de IAM es un conjunto de usuarios de IAM. Al conceder permisos a un grupo, estos se asignan a todos los usuarios dentro de él. Por ejemplo, puede asignar permisos de acceso estándar a un grupo denominado “empleados” para que todos los empleados reciban el mismo acceso genérico.

4. **Roles de IAM**. Un rol de IAM es una identidad que puede asumir para obtener acceso temporal a permisos. Por ejemplo, es posible que un empleado deba trabajar como barista por la mañana y como cajero por la tarde. Cuando alguien asume un rol de IAM, abandona todos los permisos que tenía en el rol anterior y recibe los permisos del nuevo.

5. **Políticas de IAM**. Una política de IAM es un documento JSON que concede o deniega los permisos para acceder a los servicios y los recursos de AWS. Las políticas de IAM también pueden definir el nivel de acceso que se tiene a los recursos. Por ejemplo, puede permitir que los empleados accedan a todos los buckets de Amazon S3 dentro de su cuenta de AWS o solo a un bucket específico.

## 2. Servicios adicionales de administración del acceso

Analicemos algunos servicios adicionales de AWS que pueden ayudar a aplicar el principio de mínimo privilegio en todos los entornos de AWS. En conjunto, estos servicios ayudan a optimizar la administración de los entornos de AWS y, al mismo tiempo, reforzar sus prácticas de seguridad.


### 2.1 AWS IAM Identity Center

![AWS IAM Identity Center](/icons/iam-identity-center.svg)

**IAM Identity Center** centraliza la administración de las identidades y los accesos de las cuentas y aplicaciones de AWS. IAM Identity Center también puede conectarse a una fuente de identidad existente y proporcionar a sus empleados un acceso de inicio de sesión único a todos los servicios y las cuentas de AWS conectados. A esto se lo conoce como administración de identidad federada.

>La **administración de identidad federada** es un sistema que permite a los usuarios acceder a múltiples aplicaciones, servicios o dominios por medio de un único conjunto de credenciales.


### 2.2 AWS Secrets Manager

![AWS Secrets Manager](/icons/aws-secrets-manager.svg)

**Secrets Manager** proporciona una forma segura de administrar, rotar y recuperar las credenciales de la base de datos, las claves de API y otros datos confidenciales durante todo su ciclo de vida. Esto permite que sus aplicaciones, servicios y recursos de TI se mantengan seguros.

>Los **secretos** son información confidencial o privada que solo personas o grupos específicos pueden conocer. Esto incluye, por ejemplo, contraseñas, credenciales de bases de datos y claves de API.

### 2.3 AWS Systems Manager

![AWS Systems Manager](/icons/aws-systems-manager.svg)

**Systems Manager** proporciona una vista centralizada de los nodos de las cuentas y regiones de su organización, al igual que de los entornos híbridos y multinube. Con este servicio, puede acceder rápidamente a la información de los nodos, como los detalles de la identificación y del sistema operativo, y automatizar las ediciones del registro, la administración de usuarios y la aplicación de parches de seguridad.

>Los **nodos** son puntos de conexión dentro de una red, un sistema o una estructura.

---

**Referencias recomendadas**:

- [AWS Identity and Access Management (AWS IAM)](https://aws.amazon.com/iam/)
- [AWS IAM Identity Center](https://aws.amazon.com/iam/identity-center/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [AWS Systems Manager](https://aws.amazon.com/systems-manager/)