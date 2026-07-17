# Persistencia del estado
La persistencia de estado significa guardar parte (o todo) del estado de la aplicación en un almacenamiento que sobreviva a recargas de página o cierres del navegador (por ejemplo **`localStorage`**). Esto es útil para: preferencias del usuario, carrito de compras, formularios parciales, filtros aplicados, etc. **Zustand** logra esto a través del middleware **`persist`**, que se integra fácilmente en la definición de tu store.

:::info Documentación Oficial
https://zustand.docs.pmnd.rs/middlewares/persist
:::

Para usar la persistencia, necesitas asegurarte de que tienes instalado Zustand. Luego, importas el middleware **`persist`** desde **`zustand/middleware`**:

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
```
**Sintaxis básica:**

El middleware **`persist`** envuelve la función de creación de tu store (**`set`** y **get**) y toma un segundo argumento de configuración.

```ts
const nextStateCreatorFn = persist(stateCreatorFn, persistOptions)
```
- **`stateCreatorFn`**: Una función que toma **`set función`**, **`get función`** y **`store`** como argumentos. Normalmente, devolverás un objeto con los métodos que deseas exponer.
- **`persistOptions`**: Un objeto para definir opciones de almacenamiento.
    - **`name`**: Un nombre único para el almacenamiento.
    - **`storage(opcional)`**: Implementación de almacenamiento. El valor predeterminado es **`createJSONStorage(() => localStorage)`**.
    - **`partialize(opcional)`**: Función para seleccionar qué partes del estado persistir (útil para excluir datos sensibles).
    - **`version(opcional)`**: Un número de versión para el estado persistente. Si la versión de estado almacenada no coincide, no se utilizará.

**Ejemplos Prácticos**

**Ejemplo 1:** Persistencia básica un contador que se mantiene después de recargar la página.

```ts title="counter.ts"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'counter-storage',
    }
  )
);
```
Uso en un Componente:

```tsx title="counter.tsx"
import React from 'react';
import { useCounterStore } from './store';

const Counter = () => {
  const count= useCounterStore(state => state.count);
  const increment = useCounterStore(state => state.increment);
  const reset = useCounterStore(state => state.reset);

  return (
    <div>
      <h1>Contador: {count}</h1>
      <button onClick={increment}>Incrementar</button>
      <button onClick={reset}>Resetear</button>
      <p>Recarga la página: ¡El valor se mantiene!</p>
    </div>
  );
};

export default Counter;
```
- **Creación del Store**: Definimos el estado inicial (**`count: 0`**) y acciones (**`increment`**, **`reset`**) usando **`set`** para actualizaciones inmutables.
- **Persistencia**: El middleware **`persist`** guarda automáticamente el estado en **`localStorage`** bajo la clave **`counter-storage`** cada vez que count cambia.
- **Uso en React**: El hook **`useCounterStore`** selecciona todo el estado. Al recargar, Zustand lee de **`localStorage`** y rehidrata el store.
- **Verificación**: Abre las **`DevTools > Application > Local Storage`**. Verás la entrada **`counter-storage`** con **`{ "state": { "count": 5 }, "version": 0 }`** después de incrementar 5 veces.

**Ejemplo 2**: Persistencia Parcial con Datos Sensibles. Un store con datos de usuario, pero solo persiste preferencias no sensibles (e.g., tema oscuro).

```ts title="store.ts"
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  theme: 'light' | 'dark';
  token: string; // Datos sensibles, NO persistir
  setTheme: (theme: 'light' | 'dark') => void;
  setToken: (token: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      theme: 'light',
      token: '',
      setTheme: (theme) => set({ theme }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }), // Solo persiste 'theme'
    }
  )
);
```
Uso en un Componente:

```tsx title="user.tsx"
import React, { useEffect } from 'react';
import { useUserStore } from './store';

export const UserPanel = () => {

  const theme = useUserStore((state) => state.theme);
  const setTheme = useUserStore((state) => state.setTheme);
  const token = useUserStore((state) => state.token);
  const setToken = useUserStore((state) => state.setToken);

  useEffect(() => {
    // Simula login: token se pierde al recargar (correcto, sensible)
    setToken('mi-token-secreto');
  }, []);

  return (
    <div className={theme}>
      <h2>Tema: {theme}</h2>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Cambiar Tema
      </button>
      <p>Token (se pierde al recargar): {token || 'No disponible'}</p>
    </div>
  );
}
```
- **Partialize**: La función **`(state) => ({ theme: state.theme })`** filtra el estado; solo theme se guarda. token se reinicia a ***`''`*** al recargar.
- **Seguridad**: Ideal para evitar fugas de datos sensibles como **`tokens JWT`**.
- **Verificación**: En **localStorage**, solo verás **`{ "state": { "theme": "dark" }, "version": 0 }`**. El token no aparece.