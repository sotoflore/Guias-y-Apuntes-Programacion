---
title: Arquitectura de NestJS
description: módulos, controladores, servicios, providers, el ciclo de vida de una petición y cómo se conectan todos los componentes.
---

# Arquitectura de NestJS

La arquitectura de NestJS es como el **esqueleto de un edificio**: define cómo se sostienen y conectan todas las partes. Entenderla es clave para construir aplicaciones que no se derrumben cuando crecen.

## ¿Qué es?

La **arquitectura de NestJS** es un conjunto de patrones y convenciones que organizan el código en **capas** con responsabilidades bien definidas. Se inspira en:

- **Angular**: módulos, decoradores, inyección de dependencias.
- **Clean Architecture**: separación en capas, dependencias hacia adentro.
- **Patrón Modular**: cada funcionalidad es un módulo independiente.
- **Programación reactiva**: uso de Observables (RxJS) para flujos asíncronos.

```
Aplicación NestJS
├── Capa de presentación (Controladores)
├── Capa de aplicación (DTOs, Guards, Pipes, Interceptors)
├── Capa de dominio (Servicios, Lógica de negocio)
└── Capa de infraestructura (Bases de datos, APIs externas, Caché)
```

## ¿Por qué es importante?

Sin una arquitectura clara, el código se vuelve **espagueti**: difícil de entender, probar y modificar. La arquitectura de NestJS importa porque:

- **Separa responsabilidades**: cada componente hace una sola cosa y la hace bien.
- **Facilita el testing**: puedes probar cada capa de forma aislada.
- **Escala con el equipo**: múltiples desarrolladores trabajan en distintos módulos sin pisarse.
- **Estandariza el código**: cualquier dev de NestJS entiende la estructura rápidamente.
- **Aísla cambios**: modificar la base de datos no afecta los controladores ni viceversa.

:::tip
No necesitas aprender toda la arquitectura de una vez. NestJS permite empezar simple (un controlador + un servicio) e ir añadiendo capas conforme tu aplicación crece. Es **progresivo**.
:::

## Problema que resuelve

En aplicaciones Node.js sin arquitectura definida, es común terminar con:

```typescript
// ❌ Sin arquitectura: todo en un archivo
import express from 'express';
import { createConnection } from 'typeorm';

const app = express();
app.use(express.json());

// Rutas + Lógica de negocio + Acceso a datos = TODO MEZCLADO
app.get('/api/usuarios', async (req, res) => {
  const connection = await createConnection({ /* ... */ });
  const usuarios = await connection.query('SELECT * FROM usuarios');
  const resultado = usuarios.map(u => ({
    nombreCompleto: `${u.nombre} ${u.apellido}`,
    activo: u.ultimo_login > new Date('2024-01-01'),
  }));
  res.json(resultado);
});

app.post('/api/usuarios', async (req, res) => {
  // Validación manual
  if (!req.body.email?.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  // Lógica de negocio
  const existe = await db.query(
    `SELECT id FROM usuarios WHERE email = '${req.body.email}'`
  );
  if (existe.length > 0) {
    return res.status(409).json({ error: 'Email ya registrado' });
  }
  // Acceso a datos
  const result = await db.query(
    `INSERT INTO usuarios (nombre, email) VALUES ('${req.body.nombre}', '${req.body.email}')`
  );
  // Enviar email (lógica aquí mismo)
  await sendEmail(req.body.email, 'Bienvenido');
  res.json({ id: result.insertId });
});
```

Este archivo mezcla:

1. **Ruteo** (GET / POST)
2. **Validación** (email, campos requeridos)
3. **Lógica de negocio** (formateo, verificar duplicados)
4. **Acceso a datos** (SQL queries)
5. **Efectos secundarios** (enviar email)

La arquitectura de NestJS fuerza a separar esto en capas:

```typescript
// ✅ Con arquitectura NestJS: cada capa es independiente

// Controlador: solo maneja HTTP
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);
  }
}

// DTO: define la estructura y validación
export class CrearUsuarioDto {
  @IsString() nombre: string;
  @IsEmail() email: string;
}

// Servicio: contiene la lógica de negocio
@Injectable()
export class UsuariosService {
  constructor(
    private readonly usuariosRepository: UsuariosRepository,
    private readonly emailService: EmailService,
  ) {}

  async crear(dto: CrearUsuarioDto) {
    const existe = await this.usuariosRepository.findByEmail(dto.email);
    if (existe) throw new ConflictException('Email ya registrado');
    const usuario = await this.usuariosRepository.crear(dto);
    await this.emailService.enviarBienvenida(dto.email);
    return usuario;
  }
}

// Repositorio: solo acceso a datos
@Injectable()
export class UsuariosRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByEmail(email: string) {
    return this.dataSource.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  }

  async crear(dto: CrearUsuarioDto) {
    return this.dataSource.query(
      'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
      [dto.nombre, dto.email],
    );
  }
}
```

## Cómo funciona

### Los 4 pilares de la arquitectura NestJS

```
┌─────────────────────────────────────────────────────────┐
│                      MÓDULOS                             │
│  Agrupan y organizan componentes por dominio             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │              CONTROLADORES                        │    │
│  │  Reciben peticiones HTTP y delegan a servicios    │    │
│  │                                                   │    │
│  │  ┌────────────────────────────────────────────┐   │    │
│  │  │            SERVICIOS / PROVIDERS            │   │    │
│  │  │  Contienen la lógica de negocio             │   │    │
│  │  │                                             │   │    │
│  │  │  ┌──────────────────────────────────────┐   │   │    │
│  │  │  │       CAPA DE INFRAESTRUCTURA        │   │   │    │
│  │  │  │  BD, APIs externas, caché, colas     │   │   │    │
│  │  │  └──────────────────────────────────────┘   │   │    │
│  │  └────────────────────────────────────────────┘   │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Componentes de la arquitectura

| Componente | Capa | Responsabilidad |
|---|---|---|
| **Módulo** (`@Module()`) | Organización | Agrupa componentes relacionados |
| **Controlador** (`@Controller()`) | Presentación | Maneja rutas HTTP |
| **Servicio** (`@Injectable()`) | Dominio | Lógica de negocio |
| **Repositorio / DAO** | Infraestructura | Acceso a datos |
| **DTO** | Aplicación | Define estructura de datos |
| **Pipe** (`@Injectable()` + `PipeTransform`) | Aplicación | Valida y transforma entrada |
| **Guard** (`@Injectable()` + `CanActivate`) | Aplicación | Protege rutas |
| **Interceptor** (`@Injectable()` + `NestInterceptor`) | Aplicación | Transforma respuestas |
| **Filter** (`@Catch()` + `ExceptionFilter`) | Aplicación | Maneja errores |

### Ciclo de vida de una petición

```
CLIENTE
  │
  ▼
┌──────────────────────────────────────────────────────┐
│                   MIDDLEWARE                          │
│  (CORS, logging, compresión, etc.)                   │
└──────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────┐
│                    GUARDS                             │
│  ¿Está autenticado? ¿Tiene permisos?  ──NO──→ 401/403│
└──────────────────────────────────────────────────────┘
  │ (SÍ)
  ▼
┌──────────────────────────────────────────────────────┐
│               INTERCEPTORS (PRE)                      │
│  Logging, transformación de request, caché           │
└──────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────┐
│                     PIPES                             │
│  Validar y transformar parámetros ──NO──→ 400        │
└──────────────────────────────────────────────────────┘
  │ (SÍ)
  ▼
┌──────────────────────────────────────────────────────┐
│                  CONTROLADOR                          │
│  Recibe datos validados, delega al servicio          │
└──────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────┐
│                   SERVICIO                            │
│  Lógica de negocio, orquestación                     │
└──────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────┐
│                  INFRAESTRUCTURA                       │
│  Base de datos, API externa, caché                   │
└──────────────────────────────────────────────────────┘
  │
  ▼ (respuesta)
┌──────────────────────────────────────────────────────┐
│              INTERCEPTORS (POST)                       │
│  Transformar respuesta, medir tiempo, cachear        │
└──────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────┐
│              EXCEPTION FILTER                         │
│  (Si hay error → respuesta formateada)               │
└──────────────────────────────────────────────────────┘
  │
  ▼
CLIENTE ← Respuesta HTTP
```

### Sistema de Inyección de Dependencias

NestJS tiene un **contenedor IoC** (Inversion of Control) que gestiona la creación y ciclo de vida de los objetos.

```
Solicitud: new UsuariosController(??)
                    ↓
        Contenedor IoC de NestJS
                    ↓
  ¿UsuariosService registrado? → Sí
                    ↓
  ¿UsuariosService tiene dependencias? → Sí (UsuariosRepository)
                    ↓
  ¿UsuariosRepository registrado? → Sí
                    ↓
  Crea UsuariosRepository → lo inyecta en UsuariosService
                    ↓
  Crea UsuariosService → lo inyecta en UsuariosController
                    ↓
  Devuelve UsuariosController listo para usar
```

### Scope de los componentes

| Scope | Ciclo de vida | Uso |
|---|---|---|
| `DEFAULT` (singleton) | Una instancia para toda la app | Servicios, repositorios |
| `REQUEST` | Una instancia por petición HTTP | Guards con estado de request |
| `TRANSIENT` | Una instancia por cada inyección | Providers no compartidos |

## Sintaxis

### Decoradores de arquitectura

| Decorador | Componente | Registro |
|---|---|---|
| `@Module({ controllers, providers, imports, exports })` | Módulo | Raíz y módulos de funcionalidad |
| `@Controller('prefix')` | Controlador | En `controllers` del módulo |
| `@Injectable()` | Service / Provider | En `providers` del módulo |
| `@Injectable()` | Pipe / Guard / Interceptor / Filter | En `providers` del módulo |

### Interfaces principales

```typescript
// Módulo
@Module({
  imports:      // Otros módulos que necesita
  controllers:  // Controladores de este módulo
  providers:    // Servicios y otros providers
  exports:      // Providers que otros módulos pueden usar
})

// Controlador
@Controller('ruta')
class XController {
  constructor(private readonly service: XService) {}
  @Get(':id')
  metodo(@Param('id') id: string) { }
}

// Servicio / Provider
@Injectable()
class XService {
  constructor(private readonly repository: XRepository) {}
}
```

## Ejemplo básico

Estructura mínima de una aplicación NestJS con dos módulos independientes.

```
src/
├── app.module.ts
├── main.ts
├── saludar/
│   ├── saludar.controller.ts
│   ├── saludar.service.ts
│   └── saludar.module.ts
└── reloj/
    ├── reloj.controller.ts
    ├── reloj.service.ts
    └── reloj.module.ts
```

```typescript
// saludar/saludar.module.ts
import { Module } from '@nestjs/common';
import { SaludarController } from './saludar.controller';
import { SaludarService } from './saludar.service';

@Module({
  controllers: [SaludarController],
  providers: [SaludarService],
})
export class SaludarModule {}
```

```typescript
// saludar/saludar.controller.ts
import { Controller, Get } from '@nestjs/common';
import { SaludarService } from './saludar.service';

@Controller('saludar')
export class SaludarController {
  constructor(private readonly saludarService: SaludarService) {}

  @Get()
  saludar(): string {
    return this.saludarService.obtenerSaludo();
  }
}
```

```typescript
// saludar/saludar.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaludarService {
  obtenerSaludo(): string {
    return '¡Hola desde NestJS!';
  }
}
```

```typescript
// reloj/reloj.module.ts
import { Module } from '@nestjs/common';
import { RelojController } from './reloj.controller';
import { RelojService } from './reloj.service';

@Module({
  controllers: [RelojController],
  providers: [RelojService],
})
export class RelojModule {}
```

```typescript
// reloj/reloj.controller.ts
import { Controller, Get } from '@nestjs/common';
import { RelojService } from './reloj.service';

@Controller('reloj')
export class RelojController {
  constructor(private readonly relojService: RelojService) {}

  @Get()
  obtenerHora(): { hora: string } {
    return { hora: this.relojService.obtenerHoraActual() };
  }
}
```

```typescript
// reloj/reloj.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class RelojService {
  obtenerHoraActual(): string {
    return new Date().toISOString();
  }
}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { SaludarModule } from './saludar/saludar.module';
import { RelojModule } from './reloj/reloj.module';

@Module({
  imports: [SaludarModule, RelojModule],
})
export class AppModule {}
```

Cada módulo es independiente. Puedes eliminar `RelojModule` sin afectar `SaludarModule`.

## Ejemplo intermedio

Arquitectura con módulo compartido, exportación de providers y módulo global.

<CodeGroup>
<CodeGroupItem title="common/common.module.ts">

```typescript
import { Module, Global } from '@nestjs/common';
import { FormateadorService } from './formateador.service';
import { LoggerService } from './logger.service';

@Global()  // Este módulo está disponible en TODA la app sin importarlo
@Module({
  providers: [FormateadorService, LoggerService],
  exports: [FormateadorService, LoggerService],
})
export class CommonModule {}
```

</CodeGroupItem>
<CodeGroupItem title="common/formateador.service.ts">

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class FormateadorService {
  formatearUsuario(usuario: any) {
    return {
      id: usuario.id,
      nombreCompleto: `${usuario.nombre} ${usuario.apellido}`.trim(),
      email: usuario.email.toLowerCase(),
      fechaRegistro: new Date(usuario.creadoEn).toLocaleDateString('es-CL'),
    };
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="common/logger.service.ts">

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  info(contexto: string, mensaje: string, datos?: any) {
    this.logger.log(`[${contexto}] ${mensaje}`, datos ? JSON.stringify(datos) : '');
  }

  error(contexto: string, mensaje: string, error?: any) {
    this.logger.error(`[${contexto}] ${mensaje}`, error?.stack);
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="usuarios/usuarios.module.ts">

```typescript
import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
```

</CodeGroupItem>
</CodeGroup>

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [CommonModule, UsuariosModule],
})
export class AppModule {}
```

:::tip
`@Global()` hace que un módulo esté disponible en **toda la aplicación** sin necesidad de importarlo en cada módulo. Úsalo con moderación — solo para servicios verdaderamente globales (logging, config).
:::

## Ejemplo avanzado

Arquitectura hexagonal (también llamada **puertos y adaptadores**) con NestJS, separando completamente el dominio de la infraestructura.

```
src/
├── main.ts
├── app.module.ts
├── common/                    # Capa transversal
│   ├── database/
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   ├── logger/
│   │   ├── logger.module.ts
│   │   └── logger.service.ts
│   └── guards/
│       └── jwt-auth.guard.ts
│
├── modules/
│   └── usuarios/
│       ├── domain/            # Capa de dominio (NUNCA depende de infraestructura)
│       │   ├── entities/
│       │   │   └── usuario.entity.ts
│       │   ├── repositories/
│       │   │   └── usuario-repository.interface.ts
│       │   └── services/
│       │       └── usuario.service.ts
│       │
│       ├── application/       # Capa de aplicación (orquestación)
│       │   ├── controllers/
│       │   │   └── usuarios.controller.ts
│       │   ├── dto/
│       │   │   ├── crear-usuario.dto.ts
│       │   │   └── usuario-response.dto.ts
│       │   └── mappers/
│       │       └── usuario.mapper.ts
│       │
│       ├── infrastructure/    # Capa de infraestructura (implementaciones)
│       │   ├── persistence/
│       │   │   ├── typeorm/
│       │   │   │   ├── usuario.entity.ts
│       │   │   │   └── typeorm-usuario.repository.ts
│       │   │   └── prisma/
│       │   │       └── prisma-usuario.repository.ts
│       │   └── controllers/
│       │       └── usuarios.controller.ts  # Adaptador HTTP
│       │
│       └── usuarios.module.ts
```

```typescript
// domain/entities/usuario.entity.ts — Entidad de dominio pura
export class Usuario {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly email: string,
    public readonly creadoEn: Date,
    public readonly activo: boolean,
  ) {}

  activar(): Usuario {
    return new Usuario(this.id, this.nombre, this.email, this.creadoEn, true);
  }

  cambiarEmail(nuevoEmail: string): Usuario {
    if (!nuevoEmail.includes('@')) {
      throw new Error('Email inválido');
    }
    return new Usuario(this.id, this.nombre, nuevoEmail, this.creadoEn, this.activo);
  }
}
```

```typescript
// domain/repositories/usuario-repository.interface.ts — Puerto (interfaz)
export interface UsuarioRepository {
  findAll(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  save(usuario: Usuario): Promise<Usuario>;
  delete(id: number): Promise<void>;
}

export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY';
```

```typescript
// domain/services/usuario.service.ts — Lógica de negocio pura
import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioRepository, USUARIO_REPOSITORY } from '../repositories/usuario-repository.interface';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepository.findAll();
  }

  async obtenerUno(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  async crear(nombre: string, email: string): Promise<Usuario> {
    const existe = await this.usuarioRepository.findByEmail(email);
    if (existe) throw new ConflictException('Email ya registrado');

    const usuario = new Usuario(
      Date.now(), // ID temporal, la BD asignará el real
      nombre,
      email,
      new Date(),
      true,
    );

    return this.usuarioRepository.save(usuario);
  }
}
```

```typescript
// infrastructure/persistence/typeorm/typeorm-usuario.repository.ts — Adaptador
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { Usuario } from '../../../domain/entities/usuario.entity';
import { UsuarioRepository } from '../../../domain/repositories/usuario-repository.interface';

@Injectable()
export class TypeormUsuarioRepository implements UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repo: Repository<UsuarioEntity>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    const entities = await this.repo.find();
    return entities.map(e => this.toDomain(e));
  }

  async findById(id: number): Promise<Usuario | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const entity = await this.repo.findOneBy({ email });
    return entity ? this.toDomain(entity) : null;
  }

  async save(usuario: Usuario): Promise<Usuario> {
    const entity = this.repo.create({
      nombre: usuario.nombre,
      email: usuario.email,
      activo: usuario.activo,
    });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: UsuarioEntity): Usuario {
    return new Usuario(entity.id, entity.nombre, entity.email, entity.creadoEn, entity.activo);
  }
}
```

```typescript
// usuarios.module.ts — Wire up de dependencias
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './infrastructure/persistence/typeorm/usuario.entity';
import { TypeormUsuarioRepository } from './infrastructure/persistence/typeorm/typeorm-usuario.repository';
import { UsuarioService } from './domain/services/usuario.service';
import { UsuariosController } from './application/controllers/usuarios.controller';
import { USUARIO_REPOSITORY } from './domain/repositories/usuario-repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuariosController],
  providers: [
    UsuarioService,
    {
      provide: USUARIO_REPOSITORY,
      useClass: TypeormUsuarioRepository,
    },
  ],
})
export class UsuariosModule {}
```

<details>
<summary>🔍 ¿Qué logra esta arquitectura?</summary>

1. **Dominio puro**: las entidades y servicios de dominio **no importan nada** de infraestructura.
2. **Interfaces invertidas**: el repositorio se define en dominio, se implementa en infraestructura.
3. **Intercambiabilidad**: cambiar TypeORM por Prisma solo requiere crear un nuevo adaptador.
4. **Testabilidad**: puedes mockear `USUARIO_REPOSITORY` sin necesidad de base de datos.
5. **Separación total**: la capa de aplicación (controladores, DTOs) orquesta sin conocer detalles de persistencia.

</details>

## Caso de uso real

Arquitectura de un microservicio en una empresa como **Uber** o **Spotify**, donde cada equipo dueño de su dominio tiene total independencia.

```
microservicio-pagos/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── config.module.ts
│   │   └── config.service.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── modules/
│   │   ├── pagos/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── pago.entity.ts
│   │   │   │   ├── events/
│   │   │   │   │   └── pago-realizado.event.ts
│   │   │   │   ├── repositories/
│   │   │   │   │   └── pago-repository.interface.ts
│   │   │   │   └── services/
│   │   │   │       └── pago.service.ts
│   │   │   ├── application/
│   │   │   │   ├── controllers/
│   │   │   │   ├── dto/
│   │   │   │   ├── mappers/
│   │   │   │   └── sagas/
│   │   │   ├── infrastructure/
│   │   │   │   ├── persistence/
│   │   │   │   ├── messaging/
│   │   │   │   └── api-clients/
│   │   │   └── pagos.module.ts
│   │   ├── facturacion/
│   │   └── notificaciones/
│   └── database/
│       └── migrations/
├── test/
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── tsconfig.json
└── package.json
```

Cada microservicio es **independiente**: su propia base de datos, su propio despliegue, su propio equipo.

## Buenas prácticas

### 1. Un módulo por dominio de negocio

```typescript
// ✅ Bien
modules/usuarios/
modules/productos/
modules/pedidos/

// ❌ Mal
modules/controllers/
modules/services/
modules/entities/
```

### 2. Las dependencias apuntan hacia adentro

El dominio **nunca** debe importar cosas de infraestructura. La infraestructura importa del dominio.

```
✅ Controlador → Servicio → Interfaz (dominio) ← Implementación (infraestructura)
❌ Servicio → Controlador (inversión de dependencia)
```

### 3. Usa `@Global()` solo para módulos transversales

```typescript
@Global()
@Module({
  providers: [LoggerService, ConfigService],
  exports: [LoggerService, ConfigService],
})
export class CommonModule {}
```

### 4. No pongas lógica de negocio en los controladores

Un controlador debe tener máximo 3-5 líneas por método: extraer parámetros, llamar al servicio, devolver resultado.

### 5. Define interfaces para los repositorios

Esto permite cambiar la implementación sin modificar los servicios que los usan.

### 6. Usa archivos de barril (index.ts)

```typescript
// modules/usuarios/index.ts
export { UsuariosModule } from './usuarios.module';
export { UsuariosService } from './domain/services/usuario.service';
```

### 7. Prefiere composición sobre herencia

```typescript
// ✅ Bien: composición
class PedidoService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly productoService: ProductoService,
  ) {}
}

// ❌ Mal: herencia profunda
class PedidoService extends BaseService<Pedido> { }
```

## Errores comunes

### 1. Módulo gigante que lo contiene todo

```typescript
// ❌ Error: AppModule con 20 imports y 30 providers
@Module({
  imports: [TypeOrmModule, ConfigModule, AuthModule, ...],
  controllers: [UserController, ProductController, ...],
  providers: [UserService, ProductService, ...],
})
```

### 2. Dependencia circular entre módulos

```typescript
// ❌ Error: Módulo A importa a B, y B importa a A
// NestJS lanzará: "A circular dependency has been detected"

// ✅ Solución: usar forwardRef
@Module({
  imports: [forwardRef(() => BModule)],
})
export class AModule {}
```

### 3. Mezclar responsabilidades en el servicio

```typescript
// ❌ Error: servicio que hace de todo
@Injectable()
export class UsuarioService {
  async crear(dto: CrearUsuarioDto) {
    // Validación
    // Lógica de negocio
    // Guardar en BD
    // Enviar email
    // Loguear
    // Notificar a otros servicios
  }
}
```

### 4. Ignorar el scope de los providers

```typescript
// ❌ Error: estado compartido entre peticiones
@Injectable()
export class AlmacenService {
  private datos: any[] = [];  // Singleton: compartido entre TODOS los usuarios

  agregar(dato: any) {
    this.datos.push(dato);  // Race condition
  }
}
```

### 5. No usar archivos de barril

```typescript
// ❌ Error: imports largos y frágiles
import { UsuarioService } from '../../../../modules/usuarios/domain/services/usuario.service';

// ✅ Bien: archivo index.ts en cada carpeta
import { UsuarioService } from '../../../../modules/usuarios';
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Módulos** | Son los contenedores de la arquitectura. Sin módulos no hay organización. |
| **Controladores** | Punto de entrada. La capa más externa de la arquitectura. |
| **Servicios / Providers** | El corazón de la lógica de negocio. Dependen de interfaces, no de implementaciones. |
| **Inyección de Dependencias** | El pegamento que conecta todas las capas sin acoplamiento. |
| **DTOs** | Definen los contratos de entrada/salida en los bordes de la aplicación. |
| **Pipes, Guards, Interceptors** | Capa transversal que envuelve la ejecución sin contaminar el dominio. |
| **Exception Filters** | Manejadores de errores en la capa más externa. |
| **Arquitectura Hexagonal** | Patrón que NestJS facilita implementar con su sistema de módulos y DI. |
| **Clean Architecture** | Los principios de capas y dependencias hacia adentro se aplican naturalmente en NestJS. |

## Resumen

- NestJS organiza el código en una **arquitectura por capas**: presentación (controladores), aplicación (pipes, guards), dominio (servicios) e infraestructura (BD, APIs).
- Los **módulos** agrupan componentes relacionados por dominio de negocio.
- El **sistema de DI** conecta las capas sin acoplamiento directo.
- El **flujo de una petición** atraviesa: middleware → guards → interceptors (pre) → pipes → controlador → servicio → infraestructura → interceptors (post) → filters (si hay error).
- La **arquitectura hexagonal** permite intercambiar implementaciones (TypeORM ↔ Prisma) sin tocar el dominio.
- **Buenas prácticas**: módulos por dominio, dependencias hacia adentro, controladores delgados, interfaces para repositorios, barril de exports.
- NestJS es **progresivo**: empiezas simple y añades complejidad cuando la necesitas.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es el orden correcto del flujo de una petición en NestJS?</summary>

**Respuesta:** Middleware → Guards → Interceptors (pre) → Pipes → Controlador → Servicio → Infraestructura → Interceptors (post) → Exception Filters (si hay error). Los guards verifican permisos antes de que cualquier otra lógica se ejecute.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué patrón de diseño usa NestJS para conectar las capas sin acoplamiento directo?</summary>

**Respuesta:** **Inyección de Dependencias** (DI) con un contenedor IoC. Las clases declaran sus dependencias en el constructor y NestJS se encarga de instanciarlas e inyectarlas automáticamente.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cuál es la diferencia entre un módulo global y uno normal?</summary>

**Respuesta:** Un módulo decorado con `@Global()` hace que sus providers exportados estén disponibles en **toda la aplicación** sin necesidad de importar el módulo en cada módulo que los necesite. Los módulos normales requieren importación explícita.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué ventaja tiene definir el repositorio como interfaz en la capa de dominio?</summary>

**Respuesta:** Permite cambiar la implementación (TypeORM → Prisma → MongoDB) sin modificar el servicio de dominio. El servicio depende de la abstracción (interfaz), no de la implementación concreta. Esto también facilita el mocking en tests.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Qué problema resuelve `forwardRef` en NestJS?</summary>

**Respuesta:** Resuelve las **dependencias circulares** entre módulos. Cuando el Módulo A importa al B y el B importa al A, `forwardRef(() => BModule)` permite a NestJS resolver la referencia de forma diferida, evitando el error de dependencia circular.
</details>
