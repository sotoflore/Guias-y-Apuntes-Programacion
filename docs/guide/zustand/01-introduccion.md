# Introducción

**Zustand** es una librería de gestión de estado para aplicaciones React, basada en el patrón **flux-like**, que permite crear stores centralizados con una API mínima y declarativa. Se distingue por su simplicidad, rendimiento y flexibilidad, al eliminar la necesidad de boilerplate típico de herramientas como Redux.

**Zustand** utiliza un sistema de suscripción selectiva que permite que los componentes React se actualicen únicamente cuando cambian las partes del estado a las que están vinculados, evitando renderizados innecesarios y mejorando el rendimiento general.

>Zustand se inspira en el patrón Flux pero lo abstrae detrás de una interfaz de hook de React. Su objetivo principal es hacer que la gestión de estado se sienta tan natural como usar el useState de React, pero con alcance global.

Además, su diseño modular permite el uso de middlewares (como **`persist`**, **`devtools`** o **`subscribeWithSelector`**) y es completamente compatible con TypeScript, React Native y SSR (Server-Side Rendering), lo que lo convierte en una opción escalable tanto para proyectos pequeños como para aplicaciones empresariales.

:::info Documentación Oficial
https://zustand.docs.pmnd.rs/learn/getting-started/introduction
:::

**Características**:

- **Persistencia del Estado:** Aunque el estado se pierde al actualizar la página, **Zustand** permite la integración con la extensión **zustand-persist**, que almacena el estado en el almacenamiento local del navegador (localStorage o sessionStorage), evitando la pérdida de datos entre sesiones.

- **Flexibilidad:** No impone una arquitectura específica, lo que permite a los desarrolladores definir sus propias acciones y mutadores para actualizar el estado según sus necesidades. Esto lo convierte en una opción versátil para diferentes tipos de aplicaciones.

- **Menos Código Repetido:** Comparado con **Redux**, **Zustand** requiere menos código para lograr la misma funcionalidad, lo que reduce la complejidad en la gestión del estado.

## ¿Cuándo usar Zustand?
- Gestionar el estado global de aplicaciones React.
- Crear aplicaciones de una sola página (SPA).
- Manejar datos complejos y cambiantes.
- Optimizar el rendimiento de tu aplicación.

## Conceptos Fundamentales

### 1. Store

El store es el núcleo de Zustand. Representa una fuente única de verdad donde se define el estado global de la aplicación y las funciones (acciones) que lo modifican.

Se crea utilizando la función **`create()`** de Zustand que recibe un setter (**`set`**) y opcionalmente un getter (**`get`**), la cual genera un Custom Hook (un hook personalizado de React) que contiene tanto el estado (state) como las funciones para modificarlo (actions o mutadores).

**Propósito Principal**:

- Centralizar el estado global y las acciones de mutación.

### 2. State (Estado)
El state es el conjunto de datos que representa la situación actual de la aplicación. En Zustand, cada componente puede suscribirse a partes específicas del estado, lo que evita renders innecesarios y mejora el rendimiento.

Es inmutable en su esencia (aunque se expone una API mutable para la actualización), lo que asegura la previsibilidad de los cambios.

**Propósito Principal**:

- Almacenar la información que debe ser compartida y persistente a través de la aplicación.

### 3. Actions (Acciones)
Son funciones definidas dentro del Store que reciben el setter (**`set`**) como argumento. Estas funciones son la única forma de modificar el Estado de manera controlada. Estas acciones pueden ser síncronas o asíncronas, facilitando la integración con APIs, bases de datos, etc.

**Propósito Principal**:

- Encapsular la lógica de negocio y garantizar las actualizaciones de estado de forma atómica y trazable.

### 4. Set y Get

#### set()
Función que permite actualizar el estado. Permite la mutación segura y reactiva del estado, asegurando que los componentes suscritos sean notificados y se re-rendericen de forma eficiente ante los cambios pertinentes.

#### get()
Función que devuelve el estado actual. Provee una lectura sincrónica y confiable del estado actual dentro del store, evitando dependencias externas y permitiendo construir lógicas internas más complejas (por ejemplo, validaciones, cálculos o actualizaciones condicionales basadas en el estado vigente).

### 5. Selectors (Selectores)
Un selector es una función que extrae una parte específica del estado. El mecanismo dentro del useStore hook que permite a un componente extraer selectivamente solo la porción del estado que necesita.

**Propósito principal**:

- Optimizar el rendimiento al prevenir re-renderizados innecesarios del componente, ya que solo se activará si el valor seleccionado ha cambiado.

### 6. Middleware
Zustand incluye un sistema de middlewares que permite extender la funcionalidad del store, añadiendo características como:

- Persistencia: guarda el estado en localStorage o AsyncStorage.
- DevTools: integra el store con Redux DevTools.
- Logger, immer, u otros middlewares personalizados.

### 7. Subscribers (Suscriptores)
Además de los hooks, Zustand permite suscribirse manualmente al estado sin usar React, ideal para lógica fuera de componentes.

```js
const unsubscribe = useStore.subscribe((state) => console.log(state.count));
```
## Ventajas de usar Zustand

- **Sin Providers**: No requiere envolver la aplicación con un componente Provider (a diferencia de Redux o Context API), lo que simplifica la estructura del árbol de componentes.
- **Rendimiento**: Realiza re-renderizados mínimos, solo en los componentes que consumen la porción de estado que ha cambiado, gracias a su sistema de selectores.
- **Agnóstico**: Aunque es muy popular en React, puede usarse fuera de él (con Vanilla JavaScript) debido a su naturaleza desacoplada.
- **Estado mutable e inmutable**: Aunque suene contradictorio, Zustand combina lo mejor de ambos mundos. Usa inmutabilidad bajo el capó para prevenir efectos secundarios no deseados, pero expone una API mutable, que es más intuitiva, para realizar actualizaciones de estado.
- **Simplicidad y Flexibilidad**: Zustand te ofrece una API intuitiva y fácil de aprender, sin necesidad de sumergirte en conceptos complejos. También, se adapta a proyectos de cualquier tamaño, desde pequeñas aplicaciones hasta grandes sistemas.
- **Comunidad**: Cuenta con una comunidad activa y en constante crecimiento, lo que significa que siempre encontrarás ayuda cuando la necesites.

## Zustand vs. Redux

**Arquitectura Redux**

![arquitectura-redux](/zustand-img/arquitectura-redux.png)

En primer lugar, está la interfaz de usuario (**`UI`**), tal y como se ve en la arquitectura. Los creadores de acciones (**`Action creators`**) se aseguran de que se active la acción correcta para cada solicitud del usuario. Se puede considerar una acción como un evento que describe lo que ha ocurrido en la aplicación. Puede ser como hacer clic en un botón o realizar una búsqueda. Los distribuidores (**`Dispatchers`**) ayudarán a enviar esas acciones al **`Store`**. Más adelante, los **`reducers`** decidirán cómo gestionar el estado. La función **`reducer`** cambia el estado tomando el estado actual y el objeto de acción. Devolverá el nuevo estado si es necesario, y las modificaciones del estado actualizado renderizarán la interfaz de usuario.

**Arquitectura de Zustand**

![arquitectura-zustand](/zustand-img/arquitectura-zustand.png)

Aquí también tienes el componente **`UI`**. Cuando llega una solicitud de cambio, se envía al **`store`**. El **`store`** decidirá cómo se debe cambiar el estado. La **`UI`** se renderizará con los cambios actualizados una vez que el **`store`** devuelva un nuevo estado. Aquí no verás ningún **`action creators`**, **`dispatchers`** o **`reducers`**. En su lugar, Zustand tiene una función que te permite suscribirte a los cambios de estado. Esto ayuda a mantener tu interfaz de usuario sincronizada con tus datos.

>En Zustand no se usan ***`reducers`*** ni **`dispatchers`** porque su arquitectura no está basada en el patrón Flux tradicional de Redux.
En lugar de manejar acciones con tipos y funciones reductoras, Zustand utiliza funciones simples dentro del store que modifican el estado directamente mediante la función **`set()`**.

## Alternativas a Zustand
Zustand es una de las librerías más populares en el ecosistema React debido a su simplicidad y facilidad de uso. De hecho, se trata de una librería agnóstica que también puede utilizarse sin necesidad de React. Aún así, existen múltiples librerías alternativas a Zustand:

- [MobX](https://mobx.js.org/README.html) es una librería de manejo de estado basada en programación reactiva.
- [Jotai](https://jotai.org/) es una librería de estado atómica y muy minimalista y simple.
- [Redux Toolkit](https://redux-toolkit.js.org/) Versión simplificada de Redux para hacerlo más cómodo.
- [XState](https://xstate.js.org/) Librería de estado basada en máquinas de estados finitos.