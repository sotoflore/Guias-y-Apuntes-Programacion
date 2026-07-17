---
title: Domain-Driven Design (DDD)
description: Aprende Domain-Driven Design en NestJS, entidades, value objects, agregados, repositorios, servicios de dominio, eventos, bounded contexts y cómo implementar DDD paso a paso.
---

# Domain-Driven Design (DDD) en NestJS

DDD (Domain-Driven Design) es como **aprender el idioma de un negocio antes de programarlo**: no preguntas "¿qué tablas necesito?", preguntas "¿cómo habla el negocio sobre sí mismo?".

## ¿Qué es?

Domain-Driven Design (Diseño Guiado por el Dominio) es una metodología de desarrollo de software creada por **Eric Evans** que pone el **modelo del dominio** en el centro de todo. En lugar de empezar por la base de datos o las rutas HTTP, empiezas por entender el negocio y representar sus conceptos en código.

```typescript
// DDD: el código habla el lenguaje del negocio
export class Carrito {
  private items: CarritoItem[] = [];

  agregarProducto(producto: Producto, cantidad: number): void {
    const existente = this.items.find(i => i.productoId === producto.id);
    if (existente) {
      existente.incrementarCantidad(cantidad);
    } else {
      this.items.push(new CarritoItem(producto, cantidad));
    }
  }

  calcularTotal(): Monto {
    return this.items.reduce((total, item) => total.sumar(item.subtotal), Monto.cero('USD'));
  }
}
```

## ¿Por qué es importante?

DDD importa porque el **mayor desafío del software no es técnico, sino entender el negocio**.

- **Lenguaje ubicuo**: Todos (devs, stakeholders, negocio) hablan el mismo idioma.
- **Modelo rico**: El código refleja reglas de negocio reales, no solo operaciones CRUD.
- **Mantenibilidad**: Los cambios de negocio se traducen directamente a cambios en el modelo.
- **Alineamiento negocio-técnica**: Lo que dice el negocio está en el código, sin traducción.
- **Escalabilidad cognitiva**: Cada bounded context es un mundo manejable.

:::tip
DDD no es una arquitectura, es una **forma de pensar**. Clean Architecture y DDD se complementan: DDD te dice cómo modelar, Clean Architecture te dice dónde poner cada cosa.
:::

## Problema que resuelve

Sin DDD, el código tiende a ser anémico y desalineado con el negocio:

```typescript
// ❌ Código anémico: la entidad es solo un contenedor de datos
export class Pedido {
  id: number;
  usuarioId: number;
  total: number;
  estado: string;
  items: PedidoItem[];
  createdAt: Date;
}

// ❌ La lógica de negocio está dispersa en servicios
@Injectable()
export class PedidoService {
  async confirmarPedido(pedidoId: number) {
    const pedido = await this.pedidoRepo.findOne(pedidoId);
    // Lógica de negocio FUERA de la entidad
    if (pedido.estado !== 'pendiente') throw new BadRequestException();
    if (pedido.items.length === 0) throw new BadRequestException('Pedido vacío');
    pedido.estado = 'confirmado';
    pago.total = pedido.items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    await this.pedidoRepo.save(pedido);
  }
}
```

Con DDD, la entidad misma protege sus reglas:

```typescript
// ✅ DDD: la entidad tiene comportamiento y protege sus invariantes
export class Pedido {
  private readonly items: PedidoItem[] = [];
  private _estado: EstadoPedido = 'pendiente';

  constructor(public readonly id: string, public readonly usuarioId: string) {}

  agregarItem(producto: Producto, cantidad: number): void {
    if (this._estado !== 'pendiente') {
      throw new Error('No puedes modificar un pedido confirmado');
    }
    const existente = this.items.find(i => i.productoId === producto.id);
    if (existente) {
      existente.incrementarCantidad(cantidad);
    } else {
      this.items.push(new CarritoItem(producto, cantidad));
    }
  }

  confirmar(): void {
    if (this.items.length === 0) throw new Error('Pedido vacío no se puede confirmar');
    if (this._estado !== 'pendiente') throw new Error('El pedido ya fue procesado');
    this._estado = 'confirmado';
  }

  get total(): Monto { /* calculado desde los items */ }
  get estado(): EstadoPedido { return this._estado; }
}
```

## Cómo funciona

### Bloques de construcción de DDD

```
┌─────────────────────────────────────────────────┐
│              BOUNDED CONTEXT                     │
│  (Contexto delimitado: "Ventas")                │
│  ┌─────────────────────────────────────────┐    │
│  │           LENGUAJE UBICUO               │    │
│  │  (Todos hablan de "Pedido", "Carrito",  │    │
│  │   "Producto", "Stock", "Pago")          │    │
│  ├─────────────────────────────────────────┤    │
│  │  ENTIDADES ─── AGREGADOS               │    │
│  │  (tienen ID)   (unidad transaccional)   │    │
│  │  Pedido ────── Pedido (raíz)            │    │
│  │  Usuario      CarritoItem               │    │
│  │  Producto                               │    │
│  ├─────────────────────────────────────────┤    │
│  │  VALUE OBJECTS       SERVICIOS DOMINIO  │    │
│  │  (sin identidad)     (operaciones sin   │    │
│  │  Email, Monto,       entidad natural)   │    │
│  │  Direccion, RUT      CalculadorImpuestos│    │
│  ├─────────────────────────────────────────┤    │
│  │  EVENTOS DE DOMINIO   REPOSITORIOS      │    │
│  │  PedidoConfirmado     PedidoRepository  │    │
│  │  StockInsuficiente    ProductoRepository│    │
│  └─────────────────────────────────────────┘    │
│                                       │
│  FABRICAS ─── Crean objetos complejos  │
│  PedidoFactory                         │
└─────────────────────────────────────────────────┘
```

### Conceptos fundamentales

| Concepto | Descripción | Ejemplo |
|---|---|---|
| **Entidad** | Objeto con identidad única y ciclo de vida | `Usuario(id, nombre, email)` |
| **Value Object** | Objeto sin identidad, definido por sus atributos | `Email("a@b.com)`, `Monto(100, "USD")` |
| **Agregado** | Grupo de entidades tratado como unidad transaccional | `Pedido` + `PedidoItem` |
| **Raíz del Agregado** | Única entidad que expone el agregado al exterior | `Pedido` |
| **Evento de Dominio** | Algo que pasó en el dominio y otros deben saber | `PedidoConfirmado` |
| **Repositorio** | Colección de agregados (persistencia) | `PedidoRepository` |
| **Servicio de Dominio** | Operación que no pertenece naturalmente a una entidad | `CalculadorDeImpuestos` |
| **Fábrica** | Encapsula creación compleja de objetos | `PedidoFactory` |
| **Bounded Context** | Límite explícito de un modelo de dominio | "Ventas", "Inventario", "Facturación" |

## Sintaxis

### Entidad

```typescript
export class Usuario {
  // Private setter para proteger invariantes
  private _nombre: string;

  constructor(
    public readonly id: string,  // Identidad (readonly)
    nombre: string,
    public readonly email: Email,
  ) {
    this._nombre = this.validarNombre(nombre);
  }

  // Comportamiento (no solo getters/setters)
  cambiarNombre(nuevoNombre: string): void {
    this._nombre = this.validarNombre(nuevoNombre);
  }

  private validarNombre(nombre: string): string {
    if (nombre.trim().length < 2) throw new Error('Nombre muy corto');
    return nombre.trim();
  }

  get nombre(): string { return this._nombre; }
}
```

### Value Object

```typescript
export class Direccion {
  constructor(
    public readonly calle: string,
    public readonly ciudad: string,
    public readonly codigoPostal: string,
    public readonly pais: string,
  ) {}

  // Los VO se comparan por valor, no por identidad
  equals(other: Direccion): boolean {
    return this.calle === other.calle
      && this.ciudad === other.ciudad
      && this.codigoPostal === other.codigoPostal
      && this.pais === other.pais;
  }
}
```

### Agregado

```typescript
export class Pedido {
  // Solo la raíz del agregado es accesible desde fuera
  public readonly id: string;
  private _items: PedidoItem[] = [];
  private _estado: EstadoPedido = 'pendiente';
  private _creadoEn: Date;

  constructor(id: string, public readonly usuarioId: string) {
    this.id = id;
    this._creadoEn = new Date();
  }

  agregarItem(producto: Producto, cantidad: number): void {
    if (this._estado !== 'pendiente') throw new Error('Pedido cerrado');
    this._items.push(new PedidoItem(producto, cantidad));
  }

  confirmar(): void {
    if (this._items.length === 0) throw new Error('Pedido vacío');
    this._estado = 'confirmado';
  }

  get items(): ReadonlyArray<PedidoItem> { return this._items; }
  get estado(): EstadoPedido { return this._estado; }
}
```

### Evento de Dominio

```typescript
export abstract class EventoDeDominio {
  public readonly ocurrioEn: Date = new Date();
  public readonly eventId: string = crypto.randomUUID();

  constructor(public readonly aggregateId: string) {}
}

export class PedidoConfirmado extends EventoDeDominio {
  constructor(
    pedidoId: string,
    public readonly usuarioId: string,
    public readonly total: number,
  ) {
    super(pedidoId);
  }
}
```

## Ejemplo básico

Sistema de biblioteca con DDD.

<CodeGroup>
<CodeGroupItem title="domain/libro.ts">

```typescript
// Entidad
export class Libro {
  constructor(
    public readonly isbn: Isbn,
    public readonly titulo: string,
    public readonly autor: string,
    private _disponible: boolean = true,
  ) {}

  prestar(): void {
    if (!this._disponible) throw new Error('Libro no disponible');
    this._disponible = false;
  }

  devolver(): void {
    if (this._disponible) throw new Error('Libro no estaba prestado');
    this._disponible = true;
  }

  get disponible(): boolean { return this._disponible; }
}
```

</CodeGroupItem>

<CodeGroupItem title="domain/isbn.ts">

```typescript
// Value Object
export class Isbn {
  private constructor(public readonly value: string) {}

  static crear(valor: string): Isbn {
    const limpio = valor.replace(/[-\s]/g, '');
    if (!/^\d{13}$/.test(limpio)) {
      throw new Error('ISBN debe tener 13 dígitos');
    }
    return new Isbn(limpio);
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="domain/prestamo.ts">

```typescript
// Agregado raíz
export class Prestamo {
  public readonly id: string;
  private _fechaDevolucion?: Date;
  private _estado: 'activo' | 'devuelto' = 'activo';

  constructor(
    public readonly libroIsbn: Isbn,
    public readonly usuarioId: string,
    public readonly fechaPrestamo: Date = new Date(),
  ) {
    this.id = crypto.randomUUID();
  }

  registrarDevolucion(): void {
    if (this._estado === 'devuelto') throw new Error('Ya fue devuelto');
    this._estado = 'devuelto';
    this._fechaDevolucion = new Date();
  }

  get estaAtrasado(): boolean {
    const diasPrestamo = 14;
    const diff = Date.now() - this.fechaPrestamo.getTime();
    return this._estado === 'activo' && diff > diasPrestamo * 24 * 60 * 60 * 1000;
  }

  get estado(): string { return this._estado; }
}
```

</CodeGroupItem>

<CodeGroupItem title="domain/repositories/prestamo.repository.ts">

```typescript
export abstract class PrestamoRepository {
  abstract save(prestamo: Prestamo): Promise<void>;
  abstract findActivosByUsuario(usuarioId: string): Promise<Prestamo[]>;
  abstract findActivoByIsbn(isbn: Isbn): Promise<Prestamo | null>;
}
```

</CodeGroupItem>

<CodeGroupItem title="application/use-cases/prestar-libro.use-case.ts">

```typescript
@Injectable()
export class PrestarLibroUseCase {
  constructor(
    private readonly libroRepo: LibroRepository,
    private readonly prestamoRepo: PrestamoRepository,
  ) {}

  async execute(dto: PrestarLibroDto): Promise<void> {
    const isbn = Isbn.crear(dto.isbn);
    const libro = await this.libroRepo.findByIsbn(isbn);

    if (!libro) throw new Error('Libro no encontrado');
    if (!libro.disponible) throw new Error('Libro no disponible');

    const prestamo = new Prestamo(isbn, dto.usuarioId);
    libro.prestar();

    await this.libroRepo.save(libro);
    await this.prestamoRepo.save(prestamo);
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Sistema de e-commerce con múltiples agregados, eventos y servicios de dominio.

```typescript
// domain/value-objects/dinero.ts
export class Dinero {
  private constructor(
    public readonly monto: number,
    public readonly moneda: string,
  ) {}

  static crear(monto: number, moneda: string = 'CLP'): Dinero {
    if (monto < 0) throw new Error('Monto no puede ser negativo');
    if (monto > 1_000_000_000) throw new Error('Monto excede el máximo');
    return new Dinero(Math.round(monto * 100) / 100, moneda);
  }

  sumar(otro: Dinero): Dinero {
    this.validarMismaMoneda(otro);
    return Dinero.crear(this.monto + otro.monto, this.moneda);
  }

  aplicarDescuento(porcentaje: number): Dinero {
    if (porcentaje < 0 || porcentaje > 100) throw new Error('Porcentaje inválido');
    return Dinero.crear(this.monto * (1 - porcentaje / 100), this.moneda);
  }

  private validarMismaMoneda(otro: Dinero): void {
    if (this.moneda !== otro.moneda) throw new Error('Monedas diferentes');
  }
}

// domain/services/calculador-impuestos.ts — Servicio de dominio
export class CalculadorImpuestos {
  private readonly tasas: Map<string, number> = new Map([
    ['CL', 0.19],  // Chile: 19% IVA
    ['AR', 0.21],  // Argentina: 21% IVA
    ['MX', 0.16],  // México: 16% IVA
    ['CO', 0.19],  // Colombia: 19% IVA
  ]);

  calcular(monto: Dinero, pais: string): Dinero {
    const tasa = this.tasas.get(pais) ?? 0;
    return Dinero.crear(monto.monto * tasa, monto.moneda);
  }
}
```

```typescript
// domain/events/pedido-confirmado.event.ts
export class PedidoConfirmadoEvent extends EventoDeDominio {
  static readonly NOMBRE = 'pedido.confirmado';

  constructor(
    pedidoId: string,
    public readonly usuarioId: string,
    public readonly total: Dinero,
    public readonly items: ReadonlyArray<{ productoId: string; cantidad: number }>,
  ) {
    super(pedidoId);
  }
}

// application/use-cases/confirmar-pedido.use-case.ts
@Injectable()
export class ConfirmarPedidoUseCase {
  constructor(
    private readonly pedidoRepo: PedidoRepository,
    private readonly eventBus: NestEventBus,
  ) {}

  async execute(pedidoId: string): Promise<void> {
    const pedido = await this.pedidoRepo.findById(pedidoId);
    if (!pedido) throw new Error('Pedido no encontrado');

    pedido.confirmar();  // ← La entidad validó las reglas de negocio
    await this.pedidoRepo.save(pedido);

    // Publicar evento para que otros contextos reaccionen
    await this.eventBus.publish(
      new PedidoConfirmadoEvent(
        pedido.id,
        pedido.usuarioId,
        pedido.total,
        pedido.items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad })),
      ),
    );
  }
}
```

## Ejemplo avanzado

DDD con **Bounded Contexts**, **eventos de integración** entre contextos, **fábricas** y **sagas**.

```
BOUNDED CONTEXTS DEL SISTEMA
─────────────────────────────────────────────────────────

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│    VENTAS        │    │   INVENTARIO     │    │   FACTURACIÓN   │
│                  │    │                  │    │                  │
│  Pedido          │    │  Producto        │    │  Factura         │
│  Carrito         │    │  Stock           │    │  Boleta          │
│  Checkout        │    │  Almacén         │    │  Pago            │
│                  │    │                  │    │                  │
│ Eventos:         │    │ Eventos:         │    │ Eventos:         │
│ • PedidoCreado   │───▶│ • StockReservado │───▶│ • FacturaEmitida │
│ • PedidoPagado   │    │ • StockAgotado   │    │ • PagoRechazado  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
        │                       │                        │
        └───────────────────────┼────────────────────────┘
                                ▼
                    ┌──────────────────────┐
                    │   NOTIFICACIONES     │
                    │                      │
                    │  Email, SMS, Push    │
                    │  Escucha eventos     │
                    │  de todos los CTX    │
                    └──────────────────────┘
```

<CodeGroup>
<CodeGroupItem title="ventas/domain/pedido.factory.ts">

```typescript
// Fábrica: encapsula creación compleja de agregados
@Injectable()
export class PedidoFactory {
  crear(dto: CrearPedidoDto): Pedido {
    const pedido = new Pedido(crypto.randomUUID(), dto.usuarioId);

    for (const item of dto.items) {
      pedido.agregarItem(
        item.productoId,
        item.nombre,
        Dinero.crear(item.precio, dto.moneda),
        item.cantidad,
      );
    }

    return pedido;
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="ventas/application/sagas/checkout.saga.ts">

```typescript
// Saga: orquesta procesos multi-contexto
@Injectable()
export class CheckoutSaga {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  @Saga()
  procesar = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PedidoConfirmadoEvent),
      switchMap(event => {
        // Secuencia de comandos entre contextos
        return concat(
          // 1. Reservar stock en Inventario
          new ReservarStockCommand(event.aggregateId, event.items),
          // 2. Crear factura en Facturación
          new EmitirFacturaCommand(event.aggregateId, event.usuarioId, event.total),
          // 3. Notificar al usuario
          new NotificarPedidoConfirmadoCommand(event.usuarioId, event.aggregateId),
        );
      }),
    );
  };
}
```

</CheckoutSaga>

</CodeGroupItem>

<CodeGroupItem title="inventario/application/event-handlers/reservar-stock.handler.ts">

```typescript
// Handler de evento de integración (escucha de otro bounded context)
@EventHandler(PedidoConfirmadoEvent)
export class ReservarStockHandler {
  constructor(private readonly stockRepo: StockRepository) {}

  async handle(event: PedidoConfirmadoEvent): Promise<void> {
    for (const item of event.items) {
      const stock = await this.stockRepo.findByProducto(item.productoId);
      if (!stock || stock.cantidadDisponible < item.cantidad) {
        throw new Error(`Stock insuficiente para producto ${item.productoId}`);
      }
      stock.reservar(item.cantidad);
      await this.stockRepo.save(stock);
    }
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema bancario con DDD: múltiples bounded contexts, agregados complejos y eventos.

```
BOUNDED CONTEXTS DEL SISTEMA BANCARIO
─────────────────────────────────────────────────────────

┌──────────────────────┐   ┌──────────────────────────┐
│   CUENTAS            │   │   TRANSACCIONES          │
│                      │   │                          │
│  Agregados:          │   │  Agregados:              │
│  • Cuenta (raíz)     │   │  • Transferencia         │
│  • Titular           │   │  • Deposito              │
│                      │   │  • Retiro                │
│  Reglas:             │   │                          │
│  • Saldo no negativo │   │  Eventos:                │
│  • Máx 3 cuentas     │   │  • TransferenciaRealizada│
│    por persona       │   │  • DepositoRecibido      │
│                      │   │  • SaldoInsuficiente     │
└──────────┬───────────┘   └───────────┬──────────────┘
           │                           │
           └───────────┬───────────────┘
                       ▼
          ┌──────────────────────────────┐
          │   NOTIFICACIONES             │
          │                              │
          │  Escucha eventos:            │
          │  • Transferencia → Email/TX  │
          │  • Deposito → Notif push     │
          │  • Alerta fraude → SMS       │
          └──────────────────────────────┘
```

```typescript
// cuentas/domain/cuenta.ts
export class Cuenta {
  constructor(
    public readonly id: string,
    public readonly titularId: string,
    private _saldo: Dinero,
    public readonly moneda: string,
    private _activa: boolean = true,
  ) {}

  depositar(monto: Dinero): void {
    this.asegurarActiva();
    this._saldo = this._saldo.sumar(monto);
  }

  retirar(monto: Dinero): void {
    this.asegurarActiva();
    if (this._saldo.monto < monto.monto) {
      throw new Error('Saldo insuficiente');
    }
    this._saldo = new Dinero(this._saldo.monto - monto.monto, this._saldo.moneda);
  }

  transferir(monto: Dinero, destino: Cuenta, concepto: string): Transferencia {
    this.retirar(monto);
    destino.depositar(monto);
    return new Transferencia(crypto.randomUUID(), this.id, destino.id, monto, concepto);
  }

  private asegurarActiva(): void {
    if (!this._activa) throw new Error('Cuenta desactivada');
  }

  get saldo(): Dinero { return this._saldo; }
  get activa(): boolean { return this._activa; }
}
```

## Buenas prácticas

### 1. Define el lenguaje ubicuo con el negocio

```typescript
// ❌ Mal: jerga técnica en lugar de lenguaje de negocio
class OrderEntity {
  status: number;  // 0=pendiente, 1=ok, 2=cancelado
}

// ✅ Bien: el código habla como el negocio
class Pedido {
  private _estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
}
```

### 2. Los agregados deben ser pequeños y cohesivos

Un agregado debe contener solo lo necesario para mantener sus invariantes. Si un `Pedido` tiene 20 colecciones anidadas, probablemente estás modelando mal.

```typescript
// ✅ Bien: agregado pequeño
class Pedido {
  items: PedidoItem[];      // Solo lo necesario
  estado: EstadoPedido;
  total(): Dinero;
  confirmar(): void;
}

// ❌ Mal: el pedido no necesita saber del historial de navegación
class Pedido {
  items: PedidoItem[];
  historialNavegacion: PaginaVisitada[];  // ← Esto va en otro contexto
  cuponesAplicados: Cupon[];              // ← Esto va en "Marketing"
}
```

### 3. Persiste solo la raíz del agregado

```typescript
// ✅ Bien: solo el repositorio del agregado raíz
class PedidoRepository {
  save(pedido: Pedido): Promise<void>;  // PedidoItem se guarda dentro
  findById(id: string): Promise<Pedido>;
}

// ❌ Mal: repositorio para una entidad interna
class PedidoItemRepository {  // No tiene sentido fuera del agregado
  save(item: PedidoItem): Promise<void>;
}
```

### 4. Los eventos de dominio son inmutables y nombrados en pasado

```typescript
// ✅ Bien: nombre en pasado (ya ocurrió)
class PedidoConfirmado extends EventoDeDominio {}
class UsuarioRegistrado extends EventoDeDominio {}
class StockReservado extends EventoDeDominio {}

// ❌ Mal: nombre en infinitivo
class ConfirmarPedido {}       // ← Suena a comando, no a evento
class RegistrarUsuario {}      // ← Suena a caso de uso
```

### 5. Value Objects inmutables y sin identidad

```typescript
// ✅ Bien: inmutable, se reemplaza no se modifica
const direccion1 = new Direccion('Calle 123', 'Santiago');
const direccion2 = new Direccion('Calle 456', 'Valparaíso');

// ❌ Mal: value object mutable (pierde el sentido)
class Direccion {
  set calle(nueva: string) { this._calle = nueva; }  // No debería mutarse
}
```

## Errores comunes

### 1. Entidades anémicas (solo getters/setters, sin comportamiento)

```typescript
// ❌ Error: entidad anémica
class Pedido {
  id: number;
  items: PedidoItem[];
  estado: string;
  // Sin métodos de negocio
}

// ✅ Correcto: entidad con comportamiento
class Pedido {
  agregarItem(producto: Producto, cantidad: number): void { /* reglas aquí */ }
  confirmar(): void { /* reglas aquí */ }
  cancelar(motivo: string): void { /* reglas aquí */ }
}
```

### 2. Ignorar los Bounded Contexts

```typescript
// ❌ Error: modelo "Usuario" gigante que sirve para todo
class Usuario {
  // Ventas
  direccionEnvio: Direccion;
  metodoPagoPreferido: string;

  // Facturación
  rut: string;
  razonSocial: string;

  // Marketing
  preferenciasEmail: string[];
  historialCompras: Compra[];

  // Soporte
  ticketsAbiertos: Ticket[];
}

// ✅ Correcto: cada contexto tiene su versión de Usuario
// contextos/ventas/domain/cliente.ts
class Cliente {
  id: string;
  direccionEnvio: Direccion;
}

// contextos/facturacion/domain/contribuyente.ts
class Contribuyente {
  id: string;
  rut: string;
  razonSocial: string;
}
```

### 3. Exponer colecciones internas del agregado como mutables

```typescript
// ❌ Error: colección expuesta mutable
class Pedido {
  items: PedidoItem[];  // Código externo puede hacer push directamente
}

// ✅ Correcto: solo lectura y métodos controlados
class Pedido {
  private readonly _items: PedidoItem[] = [];

  get items(): ReadonlyArray<PedidoItem> { return this._items; }
  agregarItem(productoId: string, cantidad: number): void { /* validación */ }
}
```

### 4. Poner lógica de dominio en servicios de aplicación

```typescript
// ❌ Error: lógica de dominio en el caso de uso
async confirmarPedido(pedidoId: string) {
  const pedido = await this.repo.findById(pedidoId);
  if (pedido.estado !== 'pendiente') throw new Error();  // ← Regla de dominio aquí
  pedido.estado = 'confirmado';  // ← Violación: estado debería cambiar via método
}

// ✅ Correcto: la entidad protege sus reglas
async confirmarPedido(pedidoId: string) {
  const pedido = await this.repo.findById(pedidoId);
  pedido.confirmar();  // ← La entidad valida y cambia su estado internamente
  await this.repo.save(pedido);
}
```

### 5. Usar el mismo repositorio para consultas y comandos complejos

```typescript
// ❌ Error: repositorio sobrecargado
class PedidoRepository {
  save(pedido: Pedido): Promise<void>;
  findById(id: string): Promise<Pedido>;
  findPedidosConDescuento(usuarioId: string): Promise<Pedido[]>;  // Consulta compleja
  reporteMensual(fecha: Date): Promise<Reporte>;  // No es responsabilidad del repo
}

// ✅ Correcto: CQRS separa
class PedidoRepository {
  save(pedido: Pedido): Promise<void>;
  findById(id: string): Promise<Pedido>;
}

class PedidoReadModel {
  findPedidosConDescuento(usuarioId: string): Promise<PedidoDto[]>;
  reporteMensual(fecha: Date): Promise<ReporteDto>;
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Clean Architecture** | DDD define el modelo; Clean Architecture organiza las capas. Son complementarios. |
| **CQRS** | Separa comandos (usando el modelo de dominio) de consultas (usando proyecciones planas). |
| **Event Sourcing** | Persiste eventos en lugar de estado. Los eventos de dominio son la fuente de verdad. |
| **Microservicios** | Cada bounded context es un excelente candidato a microservicio. |
| **Módulos de NestJS** | Cada bounded context puede ser un módulo de NestJS. |
| **Inyección de dependencias** | Conecta repositorios (puertos) con sus implementaciones. |
| **Pruebas** | El dominio se prueba sin infraestructura (unit tests). Las reglas de negocio se prueban directamente. |

## Resumen

- **DDD** pone el modelo del negocio en el centro del desarrollo de software.
- **Lenguaje ubicuo**: el código usa las mismas palabras que el negocio.
- **Bounded Context**: cada modelo de dominio tiene un límite explícito y no debe filtrarse a otros contextos.
- **Entidad**: objeto con identidad y ciclo de vida (`Pedido`, `Usuario`).
- **Value Object**: objeto sin identidad, definido por sus valores (`Email`, `Dinero`, `Direccion`).
- **Agregado**: grupo de entidades con una raíz que garantiza las invariantes transaccionales.
- **Evento de Dominio**: algo que ocurrió en el dominio y desencadena reacciones.
- **Repositorio**: interfaz para persistir y recuperar agregados.
- **Servicio de Dominio**: operación que no encaja naturalmente en una entidad.
- **Fábrica**: crea objetos complejos del dominio.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué es el "lenguaje ubicuo" en DDD?</summary>

**Respuesta:** Es el lenguaje común que usan desarrolladores y expertos del negocio para describir el dominio. Todos los términos del código (clases, métodos, variables) deben reflejar este lenguaje. Si el negocio dice "Pedido", el código debe tener `class Pedido`, no `class Order`.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cuál es la diferencia entre una Entidad y un Value Object?</summary>

**Respuesta:** Una entidad tiene **identidad única** y ciclo de vida (dos `Usuario` con mismos datos pero diferente ID son distintos). Un Value Object se define por **sus atributos** y es inmutable (dos `Email("a@b.com")` son iguales y reemplazables).
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué es un Bounded Context?</summary>

**Respuesta:** Es un límite explícito dentro del cual existe un modelo de dominio. Cada contexto tiene su propio lenguaje ubicuo, sus propias entidades y sus propias reglas. Por ejemplo, "Ventas" tiene `Cliente` con dirección de envío; "Facturación" tiene `Contribuyente` con RUT.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué regla debe cumplir un agregado respecto a la persistencia?</summary>

**Respuesta:** Solo la **raíz del agregado** debe tener un repositorio. Las entidades internas del agregado se persisten a través de la raíz. No deben existir repositorios individuales para entidades internas como `PedidoItem`.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Por qué los eventos de dominio se nombran en pasado?</summary>

**Respuesta:** Porque representan algo que **ya ocurrió** en el dominio. No son comandos (instrucciones para hacer algo), sino hechos consumados. `PedidoConfirmado` significa "el pedido ya fue confirmado", no "confirma el pedido". Esto permite que otros componentes reaccionen a lo sucedido.
</details>
