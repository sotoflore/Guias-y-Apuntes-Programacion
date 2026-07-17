---
title: Microservicios en NestJS
description: Aprende a construir microservicios con NestJS, transporte TCP/RabbitMQ/Kafka/Redis, comunicación híbrida, gateway API, patrones message/event y escalabilidad.
---

# Microservicios en NestJS

Los microservicios en NestJS son como **un equipo de especialistas en lugar de un empleado multiusos**: cada servicio hace una cosa bien y se comunican por mensajes en lugar de llamarse directamente.

## ¿Qué es?

Un **microservicio** es una arquitectura donde la aplicación se divide en servicios pequeños, independientes y desplegables por separado. NestJS soporta microservicios nativamente con su paquete `@nestjs/microservices`, permitiendo comunicación vía TCP, Redis, RabbitMQ, Kafka, MQTT y gRPC.

```typescript
// Microservicio TCP
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.TCP,
  options: { host: 'localhost', port: 3001 },
});
app.listen();
```

## ¿Por qué es importante?

Los microservicios resuelven problemas de **escalabilidad y organización** en aplicaciones grandes:

- **Escalabilidad independiente**: Escala solo el servicio que lo necesita.
- **Aislamiento**: Un fallo en un servicio no derriba toda la app.
- **Equipos autónomos**: Cada equipo dueño de su servicio.
- **Tecnología heterogénea**: Cada servicio puede usar la tecnología que mejor se adapte.
- **Despliegue independiente**: Cada servicio se deploya sin afectar a los demás.

## Problema que resuelve

Sin microservicios, todo está en un monolito:

```typescript
// ❌ Mónolito: todo en una app
@Module({
  imports: [
    AuthModule, UsuariosModule, PedidosModule, ProductosModule,
    PagosModule, NotificacionesModule, ReportesModule, AdminModule,
    // ... 20 módulos más
  ],
})
export class AppModule {}
// Problemas:
// - Un bug en PedidosModule puede tumbar la app entera
// - Escalar significa escalar todo, no solo lo que necesita más recursos
// - Un equipo tocando un módulo puede afectar a otros
// - Deploy lento (todo debe compilarse y testearse junto)
```

Con microservicios, cada funcionalidad es independiente:

```typescript
// ✅ Microservicios: cada app es independiente
// apps/auth/main.ts
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.TCP,
    options: { port: 3001 },
  });
  await app.listen();
}

// apps/pedidos/main.ts
async function bootstrap() {
  const app = await NestFactory.createMicroservice(PedidosModule, {
    transport: Transport.RMQ,  // RabbitMQ
    options: { urls: ['amqp://localhost:5672'], queue: 'pedidos_queue' },
  });
  await app.listen();
}

// apps/api-gateway/main.ts — API Gateway (punto de entrada)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
```

## Cómo funciona

### Arquitectura de microservicios NestJS

```
                    ┌─────────────────────────┐
                    │      API Gateway         │
                    │    (NestJS HTTP)         │
                    │    Puerto: 3000          │
                    └────┬──────┬──────┬──────┘
                         │      │      │
          ┌──────────────┘      │      └──────────────┐
          ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Auth Service     │  │ Pedidos Service  │  │ Productos Srv    │
│ TCP :3001        │  │ RabbitMQ         │  │ Kafka            │
│                  │  │                  │  │                  │
│ Login, Registro  │  │ CRUD Pedidos     │  │ CRUD Productos   │
│ JWT, Roles       │  │ Estados          │  │ Stock, Precios   │
└──────┬───────────┘  └──────┬───────────┘  └──────┬───────────┘
       │                     │                      │
       └─────────────────────┼──────────────────────┘
                             ▼
                   ┌──────────────────┐
                   │  Notificaciones  │
                   │  RabbitMQ        │
                   │                  │
                   │  Email, SMS,     │
                   │  Push            │
                   └──────────────────┘
```

### Transportes disponibles

| Transporte | Paquete | Cuándo usarlo |
|---|---|---|
| **TCP** | Nativo | Comunicación simple entre servicios NestJS |
| **Redis** | `@nestjs/microservices` | Pub/sub, colas simples |
| **RabbitMQ** | `amqplib` | Colas robustas, routing complejo |
| **Kafka** | `kafkajs` | Streaming, eventos, alto throughput |
| **MQTT** | `mqtt` | IoT, dispositivos ligeros |
| **gRPC** | `@grpc/grpc-js` | Comunicación performante, definición .proto |

## Sintaxis

### Instalación

```bash
npm install @nestjs/microservices
# Para RabbitMQ: npm install amqplib
# Para Kafka: npm install kafkajs
# Para gRPC: npm install @grpc/grpc-js @grpc/proto-loader
```

### Crear microservicio

```typescript
// main.ts — Microservicio TCP
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3001,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });
  await app.listen();
}
```

### Patrones de mensajes

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsuariosController {
  @MessagePattern({ cmd: 'crear_usuario' })  // Patrón command
  async crear(@Payload() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);
  }

  @MessagePattern({ cmd: 'obtener_usuario' })
  async obtener(@Payload() id: string) {
    return this.usuariosService.obtenerPorId(id);
  }

  @MessagePattern({ cmd: 'listar_usuarios' })
  async listar(@Payload() filtros: BuscarDto) {
    return this.usuariosService.buscar(filtros);
  }
}
```

## Ejemplo básico

API Gateway + Microservicio TCP de usuarios.

<CodeGroup>
<CodeGroupItem title="apps/users-service/main.ts">

```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 3001 },
  });
  await app.listen();
  console.log('Microservicio de usuarios corriendo en puerto 3001');
}
```

</CodeGroupItem>

<CodeGroupItem title="apps/users-service/users.controller.ts">

```typescript
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'crear_usuario' })
  async crear(@Payload() dto: CrearUsuarioDto) {
    return this.usersService.crear(dto);
  }

  @MessagePattern({ cmd: 'obtener_usuario' })
  async obtener(@Payload() data: { id: string }) {
    return this.usersService.obtenerPorId(data.id);
  }

  @MessagePattern({ cmd: 'listar_usuarios' })
  async listar() {
    return this.usersService.obtenerTodos();
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="apps/api-gateway/users-client.controller.ts">

```typescript
import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('usuarios')
export class UsersClientController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    return this.usersClient.send({ cmd: 'crear_usuario' }, dto);
  }

  @Get()
  async listar() {
    return this.usersClient.send({ cmd: 'listar_usuarios' }, {});
  }

  @Get(':id')
  async obtener(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'obtener_usuario' }, { id });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="apps/api-gateway/app.module.ts">

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
    ]),
  ],
  controllers: [UsersClientController],
})
export class AppModule {}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Microservicios con RabbitMQ (event-driven), comunicación híbrida HTTP+MS y patrones event vs message.

```typescript
// Configuración con RabbitMQ
// apps/api-gateway/app.module.ts
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PEDIDOS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'pedidos_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
})
export class AppModule {}

// apps/pedidos-service/main.ts
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PedidosModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'pedidos_queue',
      noAck: false,
      queueOptions: { durable: false },
    },
  });
  await app.listen();
}

// Event pattern (fire-and-forget) vs Message pattern (request-response)
@Controller()
export class PedidosController {
  // Message pattern: espera respuesta
  @MessagePattern({ cmd: 'crear_pedido' })
  async crear(@Payload() dto: CrearPedidoDto) {
    return this.pedidosService.crear(dto);
  }

  // Event pattern: no espera respuesta (fire-and-forget)
  @EventPattern('pedido_creado')
  async onPedidoCreado(@Payload() data: any) {
    await this.notificacionesService.enviarEmail(data.usuarioEmail, 'Pedido confirmado');
  }
}
```

## Ejemplo avanzado

API Gateway con múltiples transportes, manejo de errores, circuit breaker y tracing distribuido.

<CodeGroup>
<CodeGroupItem title="custom-client-proxy.ts">

```typescript
// ClientProxy con reintentos y timeout
@Injectable()
export class ResilientClientProxy {
  constructor(private readonly client: ClientProxy) {}

  async sendWithRetry<T>(pattern: any, data: any, retries = 3): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await firstValueFrom(
          this.client.send(pattern, data).pipe(timeout(5000)),
        );
      } catch (error) {
        if (attempt === retries) throw error;
        console.warn(`Intento ${attempt} falló, reintentando...`);
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="tracing.interceptor.ts">

```typescript
// Tracing distribuido (trazabilidad entre servicios)
@Injectable()
export class TracingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const traceId = request.headers['x-trace-id'] || crypto.randomUUID();

    // Propagar trace-id a microservicios
    request.traceId = traceId;

    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log(`[${traceId}] ${request.method} ${request.url} - ${Date.now() - start}ms`);
      }),
    );
  }
}

// En el microservicio:
@MessagePattern({ cmd: 'crear_usuario' })
async crear(@Payload() dto: CrearUsuarioDto, @Ctx() context: RmqContext) {
  const traceId = context.getMessage().properties.headers['x-trace-id'];
  console.log(`[${traceId}] Procesando crear_usuario`);
  return this.usuariosService.crear(dto);
}
```

</CodeGroupItem>

<CodeGroupItem title="api-gateway-completo.ts">

```typescript
// API Gateway con múltiples microservicios
@Module({
  imports: [
    ClientsModule.register([
      { name: 'AUTH_SERVICE', transport: Transport.TCP, options: { port: 3001 } },
      { name: 'USERS_SERVICE', transport: Transport.TCP, options: { port: 3002 } },
      { name: 'PEDIDOS_SERVICE', transport: Transport.RMQ, options: { urls: ['amqp://...'], queue: 'pedidos' } },
      { name: 'PAGOS_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['localhost:9092'] } } },
      { name: 'NOTIFICACIONES_SERVICE', transport: Transport.REDIS, options: { host: 'localhost', port: 6379 } },
    ]),
  ],
  controllers: [GatewayController],
})
export class AppModule {}
```

</CodeGroupItem>
</CodeGroup>

## Buenas prácticas

### 1. API Gateway como único punto de entrada

```typescript
// Solo el API Gateway expone HTTP al exterior
// Los microservicios internos solo se comunican vía TCP/RabbitMQ/Kafka
// Esto centraliza: auth, rate-limiting, logging, versión de API
```

### 2. Usa patrones de mensaje para request-response y eventos para fire-and-forget

```typescript
// Message pattern: esperas respuesta (request-response)
@MessagePattern({ cmd: 'obtener_usuario' })
async obtener(@Payload() id: string) { return ...; }

// Event pattern: no esperas respuesta (fire-and-forget)
@EventPattern('usuario_creado')
async onCreado(@Payload() data: any) { /* efecto secundario */ }
```

### 3. Maneja errores con reintentos y circuit breaker

```typescript
// Usa timeout y reintentos en ClientProxy
firstValueFrom(client.send(pattern, data).pipe(
  timeout(5000),
  retry(3),
  catchError(err => { /* fallback */ }),
));
```

### 4. Define contratos compartidos entre servicios

```typescript
// shared/contracts/user.contract.ts
export const USER_PATTERNS = {
  CREATE: { cmd: 'crear_usuario' },
  FIND_BY_ID: { cmd: 'obtener_usuario' },
  FIND_ALL: { cmd: 'listar_usuarios' },
} as const;

export interface CreateUserRequest { nombre: string; email: string; password: string; }
export interface UserResponse { id: string; nombre: string; email: string; }
```

### 5. Centraliza configuración de clientes

```typescript
// ConfigService para clientes
ClientsModule.registerAsync([
  {
    name: 'USERS_SERVICE',
    useFactory: (config: ConfigService) => ({
      transport: Transport.TCP,
      options: { host: config.get('USERS_HOST'), port: config.get('USERS_PORT') },
    }),
    inject: [ConfigService],
  },
]);
```

## Errores comunes

### 1. Timeouts sin manejo

```typescript
// ❌ Petición colgada si el microservicio no responde
this.client.send(pattern, data);  // Sin timeout, puede colgarse

// ✅ Correcto: timeout
firstValueFrom(this.client.send(pattern, data).pipe(timeout(5000)));
```

### 2. No manejar errores de conexión

```typescript
// ❌ Error: si el microservicio no está disponible, lanza excepción
try {
  return await firstValueFrom(this.client.send(pattern, data));
} catch (error) {
  throw new ServiceUnavailableException('Servicio no disponible');
}
```

### 3. Acoplar clientes a implementaciones específicas

```typescript
// ❌ Acoplado: cambiar transporte requiere cambiar código
this.tcpClient.send(...);

// ✅ Desacoplado: usar ClientProxy
constructor(@Inject('USERS_SERVICE') private client: ClientProxy) {}
```

### 4. Microservicios que se llaman en cadena síncrona

```typescript
// ❌ Cadena síncrona: A espera a B que espera a C → lento y frágil
// API → Auth → Users → Pedidos → Pagos → (todo en un request)

// ✅ Asíncrono: eventos y colas
// API → Auth (responde rápido)
// Auth emite evento "usuario_autenticado" → Users, Pedidos, Pagos reaccionan
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Módulos** | Cada microservicio es un módulo NestJS independiente. |
| **Gateway** | Punto de entrada único que enruta a microservicios. |
| **RabbitMQ/Kafka** | Transportes para comunicación asíncrona y colas. |
| **Eventos** | `@EventPattern` para comunicación fire-and-forget. |
| **Mensajes** | `@MessagePattern` para comunicación request-response. |
| **ClientProxy** | Cliente para conectarse a un microservicio. |
| **Deployment** | Cada microservicio se despliega independientemente (Docker, K8s). |

## Resumen

- Los **microservicios** dividen la app en servicios independientes y desplegables por separado.
- `@nestjs/microservices` provee transportes: TCP, Redis, RabbitMQ, Kafka, MQTT, gRPC.
- `@MessagePattern()` para request-response (cliente espera respuesta).
- `@EventPattern()` para fire-and-forget (cliente no espera respuesta).
- `ClientProxy` se inyecta en el API Gateway para comunicarse con servicios.
- `ClientsModule.register()` configura los clientes en el gateway.
- El **API Gateway** es el único punto de entrada HTTP al sistema.
- Usa **timeout y reintentos** para manejar fallos de red.
- Define **contratos compartidos** entre servicios (patrones y DTOs).
- Cada microservicio tiene su propio `main.ts`, módulo y puerto.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la diferencia entre `@MessagePattern()` y `@EventPattern()`?</summary>

**Respuesta:** `@MessagePattern()` es para comunicación **request-response**: el cliente envía un mensaje y espera una respuesta. `@EventPattern()` es para **fire-and-forget**: el cliente emite un evento y no espera respuesta, ideal para efectos secundarios como notificaciones.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué es un API Gateway en arquitectura de microservicios?</summary>

**Respuesta:** Es el **único punto de entrada** público del sistema. Recibe peticiones HTTP y las enruta al microservicio correspondiente usando `ClientProxy`. Centraliza autenticación, rate-limiting, logging y versionado.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cómo manejas la comunicación entre microservicios si uno de ellos está caído?</summary>

**Respuesta:** Con **timeouts** (para no quedar colgado), **reintentos** (con backoff exponencial), y **circuit breaker** (para no saturar un servicio caído). También puedes usar **colas** (RabbitMQ/Kafka) para persistir mensajes hasta que el servicio esté disponible.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué transporte de microservicios usarías para alto throughput y streaming de eventos?</summary>

**Respuesta:** **Kafka**. Está diseñado para alto throughput, persistencia de eventos, y procesamiento en tiempo real. Ideal para sistemas de eventos, auditoría, y data pipelines. RabbitMQ es mejor para colas de trabajo y routing complejo.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo desacoplas un cliente de microservicio del transporte específico?</summary>

**Respuesta:** Usando `ClientProxy` y `ClientsModule`. En lugar de inyectar un cliente TCP específico, inyectas `@Inject('SERVICE_NAME') private client: ClientProxy` y la configuración del transporte se define en el módulo. Si cambias TCP a RabbitMQ, solo cambias la config del módulo, no el código del controlador.
</details>
