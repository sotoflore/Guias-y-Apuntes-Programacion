---
title: CQRS Pattern en NestJS
description: Aprende CQRS (Command Query Responsibility Segregation) en NestJS, separación de comandos y consultas, buses, handlers, sagas, event sourcing y ejemplos prácticos.
---

# CQRS Pattern en NestJS

CQRS es como **separar la puerta de entrada de la puerta de salida en un supermercado**: las operaciones que cambian el estado (escribir) usan un camino distinto a las operaciones que solo leen datos (consultar).

## ¿Qué es?

**CQRS** (Command Query Responsibility Segregation) es un patrón que separa las operaciones de **lectura** (Queries) de las operaciones de **escritura** (Commands). En lugar de tener un solo modelo para leer y escribir, tienes **dos modelos independientes** optimizados para su propósito.

NestJS proporciona un paquete oficial `@nestjs/cqrs` con buses, handlers, eventos y sagas.

```typescript
// Commands: cambian el estado (escribir)
export class CrearUsuarioCommand {
  constructor(
    public readonly nombre: string,
    public readonly email: string,
  ) {}
}

// Queries: leen datos (no cambian estado)
export class ObtenerUsuarioQuery {
  constructor(public readonly id: string) {}
}
```

## ¿Por qué es importante?

CQRS importa porque **leer no es lo mismo que escribir**, y tratarlos igual crea problemas:

- **Rendimiento**: Las lecturas pueden cachearse y optimizarse sin afectar escrituras.
- **Escalabilidad**: Puedes escalar lecturas y escrituras por separado.
- **Seguridad**: Diferente validación para comandos vs consultas.
- **Mantenibilidad**: Cada modelo se enfoca en su responsabilidad.
- **Trazabilidad**: Cada comando es un objeto explícito que puede loguearse.

:::tip
No necesitas CQRS en proyectos pequeños. El patrón brilla cuando tienes **asimetría entre lecturas y escrituras** — por ejemplo, escribes de una forma pero lees de muchas formas diferentes.
:::

## Problema que resuelve

Sin CQRS, tienes un único modelo que hace todo:

```typescript
// ❌ Modelo único: hace demasiadas cosas
@Injectable()
export class UsuariosService {
  constructor(private readonly repo: UsuarioRepository) {}

  // Comando (escritura)
  async crear(dto: CrearUsuarioDto): Promise<Usuario> { /* ... */ }

  // Consulta (lectura) — misma cadena de DB que escritura
  async obtenerTodos(filtros: any): Promise<Usuario[]> {
    return this.repo.find(filtros);  // Sin caché, sin proyección
  }

  // Otra consulta
  async reporteMensual(): Promise<any> {
    // Consulta pesada que compite con escrituras
    return this.repo.query('SELECT ... JOIN ... GROUP BY ...');
  }

  // Otro comando
  async eliminar(id: string): Promise<void> { /* ... */ }
}
```

Con CQRS, separas los caminos:

```typescript
// ✅ CQRS: comandos y consultas separados

// ===== COMANDOS (Escritura) =====
export class CrearUsuarioCommand {
  constructor(
    public readonly nombre: string,
    public readonly email: string,
  ) {}
}

@CommandHandler(CrearUsuarioCommand)
export class CrearUsuarioHandler implements ICommandHandler<CrearUsuarioCommand> {
  constructor(private readonly repo: UsuarioRepository) {}

  async execute(command: CrearUsuarioCommand): Promise<void> {
    const usuario = Usuario.crear(command.nombre, command.email);
    await this.repo.save(usuario);
  }
}

// ===== CONSULTAS (Lectura) =====
export class ObtenerUsuariosQuery {
  constructor(public readonly page: number, public readonly limit: number) {}
}

@QueryHandler(ObtenerUsuariosQuery)
export class ObtenerUsuariosHandler implements IQueryHandler<ObtenerUsuariosQuery> {
  // Puede usar una proyección optimizada (ReadModel)
  constructor(private readonly proyeccion: UsuarioReadModel) {}

  async execute(query: ObtenerUsuariosQuery): Promise<UsuarioDto[]> {
    return this.proyeccion.obtenerPaginado(query.page, query.limit);
  }
}
```

## Cómo funciona

### Flujo de CQRS en NestJS

```
COMANDO (Escritura):
┌──────────┐    ┌──────────┐    ┌─────────────┐    ┌────────────┐    ┌──────────┐
│          │    │          │    │             │    │            │    │          │
│  Cliente │───▶│ Command  │───▶│ Command     │───▶│ Command    │───▶│ Evento   │
│          │    │ Bus      │    │ Handler     │    │ Modelo     │    │ (post)   │
│  POST    │    │          │    │ (lógica)    │    │ (dominio)  │    │          │
│  /users  │    │          │    │             │    │            │    │          │
└──────────┘    └──────────┘    └─────────────┘    └────────────┘    └──────────┘
                                                                          │
                                                                          ▼
                                                                    ┌──────────────┐
                                                                    │  Se actualiza │
                                                                    │  Read Model   │
                                                                    └──────────────┘

CONSULTA (Lectura):
┌──────────┐    ┌──────────┐    ┌─────────────┐    ┌──────────────────┐
│          │    │          │    │             │    │                  │
│  Cliente │───▶│ Query    │───▶│ Query       │───▶│  Read Model      │
│          │    │ Bus      │    │ Handler     │    │  (proyección     │
│  GET     │    │          │    │ (sin efecto)│    │   optimizada)    │
│  /users  │    │          │    │             │    │                  │
└──────────┘    └──────────┘    └─────────────┘    └──────────────────┘
```

### Componentes de `@nestjs/cqrs`

| Componente | Decorador | Propósito |
|---|---|---|
| **Command** | — | Objeto inmutable con datos para una operación de escritura |
| **CommandHandler** | `@CommandHandler()` | Ejecuta la lógica del comando |
| **CommandBus** | — | Enruta comandos a sus handlers |
| **Query** | — | Objeto inmutable con datos para una consulta |
| **QueryHandler** | `@QueryHandler()` | Ejecuta la lógica de la consulta |
| **QueryBus** | — | Enruta queries a sus handlers |
| **Event** | — | Representa algo que ocurrió en el sistema |
| **EventHandler** | `@EventHandler()` | Reacciona a un evento |
| **EventBus** | — | Publica eventos |
| **Saga** | `@Saga()` | Orquesta procesos multi-evento (basado en RxJS) |

## Sintaxis

### Instalación

```bash
npm install @nestjs/cqrs
```

### Configuración del módulo

```typescript
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CrearUsuarioHandler } from './commands/crear-usuario.handler';
import { ObtenerUsuariosHandler } from './queries/obtener-usuarios.handler';
import { UsuarioCreadoHandler } from './events/usuario-creado.handler';

@Module({
  imports: [CqrsModule],
  providers: [
    // Handlers de comandos
    CrearUsuarioHandler,
    // Handlers de consultas
    ObtenerUsuariosHandler,
    // Handlers de eventos
    UsuarioCreadoHandler,
  ],
})
export class UsuariosModule {}
```

### Command + CommandHandler

```typescript
// commands/crear-usuario.command.ts
export class CrearUsuarioCommand {
  constructor(
    public readonly nombre: string,
    public readonly email: string,
    public readonly rol: string = 'usuario',
  ) {}
}

// commands/crear-usuario.handler.ts
@CommandHandler(CrearUsuarioCommand)
export class CrearUsuarioHandler implements ICommandHandler<CrearUsuarioCommand> {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CrearUsuarioCommand): Promise<void> {
    const usuario = Usuario.crear(command.nombre, command.email, command.rol);

    const existe = await this.usuarioRepository.findByEmail(usuario.email);
    if (existe) throw new Error('Email ya registrado');

    await this.usuarioRepository.save(usuario);

    // Publicar evento de dominio
    this.eventBus.publish(new UsuarioCreadoEvent(usuario.id, usuario.email));
  }
}
```

### Query + QueryHandler

```typescript
// queries/obtener-usuario.query.ts
export class ObtenerUsuarioQuery {
  constructor(public readonly id: string) {}
}

// queries/obtener-usuario.handler.ts
@QueryHandler(ObtenerUsuarioQuery)
export class ObtenerUsuarioHandler implements IQueryHandler<ObtenerUsuarioQuery> {
  constructor(private readonly readModel: UsuarioReadModel) {}

  async execute(query: ObtenerUsuarioQuery): Promise<UsuarioDto | null> {
    return this.readModel.findById(query.id);
  }
}
```

### Event + EventHandler

```typescript
// events/usuario-creado.event.ts
export class UsuarioCreadoEvent {
  constructor(
    public readonly usuarioId: string,
    public readonly email: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

// events/usuario-creado.handler.ts
@EventHandler(UsuarioCreadoEvent)
export class UsuarioCreadoHandler implements IEventHandler<UsuarioCreadoEvent> {
  constructor(
    private readonly emailService: EmailService,
    private readonly readModel: UsuarioReadModel,
  ) {}

  async handle(event: UsuarioCreadoEvent): Promise<void> {
    // 1. Enviar email de bienvenida (efecto secundario)
    await this.emailService.enviarBienvenida(event.email);

    // 2. Actualizar Read Model (proyección de lectura)
    await this.readModel.actualizar({
      id: event.usuarioId,
      email: event.email,
      activo: true,
      creadoEn: event.timestamp,
    });
  }
}
```

### Uso desde un controlador

```typescript
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async crear(@Body() dto: CrearUsuarioDto): Promise<void> {
    await this.commandBus.execute(
      new CrearUsuarioCommand(dto.nombre, dto.email, dto.rol),
    );
  }

  @Get(':id')
  async obtener(@Param('id') id: string): Promise<UsuarioDto | null> {
    return this.queryBus.execute(new ObtenerUsuarioQuery(id));
  }
}
```

## Ejemplo básico

Sistema de pedidos con comandos y consultas separados.

<CodeGroup>
<CodeGroupItem title="commands/crear-pedido.command.ts">

```typescript
export class CrearPedidoCommand {
  constructor(
    public readonly usuarioId: string,
    public readonly items: PedidoItemDto[],
    public readonly direccionEnvio: DireccionDto,
  ) {}
}

export interface PedidoItemDto {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface DireccionDto {
  calle: string;
  ciudad: string;
  codigoPostal: string;
}
```

</CodeGroupItem>

<CodeGroupItem title="commands/crear-pedido.handler.ts">

```typescript
@CommandHandler(CrearPedidoCommand)
export class CrearPedidoHandler implements ICommandHandler<CrearPedidoCommand> {
  constructor(
    private readonly pedidoRepo: PedidoRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CrearPedidoCommand): Promise<string> {
    const pedido = Pedido.crear(command.usuarioId);

    for (const item of command.items) {
      pedido.agregarItem(item.productoId, item.nombre, item.precio, item.cantidad);
    }

    pedido.asignarDireccionEnvio(command.direccionEnvio);
    pedido.confirmar();

    await this.pedidoRepo.save(pedido);

    this.eventBus.publish(new PedidoCreadoEvent(
      pedido.id,
      pedido.usuarioId,
      pedido.total,
      command.items.length,
    ));

    return pedido.id;
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="queries/obtener-pedido.query.ts">

```typescript
export class ObtenerPedidoQuery {
  constructor(
    public readonly pedidoId: string,
    public readonly usuarioId?: string,  // Filtro opcional de seguridad
  ) {}
}
```

</CodeGroupItem>

<CodeGroupItem title="read-models/pedido.read-model.ts">

```typescript
// Proyección optimizada para lecturas
@Injectable()
export class PedidoReadModel {
  constructor(
    @InjectModel(PedidoView.name)
    private readonly model: Model<PedidoView>,
  ) {}

  async findById(id: string): Promise<PedidoDto | null> {
    return this.model.findOne({ id }).lean().exec();
  }

  async findByUsuario(usuarioId: string, page: number, limit: number) {
    return this.model
      .find({ usuarioId })
      .sort({ creadoEn: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
  }

  async actualizar(dto: Partial<PedidoDto>): Promise<void> {
    await this.model.updateOne({ id: dto.id }, { $set: dto }, { upsert: true });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="events/pedido-creado.handler.ts">

```typescript
@EventHandler(PedidoCreadoEvent)
export class PedidoCreadoHandler implements IEventHandler<PedidoCreadoEvent> {
  constructor(
    private readonly readModel: PedidoReadModel,
    private readonly emailService: EmailService,
  ) {}

  async handle(event: PedidoCreadoEvent): Promise<void> {
    // Actualizar proyección de lectura
    await this.readModel.actualizar({
      id: event.pedidoId,
      usuarioId: event.usuarioId,
      total: event.total,
      itemsCount: event.itemsCount,
      estado: 'confirmado',
      creadoEn: new Date(),
    });

    // Notificar al usuario
    await this.emailService.enviarConfirmacionPedido(
      event.usuarioId,
      event.pedidoId,
    );
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="pedidos.module.ts">

```typescript
@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{ name: PedidoView.name, schema: PedidoSchema }])],
  controllers: [PedidosController],
  providers: [
    // Handlers de comandos
    CrearPedidoHandler,
    CancelarPedidoHandler,
    // Handlers de consultas
    ObtenerPedidoHandler,
    ListarPedidosHandler,
    // Handlers de eventos
    PedidoCreadoHandler,
    PedidoCanceladoHandler,
    // Read Models
    PedidoReadModel,
  ],
})
export class PedidosModule {}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

CQRS con sagas para orquestar procesos multi-paso.

```typescript
// commands/procesar-pago.command.ts
export class ProcesarPagoCommand {
  constructor(
    public readonly pedidoId: string,
    public readonly monto: number,
    public readonly metodoPago: string,
    public readonly tokenTarjeta: string,
  ) {}
}

// events/pago-procesado.event.ts
export class PagoProcesadoEvent {
  constructor(
    public readonly pedidoId: string,
    public readonly transaccionId: string,
    public readonly monto: number,
  ) {}
}

export class PagoRechazadoEvent {
  constructor(
    public readonly pedidoId: string,
    public readonly motivo: string,
  ) {}
}
```

```typescript
// sagas/pedido.saga.ts — Orquesta el proceso de checkout
@Injectable()
export class PedidoSaga {
  @Saga()
  procesarCheckout = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PedidoCreadoEvent),
      delay(100),  // Pequeño delay para asegurar consistencia eventual
      map((event: PedidoCreadoEvent) => {
        console.log(`Saga: Pedido ${event.pedidoId} creado, iniciando pago...`);
        return new ProcesarPagoCommand(
          event.pedidoId,
          event.total,
          'tarjeta',
          'tok_visa_4242',
        );
      }),
    );
  };

  @Saga()
  manejarPagoRechazado = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PagoRechazadoEvent),
      map((event: PagoRechazadoEvent) => {
        console.log(`Saga: Pago rechazado para pedido ${event.pedidoId}: ${event.motivo}`);
        return new CancelarPedidoCommand(event.pedidoId, `Pago rechazado: ${event.motivo}`);
      }),
    );
  };
}
```

```typescript
// Controlador que usa command/query buses
@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async realizarCheckout(@Body() dto: CheckoutDto) {
    // 1. Crear pedido (comando)
    const pedidoId = await this.commandBus.execute(
      new CrearPedidoCommand(dto.usuarioId, dto.items, dto.direccion),
    );

    // 2. La saga se encarga del pago automáticamente

    return { pedidoId, mensaje: 'Pedido creado. Procesando pago...' };
  }

  @Get(':id/estado')
  async obtenerEstado(@Param('id') id: string) {
    // Consulta directamente al Read Model
    return this.queryBus.execute(new ObtenerEstadoPedidoQuery(id));
  }
}
```

## Ejemplo avanzado

CQRS + Event Sourcing con proyecciones múltiples y compensaciones (Saga compensatoria).

<CodeGroup>
<CodeGroupItem title="event-sourcing/event-store.ts">

```typescript
// Almacén de eventos simple
@Injectable()
export class EventStore {
  private readonly events: EventoAlmacenado[] = [];

  async append(aggregateId: string, events: any[]): Promise<void> {
    for (const event of events) {
      this.events.push({
        id: crypto.randomUUID(),
        aggregateId,
        type: event.constructor.name,
        data: event,
        timestamp: new Date(),
        version: this.events.filter(e => e.aggregateId === aggregateId).length + 1,
      });
    }
  }

  async getEvents(aggregateId: string): Promise<any[]> {
    return this.events
      .filter(e => e.aggregateId === aggregateId)
      .sort((a, b) => a.version - b.version)
      .map(e => e.data);
  }

  async replayAll(eventHandlers: Map<string, IEventHandler>): Promise<void> {
    for (const event of this.events) {
      const handler = eventHandlers.get(event.type);
      if (handler) await handler.handle(event.data);
    }
  }
}

interface EventoAlmacenado {
  id: string;
  aggregateId: string;
  type: string;
  data: any;
  timestamp: Date;
  version: number;
}
```

</CodeGroupItem>

<CodeGroupItem title="domain/cuenta.ts">

```typescript
// Agregado con reconstrucción desde eventos
export class Cuenta {
  public id: string;
  private _saldo: number = 0;
  private _activa: boolean = true;

  constructor(id: string) {
    this.id = id;
  }

  static crear(id: string, titular: string, moneda: string): { cuenta: Cuenta; events: any[] } {
    const cuenta = new Cuenta(id);
    const event = new CuentaCreadaEvent(id, titular, moneda);
    cuenta.apply(event);
    return { cuenta, events: [event] };
  }

  depositar(monto: number, referencia: string): any[] {
    if (!this._activa) throw new Error('Cuenta inactiva');
    const event = new DepositoRealizadoEvent(this.id, monto, referencia);
    this.apply(event);
    return [event];
  }

  retirar(monto: number, referencia: string): any[] {
    if (!this._activa) throw new Error('Cuenta inactiva');
    if (this._saldo < monto) throw new Error('Saldo insuficiente');
    const event = new RetiroRealizadoEvent(this.id, monto, referencia);
    this.apply(event);
    return [event];
  }

  // Reconstruir estado aplicando eventos
  apply(event: any): void {
    if (event instanceof CuentaCreadaEvent) {
      this._saldo = 0;
      this._activa = true;
    } else if (event instanceof DepositoRealizadoEvent) {
      this._saldo += event.monto;
    } else if (event instanceof RetiroRealizadoEvent) {
      this._saldo -= event.monto;
    }
  }

  static reconstruir(id: string, events: any[]): Cuenta {
    const cuenta = new Cuenta(id);
    for (const event of events) {
      cuenta.apply(event);
    }
    return cuenta;
  }

  get saldo(): number { return this._saldo; }
  get activa(): boolean { return this._activa; }
}
```

</CodeGroupItem>

<CodeGroupItem title="commands/transferencia.handler.ts">

```typescript
@CommandHandler(RealizarTransferenciaCommand)
export class RealizarTransferenciaHandler implements ICommandHandler<RealizarTransferenciaCommand> {
  constructor(private readonly eventStore: EventStore) {}

  async execute(command: RealizarTransferenciaCommand): Promise<void> {
    // Reconstruir cuentas desde eventos
    const origen = Cuenta.reconstruir(
      command.cuentaOrigenId,
      await this.eventStore.getEvents(command.cuentaOrigenId),
    );
    const destino = Cuenta.reconstruir(
      command.cuentaDestinoId,
      await this.eventStore.getEvents(command.cuentaDestinoId),
    );

    // Validar y ejecutar
    const eventsOrigen = origen.retirar(command.monto, `Transferencia a ${destino.id}`);
    const eventsDestino = destino.depositar(command.monto, `Transferencia de ${origen.id}`);

    // Persistir eventos (transaccional)
    await this.eventStore.append(origen.id, eventsOrigen);
    await this.eventStore.append(destino.id, eventsDestino);
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="proyecciones/cuenta.proyeccion.ts">

```typescript
// Proyección que actualiza el Read Model desde eventos
@Injectable()
export class CuentaProyeccion {
  constructor(
    @InjectModel(CuentaView.name)
    private readonly model: Model<CuentaView>,
  ) {}

  @EventHandler(CuentaCreadaEvent)
  async onCuentaCreada(event: CuentaCreadaEvent): Promise<void> {
    await this.model.create({
      id: event.cuentaId,
      titular: event.titular,
      moneda: event.moneda,
      saldo: 0,
      activa: true,
      creadoEn: event.timestamp,
    });
  }

  @EventHandler(DepositoRealizadoEvent)
  async onDeposito(event: DepositoRealizadoEvent): Promise<void> {
    await this.model.updateOne(
      { id: event.cuentaId },
      { $inc: { saldo: event.monto }, $set: { ultimaOperacion: event.timestamp } },
    );
  }

  @EventHandler(RetiroRealizadoEvent)
  async onRetiro(event: RetiroRealizadoEvent): Promise<void> {
    await this.model.updateOne(
      { id: event.cuentaId },
      { $inc: { saldo: -event.monto }, $set: { ultimaOperacion: event.timestamp } },
    );
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema de gestión de **pedidos y facturación** con CQRS completo.

```
ARQUITECTURA CQRS DEL SISTEMA DE FACTURACIÓN
─────────────────────────────────────────────────────────

                    ┌─────────────────────────────────┐
                    │         API REST / GraphQL       │
                    │  (Controladores NestJS)          │
                    └──────┬──────────────────┬────────┘
                           │                  │
                           ▼                  ▼
               ┌───────────────────┐  ┌───────────────────┐
               │   COMMAND BUS     │  │    QUERY BUS      │
               └────────┬──────────┘  └────────┬──────────┘
                        │                      │
                        ▼                      ▼
            ┌─────────────────────┐  ┌─────────────────────┐
            │  COMMAND HANDLERS   │  │  QUERY HANDLERS     │
            │                     │  │                     │
            │  • CrearFactura     │  │  • ObtenerFactura   │
            │  • AnularFactura    │  │  • ListarFacturas   │
            │  • EmitirNotaCredito│  │  • ReporteMensual   │
            └──────────┬──────────┘  └──────────┬──────────┘
                       │                        │
                       ▼                        ▼
            ┌─────────────────────┐  ┌─────────────────────┐
            │  DOMINIO (DDD)      │  │  READ MODEL         │
            │  (Event Sourcing)   │  │  (MongoDB/Redis)    │
            │                     │  │                     │
            │  Event Store        │  │  FacturaView        │
            └──────────┬──────────┘  └─────────────────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │  EVENT BUS          │
            └──────────┬──────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │  EVENT HANDLERS     │
            │  + SAGAS            │
            │                     │
            │  • Actualizar Read  │
            │  • Enviar email     │
            │  • Notificar contab │
            │  • Saga Retención   │
            └─────────────────────┘
```

```typescript
// Implementación completa de los handlers
@CommandHandler(CrearFacturaCommand)
export class CrearFacturaHandler implements ICommandHandler<CrearFacturaCommand> {
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CrearFacturaCommand): Promise<string> {
    const facturaId = crypto.randomUUID();

    const events = [
      new FacturaCreadaEvent(
        facturaId,
        command.clienteId,
        command.items,
        command.total,
        command.moneda,
      ),
    ];

    await this.eventStore.append(facturaId, events);
    this.eventBus.publish(events[0]);

    return facturaId;
  }
}
```

## Buenas prácticas

### 1. Commands son imperativos, Queries son interrogativos

```typescript
// ✅ Bien
export class CrearUsuarioCommand { /* hace que algo pase */ }
export class ObtenerUsuarioQuery { /* pregunta por algo */ }

// ❌ Mal
export class UsuarioCommand { /* nombre vago */ }
export class GetUserData { /* mezcla inglés/español */ }
```

### 2. Commands nombrados en infinitivo, Events en pasado

```typescript
// Commands: "haz esto"
CrearUsuarioCommand
ProcesarPagoCommand
CancelarPedidoCommand

// Events: "esto ya pasó"
UsuarioCreadoEvent
PagoProcesadoEvent
PedidoCanceladoEvent
```

### 3. Commands y Queries deben ser inmutables

```typescript
// ✅ Bien: readonly
export class CrearPedidoCommand {
  constructor(
    public readonly usuarioId: string,
    public readonly items: readonly PedidoItemDto[],
  ) {}
}
```

### 4. Un CommandHandler = un comando = un propósito

```typescript
// ✅ Bien: cada handler maneja exactamente un comando
@CommandHandler(CrearUsuarioCommand)
export class CrearUsuarioHandler { /* solo crear */ }

@CommandHandler(ActualizarUsuarioCommand)
export class ActualizarUsuarioHandler { /* solo actualizar */ }

// ❌ Mal: handler que hace múltiples cosas
@CommandHandler(CrearUsuarioCommand)
export class UsuarioHandler {
  @CommandHandler(CrearUsuarioCommand) execute() { /* crear */ }
  // No se puede tener otro comando aquí
}
```

### 5. Las sagas no deben tener efectos secundarios directos

```typescript
// ✅ Bien: saga retorna comandos, no ejecuta lógica directamente
@Saga()
procesarPago = (events$: Observable<any>): Observable<ICommand> => {
  return events$.pipe(
    ofType(PedidoCreadoEvent),
    map(event => new ProcesarPagoCommand(event.pedidoId, event.total)),
  );
};

// ❌ Mal: saga con lógica directa (debería ir en handler)
@Saga()
procesarPago = (events$: Observable<any>): Observable<void> => {
  return events$.pipe(
    ofType(PedidoCreadoEvent),
    tap(event => this.pagoService.procesar(event)),  // ← Efecto secundario directo
  );
};
```

### 6. Commands validados por separado de Queries

```typescript
// Validación para comandos (más estricta)
export class CrearPedidoCommand {
  constructor(
    public readonly usuarioId: string,
    public readonly items: PedidoItemDto[],
  ) {
    if (!usuarioId) throw new Error('usuarioId es requerido');
    if (!items || items.length === 0) throw new Error('Se requiere al menos un item');
  }
}

// Validación para queries (más ligera)
export class ObtenerPedidosQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}
```

### 7. Usa proyecciones (Read Models) separadas para lecturas

```typescript
// Proyección desnormalizada para consultas rápidas
// No necesita JOINS ni agregaciones complejas
interface FacturaView {
  id: string;
  clienteNombre: string;
  items: { nombre: string; precio: number }[];
  total: number;
  estado: 'emitida' | 'pagada' | 'anulada';
  emitidaEn: Date;
}
```

## Errores comunes

### 1. Usar CQRS donde no hay asimetría lecturas/escrituras

```typescript
// ❌ Error: CRUD simple donde CQRS es sobredimensionado
// Si solo tienes crear/leer/actualizar/eliminar igual, no necesitas CQRS

// ✅ CQRS vale la pena cuando:
// - Las lecturas son muy diferentes a las escrituras
// - Necesitas escalar lecturas y escrituras independientemente
// - Tienes múltiples proyecciones del mismo dato
// - Necesitas event sourcing o auditoría completa
```

### 2. Handlers que devuelven datos que deberían ser queries

```typescript
// ❌ Error: comando que devuelve datos
@CommandHandler(CrearUsuarioCommand)
export class CrearUsuarioHandler {
  async execute(command: CrearUsuarioCommand): Promise<Usuario> {
    // Comando no debería devolver datos
    return this.repo.save(usuario);
  }
}

// ✅ Correcto: comando void, query para obtener datos
@CommandHandler(CrearUsuarioCommand)
export class CrearUsuarioHandler {
  async execute(command: CrearUsuarioCommand): Promise<void> {
    await this.repo.save(usuario);
  }
}

// En el controlador:
const pedidoId = await this.commandBus.execute(command);
const pedido = await this.queryBus.execute(new ObtenerPedidoQuery(pedidoId));
```

### 3. No actualizar el Read Model después de comandos

```typescript
// ❌ Error: read model desactualizado
@CommandHandler(CrearPedidoCommand)
export class CrearPedidoHandler {
  async execute(command: CrearPedidoCommand): Promise<void> {
    await this.pedidoRepo.save(pedido);
    // No publica evento → read model nunca se actualiza
  }
}

// ✅ Correcto: publicar evento para actualizar proyección
@CommandHandler(CrearPedidoCommand)
export class CrearPedidoHandler {
  async execute(command: CrearPedidoCommand): Promise<void> {
    await this.pedidoRepo.save(pedido);
    this.eventBus.publish(new PedidoCreadoEvent(pedido.id));  // ← Actualiza read model
  }
}
```

### 4. Consistencia inmediata donde debería ser eventual

```typescript
// ❌ Error: esperar a que el read model se actualice
const pedidoId = await this.commandBus.execute(new CrearPedidoCommand(dto));
const pedido = await this.queryBus.execute(new ObtenerPedidoQuery(pedidoId));
// ↑ Puede fallar si el read model aún no se actualizó

// ✅ Correcto: asumir consistencia eventual
const pedidoId = await this.commandBus.execute(new CrearPedidoCommand(dto));
// Mostrar mensaje "Pedido creado" con el ID
// El read model se actualizará en breve (ms)
```

### 5. Poner lógica de negocio en el controlador

```typescript
// ❌ Error: controlador con lógica
@Post()
async crear(@Body() dto: any) {
  if (dto.items.length === 0) throw new BadRequestException();
  const command = new CrearPedidoCommand(dto);
  return this.commandBus.execute(command);
}

// ✅ Correcto: controlador solo delega
@Post()
async crear(@Body() dto: CrearPedidoDto) {
  return this.commandBus.execute(new CrearPedidoCommand(dto));
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **DDD** | CQRS complementa a DDD separando el modelo de comandos (dominio) del modelo de consultas (proyecciones). |
| **Clean Architecture** | CQRS encaja naturalmente: los comandos son casos de uso de escritura, las queries son casos de uso de lectura. |
| **Event Sourcing** | CQRS + Event Sourcing: los comandos generan eventos que actualizan proyecciones de lectura. |
| **Microservicios** | Cada microservicio puede implementar CQRS internamente. Los eventos pueden ser de integración entre servicios. |
| **Sagas** | Orquestan comandos multi-paso, frecuentemente reactivos a eventos de dominio. |
| **Módulos NestJS** | El módulo CqrsModule se importa y los handlers se registran como providers. |
| **Pruebas** | Commands y Queries se prueban unitariamente. Las sagas se prueban con marble testing de RxJS. |

## Resumen

- **CQRS** separa las operaciones de **escritura** (Commands) de las de **lectura** (Queries).
- **Commands**: modifican el estado, se nombran en infinitivo (`CrearPedidoCommand`), son inmutables.
- **Queries**: leen datos, no modifican estado, se nombran en interrogativo (`ObtenerPedidoQuery`).
- **Command Bus** y **Query Bus** enrutan cada operación a su handler correspondiente.
- **Event Bus**: publica eventos después de ejecutar comandos para efectos secundarios.
- **Sagas**: orquestan procesos multi-paso usando RxJS, reaccionan a eventos y emiten comandos.
- **Read Models**: proyecciones optimizadas para consultas, separadas del modelo de escritura.
- **Event Sourcing**: persiste eventos en lugar de estado; el estado actual se reconstruye reproduciendo eventos.
- **Beneficios**: escalabilidad independiente, modelos optimizados por propósito, trazabilidad, mejor organización.
- **No uses CQRS** en CRUD simples donde leer y escribir son simétricos.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la diferencia fundamental entre un Command y un Query en CQRS?</summary>

**Respuesta:** Un **Command** modifica el estado del sistema (escritura) y no debe devolver datos. Una **Query** lee datos sin modificar el estado. Esta separación permite optimizar cada modelo de forma independiente.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué componente de `@nestjs/cqrs` orquesta procesos multi-paso reaccionando a eventos?</summary>

**Respuesta:** La **Saga**, decorada con `@Saga()`. Usa RxJS para escuchar eventos del EventBus y emitir comandos en respuesta, permitiendo secuencias complejas como checkout → pago → notificación.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cómo se actualiza un Read Model (proyección de lectura) cuando se ejecuta un comando?</summary>

**Respuesta:** El CommandHandler publica un **evento** en el EventBus después de ejecutar el comando. Un **EventHandler** escucha ese evento y actualiza la proyección de lectura (Read Model) con los datos relevantes. Esto asegura consistencia eventual.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Por qué los comandos no deberían devolver datos?</summary>

**Respuesta:** Porque mezcla la responsabilidad de escritura con la de lectura. Si el cliente necesita los datos después de un comando, debe ejecutar una query separada. Esto mantiene la separación limpia y permite que comandos y queries escalen independientemente.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cuándo NO deberías usar CQRS?</summary>

**Respuesta:** En aplicaciones CRUD simples donde las operaciones de lectura y escritura son básicas y simétricas (mismos modelos, mismas validaciones). En prototipos, MVPs o microservicios muy pequeños donde el overhead de handlers, eventos y buses no se justifica. CQRS añade complejidad; úsalo cuando esa complejidad se pague con escalabilidad, mantenibilidad o trazabilidad.
</details>
