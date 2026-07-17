---
title: Caché en NestJS
description: Aprende a implementar caché en NestJS con CacheManager, Redis, in-memory cache, TTL, invalidación, decoradores @CacheKey, @CacheTTL, interceptors de caché y estrategias avanzadas.
---

# Caché en NestJS

La caché es como **una libreta de apuntes al lado del teléfono**: en lugar de llamar a alguien cada vez que necesitas un dato, lo anotas y lo consultas al instante.

## ¿Qué es?

La **caché** es un almacenamiento temporal de datos para acelerar consultas repetitivas. NestJS provee `@nestjs/cache-manager` que se integra con distintos stores (Redis, memoria, MongoDB) mediante una interfaz unificada.

```typescript
@Injectable()
export class ProductosService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async obtenerProductosPopulares() {
    const cacheKey = 'productos:populares';
    const cached = await this.cacheManager.get<any[]>(cacheKey);
    if (cached) return cached;

    const productos = await this.repo.findPopulares();
    await this.cacheManager.set(cacheKey, productos, 60_000); // 1 minuto TTL
    return productos;
  }
}
```

## ¿Por qué es importante?

La caché mejora drásticamente el rendimiento y reduce costos:

- **Velocidad**: Respuestas en ms en lugar de consultas a BD (que toman 10-100ms).
- **Reducción de carga**: Menos consultas a BD, APIs externas, cómputo pesado.
- **Costo**: Menos recursos de BD y cómputo.
- **Experiencia de usuario**: Aplicaciones más rápidas y responsivas.
- **Resiliencia**: Si la BD falla, la caché puede servir datos temporales.

## Problema que resuelve

Sin caché, cada petición consulta la BD o servicio externo:

```typescript
// ❌ Sin caché: cada request consulta BD
@Controller('productos')
export class ProductosController {
  @Get('populares')
  async obtenerPopulares() {
    return this.productosService.findPopulares();  // Consulta BD cada vez
    // 100 usuarios → 100 consultas SQL
    // Aunque los datos no cambien cada segundo
  }
}
```

Con caché, el resultado se reutiliza:

```typescript
// ✅ Con caché: primera vez consulta BD, siguientes usa caché
@Controller('productos')
export class ProductosController {
  @Get('populares')
  async obtenerPopulares() {
    const cacheKey = 'productos:populares';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const productos = await this.productosService.findPopulares();
    await this.cacheManager.set(cacheKey, productos, 60_000);
    return productos;
  }
  // 100 usuarios → 1 consulta SQL + 99 lecturas de caché (ms)
}
```

## Cómo funciona

### Flujo de caché (Cache-Aside)

```
Petición GET /productos/populares
        │
        ▼
┌─────────────────────────────┐
│  ¿Existe en caché?          │
│  cacheManager.get('key')    │
└────────┬────────────────────┘
         │
    ┌────┴────┐
    │         │
   SÍ        NO
    │         │
    ▼         ▼
┌────────┐ ┌────────────────────────────┐
│ Retornar│ │ Consultar BD/API           │
│ caché   │ │ cacheManager.set('key',   │
└────────┘ │   data, TTL)              │
           │ Retornar                   │
           └────────────────────────────┘
```

### Stores disponibles

| Store | Paquete | Cuándo usarlo |
|---|---|---|
| **In-memory** | `cache-manager` (built-in) | Desarrollo, single-instance, datos pequeños |
| **Redis** | `@redis/client` o `ioredis` | Producción, multi-instancia, caché compartida |
| **MongoDB** | `cache-manager-mongodb` | Si ya usas MongoDB |
| **Memcached** | `cache-manager-memcached` | Sistemas legacy |

## Sintaxis

### Instalación

```bash
npm install @nestjs/cache-manager cache-manager
# Para Redis:
npm install @redis/client
# O con ioredis:
npm install ioredis
```

### Configuración

```typescript
// app.module.ts — Caché en memoria (built-in)
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60,              // TTL por defecto en segundos
      max: 100,             // Máximo de items en caché
      isGlobal: true,       // Disponible en todos los módulos
    }),
  ],
})
export class AppModule {}

// Con Redis:
CacheModule.registerAsync({
  useFactory: () => ({
    store: redisStore,
    url: process.env.REDIS_URL,
    ttl: 60,
  }),
  isGlobal: true,
}),
```

### Uso básico

```typescript
@Injectable()
export class ProductosService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  // Guardar en caché
  async guardar(key: string, data: any, ttlMs?: number) {
    await this.cacheManager.set(key, data, ttlMs);
  }

  // Leer de caché
  async obtener(key: string): Promise<any | undefined> {
    return this.cacheManager.get(key);
  }

  // Eliminar de caché
  async invalidar(key: string) {
    await this.cacheManager.del(key);
  }

  // Limpiar toda la caché
  async limpiar() {
    await this.cacheManager.clear();
  }

  // Patrón cache-aside completo
  async obtenerOConsultar<T>(key: string, fn: () => Promise<T>, ttlMs = 60_000): Promise<T> {
    const cached = await this.cacheManager.get<T>(key);
    if (cached) return cached;

    const data = await fn();
    await this.cacheManager.set(key, data, ttlMs);
    return data;
  }
}
```

## Ejemplo básico

Caché con decorador `@UseInterceptors(CacheInterceptor)` y configuración básica.

<CodeGroup>
<CodeGroupItem title="productos.controller.ts">

```typescript
@Controller('productos')
@UseInterceptors(CacheInterceptor)  // Cachea GET automáticamente
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async obtenerTodos() {
    // CacheInterceptor cachea automáticamente la respuesta
    // La key es automática: GET-/productos
    return this.productosService.obtenerTodos();
  }

  @Get(':id')
  @CacheKey('producto-por-id')  // Key personalizada
  @CacheTTL(120)                // TTL personalizado (segundos)
  async obtenerUno(@Param('id') id: string) {
    return this.productosService.obtenerPorId(id);
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="productos.service.ts">

```typescript
@Injectable()
export class ProductosService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Producto) private readonly repo: Repository<Producto>,
  ) {}

  async obtenerPorId(id: string): Promise<Producto> {
    const cacheKey = `producto:${id}`;

    const cached = await this.cacheManager.get<Producto>(cacheKey);
    if (cached) return cached;

    const producto = await this.repo.findOneBy({ id });
    if (!producto) throw new NotFoundException();

    await this.cacheManager.set(cacheKey, producto, 120_000); // 2 min
    return producto;
  }

  async actualizar(id: string, dto: ActualizarProductoDto): Promise<Producto> {
    const producto = await this.repo.save({ id, ...dto });

    // Invalidar caché al actualizar
    await this.cacheManager.del(`producto:${id}`);
    await this.cacheManager.del('productos:todos');

    return producto;
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Estrategias de invalidación, caché de listas paginadas y TTL dinámico.

```typescript
@Injectable()
export class CacheHelperService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // Invalidar por patrón (requiere Redis, no soportado en memoria)
  async invalidarPatron(patron: string): Promise<void> {
    const store = this.cacheManager.stores[0];
    if (store?.name === 'redis') {
      const client = store.client;
      const keys = await client.keys(patron);
      if (keys.length > 0) await client.del(keys);
    }
  }

  // Caché de consultas paginadas
  async obtenerPaginado<T>(
    key: string,
    page: number,
    limit: number,
    fn: () => Promise<[T[], number]>,
    ttl = 30_000,
  ): Promise<{ items: T[]; total: number }> {
    const cacheKey = `${key}:page:${page}:limit:${limit}`;

    const cached = await this.cacheManager.get<{ items: T[]; total: number }>(cacheKey);
    if (cached) return cached;

    const [items, total] = await fn();
    const result = { items, total };

    await this.cacheManager.set(cacheKey, result, ttl);
    return result;
  }

  // TTL dinámico (productos populares → más caché)
  calcularTTL(popularidad: number): number {
    if (popularidad > 1000) return 300_000;  // 5 min
    if (popularidad > 100) return 60_000;    // 1 min
    return 10_000;                            // 10 seg
  }
}
```

## Ejemplo avanzado

Interceptor de caché personalizado, caché condicional, Redis avanzado y estrategias multi-nivel.

<CodeGroup>
<CodeGroupItem title="cache-conditional.interceptor.ts">

```typescript
@Injectable()
export class CacheCondicionalInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Solo cachear GET
    if (request.method !== 'GET') return next.handle();

    const cacheKey = this.reflector.get<string>('cache-key', context.getHandler())
      || `${request.route?.path || request.url}:${JSON.stringify(request.query)}`;

    // Verificar si el cliente pide datos frescos
    if (request.headers['cache-control'] === 'no-cache') {
      return next.handle().pipe(
        tap(data => this.cacheManager.set(cacheKey, data, 60_000)),
      );
    }

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return of(cached);

    return next.handle().pipe(
      tap(data => this.cacheManager.set(cacheKey, data, 60_000)),
    );
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="redis-avanzado.ts">

```typescript
// Cache Manager con Redis avanzado
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
        password: process.env.REDIS_PASSWORD,
        database: 0,
        ttl: 60,
        // Opciones avanzadas
        keyPrefix: 'miapp:cache:',  // Prefijo para todas las keys
      }),
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

// Uso con serialización personalizada
await this.cacheManager.set('user:123', usuario, {
  ttl: 300,  // TTL en segundos
  // Opciones específicas del store
} as any);
```

</CodeGroupItem>

<CodeGroupItem title="multi-level-cache.ts">

```typescript
// Caché multi-nivel: L1 (memoria) + L2 (Redis)
@Injectable()
export class MultiLevelCacheService {
  private readonly l1Cache = new Map<string, { data: any; expiry: number }>();
  private readonly l1Ttl = 10_000; // 10s en memoria

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    // 1. Intentar L1 (memoria local)
    const l1 = this.l1Cache.get(key);
    if (l1 && Date.now() < l1.expiry) {
      return l1.data as T;
    }

    // 2. Intentar L2 (Redis)
    const l2 = await this.cacheManager.get<T>(key);
    if (l2) {
      // Poblar L1 con datos de L2
      this.l1Cache.set(key, { data: l2, expiry: Date.now() + this.l1Ttl });
      return l2;
    }

    return undefined;
  }

  async set(key: string, data: any, ttlMs = 60_000): Promise<void> {
    this.l1Cache.set(key, { data, expiry: Date.now() + this.l1Ttl });
    await this.cacheManager.set(key, data, ttlMs);
  }

  async del(key: string): Promise<void> {
    this.l1Cache.delete(key);
    await this.cacheManager.del(key);
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Buenas prácticas

### 1. Define keys con naming consistente

```typescript
// Formato: dominio:subdominio:identificador
const KEY_PATTERN = 'productos:populares';
const KEY_USUARIO = (id: string) => `usuarios:${id}`;
const KEY_PAGINADO = (page: number, limit: number) => `productos:page:${page}:limit:${limit}`;
```

### 2. Invalida la caché al modificar datos

```typescript
async actualizarProducto(id: string, dto: any) {
  const producto = await this.repo.save({ id, ...dto });

  // Invalidar cachés relacionadas
  await this.cacheManager.del(`producto:${id}`);
  await this.cacheManager.del('productos:populares');
  // Si usas Redis con patrón:
  await this.cacheManager.del('productos:todos');  // O del por patrón

  return producto;
}
```

### 3. No cachees datos sensibles

```typescript
// ❌ No cachees contraseñas, tokens, datos personales
await this.cacheManager.set(`usuario:${id}`, usuarioConPassword);

// ✅ Cachea solo datos públicos
const publico = { id: usuario.id, nombre: usuario.nombre };
await this.cacheManager.set(`usuario:${id}`, publico);
```

### 4. No cachees datos de un solo usuario en clave genérica

```typescript
// ❌ Mal: todos los usuarios ven los mismos datos
await this.cacheManager.set('perfil', perfil);

// ✅ Bien: key por usuario
await this.cacheManager.set(`perfil:${usuarioId}`, perfil);
```

### 5. Usa Redis en producción para caché compartida

```typescript
// En desarrollo: in-memory (simple, no requiere Redis)
// En producción: Redis (compartido entre instancias)
const store = process.env.NODE_ENV === 'production' ? redisStore : undefined;
```

## Errores comunes

### 1. Cachear respuestas que cambian por usuario

```typescript
// ❌ Error: todos los usuarios ven el mismo carrito
@UseInterceptors(CacheInterceptor)
@Get('carrito')
async obtenerCarrito() {
  return this.carritoService.obtener();  // Cachea sin distinción de usuario
}

// ✅ Correcto: key por usuario
@Get('carrito')
async obtenerCarrito(@Req() req: Request) {
  const key = `carrito:${req.user.id}`;
  // ... cache-aside manual
}
```

### 2. TTL demasiado largo para datos volátiles

```typescript
// ❌ Datos de stock con TTL de 1 hora
await this.cacheManager.set(`stock:${id}`, stock, 3_600_000);
// Un usuario compra → stock desactualizado por 1 hora

// ✅ TTL corto para datos que cambian frecuentemente (10-30s)
await this.cacheManager.set(`stock:${id}`, stock, 30_000);
```

### 3. No invalidar al actualizar

```typescript
// ❌ Error: caché obsoleta
async actualizar(id: string, dto: any) {
  await this.repo.update(id, dto);
  // No invalida → la caché tiene datos viejos
}

// ✅ Correcto
async actualizar(id: string, dto: any) {
  await this.repo.update(id, dto);
  await this.cacheManager.del(`producto:${id}`);
}
```

### 4. No manejar errores de caché

```typescript
// ❌ Error: si Redis falla, la app falla
const cached = await this.cacheManager.get(key);

// ✅ Correcto: tolerante a fallos de caché
try {
  const cached = await this.cacheManager.get(key);
  if (cached) return cached;
} catch {
  // Si la caché falla, seguir sin ella
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Interceptores** | `CacheInterceptor` cachea respuestas automáticamente para GET. |
| **Redis** | Store principal para caché en producción (compartido entre instancias). |
| **TTL** | Tiempo de vida del dato en caché. Configurable global y por key. |
| **Invalidación** | Proceso de eliminar/actualizar datos en caché cuando cambian. |
| **Performance** | La caché es la técnica más efectiva para mejorar rendimiento de lecturas. |

## Resumen

- La **caché** almacena datos temporalmente para respuestas rápidas.
- `CacheModule.register()` configura el store (memoria, Redis, etc.).
- `cacheManager.get(key)`, `.set(key, data, ttl)`, `.del(key)` — API básica.
- `@UseInterceptors(CacheInterceptor)` cachea automáticamente respuestas GET.
- `@CacheKey()` y `@CacheTTL()` personalizan key y TTL por ruta.
- **TTL** define cuánto tiempo vive un dato en caché.
- **Invalidación** manual al modificar datos (¡crítico!).
- Usa **Redis** en producción (caché compartida entre instancias).
- Patrón **cache-aside**: verificar caché → si no, consultar BD → guardar en caché.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es el patrón más común para usar caché en NestJS?</summary>

**Respuesta:** **Cache-Aside**: primero verificar si el dato está en caché (`cacheManager.get(key)`), si está, retornarlo; si no, consultar la BD, guardarlo en caché (`cacheManager.set(key, data, TTL)`), y retornarlo.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué hace `@UseInterceptors(CacheInterceptor)`?</summary>

**Respuesta:** Cachea automáticamente la respuesta de endpoints GET usando una key generada automáticamente basada en la ruta y query params. En peticiones subsiguientes dentro del TTL, retorna la respuesta cacheada sin ejecutar el handler.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cuál es el problema de no invalidar la caché al actualizar datos?</summary>

**Respuesta:** Los datos en caché quedan **obsoletos** (stale). Los usuarios siguen viendo datos viejos hasta que el TTL expire. La aplicación muestra información inconsistente entre la BD y la caché.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Por qué es mejor Redis que la memoria local para caché en producción?</summary>

**Respuesta:** Porque Redis es **compartido entre todas las instancias** de la aplicación. Si escalas horizontalmente con 10 instancias y usas memoria local, cada instancia tiene su propia caché — un usuario puede ver datos diferentes según qué instancia le toque. Redis también persiste datos, soporta keys complejas y expiración avanzada.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Qué consideración de seguridad debes tener al cachear datos de usuario?</summary>

**Respuesta:** **No cachear datos sensibles** como contraseñas, tokens, información financiera, datos personales. Además, las keys de caché por usuario deben incluir el ID del usuario para evitar que un usuario vea datos de otro (por ejemplo, `carrito:usuario:123`).
</details>
