---
title: Bases de Datos en NestJS
description: Aprende a integrar bases de datos en NestJS con TypeORM, Prisma, Mongoose, Drizzle ORM, migraciones, seeds, conexiones múltiples y buenas prácticas de persistencia.
---

# Bases de Datos en NestJS

Las bases de datos en NestJS son como **el sistema de archivos de una oficina**: puedes guardar documentos en carpetas físicas (SQL) o en una pila ordenada en tu escritorio (NoSQL). NestJS no impone una tecnología, pero ofrece integraciones excelentes para las más populares.

## ¿Qué es?

Una **base de datos** es un sistema organizado para almacenar, recuperar y gestionar datos. NestJS se integra con bases de datos a través de **módulos específicos** que proveen decoradores, repositorios y servicios para cada motor.

```typescript
// Ejemplo con TypeORM (SQL)
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'miapp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,  // Solo en desarrollo
    }),
  ],
})
export class AppModule {}
```

## ¿Por qué es importante?

Las bases de datos son el **corazón persistente** de cualquier aplicación:

- **Persistencia**: Los datos sobreviven a reinicios del servidor.
- **Consistencia**: Reglas ACID garantizan integridad.
- **Escalabilidad**: Desde SQLite local hasta clusters de PostgreSQL.
- **Consultas complejas**: Filtros, joins, agregaciones.
- **Relaciones**: Modelar conexiones entre entidades del mundo real.

:::tip
NestJS es agnóstico en bases de datos. Puedes usar SQL (PostgreSQL, MySQL, SQLite) o NoSQL (MongoDB, Redis). La elección depende de tu modelo de datos: relaciones complejas → SQL; documentos flexibles → NoSQL.
:::

## Problema que resuelve

Sin un ORM/ODM, interactuar con la base de datos es tedioso y propenso a errores:

```typescript
// ❌ Sin ORM: SQL crudo y manual
@Injectable()
export class UsuariosService {
  constructor(@InjectConnection() private readonly pool: Pool) {}

  async crear(dto: CrearUsuarioDto) {
    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *';
    const result = await this.pool.query(query, [dto.nombre, dto.email, dto.password]);
    return result.rows[0];
  }

  async buscarPorEmail(email: string) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  // SQL en strings → sin type safety, sin autocompletado, propenso a inyección
  async buscarConFiltrosComplejos(filtros: any) {
    let query = 'SELECT * FROM usuarios WHERE 1=1';
    const params: any[] = [];
    if (filtros.nombre) {
      params.push(filtros.nombre);
      query += ` AND nombre ILIKE $${params.length}`;
    }
    // ... más condiciones manuales
  }
}
```

Con un ORM, las operaciones son declarativas y type-safe:

```typescript
// ✅ Con TypeORM: repositorio type-safe
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async crear(dto: CrearUsuarioDto) {
    const usuario = this.repo.create(dto);  // Type-safe
    return this.repo.save(usuario);
  }

  async buscarPorEmail(email: string) {
    return this.repo.findOneBy({ email });  // Autocompletado
  }

  async buscarConFiltros(filtros: BuscarDto) {
    return this.repo.find({
      where: { /* condiciones type-safe */ },
      relations: ['pedidos'],
      order: { createdAt: 'DESC' },
    });
  }
}
```

## Cómo funciona

### Opciones de bases de datos en NestJS

```
┌────────────────────────────────────────────────────────────┐
│                    NESTJS + BD                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              ORMs / ODMs Oficiales                  │  │
│  │                                                     │  │
│  │  @nestjs/typeorm    @nestjs/mongoose  @nestjs/micro  │  │
│  │  (SQL: Postgres,    (MongoDB)          (Prisma)     │  │
│  │   MySQL, SQLite,                                    │  │
│  │   MariaDB, CockroachDB)                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │            ORMs / ODMs No Oficiales                 │  │
│  │                                                     │  │
│  │  Drizzle ORM     Sequelize     Knex.js   Redis OM  │  │
│  │  (SQL moderno)   (SQL clásico)  (Query builder)    │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### TypeORM vs Prisma vs Mongoose

| Aspecto | TypeORM | Prisma | Mongoose |
|---|---|---|---|
| **Tipo** | ORM | ORM (Query Engine) | ODM |
| **BD** | SQL (Postgres, MySQL, SQLite, etc.) | SQL (Postgres, MySQL, SQLite, SQL Server, MongoDB) | MongoDB |
| **Enfoque** | Active Record / Data Mapper | Schema-first (schema.prisma) | Schema-based |
| **Migraciones** | Automáticas (synchronize) + CLI | Prisma Migrate (CLI) | Manual |
| **Type Safety** | Buena (con decoradores) | Excelente (generado) | Buena (con interfaces) |
| **Curva** | Media | Media-baja | Baja |
| **Paquete NestJS** | `@nestjs/typeorm` | `@nestjs/prisma` (no oficial) | `@nestjs/mongoose` |

## Sintaxis

### TypeORM — Configuración básica

```bash
npm install @nestjs/typeorm typeorm pg
```

```typescript
// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,  // o components individuales
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',  // Auto-sync (dev only)
      logging: process.env.NODE_ENV !== 'production',
    }),
    // Por módulo:
    TypeOrmModule.forFeature([Usuario, Pedido]),
  ],
})
export class AppModule {}
```

### Prisma — Configuración básica

```bash
npm install @prisma/client
npx prisma init
```

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id        String   @id @default(uuid())
  nombre    String
  email     String   @unique
  password  String
  activo    Boolean  @default(true)
  creadoEn  DateTime @default(now())
  pedidos   Pedido[]
}

model Pedido {
  id        String   @id @default(uuid())
  usuarioId String
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  total     Float
  creadoEn  DateTime @default(now())
}
```

```typescript
// prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### Mongoose — Configuración básica

```bash
npm install @nestjs/mongoose mongoose
```

```typescript
// app.module.ts
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
})
export class AppModule {}
```

```typescript
// schemas/usuario.schema.ts
@Schema()
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  activo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
```

## Ejemplo básico

CRUD completo con TypeORM y PostgreSQL.

<CodeGroup>
<CodeGroupItem title="usuario.entity.ts">

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @OneToMany(() => Pedido, pedido => pedido.usuario)
  pedidos: Pedido[];
}
```

</CodeGroupItem>

<CodeGroupItem title="usuarios.service.ts">

```typescript
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async crear(dto: CrearUsuarioDto): Promise<Usuario> {
    const usuario = this.repo.create(dto);
    return this.repo.save(usuario);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.repo.find({ relations: ['pedidos'] });
  }

  async obtenerPorId(id: string): Promise<Usuario | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['pedidos'],
    });
  }

  async actualizar(id: string, dto: ActualizarUsuarioDto): Promise<Usuario> {
    await this.repo.update(id, dto);
    return this.obtenerPorId(id) as Promise<Usuario>;
  }

  async eliminar(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="usuarios.module.ts">

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Múltiples conexiones, transacciones y relaciones complejas.

```typescript
// app.module.ts — Múltiples bases de datos
@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    TypeOrmModule.forRoot({
      name: 'mongo',
      type: 'mongodb',
      url: process.env.MONGO_URI,
      entities: [__dirname + '/../analytics/**/*.entity{.ts,.js}'],
    }),
    // Módulos
    UsuariosModule,
    PedidosModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
```

```typescript
// Transacciones con QueryRunner
@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly repo: Repository<Pedido>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async crearPedidoCompleto(dto: CrearPedidoDto): Promise<Pedido> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Crear pedido
      const pedido = queryRunner.manager.create(Pedido, dto);
      await queryRunner.manager.save(pedido);

      // 2. Actualizar stock
      for (const item of dto.items) {
        await queryRunner.manager.update(
          Producto,
          item.productoId,
          { stock: () => `stock - ${item.cantidad}` },
        );
      }

      await queryRunner.commitTransaction();
      return pedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
```

## Ejemplo avanzado

Repositorio genérico, soft delete, eventos de ciclo de vida y caché.

<CodeGroup>
<CodeGroupItem title="base.repository.ts">

```typescript
// Repositorio genérico con operaciones comunes
export class BaseRepository<T extends { id: string }> {
  constructor(
    @InjectRepository(Entity)
    protected readonly repo: Repository<T>,
  ) {}

  async crear(dto: Partial<T>): Promise<T> {
    return this.repo.save(this.repo.create(dto));
  }

  async buscarPorId(id: string, relations?: string[]): Promise<T | null> {
    return this.repo.findOne({ where: { id } as any, relations });
  }

  async buscarTodos(filtros?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(filtros);
  }

  async actualizar(id: string, dto: Partial<T>): Promise<T | null> {
    const existe = await this.repo.preload({ id, ...dto });
    if (!existe) return null;
    return this.repo.save(existe);
  }

  async eliminar(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

// Uso:
@Injectable()
export class UsuariosService extends BaseRepository<Usuario> {
  constructor(@InjectRepository(Usuario) repo: Repository<Usuario>) {
    super(repo);
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="soft-delete.entity.ts">

```typescript
import { DeleteDateColumn } from 'typeorm';

// Soft Delete con @DeleteDateColumn
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @DeleteDateColumn()  // ← Se llena cuando se elimina (soft delete)
  deletedAt?: Date;
}

// Servicio
@Injectable()
export class UsuariosService {
  async eliminar(id: string): Promise<void> {
    await this.repo.softDelete(id);  // deletedAt = now()
  }

  async obtenerIncluyendoEliminados(): Promise<Usuario[]> {
    return this.repo.find({ withDeleted: true });
  }

  async restaurar(id: string): Promise<void> {
    await this.repo.restore(id);  // deletedAt = null
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="entity-listener.entity.ts">

```typescript
// Eventos de ciclo de vida en entidades
import { BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class Usuario {
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  actualizarTimestamp() {
    this.actualizadoEn = new Date();
  }

  @AfterLoad()
  cargarNombreCompleto() {
    this.nombreCompleto = `${this.nombre} ${this.apellido}`;
  }

  nombreCompleto?: string;
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema multi-base de datos: PostgreSQL (transaccional) + MongoDB (analytics) + Redis (caché).

```
ARQUITECTURA DE DATOS
─────────────────────────────────────────────────────────

  ┌──────────────────────────────────────────────────┐
  │              PostgreSQL (Principal)               │
  │  Datos transaccionales: usuarios, pedidos,       │
  │  productos, facturas, inventario                 │
  │                                                   │
  │  Tablas:                                          │
  │  - usuarios (id, nombre, email, password, rol)    │
  │  - productos (id, nombre, precio, stock)          │
  │  - pedidos (id, usuario_id, total, estado)        │
  │  - pedido_items (id, pedido_id, producto_id,     │
  │                  cantidad, precio)                 │
  └───────────────┬──────────────────────────────────┘
                   │
  ┌────────────────┴─────────────────────────────────┐
  │              MongoDB (Analytics)                  │
  │  Datos de análisis: eventos, sesiones,           │
  │  logs de actividad, métricas de uso              │
  │                                                   │
  │  Colecciones:                                     │
  │  - page_views (usuario_id, url, timestamp)        │
  │  - eventos_negocio (tipo, data, timestamp)        │
  │  - sesiones_usuario (usuario_id, inicio, fin)     │
  └────────────────┬─────────────────────────────────┘
                   │
  ┌────────────────┴─────────────────────────────────┐
  │                Redis (Caché)                      │
  │  Datos temporales: sesiones JWT, caché de        │
  │  consultas frecuentes, rate limiting             │
  │                                                   │
  │  Keys:                                            │
  │  - user:123:session → { ... }                     │
  │  - product:popular → [ids...]                    │
  │  - rate:ip:192.168.1.1 → 10                      │
  └──────────────────────────────────────────────────┘
```

## Buenas prácticas

### 1. Nunca uses `synchronize: true` en producción

```typescript
// ✅ Bien
TypeOrmModule.forRoot({
  synchronize: process.env.NODE_ENV !== 'production',
  // O mejor: migrations
  migrationsRun: true,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
})

// ❌ Mal
TypeOrmModule.forRoot({ synchronize: true })  // Puede borrar datos
```

### 2. Usa migraciones para cambios en producción

```bash
# TypeORM CLI
npx typeorm migration:create src/migrations/CrearUsuario
npx typeorm migration:run

# Prisma CLI
npx prisma migrate dev --name crear_usuario
npx prisma migrate deploy
```

### 3. Indexa columnas usadas en búsquedas frecuentes

```typescript
@Entity()
export class Usuario {
  @Index()  // ← Índice en email (búsquedas frecuentes)
  @Column({ unique: true })
  email: string;

  @Index('idx_usuario_activo_rol')  // ← Índice compuesto
  @Column()
  activo: boolean;

  @Column()
  rol: string;
}
```

### 4. Usa transacciones para operaciones multi-tabla

```typescript
async function operacionCompleja() {
  return this.dataSource.transaction(async manager => {
    const pedido = await manager.save(Pedido, pedidoDto);
    const pago = await manager.save(Pago, { pedidoId: pedido.id, ... });
    return { pedido, pago };
  });
}
```

### 5. Separa entidades ORM de DTOs

```typescript
// Entidad (TypeORM)
@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() password: string;  // Solo en BD
}

// DTO (respuesta API)
export class UsuarioDto {
  id: string;
  nombre: string;
  email: string;
  // Sin password
}
```

### 6. Usa variables de entorno para credenciales

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=secreto123
DB_NAME=miapp
DATABASE_URL=postgresql://admin:secreto123@localhost:5432/miapp
```

## Errores comunes

### 1. No cerrar conexiones en pruebas

```typescript
// ❌ Error: fuga de conexiones en tests
afterAll(async () => {
  // Falta await app.close()
});

// ✅ Correcto
afterAll(async () => {
  await app.close();
  await dataSource.destroy();
});
```

### 2. Entidades con relaciones circulares sin `forwardRef`

```typescript
// ❌ Error: dependencia circular
@Entity()
export class Usuario {
  @OneToMany(() => Pedido, pedido => pedido.usuario)
  pedidos: Pedido[];
}

@Entity()
export class Pedido {
  @ManyToOne(() => Usuario, usuario => usuario.pedidos)
  usuario: Usuario;
}

// ✅ Correcto en módulo
@Module({
  imports: [
    forwardRef(() => PedidosModule),
    TypeOrmModule.forFeature([Usuario]),
  ],
})
export class UsuariosModule {}
```

### 3. Cargar demasiadas relaciones (N+1)

```typescript
// ❌ Error: N+1 queries
async obtenerUsuarios() {
  return this.repo.find();  // 1 query
  // Luego acceder a pedidos por cada usuario: N queries
}

// ✅ Correcto: eager loading
async obtenerUsuarios() {
  return this.repo.find({ relations: ['pedidos', 'pedidos.items'] });
}
```

### 4. No usar `@Transaction` correctamente

```typescript
// ❌ Error: las operaciones NO están en la misma transacción
async crearPedido(dto: any) {
  const pedido = await this.pedidoRepo.save(dto);
  await this.stockRepo.actualizar(dto.items);  // Fuera de transacción!
}

// ✅ Correcto
async crearPedido(dto: any) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(Pedido, dto);
    await queryRunner.manager.update(Stock, ...);
    await queryRunner.commitTransaction();
  } catch { await queryRunner.rollbackTransaction(); }
  finally { await queryRunner.release(); }
}
```

### 5. Exponer datos sensibles en la API

```typescript
// ❌ Error: password en la respuesta
@Get(':id')
async obtener(@Param('id') id: string) {
  return this.repo.findOneBy({ id });  // password incluida
}

// ✅ Correcto: excluir campos sensibles
@Get(':id')
async obtener(@Param('id') id: string) {
  const usuario = await this.repo.findOneBy({ id });
  const { password, ...resto } = usuario;
  return resto;
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **TypeORM** | ORM SQL oficial para NestJS. Usa decoradores y repositorios. |
| **Prisma** | ORM moderno con schema-first. Excelente type safety. |
| **Mongoose** | ODM para MongoDB con esquemas y modelos. |
| **Módulos** | `TypeOrmModule.forFeature()` importa entidades en un módulo. |
| **Servicios** | Inyectan repositorios para operaciones de BD. |
| **ConfigService** | Provee credenciales de BD desde variables de entorno. |
| **DTOs** | Definen la forma de los datos que se persisten/responden. |

## Resumen

- NestJS se integra con **TypeORM** (SQL), **Prisma** (SQL) y **Mongoose** (MongoDB).
- **TypeORM** usa decoradores (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`) y repositorios.
- **Prisma** usa un schema declarativo (`schema.prisma`) y genera un cliente type-safe.
- **Mongoose** usa esquemas y decoradores (`@Schema()`, `@Prop()`).
- Las **relaciones** entre entidades se definen con `@OneToMany`, `@ManyToOne`, `@ManyToMany`.
- Las **transacciones** aseguran que operaciones multi-tabla sean atómicas.
- **Nunca** uses `synchronize: true` en producción — usa migraciones.
- Las **migraciones** versionan los cambios de esquema de BD.
- **Eager loading** evita el problema N+1 cargando relaciones en una sola query.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la diferencia entre TypeORM y Prisma?</summary>

**Respuesta:** TypeORM es un ORM tradicional con decoradores en las entidades (decorator-first). Prisma usa un schema declarativo (`schema.prisma`) y genera un cliente type-safe (schema-first). Prisma tiene mejor type safety y DX moderna; TypeORM tiene más flexibilidad y madurez en NestJS.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Por qué no deberías usar `synchronize: true` en producción?</summary>

**Respuesta:** Porque puede **borrar datos accidentalmente** al sincronizar el esquema. Si cambias el nombre de una columna, TypeORM podría eliminar la columna antigua con sus datos. En producción, usa **migraciones** para controlar los cambios de esquema de forma segura.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué es el problema N+1 y cómo se soluciona en TypeORM?</summary>

**Respuesta:** Ocurres cuando haces una query para obtener entidades y luego N queries adicionales para sus relaciones. Se soluciona con **eager loading** usando `{ relations: ['relacion'] }` en el `find()` o `FindOptionsRelations`.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo manejas transacciones que afectan múltiples tablas?</summary>

**Respuesta:** Con `QueryRunner` (TypeORM) o `dataSource.transaction()`:
```typescript
const queryRunner = dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();
try { /* operaciones */ await queryRunner.commitTransaction(); }
catch { await queryRunner.rollbackTransaction(); }
finally { await queryRunner.release(); }
```
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Qué ORM/ODM usarías para MongoDB en NestJS?</summary>

**Respuesta:** **Mongoose** con `@nestjs/mongoose`. Usa esquemas con decoradores (`@Schema()`, `@Prop()`) y modelos inyectables para operaciones CRUD. Alternativamente, Prisma también soporta MongoDB con un schema unificado.
</details>
