# El estado de los recursos en la nube de AWS

El **estado de los recursos** en la nube de AWS hace referencia a la información que permite conocer si los recursos y servicios que utilizamos están funcionando correctamente, presentan algún problema, requieren mantenimiento o podrían verse afectados por algún evento de AWS. Tener visibilidad sobre este estado es fundamental para mantener la disponibilidad, confiabilidad y continuidad de las aplicaciones.

AWS proporciona diferentes herramientas para consultar y supervisar el estado de los recursos. Una de las más importantes es **AWS Health**, que proporciona información personalizada sobre eventos que pueden afectar a los recursos de una cuenta, como interrupciones del servicio, mantenimientos programados o cambios importantes.

**Por ejemplo**, si una instancia de Amazon EC2 se encuentra afectada por un mantenimiento programado de la infraestructura de AWS, AWS Health puede proporcionar información sobre el evento y, cuando corresponda, indicar qué recursos están afectados y qué acciones pueden ser necesarias.

**¿Qué información podemos conocer?**

El estado de los recursos puede ayudarnos a identificar:

- Recursos funcionando correctamente.
- Mantenimientos o eventos programados.
- Problemas o interrupciones que afectan a recursos.
- Eventos que requieren atención o acción.
- Cambios importantes en los servicios de AWS.

## 1. AWS Health

**AWS Health** es un servicio de AWS que proporciona información personalizada sobre el estado de los servicios y recursos de AWS que utiliza una cuenta. Su objetivo principal es ayudar a los usuarios y administradores a conocer rápidamente si existe algún problema, mantenimiento programado o evento que pueda afectar a sus aplicaciones y recursos.

AWS Health es el origen de datos de referencia para los eventos y cambios que afectan al estado de sus recursos en la nube de AWS. Le notifica sobre los eventos de servicio, los cambios planificados y las notificaciones de la cuenta para ayudarle a administrar y tomar medidas.

>Notificaciones sobre eventos de servicio

A diferencia de una herramienta de monitoreo tradicional, que normalmente observa métricas como CPU, memoria o tráfico, AWS Health informa sobre eventos relacionados con la infraestructura y los servicios de AWS que pueden afectar al entorno del cliente. Por ejemplo, puede informar sobre una interrupción de un servicio, mantenimiento programado o cambios que requieren alguna acción por parte del usuario.

AWS Health proporciona información a través de diferentes tipos de eventos, entre ellos:

- **Eventos operativos**: problemas o cambios que pueden afectar a los recursos de AWS.
- **Mantenimiento programado**: actividades planificadas que podrían afectar temporalmente a determinados recursos.
- **Notificaciones de seguridad**: información relacionada con eventos o acciones de seguridad que pueden requerir atención.
- **Cambios importantes**: avisos sobre modificaciones en servicios o funcionalidades que podrían requerir acciones.

### 1.1 Panel de AWS Health

![Panel de AWS Health](/icons/aws-panel-health.svg)

Con el **Panel de AWS Health** (AWS Health Dashboard), puede ver la información de estado específica de la cuenta y obtener actualizaciones sobre los eventos de AWS Health. También puede usar AWS Health mediante programación con la API de AWS Health, que está disponible con AWS Premium Support.

>El **AWS Health Dashboard** permite consultar el estado y los eventos relevantes para la cuenta. Puede mostrar información sobre: Problemas actuales, Mantenimiento programado, Cambios importantes, Eventos que afectan a recursos.

Una **característica importante** es que AWS Health proporciona información específica de la cuenta, mientras que la página pública AWS Health Dashboard muestra información general sobre la disponibilidad de los servicios de AWS.

**Beneficios**

El Panel de AWS Health proporciona información valiosa como origen de datos para eventos y cambios. Le brinda orientación oportuna y práctica para solucionar los problemas. También ayuda a administrar el estado de los servicios y está integrado y automatizado para su uso a escala.

**Casos de uso**

Utilice el Panel de AWS Health para ver la información de estado específica de la cuenta. También puede usarlo para planificar eventos del ciclo de vida o solucionar un incidente. 

![Panel de AWS Health](/aws/monitoreo/monitoreo-estado-recurso.png)

---

**Referencias recomendadas**:

- [AWS Health](https://aws.amazon.com/premiumsupport/technology/aws-health/)