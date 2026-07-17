# API Data Fetching

En esta guía te explico paso a paso cómo integrar Zustand con un endpoint de una API de productos. Usaremos TypeScript para tipado estricto, lo que es una buena práctica para evitar errores en tiempo de ejecución.

**Estructura de Carpetas**

Una estructura modular y clara es clave para la mantenibilidad. Agruparemos por dominio (o feature).
```txt
src/
├── api/             // Lógica de acceso a la API (funciones puras)
│   └── products.ts  // Funciones para obtener productos
├── stores/          // Lógica de estado global (Zustand)
│   └── productStore.ts // Store de Zustand para productos
├── interfaces/           // Definiciones de tipos globales
│   └── product.interface.ts // Tipos para los datos de Producto
└── components/      // Componentes de React que consumen el store
    └── ProductList.tsx
    └── ...
```
## Implementación Paso a Paso

### Paso 1: Definición de Tipos
Definimos la interfaz para el objeto **`Product`** y el estado general del store.

```ts title="product.interface.ts"
// Interfaz para un Producto individual
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

//Interfaz para el estado del Store de Productos
export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

// Interfaz para las acciones del Store
export interface ProductActions {
  fetchProducts: () => Promise<void>;
}

// Tipo final del Store
export type ProductStore = ProductState & ProductActions;
```
### Paso 2: Servicio de API
Separamos la lógica de la llamada a la API del store. Esto hace que el store sea más limpio y la API más fácil de probar o reemplazar (Principio de Responsabilidad Única).

```ts title="products.ts"

import { Product } from '../interfaces/product.interface';

const API_BASE_URL = 'https://api.example.com'; // Sustituye con tu endpoint real

/**
 * Simula la obtención de productos desde una API
 * @returns {Promise<Product[]>} Una promesa que resuelve con un array de productos.
 */
export async function getProductsApi(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      // Lanzar un error con el estado de la respuesta si falla
      throw new Error(`Error ${response.status}: Fallo al obtener productos`);
    }

    const data: Product[] = await response.json();
    return data;
    
  } catch (error) {
    // Manejo de errores de red o parsing
    console.error("Fallo en la llamada a la API de productos:", error);
    // Relanzamos el error para que el store lo capture
    throw new Error(error instanceof Error ? error.message : "Error desconocido al obtener productos");
  }
}
```
### Paso 3: Creación del Store Zustand
Aquí definimos el estado inicial y la acción fetchProducts que interactúa con el servicio de API.

```ts title="productStore.ts"
import { create } from 'zustand';
import { ProductStore } from '../interfaces/product.interface';
import { getProductsApi } from '../api/products';

// Inicialización del estado
const initialState = {
  products: [],
  isLoading: false,
  error: null,
};

/**
 * Crea y exporta el Store de Zustand para Productos.
 * * Se tipa con ProductState y se usa la función `set` para
 * actualizar el estado de manera inmutable.
 */
export const useProductStore = create<ProductStore>((set) => ({
  ...initialState, // Estado inicial

  // Acción asíncrona para obtener productos de la API
  fetchProducts: async () => {
    // 1. Iniciar carga
    set({ isLoading: true, error: null });

    try {
      // 2. Llamar a la función de la API
      const products = await getProductsApi();
      
      // 3. Éxito: actualizar el estado con los datos y finalizar carga
      set({ products, isLoading: false, error: null });

    } catch (err) {
      // 4. Error: actualizar el estado con el mensaje de error
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      set({ error: errorMessage, isLoading: false });

    }
  },
}));
```

### Paso 4: Uso en un Componente de React
Finalmente, usamos el hook del store (**`useProductStore`**) en un componente para acceder al estado y la acción, y manejamos los estados de carga y error.

```tsx title="ProductList.tsx"
// src/components/ProductList.tsx
import React, { useEffect } from 'react';
import { useProductStore } from '../stores/productStore';

export function ProductList() {
  // 1. Usar el selector para obtener solo las partes del estado que se necesitan
  // **Buena práctica:** Seleccionar solo lo necesario para evitar re-renders innecesarios

  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  
  // 2. Llamar a la acción de carga al montar el componente
  useEffect(() => {
    // Sólo cargar si la lista está vacía (evitar doble fetch si el componente se desmonta y monta rápidamente)
    if (products.length === 0 && !isLoading) {
      fetchProducts();
    }
  }, [fetchProducts, products.length, isLoading]); // Dependencias clave

  // 3. Manejo del estado de UI
  if (isLoading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error al cargar: **{error}**</div>;
  }

  if (products.length === 0) {
    return <div>No se encontraron productos.</div>;
  }

  // 4. Renderizado de los datos
  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            **{product.name}** - ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <button onClick={fetchProducts}>Recargar Productos</button>
    </div>
  );
}
```