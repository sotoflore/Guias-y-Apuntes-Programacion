---
title: Clean Architecture en NestJS
description: Aprende a implementar Clean Architecture (Arquitectura Limpia) en NestJS con capas de dominio, aplicación e infraestructura, casos de uso, adaptadores y principios SOLID.
---

# Clean Architecture en NestJS

La Clean Architecture es como **diseñar una casa pensando en las tuberías y los cimientos antes de elegir los muebles**: primero construyes una base sólida e independiente, luego añades los detalles específicos de cada habitación.

## ¿Qué es?

Clean Architecture (Arquitectura Limpia) es un conjunto de principios de diseño de software propuesto por **Robert C. Martin (Uncle Bob)** que busca separar el código en **capas concéntricas** con una regla fundamental: **las dependencias solo pueden ir hacia adentro**. El dominio y los casos de uso están en el centro, completamente aislados de frameworks, bases de datos, APIs externas y cualquier detalle de infraestructura.

```typescript
// El corazón de la aplicación: NO importa nada de infraestructura
export class CrearUsuarioUseCase {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  async execute(dto: CrearUsuarioDto): Promise<Usuario> {
    const existe = await this.usuarioRepo.findByEmail(dto.email);
    if (existe) throw new Error('El email ya está registrado');
    return this.usuarioRepo.save(new Usuario(dto.nombre, dto.email));
  }
}
```

## ¿Por qué es importante?

La Clean Architecture importa porque el **90% del tiempo de vida de un software se gasta en mantenimiento**, no en desarrollo inicial.

- **Independencia del framework**: NestJS es reemplazable sin reescribir la lógica de negocio.
- **Testeabilidad**: Los casos de uso se prueban sin HTTP, sin base de datos, sin nada externo.
- **Independencia de la UI**: Puedes cambiar de REST a GraphQL sin tocar el dominio.
- **Independencia de la base de datos**: Pasas de MongoDB a PostgreSQL cambiando solo una capa.
- **Independencia de agentes externos**: Las reglas de negocio no saben que existen APIs externas.

:::tip
Clean Architecture no es una tecnología ni un paquete npm — es una **disciplina de diseño**. NestJS no la exige, pero sus herramientas (DI, módulos, decoradores) la facilitan enormemente.
:::

## Problema que resuelve

Sin Clean Architecture, el código típico de NestJS tiende a mezclar todo:

```typescript
// ❌ Código acoplado: infraestructura + negocio mezclados
@Controller('usuarios')
export class UsuariosController {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repo: Repository<UsuarioEntity>,  // ← Depende de TypeORM
    private readonly mailService: MailService,         // ← Dependencia externa
  ) {}

  @Post()
  async crear(@Body() dto: any) {
    // ❌ Validación manual
    if (!dto.email || !dto.email.includes('@')) throw new BadRequestException();

    // ❌ Lógica de negocio en el controlador
    const existe = await this.repo.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException();

    // ❌ Creación de entidad mezclada con persistencia
    const usuario = this.repo.create(dto);
    await this.repo.save(usuario);

    // ❌ Efectos secundarios acoplados
    await this.mailService.enviarBienvenida(usuario.email);

    return usuario;
  }
}
```

Con Clean Architecture, cada responsabilidad está en su lugar:

```typescript
// ✅ Clean Architecture: capas separadas por responsabilidad

// DOMINIO: entidad pura, sin decoradores
export class Usuario {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly email: Email,  // Value Object
    public readonly creadoEn: Date = new Date(),
  ) {}
}

// APLICACIÓN: caso de uso, orquesta el flujo
@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    private readonly repo: UsuarioRepository,      // Abstracción (puerto)
    private readonly emailService: EmailNotifier,   // Abstracción (puerto)
  ) {}

  async execute(dto: CrearUsuarioDto): Promise<Usuario> {
    const email = Email.crear(dto.email);
    await this.asegurarEmailUnico(email);
    const usuario = new Usuario(crypto.randomUUID(), dto.nombre, email);
    await this.repo.save(usuario);
    await this.emailService.enviarBienvenida(usuario);
    return usuario;
  }

  private async asegurarEmailUnico(email: Email): Promise<void> {
    const existe = await this.repo.findByEmail(email);
    if (existe) throw new Error('Email ya registrado');
  }
}

// INFRAESTRUCTURA: implementación concreta de TypeORM
@Injectable()
export class UsuarioRepositoryTypeOrm implements UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly ormRepo: Repository<UsuarioEntity>,
  ) {}

  async save(usuario: Usuario): Promise<void> {
    await this.ormRepo.save(this.toEntity(usuario));
  }

  async findByEmail(email: Email): Promise<Usuario | null> {
    const entity = await this.ormRepo.findOne({ where: { email: email.value } });
    return entity ? this.toDomain(entity) : null;
  }

  private toEntity(domain: Usuario): UsuarioEntity { /* mapeo */ }
  private toDomain(entity: UsuarioEntity): Usuario { /* mapeo */ }
}
```

## Cómo funciona

### Las 4 capas de Clean Architecture

```
        ┌─────────────────────────────────────┐
        │        INFRAESTRUCTURA              │
        │   (NestJS, Express, TypeORM, Redis) │
        │   ┌──────────────────────────────┐  │
        │   │      ADAPTADORES DE UI       │  │
        │   │  (Controladores, Guards,     │  │
        │   │   Pipes, Interceptors)       │  │
        │   │  ┌───────────────────────┐  │  │
        │   │  │    APLICACIÓN         │  │  │
        │   │  │  (Casos de Uso,       │  │  │
        │   │  │   DTOs, Puertos)      │  │  │
        │   │  │  ┌────────────────┐  │  │  │
        │   │  │  │   DOMINIO      │  │  │  │
        │   │  │  │ (Entidades,     │  │  │  │
        │   │  │  │  Value Objects, │  │  │  │
        │   │  │  │  Repositorios)  │  │  │  │
        │   │  │  └────────────────┘  │  │  │
        │   │  └───────────────────────┘  │  │
        │   └──────────────────────────────┘  │
        └─────────────────────────────────────┘
```

### Regla de Dependencias

**Las dependencias solo apuntan hacia adentro.** El dominio no sabe que existe NestJS. La capa de aplicación no sabe que existe Express. La infraestructura implementa interfaces definidas por las capas internas.

```
❌ Permitido: Infraestructura → Aplicación → Dominio
❌ Permitido: Aplicación → Dominio
❌ Permitido: Adaptadores → Aplicación
✅ Prohibido: Dominio → Infraestructura
✅ Prohibido: Aplicación → Infraestructura
```

## Sintaxis

### Estructura de carpetas

```
src/
  domain/
    entities/
      usuario.entity.ts         # Entidad de dominio
      pedido.entity.ts
    value-objects/
      email.ts                  # Value Object
      direccion.ts
    repositories/
      usuario.repository.ts     # Puerto (interfaz)
      pedido.repository.ts
    services/
      calculadorDescuento.ts    # Servicio de dominio
    events/
      usuarioCreado.event.ts    # Evento de dominio

  application/
    use-cases/
      usuarios/
        crear-usuario.use-case.ts
        obtener-usuario.use-case.ts
      pedidos/
        crear-pedido.use-case.ts
    ports/
      output/
        email-notifier.ts       # Puerto de salida
        file-storage.ts
      input/                    # (Opcional) puertos de entrada
    dtos/
      crear-usuario.dto.ts
      crear-pedido.dto.ts

  infrastructure/
    persistence/
      typeorm/
        entities/
          usuario.entity.ts     # Entity ORM (DTO de BD)
        repositories/
          usuario.repository.impl.ts
    adapters/
      email/
        mailgun-notifier.ts
      storage/
        s3-file-storage.ts
    nestjs/
      controllers/
        usuarios.controller.ts
      guards/
        roles.guard.ts
      interceptors/
        logging.interceptor.ts
    config/
      database.config.ts

  main.ts
  app.module.ts
```

### Definiciones clave

| Concepto | Capa | Descripción |
|---|---|---|
| **Entidad** | Dominio | Objeto con identidad única y reglas de negocio |
| **Value Object** | Dominio | Objeto sin identidad, definido por sus atributos |
| **Agregado** | Dominio | Grupo de entidades tratado como una unidad |
| **Puerto** | Dominio/Aplicación | Interfaz que define una operación |
| **Adaptador** | Infraestructura | Implementación concreta de un puerto |
| **Caso de Uso** | Aplicación | Orquesta una operación de negocio |
| **DTO** | Aplicación | Objeto que transporta datos entre capas |
| **Entity ORM** | Infraestructura | Mapeo de BD específico del ORM |

## Ejemplo básico

Sistema de creación de usuarios con Clean Architecture.

<CodeGroup>
<CodeGroupItem title="domain/usuario.ts">

```typescript
// CAPA DE DOMINIO — Sin dependencias externas
export interface UsuarioProps {
  id: string;
  nombre: string;
  email: Email;
  creadoEn: Date;
}

export class Usuario {
  private constructor(private readonly props: UsuarioProps) {}

  static crear(nombre: string, email: Email): Usuario {
    return new Usuario({
      id: crypto.randomUUID(),
      nombre: this.validarNombre(nombre),
      email,
      creadoEn: new Date(),
    });
  }

  private static validarNombre(nombre: string): string {
    const trimmed = nombre.trim();
    if (trimmed.length < 2) throw new Error('Nombre debe tener al menos 2 caracteres');
    return trimmed;
  }

  get id(): string { return this.props.id; }
  get nombre(): string { return this.props.nombre; }
  get email(): Email { return this.props.email; }
  get creadoEn(): Date { return this.props.creadoEn; }
}
```

</CodeGroupItem>

<CodeGroupItem title="domain/email.ts">

```typescript
// CAPA DE DOMINIO — Value Object
export class Email {
  private constructor(public readonly value: string) {}

  static crear(email: string): Email {
    this.validar(email);
    return new Email(email.toLowerCase().trim());
  }

  private static validar(email: string): void {
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="domain/repositories/usuario.repository.ts">

```typescript
// CAPA DE DOMINIO — Puerto (interfaz)
export abstract class UsuarioRepository {
  abstract save(usuario: Usuario): Promise<void>;
  abstract findByEmail(email: Email): Promise<Usuario | null>;
  abstract findById(id: string): Promise<Usuario | null>;
  abstract findAll(): Promise<Usuario[]>;
  abstract delete(id: string): Promise<void>;
}
```

</CodeGroupItem>

<CodeGroupItem title="application/ports/email-notifier.ts">

```typescript
// CAPA DE APLICACIÓN — Puerto de salida
export abstract class EmailNotifier {
  abstract enviarBienvenida(usuario: Usuario): Promise<void>;
}
```

</CodeGroupItem>

<CodeGroupItem title="application/use-cases/crear-usuario.use-case.ts">

```typescript
// CAPA DE APLICACIÓN — Caso de uso
@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    private readonly usuarioRepo: UsuarioRepository,
    private readonly emailNotifier: EmailNotifier,
  ) {}

  async execute(dto: CrearUsuarioDto): Promise<Usuario> {
    const email = Email.crear(dto.email);

    const existe = await this.usuarioRepo.findByEmail(email);
    if (existe) {
      throw new Error('El email ya está registrado');
    }

    const usuario = Usuario.crear(dto.nombre, email);
    await this.usuarioRepo.save(usuario);

    await this.emailNotifier.enviarBienvenida(usuario);
    return usuario;
  }
}

export interface CrearUsuarioDto {
  nombre: string;
  email: string;
}
```

</CodeGroupItem>

<CodeGroupItem title="infrastructure/typeorm/usuario.entity.ts">

```typescript
// CAPA DE INFRAESTRUCTURA — Entity de TypeORM
@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  creadoEn!: Date;
}
```

</CodeGroupItem>

<CodeGroupItem title="infrastructure/repositories/usuario.repository.impl.ts">

```typescript
// CAPA DE INFRAESTRUCTURA — Adaptador de repositorio
@Injectable()
export class UsuarioRepositoryImpl implements UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repo: Repository<UsuarioEntity>,
  ) {}

  async save(usuario: Usuario): Promise<void> {
    const entity = this.toEntity(usuario);
    await this.repo.save(entity);
  }

  async findByEmail(email: Email): Promise<Usuario | null> {
    const entity = await this.repo.findOne({ where: { email: email.value } });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: string): Promise<Usuario | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Usuario[]> {
    const entities = await this.repo.find();
    return entities.map(e => this.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toEntity(domain: Usuario): UsuarioEntity {
    return {
      id: domain.id,
      nombre: domain.nombre,
      email: domain.email.value,
      creadoEn: domain.creadoEn,
    };
  }

  private toDomain(entity: UsuarioEntity): Usuario {
    return new Usuario({
      id: entity.id,
      nombre: entity.nombre,
      email: Email.crear(entity.email),
      creadoEn: entity.creadoEn,
    });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="infrastructure/adapters/mailgun-notifier.ts">

```typescript
// CAPA DE INFRAESTRUCTURA — Adaptador de notificación
@Injectable()
export class MailgunNotifier implements EmailNotifier {
  constructor(private readonly httpService: HttpService) {}

  async enviarBienvenida(usuario: Usuario): Promise<void> {
    await firstValueFrom(
      this.httpService.post('https://api.mailgun.net/v3/...', {
        to: usuario.email.value,
        subject: '¡Bienvenido!',
        template: 'welcome',
        data: { nombre: usuario.nombre },
      }),
    );
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="infrastructure/nestjs/controllers/usuarios.controller.ts">

```typescript
// CAPA DE INFRAESTRUCTURA — Adaptador de entrada (Controller)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly crearUsuario: CrearUsuarioUseCase) {}

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    try {
      const usuario = await this.crearUsuario.execute(dto);
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email.value,
        creadoEn: usuario.creadoEn,
      };
    } catch (error: any) {
      throw new ConflictException(error.message);
    }
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="app.module.ts">

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuariosController],
  providers: [
    CrearUsuarioUseCase,
    { provide: UsuarioRepository, useClass: UsuarioRepositoryImpl },
    { provide: EmailNotifier, useClass: MailgunNotifier },
  ],
})
export class UsuariosModule {}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Sistema de pedidos con agregados, eventos de dominio y casos de uso complejos.

```typescript
// domain/pedido.ts — Agregado raíz
export class Pedido {
  private items: PedidoItem[] = [];
  private estado: EstadoPedido = 'pendiente';

  private constructor(
    public readonly id: string,
    public readonly usuarioId: string,
  ) {}

  static crear(usuarioId: string): Pedido {
    return new Pedido(crypto.randomUUID(), usuarioId);
  }

  agregarItem(producto: Producto, cantidad: number): void {
    if (this.estado !== 'pendiente') {
      throw new Error('No se pueden agregar items a un pedido en curso');
    }
    if (cantidad <= 0) throw new Error('Cantidad debe ser positiva');

    const existente = this.items.find(i => i.productoId === producto.id);
    if (existente) {
      existente.incrementarCantidad(cantidad);
    } else {
      this.items.push(new PedidoItem(producto, cantidad));
    }
  }

  confirmar(): void {
    if (this.items.length === 0) throw new Error('Pedido vacío no se puede confirmar');
    this.estado = 'confirmado';
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  get eventos(): EventoDeDominio[] {
    return [new PedidoConfirmadoEvent(this.id, this.usuarioId, this.total)];
  }
}

// domain/pedido-item.ts — Entidad interna del agregado
export class PedidoItem {
  public readonly productoId: string;
  public readonly nombre: string;
  private _cantidad: number;
  private _precioUnitario: number;

  constructor(producto: Producto, cantidad: number) {
    this.productoId = producto.id;
    this.nombre = producto.nombre;
    this._precioUnitario = producto.precio;
    this._cantidad = cantidad;
  }

  incrementarCantidad(n: number): void {
    this._cantidad += n;
  }

  get cantidad(): number { return this._cantidad; }
  get precioUnitario(): number { return this._precioUnitario; }
  get subtotal(): number { return this._cantidad * this._precioUnitario; }
}
```

```typescript
// application/use-cases/crear-pedido.use-case.ts
@Injectable()
export class CrearPedidoUseCase {
  constructor(
    private readonly pedidoRepo: PedidoRepository,
    private readonly productoRepo: ProductoRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(dto: CrearPedidoDto): Promise<Pedido> {
    const pedido = Pedido.crear(dto.usuarioId);

    for (const item of dto.items) {
      const producto = await this.productoRepo.findById(item.productoId);
      if (!producto) throw new Error(`Producto ${item.productoId} no encontrado`);
      pedido.agregarItem(producto, item.cantidad);
    }

    pedido.confirmar();
    await this.pedidoRepo.save(pedido);

    for (const evento of pedido.eventos) {
      await this.eventBus.publish(evento);
    }

    return pedido;
  }
}
```

## Ejemplo avanzado

Clean Architecture con **CQRS**, **Event Sourcing** y **casos de uso compuestos**.

<CodeGroup>
<CodeGroupItem title="application/use-cases/registrar-compra-compuesta.ts">

```typescript
// Caso de uso compuesto que orquesta múltiples operaciones
@Injectable()
export class RegistrarCompraUseCase {
  constructor(
    private readonly crearPedido: CrearPedidoUseCase,
    private readonly procesarPago: ProcesarPagoUseCase,
    private readonly actualizarInventario: ActualizarInventarioUseCase,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(dto: RegistrarCompraDto): Promise<ResultadoCompra> {
    // Transacción de dominio
    return this.unitOfWork.execute(async () => {
      // 1. Crear pedido
      const pedido = await this.crearPedido.execute(dto.pedido);

      // 2. Procesar pago
      const pago = await this.procesarPago.execute({
        pedidoId: pedido.id,
        monto: pedido.total,
        metodoPago: dto.metodoPago,
      });

      // 3. Actualizar inventario
      await this.actualizarInventario.execute({
        pedidoId: pedido.id,
        items: dto.pedido.items,
      });

      return { pedidoId: pedido.id, pagoId: pago.id, total: pago.monto };
    });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="infrastructure/persistence/unit-of-work.ts">

```typescript
// Adaptador de Unit of Work con TypeORM
@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWork {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async execute<T>(work: () => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await work();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="infrastructure/decorators/use-case.decorator.ts">

```typescript
// Decorador para logging automático en casos de uso
export function UseCase(): ClassDecorator {
  return (target: any) => {
    Injectable()(target);
    const originalMethods = Object.getOwnPropertyNames(target.prototype)
      .filter(p => p !== 'constructor' && typeof target.prototype[p] === 'function');

    for (const method of originalMethods) {
      const original = target.prototype[method];
      target.prototype[method] = async function (...args: any[]) {
        const start = Date.now();
        console.log(`[UseCase] ${target.name}.${method} iniciado`);
        try {
          const result = await original.apply(this, args);
          console.log(`[UseCase] ${target.name}.${method} completado en ${Date.now() - start}ms`);
          return result;
        } catch (error) {
          console.error(`[UseCase] ${target.name}.${method} falló:`, error);
          throw error;
        }
      };
    }
  };
}

// Uso:
@UseCase()
export class CrearUsuarioUseCase {
  async execute(dto: CrearUsuarioDto): Promise<Usuario> { /* ... */ }
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema bancario con Clean Architecture — transferencias entre cuentas.

```
ESTRUCTURA COMPLETA DEL SISTEMA BANCARIO
─────────────────────────────────────────────────────────

src/
  domain/
    entities/
      cuenta.ts                    # Agregado raíz
      transaccion.ts               # Entidad
    value-objects/
      monto.ts                     # Value Object con moneda
      numero-cuenta.ts             # Value Object
      tipo-transaccion.ts          # Enum value object
    repositories/
      cuenta.repository.ts         # Puerto
    events/
      transferencia-realizada.event.ts
      saldo-insuficiente.event.ts
    services/
      calculador-comisiones.ts     # Servicio de dominio

  application/
    use-cases/
      realizar-transferencia.use-case.ts
      obtener-movimientos.use-case.ts
      crear-cuenta.use-case.ts
    ports/
      output/
        notificador-banco.ts
        auditoria.ts
        alerta-fraude.ts
    dtos/
      realizar-transferencia.dto.ts
      respuesta-transferencia.dto.ts

  infrastructure/
    persistence/
      typeorm/
        entities/
          cuenta.entity.ts
          transaccion.entity.ts
        repositories/
          cuenta.repository.impl.ts
    adapters/
      notificaciones/
        email-notifier.ts
        sms-notifier.ts
      auditoria/
        elastic-audit.ts
      anti-fraude/
        fraude-detector.ts
    nestjs/
      controllers/
        cuentas.controller.ts
      guards/
        saldo.guard.ts
    config/
      database.config.ts
```

```typescript
// domain/cuenta.ts — Agregado raíz
export class Cuenta {
  private transacciones: Transaccion[] = [];

  private constructor(
    public readonly numero: NumeroCuenta,
    public readonly titularId: string,
    private _saldo: Monto,
  ) {}

  static abrir(titularId: string, moneda: string): Cuenta {
    return new Cuenta(
      NumeroCuenta.generar(),
      titularId,
      Monto.cero(moneda),
    );
  }

  depositar(monto: Monto, referencia: string): Transaccion {
    if (!monto.esPositivo) throw new Error('Monto debe ser positivo');
    this._saldo = this._saldo.sumar(monto);
    const tx = Transaccion.credito(this.numero, monto, referencia);
    this.transacciones.push(tx);
    return tx;
  }

  retirar(monto: Monto, referencia: string): Transaccion {
    if (!monto.esPositivo) throw new Error('Monto debe ser positivo');
    if (this._saldo.esMenorQue(monto)) {
      throw new Error('Saldo insuficiente');
    }
    this._saldo = this._saldo.restar(monto);
    const tx = Transaccion.debito(this.numero, monto, referencia);
    this.transacciones.push(tx);
    return tx;
  }

  transferir(monto: Monto, destino: Cuenta, referencia: string): TransferenciaResultado {
    const debito = this.retirar(monto, `TRANSFERENCIA: ${referencia}`);
    const credito = destino.depositar(monto, `TRANSFERENCIA: ${referencia}`);
    return { debito, credito, saldoOrigen: this._saldo, saldoDestino: destino._saldo };
  }

  get saldo(): Monto { return this._saldo; }
}
```

## Buenas prácticas

### 1. El dominio NO debe importar nada de infraestructura

```typescript
// ✅ Bien: dominio puro
export class Usuario {
  constructor(public readonly id: string, public readonly nombre: string) {}
}

// ❌ Mal: dominio depende de TypeORM
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: string;
  // ...
}
```

### 2. Usa inyección de dependencias para conectar capas

```typescript
// En el módulo, conectas puertos con adaptadores
@Module({
  providers: [
    CrearUsuarioUseCase,
    { provide: UsuarioRepository, useClass: UsuarioRepositoryImpl },  // Puerto → Adaptador
    { provide: EmailNotifier, useClass: MailgunNotifier },
  ],
})
export class UsuariosModule {}
```

### 3. Los Value Objects son inmutables

```typescript
export class Monto {
  private constructor(public readonly valor: number, public readonly moneda: string) {}

  static crear(valor: number, moneda: string): Monto {
    if (valor < 0) throw new Error('Monto no puede ser negativo');
    return new Monto(valor, moneda);
  }

  sumar(otro: Monto): Monto {
    if (this.moneda !== otro.moneda) throw new Error('Monedas diferentes');
    return new Monto(this.valor + otro.valor, this.moneda);
  }

  get esPositivo(): boolean { return this.valor > 0; }
  esMenorQue(otro: Monto): boolean { return this.valor < otro.valor; }
}
```

### 4. Casos de uso: un solo propósito, un solo `execute()`

```typescript
// ✅ Bien: cada caso de uso hace una cosa
class CrearUsuarioUseCase { execute(dto: CrearUsuarioDto): Promise<Usuario> }
class ActualizarPerfilUseCase { execute(dto: ActualizarPerfilDto): Promise<Usuario> }
class EliminarUsuarioUseCase { execute(id: string): Promise<void> }

// ❌ Mal: caso de uso con múltiples responsabilidades
class UsuarioService {
  crear(dto: any): Promise<any>;
  actualizar(id: string, dto: any): Promise<any>;
  eliminar(id: string): Promise<any>;
  obtenerTodos(): Promise<any[]>;
}
```

### 5. Mapea entre capas con métodos explícitos

```typescript
// En cada adaptador, métodos de mapeo
class UsuarioRepositoryImpl implements UsuarioRepository {
  private toEntity(domain: Usuario): UsuarioEntity { /* ... */ }
  private toDomain(entity: UsuarioEntity): Usuario { /* ... */ }
}
```

### 6. Prueba casos de uso sin infraestructura

```typescript
describe('CrearUsuarioUseCase', () => {
  let useCase: CrearUsuarioUseCase;
  let mockRepo: jest.Mocked<UsuarioRepository>;
  let mockNotifier: jest.Mocked<EmailNotifier>;

  beforeEach(() => {
    mockRepo = { save: jest.fn(), findByEmail: jest.fn().mockResolvedValue(null) };
    mockNotifier = { enviarBienvenida: jest.fn() };
    useCase = new CrearUsuarioUseCase(mockRepo, mockNotifier);
  });

  it('debe crear un usuario con email válido', async () => {
    const usuario = await useCase.execute({ nombre: 'Ana', email: 'ana@email.com' });
    expect(usuario.nombre).toBe('Ana');
    expect(mockRepo.save).toHaveBeenCalled();
    expect(mockNotifier.enviarBienvenida).toHaveBeenCalled();
  });
});
```

## Errores comunes

### 1. Poner lógica de negocio en controladores o servicios de NestJS

```typescript
// ❌ Error: lógica de negocio en el controlador
@Controller('usuarios')
export class UsuariosController {
  @Post()
  async crear(@Body() dto: any) {
    if (!dto.email || !dto.email.includes('@')) throw new BadRequestException();
    // ...
  }
}

// ✅ Correcto: el controlador solo delega
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly crearUsuario: CrearUsuarioUseCase) {}

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    return this.crearUsuario.execute(dto);
  }
}
```

### 2. Entidades de TypeORM como entidades de dominio

```typescript
// ❌ Error: entidad de dominio con decoradores de BD
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;
}

// ✅ Correcto: entidad de dominio pura, entity ORM separada
// domain/usuario.ts
export class Usuario {
  constructor(public readonly id: string, public readonly nombre: string) {}
}

// infrastructure/entities/usuario.entity.ts
@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
```

### 3. Dependencias circulares entre capas

```typescript
// ❌ Error: dominio importa de infraestructura
// domain/usuario.ts
import { IsEmail } from 'class-validator';  // Clase de infraestructura
export class Usuario { /* ... */ }

// ✅ Correcto: dominio no sabe de validación externa
export class Email {
  static crear(valor: string): Email {
    if (!valor.includes('@')) throw new Error('Email inválido');
    return new Email(valor);
  }
}
```

### 4. Crear casos de uso demasiado grandes

```typescript
// ❌ Error: caso de uso que hace demasiadas cosas
async execute(dto: any) {
  // Validar
  // Crear usuario
  // Enviar email
  // Actualizar inventario
  // Notificar a admin
  // Generar reporte
  // Loggear auditoría
}

// ✅ Correcto: cada responsabilidad es un caso de uso
await this.crearUsuario.execute(dto);
await this.notificarBienvenida.execute(usuario);
// El orquestador (caso de uso compuesto) los coordina
```

### 5. Ignorar el Unit of Work para operaciones que afectan múltiples agregados

```typescript
// ❌ Error: operaciones sin transacción
async execute(dto: any) {
  await this.cuentaRepo.debitar(origen, monto);
  // Si algo falla aquí, el débito ya se hizo
  await this.cuentaRepo.acreditar(destino, monto);
}

// ✅ Correcto: Unit of Work
async execute(dto: any) {
  return this.unitOfWork.execute(async () => {
    await this.cuentaRepo.debitar(origen, monto);
    await this.cuentaRepo.acreditar(destino, monto);
  });
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **DDD** | Clean Architecture y DDD son complementarios. DDD define el lenguaje y los límites del dominio; Clean Architecture organiza las capas. |
| **CQRS** | Separa lecturas y escrituras. Los casos de uso de escritura (commands) usan el modelo de dominio; los de lectura (queries) usan proyecciones. |
| **Módulos de NestJS** | Los módulos conectan las capas: registran controladores (infraestructura), casos de uso (aplicación) y adaptadores (infraestructura) como providers. |
| **Inyección de dependencias** | Es el pegamento que une puertos con adaptadores sin que el dominio sepa qué implementación se usa. |
| **Pruebas** | La capa de aplicación y dominio se prueban con mocks (unit tests). Los adaptadores se prueban con integration tests. |
| **Microservicios** | Cada microservicio puede tener su propia Clean Architecture. Los bounded contexts de DDD son excelentes candidatos para microservicios. |
| **Eventos** | Los eventos de dominio permiten comunicación entre agregados sin acoplamiento, respetando la regla de dependencias. |

## Resumen

- **Clean Architecture** organiza el código en 4 capas: Dominio, Aplicación, Adaptadores e Infraestructura.
- La **regla de dependencias** dice que solo se puede depender hacia adentro: Infraestructura → Aplicación → Dominio.
- El **dominio** contiene entidades, value objects, repositorios (puertos) y servicios de dominio — **sin dependencias externas**.
- La **aplicación** contiene casos de uso y DTOs — orquesta el flujo usando puertos del dominio.
- La **infraestructura** implementa los puertos con TypeORM, Redis, APIs externas, etc.
- Los **controladores de NestJS** son adaptadores de entrada (infraestructura).
- La **inyección de dependencias** conecta las capas sin acoplamiento.
- **Beneficios**: testeabilidad, independencia de frameworks, mantenibilidad a largo plazo.
- **Coste**: más archivos, más boilerplate, más disciplina. Para proyectos pequeños puede ser excesivo.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la regla fundamental de Clean Architecture?</summary>

**Respuesta:** Las dependencias solo pueden ir hacia adentro. El dominio no sabe nada de infraestructura. Los cambios en frameworks o bases de datos no afectan las reglas de negocio.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿En qué capa va un controlador de NestJS?</summary>

**Respuesta:** En infraestructura. Los controladores son adaptadores de entrada que convierten peticiones HTTP en llamadas a casos de uso de la capa de aplicación.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Dónde deben ir las entidades de TypeORM (con decoradores @Entity, @Column)?</summary>

**Respuesta:** En la capa de infraestructura, separadas de las entidades de dominio. La entidad de dominio es un objeto plano de negocio; la entidad TypeORM es el mapeo a la base de datos.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo se conectan los puertos (interfaces del dominio) con los adaptadores (implementaciones)?</summary>

**Respuesta:** Mediante inyección de dependencias en los módulos de NestJS: `{ provide: UsuarioRepository, useClass: UsuarioRepositoryImpl }`. El caso de uso recibe la abstracción, no la implementación concreta.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cuándo NO deberías usar Clean Architecture?</summary>

**Respuesta:** En proyectos muy pequeños (CRUD simple, prototipos, MVPs), scripts o herramientas internas donde el overhead de capas no se justifica. Para aplicaciones empresariales que evolucionarán durante años, es casi siempre la mejor opción.
</details>
