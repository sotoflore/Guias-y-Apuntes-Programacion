---
title: Módulos en NestJS
description: Aprende qué son los módulos en NestJS, cómo organizan la aplicación, módulos compartidos, globales, dinámicos y reexportación.
---

# Módulos en NestJS

Los módulos son como los **departamentos de una empresa**: cada uno tiene una responsabilidad clara, sus propios empleados (controladores, servicios) y puede colaborar con otros departamentos sin pisarse.

## ¿Qué es?

Un **módulo** es una clase decorada con `@Module()` que agrupa un conjunto de componentes relacionados: controladores, servicios, pipes, guards y otros providers. Es la unidad fundamental de organización en NestJS.

```typescript
import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
```

## ¿Por qué es importante?

Sin módulos, toda la aplicación sería un solo archivo gigante con cientos de líneas. Los módulos importan porque:

- **Organizan el código** por dominio de negocio, no por tipo técnico.
- **Encapsulan funcionalidad**: solo exportas lo que otros módulos necesitan.
- **Controlan el alcance de los providers**: un servicio vive solo dentro de su módulo a menos que se exporte.
- **Permiten lazy loading** y configuración dinámica.
- **Facilitan el testing**: puedes probar un módulo de forma aislada.
- **Estandarizan la estructura**: cualquier desarrollador de NestJS sabe dónde encontrar cada cosa.

:::tip
Piensa en los módulos como **cajas**: cada caja contiene todo lo necesario para una funcionalidad. Si necesitas esa funcionalidad, importas la caja completa.
:::

## Problema que resuelve

En aplicaciones sin una estructura modular, todo termina mezclado:

```typescript
// ❌ Sin módulos: todo en AppModule
@Module({
  controllers: [
    AuthController,
    UsuariosController,
    ProductosController,
    PedidosController,
    PagosController,
    NotificacionesController,
    ReportesController,
  ],
  providers: [
    AuthService, AuthGuard, JwtService,
    UsuariosService, UsuariosRepository,
    ProductosService, ProductosRepository,
    PedidosService, PedidosRepository,
    PagosService, PagosRepository,
    NotificacionesService,
    ReportesService,
    // ... 30+ providers más
  ],
})
export class AppModule {}
```

Este `AppModule` es **inmantenible**:

1. **Sin separación**: no sabes qué servicios usa cada controlador.
2. **Acoplamiento**: cambiar un servicio requiere escanear 30+ providers.
3. **Dificultad para testear**: no puedes aislar una funcionalidad.
4. **Sin límites**: cualquier provider puede inyectar cualquier otro provider.

La solución son módulos por dominio:

```typescript
// ✅ Con módulos: cada dominio encapsulado
@Module({
  imports: [
    AuthModule,       // Login, registro, JWT
    UsuariosModule,   // CRUD de usuarios
    ProductosModule,  // Catálogo de productos
    PedidosModule,    // Gestión de pedidos
    PagosModule,      // Procesamiento de pagos
  ],
})
export class AppModule {}
```

Cada módulo interno tiene sus propios controladores, servicios y dependencias:

```typescript
@Module({
  controllers: [ProductosController],
  providers: [ProductosService, ProductosRepository],
  exports: [ProductosService],
})
export class ProductosModule {}
```

## Cómo funciona

### Estructura de @Module()

```typescript
@Module({
  imports:      // Módulos que este módulo necesita
  controllers:  // Controladores que pertenecen a este módulo
  providers:    // Servicios y providers de este módulo
  exports:      // Providers que otros módulos pueden usar
})
```

### Diagrama de relaciones entre módulos

```
AppModule
  │
  ├── CommonModule (global)
  │     └── LoggerService, ConfigService
  │
  ├── AuthModule
  │     ├── AuthController
  │     ├── AuthService ───────────────┐
  │     └── JwtStrategy                │ (exporta AuthService)
  │                                    │
  ├── UsuariosModule ──────────────────┤
  │     ├── UsuariosController         │  (usa AuthService)
  │     ├── UsuariosService            │
  │     └── TypeOrmModule              │
  │                                    │
  ├── ProductosModule                  │
  │     ├── ProductosController        │
  │     └── ProductosService ──────────┤
  │                                   │
  └── PedidosModule ──────────────────┤
        ├── PedidosController         │  (usa AuthService + ProductosService)
        ├── PedidosService            │
        └── TypeOrmModule
```

### Ciclo de vida de los módulos

1. **AppModule** se define como módulo raíz en `main.ts`.
2. NestJS **resuelve las dependencias** recursivamente: lee `imports` de cada módulo.
3. **Instancia los providers** de cada módulo (singleton por defecto).
4. **Inyecta dependencias** entre providers.
5. **Registra los controladores** para que el router los reconozca.

### Ámbito de los providers

| Dónde se declara | ¿Accesible en el mismo módulo? | ¿Accesible en otros módulos? |
|---|---|---|
| `providers` del módulo | Sí | Solo si está en `exports` |
| `providers` de otro módulo importado | No automáticamente | Solo si el otro módulo lo exporta |
| `providers` de módulo global | Sí (sin importar) | Sí (sin importar) |

## Sintaxis

### Configuración del decorador @Module()

| Propiedad | Tipo | Descripción |
|---|---|---|
| `imports` | `Array<Type \| DynamicModule \| Promise<DynamicModule>>` | Módulos que importa |
| `controllers` | `Array<Type<Controller>>` | Controladores de este módulo |
| `providers` | `Array<Type \| Provider>` | Providers que pertenecen al módulo |
| `exports` | `Array<Type \| Provider \| string \| symbol>` | Providers que se comparten con otros módulos |

### Formas de exportar

```typescript
// 1. Exportar por clase (recomendado)
@Module({
  providers: [UsuariosService],
  exports: [UsuariosService],
})

// 2. Exportar módulo completo (reexportar)
@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  exports: [TypeOrmModule],  // Otros módulos pueden usar TypeOrm
})

// 3. Exportar con token personalizado
@Module({
  providers: [
    { provide: 'USUARIO_REPOSITORIO', useClass: UsuarioRepository },
  ],
  exports: ['USUARIO_REPOSITORIO'],
})
```

## Ejemplo básico

Dos módulos independientes donde uno usa un servicio del otro.

```typescript
// saludo/saludo.module.ts
import { Module } from '@nestjs/common';
import { SaludoController } from './saludo.controller';
import { SaludoService } from './saludo.service';

@Module({
  controllers: [SaludoController],
  providers: [SaludoService],
  exports: [SaludoService],
})
export class SaludoModule {}
```

```typescript
// saludo/saludo.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaludoService {
  obtenerSaludo(idioma: string): string {
    const saludos: Record<string, string> = {
      es: '¡Hola!',
      en: 'Hello!',
      fr: 'Bonjour!',
      de: 'Hallo!',
    };
    return saludos[idioma] || saludos.es;
  }
}
```

```typescript
// saludo/saludo.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SaludoService } from './saludo.service';

@Controller('saludo')
export class SaludoController {
  constructor(private readonly saludoService: SaludoService) {}

  @Get()
  saludar(@Query('idioma') idioma: string): string {
    return this.saludoService.obtenerSaludo(idioma);
  }
}
```

```typescript
// despedida/despedida.module.ts
import { Module } from '@nestjs/common';
import { DespedidaController } from './despedida.controller';
import { DespedidaService } from './despedida.service';
import { SaludoModule } from '../saludo/saludo.module';

@Module({
  imports: [SaludoModule],  // Importa para usar SaludoService
  controllers: [DespedidaController],
  providers: [DespedidaService],
})
export class DespedidaModule {}
```

```typescript
// despedida/despedida.service.ts
import { Injectable } from '@nestjs/common';
import { SaludoService } from '../saludo/saludo.service';

@Injectable()
export class DespedidaService {
  constructor(private readonly saludoService: SaludoService) {}

  despedirConSaludo(idioma: string): string {
    const saludo = this.saludoService.obtenerSaludo(idioma);
    return `${saludo} ... y ¡adiós!`;
  }
}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { SaludoModule } from './saludo/saludo.module';
import { DespedidaModule } from './despedida/despedida.module';

@Module({
  imports: [SaludoModule, DespedidaModule],
})
export class AppModule {}
```

## Ejemplo intermedio

Módulo compartido, módulo global y reexportación.

<CodeGroup>
<CodeGroupItem title="compartido/compartido.module.ts">

```typescript
import { Module } from '@nestjs/common';
import { FechaService } from './fecha.service';
import { FormateoService } from './formateo.service';

@Module({
  providers: [FechaService, FormateoService],
  exports: [FechaService, FormateoService],
})
export class CompartidoModule {}
```

</CodeGroupItem>
<CodeGroupItem title="compartido/fecha.service.ts">

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class FechaService {
  obtenerFechaActual(): string {
    return new Date().toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  obtenerTimestamp(): number {
    return Date.now();
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="global/global.module.ts">

```typescript
import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfiguracionService } from './configuracion.service';

@Global()
@Module({
  providers: [LoggerService, ConfiguracionService],
  exports: [LoggerService, ConfiguracionService],
})
export class GlobalModule {}
```

</CodeGroupItem>
<CodeGroupItem title="global/logger.service.ts">

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger('App');

  info(mensaje: string) {
    this.logger.log(mensaje);
  }

  error(mensaje: string, trace?: string) {
    this.logger.error(mensaje, trace);
  }
}
```

</CodeGroupItem>
</CodeGroup>

```typescript
// usuarios/usuarios.module.ts — Reexportación
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService, TypeOrmModule],  // Reexporta TypeOrmModule
})
export class UsuariosModule {}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompartidoModule } from './compartido/compartido.module';
import { GlobalModule } from './global/global.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ /* conexión BD */ }),
    GlobalModule,      // LoggerService disponible en TODOS los módulos
    CompartidoModule,  // FechaService disponible solo si se importa
    UsuariosModule,    // TypeOrmModule reexportado disponible
  ],
})
export class AppModule {}
```

```typescript
// pedidos/pedidos.service.ts — Usa LoggerService sin importar GlobalModule
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../global/logger.service'; // Sin importar GlobalModule

@Injectable()
export class PedidosService {
  constructor(private readonly logger: LoggerService) {
    this.logger.info('PedidosService inicializado');
  }
}
```

:::warning
Usa `@Global()` con moderación. Solo servicios verdaderamente transversales (logging, config, caché) deberían ser globales. Para todo lo demás, usa imports explícitos.
:::

## Ejemplo avanzado

Módulo dinámico configurable con `forRoot()` y `forFeature()`, similar a cómo funcionan `TypeOrmModule` y `ConfigModule`.

<CodeGroup>
<CodeGroupItem title="cache/cache.module.ts">

```typescript
import { Module, DynamicModule, Provider } from '@nestjs/common';
import { CacheService } from './cache.service';
import { REDIS_CLIENT, CACHE_OPTIONS } from './cache.constants';
import { CacheOptions } from './interfaces/cache-options.interface';
import { crearClienteRedis } from './redis-client.factory';

@Module({})
export class CacheModule {
  static forRoot(opciones: CacheOptions): DynamicModule {
    const providers: Provider[] = [
      CacheService,
      {
        provide: CACHE_OPTIONS,
        useValue: opciones,
      },
      {
        provide: REDIS_CLIENT,
        useFactory: () => crearClienteRedis(opciones),
      },
    ];

    return {
      module: CacheModule,
      providers,
      exports: [CacheService, REDIS_CLIENT],
      global: opciones.global ?? false,
    };
  }

  static forFeature(entidad: string): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: `CACHE_${entidad.toUpperCase()}`,
          useFactory: (cacheService: CacheService) => ({
            obtener: (id: number) => cacheService.obtener(`${entidad}:${id}`),
            guardar: (id: number, datos: any) =>
              cacheService.guardar(`${entidad}:${id}`, datos),
            invalidar: (id: number) =>
              cacheService.invalidar(`${entidad}:${id}`),
          }),
          inject: [CacheService],
        },
      ],
      exports: [`CACHE_${entidad.toUpperCase()}`],
    };
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="cache/cache.service.ts">

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT, CACHE_OPTIONS } from './cache.constants';
import { CacheOptions } from './interfaces/cache-options.interface';

@Injectable()
export class CacheService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: RedisClientType,
    @Inject(CACHE_OPTIONS)
    private readonly opciones: CacheOptions,
  ) {}

  async obtener(clave: string): Promise<any> {
    const datos = await this.redis.get(clave);
    return datos ? JSON.parse(datos) : null;
  }

  async guardar(clave: string, valor: any): Promise<void> {
    await this.redis.setEx(
      clave,
      this.opciones.ttlSegundos || 3600,
      JSON.stringify(valor),
    );
  }

  async invalidar(clave: string): Promise<void> {
    await this.redis.del(clave);
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="cache/cache.constants.ts">

```typescript
export const REDIS_CLIENT = 'REDIS_CLIENT';
export const CACHE_OPTIONS = 'CACHE_OPTIONS';
```

</CodeGroupItem>
<CodeGroupItem title="cache/interfaces/cache-options.interface.ts">

```typescript
export interface CacheOptions {
  host: string;
  port: number;
  ttlSegundos?: number;
  global?: boolean;
}
```

</CodeGroupItem>
</CodeGroup>

```typescript
// app.module.ts — Uso del módulo dinámico
import { Module } from '@nestjs/common';
import { CacheModule } from './common/cache/cache.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { ProductosModule } from './modules/productos/productos.module';

@Module({
  imports: [
    CacheModule.forRoot({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      ttlSegundos: 3600,
      global: true,
    }),
    UsuariosModule,
    ProductosModule,
  ],
})
export class AppModule {}
```

```typescript
// usuarios/usuarios.module.ts — forFeature
import { Module } from '@nestjs/common';
import { CacheModule } from '../../common/cache/cache.module';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [CacheModule.forFeature('usuarios')],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
```

<details>
<summary>🔍 ¿Qué es un módulo dinámico?</summary>

Un **módulo dinámico** es un módulo que se configura en tiempo de compilación mediante métodos estáticos como `forRoot()` o `forFeature()`. Ejemplos famosos:

- `TypeOrmModule.forRoot({ ... })` — configura la conexión
- `TypeOrmModule.forFeature([Entity])` — registra entidades
- `ConfigModule.forRoot({ isGlobal: true })` — configura variables de entorno
- `JwtModule.register({ secret: '...' })` — configura JWT
- `CacheModule.forRoot({ ... })` — configura Redis

Ventajas: configuración tipada, reutilización, y control fino sobre qué providers se registran.

</details>

## Caso de uso real

Estructura de módulos de una API bancaria como **Nubank** o **Mercado Pago**.

```
src/
├── app.module.ts
├── common/                           # Módulos transversales
│   ├── database/
│   │   └── database.module.ts
│   ├── cache/
│   │   └── cache.module.ts
│   ├── logging/
│   │   └── logging.module.ts
│   └── messaging/
│       └── messaging.module.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── strategies/
│   │   └── guards/
│   ├── cuentas/
│   │   ├── cuentas.module.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   └── repositories/
│   ├── tarjetas/
│   │   ├── tarjetas.module.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   └── repositories/
│   ├── transferencias/
│   │   ├── transferencias.module.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   └── validators/
│   ├── pagos/
│   │   ├── pagos.module.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   └── webhooks/
│   └── reportes/
│       ├── reportes.module.ts
│       └── services/
└── config/
    └── config.module.ts
```

```typescript
// modules/pagos/pagos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CuentasModule } from '../cuentas/cuentas.module';
import { NotificacionesModule } from '../../common/messaging/notificaciones.module';
import { PagoEntity } from './entities/pago.entity';
import { PagosController } from './controllers/pagos.controller';
import { PagosService } from './services/pagos.service';
import { WebhookController } from './controllers/webhook.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PagoEntity]),
    AuthModule,
    CuentasModule,
    NotificacionesModule,
  ],
  controllers: [PagosController, WebhookController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}
```

Cada módulo representa un **dominio de negocio** completo. Si el equipo de pagos quiere cambiar su implementación, solo toca `PagosModule`.

## Buenas prácticas

### 1. Un módulo por dominio de negocio

```typescript
// ✅ Bien: módulos por dominio
modules/usuarios/
modules/productos/
modules/pedidos/

// ❌ Mal: módulos por capa técnica
modules/controllers/
modules/services/
modules/entities/
```

### 2. El AppModule solo importa, no declara

```typescript
// ✅ Bien
@Module({
  imports: [UsuariosModule, ProductosModule],
})
export class AppModule {}

// ❌ Mal: AppModule con controladores y providers
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [...],
})
```

### 3. Exporta solo lo necesario

```typescript
// ✅ Bien: export mínimo
@Module({
  providers: [UsuariosService, UsuariosRepository, UsuariosMapper],
  exports: [UsuariosService],  // Solo lo que otros necesitan
})
```

### 4. Usa módulos dinámicos para configuraciones

```typescript
static forRoot(opciones: Opciones): DynamicModule {
  return {
    module: MiModulo,
    providers: [
      { provide: 'OPCIONES', useValue: opciones },
    ],
    exports: ['OPCIONES'],
  };
}
```

### 5. Reexporta módulos cuando tenga sentido

```typescript
// Si tu módulo usa TypeORM y otros módulos necesitan las mismas entidades
@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  exports: [TypeOrmModule],  // Reexporta para que otros también tengan acceso
})
export class UsuariosModule {}
```

### 6. Evita dependencias circulares

```typescript
// ✅ Solución con forwardRef
@Module({
  imports: [forwardRef(() => BModule)],
})
export class AModule {}
```

### 7. Usa archivos de barril (index.ts)

```typescript
// usuarios/index.ts
export { UsuariosModule } from './usuarios.module';
export { UsuariosService } from './services/usuarios.service';
export { CrearUsuarioDto } from './dto/crear-usuario.dto';
```

## Errores comunes

### 1. Olvidar importar un módulo necesario

```typescript
// ❌ Error: UsuariosService no está disponible en PedidosModule
@Module({
  controllers: [PedidosController],
  providers: [PedidosService],
  // Falta: imports: [UsuariosModule]
})
export class PedidosModule {}
```

> **Síntoma**: `Nest can't resolve dependencies of PedidosService`. NestJS no encuentra el provider.

### 2. Exportar un módulo sin provider

```typescript
// ❌ Error: exports un módulo pero no los providers que lo necesitan
@Module({
  imports: [HttpModule],
  exports: [HttpModule],  // HttpModule exportado, pero...
})
export class ClientesModule {}
// Otro módulo importa ClientesModule y espera HttpService, pero HttpService
// solo está disponible si HttpModule está en imports de ESE módulo.

// ✅ La reexportación de módulos funciona cuando importas el módulo que reexporta
@Module({
  imports: [ClientesModule],  // Aquí ClientesModule reexporta HttpModule
})
export class PedidosModule {
  constructor(private readonly httpService: HttpService) {}  // ✅ Disponible
}
```

### 3. Módulo global innecesario

```typescript
// ❌ Error: hacer global un módulo que solo usa un submódulo
@Global()
@Module({
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}
// Ahora ReportesService está disponible en TODA la app aunque solo lo use el módulo admin.
```

### 4. No cerrar el ciclo de módulos dinámicos

```typescript
// ❌ Error: DynamicModule sin definir module
static forRoot(): DynamicModule {
  return {
    // Falta: module: MiModulo,
    providers: [],
  };
}
// NestJS lanzará error porque no sabe a qué módulo pertenece.
```

### 5. Dependencia circular entre módulos

```typescript
// ❌ Error: A importa B, B importa A
// NestJS lanza: "A circular dependency has been detected"

// ✅ Solución
@Module({
  imports: [forwardRef(() => BModule)],
})
export class AModule {}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Controladores** | Se declaran en `controllers` del módulo. Un módulo puede tener múltiples controladores. |
| **Servicios** | Se declaran en `providers` del módulo. Solo son accesibles dentro del módulo a menos que se exporten. |
| **Inyección de Dependencias** | El módulo define el alcance de los providers. La DI resuelve las dependencias dentro de ese alcance. |
| **Módulos dinámicos** | Permiten configurar módulos con parámetros en tiempo de importación (`forRoot`, `forFeature`). |
| **@Global()** | Hace que los providers exportados estén disponibles sin importar el módulo. |
| **forwardRef** | Resuelve dependencias circulares entre módulos. |
| **Módulo raíz (AppModule)** | Es el punto de entrada. Todos los módulos se importan aquí directa o indirectamente. |
| **Arquitectura hexagonal** | Cada módulo puede seguir el patrón domain/application/infrastructure internamente. |

## Resumen

- Los **módulos** (`@Module()`) agrupan componentes relacionados por dominio de negocio.
- Tienen 4 propiedades: `imports`, `controllers`, `providers`, `exports`.
- El **AppModule** es el módulo raíz y solo debe importar otros módulos, no declarar controladores ni servicios.
- Los **módulos dinámicos** (`forRoot`, `forFeature`) permiten configuración en tiempo de importación.
- `@Global()` hace que un módulo esté disponible en toda la aplicación sin imports explícitos.
- `forwardRef` resuelve dependencias circulares.
- **Buenas prácticas**: un módulo por dominio, export mínimo, módulos dinámicos para configuración, reexportación cuando tenga sentido, evitar dependencias circulares.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuáles son las cuatro propiedades del decorador @Module()?</summary>

**Respuesta:** `imports` (módulos que necesita), `controllers` (controladores del módulo), `providers` (servicios y otros providers), `exports` (providers que se comparten con otros módulos).
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué sucede si un provider se declara en un módulo pero no se exporta?</summary>

**Respuesta:** Solo está disponible dentro de ese módulo. Otros módulos no pueden inyectarlo aunque importen el módulo. Para compartirlo, debe incluirse en `exports`.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué es un módulo dinámico y para qué sirve?</summary>

**Respuesta:** Es un módulo que se configura en tiempo de importación mediante métodos estáticos como `forRoot()` o `forFeature()`. Sirve para pasar opciones de configuración al módulo (ej: `TypeOrmModule.forRoot()`, `JwtModule.register()`).
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cuándo deberías usar @Global() en un módulo?</summary>

**Respuesta:** Solo para módulos transversales que toda la aplicación necesita, como logging, configuración o caché. Para el resto, usa imports explícitos. Un `@Global()` innecesario acopla toda la aplicación a ese módulo.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo resuelves una dependencia circular entre el Módulo A y el Módulo B?</summary>

**Respuesta:** Usando `forwardRef(() => BModule)` en el `imports` del Módulo A (y viceversa en B si es necesario). Esto permite a NestJS resolver la referencia de forma diferida, rompiendo el ciclo.
</details>
