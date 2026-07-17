---
title: Prisma con NestJS
description: Aprende a usar Prisma ORM con NestJS, schema.prisma, PrismaClient, PrismaModule, migraciones, relaciones, consultas avanzadas, middleware y buenas prácticas.
---

# Prisma con NestJS

Prisma es como un **asistente que te escribe todo el código de base de datos**: defines el esquema una vez en un archivo declarativo y Prisma genera un cliente type-safe, migraciones y hasta tu editor visual.

## ¿Qué es?

**Prisma** es un ORM moderno para TypeScript que sigue un enfoque **schema-first**. En lugar de decorar clases con TypeORM, escribes un archivo `schema.prisma` que define tus modelos, y Prisma genera un cliente con tipos completos y autocompletado.

```prisma
// schema.prisma
model Usuario {
  id        String   @id @default(uuid())
  nombre    String
  email     String   @unique
  rol       Rol      @default(VIEWER)
  pedidos   Pedido[]
  creadoEn  DateTime @default(now())
}

enum Rol {
  ADMIN
  EDITOR
  VIEWER
}
```

```typescript
// Uso en NestJS
@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearUsuarioDto) {
    return this.prisma.usuario.create({
      data: dto,
      select: { id: true, nombre: true, email: true, rol: true },
    });
  }
}
```

## ¿Por qué es importante?

Prisma se ha convertido en el ORM favorito de muchos desarrolladores NestJS porque:

- **Type safety máximo**: El cliente generado conoce todos los tipos de tu BD.
- **Autocompletado**: VS Code te muestra campos disponibles, tipos y relaciones.
- **Schema único**: Un archivo define todo el esquema (modelos, enums, relaciones).
- **Migraciones declarativas**: Prisma Migrate genera SQL a partir del schema.
- **Prisma Studio**: UI visual para explorar y editar datos.
- **Rendimiento**: Consultas optimizadas, batch operations, eager loading.

## Problema que resuelve

Con enfoques tradicionales, el modelo de datos y el código TypeScript pueden desincronizarse:

```typescript
// ❌ Sin schema unificado: la entidad en TypeScript y la tabla en SQL pueden diferir
// TypeScript dice: email es string
// SQL dice: email VARCHAR(255) NOT NULL
// Si alguien cambia SQL sin actualizar TypeScript → bugs

// ❌ Las consultas no son type-safe
const usuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
// usuario.rows[0] → any, sin autocompletado
```

Con Prisma, el schema es la **fuente única de verdad**:

```prisma
// schema.prisma → Fuente de verdad
model Usuario {
  id    String @id @default(uuid())
  email String @unique
}
```

```typescript
// El cliente generado sabe exactamente qué campos existen y sus tipos
const usuario = await prisma.usuario.findUnique({
  where: { email: 'ana@email.com' },
  select: { id: true, email: true },  // ❌ Error si escribes mal "emial"
});
// usuario.id → string | null (type-safe)
```

## Cómo funciona

### Arquitectura Prisma

```
┌─────────────────────────────────────────────────────────┐
│                    schema.prisma                         │
│  generator client {                                      │
│    provider = "prisma-client-js"                         │
│  }                                                       │
│  datasource db {                                         │
│    provider = "postgresql"                               │
│    url      = env("DATABASE_URL")                        │
│  }                                                       │
│  model Usuario { ... }                                   │
│  model Pedido { ... }                                    │
└─────────────────────────┬───────────────────────────────┘
                          │ npx prisma generate
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Prisma Client (generado)                    │
│  @prisma/client                                         │
│  prisma.$on('beforeExit', ...)                          │
│  prisma.usuario.findMany()                              │
│  prisma.usuario.create({ data })                        │
│  prisma.usuario.update({ where, data })                 │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              PrismaService (NestJS)                      │
│  @Injectable()                                          │
│  export class PrismaService extends PrismaClient {      │
│    async onModuleInit() { await this.$connect(); }      │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
```

### Ciclo de vida con Prisma

```bash
npx prisma init          # Crea schema.prisma y .env
npx prisma migrate dev   # Crea migración + aplica + genera cliente
npx prisma generate      # Genera cliente (después de cambios)
npx prisma studio        # UI para explorar datos
npx prisma db push       # Sincroniza schema con BD (sin migración)
```

## Sintaxis

### Instalación

```bash
npm install @prisma/client
npm install prisma --save-dev
npx prisma init
```

### Schema.prisma básico

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"   // postgresql | mysql | sqlite | sqlserver | mongodb
  url      = env("DATABASE_URL")
}

model Usuario {
  id        String   @id @default(uuid())
  nombre    String
  email     String   @unique
  password  String
  rol       Rol      @default(VIEWER)
  activo    Boolean  @default(true)
  pedidos   Pedido[]
  perfil    Perfil?
  creadoEn  DateTime @default(now())
  actualizadoEn DateTime @updatedAt
}

enum Rol {
  ADMIN
  EDITOR
  VIEWER
}

model Perfil {
  id        String  @id @default(uuid())
  bio       String?
  avatarUrl String?
  usuarioId String  @unique
  usuario   Usuario @relation(fields: [usuarioId], references: [id])
}

model Pedido {
  id        String       @id @default(uuid())
  usuarioId String
  usuario   Usuario      @relation(fields: [usuarioId], references: [id])
  items     PedidoItem[]
  total     Decimal      @db.Decimal(10, 2)
  estado    EstadoPedido @default(PENDIENTE)
  creadoEn  DateTime     @default(now())
}

enum EstadoPedido {
  PENDIENTE
  CONFIRMADO
  ENVIADO
  ENTREGADO
  CANCELADO
}

model PedidoItem {
  id        String  @id @default(uuid())
  pedidoId  String
  pedido    Pedido  @relation(fields: [pedidoId], references: [id])
  producto  String
  cantidad  Int
  precio    Decimal @db.Decimal(10, 2)
}
```

## Ejemplo básico

CRUD completo con PrismaService y NestJS.

<CodeGroup>
<CodeGroupItem title="prisma.service.ts">

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="prisma.module.ts">

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // Disponible en todos los módulos sin importarlo cada vez
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

</CodeGroupItem>

<CodeGroupItem title="usuarios.service.ts">

```typescript
@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearUsuarioDto) {
    return this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        rol: dto.rol ?? 'VIEWER',
      },
      select: { id: true, nombre: true, email: true, rol: true, creadoEn: true },
    });
  }

  async obtenerTodos() {
    return this.prisma.usuario.findMany({
      include: { pedidos: true },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id },
      include: { pedidos: true, perfil: true },
    });
  }

  async actualizar(id: string, dto: ActualizarUsuarioDto) {
    return this.prisma.usuario.update({
      where: { id },
      data: dto,
      select: { id: true, nombre: true, email: true, rol: true },
    });
  }

  async eliminar(id: string) {
    await this.prisma.usuario.delete({ where: { id } });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="usuarios.module.ts">

```typescript
@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
// Nota: No necesita importar PrismaModule si es @Global
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Transacciones, relaciones anidadas, paginación y filtros complejos.

```typescript
@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async crearPedidoCompleto(dto: CrearPedidoDto) {
    // Transacción: todo o nada
    return this.prisma.$transaction(async tx => {
      // 1. Crear pedido con items
      const pedido = await tx.pedido.create({
        data: {
          usuarioId: dto.usuarioId,
          total: dto.items.reduce((s, i) => s + i.precio * i.cantidad, 0),
          items: {
            create: dto.items.map(item => ({
              producto: item.producto,
              cantidad: item.cantidad,
              precio: item.precio,
            })),
          },
        },
        include: { items: true },
      });

      // 2. Actualizar stock (otra tabla)
      for (const item of dto.items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: { stock: { decrement: item.cantidad } },
        });
      }

      return pedido;
    });
  }

  async buscarPedidos(filtros: BuscarPedidosDto) {
    const where: any = {};

    if (filtros.usuarioId) where.usuarioId = filtros.usuarioId;
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.fechaDesde || filtros.fechaHasta) {
      where.creadoEn = {};
      if (filtros.fechaDesde) where.creadoEn.gte = new Date(filtros.fechaDesde);
      if (filtros.fechaHasta) where.creadoEn.lte = new Date(filtros.fechaHasta);
    }
    if (filtros.montoMin || filtros.montoMax) {
      where.total = {};
      if (filtros.montoMin) where.total.gte = filtros.montoMin;
      if (filtros.montoMax) where.total.lte = filtros.montoMax;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.pedido.findMany({
        where,
        include: { items: true, usuario: { select: { nombre: true, email: true } } },
        orderBy: { creadoEn: 'desc' },
        skip: (filtros.page - 1) * filtros.limit,
        take: filtros.limit,
      }),
      this.prisma.pedido.count({ where }),
    ]);

    return { items, total, page: filtros.page, limit: filtros.limit, totalPages: Math.ceil(total / filtros.limit) };
  }
}
```

## Ejemplo avanzado

Middleware Prisma, soft delete con guard, logging, batch operations y Prisma Client Extensions.

<CodeGroup>
<CodeGroupItem title="prisma-middleware.ts">

```typescript
// Middleware global: logging + soft delete
@Injectable()
export class PrismaMiddleware {
  aplicar(prisma: PrismaService) {
    // Logging de queries
    prisma.$use(async (params, next) => {
      const start = Date.now();
      const result = await next(params);
      console.log(`Prisma: ${params.model}.${params.action} - ${Date.now() - start}ms`);
      return result;
    });

    // Soft delete automático para modelos con deletedAt
    prisma.$use(async (params, next) => {
      if (params.action === 'delete' && params.model === 'Usuario') {
        params.action = 'update';
        params.args.data = { deletedAt: new Date() };
      }
      if (params.action === 'deleteMany' && params.model === 'Usuario') {
        params.action = 'updateMany';
        params.args.data = { deletedAt: new Date() };
      }
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        params.action = 'findFirst';
        params.args.where = { ...params.args.where, deletedAt: null };
      }
      return next(params);
    });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="prisma-service-extendido.ts">

```typescript
// Servicio extendido con helpers
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly prismaMiddleware: PrismaMiddleware) {
    super();
  }

  async onModuleInit() {
    this.prismaMiddleware.aplicar(this);
    await this.$connect();
  }

  // Helper de paginación
  async paginate<T>(
    model: any,
    args: { where?: any; orderBy?: any; include?: any; select?: any },
    page: number,
    limit: number,
  ): Promise<{ items: T[]; meta: PaginationMeta }> {
    const [items, total] = await this.$transaction([
      model.findMany({
        ...args,
        skip: (page - 1) * limit,
        take: limit,
      }),
      model.count({ where: args.where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="prisma-client-extensions.ts">

```typescript
// Prisma Client Extensions (v4.7+)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  query: {
    usuario: {
      async create({ args, query }) {
        args.data.password = await bcrypt.hash(args.data.password, 10);
        return query(args);
      },
    },
  },
  result: {
    usuario: {
      nombreCompleto: {
        needs: { nombre: true, apellido: true },
        compute(usuario) {
          return `${usuario.nombre} ${usuario.apellido}`;
        },
      },
    },
  },
});
```

</CodeGroupItem>
</CodeGroup>

## Buenas prácticas

### 1. PrismaService como @Global

```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 2. Usa `select` en lugar de `include` cuando no necesites todo

```typescript
// ✅ Más eficiente: solo pide los campos necesarios
prisma.usuario.findMany({ select: { id: true, nombre: true } });

// ❌ Menos eficiente: trae todos los campos
prisma.usuario.findMany();
```

### 3. Usa transacciones para operaciones multi-tabla

```typescript
// ✅ Transaccional: seguro
await prisma.$transaction(async tx => {
  await tx.pedido.create({ data: ... });
  await tx.producto.update({ where: ..., data: { stock: { decrement: 1 } } });
});
```

### 4. Migraciones en CI/CD

```bash
# En CI/CD
npx prisma migrate deploy   # Solo aplica migraciones pendientes
```

### 5. Mantén el schema.prisma versionado en git

El schema y las migraciones deben estar en el repositorio. El `node_modules/.prisma` no.

### 6. Usa enums de Prisma para campos fijos

```prisma
enum Rol {
  ADMIN
  EDITOR
  VIEWER
}
```

### 7. Configura logging en desarrollo

```typescript
const prisma = new PrismaClient({
  log: process.env.NODE_ENV !== 'production'
    ? ['query', 'info', 'warn']
    : ['error'],
});
```

## Errores comunes

### 1. No ejecutar `prisma generate` después de cambiar el schema

```bash
# ❌ Error: el cliente no refleja los cambios
npx prisma migrate dev  # ← Esto sí generate automáticamente
# O manual: npx prisma generate
```

### 2. Olvidar conectar/desconectar Prisma

```typescript
// ❌ Error: no se conecta al iniciar
export class PrismaService extends PrismaClient {}

// ✅ Correcto
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() { await this.$connect(); }
}
```

### 3. No manejar desconexión en shutdown

```typescript
// ❌ Conexiones abiertas al detener la app
// ✅ Con enableShutdownHooks
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);
  await app.listen(3000);
}
```

### 4. Hacer consultas N+1 sin `include`

```typescript
// ❌ N+1: cada pedido dispara una query
const usuarios = await prisma.usuario.findMany();
const pedidos = await Promise.all(
  usuarios.map(u => prisma.pedido.findMany({ where: { usuarioId: u.id } }))
);

// ✅ Una sola query con include
const usuarios = await prisma.usuario.findMany({ include: { pedidos: true } });
```

### 5. No usar transacciones para operaciones que deben ser atómicas

```typescript
// ❌ Si falla la segunda operación, la primera ya se ejecutó
await prisma.pedido.create({ data: pedido });
await prisma.producto.update({ where: { id }, data: { stock: { decrement: 1 } } });

// ✅ Correcto: todo o nada
await prisma.$transaction(async tx => {
  await tx.pedido.create({ data: pedido });
  await tx.producto.update({ where: { id }, data: { stock: { decrement: 1 } } });
});
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **TypeORM** | ORM alternativo con decoradores. Prisma es schema-first, TypeORM es decorator-first. |
| **Mongoose** | ODM para MongoDB. Prisma también soporta MongoDB. |
| **Módulos NestJS** | PrismaModule global con PrismaService inyectable. |
| **Migrations** | `prisma migrate dev` para desarrollo, `prisma migrate deploy` para producción. |
| **DTOs** | Definen entrada/salida; Prisma define el modelo de datos. |
| **Clean Architecture** | Prisma está en la capa de infraestructura, los casos de uso usan el PrismaService. |

## Resumen

- **Prisma** es un ORM schema-first que genera un cliente type-safe.
- El `schema.prisma` define modelos, relaciones, enums y config de BD.
- `npx prisma generate` crea el cliente TypeScript a partir del schema.
- `PrismaService` extiende `PrismaClient` y se inyecta como provider global.
- `prisma.usuario.findMany()`, `.create()`, `.update()`, `.delete()` — CRUD type-safe.
- `include` carga relaciones (eager loading); `select` limita campos retornados.
- `prisma.$transaction()` para operaciones atómicas multi-tabla.
- `prisma.$use()` para middleware (logging, soft delete, auditoría).
- **Migraciones**: `prisma migrate dev` (desarrollo), `prisma migrate deploy` (producción).
- **Prisma Studio**: `npx prisma studio` — UI visual para explorar datos.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la diferencia principal entre Prisma y TypeORM?</summary>

**Respuesta:** Prisma es **schema-first**: escribes un archivo `schema.prisma` que define todo el modelo y genera un cliente type-safe. TypeORM es **decorator-first**: decoras clases TypeScript con `@Entity`, `@Column`, etc. Prisma tiene mejor type safety y DX; TypeORM tiene más control sobre la estructura de tablas.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué comando de Prisma usas para crear una migración después de cambiar el schema?</summary>

**Respuesta:** `npx prisma migrate dev --name descripcion_del_cambio`. Esto crea un archivo de migración SQL, lo aplica a la BD, y regenera el Prisma Client automáticamente.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cómo se define una relación 1:N en Prisma?</summary>

**Respuesta:** En el modelo padre se pone el nombre del modelo hijo en plural: `pedidos Pedido[]`. En el modelo hijo se pone la FK y la relación: `usuario Usuario @relation(fields: [usuarioId], references: [id])` y `usuarioId String`.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué hace `prisma.$transaction()` y cuándo deberías usarlo?</summary>

**Respuesta:** Ejecuta múltiples operaciones en una transacción de BD: si alguna falla, todas se revierten (rollback). Debes usarlo cuando operaciones multi-tabla deben ser atómicas, como crear un pedido y actualizar el stock simultáneamente.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo evitas incluir campos sensibles (como password) en las respuestas?</summary>

**Respuesta:** Usando `select` explícito para solo incluir los campos necesarios:
```typescript
prisma.usuario.findUnique({
  where: { id },
  select: { id: true, nombre: true, email: true, rol: true },
  // password NO está en select → no se incluye
});
```
No hay un equivalente directo a `{ select: false }` de TypeORM; debes usar `select` siempre.
</details>
