---
title: Middlewares en NestJS
description: Aprende qué son los middlewares en NestJS, cómo crear middlewares funcionales y de clase, aplicarlos a rutas específicas, usar middleware global y buenas prácticas.
---

# Middlewares en NestJS

Los middlewares son como **guardias de seguridad en un edificio**: cada petición que llega debe pasar por ellos antes de acceder a las oficinas (controladores). Pueden inspeccionar, modificar o bloquear la entrada.

## ¿Qué es?

Un **middleware** es una función que se ejecuta **antes** del manejador de ruta. Tiene acceso al objeto `Request`, al `Response` y a la función `next()`. Puede:

- Ejecutar código
- Modificar `req` y `res`
- Finalizar la petición (responder directamente)
- Pasar el control al siguiente middleware con `next()`

```typescript
// Middleware funcional simple
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}
```

## ¿Por qué es importante?

Los middlewares son el **punto de extensión más básico** de cualquier aplicación Express/NestJS. Importan porque:

- **Centralizan lógica transversal** antes de que llegue a los controladores.
- **Evitan código duplicado** en múltiples controladores/rutas.
- **Permiten logging, autenticación, compresión, CORS** y mucho más.
- **Son el primer filtro de seguridad** de tu aplicación.

:::tip
En NestJS, los Guards, Pipes e Interceptors pueden cubrir muchos casos que tradicionalmente usaban middlewares. Sin embargo, los middlewares siguen siendo útiles para lógica muy temprana en el ciclo de vida (logging, rate-limiting, cors, etc.).
:::

## Problema que resuelve

Sin middlewares, tendrías que repetir la misma lógica en cada ruta:

```typescript
// ❌ Sin middleware: código duplicado en cada ruta
@Controller('usuarios')
export class UsuariosController {
  @Get()
  obtenerTodos(@Req() req: Request) {
    console.log(`${req.method} ${req.url}`);  // ← Repetido
    return this.service.obtenerTodos();
  }

  @Post()
  crear(@Req() req: Request, @Body() dto: any) {
    console.log(`${req.method} ${req.url}`);  // ← Repetido
    return this.service.crear(dto);
  }
}

@Controller('productos')
export class ProductosController {
  @Get()
  obtenerTodos(@Req() req: Request) {
    console.log(`${req.method} ${req.url}`);  // ← Repetido en otro controlador
    return this.service.obtenerTodos();
  }
}
```

Con middlewares, defines la lógica **una vez** y se aplica a todas las rutas:

```typescript
// ✅ Con middleware: lógica centralizada
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}

// En el módulo:
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

## Cómo funciona

### Ciclo de vida de una petición

```
Petición entrante
      │
      ▼
┌─────────────────────┐
│    Middleware(s)     │ ← Logger, Auth, Compresión, CORS...
│  (se ejecutan en     │
│   orden de registro) │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│       Guards        │ ← Autorización
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Interceptors (pre) │ ← Transformar request
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│       Pipes         │ ← Validación / Transformación
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Route Handler     │ ← Lógica de negocio
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Interceptors (post) │ ← Transformar response
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Exception Filters  │ ← Manejar errores
└─────────────────────┘
          │
          ▼
   Respuesta al cliente
```

### Middleware vs Guard vs Interceptor

| Aspecto | Middleware | Guard | Interceptor |
|---|---|---|---|
| **Cuándo se ejecuta** | Primero (antes que todo) | Después de middleware | Antes/después del handler |
| **Acceso a `req`/`res`** | Sí (express) | No directamente | No directamente |
| **Puede modificar `req`** | Sí | No (no debería) | Sí (con wrap) |
| **Puede finalizar la respuesta** | Sí | Sí | Sí (si no llama al handler) |
| **Propósito principal** | Logging, CORS, compresión, rate-limit | Autorización | Transformación, caching, logging |

## Sintaxis

### Crear middleware

Hay dos formas de crear middlewares en NestJS:

**1. Middleware de clase** (con `@Injectable()`):

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
```

**2. Middleware funcional** (sin clase, más simple):

```typescript
import { Request, Response, NextFunction } from 'express';

export function loggerFuncional(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}
```

### Aplicar middleware en el módulo

```typescript
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

@Module({ imports: [UsuariosModule, ProductosModule] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');  // Todas las rutas
  }
}
```

### Métodos de `MiddlewareConsumer`

| Método | Descripción |
|---|---|
| `apply(...middleware)` | Especifica el/los middlewares a aplicar |
| `forRoutes(...rutas)` | Define las rutas a las que aplicar |
| `exclude(...rutas)` | Excluye rutas específicas |

## Ejemplo básico

Middleware de logging que registra cada petición.

```typescript
// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url } = req;

    // Escucha el evento 'finish' para loguear respuesta
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${method} ${url} ${res.statusCode} - ${duration}ms`);
    });

    next();
  }
}
```

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({ imports: [UsuariosModule, ProductosModule] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
```

**Salida en consola:**

```
GET /api/v1/usuarios 200 - 15ms
POST /api/v1/productos 201 - 42ms
GET /api/v1/usuarios/5/pedidos 200 - 8ms
```

## Ejemplo intermedio

Middleware de autenticación que verifica API Key, con exclusión de rutas públicas.

```typescript
// src/common/middleware/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API Key es requerida');
    }

    if (apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('API Key inválida');
    }

    // Añadir información del cliente al request
    req['cliente'] = { nombre: 'Cliente verificado', apiKey };
    next();
  }
}
```

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

@Module({ imports: [AuthModule, UsuariosModule, ProductosModule, HealthModule] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },     // GET /health es público
        { path: 'auth/login', method: RequestMethod.POST }, // POST /auth/login es público
        { path: 'auth/registro', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
```

```typescript
// Múltiples middlewares en orden
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

@Module({ imports: [AppModules] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, AuthMiddleware, CompressionMiddleware)
      .forRoutes({ path: 'api/v1/*', method: RequestMethod.ALL });
  }
}
```

<details>
<summary>🔍 Aplicar middleware a controladores específicos</summary>

```typescript
// Aplicar solo a un controlador específico
consumer
  .apply(LoggerMiddleware)
  .forRoutes(UsuariosController);

// Aplicar a un path y método específicos
consumer
  .apply(AuthMiddleware)
  .forRoutes(
    { path: 'usuarios', method: RequestMethod.GET },
    { path: 'usuarios/:id', method: RequestMethod.GET },
  );
```

</details>

## Ejemplo avanzado

Middleware para rate-limiting, cors personalizado y middleware asíncrono con inyección de dependencias.

<CodeGroup>
<CodeGroupItem title="rate-limiter.middleware.ts">

```typescript
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  // En producción, usa Redis en lugar de memoria
  private readonly store = new Map<string, RateLimitEntry>();
  private readonly maxRequests = 100;
  private readonly windowMs = 60_000; // 1 minuto

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry || now > entry.resetAt) {
      this.store.set(ip, { count: 1, resetAt: now + this.windowMs });
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', this.maxRequests - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + this.windowMs) / 1000));
      return next();
    }

    entry.count++;

    if (entry.count > this.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      throw new HttpException(
        `Demasiadas peticiones. Intenta de nuevo en ${retryAfter} segundos`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    res.setHeader('X-RateLimit-Remaining', this.maxRequests - entry.count);
    next();
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="cors-custom.middleware.ts">

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsCustomMiddleware implements NestMiddleware {
  private readonly allowedOrigins = [
    'https://miapp.com',
    'https://admin.miapp.com',
    /^https:\/\/.*\.vercel\.app$/,  // Regex para dominios dinámicos
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;

    const permitido = this.allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin || '');
      return allowed === origin;
    });

    if (permitido) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-API-Key');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400');
    }

    // Responder directamente a OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    next();
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="audit.middleware.ts">

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private readonly auditService: AuditService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url, body, headers } = req;
    const usuario = req['usuario']?.id || 'anónimo';

    // Interceptar el método end original para capturar el status
    const originalEnd = res.end.bind(res);
    res.end = (...args: any[]) => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      // Registrar auditoría de forma asíncrona (no bloqueante)
      setImmediate(() => {
        this.auditService.registrar({
          usuario,
          metodo: method,
          ruta: url,
          statusCode,
          duracion: duration,
          ip: req.ip,
          userAgent: headers['user-agent'],
          timestamp: new Date().toISOString(),
        }).catch(err => console.error('Error registrando auditoría:', err));
      });

      return originalEnd(...args);
    };

    next();
  }
}
```

</CodeGroupItem>
</CodeGroup>

```typescript
// app.module.ts — Aplicando middleware asíncrono
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuditService } from './common/services/audit.service';

@Module({
  providers: [AuditService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CorsCustomMiddleware,
        RateLimiterMiddleware,
        AuditMiddleware,  // Tiene dependencias inyectadas
      )
      .forRoutes({ path: 'api/v1/*', method: RequestMethod.ALL });
  }
}
```

<details>
<summary>🔍 Middleware global con Dependency Injection</summary>

Para middleware que necesita DI pero quieres aplicar globalmente sin implementar `NestModule`:

```typescript
// main.ts
const app = await NestFactory.create(AppModule);
app.use(new LoggerMiddleware().use);  // Sin DI
```

Para middleware con DI a nivel global:

```typescript
// app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuditMiddleware)  // AuditService se inyecta automáticamente
      .forRoutes('*');
  }
}
```

O usando el `APP_FILTER` / `APP_PIPE` style no es posible para middleware — la forma correcta es siempre via `configure()` en el módulo raíz.

</details>

## Caso de uso real

Middleware pipeline para una API financiera con requisitos de seguridad y auditoría.

```
PIPELINE DE MIDDLEWARES
─────────────────────────────────────────────────────────

                  ┌─────────────────────────┐
  Petición →      │  1. IP Whitelist         │ ← Solo IPs corporativas
                  └──────────┬──────────────┘
                             ▼
                  ┌─────────────────────────┐
                  │  2. Rate Limiter         │ ← 100 req/min por IP
                  └──────────┬──────────────┘
                             ▼
                  ┌─────────────────────────┐
                  │  3. CORS                 │ ← Solo dominios aprobados
                  └──────────┬──────────────┘
                             ▼
                  ┌─────────────────────────┐
                  │  4. API Key Validation   │ ← Verificar API key
                  └──────────┬──────────────┘
                             ▼
                  ┌─────────────────────────┐
                  │  5. Request Logger       │ ← Logging estructurado
                  └──────────┬──────────────┘
                             ▼
                  ┌─────────────────────────┐
                  │  6. Auditoría            │ ← Registrar cada operación
                  └──────────┬──────────────┘
                             ▼
                  ┌─────────────────────────┐
                  │  7. Compression          │ ← Gzip/Brotli
                  └──────────┬──────────────┘
                             ▼
                     Guards → Pipes → Handler → ...
```

```typescript
// app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        IpWhitelistMiddleware,   // Solo IPs internas
        RateLimiterMiddleware,   // Límite de peticiones
        CorsCustomMiddleware,    // CORS restrictivo
        ApiKeyValidationMiddleware, // Validar API key
        RequestLoggerMiddleware, // Logging estructurado
        AuditMiddleware,         // Auditoría de operaciones
        CompressionMiddleware,   // Compresión de respuesta
      )
      .forRoutes('api/v1/*');

    // Rutas públicas no pasan por API key ni rate limiting estricto
    consumer
      .apply(LightLoggerMiddleware)
      .forRoutes('health', 'auth/login');
  }
}
```

<details>
<summary>🔍 Middleware de IP Whitelist</summary>

```typescript
@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private readonly whitelist = ['192.168.1.0/24', '10.0.0.0/8'];

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || '';
    const permitida = this.whitelist.some(range => this.ipInRange(ip, range));

    if (!permitida) {
      throw new ForbiddenException('Acceso no autorizado desde esta IP');
    }
    next();
  }

  private ipInRange(ip: string, range: string): boolean {
    // Implementación simplificada
    return ip.startsWith('192.168.1.') || ip.startsWith('10.');
  }
}
```

</details>

## Buenas prácticas

### 1. Mantén los middlewares ligeros y rápidos

Un middleware no debería hacer operaciones pesadas (llamadas a DB, procesamiento intensivo). Si necesitas lógica pesada, considera usar un Interceptor o un servicio.

### 2. Ordena los middlewares correctamente

Los middlewares se ejecutan **en el orden en que se registran**. El orden típico es:

```
1. Seguridad (CORS, IP whitelist, rate limiting)
2. Parsing (body parser, compression)
3. Logging / Auditoría
4. Autenticación / API Key
5. Enrutamiento (el de NestJS, automático)
```

### 3. Prefiere middleware funcional cuando no necesites DI

```typescript
// ✅ Bien: funcional, sin dependencias
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url}`);
  next();
}

// ✅ Bien: clase solo cuando necesitas inyección
@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private readonly auditService: AuditService) {}
  use(req: Request, res: Response, next: NextFunction) { /* ... */ }
}
```

### 4. Excluye rutas públicas explícitamente

```typescript
consumer
  .apply(AuthMiddleware)
  .exclude(
    { path: 'health', method: RequestMethod.GET },
    { path: 'auth/(.*)', method: RequestMethod.ALL },  // Regex
  )
  .forRoutes('*');
```

### 5. No uses middleware para lógica que pueden manejar Guards

Los Guards son más específicos y tienen acceso al `Reflector` para metadatos. Si necesitas roles, permisos, o autorización, usa Guards.

### 6. Usa variables de entorno para configuraciones

```typescript
@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
  private readonly windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
  // ...
}
```

## Errores comunes

### 1. Olvidar llamar a `next()`

```typescript
// ❌ Error: la petición se queda colgada
@Injectable()
export class MiMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Haciendo algo...');
    // ¡Nunca llama a next()!
  }
}

// ✅ Correcto: siempre llamar a next()
@Injectable()
export class MiMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Haciendo algo...');
    next();  // ← Fundamental
  }
}
```

### 2. No implementar `NestModule` en el módulo

```typescript
// ❌ Error: configure no se ejecutará
@Module({ controllers: [MiController] })
export class MiModule {  // ← Falta implements NestModule
  configure(consumer: MiddlewareConsumer) { /* ... */ }
}

// ✅ Correcto
@Module({ controllers: [MiController] })
export class MiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { /* ... */ }
}
```

### 3. Lanzar excepciones síncronas sin try-catch en middleware asíncrono

```typescript
// ❌ Error: si findUser lanza error, next no se llama
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.userService.findUser(req.headers.token);
    req['user'] = user;
    next();
  }
}

// ✅ Correcto: envolver en try-catch o confiar en el error filter
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findUser(req.headers.token);
      req['user'] = user;
      next();
    } catch (error) {
      next(error);  // Pasa el error al manejador de errores
    }
  }
}
```

### 4. Aplicar middleware global en `main.ts` que debería ir en el módulo

```typescript
// ❌ Mal: sin acceso a DI
app.use(new AuthMiddleware().use);  // Si AuthMiddleware necesita servicios, fallará

// ✅ Bien: via configure() en el módulo
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
```

### 5. Modificar `req` sin tipado

```typescript
// ❌ Error: req['usuario'] no existe en el tipo
req.usuario = { id: 1 };  // TypeScript error

// ✅ Correcto: extender el tipo Request
declare global {
  namespace Express {
    interface Request {
      usuario?: { id: number; nombre: string };
    }
  }
}

// O usar un tipo local
(req as any).usuario = { id: 1 };  // Alternativa rápida (no recomendada)
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Guards** | Se ejecutan después de los middlewares. Usa Guards para autorización, middlewares para lógica más básica (CORS, rate-limit). |
| **Interceptors** | Tienen más control sobre el flujo (pueden modificar la respuesta). Úsalos cuando necesites transformar datos, no para lógica temprana. |
| **Pipes** | Validan y transforman datos de entrada. Se ejecutan después de Guards. |
| **Exception Filters** | Capturan errores lanzados en cualquier capa, incluyendo middlewares. |
| **Express** | NestJS usa el sistema de middlewares de Express por debajo. Puedes usar cualquier middleware de Express directamente. |
| **Módulos** | Los middlewares se configuran a nivel de módulo con `configure()`. |

## Resumen

- Los **middlewares** se ejecutan **antes** que cualquier otro componente (Guards, Pipes, Interceptors, Handlers).
- Hay dos tipos: **clase** (con `@Injectable()` e `implements NestMiddleware`) y **funcional** (función simple).
- Se aplican en el módulo mediante `configure(consumer: MiddlewareConsumer)` implementando `NestModule`.
- Puedes aplicar middlewares a **rutas específicas**, **controladores específicos** o a **todas las rutas**.
- El **orden de los middlewares importa**: se ejecutan en el orden en que se registran.
- Usa `exclude()` para omitir rutas públicas.
- Los middlewares tienen acceso directo a `req` y `res` de Express.
- **No uses middleware** para lógica que puedan manejar Guards (autorización) o Interceptors (transformación).
- Middleware funcional sin dependencias es más simple; usa clase solo cuando necesites inyección de dependencias.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿En qué orden se ejecutan los middlewares, guards, pipes e interceptors?</summary>

**Respuesta:** Middleware → Guard → Interceptor (pre) → Pipe → Handler → Interceptor (post) → Exception Filter (si hay error). Los middlewares son siempre los primeros en ejecutarse.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué diferencia hay entre un middleware funcional y uno de clase?</summary>

**Respuesta:** El middleware de clase usa `@Injectable()` y puede tener dependencias inyectadas en el constructor (ej: servicios). El middleware funcional es una función simple sin DI. Si no necesitas inyección, el funcional es más simple y preferible.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué ocurre si olvidas llamar a `next()` en un middleware?</summary>

**Respuesta:** La petición se queda "colgada" — el cliente nunca recibe respuesta (timeout eventualmente). El flujo de la petición se detiene y nunca llega al controlador ni a ningún middleware posterior.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo excluyes una ruta pública del middleware de autenticación?</summary>

**Respuesta:** Usando el método `.exclude()` antes de `.forRoutes()`:

```typescript
consumer
  .apply(AuthMiddleware)
  .exclude({ path: 'auth/login', method: RequestMethod.POST })
  .forRoutes('*');
```
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cuándo deberías usar un middleware en lugar de un Guard?</summary>

**Respuesta:** Usa middleware para lógica de infraestructura temprana: CORS, rate-limiting, logging, compresión, parseo. Usa Guards para autorización y control de acceso. Los Guards tienen mejor integración con el ecosistema NestJS (Reflector, metadatos, decoradores personalizados).
</details>
