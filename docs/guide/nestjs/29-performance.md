---
title: Performance en NestJS
description: Aprende a optimizar el rendimiento de aplicaciones NestJS con caché, compresión, lazy loading, clustering, worker threads, profiling y escalabilidad horizontal.
---

# Performance en NestJS

Imagina un restaurante: si tienes 100 clientes y solo un chef que cocina cada plato de principio a fin, la espera será enorme. **La performance es como tener varios chefs (workers), hornos más rápidos (caché), y platos preparados (lazy loading)** para servir a más clientes en menos tiempo.

## ¿Qué es?

La **performance** en NestJS se refiere a las técnicas y patrones para optimizar la velocidad, el uso de recursos y la capacidad de respuesta de tu aplicación. Incluye caché, compresión, clustering, lazy loading, optimización de consultas y escalabilidad.

```typescript
// Estrategias de performance combinadas
@Module({
  imports: [
    CacheModule.register({ ttl: 60, max: 100 }),     // Caché en memoria
    CompressionModule,                                 // Compresión HTTP
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(compression())
      .forRoutes('*');  // Comprimir todas las respuestas
  }
}
```

## ¿Por qué es importante?

- **Experiencia de usuario**: apps rápidas retienen más usuarios.
- **Costos de infraestructura**: menos recursos = menos dinero.
- **SEO**: Google penaliza sitios lentos.
- **Escalabilidad**: una app optimizada escala mejor.
- **Competitividad**: la velocidad es una ventaja competitiva.

## Problema que resuelve

Sin optimización, las apps se vuelven lentas al crecer:

```typescript
// ❌ Sin performance: cada request hace todo desde cero
@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  async getCatalogo() {
    // ❌ Consulta BD repetitivamente para datos que casi no cambian
    return this.repo.find({ relations: ['categoria', 'marca', 'imagenes'] });
  }
}

// ✅ Con performance: caché reduce consultas 99%
@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly repo: Repository<Producto>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async getCatalogo() {
    const cached = await this.cache.get('catalogo');
    if (cached) return cached;

    const catalogo = await this.repo.find({
      relations: ['categoria', 'marca', 'imagenes'],
    });

    await this.cache.set('catalogo', catalogo, 300);  // Cache 5 min
    return catalogo;
  }
}
```

## Cómo funciona

```
PERFORMANCE MULTI-CAPA
────────────────────────

Cliente
  │
  ▼
[CDN] ─── Archivos estáticos cacheados
  │
  ▼
[Compresión] ─── gzip/brotli reduce tamaño respuestas
  │
  ▼
[Caché HTTP] ─── Cache-Control, ETag, respuestas 304
  │
  ▼
[Cache NestJS] ─── CacheModule (Redis/memoria)
  │
  ▼
[Clustering] ─── Múltiples procesos (CPU cores)
  │
  ▼
[Base de Datos] ─── Índices, consultas optimizadas, connection pool
```

## Sintaxis

### Caché con CacheModule

```typescript
@Module({
  imports: [
    CacheModule.register({
      ttl: 60,              // TTL por defecto (segundos)
      max: 100,             // Máximo items en caché
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

@Injectable()
export class ProductosService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(id: string) {
    const cached = await this.cacheManager.get(`producto:${id}`);
    if (cached) return cached;

    const producto = await this.repo.findOne({ where: { id } });
    await this.cacheManager.set(`producto:${id}`, producto, 120);
    return producto;
  }
}
```

### Compresión

```bash
npm install compression
```

```typescript
// main.ts
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());  // Comprimir respuestas HTTP
  await app.listen(3000);
}
```

### Clustering

```typescript
// main.ts — Usar todos los CPU cores
import * as cluster from 'cluster';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} — Creando ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} muerto. Reiniciando...`);
    cluster.fork();  // Auto-reinicio
  });
} else {
  bootstrap();
}
```

## Ejemplo básico

Caché en controlador con decoradores `@CacheKey` y `@CacheTTL`.

```typescript
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @CacheKey('productos:todos')  // Key personalizada en caché
  @CacheTTL(120)                // TTL específico para este endpoint
  @UseInterceptors(CacheInterceptor)  // Cache automática
  async findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Post()
  @CacheEvict('productos:*')  // Limpiar caché al crear
  async create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }
}
```

## Ejemplo intermedio

Redis como caché externa, lazy loading de módulos y optimización de consultas.

```typescript
// app.module.ts — Caché con Redis
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        ttl: 60,
        max: 1000,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}

// ✅ Lazy loading: cargar módulos bajo demanda
// en lugar de cargar todo al inicio
@Module({
  imports: [
    RouterModule.register([
      {
        path: '/admin',
        module: AdminModule,
        children: [
          { path: '/reportes', module: ReportesModule },
        ],
      },
    ]),
  ],
})
export class AppModule {}

// Los módulos de admin/reportes solo se cargan
// cuando alguien accede a /admin/reportes
```

## Ejemplo avanzado

Worker threads para tareas CPU-bound, connection pooling, y perfilamiento.

<CodeGroup>
<CodeGroupItem title="worker.ts">

```typescript
// imagen.worker.ts — Worker para procesamiento de imágenes
import { parentPort, workerData } from 'worker_threads';
import * as sharp from 'sharp';

async function procesarImagen({ buffer, options }) {
  const resultado = await sharp(buffer)
    .resize(options.width, options.height)
    .webp({ quality: 80 })
    .toBuffer();

  return resultado;
}

// Ejecutar y devolver resultado al hilo principal
procesarImagen(workerData)
  .then(result => parentPort.postMessage(result))
  .catch(err => parentPort.postMessage({ error: err.message }));
```

</CodeGroupItem>

<CodeGroupItem title="imagen.service.ts">

```typescript
// imagen.service.ts — Hilo principal que usa worker
import { Worker } from 'worker_threads';
import * as path from 'path';

@Injectable()
export class ImagenService {
  async optimizar(buffer: Buffer, options: ImageOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, 'imagen.worker.js'), {
        workerData: { buffer, options },
      });

      worker.on('message', (result) => {
        if (result.error) reject(new Error(result.error));
        else resolve(result);
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker exit code ${code}`));
      });
    });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="connection-pool.ts">

```typescript
// Configuración de pool de conexiones
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        poolSize: 20,                    // Pool de conexiones
        extra: {
          max: 20,                       // Máximo conexiones en pool
          idleTimeoutMillis: 30000,      // Cerrar conexiones idle
          connectionTimeoutMillis: 5000, // Timeout de conexión
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

</CodeGroupItem>

<CodeGroupItem title="profiling.ts">

```typescript
// Profiling simple con decorador
export function Profile(name?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - start;

      console.log(`[Profile] ${name || propertyKey}: ${duration}ms`);

      // Enviar a sistema de monitoreo
      // metricsClient.histogram('execution_time', duration, { method: propertyKey });

      return result;
    };

    return descriptor;
  };
}

// Uso
@Injectable()
export class ProductosService {
  @Profile('Buscar productos con relaciones')
  async findWithRelations(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['categoria', 'imagenes'] });
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

API de e-commerce optimizada con múltiples capas de performance.

```
ESTRATEGIA DE PERFORMANCE
───────────────────────────

┌─────────────────────────────────────────────────────┐
│                    API Gateway                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Compression  │  │ Rate Limiter │  │ CORS Cache │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Capa de Caché (Redis)                   │
│  ┌─────────────────────────────────────────────────┐ │
│  │ catálogo: { ttl: 300, key: 'catalogo' }         │ │
│  │ producto:1: { ttl: 120, key: 'producto:1' }     │ │
│  │ usuario:5: { ttl: 600, key: 'usuario:5' }       │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Núcleo NestJS                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Worker 1 │ │ Worker 2 │ │ Worker 3 │ │  ...   │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│            Base de Datos (PostgreSQL)                │
│  Pool: 20 conexiones, índices, queries optimizadas  │
└─────────────────────────────────────────────────────┘

MÉTRICAS ANTES / DESPUÉS
─────────────────────────
┌──────────────────────┬──────────┬──────────┬────────┐
│ Endpoint             │ Antes    │ Después  │ Mejora │
├──────────────────────┼──────────┼──────────┼────────┤
│ GET /productos       │ 450ms    │ 12ms     │ 97%    │
│ GET /productos/:id   │ 120ms    │ 3ms      │ 97%    │
│ POST /pedidos        │ 850ms    │ 350ms    │ 59%    │
│ GET /catalogo        │ 3200ms   │ 45ms     │ 98%    │
└──────────────────────┴──────────┴──────────┴────────┘
```

## Buenas prácticas

### 1. Cachea todo lo que puedas

```typescript
// ✅ Cachear datos que no cambian frecuentemente
// - Catálogos de productos
// - Perfiles de usuario
// - Configuraciones
// - Resultados de consultas pesadas
```

### 2. Usa índices en base de datos

```sql
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id, fecha);
CREATE INDEX idx_busqueda_texto ON productos USING gin(nombre gin_trgm_ops);
```

### 3. Compresión HTTP

```typescript
// ✅ Principalmente para respuestas JSON grandes
app.use(compression());
// Reduce tamaño ~70-80% (gzip) o ~85-90% (brotli)
```

### 4. Usa clustering para CPU multi-core

```typescript
// ✅ Aprovecha todos los cores del servidor
// Crea un worker por core: `cluster.fork()`
```

### 5. Connection pooling para BD

```typescript
// ✅ No abras una conexión por request
TypeOrmModule.forRoot({ poolSize: 20 });
// Reutiliza conexiones del pool
```

### 6. Lazy loading para módulos grandes

```typescript
// ✅ Carga bajo demanda, no al inicio
```

## Errores comunes

### 1. Cachear datos que cambian frecuentemente

```typescript
// ❌ Error: cachear datos que cambian cada segundo
cache.set('precio-bitcoin', precio, 300);  // Obsoleto a los 5s

// ✅ Correcto: cachear datos relativamente estáticos
cache.set('paises', paises, 86400);  // Los países no cambian cada hora
```

### 2. No invalidar caché al actualizar datos

```typescript
// ❌ Error: crear producto sin limpiar caché
async create(dto) {
  const producto = await this.repo.save(dto);
  return producto;  // Catálogo en caché sigue mostrando datos viejos
}

// ✅ Correcto: invalidar caché relacionado
async create(dto) {
  const producto = await this.repo.save(dto);
  await this.cacheManager.del('catalogo');  // Limpiar caché del catálogo
  return producto;
}
```

### 3. No usar `enableShutdownHooks` con clustering

```typescript
// ❌ Error: shutdown hook desactivado, workers no se limpian
app.enableShutdownHooks();

// ✅ Correcto: permite graceful shutdown de workers
```

### 4. Procesar imágenes en el event loop principal

```typescript
// ❌ Error: operación CPU-bound bloquea event loop
@Post('upload')
async upload(@UploadedFile() file) {
  const buffer = await sharp(file.buffer).resize(2000).toBuffer();
  // Bloquea todos los requests mientras procesa
}

// ✅ Correcto: worker thread
@Post('upload')
async upload(@UploadedFile() file) {
  return this.imagenService.optimizar(file.buffer, { width: 2000 });
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Caché** | Almacenamiento temporal de datos frecuentes. |
| **Compresión** | Reduce tamaño de transferencia HTTP. |
| **Clustering** | Escala vertical usando múltiples procesos. |
| **Lazy Loading** | Carga módulos bajo demanda. |
| **Worker Threads** | Procesamiento paralelo para tareas CPU-bound. |
| **Queues** | Desvía trabajo pesado a workers asíncronos. |
| **Redis** | Almacenamiento externo para caché compartida. |

## Resumen

- **Caché** con `CacheModule` (TTL, max, Redis store).
- **Compresión** con middleware `compression` para respuestas gzip/brotli.
- **Clustering** con módulo `cluster` para multi-core.
- **Lazy loading** de módulos NestJS bajo demanda.
- **Worker threads** para tareas CPU-bound sin bloquear el event loop.
- **Connection pooling** en BD con `poolSize`.
- **Índices de BD** para consultas rápidas.
- **Invalidación de caché** al actualizar datos.
- Usa `console.time` o decoradores `@Profile` para medir performance.
- Monitorea con métricas (Prometheus, New Relic, Datadog).

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cómo implementas caché automática en un controlador NestJS?</summary>

Usando `@UseInterceptors(CacheInterceptor)` combinado con `@CacheKey()` y `@CacheTTL()` para personalizar clave y duración.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué diferencia hay entre clustering y worker threads?</summary>

**Clustering** crea múltiples procesos del servidor completo (cada worker escucha en el mismo puerto). **Worker threads** son hilos ligeros para tareas específicas (CPU-bound) dentro del mismo proceso.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cómo evitas que una operación CPU-bound bloquee el event loop?</summary>

Usando **worker threads** (para procesamiento pesado) o colas (Bull/RabbitMQ) para delegar el trabajo a procesos externos.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Por qué es importante invalidar la caché?</summary>

Porque sin invalidación, los usuarios ven datos desactualizados (stale data). Cada vez que se crean, actualizan o eliminan datos, debes limpiar las claves de caché relacionadas.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Qué beneficio aporta la compresión HTTP?</summary>

Reduce el tamaño de las respuestas JSON típicamente en 70-80% (gzip) o 85-90% (brotli), disminuyendo el ancho de banda y mejorando los tiempos de carga, especialmente en conexiones lentas.
</details>
