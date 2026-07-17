---
title: Interceptors en NestJS
description: Aprende qué son los interceptors en NestJS, cómo transformar respuestas, mapear errores, cachear, loguear tiempo de ejecución y crear interceptors personalizados.
---

# Interceptors en NestJS

Los interceptors son como **empleados de un hotel que reciben tu equipaje al llegar y te lo devuelven al irte**: pueden inspeccionar, transformar y hasta reemplazar tanto la petición entrante como la respuesta saliente.

## ¿Qué es?

Un **interceptor** es una clase decorada con `@Injectable()` que implementa la interfaz `NestInterceptor`. Tiene la capacidad de **interceptar** una petición antes de que llegue al manejador de ruta y/o interceptar la respuesta antes de que se envíe al cliente.

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

## ¿Por qué es importante?

Los interceptors son la **herramienta más flexible** de NestJS para lógica transversal:

- **Transformación de respuestas**: Envuelven datos en un formato estándar.
- **Mapeo de errores**: Convierten excepciones en respuestas consistentes.
- **Caching**: Almacenan respuestas en caché para mejorar rendimiento.
- **Logging**: Miden tiempo de ejecución de cada ruta.
- **Manipulación de headers**: Añaden cabeceras a todas las respuestas.
- **Timeout**: Cancelan peticiones que tardan demasiado.

:::tip
Los interceptors son como **middlewares pero con superpoderes**: tienen acceso al contexto de ejecución de NestJS y pueden transformar el resultado usando RxJS.
:::

## Problema que resuelve

Sin interceptors, la transformación de respuestas y el logging están dispersos:

```typescript
// ❌ Sin interceptor: lógica duplicada en cada controlador
@Controller('usuarios')
export class UsuariosController {
  @Get()
  async obtenerTodos() {
    const start = Date.now();
    const data = await this.service.obtenerTodos();
    console.log(`GET /usuarios - ${Date.now() - start}ms`);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Post()
  async crear(@Body() dto: any) {
    const start = Date.now();
    const data = await this.service.crear(dto);
    console.log(`POST /usuarios - ${Date.now() - start}ms`);
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}

@Controller('productos')
export class ProductosController {
  @Get()
  async obtenerTodos() {
    const start = Date.now();
    const data = await this.service.obtenerTodos();
    console.log(`GET /productos - ${Date.now() - start}ms`);
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}
```

Con interceptors, defines la lógica **una vez** y se aplica globalmente:

```typescript
// ✅ Con interceptor: lógica centralizada

// logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap(() => console.log(`${request.method} ${request.url} - ${Date.now() - start}ms`)),
    );
  }
}

// transform.interceptor.ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({ success: true, data, timestamp: new Date().toISOString() })),
    );
  }
}

// Los controladores quedan limpios:
@Controller('usuarios')
export class UsuariosController {
  @Get() async obtenerTodos() { return this.service.obtenerTodos(); }
  @Post() async crear(@Body() dto: any) { return this.service.crear(dto); }
}
```

## Cómo funciona

### Ciclo de ejecución

```
Petición
  │
  ▼
┌─────────────────────┐
│  Interceptor (pre)   │ ← next.handle() aún no se llamó
│  - Logging inicio    │
│  - Modificar request │
│  - Cache check       │
└──────────┬──────────┘
           │ next.handle()
           ▼
┌─────────────────────┐
│  Route Handler      │ ← Lógica del controlador
└──────────┬──────────┘
           │ (respuesta)
           ▼
┌─────────────────────┐
│  Interceptor (post)  │ ← pipe() después de next.handle()
│  - Transformar data  │
│  - Mapear errores    │
│  - Logging fin       │
│  - Cachear respuesta │
└──────────┬──────────┘
           │
           ▼
      Respuesta al cliente
```

### ExecutionContext y CallHandler

| Objeto | Propósito |
|---|---|
| `context: ExecutionContext` | Información del contexto actual (controlador, handler, tipo de transporte) |
| `context.switchToHttp()` | Accede a request/response HTTP |
| `context.getHandler()` | Referencia al método manejador |
| `context.getClass()` | Referencia al controlador |
| `next: CallHandler` | Ejecuta el manejador de ruta |
| `next.handle()` | Retorna un Observable con la respuesta |

### Interceptor vs Middleware vs Guard vs Pipe

| Aspecto | Middleware | Guard | Interceptor | Pipe |
|---|---|---|---|---|
| **Cuándo** | Primero | Después de middleware | Antes y después del handler | Antes del handler |
| **Acceso a req/res** | Sí | Limitado | `ExecutionContext` | No |
| **Transforma respuesta** | No | No | Sí (RxJS) | No |
| **Puede cancelar** | Sí | Sí | Sí (si no llama handle) | No |
| **Usa RxJS** | No | No | Sí | No |
| **Propósito** | Lógica temprana | Autorización | Transformación, logging, cache | Validación |

## Sintaxis

### Crear un interceptor

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class MiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Antes del handler
    console.log('Antes de ejecutar el handler');

    return next.handle().pipe(
      tap(() => console.log('Después del handler (sin modificar)')),
      // map(data => /* transformar */),
    );
  }
}
```

### Aplicar interceptors

```typescript
// A nivel de controlador
@UseInterceptors(TransformInterceptor)
@Controller('usuarios')
export class UsuariosController {}

// A nivel de método
@Get()
@UseInterceptors(LoggingInterceptor)
async obtenerTodos() {}

// A nivel global (main.ts)
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new TransformInterceptor());

// A nivel global (módulo)
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
```

### Múltiples interceptors

```typescript
// Se ejecutan en orden de registro (Wrap → Logging → Handler → Logging → Wrap)
@UseInterceptors(LoggingInterceptor, TransformInterceptor, WrapResponseInterceptor)
```

## Ejemplo básico

Interceptors para logging, transformación de respuesta y manejo de tiempo de ejecución.

<CodeGroup>
<CodeGroupItem title="logging.interceptor.ts">

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    console.log(`➡️ [IN] ${method} ${url}`);

    return next.handle().pipe(
      tap(() => console.log(`⬅️ [OUT] ${method} ${url} - ${Date.now() - now}ms`)),
    );
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="transform.interceptor.ts">

```typescript
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { success: boolean; data: T; timestamp: string }> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ success: boolean; data: T; timestamp: string }> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="errores.interceptor.ts">

```typescript
@Injectable()
export class ErroresInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: HttpException | Error) => {
        const status = error instanceof HttpException
          ? error.getStatus()
          : 500;
        const message = error.message || 'Error interno';

        return throwError(() => ({
          success: false,
          statusCode: status,
          message,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        }));
      }),
    );
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Interceptor de caché en memoria, timeout y modificación de headers.

<CodeGroup>
<CodeGroupItem title="cache.interceptor.ts">

```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, { data: any; expiry: number }>();
  private readonly ttl = 60_000; // 1 minuto

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = `${request.method}-${request.url}`;
    const cached = this.cache.get(key);

    // Si hay caché válido, devolverlo sin ejecutar el handler
    if (cached && Date.now() < cached.expiry) {
      console.log(`[Cache] HIT: ${key}`);
      return of(cached.data);
    }

    console.log(`[Cache] MISS: ${key}`);

    return next.handle().pipe(
      tap(data => {
        this.cache.set(key, { data, expiry: Date.now() + this.ttl });
      }),
    );
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="timeout.interceptor.ts">

```typescript
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutMs: number = 5000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new HttpException(
            'La solicitud tardó demasiado',
            HttpStatus.REQUEST_TIMEOUT,
          ));
        }
        return throwError(() => err);
      }),
    );
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="headers.interceptor.ts">

```typescript
@Injectable()
export class HeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        response.setHeader('X-Powered-By', 'NestJS');
        response.setHeader('X-API-Version', '1.0');
        response.setHeader('X-Request-Id', crypto.randomUUID());
      }),
    );
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo avanzado

Interceptor con inyección de dependencias, uso de Reflector para metadatos y transformación condicional.

```typescript
import { Reflector } from '@nestjs/core';

// Decorador personalizado para marcar rutas que no deben ser transformadas
export const SkipTransform = () => SetMetadata('skipTransform', true);

@Injectable()
export class IntelligentTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipTransform = this.reflector.getAllAndOverride<boolean>(
      'skipTransform',
      [context.getHandler(), context.getClass()],
    );

    if (skipTransform) {
      return next.handle();  // Pasar sin transformar
    }

    return next.handle().pipe(
      map(data => {
        // No transformar si ya tiene formato
        if (data && data.success !== undefined) return data;

        // Paginación: envolver con meta
        if (data && Array.isArray(data.items) && data.total !== undefined) {
          return {
            success: true,
            data: data.items,
            meta: {
              total: data.total,
              page: data.page || 1,
              limit: data.limit || 10,
              totalPages: Math.ceil(data.total / (data.limit || 10)),
            },
            timestamp: new Date().toISOString(),
          };
        }

        // Array simple: envolver con count
        if (Array.isArray(data)) {
          return {
            success: true,
            data,
            meta: { count: data.length },
            timestamp: new Date().toISOString(),
          };
        }

        // Objeto simple
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
```

```typescript
// Uso en el controlador
@Controller('productos')
@UseInterceptors(IntelligentTransformInterceptor)
export class ProductosController {
  @Get()
  async obtenerTodos() {
    return {
      items: [{ id: 1, nombre: 'Laptop' }],
      total: 1,
      page: 1,
      limit: 10,
    };
    // → { success: true, data: [...], meta: { total, page, limit, totalPages }, timestamp: "..." }
  }

  @Get(':id')
  @SkipTransform()
  async obtenerUno(@Param('id') id: string) {
    return { id, nombre: 'Laptop', precio: 1200 };
    // → { id, nombre, precio }  (sin transformar)
  }
}
```

## Caso de uso real

Interceptor pipeline para una API REST empresarial.

```
PIPELINE DE INTERCEPTORS
─────────────────────────────────────────────────────────

        Petición entrante
               │
               ▼
     ┌─────────────────┐
     │  Headers         │ ← Añadir X-Request-Id, CORS headers
     └────────┬────────┘
               │
               ▼
     ┌─────────────────┐
     │  Logging         │ ← Log método, URL, timestamp
     └────────┬────────┘
               │
               ▼
     ┌─────────────────┐
     │  Cache           │ ← Si hay caché, responder inmediato
     └────────┬────────┘
               │
               ▼
     ┌─────────────────┐
     │  Timeout         │ ← 10s máximo por petición
     └────────┬────────┘
               │
               ▼
     ┌─────────────────┐
     │  Handler         │ ← Controlador
     └────────┬────────┘
               │
               ▼
     ┌─────────────────┐
     │  Transform       │ ← Envolver en { success, data, meta, timestamp }
     └────────┬────────┘
               │
               ▼
        Respuesta al cliente
```

## Buenas prácticas

### 1. Interceptors deben ser genéricos y reutilizables

```typescript
// ✅ Bien: interceptor genérico con tipo
@Injectable()
export class WrapInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({ success: true, data, timestamp: new Date().toISOString() })),
    );
  }
}

// ❌ Mal: interceptor con lógica específica de un controlador
@Injectable()
export class UsuariosInterceptor implements NestInterceptor {
  // Solo sirve para usuarios, no es reutilizable
}
```

### 2. Usa el Reflector para comportamiento condicional

```typescript
const CACHE_KEY = 'cache_key';
export const CacheKey = (key: string) => SetMetadata(CACHE_KEY, key);

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cacheKey = this.reflector.get(CACHE_KEY, context.getHandler());
    if (!cacheKey) return next.handle();
    // Lógica de caché con la key específica
  }
}
```

### 3. No hagas operaciones pesadas síncronas en interceptors

```typescript
// ❌ Mal: operación pesada bloqueante
@Injectable()
export class ProcesadorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const datos = JSON.parse(fs.readFileSync('config.json', 'utf-8')); // Bloquea
    return next.handle();
  }
}
```

### 4. Ordena los interceptors correctamente

Los interceptors se envuelven como capas de cebolla: el primero en declararse es el más externo.

```typescript
// Orden: Logging → Transform → Handler → Transform → Logging
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
```

Si Logging es externo, envuelve a Transform.

### 5. Cachea solo respuestas GET

```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.method !== 'GET') return next.handle();  // No cachear mutations
    // ...
  }
}
```

## Errores comunes

### 1. No llamar a `next.handle()`

```typescript
// ❌ Error: nunca se ejecuta el handler
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  console.log('Interceptor');
  // Falta return next.handle()
  return of([]);  // El controlador nunca se ejecuta
}
```

### 2. Olvidar el `return` en el pipe

```typescript
// ❌ Error: no se retorna el observable del pipe
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  next.handle().pipe(map(data => ({ success: true, data })));  // ← Falta return
  // → El handler se ejecuta pero la transformación se pierde
}
```

### 3. No manejar errores en el pipe

```typescript
// ❌ Error: excepción no atrapada
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  return next.handle().pipe(
    map(data => JSON.parse(data)),  // Si falla, la excepción no se maneja
  );
}

// ✅ Correcto: catchError
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  return next.handle().pipe(
    map(data => JSON.parse(data)),
    catchError(err => throwError(() => new BadRequestException('Datos inválidos'))),
  );
}
```

### 4. Compartir estado entre peticiones sin limpiar

```typescript
// ❌ Error: mapa de caché compartido sin límite
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, any>();  // Memoria infinita
}
```

### 5. Usar interceptor donde un pipe es suficiente

```typescript
// ❌ Mal: interceptor para transformación simple
@Injectable()
export class MayusculasInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => ({ ...data, nombre: data.nombre?.toUpperCase() })));
  }
}

// ✅ Mejor: usar Pipe o simplemente transformar en el servicio
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Middleware** | Se ejecuta antes que interceptors. Middleware ve el request/response crudo; interceptors trabajan con el contexto de NestJS. |
| **Guards** | Se ejecutan después de middleware, antes de interceptors. Deciden si la petición continúa. |
| **Pipes** | Se ejecutan dentro del interceptor (antes del handler). Transforman parámetros. |
| **Exception Filters** | Capturan excepciones lanzadas en interceptors o handlers. |
| **Reflector** | Permite leer metadatos definidos con decoradores para comportamiento condicional. |
| **RxJS** | Los interceptors usan RxJS (Observable, map, tap, catchError, timeout) para manipular el flujo. |

## Resumen

- Los **interceptors** interceptan peticiones antes y después del manejador de ruta.
- Implementan `NestInterceptor` con el método `intercept(context, next)`.
- Usan **RxJS** para transformar la respuesta (`pipe`, `map`, `tap`, `catchError`).
- Se aplican a nivel de método, controlador o global.
- **Casos de uso**: transformación de respuestas, logging, caching, timeout, modificación de headers.
- Los interceptors son **anidables** y se ejecutan como capas de cebolla.
- Usa el **Reflector** para comportamiento condicional basado en metadatos.
- No olvides **retornar** `next.handle().pipe(...)` y llamar siempre a `next.handle()`.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué operador de RxJS se usa para transformar la respuesta en un interceptor?</summary>

**Respuesta:** `map()`. Se encadena en el pipe después de `next.handle()` para transformar los datos antes de enviarlos al cliente.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cuál es la diferencia entre `tap()` y `map()` en un interceptor?</summary>

**Respuesta:** `tap()` ejecuta un efecto secundario (logging, medición) sin modificar los datos. `map()` transforma los datos y retorna un nuevo valor. Usa `tap` para observar, `map` para transformar.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cómo aplicas un interceptor globalmente desde un módulo?</summary>

**Respuesta:** Usando `APP_INTERCEPTOR` en los providers del módulo:
```typescript
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
```
Esto aplica el interceptor a todas las rutas sin necesidad de decoradores.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué orden siguen los interceptores cuando se aplican múltiples?</summary>

**Respuesta:** Siguen el orden de **capas de cebolla**: el primer interceptor declarado envuelve al segundo, y así sucesivamente. En la entrada, se ejecutan en orden de declaración; en la salida, en orden inverso. Ej: `@UseInterceptors(A, B)` → `A` exec → `B` exec → handler → `B` post → `A` post.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo puedes hacer que un interceptor no se ejecute en ciertas rutas?</summary>

**Respuesta:** Usando el `Reflector` con un decorador personalizado:
```typescript
export const SkipInterceptor = () => SetMetadata('skip', true);

@Injectable()
export class MiInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    if (this.reflector.get('skip', context.getHandler())) return next.handle();
    // ... resto de la lógica
  }
}
```
</details>
