---
title: Eventos en NestJS
description: Aprende el sistema de eventos en NestJS con EventEmitter2, eventos de dominio, event handlers, sagas (RxJS), comunicación entre módulos y microservicios basada en eventos.
---

# Eventos en NestJS

Los eventos son como **anuncios por altavoz en un supermercado**: alguien anuncia "oferta en lácteos" y cualquier persona interesada (cliente, repositor, cajero) puede reaccionar sin que el anunciante sepa quiénes son.

## ¿Qué es?

El sistema de eventos en NestJS permite que diferentes partes de la aplicación se comuniquen de forma **desacoplada**. Un emisor publica un evento y cero o más handlers reaccionan, sin que el emisor conozca a los handlers.

```typescript
// 1. Definir el evento
export class UsuarioCreadoEvent {
  constructor(
    public readonly usuarioId: string,
    public readonly email: string,
  ) {}
}

// 2. Emitir el evento
this.eventBus.emit('usuario.creado', new UsuarioCreadoEvent(id, email));

// 3. Escuchar el evento (en cualquier módulo)
@OnEvent('usuario.creado')
handleUsuarioCreado(event: UsuarioCreadoEvent) {
  await this.emailService.enviarBienvenida(event.email);
}
```

## ¿Por qué es importante?

Los eventos son fundamentales para **desacoplar** la lógica de negocio:

- **Separación de responsabilidades**: El creador del evento no sabe quién reacciona.
- **Extensibilidad**: Añadir nueva funcionalidad sin modificar código existente.
- **Escalabilidad**: Los handlers pueden ejecutarse de forma asíncrona o en procesos separados.
- **Auditoría**: Cada evento representa algo que ocurrió en el sistema.
- **Microservicios**: Base para comunicación event-driven entre servicios.

:::tip
Si tienes un servicio que hace muchas cosas después de una operación (enviar email, actualizar caché, notificar admin, loguear), ese es un candidato perfecto para usar eventos.
:::

## Problema que resuelve

Sin eventos, los servicios se acoplan:

```typescript
// ❌ Servicio acoplado: sabe demasiado
@Injectable()
export class UsuariosService {
  constructor(
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
    private readonly analyticsService: AnalyticsService,
    private readonly auditoriaService: AuditoriaService,
    private readonly notificacionService: NotificacionService,
  ) {}

  async crear(dto: CrearUsuarioDto) {
    const usuario = await this.repo.save(dto);

    // Efectos secundarios acoplados
    await this.emailService.enviarBienvenida(usuario.email);
    await this.cacheService.invalidar('usuarios');
    await this.analyticsService.registrarEvento('usuario_creado', usuario.id);
    await this.auditoriaService.registrar('crear_usuario', usuario.id);
    await this.notificacionService.notificarAdmin('Nuevo usuario');

    return usuario;
  }
}
```

Con eventos, el servicio principal no sabe qué más ocurre:

```typescript
// ✅ Servicio desacoplado: solo emite un evento
@Injectable()
export class UsuariosService {
  constructor(
    private readonly repo: UsuarioRepository,
    private readonly eventBus: EventBus,
  ) {}

  async crear(dto: CrearUsuarioDto) {
    const usuario = await this.repo.save(dto);

    // Un solo evento, el resto reacciona
    this.eventBus.emit('usuario.creado', new UsuarioCreadoEvent(usuario.id, usuario.email));

    return usuario;
  }
}

// Los handlers están separados, en cualquier módulo
@Injectable()
export class EmailHandler {
  @OnEvent('usuario.creado')
  async enviarBienvenida(event: UsuarioCreadoEvent) {
    await this.emailService.enviar(event.email, 'Bienvenido!');
  }
}

@Injectable()
export class AnalyticsHandler {
  @OnEvent('usuario.creado')
  async registrar(event: UsuarioCreadoEvent) {
    await this.analyticsService.registrar('usuario_creado', event.usuarioId);
  }
}
```

## Cómo funciona

### Arquitectura de eventos en NestJS

```
                    ┌─────────────────────┐
                    │   EventBus          │
                    │  (EventEmitter2)    │
                    └──────────┬──────────┘
                               │
               ┌───────────────┼───────────────┐
               │               │               │
               ▼               ▼               ▼
         ┌──────────┐   ┌──────────┐   ┌──────────┐
         │ Handler 1 │   │ Handler 2 │   │ Handler 3 │
         │ Email     │   │ Caché    │   │ Analytics │
         └──────────┘   └──────────┘   └──────────┘

  Flujo:
  1. Servicio emite: this.eventBus.emit('usuario.creado', event)
  2. EventBus distribuye a todos los handlers suscritos
  3. Cada handler procesa independientemente
  4. Si un handler falla, los demás no se ven afectados
```

### EventEmitter2 vs @nestjs/cqrs EventBus

| Aspecto | @nestjs/event-emitter | @nestjs/cqrs EventBus |
|---|---|---|
| **Propósito** | Eventos generales de la app | Eventos de dominio (DDD/CQRS) |
| **Base** | EventEmitter2 | RxJS Subject |
| **Patrón** | Pub/Sub simple | Parte de CQRS + Sagas |
| **Sagas** | No | Sí (RxJS) |
| **Uso típico** | Efectos secundarios, notificaciones | Eventos de dominio, proyecciones |
| **Namespace** | Sí (strings con wildcards) | No (clases) |

## Sintaxis

### Instalación

```bash
npm install @nestjs/event-emitter
```

### Configuración

```typescript
// app.module.ts
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,        // Soporte para wildcards: 'usuario.*'
      delimiter: '.',        // Delimitador de namespace
      maxListeners: 20,      // Máximo de listeners por evento
      verboseMemoryLeak: true, // Warn si hay muchas suscripciones
    }),
  ],
})
export class AppModule {}
```

### Emitir y escuchar

```typescript
// Emitir
this.eventEmitter.emit('pedido.creado', new PedidoCreadoEvent(id, total));

// Escuchar (con decorador)
@OnEvent('pedido.creado')
handle(event: PedidoCreadoEvent) { /* ... */ }

// Escuchar con wildcard
@OnEvent('pedido.*')
handleTodos(event: any) { /* cualquier evento de pedido */ }

// Escuchar globalmente
@OnEvent('**')
handleTodos(event: any, payload: any) { /* cualquier evento */ }
```

## Ejemplo básico

Sistema de pedidos con eventos para notificaciones, caché y analytics.

<CodeGroup>
<CodeGroupItem title="events/pedido-creado.event.ts">

```typescript
export class PedidoCreadoEvent {
  constructor(
    public readonly pedidoId: string,
    public readonly usuarioId: string,
    public readonly email: string,
    public readonly total: number,
    public readonly items: { nombre: string; cantidad: number }[],
    public readonly timestamp: Date = new Date(),
  ) {}
}
```

</CodeGroupItem>

<CodeGroupItem title="handlers/notificaciones.handler.ts">

```typescript
@Injectable()
export class NotificacionesHandler {
  constructor(
    private readonly emailService: EmailService,
    private readonly pushService: PushService,
  ) {}

  @OnEvent('pedido.creado')
  async enviarConfirmacion(event: PedidoCreadoEvent) {
    // Enviar email de confirmación
    await this.emailService.enviar({
      to: event.email,
      subject: `Pedido #${event.pedidoId} confirmado`,
      template: 'pedido-confirmado',
      data: { pedidoId: event.pedidoId, total: event.total, items: event.items },
    });

    // Notificación push si tiene la app
    await this.pushService.enviar(event.usuarioId, {
      titulo: 'Pedido confirmado',
      cuerpo: `Tu pedido #${event.pedidoId} por $${event.total} está en proceso`,
    });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="handlers/cache.handler.ts">

```typescript
@Injectable()
export class CacheHandler {
  constructor(private readonly cacheService: CacheService) {}

  @OnEvent('pedido.creado')
  @OnEvent('pedido.cancelado')
  @OnEvent('pedido.actualizado')
  async invalidarCache(event: any) {
    await this.cacheService.invalidar('pedidos:*');
    await this.cacheService.invalidar(`pedido:${event.pedidoId}`);
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="handlers/analytics.handler.ts">

```typescript
@Injectable()
export class AnalyticsHandler {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @OnEvent('pedido.creado')
  async registrarEvento(event: PedidoCreadoEvent) {
    await this.analyticsService.evento('pedido_creado', {
      pedidoId: event.pedidoId,
      usuarioId: event.usuarioId,
      total: event.total,
      cantidadItems: event.items.length,
      timestamp: event.timestamp,
    });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="pedidos.service.ts">

```typescript
@Injectable()
export class PedidosService {
  constructor(
    private readonly repo: PedidoRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async crear(dto: CrearPedidoDto) {
    const pedido = await this.repo.save(dto);

    // Emitir evento — los handlers hacen el resto
    this.eventEmitter.emit('pedido.creado', new PedidoCreadoEvent(
      pedido.id,
      dto.usuarioId,
      dto.email,
      pedido.total,
      dto.items,
    ));

    return pedido;
  }

  async cancelar(id: string) {
    await this.repo.update(id, { estado: 'cancelado' });

    this.eventEmitter.emit('pedido.cancelado', {
      pedidoId: id,
      timestamp: new Date(),
    });
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Eventos con contexto, orden de ejecución, supresión de errores y escucha condicional.

```typescript
@Injectable()
export class PedidoHandler {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly billingService: BillingService,
  ) {}

  // Orden de ejecución: menor número = mayor prioridad
  @OnEvent('pedido.creado', { promisify: true, suppressErrors: true })
  async reservarInventario(event: PedidoCreadoEvent) {
    await this.inventoryService.reservar(event.pedidoId, event.items);
  }

  // Se ejecuta después del anterior (orden 100)
  @OnEvent('pedido.creado', { nextTick: true, async: true })
  async generarFactura(event: PedidoCreadoEvent) {
    await this.billingService.crearFactura(event.pedidoId, event.total);
  }
}
```

```typescript
// Eventos condicionales con wildcards
@Injectable()
export class EventosService {
  // Escucha cualquier evento de "usuario"
  @OnEvent('usuario.*')
  handleUsuarioEvent(event: any) {
    console.log('Evento de usuario:', event.constructor.name);
  }

  // Escucha eventos que empiezan con "pedido." excepto "pedido.creado"
  @OnEvent('pedido.*')
  handlePedidoExceptoCreacion(event: any) {
    // El handler recibe todos, filtra internamente
    if (event instanceof PedidoCreadoEvent) return;
    // ... procesar otros eventos de pedido
  }

  // Escucha TODOS los eventos (para logging)
  @OnEvent('**')
  handleAll(event: any) {
    console.log(`Evento: ${event.constructor.name}`, JSON.stringify(event).slice(0, 100));
  }
}
```

## Ejemplo avanzado

Eventos de dominio con CQRS, sagas y comunicación entre microservicios.

```typescript
// Eventos de dominio con @nestjs/cqrs
import { EventBus, EventsHandler, IEventHandler, IEvent } from '@nestjs/cqrs';

export class StockReservadoEvent implements IEvent {
  constructor(
    public readonly pedidoId: string,
    public readonly productoId: string,
    public readonly cantidad: number,
  ) {}
}

@EventsHandler(StockReservadoEvent)
export class StockReservadoHandler implements IEventHandler<StockReservadoEvent> {
  constructor(private readonly eventBus: EventBus) {}

  async handle(event: StockReservadoEvent) {
    console.log(`Stock reservado: ${event.cantidad}x ${event.productoId}`);
    // Publicar evento de integración para otros microservicios
    this.eventBus.publish(new PedidoProcesadoEvent(event.pedidoId));
  }
}

// Saga que reacciona a eventos y emite comandos
@Injectable()
export class PedidoSaga {
  @Saga()
  procesarPedido = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(StockReservadoEvent),
      delay(100),
      map(event => new ProcesarPagoCommand(event.pedidoId)),
    );
  };
}
```

```typescript
// Eventos entre microservicios (usando RabbitMQ/Kafka)
// Emisor (Pedidos Service):
@MessagePattern({ cmd: 'crear_pedido' })
async crear(@Payload() dto: any) {
  const pedido = await this.pedidosService.crear(dto);

  // Publicar evento de integración al Event Bus externo
  this.eventBus.publish(new PedidoCreadoEvent(pedido.id, dto.usuarioId, pedido.total));

  return pedido;
}

// Receptor (Notificaciones Service):
@EventPattern('pedido_creado')
async onPedidoCreado(@Payload() data: any) {
  await this.notificacionesService.enviarConfirmacion(data.usuarioId, data.pedidoId);
}
```

## Buenas prácticas

### 1. Eventos son objetos con nombre explícito

```typescript
// ✅ Bien: clase nombrada en pasado
export class UsuarioCreadoEvent {
  constructor(public readonly usuarioId: string) {}
}

// ❌ Mal: string mágica sin estructura
this.eventEmitter.emit('algo_paso', { id: 123 });
```

### 2. Un evento, múltiples handlers independientes

```typescript
// ✅ Bien: múltiples handlers para un evento
@OnEvent('usuario.creado')  → EmailHandler → enviar email
@OnEvent('usuario.creado')  → CacheHandler → invalidar caché
@OnEvent('usuario.creado')  → AuditHandler → registrar auditoría

// ❌ Mal: un handler que hace todo
@OnEvent('usuario.creado')
async handleTodo(event: UsuarioCreadoEvent) {
  await this.emailService.enviar(event.email, '...');
  await this.cacheService.invalidar('usuarios');
  await this.auditService.registrar('crear', event.usuarioId);
}
```

### 3. Los handlers no deben modificar el flujo principal

Los eventos son **efectos secundarios**. El servicio principal debe completar su operación independientemente de si los handlers fallan.

```typescript
// ✅ Con suppressErrors: true para no afectar al emisor
@OnEvent('pedido.creado', { suppressErrors: true })
async handler(event: any) {
  // Si falla, el pedido ya fue creado exitosamente
}
```

### 4. Usa eventos para comunicación entre módulos

```typescript
// Módulo A emite, Módulo B escucha — sin imports directos
// Rompe dependencias circulares entre módulos
```

### 5. Nombra eventos en pasado (ya ocurrió)

```typescript
usuario.creado       ✅
pedido.confirmado    ✅
pago.rechazado       ✅

crear.usuario        ❌ (suena a comando, no a evento)
confirmar.pedido     ❌
```

## Errores comunes

### 1. Dependencias circulares por eventos síncronos

```typescript
// ❌ Error: A emite evento que B escucha, B llama a A → loop infinito

// ✅ Solución: usar suppressErrors, nextTick, o eventos asíncronos
```

### 2. Eventos que modifican el estado principal

```typescript
// ❌ El handler modifica la entidad principal
@OnEvent('pedido.creado')
async cambiarEstado(event: any) {
  await this.pedidosRepo.update(event.pedidoId, { estado: 'procesado' });
  // Otro handler puede leer el estado viejo → inconsistencia
}
```

### 3. No registrar el módulo de eventos

```typescript
// ❌ Error: eventos no funcionan
@Module({ providers: [MiHandler] })  // Falta EventEmitterModule

// ✅ Correcto
@Module({
  imports: [EventEmitterModule.forRoot()],  // ← Necesario
  providers: [MiHandler],
})
export class AppModule {}
```

### 4. Promesas no await en handlers

```typescript
// ❌ Error: handler no espera a que la promesa se resuelva
@OnEvent('usuario.creado')
handle(event: any) {
  this.emailService.enviar(event.email, '...');  // La promesa se ignora
}

// ✅ Correcto
@OnEvent('usuario.creado', { promisify: true })
async handle(event: any) {
  await this.emailService.enviar(event.email, '...');
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **EventEmitter2** | Librería base de eventos en NestJS (pub/sub). |
| **CQRS EventBus** | Eventos de dominio en arquitectura CQRS. |
| **Sagas** | Orquestan procesos multi-evento con RxJS. |
| **Microservicios** | `@EventPattern` para eventos entre servicios (RabbitMQ/Kafka). |
| **Módulos** | Los handlers se registran como providers en módulos. |
| **DDD** | Los eventos de dominio representan hechos del negocio. |

## Resumen

- Los **eventos** permiten comunicación desacoplada entre componentes.
- `@nestjs/event-emitter` provee pub/sub con EventEmitter2.
- `eventEmitter.emit('evento.nombre', payload)` publica un evento.
- `@OnEvent('evento.nombre')` escucha eventos en handlers.
- Soporta **wildcards**: `usuario.*`, `**`.
- Los eventos se nombran en **pasado** (ya ocurrieron).
- Los handlers son **efectos secundarios** — no deben afectar el flujo principal.
- `promisify: true` espera promesas; `suppressErrors: true` ignora errores.
- Los eventos son ideales para: notificaciones, caché, logging, analytics, integraciones.
- En CQRS, `EventBus` + `@EventsHandler()` para eventos de dominio.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la principal ventaja de usar eventos en lugar de llamar directamente a servicios?</summary>

**Respuesta:** El **desacoplamiento**. El servicio que crea el evento no sabe qué handlers van a reaccionar. Puedes añadir nuevas funcionalidades (enviar email, actualizar caché, registrar analytics) sin modificar el código del servicio original.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué decorador se usa para escuchar un evento?</summary>

**Respuesta:** `@OnEvent('nombre.del.evento')`. Se coloca en un método de un provider (handler) que se ejecutará cuando el evento sea emitido.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué significa `suppressErrors: true` en `@OnEvent`?</summary>

**Respuesta:** Que si el handler lanza un error, no se propaga al emisor del evento. El emisor completa su operación exitosamente aunque el handler falle. Es útil para efectos secundarios no críticos como enviar notificaciones.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo se comunican eventos entre microservicios en NestJS?</summary>

**Respuesta:** Usando `@EventPattern()` en el microservicio receptor y emitiendo el evento a través del transporte configurado (RabbitMQ, Kafka, Redis). El patrón `event` distribuye el evento a todos los suscriptores sin esperar respuesta.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cuándo deberías usar eventos en lugar de inyección de dependencias directa?</summary>

**Respuesta:** Cuando una operación debe desencadenar **múltiples efectos secundarios** que pueden crecer con el tiempo (notificaciones, caché, analytics, auditoría) y no quieres que el servicio principal conozca todos esos detalles. También para romper dependencias circulares entre módulos y para comunicación entre microservicios.
</details>
