# Gestión del Estado

En **Zustand**, la función que defines dentro de **`create`** recibe dos argumentos clave: **`set`** y **`get`**. Estos son los mecanismos fundamentales para modificar y leer el estado dentro de tu Store.

## Función set
La función **`set`** es el método principal que proporciona Zustand para actualizar el estado del Store. Su diseño está orientado a la inmutabilidad y a la eficiencia. Por defecto, **`set`** realiza una fusión superficial (shallow merge) del objeto de actualización con el estado actual, asegurando que solo las propiedades especificadas se modifiquen, dejando las demás intactas.

**Sintaxis básica:**
```ts
set(partial: Partial<State> | ((state: State) => Partial<State>), replace?: boolean)
```
- **`partial`** puede ser un objeto parcial (**`Partial<State>`**) o una función (updater) (**`((state: State) => Partial<State>)`**).
- **`replace`** (booleano, opcional) cuando es **`true`** sustituye el estado en lugar de hacer merge. Rara vez se usa.

### ¿Cómo Funciona set?
Cuando llamas a **`set({ key: value })`**, Zustand toma el estado actual, copia todas sus propiedades y luego sobrescribe solo las claves que proporcionaste en el objeto parcial. Esto garantiza que el objeto de estado raíz (State) siempre mantenga una nueva referencia si ha cambiado, lo que es clave para que React detecte la actualización y realice los re-renders.

### Tipos de Actualizaciones

#### 1. Actualización Simple (Objeto Parcial)
Se utiliza cuando la nueva propiedad no depende del valor anterior del estado. Reemplaza el campo especificado.

```ts
set({ propiedad: 'nuevo valor' });
```
**Por ejemplo:** Imagina un store para un usuario. Actualizamos solo el **`firstName`** sin tocar **`lastName`**.

```ts
import { create } from 'zustand';

interface UserState {
    firstName: string;
    lastName: string;
}

interface UserActions {
    updateFirstName: (name: string) => void;
}

const useUserStore = create<UserState & UserActions>((set) => ({
    firstName: 'Juan',
    lastName: 'Pérez',
    updateFirstName: (name) => set({ firstName: name }), // Fusión: solo cambia firstName
}));
```
Uso en un componente:

```tsx title="User.tsx"
import { useUserStore } from './store';

const User = () => {
    const firstName = useUserStore((state) => state.firstName);
    const updateFirstName = useUserStore((state) => state.updateFirstName);

    return (
        <div>
            <h1>Nombre: {firstName}</h1>
            // Estado ahora: { firstName: 'Pedro', lastName: 'Pérez' }
            <button onClick={() => updateFirstName('Pedro')}> 
                Cambiar Nombre
            </button>
        </div>
    )
} 
```
- **`set({ firstName: name })`** fusiona el objeto con el estado actual. Si intentáramos mutar directamente (**`state.firstName = name`**), Zustand no detectaría el cambio y no re-renderizaría.

#### 2. Actualización Funcional (Dependiente del Estado Actual)
Obligatoria cuando el nuevo valor depende del estado actual. La función updater asegura que estás trabajando con el snapshot de estado más reciente al momento de la ejecución.. El argumento de la función es el estado actual (**`state`**).
```ts
set((state) => ({ propiedad: state.propiedad + 1 }));
```
**Por ejemplo:** Definiremos un Store de Tareas donde usamos **`set`** para agregar una nueva tarea y para marcar una como completada.
```ts title="store.ts"
import { create } from 'zustand';

// 1. Definición de Tipos para el Estado
interface Tarea {
    id: number;
    descripcion: string;
    completada: boolean;
}

interface TareaState {
    tareas: Tarea[];
    
    // Acciones (funciones modificadoras)
    agregarTarea: (descripcion: string) => void;
    marcarCompletada: (id: number) => void;
}

// 2. Creación del Store
const useTareaStore = create<TareaState>((set) => ({
    tareas: [], // Estado inicial

    // Ejemplo de SET (Sintaxis Funcional para depender del estado anterior)
    agregarTarea: (descripcion) => {
        set((state) => ({
            tareas: [
                ...state.tareas, //Copiamos las tareas existentes (Inmutabilidad)
                { 
                    id: Date.now(), 
                    descripcion, 
                    completada: false 
                },
            ],
        }));
    },

    // Ejemplo de SET (Para actualizar un elemento inmutablemente)
    marcarCompletada: (id) => {
        set((state) => ({
            tareas: state.tareas.map(tarea => 
                tarea.id === id 
                    ? { ...tarea, completada: true } // Inmutabilidad en el elemento
                    : tarea
            ),
        }));
    },
}));
```
Uso en un componente:

```tsx title="tarea.tsx"
import { useTareaStore } from './store';

const Tarea = () => {
    const tareas = useTareaStore((state) => state.tareas);
    const agregarTarea = useTareaStore((state) => state.agregarTarea);
    const marcarCompletada = useTareaStore((state) => state.marcarCompletada);

    return (
        <div>
            <h2>Lista de Tareas</h2>
            <button onClick={() => agregarTarea('Aprender Zustand')}>
                Agregar Tarea
            </button>
            <ul>
                {tareas.map(tarea => (
                    <li key={tarea.id}>
                        {tarea.descripcion} 
                        <button onClick={() => marcarCompletada(tarea.id)}>
                            Marcar Completada
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
```
## Función get
La función **`get`** te permite leer el estado actual del Store dentro de una acción, sin suscribir el código de la acción a ese estado. Su propósito es acceder al estado actual dentro de una acción para realizar lógica de negocio, cálculos o tomar decisiones.

:::warning Importante
**`get`** solo debe usarse dentro de la función create para lógica de negocio en las acciones. Nunca debe llamarse a **`get()`** directamente dentro de un componente React. Para la lectura en componentes, se utiliza el devuelto por **`create`** con selectores.
:::

**Sintaxis básica:**
```ts
get: () => T;
```
- Retorna el estado completo tipado como **`T`**.
- No recibe argumentos; siempre devuelve el snapshot actual.

### ¿Cómo Funciona get?
**`get()`** retorna una copia del estado en el instante exacto en que se le llama. Proporciona un acceso síncrono al estado más reciente.

A diferencia de un selector en un componente React, llamar a **`get()`** dentro de una acción no crea una suscripción. Es decir, si el estado cambia mientras la acción se está ejecutando, la acción no se "re-ejecutará" ni React se re-renderizará por el uso de **`get`**.

### Tipos de Lectura
#### 1. Lectura Simple en una Acción
Para una acción que incrementa basado en el valor actual.
```ts title="store.ts"
import { create } from 'zustand';

interface BearState {
  bears: number;
  addBear: () => void;
}

const useBearStore = create<BearState>((set, get) => ({
  bears: 0,
  addBear: () => {
    const currentBears = get().bears; // Lee el estado actual
    set({ bears: currentBears + 1 });
  },
}));
```
- **`get()`** retorna **`{ bears: 0, addBear: ... }`**.
- Extraemos **`bears`** **`(0)`**.
- **`set`** actualiza a **`1`**.
- Si llamamos **`addBear`** de nuevo, **`get()`** ahora ve **`1`**, y así sucesivamente.

#### 2. Lectura para Validaciones
Una acción que solo agrega si no excede un límite.

```ts title="store.ts"
import { create } from 'zustand';

interface LimitState {
  items: number;
  addIfUnderLimit: (limit: number) => boolean; // Retorna true si se agregó
}

const useLimitStore = create<LimitState>((set, get) => ({
  items: 0,

  addIfUnderLimit: (limit) => {
    const current = get().items;
    if (current < limit) {
      set({ items: current + 1 });
      return true;
    }
    return false;
  },
}));
```
- **`get()`** permite condicionales basadas en el estado real, haciendo la acción "inteligente".

#### 3. Lectura del Estado en un Componente
El hook generado por **`create()`** es la puerta de entrada para acceder al estado global dentro de los componentes de React.
Este hook nos permite suscribirnos solo a las partes del estado que realmente necesitamos, gracias al uso de selectores.

Al llamar al hook, se le pasa una función que recibe el estado completo (**`state`**) y devuelve la porción específica del estado que interesa al componente. Este componente solo se re-renderizará si el valor devuelto por el selector cambia de referencia o valor.

La clave está en qué seleccionamos:

- Si seleccionamos solo un valor primitivo o referencia estable, evitamos renders innecesarios.
- Si seleccionamos múltiples valores, debemos hacerlo con cuidado y ayudarnos de la función **`shallow`** de Zustand.

La forma más optimizada y recomendada de leer el estado es por lectura de un Solo Valor Primitivo. El selector devuelve un único valor (un string, un boolean, un number o una única referencia a un array u objeto).

**Por ejemplo**: Acceder Solo al Listado de **`bears`** en el hook de **`useBearStore`**.

```tsx
import { useBearStore } from './store';

const BearList = () => {
  const bears = useBearStore((state) => state.bears);

  return (
    <div>
        <h1>Total de osos</h1>
        <p>{bears}</p>
    </div>
  )
}
```
**Otro ejemplo**: Acceder solo al listado de tareas

```ts title="store.ts"
import { create } from 'zustand';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface TaskState {
  tasks: Task[];
}

interface TaskActions {
  addTask: (title: string) => void;
}

export const useTaskStore = create<TaskState & TaskActions>((set) => ({
  tasks: [
    { id: 1, title: 'Aprender Zustand', isCompleted: false },
    { id: 2, title: 'Desarrollar app de tareas', isCompleted: true },
  ],
  
  addTask: (title: string) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        { id: Date.now(), title, isCompleted: false },
      ],
    })),
}));
```
Uso en un componente:
```tsx title="TaskList.tsx"
import { useTaskStore } from '../store/taskStore';

const TaskList = () => {
  // Selector: Solo devuelve el array de tareas
  const tasks = useTaskStore((state) => state.tasks);

  // El componente solo se re-renderiza si el array 'tasks' cambia (nueva referencia).

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id} className={task.isCompleted ? 'completed' : ''}>
          {task.title}
        </li>
      ))}
    </ul>
  );
};
```
