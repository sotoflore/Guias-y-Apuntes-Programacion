# Middlewares
El sistema de middleware de Zustand es un mecanismo poderoso y liviano que te permite interceptar, extender y enriquecer el proceso de creación y modificación de tu store.

Un **middleware** en Zustand es una función que envuelve al **state creator** (la función que define el estado inicial y las acciones) y devuelve otro state creator modificado. Permite añadir comportamientos transversales (persistencia, logging, integración con Redux DevTools, transformaciones de estado, etc.) sin cambiar la lógica interna del store.

## ¿Cómo Funciona un Middleware?

Un middleware en Zustand sigue una estructura de composición funcional: es una función que toma la función de configuración de la store como argumento y devuelve una nueva función de configuración modificada.

La sintaxis básica es la siguiente:

```ts
const myMiddleware = (config) => (set, get, api) => {
  // 1. Lógica a ejecutar ANTES de que se cree el store inicial
  // ...

  // 2. Ejecuta la función de configuración original (el creador de la store)
  const store = config(
    // 3. Modifica la función 'set'
    (...args) => {
      console.log('Middleware: Acción despachada!', args);
      set(...args);
      console.log('Middleware: Estado actual después de set:', get());
    },
    get,
    api
  );

  // 4. Lógica a ejecutar DESPUÉS de que se crea el store inicial
  // ...

  return store;
};
```

- **`config`** es la función original que crea la tienda.
- El middleware puede envolver o reemplazar **`set`**, **`get`**, o **`api`** antes de pasar todo a **`config`**.
- La composición de middlewares es simplemente aplicar funciones envolventes, por ejemplo: **`devtools(persist(config))`**.

Para usarlo, simplemente lo envuelves alrededor de la función **`create`**:
```ts
import { create, StateCreator } from 'zustand';

// Definimos el tipo del estado
interface TypeState {
    // ...
}

// Definicion del store
const storeApi: StateCreator<TypeState> = (set, get) => ({
 //.. estados iniciales y acciones
});

export const useMyStore = create<BearState>()(
  // Componemos el middleware con el creador de la store
  myMiddleware(
    storeApi
  )
);
```
- **`TypeState`**: define la forma del estado y sus acciones.
- **`storeApi`**: Definicion del store.
- **`myMiddleware`**: envuelve el **`set`** original para agregar comportamiento adicional.

**Por ejemplo:**

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

interface BearState {
  bears: number;
  increasePopulation: () => void;
}

const storeApi: StateCreator<BearState> = (set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
});


const useBearStore = create(
  // Componemos el middleware con el creador de la store
  persist(
    storeApi,
    { 
        name: 'bears-storage', 
    }
  )
);
```
El middleware **`persist`** envuelve a la configuración y automaticamente guarda los cambios en **`localStorage`** bajo la clave **`bears-storage`**.

## Middlewares Principales
Zustand incluye varios middlewares integrados.

### Persist (Persistencia)

Permite que el estado de tu store se guarde en un almacenamiento persistente (**`localStorage`**, **`sessionStorage`**, etc.) y se rehidrate automáticamente al cargar la aplicación. Esto es crucial para la autenticación, la configuración de temas, o cualquier estado que deba sobrevivir a las recargas de página.

:::info Documentación Oficial
https://zustand.docs.pmnd.rs/middlewares/persist
:::

Sintaxis básica:
```ts
const nextStateCreatorFn = persist(stateCreatorFn, persistOptions)
```
- **`stateCreatorFn`**: Una función que toma **`set función`**, **`get función`** y **`store`** como argumentos. Normalmente, devolverás un objeto con los métodos que deseas exponer.
- **`persistOptions`**: Un objeto para definir opciones de almacenamiento.
    - **`name`**: Un nombre único para el almacenamiento.
    - **`storage(opcional )`**: El valor predeterminado es **`createJSONStorage(() => localStorage)`**.

**Por Ejemplo**: Persistir un contador en **`localStorage`**.
```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Definición del Store y sus Tipos
type CountState = {
   count: number;
   increment: () => void;
   decrement: () => void;
};

export const useCountStore = create<CountState>()(
  // 2. Envolvemos la función creadora con 'persist'
  persist(
    (set, get) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      // 3. Opciones de persistencia
      name: 'count-storage', // Nombre único para el elemento en el almacenamiento
      // storage: createJSONStorage(() => sessionStorage), // Opcional: usar sessionStorage
      // partialize: (state) => ({ count: state.count }), // Opcional: solo persistir la propiedad 'count'
    }
  )
);
```
Cuando se monta la aplicación, **`useCountStore`** automáticamente cargará el estado guardado bajo la clave **`count-storage`** en **`localStorage`**.

### Devtools (Herramientas de Desarrollo)
Integra el store con **Redux DevTools** para depuración. Registra acciones como **`setState`** o tipos personalizados, permitiendo time-travel debugging.

:::info Documentación Oficial
https://zustand.docs.pmnd.rs/middlewares/devtools
:::

Sintaxis básica:
```ts
const nextStateCreatorFn = devtools(stateCreatorFn, devtoolsOptions)
```
- **`stateCreatorFn`**: Una función que toma **`set función`**, **`get función`** y **`store`** como argumentos. Normalmente, devolverás un objeto con los métodos que deseas exponer.
- **`devtoolsOptions(opcional)`**: Un objeto para definir opciones de Redux DevTools.
    - **`name(opcional)`**: Nombre del store en DevTools.
    - **`enabled(opcional)`**: Booleano para habilitar/deshabilitar (útil en producción).
    - **`anonymousActionType(opcional)`**: Tipo por defecto para acciones sin nombre.
    - **`store(opcional)`**: Un identificador personalizado para la store en Redux DevTools.

**Por Ejemplo**: Habilitar DevTools para una store de tareas.

```ts
import { create, TodoState } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
}

// 1. Definición del Store (acciones y estado)
const storeCreator: StateCreator<TodoState> = (set) => ({
  todos: [],
  addTodo: (title) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), title, done: false }],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      ),
    })),
});

export const useTodoStore = create<TodoState>(
  // 2. Envolvemos el creador de la store con 'devtools'
  devtools(storeCreator, {
    name: 'Todo Store', // Nombre que aparecerá en Redux DevTools
    // enabled: process.env.NODE_ENV !== 'production', // Opcional: habilitar solo en desarrollo
  })
);
```
Cada vez que se llama a **`addTodo`** o **`toggleTodo`**, la acción y el cambio de estado se registrarán en las **`DevTools`**.

### Immer (Inmutabilidad Simplificada).
El middleware **``immer``** (requiere la librería **`immer`**) te permite escribir lógica de actualización de estado de forma mutativa, mientras que por debajo asegura que el estado siga siendo inmutable, simplificando enormemente el manejo de estructuras de estado anidadas o complejas.

:::info Documentación Oficial
https://zustand.docs.pmnd.rs/middlewares/immer
:::

Sintaxis básica:
```ts
const nextStateCreatorFn = immer(stateCreatorFn)
```
- **`stateCreatorFn`**: Una función que toma **`set función`**, **`get función`** y **`store`** como argumentos. Normalmente, devolverás un objeto con los métodos que deseas exponer.

**Por Ejemplo**: Usar sintaxis mutativa para actualizar una lista.

```ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Recordatorio: Debes instalar 'immer' con npm install immer

// 1. El creador de la store se envuelve directamente en 'immer'
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type CountState = {
  count: number;
  increment: (qty: number) => void;
  decrement: (qty: number) => void;
};

export const useCountStore = create<CountState>()(
  immer((set) => ({
    count: 0,
    increment: (qty: number) =>
      set((state) => {
        state.count += qty; // Mutación directa (Immer la hace inmutable)
      }),
    decrement: (qty: number) =>
      set((state) => {
        state.count -= qty;
      }),
  }))
);
```
- **`immer`** envuelve el store, creando un draft proxy para **`set`**.
- Puedes mutar **`state.count`** directamente; Immer produce un estado inmutable nuevo.
- Zustand detecta cambios y notifica suscriptores solo si hay diferencias.

## Composición de Middlewares
Una de las fortalezas de Zustand es que puedes encadenar varios middlewares para combinar funcionalidades. El orden es importante, ya que cada middleware envuelve al siguiente.

**Ejemplo 1 de Composición**: DevTools + Persistencia

En este ejemplo, la persistencia ocurre antes de que el estado llegue a DevTools, lo que significa que DevTools registrará el estado ya persistido.

```ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useCombinedStore = create(
  // 1. devtools (más externo)
  devtools(
    // 2. persist (más interno)
    persist(
      (set) => ({
        // ... tu lógica de estado aquí
      }),
      {
        name: 'combined-storage',
      }
    ),
    {
      name: 'Combined Store',
    }
  )
);
```

El orden de los middlewares de Zustand se lee de derecha a izquierda o de dentro hacia afuera, es decir, el middleware más a la derecha (o el más interno) es el que recibe el creador original del store, y el más a la izquierda (o el más externo) es el que envuelve todo.

**Ejemplo 2 de Composición**: Store Completo con Múltiples Middlewares.

```ts
import { create } from 'zustand';
import { devtools, persist, immer } from 'zustand/middleware';

type CartItem = { 
    id: string; 
    name: string; 
    quantity: number 
};

type CartState = {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        total: 0,
        addItem: (item) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
              existing.quantity += 1;
            } else {
              state.items.push({ ...item, quantity: 1 });
            }
            state.total = state.items.reduce((sum, i) => sum + i.quantity, 0);
          }),
        updateQuantity: (id, qty) =>
          set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (item) {
              item.quantity = qty;
              state.total = state.items.reduce((sum, i) => sum + i.quantity, 0);
            }
          }),
        removeItem: (id) =>
          set((state) => {
            state.items = state.items.filter((i) => i.id !== id);
            state.total = state.items.reduce((sum, i) => sum + i.quantity, 0);
          }),
      })),
      {
        name: 'cart-storage',
        partialize: (state) => ({ items: state.items }), // No persistir total (se recalcula)
      }
    ),
    { name: 'CartStore' }
  )
);
```
- **`Immer`** (interno): Permite mutaciones como **`state.items.push()`** y **`item.quantity = qty`** de forma segura.
- **`Persist`** (medio): Guarda solo items en **`localStorage`**. Al recargar, se hidrata automáticamente.
- **`DevTools`** (externo): Registra todas las acciones (**`addItem`**, **`updateQuantity`**) para depuración.
- Composición: El orden importa; **`Immer`** debe estar antes de **`persist`** para drafts correctos.