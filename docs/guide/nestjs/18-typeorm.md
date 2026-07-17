---
title: TypeORM con NestJS
description: Aprende a usar TypeORM con NestJS, entidades, repositorios, relaciones, migraciones, transacciones, listeners, índices, soft delete, DataSource y configuración avanzada.
---

# TypeORM con NestJS

TypeORM es como un **traductor simultáneo entre TypeScript y tu base de datos**: escribes clases con decoradores y TypeORM se encarga de crear tablas, consultas y relaciones por ti.

## ¿Qué es?

**TypeORM** es un ORM (Object-Relational Mapper) para TypeScript que permite trabajar con bases de datos SQL usando objetos y decoradores. Se integra con NestJS mediante `@nestjs/typeorm`, que provee módulos, repositorios y decoradores listos para inyectar.

```typescript
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true })
  email: string;
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async buscarPorEmail(email: string) {
    return this.repo.findOneBy({ email });
  }
}
```

## ¿Por qué es importante?

TypeORM es el ORM más usado en el ecosistema NestJS porque:

- **Integración nativa**: `@nestjs/typeorm` con decoradores, módulos y repositorios listos.
- **Active Record + Data Mapper**: Elige el patrón que prefieras.
- **Multi-base de datos**: PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, CockroachDB.
- **Migraciones**: Control de cambios de esquema versionados.
- **Relaciones**: Decoradores simples para 1:1, 1:N, N:M.
- **TypeScript first**: Todo es type-safe con decoradores.

## Problema que resuelve

Sin TypeORM, gestionar el esquema y las consultas SQL es manual:

```typescript
// ❌ Sin ORM: consultas SQL crudas en strings
const result = await pool.query(`
  SELECT u.*, p.id as pedido_id, p.total
  FROM usuarios u
  LEFT JOIN pedidos p ON p.usuario_id = u.id
  WHERE u.email = $1
`, [email]);

// ❌ Sin type safety: los resultados son any[]
const usuario = result.rows[0];
console.log(usuario.nombre);  // Sin autocompletado
```

Con TypeORM, las consultas son type-safe y declarativas:

```typescript
// ✅ Con TypeORM: type-safe y declarativo
const usuario = await this.repo.findOne({
  where: { email },
  relations: ['pedidos'],
});
// usuario.nombre → autocompletado, type-checked
```

## Cómo funciona

### Arquitectura TypeORM en NestJS

```
┌─────────────────────────────────────────────────┐
│                  AppModule                       │
│  ┌───────────────────────────────────────────┐  │
│  │  TypeOrmModule.forRoot({                   │  │
│  │    type: 'postgres',                       │  │
│  │    entities: [__dirname + '/**/*.entity']  │  │
│  │  })                                        │  │
│  └───────────────────────────────────────────┘  │
│         │                                       │
│         ▼                                       │
│  ┌───────────────────────────────────────────┐  │
│  │  UsuariosModule                           │  │
│  │  TypeOrmModule.forFeature([Usuario])       │  │
│  │  ┌──────────────────────────────────┐     │  │
│  │  │  UsuariosService                │     │  │
│  │  │  @InjectRepository(Usuario)     │     │  │
│  │  │  repo: Repository<Usuario>      │     │  │
│  │  │  repo.find(), repo.save()...    │     │  │
│  │  └──────────────────────────────────┘     │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### DataSource

En TypeORM v0.3+, `DataSource` reemplaza a `Connection`:

```typescript
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'miapp',
      entities: [],
      synchronize: false,
    }),
  ],
})
export class AppModule {}
```

## Sintaxis

### Instalación

```bash
npm install @nestjs/typeorm typeorm pg
# Para MySQL: npm install mysql2
# Para SQLite: npm install sqlite3
```

### Decoradores principales

| Decorador | Propósito |
|---|---|
| `@Entity('nombre_tabla')` | Marca una clase como entidad |
| `@PrimaryColumn()` | Columna como clave primaria |
| `@PrimaryGeneratedColumn('uuid')` | Clave primaria auto-generada (UUID) |
| `@PrimaryGeneratedColumn('increment')` | Clave primaria auto-incremental |
| `@Column()` | Columna normal |
| `@CreateDateColumn()` | Fecha de creación (automática) |
| `@UpdateDateColumn()` | Fecha de actualización (automática) |
| `@DeleteDateColumn()` | Soft delete (fecha de borrado) |
| `@VersionColumn()` | Versión de la fila (optimistic locking) |
| `@Index()` | Índice en columna |
| `@Unique()` | Restricción unique compuesta |
| `@OneToOne()` | Relación 1:1 |
| `@OneToMany()` / `@ManyToOne()` | Relación 1:N |
| `@ManyToMany()` | Relación N:M |
| `@JoinColumn()` | Lado propietario de la relación |
| `@JoinTable()` | Tabla intermedia para N:M |
| `@BeforeInsert()` | Hook antes de insertar |
| `@AfterLoad()` | Hook después de cargar |

## Ejemplo básico

Entidades, repositorio y CRUD completo.

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

  @Column({ select: false })  // No se incluye en queries por defecto
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

<CodeGroupItem title="pedido.entity.ts">

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'pendiente' })
  estado: string;

  @ManyToOne(() => Usuario, usuario => usuario.pedidos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  usuario_id: string;

  @CreateDateColumn()
  creadoEn: Date;
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
    const usuario = this.repo.create({
      nombre: dto.nombre,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
    });
    return this.repo.save(usuario);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.repo.find({
      relations: ['pedidos'],
      order: { creadoEn: 'DESC' },
    });
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
  imports: [TypeOrmModule.forFeature([Usuario, Pedido])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Relaciones N:M, eager loading, transacciones y consultas avanzadas con QueryBuilder.

```typescript
// producto.entity.ts — ManyToMany con categorías
@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ default: 0 })
  stock: number;

  @ManyToMany(() => Categoria, categoria => categoria.productos)
  @JoinTable({
    name: 'productos_categorias',
    joinColumn: { name: 'producto_id' },
    inverseJoinColumn: { name: 'categoria_id' },
  })
  categorias: Categoria[];
}

// QueryBuilder para consultas avanzadas
@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  async buscarConFiltros(filtros: BuscarProductosDto) {
    const query = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.categorias', 'c')
      .where('1 = 1');

    if (filtros.nombre) {
      query.andWhere('p.nombre ILIKE :nombre', { nombre: `%${filtros.nombre}%` });
    }

    if (filtros.precioMin) {
      query.andWhere('p.precio >= :precioMin', { precioMin: filtros.precioMin });
    }

    if (filtros.categoriaId) {
      query.andWhere('c.id = :categoriaId', { categoriaId: filtros.categoriaId });
    }

    return query
      .orderBy('p.creadoEn', 'DESC')
      .skip((filtros.page - 1) * filtros.limit)
      .take(filtros.limit)
      .getManyAndCount();
  }
}
```

```typescript
// Transacciones con DataSource
@Injectable()
export class PedidosService {
  constructor(private readonly dataSource: DataSource) {}

  async crearPedidoTransaccional(dto: CrearPedidoDto): Promise<Pedido> {
    return this.dataSource.transaction(async manager => {
      // 1. Crear pedido
      const pedido = await manager.save(Pedido, {
        usuario_id: dto.usuarioId,
        total: dto.items.reduce((s, i) => s + i.precio * i.cantidad, 0),
      });

      // 2. Guardar items
      for (const item of dto.items) {
        await manager.save(PedidoItem, {
          pedido_id: pedido.id,
          producto_id: item.productoId,
          cantidad: item.cantidad,
          precio: item.precio,
        });
        // 3. Actualizar stock
        await manager.decrement(Producto, { id: item.productoId }, 'stock', item.cantidad);
      }

      return pedido;
    });
  }
}
```

## Ejemplo avanzado

DataSource personalizado, subscribers, migraciones, soft delete y multi-tenancy.

<CodeGroup>
<CodeGroupItem title="data-source.ts">

```typescript
// data-source.ts — Para CLI de migraciones
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
```

</CodeGroupItem>

<CodeGroupItem title="subscriber.ts">

```typescript
// Listener global (subscriber)
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class UsuarioSubscriber implements EntitySubscriberInterface<Usuario> {
  listenTo() {
    return Usuario;
  }

  async beforeInsert(event: InsertEvent<Usuario>) {
    event.entity.password = await bcrypt.hash(event.entity.password, 10);
  }

  async afterInsert(event: InsertEvent<Usuario>) {
    console.log(`Usuario creado: ${event.entity.email}`);
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="soft-delete.ts">

```typescript
// Soft Delete con filtro automático
@Entity()
export class Usuario {
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ default: true })
  activo: boolean;
}

@Injectable()
export class UsuariosService {
  async eliminar(id: string): Promise<void> {
    await this.repo.softDelete(id);
    // Internamente: UPDATE usuarios SET deletedAt = now() WHERE id = $1
  }

  async restaurar(id: string): Promise<void> {
    await this.repo.restore(id);
    // Internamente: UPDATE usuarios SET deletedAt = null WHERE id = $1
  }

  async obtenerIncluyendoEliminados(): Promise<Usuario[]> {
    return this.repo.find({ withDeleted: true });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="multi-tenant.ts">

```typescript
// Multi-tenancy por esquema
@Injectable()
export class TenantService {
  constructor(private readonly dataSource: DataSource) {}

  async cambiarEsquema(tenantId: string): Promise<void> {
    await this.dataSource.query(`SET search_path TO ${tenantId}`);
  }
}

// Uso en middleware
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (tenantId) {
      await this.tenantService.cambiarEsquema(tenantId);
    }
    next();
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Buenas prácticas

### 1. Usa migraciones, no `synchronize`

```bash
# Crear migración
npx typeorm-ts-node-commonjs migration:create src/migrations/CrearTablaUsuarios

# Generar migración desde cambios de entidades
npx typeorm-ts-node-commonjs migration:generate src/migrations/ActualizarUsuarios -d src/data-source.ts

# Ejecutar
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
```

### 2. Configura `DataSource` correctamente

```typescript
// Configuración unificada
const dataSourceConfig = {
  type: 'postgres' as const,
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
};

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceConfig)],
})
export class AppModule {}
```

### 3. Usa índices en columnas de búsqueda frecuente

```typescript
@Entity()
@Index(['email', 'activo'])  // Índice compuesto
export class Usuario {
  @Index()  // Índice individual
  @Column({ unique: true })
  email: string;
}
```

### 4. Evita N+1 con eager/join loading

```typescript
// ✅ Bien: cargar todo en una query
const users = await this.repo.find({
  relations: ['pedidos', 'pedidos.items', 'perfil'],
});

// ❌ Mal: N+1 queries
const users = await this.repo.find();
for (const user of users) {
  await user.pedidos;  // Cada acceso dispara una query
}
```

### 5. No expongas el repositorio directamente en controladores

```typescript
// ❌ Mal: controller usa el repo directamente
@Controller()
export class Ctrl {
  constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) {}
}

// ✅ Bien: service encapsula lógica
@Controller()
export class Ctrl {
  constructor(private readonly service: UsuariosService) {}
}
```

## Errores comunes

### 1. `synchronize: true` en producción

```typescript
// ❌ Puede borrar columnas con datos
TypeOrmModule.forRoot({ synchronize: true });

// ✅ Usa migraciones
TypeOrmModule.forRoot({ synchronize: false });
```

### 2. Relaciones circulares sin `forwardRef`

```typescript
// ❌ Error: dependencia circular
@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],  // Pedido no encontrado
})
export class UsuariosModule {}

// ✅ Correcto
@Module({
  imports: [forwardRef(() => PedidosModule), TypeOrmModule.forFeature([Usuario])],
})
export class UsuariosModule {}
```

### 3. Olvidar `@JoinColumn` en relaciones

```typescript
// ❌ La tabla no tendrá la FK
@OneToOne(() => Perfil)
perfil: Perfil;

// ✅ Correcto
@OneToOne(() => Perfil)
@JoinColumn()
perfil: Perfil;
```

### 4. No usar `select: false` para campos sensibles

```typescript
// ❌ Password incluida en todas las queries
@Column()
password: string;

// ✅ Excluida por defecto
@Column({ select: false })
password: string;

// Para incluirla explícitamente:
this.repo.findOne({ where: { id }, select: ['id', 'password', 'email'] });
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Módulos** | `TypeOrmModule.forFeature()` registra entidades en un módulo. |
| **Servicios** | Inyectan `Repository<Entity>` para operaciones CRUD. |
| **DTOs** | Definen los datos de entrada; las entidades definen el esquema de BD. |
| **Migraciones** | Versionan cambios de esquema. `typeorm migration:run`. |
| **Transacciones** | `DataSource.transaction()` o `QueryRunner` para operaciones atómicas. |
| **Prisma** | ORM alternativo con schema-first. Similar pero con enfoque diferente. |

## Resumen

- **TypeORM** es un ORM SQL para TypeScript con decoradores.
- `@Entity()` define una tabla; `@Column()` define columnas.
- `@PrimaryGeneratedColumn('uuid')` para IDs autogenerados.
- Las relaciones se definen con `@OneToOne`, `@OneToMany`, `@ManyToMany`.
- `@InjectRepository(Entidad)` inyecta el repositorio en servicios.
- Usa **migraciones** para cambios de esquema en producción.
- `DataSource.transaction()` para operaciones atómicas.
- `QueryBuilder` para consultas dinámicas y complejas.
- **Soft delete** con `@DeleteDateColumn()`.
- **Subscribers** para hooks globales (beforeInsert, afterUpdate).
- Nunca expongas contraseñas en queries — usa `{ select: false }`.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué decorador se usa para definir la clave primaria auto-generada como UUID?</summary>

**Respuesta:** `@PrimaryGeneratedColumn('uuid')`. Genera un UUID automáticamente al crear la entidad. Alternativa: `'increment'` para IDs numéricos auto-incrementales.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cómo evitas el problema N+1 en TypeORM?</summary>

**Respuesta:** Usando `relations` en el find: `find({ relations: ['pedidos', 'pedidos.items'] })`. Esto genera un JOIN en una sola query. Sin esto, acceder a cada relación dispara una query adicional.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué diferencia hay entre `synchronize: true` y las migraciones?</summary>

**Respuesta:** `synchronize: true` auto-crea/actualiza tablas al iniciar la app basado en las entidades. Es rápido pero **peligroso** (puede borrar datos). Las migraciones son archivos versionados que controlan exactamente qué cambios se aplican y permiten rollback.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo se define una relación ManyToMany con tabla intermedia?</summary>

**Respuesta:** `@ManyToMany(() => OtraEntidad)` en ambas entidades y `@JoinTable()` en el lado propietario:
```typescript
@Entity() class Producto {
  @ManyToMany(() => Categoria)
  @JoinTable({ name: 'productos_categorias' })
  categorias: Categoria[];
}
```
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo realizas una transacción que afecta múltiples tablas?</summary>

**Respuesta:** Con `DataSource.transaction()`:
```typescript
await this.dataSource.transaction(async manager => {
  await manager.save(Entidad1, datos1);
  await manager.save(Entidad2, datos2);
});
```
Si cualquier operación falla, todas las operaciones se revierten automáticamente.
</details>
