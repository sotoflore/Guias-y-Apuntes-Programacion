---
title: Inyección de Dependencias en NestJS
description: Aprende qué es la inyección de dependencias en NestJS, cómo funciona el contenedor IoC, tipos de inyección, scopes y cómo crear dependencias personalizadas.
---

# Inyección de Dependencias en NestJS

La inyección de dependencias es como el **sistema de plomería de un edificio**: las tuberías (dependencias) ya están instaladas en las paredes, solo conectas el grifo (tu clase) y el agua (funcionalidad) llega sola.

## ¿Qué es?

La **Inyección de Dependencias (DI)** es un patrón de diseño donde las dependencias de una clase se proporcionan "desde fuera" en lugar de que la clase las cree por sí misma, mediante un **contenedor IoC** (Inversion of Control) que gestiona todo el ciclo de vida de los objetos.

```typescript
// ❌ Sin DI: la clase crea sus dependencias
class UsuariosController {
  private readonly service = new UsuariosService();  // Acoplamiento rígido
}

// ✅ Con DI: las dependencias se inyectan
class UsuariosController {
  constructor(private readonly service: UsuariosService) {} // Desacoplado
}
```

## ¿Por qué es importante?

La DI es el **pegamento arquitectónico** de NestJS. Sin ella, cada clase tendría que construir manualmente todo lo que necesita, generando código imposible de mantener.

- **Desacoplamiento total**: las clases no saben cómo se crean sus dependencias, solo las usan.
- **Testabilidad**: puedes inyectar mocks en lugar de implementaciones reales.
- **Flexibilidad**: cambiar una implementación no requiere modificar N clases.
- **Ciclo de vida centralizado**: NestJS decide si un objeto es singleton, por request o transiente.
- **Código más limpio**: los constructores declaran explícitamente qué necesita la clase.

:::tip
Si alguna vez usaste `new` dentro de un controlador o servicio en NestJS, probablemente estás haciendo algo mal. El contenedor IoC debería crear casi todos los objetos por ti.
:::

## Problema que resuelve

Sin DI, las dependencias se convierten en una **telaraña de acoplamiento**:

```typescript
// ❌ Sin DI: acoplamiento en cascada
export class PedidoController {
  private readonly pedidoService: PedidoService;
  private readonly emailService: EmailService;

  constructor() {
    // ❌ El controlador crea TODO lo que necesita
    this.emailService = new EmailService(
      new SmtpClient({
        host: 'smtp.gmail.com',
        port: 587,
        user: 'admin@empresa.com',
        pass: 'supersecreto',
      }),
    );
    this.pedidoService = new PedidoService(
      new PedidoRepository(
        new DatabaseConnection({
          host: 'localhost',
          port: 5432,
          user: 'postgres',
          password: '1234',
        }),
      ),
      this.emailService,
    );
  }

  async crear(dto: CrearPedidoDto) {
    return this.pedidoService.crear(dto);
  }
}
```

Problemas:

1. **Acoplamiento profundo**: cambiar `SmtpClient` requiere modificar `PedidoController`.
2. **Configuración repetida**: host, puerto, credenciales aparecen en cada instanciación.
3. **Imposible testear**: no puedes probar `PedidoController` sin enviar emails reales.
4. **Código ilegible**: 15 líneas de `new` antes de llegar a la lógica real.

Con DI de NestJS:

```typescript
// ✅ Con DI: el contenedor gestiona todo
@Controller('pedidos')
export class PedidoController {
  constructor(
    private readonly pedidoService: PedidoService, // NestJS lo inyecta
  ) {}

  async crear(@Body() dto: CrearPedidoDto) {
    return this.pedidoService.crear(dto);
  }
}

@Injectable()
export class PedidoService {
  constructor(
    private readonly pedidoRepo: PedidoRepository,  // Inyectado
    private readonly emailService: EmailService,    // Inyectado
  ) {}
}

@Injectable()
export class EmailService {
  constructor(
    @Inject('SMTP_CLIENT') private readonly smtp: SmtpClient, // Inyectado
  ) {}
}
```

Sin un solo `new` en todo el código. El **contenedor IoC** construye el árbol de dependencias automáticamente.

## Cómo funciona

### El contenedor IoC paso a paso

```
1. REGISTRO
   @Module({ providers: [PedidoService, EmailService] })
   El contenedor registra PedidoService y EmailService
        │
        ▼
2. RESOLUCIÓN DE DEPENDENCIAS
   PedidoController requiere PedidoService
        │
        ▼
3. ANÁLISIS DEL CONSTRUCTOR
   NestJS lee el constructor de PedidoService:
   constructor(
     private pedidoRepo: PedidoRepository,
     private emailService: EmailService
   )
        │
        ▼
4. RESOLUCIÓN RECURSIVA
   ¿PedidoRepository registrado? → Sí → ¿tiene deps? → No → instanciar
   ¿EmailService registrado? → Sí → ¿tiene deps? → Sí → SMTP_CLIENT
        │
        ▼
5. INYECCIÓN
   Crea SMTP_CLIENT → lo inyecta en EmailService
   Crea EmailService → lo inyecta en PedidoService
   Crea PedidoService → lo inyecta en PedidoController
        │
        ▼
6. CACHÉ (singleton)
   La próxima vez que alguien pida PedidoService, reusa la instancia
```

### Cómo sabe NestJS qué inyectar

NestJS usa **type metadata** de TypeScript mediante `reflect-metadata`:

```typescript
// TypeScript compila esto:
constructor(private readonly service: UsuariosService) {}

// En JavaScript (con emitDecoratorMetadata) queda:
Reflect.defineMetadata('design:paramtypes', [UsuariosService], constructor);
```

NestJS lee `design:paramtypes` y sabe que debe inyectar `UsuariosService`. Por eso **no necesitas `@Inject()` cuando el tipo es una clase**.

### Tipos de inyección

| Tipo | Cómo se declara | Cuándo usarlo |
|---|---|---|
| **Por constructor** (automática) | `constructor(private s: XService)` | Caso más común (clases como token) |
| **Por propiedad** | `@Inject() private readonly s: XService` | Menos común, misma funcionalidad |
| **Con @Inject explícito** | `@Inject('TOKEN') private s: any` | Cuando el token no es una clase (string/Symbol) |
| **Opcional** | `@Optional() @Inject('T') private s?: T` | Dependencias no obligatorias |

## Sintaxis

### Formas de declarar dependencias

```typescript
// 1. Inyección automática por constructor (recomendada)
@Injectable()
export class UsuariosService {
  constructor(
    private readonly repo: UsuariosRepository,
    private readonly logger: LoggerService,
  ) {}
}

// 2. Inyección explícita con @Inject
@Injectable()
export class UsuariosService {
  constructor(
    @Inject('USUARIOS_REPOSITORY') private readonly repo: IUsuariosRepository,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {}
}

// 3. Inyección opcional
@Injectable()
export class UsuariosService {
  constructor(
    @Optional() @Inject('ANALYTICS') private readonly analytics?: AnalyticsService,
  ) {}
}

// 4. Inyección por propiedad (alternativa)
@Injectable()
export class UsuariosService {
  @Inject(UsuariosRepository)
  private readonly repo: UsuariosRepository;
}
```

### Registro de dependencias

```typescript
@Module({
  providers: [
    // Automático: token = clase
    UsuariosService,

    // Custom provider con useClass
    { provide: UsuariosRepository, useClass: PostgresUsuariosRepository },

    // Custom provider con token string
    { provide: 'CONFIG', useValue: { apiUrl: '...' } },

    // Custom provider con factory
    {
      provide: 'REDIS_CLIENT',
      useFactory: (config: ConfigService) => new Redis(config.get('redis')),
      inject: [ConfigService],
    },
  ],
})
```

## Ejemplo básico

Tres clases conectadas mediante DI automática.

```typescript
// database.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  conectar(): string {
    return 'Conectado a PostgreSQL';
  }
}
```

```typescript
// usuarios.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly db: DatabaseService) {}

  obtenerUsuarios(): string[] {
    console.log(this.db.conectar());
    return ['Ana', 'Luis', 'María'];
  }
}
```

```typescript
// usuarios.controller.ts
import { Controller, Get } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  obtenerTodos(): string[] {
    return this.usuariosService.obtenerUsuarios();
  }
}
```

```typescript
// usuarios.module.ts
import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { DatabaseService } from './database.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, DatabaseService],
})
export class UsuariosModule {}
```

**Árbol de dependencias resuelto por NestJS:**

```
UsuariosController → necesita UsuariosService
                          ↓
UsuariosService → necesita DatabaseService
                      ↓
DatabaseService → no necesita nada (inyección vacía)
```

NestJS construye esto **automáticamente** sin que escribas un solo `new`.

## Ejemplo intermedio

DI con custom providers, tokens string e inyección de módulos externos.

<CodeGroup>
<CodeGroupItem title="config/config.provider.ts">

```typescript
import { Provider } from '@nestjs/common';

export const APP_CONFIG = 'APP_CONFIG';

export interface AppConfig {
  puerto: number;
  entorno: string;
  jwtSecreto: string;
  apiUrl: string;
}

export const appConfigProvider: Provider = {
  provide: APP_CONFIG,
  useValue: {
    puerto: parseInt(process.env.PORT || '3000', 10),
    entorno: process.env.NODE_ENV || 'development',
    jwtSecreto: process.env.JWT_SECRET || 'dev-secret',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
  } as AppConfig,
};
```

</CodeGroupItem>
<CodeGroupItem title="mail/mail.service.ts">

```typescript
import { Injectable, Inject } from '@nestjs/common';

export const MAIL_TRANSPORTER = 'MAIL_TRANSPORTER';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_TRANSPORTER) private readonly transporter: any,
    @Inject('APP_CONFIG') private readonly config: any,
  ) {}

  async enviarEmail(to: string, subject: string, body: string) {
    console.log(`[${this.config.entorno}] Enviando email a ${to}: ${subject}`);
    return this.transporter.sendMail({ to, subject, html: body });
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="mail/mail-transporter.provider.ts">

```typescript
import { Provider } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MAIL_TRANSPORTER } from './mail.service';

export const mailTransporterProvider: Provider = {
  provide: MAIL_TRANSPORTER,
  useFactory: () => {
    if (process.env.NODE_ENV === 'test') {
      // En tests, usar un transporter de prueba (no envía emails reales)
      return { sendMail: async () => ({ messageId: 'test' }) };
    }
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  },
};
```

</CodeGroupItem>
<CodeGroupItem title="notificaciones.module.ts">

```typescript
import { Module } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { mailTransporterProvider } from '../mail/mail-transporter.provider';
import { appConfigProvider, APP_CONFIG } from '../config/config.provider';
import { NotificacionesController } from './notificaciones.controller';
import { NotificacionesService } from './notificaciones.service';

@Module({
  controllers: [NotificacionesController],
  providers: [
    NotificacionesService,
    MailService,
    mailTransporterProvider,
    appConfigProvider,
  ],
})
export class NotificacionesModule {}
```

</CodeGroupItem>
</CodeGroup>

```typescript
// notificaciones.service.ts
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificacionesService {
  constructor(private readonly mailService: MailService) {}

  async notificarBienvenida(email: string, nombre: string) {
    await this.mailService.enviarEmail(
      email,
      '¡Bienvenido!',
      `<h1>Hola ${nombre}</h1><p>Gracias por registrarte.</p>`,
    );
  }
}
```

<details>
<summary>🔍 Flujo de DI en este ejemplo</summary>

1. `APP_CONFIG` se provee como valor directo via `useValue`.
2. `MAIL_TRANSPORTER` se crea con `useFactory` (decide ambiente test vs real).
3. `MailService` inyecta ambos tokens con `@Inject()`.
4. `NotificacionesService` inyecta `MailService` automáticamente.
5. Todo está registrado en `NotificacionesModule`.

</details>

## Ejemplo avanzado

DI con scopes, inyección circular resuelta con `forwardRef`, y módulo dinámico que configura sus propios providers.

```typescript
// modules/auditoria/auditoria.service.ts
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class AuditoriaService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  registrar(accion: string, detalle?: any) {
    const entrada = {
      usuarioId: (this.request as any).usuario?.id,
      ip: this.request.ip,
      userAgent: this.request.headers['user-agent'],
      accion,
      detalle,
      timestamp: new Date().toISOString(),
    };
    console.log('[AUDITORÍA]', JSON.stringify(entrada));
    return entrada;
  }
}
```

```typescript
// modules/pedidos/pedidos.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class PedidosService {
  constructor(
    @Inject(forwardRef(() => NotificacionesService))
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async crearPedido(usuarioId: number, productos: any[]) {
    // Lógica de pedido...
    await this.notificacionesService.notificarPedidoConfirmado(usuarioId);
    return { exito: true };
  }
}
```

```typescript
// modules/notificaciones/notificaciones.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PedidosService } from '../pedidos/pedidos.service';

@Injectable()
export class NotificacionesService {
  constructor(
    @Inject(forwardRef(() => PedidosService))
    private readonly pedidosService: PedidosService,
  ) {}

  async notificarPedidoConfirmado(usuarioId: number) {
    // Necesita PedidosService para obtener datos del pedido
    console.log(`Notificando pedido confirmado al usuario ${usuarioId}`);
  }
}
```

```typescript
// modules/database/database.module.ts
import { Module, DynamicModule, Provider } from '@nestjs/common';

export interface DatabaseModuleOptions {
  tipo: 'postgres' | 'mysql';
  host: string;
  port: number;
  usuario: string;
  password: string;
  baseDatos: string;
}

export const CONEXION_DB = 'CONEXION_DB';

@Module({})
export class DatabaseModule {
  static forRoot(opciones: DatabaseModuleOptions): DynamicModule {
    const conexionProvider: Provider = {
      provide: CONEXION_DB,
      useFactory: () => {
        console.log(
          `Conectando a ${opciones.tipo}://${opciones.host}:${opciones.port}/${opciones.baseDatos}`,
        );
        return {
          query: (sql: string, params?: any[]) =>
            console.log(`[DB] ${sql}`, params),
        };
      },
    };

    return {
      module: DatabaseModule,
      providers: [conexionProvider],
      exports: [CONEXION_DB],
      global: true,
    };
  }
}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { NotificacionesModule } from './modules/notificaciones/notificaciones.module';

@Module({
  imports: [
    DatabaseModule.forRoot({
      tipo: 'postgres',
      host: 'localhost',
      port: 5432,
      usuario: 'admin',
      password: 'secreto',
      baseDatos: 'mi_app',
    }),
    PedidosModule,
    NotificacionesModule,
  ],
})
export class AppModule {}
```

```typescript
// modules/pedidos/pedidos.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CONEXION_DB } from '../database/database.module';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(
    @Inject(CONEXION_DB) private readonly db: any,
    private readonly pedidosService: PedidosService,
  ) {}

  @Post()
  async crear(@Body() dto: any) {
    await this.db.query('INSERT INTO pedidos...', [dto]);
    return this.pedidosService.crearPedido(1, dto.productos || []);
  }
}
```

<details>
<summary>🔍 Conceptos avanzados de DI explicados</summary>

1. **Scope.REQUEST**: `AuditoriaService` se crea por cada petición, capturando IP, user-agent, usuario autenticado.
2. **forwardRef**: resuelve dependencia circular entre `PedidosService` y `NotificacionesService`.
3. **Módulo dinámico**: `DatabaseModule.forRoot()` configura providers según opciones, y los exporta globalmente.
4. **Provider con factory**: la conexión a BD se crea con `useFactory` usando opciones dinámicas.
5. **Inyección de provider externo**: `PedidosController` inyecta `CONEXION_DB` directamente.

</details>

## Caso de uso real

Sistema de DI en una aplicación SaaS multiinquilino como **Slack** o **Notion**, donde cada organización tiene su propia configuración.

```typescript
// common/multi-tenancy/tenant-context.service.ts
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get tenantId(): string {
    return this.request.headers['x-tenant-id'] as string;
  }

  get dbSchema(): string {
    return `tenant_${this.tenantId}`;
  }
}
```

```typescript
// common/multi-tenancy/tenant-database.provider.ts
import { Provider, Scope } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { CONEXION_DB } from '../database/database.module';

export const tenantDatabaseProvider: Provider = {
  provide: 'TENANT_DATASOURCE',
  scope: Scope.REQUEST,
  useFactory: async (tenantContext: TenantContextService, baseDb: any) => {
    const schema = tenantContext.dbSchema;
    console.log(`Usando esquema: ${schema}`);

    return {
      query: (sql: string, params?: any[]) =>
        baseDb.query(`SET SCHEMA '${schema}'; ${sql}`, params),
    };
  },
  inject: [TenantContextService, CONEXION_DB],
};
```

```typescript
// modules/proyectos/proyectos.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { TenantContextService } from '../../common/multi-tenancy/tenant-context.service';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class ProyectosService {
  constructor(
    @Inject('TENANT_DATASOURCE') private readonly db: any,
    private readonly tenantContext: TenantContextService,
    private readonly logger: LoggerService,
  ) {}

  async listarProyectos() {
    this.logger.info(`Listando proyectos para tenant: ${this.tenantContext.tenantId}`);
    return this.db.query('SELECT * FROM proyectos');
  }
}
```

Cada petición HTTP crea un `TenantContextService` que extrae el tenant del header, y el `TENANT_DATASOURCE` usa ese tenant para enrutar la consulta al esquema correcto.

## Buenas prácticas

### 1. Prefiere inyección por constructor sobre @Inject

```typescript
// ✅ Bien: automático
constructor(private readonly service: UsuariosService) {}

// ❌ Mal: innecesario
constructor(@Inject(UsuariosService) private readonly service: UsuariosService) {}
```

Solo usa `@Inject()` cuando el token no es una clase (string o Symbol).

### 2. Una dependencia por línea en el constructor

```typescript
// ✅ Bien: legible
constructor(
  private readonly usuariosService: UsuariosService,
  private readonly productosService: ProductosService,
  private readonly pedidosService: PedidosService,
) {}
```

### 3. Marca dependencias opcionales con @Optional

```typescript
constructor(
  @Optional() @Inject('ANALYTICS') private readonly analytics?: AnalyticsService,
) {}
```

### 4. No abuses de Scope.REQUEST

Una docena de services con scope REQUEST en una misma cadena de dependencias puede degradar rendimiento. Limítalo a servicios que realmente lo necesiten.

### 5. Usa forwardRef solo cuando sea estrictamente necesario

La dependencia circular suele ser un **code smell**. Antes de usar `forwardRef`, pregúntate si puedes rediseñar para evitarla.

```typescript
// ✅ Alternativa: crear un módulo compartido
@Module({
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventBusModule {}

// Pedidos y Notificaciones usan EventBus en lugar de referenciarse directamente
```

### 6. Declara las dependencias de forma explícita

Una dependencia debería ser visible en el constructor, no escondida dentro de métodos:

```typescript
// ❌ Mal: dependencia oculta
@Injectable()
export class MiServicio {
  hacerAlgo() {
    const db = new DatabaseService();  // ❌ Acoplamiento oculto
  }
}
```

### 7. Tests: provee mocks en lugar de implementaciones reales

```typescript
const module = await Test.createTestingModule({
  providers: [
    MiServicio,
    { provide: DatabaseService, useValue: mockDb },  // Mock
  ],
}).compile();
```

## Errores comunes

### 1. Dependencia no registrada en ningún módulo

```typescript
// ❌ Error: Nest no encuentra la dependencia
// UsuariosService usa LoggerService pero no está registrado

// ✅ Solución: registrar LoggerService en algún módulo (o hacerlo global)
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class CommonModule {}
```

### 2. Token string mal escrito

```typescript
// ❌ Error: el token no coincide
providers: [{ provide: 'DB_CONNECTION', useValue: db }]
// ... en otra clase:
constructor(@Inject('DB_CONNECTON') private db: any) {} // Typo!

// ✅ Debe ser exactamente igual:
constructor(@Inject('DB_CONNECTION') private db: any) {}
```

### 3. Inyectar un provider con scope REQUEST en uno singleton

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}

@Injectable() // singleton (por defecto)
export class MiService {
  constructor(private readonly scoped: RequestScopedService) {}
  // ❌ NestJS lanza error: "Cannot resolve dependency"
}
```

### 4. Olvidar forwardRef en dependencias circulares

```typescript
// ❌ Error: dependencia circular sin resolver
// ModuleA importa ModuleB, ModuleB importa ModuleA
// NestJS lanza: "A circular dependency has been detected"

// ✅ Solución en ambos módulos:
@Module({
  imports: [forwardRef(() => OtroModule)],
})
```

### 5. Asumir que los providers son siempre clases

```typescript
// ❌ Error: injectar un value provider como si fuera clase
constructor(private readonly config: AppConfig) {}
// AppConfig es una interfaz, no existe en runtime

// ✅ Correcto: usar @Inject con el token string
constructor(@Inject('APP_CONFIG') private readonly config: AppConfig) {}
```

### 6. No respetar el principio de dependencias estables

```typescript
// ❌ Error: módulo de dominio depende de infraestructura
// /domain/services/usuario.service.ts
import { TypeOrmUsuarioRepository } from '../../infrastructure/typeorm/...';

// ✅ Correcto: dominio depende de interfaces, no de implementaciones
import { UsuarioRepository } from '../repositories/usuario-repository.interface';
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Providers** | Son los componentes que se inyectan. Todo provider es una dependencia potencial. |
| **Módulos** | Definen el ámbito de los providers. Un provider solo es inyectable dentro de su módulo (a menos que se exporte). |
| **Controladores** | Consumen dependencias via inyección en el constructor. |
| **@Injectable()** | Decorador que registra una clase en el contenedor IoC. |
| **@Inject()** | Decorador para inyección explícita cuando el token no es una clase. |
| **@Optional()** | Decorador que marca dependencias no obligatorias. |
| **forwardRef** | Función para resolver dependencias circulares. |
| **Scope** | Controla el ciclo de vida de la instancia (singleton, request, transient). |
| **REQESUST** | Token especial de `@nestjs/core` para inyectar el objeto Request nativo. |
| **Testing Module** | Permite crear un módulo de pruebas con providers mockeados. |

## Resumen

- La **Inyección de Dependencias** es un patrón donde las dependencias se proporcionan externamente, no se crean internamente.
- NestJS usa un **contenedor IoC** que registra, resuelve e inyecta dependencias automáticamente.
- La inyección **por constructor** es la forma más común y limpia.
- Usa `@Inject()` solo cuando el token no es una clase (string, Symbol).
- Usa `@Optional()` para dependencias no críticas.
- `forwardRef` resuelve dependencias circulares entre módulos.
- El **Scope** controla el ciclo de vida: DEFAULT (singleton), REQUEST, TRANSIENT.
- **Buenas prácticas**: prefiere inyección automática, una dependencia por línea, declara explícitamente, tests con mocks, evita dependencias circulares.
- **Errores comunes**: provider no registrado, token mal escrito, scope mismatch, circular sin forwardRef.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué información usa NestJS para saber qué dependencias inyectar en un constructor?</summary>

**Respuesta:** Usa `reflect-metadata` para leer `design:paramtypes` del constructor, que TypeScript genera cuando está habilitado `emitDecoratorMetadata`. Esto le dice a NestJS qué tipos de clase debe inyectar en cada parámetro.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cuándo es necesario usar @Inject() en lugar de la inyección automática por constructor?</summary>

**Respuesta:** Cuando el token de la dependencia no es una clase, sino un string o un Symbol. Por ejemplo: `@Inject('REDIS_CLIENT')` o `@Inject('APP_CONFIG')`. También cuando hay ambigüedad entre múltiples providers con el mismo token.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué problema resuelve forwardRef?</summary>

**Respuesta:** Resuelve las **dependencias circulares** entre módulos. Cuando el Módulo A importa al B y el B importa al A, `forwardRef(() => BModule)` permite que NestJS aplace la resolución de la referencia hasta que ambos módulos estén disponibles.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué significa que un provider tenga scope REQUEST?</summary>

**Respuesta:** Que se crea una **nueva instancia por cada petición HTTP** entrante. Esto permite capturar datos específicos del request (IP, headers, usuario autenticado) sin contaminar otras peticiones. Sin embargo, no puede inyectarse directamente en providers singleton.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Qué sucede si una clase tiene una dependencia que no está registrada en el contenedor IoC?</summary>

**Respuesta:** NestJS lanza una excepción en tiempo de arranque: `Nest can't resolve dependencies of [Clase]`. La aplicación no se inicia hasta que la dependencia se registre en algún módulo.
</details>
