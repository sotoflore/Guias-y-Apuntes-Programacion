---
title: Proveedores en NestJS
description: Aprende qué son los proveedores en NestJS, cómo crearlos, los diferentes tipos (class, factory, value, alias) y cómo usar custom providers.
---

# Proveedores en NestJS

Los proveedores son como los **engranajes internos de un reloj**: nadie los ve desde fuera, pero sin ellos el reloj no funciona. Son las piezas que realizan el trabajo real de tu aplicación.

## ¿Qué es?

Un **proveedor** (provider) es cualquier clase decorada con `@Injectable()` que puede ser inyectada como dependencia en otras clases. Los servicios, repositorios, helpers y fábricas son todos providers.

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaludadorService {
  saludar(nombre: string): string {
    return `¡Hola, ${nombre}!`;
  }
}
```

Un provider se registra en un módulo para que el **contenedor IoC** (Inversion of Control) de NestJS pueda crearlo e inyectarlo donde sea necesario.

## ¿Por qué es importante?

Los providers son el **corazón de la inyección de dependencias** en NestJS. Sin ellos:

- Tendrías que instanciar manualmente cada clase con `new`.
- Perderías la capacidad de intercambiar implementaciones.
- El testing se volvería tedioso (sin mocking automático).
- El acoplamiento entre clases sería rígido.

Los providers te dan:

- **Desacoplamiento**: las clases no crean sus dependencias, las reciben.
- **Reutilización**: un provider puede inyectarse en N clases.
- **Testabilidad**: puedes reemplazar un provider real por un mock en tests.
- **Flexibilidad**: puedes cambiar implementaciones sin tocar el código que las usa.
- **Ciclo de vida gestionado**: NestJS controla si son singleton, por request o transientes.

:::tip
Si vienes de Angular, los providers de NestJS funcionan igual que los servicios en Angular. Si vienes de Express, piensa en ellos como módulos Node.js pero con superpoderes de DI.
:::

## Problema que resuelve

Sin providers ni DI, el código se ve así:

```typescript
// ❌ Sin providers: acoplamiento total
export class UsuariosController {
  private readonly db: Database;
  private readonly logger: Logger;
  private readonly email: EmailService;

  constructor() {
    // ❌ El controlador CREA sus dependencias manualmente
    this.db = new Database({ host: 'localhost', port: 5432 });
    this.logger = new Logger('UsuariosController');
    this.email = new EmailService({ apiKey: '...' });
  }

  async crear(dto: CrearUsuarioDto) {
    // ❌ Lógica de negocio MEZCLADA con acceso a datos
    const existe = await this.db.query(`SELECT * FROM usuarios WHERE email = '${dto.email}'`);
    if (existe.length > 0) {
      throw new Error('Email duplicado');
    }
    await this.db.query(`INSERT INTO usuarios (nombre, email) VALUES ('${dto.nombre}', '${dto.email}')`);
    await this.email.enviar({ to: dto.email, template: 'bienvenida' });
  }
}
```

Problemas:
1. **Acoplamiento rígido**: cambiar `Database` por otra implementación requiere modificar el controlador.
2. **Configuración esparcida**: host, puerto, apiKey están hardcodeados en el constructor.
3. **Imposible testear**: no puedes mockear `Database` o `EmailService`.
4. **Duplicación**: cada controlador que necesite `Database` debe instanciarlo.

Con providers y DI:

```typescript
// ✅ Con providers: desacoplado y testeable
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,  // ✅ Lo recibe inyectado
  ) {}

  async crear(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);  // Solo delega
  }
}

@Injectable()
export class UsuariosService {
  constructor(
    private readonly db: DatabaseService,    // ✅ Inyectado
    private readonly email: EmailService,    // ✅ Inyectado
  ) {}

  async crear(dto: CrearUsuarioDto) {
    const existe = await this.db.findByEmail(dto.email);
    if (existe) throw new ConflictException('Email duplicado');
    const usuario = await this.db.crear(dto);
    await this.email.enviarBienvenida(dto.email);
    return usuario;
  }
}
```

## Cómo funciona

### El contenedor IoC

NestJS tiene un **contenedor IoC** que actúa como un registro central de todos los providers. Cuando la aplicación arranca:

1. **Registro**: cada provider declarado en `providers` de un módulo se registra en el contenedor.
2. **Resolución**: cuando una clase necesita un provider (por su constructor), NestJS busca en el contenedor.
3. **Instanciación**: si el provider existe, lo crea (o lo reusa si es singleton) y lo inyecta.
4. **Caché**: los providers singleton se crean una vez y se reutilizan en toda la aplicación.

```
Registro en módulo
  @Module({
    providers: [UsuariosService]
  })
        │
        ▼
  Contenedor IoC
  ┌──────────────────────────┐
  │ UsuariosService → instancia │  ← singleton (por defecto)
  │ LoggerService    → instancia │
  │ MailService      → instancia │
  └──────────────────────────┘
        │
        ▼
  Inyección en UsuariosController
  constructor(private readonly usuariosService: UsuariosService)
```

### Tipos de providers

NestJS soporta 4 tipos de providers:

| Tipo | Cómo se define | Cuándo usarlo |
|---|---|---|
| **Class provider** | `{ provide: X, useClass: Y }` | Para intercambiar implementaciones |
| **Value provider** | `{ provide: X, useValue: {} }` | Para objetos, configuraciones, mocks |
| **Factory provider** | `{ provide: X, useFactory: () => {} }` | Para lógica compleja de creación |
| **Alias provider** | `{ provide: X, useExisting: Y }` | Para crear alias de providers existentes |

### Scopes (ciclo de vida)

| Scope | Descripción | Uso típico |
|---|---|---|
| `DEFAULT` (singleton) | Una instancia para toda la app | Servicios, repositorios |
| `REQUEST` | Una instancia por petición HTTP | Guards con datos de request |
| `TRANSIENT` | Una instancia por cada inyección | Providers con estado por consumidor |

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  // Nueva instancia por cada petición HTTP
}
```

## Sintaxis

### Formas de declarar providers

```typescript
// 1. Sintaxis abreviada (más común)
@Module({
  providers: [UsuariosService],
})

// 2. Sintaxis completa con useClass
@Module({
  providers: [
    {
      provide: UsuariosService,    // Token (normalmente la clase)
      useClass: UsuariosService,    // Implementación
    },
  ],
})

// 3. Con token string (inyección por string)
@Module({
  providers: [
    {
      provide: 'BASE_DATOS_CONFIG',
      useValue: { host: 'localhost', port: 5432 },
    },
  ],
})

// 4. Con token Symbol
@Module({
  providers: [
    {
      provide: Symbol('cache'),
      useClass: RedisCacheService,
    },
  ],
})
```

### Tipos de inyección

```typescript
// 1. Inyección por constructor (automática)
constructor(private readonly service: UsuariosService) {}

// 2. Inyección con @Inject() (para tokens string o Symbol)
constructor(@Inject('BASE_DATOS_CONFIG') private config: DbConfig) {}

// 3. Inyección opcional
constructor(@Optional() @Inject('LOGGER') private logger?: LoggerService) {}
```

## Ejemplo básico

Provider simple con sintaxis abreviada.

```typescript
// saludo.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaludoService {
  private readonly saludos: Record<string, string> = {
    mañana: '¡Buenos días!',
    tarde: '¡Buenas tardes!',
    noche: '¡Buenas noches!',
  };

  obtener(momento: string): string {
    return this.saludos[momento] || '¡Hola!';
  }
}
```

```typescript
// saludo.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { SaludoService } from './saludo.service';

@Controller('saludo')
export class SaludoController {
  constructor(private readonly saludoService: SaludoService) {}

  @Get(':momento')
  saludar(@Param('momento') momento: string): string {
    return this.saludoService.obtener(momento);
  }
}
```

```typescript
// saludo.module.ts
import { Module } from '@nestjs/common';
import { SaludoController } from './saludo.controller';
import { SaludoService } from './saludo.service';

@Module({
  controllers: [SaludoController],
  providers: [SaludoService],  // Registro del provider
})
export class SaludoModule {}
```

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { SaludoModule } from './saludo/saludo.module';

async function bootstrap() {
  const app = await NestFactory.create(SaludoModule);
  await app.listen(3000);
}
bootstrap();
```

## Ejemplo intermedio

Custom providers con `useClass`, `useValue` y `useFactory`.

<CodeGroup>
<CodeGroupItem title="common/database.provider.ts">

```typescript
import { Provider } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MockDatabaseService } from './mock-database.service';
import { ConfigService } from './config.service';

export const DATABASE_SERVICE = 'DATABASE_SERVICE';

// useFactory: decide en tiempo de ejecución qué implementación usar
export const databaseProvider: Provider = {
  provide: DATABASE_SERVICE,
  useFactory: (config: ConfigService) => {
    if (config.esModoDesarrollo) {
      return new MockDatabaseService();  // Mock para desarrollo
    }
    return new DatabaseService(config);  // Real para producción
  },
  inject: [ConfigService],  // Dependencias que necesita la factory
};
```

</CodeGroupItem>
<CodeGroupItem title="common/config.service.ts">

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get esModoDesarrollo(): boolean {
    return process.env.NODE_ENV !== 'production';
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="common/app-config.provider.ts">

```typescript
import { Provider } from '@nestjs/common';

export const APP_CONFIG = 'APP_CONFIG';

// useValue: valor fijo (como un objeto de configuración)
export const appConfigProvider: Provider = {
  provide: APP_CONFIG,
  useValue: {
    appName: 'Mi API',
    version: '1.0.0',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    maxUsuarios: 10000,
    características: ['auth', 'crud', 'notificaciones'],
  },
};
```

</CodeGroupItem>
<CodeGroupItem title="common/common.module.ts">

```typescript
import { Module } from '@nestjs/common';
import { databaseProvider, DATABASE_SERVICE } from './database.provider';
import { appConfigProvider } from './app-config.provider';
import { ConfigService } from './config.service';
import { SaludadorService } from './saludador.service';

@Module({
  providers: [
    ConfigService,
    databaseProvider,
    appConfigProvider,
    SaludadorService,
  ],
  exports: [
    ConfigService,
    DATABASE_SERVICE,
    APP_CONFIG,
    SaludadorService,
  ],
})
export class CommonModule {}
```

</CodeGroupItem>
</CodeGroup>

```typescript
// common/saludador.service.ts — Inyección con tokens string
import { Injectable, Inject } from '@nestjs/common';
import { APP_CONFIG } from './app-config.provider';
import { DATABASE_SERVICE } from './database.provider';

@Injectable()
export class SaludadorService {
  constructor(
    @Inject(APP_CONFIG) private readonly config: any,
    @Inject(DATABASE_SERVICE) private readonly db: any,
  ) {}

  saludar(): string {
    return `Bienvenido a ${this.config.appName} v${this.config.version}`;
  }
}
```

<details>
<summary>🔍 ¿Cuándo usar cada tipo de provider?</summary>

- **useClass**: cuando tienes múltiples implementaciones de una misma interfaz y quieres intercambiarlas (ej: `DatabaseService` real vs mock).
- **useValue**: para objetos de configuración, constantes, valores quemados o mocks en tests.
- **useFactory**: cuando la creación del provider requiere lógica condicional, llamadas asíncronas o acceso a config que no está disponible al importar.
- **useExisting**: para crear alias (ej: `MyService` es un alias de `OldService`).

</details>

## Ejemplo avanzado

Providers con scope REQUEST, factories asíncronas y uso de `@Inject()` con decoradores personalizados.

```typescript
// common/providers/request-context.provider.ts
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get usuarioId(): number | undefined {
    return this.request.usuario?.id;
  }

  get ip(): string {
    return this.request.ip || 'unknown';
  }

  get userAgent(): string {
    return this.request.headers['user-agent'] || 'unknown';
  }

  get correlationId(): string {
    return this.request.headers['x-correlation-id'] as string || 'unknown';
  }
}
```

```typescript
// common/providers/cache-factory.provider.ts — Factory asíncrona
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisClientFactory: FactoryProvider = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const redis = new Redis({
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
      password: configService.get('REDIS_PASSWORD'),
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    // Esperar a que la conexión esté lista
    await new Promise<void>((resolve, reject) => {
      redis.on('ready', () => resolve());
      redis.on('error', (err) => reject(err));
    });

    return redis;
  },
  inject: [ConfigService],
};
```

```typescript
// common/decorators/inject-redis.decorator.ts — Decorador personalizado
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '../providers/cache-factory.provider';

export const InjectRedis = () => Inject(REDIS_CLIENT);
```

```typescript
// common/decorators/inject-config.decorator.ts
import { Inject } from '@nestjs/common';

export const APP_CONFIG = 'APP_CONFIG';

export const InjectAppConfig = () => Inject(APP_CONFIG);
```

```typescript
// modules/auth/services/sesion.service.ts — Uso real
import { Injectable, Inject } from '@nestjs/common';
import { InjectRedis } from '../../../common/decorators/inject-redis.decorator';
import { InjectAppConfig } from '../../../common/decorators/inject-config.decorator';
import { RequestContextProvider } from '../../../common/providers/request-context.provider';
import Redis from 'ioredis';

@Injectable()
export class SesionService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectAppConfig() private readonly config: any,
    private readonly requestContext: RequestContextProvider,
  ) {}

  async crearSesion(usuarioId: number): Promise<string> {
    const token = crypto.randomUUID();

    await this.redis.set(
      `sesion:${token}`,
      JSON.stringify({
        usuarioId,
        ip: this.requestContext.ip,
        userAgent: this.requestContext.userAgent,
        creadoEn: new Date().toISOString(),
      }),
      'EX',
      86400, // Expira en 24h
    );

    return token;
  }

  async obtenerSesion(token: string) {
    const datos = await this.redis.get(`sesion:${token}`);
    return datos ? JSON.parse(datos) : null;
  }
}
```

```typescript
// auth.module.ts
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { SesionService } from './services/sesion.service';

@Module({
  imports: [CommonModule],
  providers: [SesionService],
  exports: [SesionService],
})
export class AuthModule {}
```

<details>
<summary>🔍 Providers avanzados explicados</summary>

1. **RequestContextProvider** (`Scope.REQUEST`): captura datos de la petición HTTP actual. Una instancia distinta por cada request. Ideal para logging con correlación, auditoría.
2. **redisClientFactory**: crea una conexión Redis asíncrona que espera a que el cliente esté listo antes de inyectarse.
3. **Decoradores personalizados** (`@InjectRedis()`, `@InjectAppConfig()`): evitan tener que recordar los tokens string cada vez que se inyecta un provider.
4. **SesionService**: combina request context, Redis y configuración en un solo servicio.

</details>

## Caso de uso real

Sistema de proveedores en una plataforma de streaming como **Spotify** o **Netflix**.

```
src/
├── common/
│   ├── providers/
│   │   ├── cache.provider.ts           # Redis (factory asíncrona)
│   │   ├── database.provider.ts        # PostgreSQL (useClass con mock)
│   │   ├── event-bus.provider.ts       # RabbitMQ (factory)
│   │   ├── storage.provider.ts         # S3 (useClass: AWS o MinIO)
│   │   └── search.provider.ts         # Elasticsearch (factory)
│   ├── decorators/
│   │   ├── inject-db.ts
│   │   ├── inject-cache.ts
│   │   └── inject-search.ts
│   └── common.module.ts
├── modules/
│   ├── auth/
│   │   ├── strategies/
│   │   ├── guards/
│   │   ├── services/
│   │   └── auth.module.ts
│   ├── catalogo/         # Películas/series
│   ├── reproduccion/     # Streaming
│   ├── recomendaciones/  # Motor ML
│   └── billing/          # Suscripciones
```

```typescript
// common/providers/storage.provider.ts
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3StorageService } from './s3-storage.service';
import { MinioStorageService } from './minio-storage.service';

export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export const storageProvider: Provider = {
  provide: STORAGE_SERVICE,
  useFactory: (config: ConfigService) => {
    if (config.get('STORAGE_PROVIDER') === 's3') {
      return new S3StorageService(config);
    }
    return new MinioStorageService(config);
  },
  inject: [ConfigService],
};
```

```typescript
// modules/reproduccion/services/streaming.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { STORAGE_SERVICE } from '../../../common/providers/storage.provider';
import { InjectCache } from '../../../common/decorators/inject-cache.decorator';

@Injectable()
export class StreamingService {
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storage: IStorageService,
    @InjectCache() private readonly cache: ICacheService,
  ) {}

  async obtenerUrlStreaming(peliculaId: string, calidad: string) {
    const cacheKey = `stream:${peliculaId}:${calidad}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const url = await this.storage.getSignedUrl(
      `peliculas/${peliculaId}/${calidad}.mp4`,
      3600,
    );

    await this.cache.set(cacheKey, url, 300);
    return url;
  }
}
```

## Buenas prácticas

### 1. Prefiere la sintaxis abreviada por defecto

```typescript
// ✅ Bien: simple y claro
providers: [UsuariosService]

// ❌ Mal: verbose sin necesidad
providers: [{ provide: UsuariosService, useClass: UsuariosService }]
```

### 2. Usa tokens string para servicios externos

```typescript
export const REDIS_CLIENT = 'REDIS_CLIENT';
// El string evita acoplamiento a una clase específica
```

### 3. Crea decoradores personalizados para tokens repetitivos

```typescript
export const InjectRedis = () => Inject('REDIS_CLIENT');
// Más limpio que @Inject('REDIS_CLIENT') en cada sitio
```

### 4. No abuses de Scope.REQUEST

```typescript
// ❌ Mal: demasiados providers con scope request
@Injectable({ scope: Scope.REQUEST }) // Cada provider será creado por request
// Esto puede degradar rendimiento

// ✅ Bien: solo cuando realmente necesitas datos de la request
@Injectable({ scope: Scope.REQUEST })
export class RequestContextProvider { }
```

### 5. Usa useFactory para configuraciones condicionales

```typescript
{
  provide: 'LOGGER',
  useFactory: (config: ConfigService) => {
    return config.get('NODE_ENV') === 'production'
      ? new JsonLogger()
      : new ConsoleLogger();
  },
  inject: [ConfigService],
}
```

### 6. Provee mocks en los tests

```typescript
const module = await Test.createTestingModule({
  providers: [
    UsuariosService,
    {
      provide: UsuariosRepository,
      useValue: mockRepository,  // Mock completo
    },
  ],
}).compile();
```

### 7. Usa `@Optional()` para dependencias no críticas

```typescript
constructor(
  @Optional() @Inject('ANALYTICS') private analytics?: AnalyticsService,
) {}
```

## Errores comunes

### 1. Olvidar registrar el provider en el módulo

```typescript
// ❌ Error: provider no registrado
@Module({
  controllers: [UsuariosController],
  // Falta: providers: [UsuariosService]
})
export class UsuariosModule {}
```

> **Síntoma**: `Nest can't resolve dependencies of UsuariosController`. NestJS no encuentra `UsuariosService` en el contenedor.

### 2. Provider registrado pero no exportado

```typescript
// ❌ Error: otro módulo no puede inyectarlo
@Module({
  providers: [UsuariosService],
  // Falta: exports: [UsuariosService]
})
```

### 3. Token incorrecto al inyectar

```typescript
// ❌ Error: el token no coincide
// Provider registrado con:
providers: [{ provide: 'DB_SERVICE', useClass: DatabaseService }]
// Inyección con:
constructor(@Inject('DATABASE_SERVICE') private db: DatabaseService) {}
// ❌ 'DATABASE_SERVICE' !== 'DB_SERVICE'

// ✅ Debe coincidir:
constructor(@Inject('DB_SERVICE') private db: DatabaseService) {}
```

### 4. Provider con scope REQUEST inyectado en un singleton

```typescript
// ❌ Error: scope request no puede inyectarse en singleton
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}

@Injectable()  // singleton por defecto
export class MiService {
  constructor(private readonly scoped: RequestScopedService) {}
  // ❌ NestJS lanza error: scope mismatch
}

// ✅ Inyectar solo si MiService también es request-scoped
@Injectable({ scope: Scope.REQUEST })
export class MiService {
  constructor(private readonly scoped: RequestScopedService) {}
}
```

### 5. Estado mutable en providers singleton

```typescript
// ❌ Error: estado compartido entre todos los usuarios
@Injectable()
export class AlmacenService {
  private datos: any[] = [];  // Singleton: COMPARTIDO

  agregar(dato: any) {
    this.datos.push(dato);  // Cualquier usuario modifica los datos de todos
  }
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Módulos** | Los providers se registran en `providers` del módulo y se comparten via `exports`. |
| **Servicios** | Son el tipo más común de provider. Todo servicio es un provider, pero no todo provider es un servicio. |
| **Inyección de Dependencias** | Los providers son los componentes que se inyectan. El contenedor IoC los gestiona. |
| **Controladores** | Los controladores **consumen** providers (servicios) mediante inyección en el constructor. |
| **Pipes / Guards / Interceptors** | También son providers. Se registran igual y pueden inyectar otros providers. |
| **@Injectable()** | Decorador que marca una clase como provider registrable en el contenedor IoC. |
| **@Inject()** | Decorador para inyección explícita cuando el token no es una clase. |
| **Custom providers** | `useClass`, `useValue`, `useFactory`, `useExisting` — formas avanzadas de definir providers. |
| **Scopes** | Controlan el ciclo de vida: DEFAULT (singleton), REQUEST, TRANSIENT. |

## Resumen

- Los **providers** son clases decoradas con `@Injectable()` que realizan el trabajo de la aplicación.
- Se registran en `providers` del módulo y se inyectan via constructor.
- Hay **4 tipos**: class (`useClass`), value (`useValue`), factory (`useFactory`), alias (`useExisting`).
- Los **scopes** controlan el ciclo de vida: DEFAULT (singleton), REQUEST (por petición), TRANSIENT (por inyección).
- Los **tokens** identifican providers: pueden ser clases (automático), strings o Symbols.
- `@Inject()` es necesario cuando el token no es una clase.
- `@Optional()` permite dependencias que pueden no existir.
- **Buenas prácticas**: sintaxis abreviada, tokens string para servicios externos, decoradores personalizados, factory para configuración condicional.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué decorador marca una clase como provider en NestJS?</summary>

**Respuesta:** `@Injectable()`. Sin este decorador, NestJS no puede registrar la clase en el contenedor IoC ni inyectarla como dependencia.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cuáles son los 4 tipos de custom providers?</summary>

**Respuesta:** `useClass` (implementación alternativa), `useValue` (valor fijo), `useFactory` (creación con lógica), `useExisting` (alias de otro provider).
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué diferencia hay entre un provider con scope DEFAULT y uno con scope REQUEST?</summary>

**Respuesta:** DEFAULT (singleton) crea una única instancia para toda la aplicación, compartida entre todos los usuarios y peticiones. REQUEST crea una nueva instancia por cada petición HTTP, ideal para capturar datos del request actual.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué sucede si olvidas registrar un provider en el módulo pero intentas inyectarlo?</summary>

**Respuesta:** NestJS lanza una excepción: `Nest can't resolve dependencies of X`. El contenedor IoC no encuentra el provider solicitado porque no fue registrado en ningún módulo.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Para qué sirve el decorador @Optional() en la inyección de dependencias?</summary>

**Respuesta:** Para marcar una dependencia como no obligatoria. Si el provider no existe en el contenedor, NestJS inyecta `undefined` en lugar de lanzar un error. Útil para características opcionales como analytics o logging.
</details>
