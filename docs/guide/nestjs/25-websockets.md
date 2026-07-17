---
title: WebSockets en NestJS
description: Aprende WebSockets en NestJS, gateways, decoradores, salas, eventos, autenticación, WebSocket adapters, integración con Angular/React y websockets híbridos HTTP+WS.
---

# WebSockets en NestJS

Los WebSockets son como **una llamada telefónica en lugar de cartas**: con HTTP, envías una carta (request) y esperas otra de vuelta (response). Con WebSockets, abres una línea directa donde ambos pueden hablar en cualquier momento.

## ¿Qué es?

**WebSocket** es un protocolo de comunicación bidireccional y full-duplex sobre un único socket TCP. A diferencia de HTTP (donde el cliente siempre inicia la comunicación), WebSocket permite que el **servidor envíe datos al cliente activamente** en cualquier momento.

NestJS abstrae la complejidad de WebSockets con **Gateways** — clases decoradas con `@WebSocketGateway()` que manejan eventos, conexiones y salas.

```typescript
import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @SubscribeMessage('mensaje')
  handleMensaje(@MessageBody() data: { usuario: string; texto: string }): void {
    console.log(`Mensaje de ${data.usuario}: ${data.texto}`);
  }
}
```

## ¿Por qué es importante?

Los WebSockets son esenciales para aplicaciones que requieren **comunicación en tiempo real**:

- **Notificaciones instantáneas**: el servidor avisa al cliente sin que éste pregunte.
- **Chats y mensajería**: comunicación bidireccional fluida.
- **Tableros en tiempo real**: dashboards que se actualizan solos.
- **Juegos multiplayer**: estado sincronizado entre todos los jugadores.
- **Colaboración en vivo**: documentos editados por múltiples usuarios (Google Docs).
- **Streaming de datos**: precios de bolsa, deportes en vivo, monitoreo IoT.

:::tip
No todo necesita WebSockets. Si puedes resolverlo con polling HTTP (ej: actualizar cada 30s) o SSE (Server-Sent Events), tal vez no necesites WebSockets. Úsalos cuando realmente necesites **bidireccionalidad** o **baja latencia**.
:::

## Problema que resuelve

Sin WebSockets, la comunicación en tiempo real en HTTP es ineficiente:

```typescript
// ❌ Polling HTTP: el cliente pregunta constantemente
setInterval(async () => {
  const response = await fetch('/api/mensajes/nuevos');
  const mensajes = await response.json();
  actualizarUI(mensajes);
}, 1000);  // 1 request por segundo = 86,400 requests/día por cliente

// ❌ Problemas:
// - Latencia de hasta 1 segundo (el intervalo)
// - Peticiones innecesarias cuando no hay datos nuevos
// - Alto consumo de ancho de banda y servidor
// - No es realmente "tiempo real"
```

Con WebSockets, el servidor empuja los datos solo cuando hay cambios:

```typescript
// ✅ WebSocket: el servidor avisa cuando hay novedades
// gateway/mensajes.gateway.ts
@WebSocketGateway({ namespace: 'chat' })
export class MensajesGateway {
  @SubscribeMessage('nuevo-mensaje')
  async handleNuevoMensaje(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CrearMensajeDto,
  ) {
    const mensaje = await this.mensajesService.crear(dto);
    // Emitir a TODOS los clientes conectados
    this.server.emit('mensaje-recibido', mensaje);
  }
}

// 🖥️ Cliente
const socket = io('/chat');
socket.on('mensaje-recibido', (mensaje) => {
  actualizarUI(mensaje);  // ← Llega instantáneamente
});
```

## Cómo funciona

### Handshake HTTP → WebSocket

```
Cliente                          Servidor
  │                                  │
  │  GET /chat (HTTP Upgrade)        │
  │  Headers: Upgrade: websocket     │
  │─────────────────────────────────▶│
  │                                  │
  │  101 Switching Protocols         │
  │─────────────────────────────────▶│
  │                                  │
  │   🔗 Conexión WebSocket abierta  │
  │                                  │
  │  --- comunicación bidireccional -│
  │                                  │
  │  event: 'mensaje', data: "hola"  │
  │─────────────────────────────────▶│
  │                                  │
  │  event: 'respuesta', data: "ok"  │
  │◀─────────────────────────────────│
  │                                  │
  │  (cualquiera puede iniciar)      │
  │                                  │
  │  event: 'notificacion'           │
  │◀─────────────────────────────────│  ← Servidor inicia
  │                                  │
```

### Arquitectura de NestJS WebSockets

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Cliente 1  │────▶│                  │◀────│  Cliente 3  │
│  (Angular)  │     │   WebSocket      │     │  (React)    │
└─────────────┘     │   Gateway        │     └─────────────┘
                    │   (NestJS)       │
┌─────────────┐     │                  │     ┌─────────────┐
│  Cliente 2  │────▶│  - Recibe events │◀────│  Cliente 4  │
│  (React)    │     │  - Emite events  │     │  (iOS)      │
└─────────────┘     │  - Salas (rooms) │     └─────────────┘
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Servicios      │
                    │   NestJS         │
                    │  (lógica común)  │
                    └──────────────────┘
```

### Provider `WebSocketServer`

El objeto `server` (instancia de `Socket.IO Server`) se inyecta con el decorador `@WebSocketServer()`:

```typescript
@WebSocketGateway()
export class MiGateway {
  @WebSocketServer()
  server: Server;  // Socket.IO Server instance

  // Con esto puedes emitir a todos los clientes conectados
  emitirATodos(evento: string, data: any) {
    this.server.emit(evento, data);
  }
}
```

## Sintaxis

### Decoradores principales

| Decorador | Descripción |
|---|---|
| `@WebSocketGateway(opts?)` | Marca una clase como gateway WebSocket |
| `@SubscribeMessage(evento)` | Escucha un evento entrante |
| `@MessageBody()` | Extrae el cuerpo del mensaje |
| `@ConnectedSocket()` | Obtiene el socket del cliente conectado |
| `@WebSocketServer()` | Inyecta el servidor Socket.IO |
| `@WsGateway()` | (Alias) Marca una clase como gateway |

### Opciones de `@WebSocketGateway()`

```typescript
@WebSocketGateway({
  namespace: 'chat',           // Namespace Socket.IO
  path: '/ws',                 // Path personalizado
  cors: { origin: '*' },       // CORS para WebSocket
  transports: ['websocket'],   // Solo WebSocket (sin polling)
  pingInterval: 10000,         // Ping cada 10s
  pingTimeout: 5000,           // Timeout de ping
})
export class ChatGateway {}
```

### Eventos del ciclo de vida

| Evento de Socket.IO | Decorador/Método | Cuándo ocurre |
|---|---|---|
| `connection` | `handleConnection()` | Cliente se conecta |
| `disconnect` | `handleDisconnect()` | Cliente se desconecta |
| Cualquier string | `@SubscribeMessage('nombre')` | Cliente envía evento personalizado |

## Ejemplo básico

Chat simple con WebSockets en NestJS.

<CodeGroup>
<CodeGroupItem title="chat.gateway.ts">

```typescript
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private usuariosConectados = 0;

  handleConnection(client: Socket) {
    this.usuariosConectados++;
    console.log(`Cliente conectado: ${client.id}`);
    this.server.emit('usuarios-conectados', this.usuariosConectados);
  }

  handleDisconnect(client: Socket) {
    this.usuariosConectados--;
    console.log(`Cliente desconectado: ${client.id}`);
    this.server.emit('usuarios-conectados', this.usuariosConectados);
  }

  @SubscribeMessage('mensaje')
  handleMensaje(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { usuario: string; texto: string; sala: string },
  ) {
    console.log(`Mensaje de ${data.usuario}: ${data.texto}`);

    // Emitir a todos en la sala
    this.server.to(data.sala).emit('mensaje-recibido', {
      usuario: data.usuario,
      texto: data.texto,
      hora: new Date().toISOString(),
      socketId: client.id,
    });
  }

  @SubscribeMessage('unirse-sala')
  handleUnirseSala(
    @ConnectedSocket() client: Socket,
    @MessageBody() sala: string,
  ) {
    client.join(sala);
    console.log(`${client.id} se unió a la sala ${sala}`);
    this.server.to(sala).emit('notificacion', {
      texto: `Nuevo usuario en ${sala}`,
      sala,
    });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="chat.module.ts">

```typescript
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}
```

</CodeGroupItem>

<CodeGroupItem title="cliente.html (Angular/React simple)">

```html
<!DOCTYPE html>
<html>
<head>
  <title>Chat WebSocket</title>
  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
</head>
<body>
  <input id="nombre" placeholder="Tu nombre" />
  <input id="sala" placeholder="Sala" />
  <button onclick="unirse()">Unirse a sala</button>
  <hr />
  <input id="mensaje" placeholder="Escribe un mensaje..." />
  <button onclick="enviar()">Enviar</button>
  <div id="mensajes"></div>

  <script>
    const socket = io('http://localhost:3000/chat');

    socket.on('connect', () => {
      console.log('Conectado:', socket.id);
    });

    socket.on('mensaje-recibido', (data) => {
      const div = document.getElementById('mensajes');
      div.innerHTML += `<p><b>${data.usuario}:</b> ${data.texto} <small>${data.hora}</small></p>`;
    });

    socket.on('notificacion', (data) => {
      const div = document.getElementById('mensajes');
      div.innerHTML += `<p><i>🔔 ${data.texto}</i></p>`;
    });

    socket.on('usuarios-conectados', (count) => {
      document.title = `Chat (${count} usuarios)`;
    });

    function unirse() {
      const sala = document.getElementById('sala').value;
      socket.emit('unirse-sala', sala);
    }

    function enviar() {
      const nombre = document.getElementById('nombre').value;
      const texto = document.getElementById('mensaje').value;
      const sala = document.getElementById('sala').value;
      socket.emit('mensaje', { usuario: nombre, texto, sala });
      document.getElementById('mensaje').value = '';
    }
  </script>
</body>
</html>
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Sistema de notificaciones en tiempo real con autenticación JWT y salas por usuario.

<CodeGroup>
<CodeGroupItem title="notificaciones.gateway.ts">

```typescript
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: ['http://localhost:4200', 'https://miapp.com'] },
  namespace: 'notificaciones',
})
@Injectable()
export class NotificacionesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  // Mapa de usuarioId → socketId
  private usuarios = new Map<string, string>();

  async handleConnection(client: Socket) {
    try {
      // Autenticar vía handshake query o auth
      const token = client.handshake.auth.token || client.handshake.query.token;
      if (!token) throw new UnauthorizedException();

      const payload = await this.jwtService.verifyAsync(token as string);
      const usuarioId = payload.sub;

      // Asociar socket al usuario
      this.usuarios.set(usuarioId, client.id);
      client.data.usuarioId = usuarioId;

      // Unir a sala personal del usuario
      client.join(`usuario:${usuarioId}`);
      console.log(`Usuario ${usuarioId} conectado (socket: ${client.id})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const usuarioId = client.data.usuarioId;
    if (usuarioId) {
      this.usuarios.delete(usuarioId);
      console.log(`Usuario ${usuarioId} desconectado`);
    }
  }

  // Método público para que los servicios emitan notificaciones
  notificar(usuarioId: string, notificacion: NotificacionDto): void {
    this.server.to(`usuario:${usuarioId}`).emit('notificacion', notificacion);
  }

  notificarMultiplesUsuarios(usuariosIds: string[], notificacion: NotificacionDto): void {
    for (const id of usuariosIds) {
      this.server.to(`usuario:${id}`).emit('notificacion', notificacion);
    }
  }

  notificarATodos(notificacion: NotificacionDto): void {
    this.server.emit('notificacion-global', notificacion);
  }

  @SubscribeMessage('marcar-leido')
  async handleMarcarLeido(
    @ConnectedSocket() client: Socket,
    @MessageBody() notificacionId: string,
  ) {
    await this.notificacionesService.marcarLeido(notificacionId, client.data.usuarioId);
    client.emit('notificacion-actualizada', { id: notificacionId, leido: true });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="notificaciones.service.ts">

```typescript
@Injectable()
export class NotificacionesService {
  constructor(
    private readonly notificacionesGateway: NotificacionesGateway,
  ) {}

  async crear(dto: CrearNotificacionDto): Promise<Notificacion> {
    const notificacion = await this.repo.save({
      usuarioId: dto.usuarioId,
      tipo: dto.tipo,
      mensaje: dto.mensaje,
      leido: false,
      creadoEn: new Date(),
    });

    // Emitir en tiempo real
    this.notificacionesGateway.notificar(dto.usuarioId, {
      id: notificacion.id,
      tipo: dto.tipo,
      mensaje: dto.mensaje,
      timestamp: notificacion.creadoEn.toISOString(),
    });

    return notificacion;
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="cliente-angular.service.ts">

```typescript
// Angular: Servicio de notificaciones
@Injectable({ providedIn: 'root' })
export class NotificacionesRealtimeService {
  private socket: Socket;

  constructor(private authService: AuthService) {
    this.conectar();
  }

  private conectar(): void {
    const token = this.authService.getToken();

    this.socket = io('http://localhost:3000/notificaciones', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Conectado a notificaciones');
    });

    this.socket.on('notificacion', (data: NotificacionDto) => {
      // Emitir evento para que los componentes reaccionen
      this.notificacionSubject.next(data);
    });
  }

  onNotificacion(): Observable<NotificacionDto> {
    return this.notificacionSubject.asObservable();
  }

  marcarLeido(id: string): void {
    this.socket.emit('marcar-leido', id);
  }

  desconectar(): void {
    this.socket.disconnect();
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo avanzado

Gateway híbrido HTTP+WebSocket, adaptador personalizado, salas dinámicas y rate-limiting en WebSocket.

<CodeGroup>
<CodeGroupItem title="hybrid.gateway.ts">

```typescript
// Gateway que funciona con HTTP y WebSocket simultáneamente
@WebSocketGateway({
  namespace: 'colaboracion',
  cors: { origin: '*' },
})
@Controller('colaboracion')
export class ColaboracionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  // Salas por documento (edición colaborativa)
  private documentos = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    console.log(`Socket conectado: ${client.id}`);
  }

  @SubscribeMessage('unirse-documento')
  handleUnirseDocumento(
    @ConnectedSocket() client: Socket,
    @MessageBody() documentoId: string,
  ) {
    client.join(`doc:${documentoId}`);

    if (!this.documentos.has(documentoId)) {
      this.documentos.set(documentoId, new Set());
    }
    this.documentos.get(documentoId)!.add(client.id);

    // Notificar a otros usuarios en el documento
    client.to(`doc:${documentoId}`).emit('usuario-conectado', {
      socketId: client.id,
      usuariosActivos: this.documentos.get(documentoId)!.size,
    });

    return { exito: true, usuariosActivos: this.documentos.get(documentoId)!.size };
  }

  @SubscribeMessage('editar')
  handleEditar(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { documentoId: string; cambios: any; version: number },
  ) {
    // Broadcast a todos EXCEPTO al remitente
    client.to(`doc:${data.documentoId}`).emit('cambio-aplicado', {
      cambios: data.cambios,
      version: data.version,
      aplicadoPor: client.id,
    });
  }

  // Endpoint HTTP para consultar estado de los documentos
  @Get('documentos/:id/usuarios')
  obtenerUsuariosActivos(@Param('id') id: string) {
    const doc = this.documentos.get(id);
    return {
      documentoId: id,
      usuariosActivos: doc ? doc.size : 0,
    };
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="ws-rate-limiter.ts">

```typescript
// Rate Limiter para eventos WebSocket
@Injectable()
export class WsRateLimiterMiddleware {
  private readonly store = new Map<string, number[]>();
  private readonly maxEventos = 30;  // Máx 30 eventos
  private readonly ventanaMs = 1000; // Por segundo

  async verificar(clienteId: string): Promise<void> {
    const ahora = Date.now();
    const eventos = this.store.get(clienteId) || [];
    const recientes = eventos.filter(t => ahora - t < this.ventanaMs);

    if (recientes.length >= this.maxEventos) {
      throw new WsRateLimitException(
        `Demasiados eventos. Límite: ${this.maxEventos}/s`,
      );
    }

    recientes.push(ahora);
    this.store.set(clienteId, recientes);
  }
}

// Aplicar en el gateway
@SubscribeMessage('editar')
async handleEditar(
  @ConnectedSocket() client: Socket,
  @MessageBody() data: any,
) {
  await this.rateLimiter.verificar(client.id);
  // ... manejar evento
}
```

</CodeGroupItem>

<CodeGroupItem title="adaptador personalizado (opcional)">

```typescript
// main.ts — Adaptador personalizado con config extendida
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: ['http://localhost:4200'],
        credentials: true,
      },
      pingInterval: 10000,
      pingTimeout: 5000,
      // Configuración adicional
      allowEIO3: true,  // Soporte para Engine.IO v3
      transports: ['websocket', 'polling'],
    });

    return server;
  }
}

// main.ts
const app = await NestFactory.create(AppModule);
app.useWebSocketAdapter(new CustomIoAdapter(app));
await app.listen(3000);
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema de **colaboración en tiempo real tipo Figma/Google Docs** con múltiples salas, cursor sharing y autenticación.

```
ESTRUCTURA WEBSOCKET DEL PROYECTO
─────────────────────────────────────────────────────────

Namespaces:
  /colaboracion    → Edición de documentos en tiempo real
  /chat            → Chat entre colaboradores
  /notificaciones  → Notificaciones push

Salas por documento:
  doc:<documentoId>  → Usuarios editando el mismo documento

Eventos:
  Cliente → Servidor:
    documento:unirse
    documento:salir
    documento:cambio  (OT/CRDT operations)
    documento:cursor   (posición del cursor)
    chat:mensaje

  Servidor → Cliente:
    documento:usuarios-activos
    documento:cambio-aplicado
    documento:cursor-remoto
    chat:mensaje-recibido
    usuario:conectado
    usuario:desconectado
```

```typescript
// main.ts — Configuración completa
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // HTTP API
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // WebSocket adaptador personalizado
  app.useWebSocketAdapter(new CustomIoAdapter(app));

  await app.listen(3000);
  console.log('Servidor HTTP+WS corriendo en puerto 3000');
}
```

```typescript
// cliente Angular — Hook de conexión
@Injectable({ providedIn: 'root' })
export class ColaboracionService {
  private socket: Socket;
  private documentoId: string;

  conectar(documentoId: string, token: string) {
    this.documentoId = documentoId;
    this.socket = io('http://localhost:3000/colaboracion', {
      auth: { token },
      query: { documentoId },
    });

    this.socket.emit('unirse-documento', documentoId);
  }

  enviarCambio(operacion: any) {
    this.socket.emit('documento:cambio', {
      documentoId: this.documentoId,
      operacion,
    });
  }

  actualizarCursor(posicion: { line: number; ch: number }) {
    this.socket.emit('documento:cursor', {
      documentoId: this.documentoId,
      posicion,
    });
  }

  onCambioRemoto(): Observable<any> {
    return new Observable(sub => {
      this.socket.on('documento:cambio-aplicado', (data) => sub.next(data));
    });
  }

  onCursorRemoto(): Observable<any> {
    return new Observable(sub => {
      this.socket.on('documento:cursor-remoto', (data) => sub.next(data));
    });
  }

  desconectar() {
    this.socket?.emit('salir-documento', this.documentoId);
    this.socket?.disconnect();
  }
}
```

<details>
<summary>🔍 ¿OT vs CRDT para edición colaborativa?</summary>

Para edición colaborativa en tiempo real (como Google Docs), necesitas un algoritmo de consistencia:

- **OT (Operational Transform)**: Usado por Google Docs. Transforma operaciones para que sean consistentes. Más complejo de implementar desde cero.
- **CRDT (Conflict-free Replicated Data Types)**: Usado por Figma, Notion. Permite que cada cliente tenga una copia y los cambios se fusionan automáticamente.

En NestJS, puedes usar librerías como `yjs` (CRDT) o implementar OT sobre tu gateway WebSocket.
</details>

## Buenas prácticas

### 1. Usa namespaces para separar contextos

```typescript
// ✅ Bien: namespaces separados por funcionalidad
@WebSocketGateway({ namespace: 'chat' })
@WebSocketGateway({ namespace: 'notificaciones' })
@WebSocketGateway({ namespace: 'colaboracion' })

// ❌ Mal: todo en el namespace por defecto
@WebSocketGateway()  // Namespace '/'
```

### 2. Autentica en el handshake, no en eventos

```typescript
// ✅ Bien: validar en handleConnection
async handleConnection(client: Socket) {
  const token = client.handshake.auth.token;
  if (!token) return client.disconnect();
  client.data.usuario = await this.authService.validar(token);
}

// ❌ Mal: autenticar en cada evento
@SubscribeMessage('mensaje')
async handleMensaje(@MessageBody() data: any) {
  const token = data.token;  // ← No deberías enviar token en cada mensaje
  // ...
}
```

### 3. Siempre maneja desconexiones

```typescript
handleDisconnect(client: Socket) {
  // Limpiar recursos, salir de salas, actualizar estado
  this.usuariosActivos.delete(client.id);
  this.server.emit('usuario-desconectado', { socketId: client.id });
}
```

### 4. Usa `client.to()` vs `this.server.to()` correctamente

```typescript
// Envía a todos en la sala EXCEPTO al remitente
client.to('sala').emit('evento', data);

// Envía a todos en la sala INCLUYENDO al remitente
this.server.to('sala').emit('evento', data);

// Envía solo al remitente
client.emit('evento', data);
```

### 5. Implementa rate limiting para eventos WebSocket

```typescript
@SubscribeMessage('editar')
async handleEditar(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
  // Verificar tasa de eventos
  const puedeEnviar = await this.rateLimiter.verificar(client.id);
  if (!puedeEnviar) {
    return client.emit('error', { codigo: 'RATE_LIMIT', mensaje: 'Demasiado rápido' });
  }
  // ...
}
```

### 6. Prefiere Socket.IO sobre WebSocket nativo

NestJS usa Socket.IO por defecto, que ofrece:

- **Reconexión automática** con backoff exponencial.
- **Salas** para agrupar sockets.
- **Namespaces** para separar contextos.
- **Fallback** a polling HTTP si WebSocket no está disponible.
- **Eventos con acknowledgment** (callbacks).

### 7. Tipifica los eventos

```typescript
// Tipos compartidos entre cliente y servidor
// shared/types/websocket-events.ts
export interface WsEvents {
  'mensaje': { usuario: string; texto: string; sala: string };
  'mensaje-recibido': { usuario: string; texto: string; hora: string };
  'unirse-sala': string;
  'notificacion': { texto: string; sala: string };
  'error': { codigo: string; mensaje: string };
}
```

## Errores comunes

### 1. No configurar CORS para WebSocket

```typescript
// ❌ Error: CORS bloqueado en WebSocket
@WebSocketGateway()  // Sin cors → navegador bloquea

// ✅ Correcto
@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
})
```

### 2. Olvidar el namespace en el cliente

```typescript
// ❌ Error: el servidor espera /chat, el cliente envía a /
const socket = io('http://localhost:3000');
socket.emit('mensaje', data);  // No llega al ChatGateway

// ✅ Correcto
const socket = io('http://localhost:3000/chat');
socket.emit('mensaje', data);
```

### 3. Emitir a todos cuando debería ser a una sala

```typescript
// ❌ Error: todos los clientes reciben el mensaje
this.server.emit('mensaje', data);

// ✅ Correcto: solo la sala específica
this.server.to(data.sala).emit('mensaje', data);
```

### 4. No manejar la reconexión del cliente

```typescript
// ❌ Error: si se pierde la conexión, el estado del cliente se pierde
// El cliente debe re-unirse a salas al reconectar

// ✅ Correcto en el cliente
socket.on('connect', () => {
  socket.emit('unirse-sala', salaActual);
  socket.emit('autenticar', token);
});

// ✅ Correcto en el servidor
handleConnection(client: Socket) {
  const token = client.handshake.auth.token;
  const usuario = await this.authService.validar(token);
  client.join(`usuario:${usuario.id}`);
  if (client.handshake.query.documentoId) {
    client.join(`doc:${client.handshake.query.documentoId}`);
  }
}
```

### 5. Bloquear el event loop en handlers de WebSocket

```typescript
// ❌ Error: operación pesada síncrona bloquea todos los sockets
@SubscribeMessage('procesar')
handleProcesar(@MessageBody() data: any) {
  const resultado = this.procesarPesado(data);  // Bloquea el event loop
  return resultado;
}

// ✅ Correcto: async o delegar a worker
@SubscribeMessage('procesar')
async handleProcesar(@MessageBody() data: any) {
  const resultado = await this.queueService.agregar(data);  // No bloquea
  return resultado;
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **HTTP** | WebSocket comienza como una petición HTTP (upgrade). NestJS permite gateways híbridos HTTP+WS. |
| **Eventos** | Los WebSocket se basan en eventos. `@SubscribeMessage` escucha eventos entrantes; `server.emit()` envía eventos salientes. |
| **Autenticación** | Se valida en el handshake (handleConnection) usando JWT, tokens o cookies. |
| **Guards** | Puedes aplicar guards a WebSocket con `@WsGuard()` (necesita adaptación). |
| **Pipes** | Los pipes funcionan con WebSocket para validar `@MessageBody()`. |
| **Exception Filters** | Filtros de excepciones para WebSocket con `@Catch()` y `WsException`. |
| **Microservicios** | WebSockets son una opción de transporte para microservicios NestJS. |
| **Redis** | `@nestjs/platform-socket.io` soporta Redis adapter para escalar WebSockets horizontalmente. |

## Resumen

- **WebSocket** es un protocolo bidireccional que permite comunicación en tiempo real.
- **Gateways** son clases decoradas con `@WebSocketGateway()` que manejan eventos WebSocket.
- **Socket.IO** es la librería por defecto en NestJS (abstracción sobre WebSocket).
- **Namespaces** separan contextos de comunicación (`/chat`, `/notificaciones`).
- **Salas (rooms)** agrupan sockets para emitir a subconjuntos.
- **`@SubscribeMessage('evento')`** escucha eventos entrantes del cliente.
- **`server.emit()`** envía a todos; **`client.emit()`** envía al remitente; **`client.to('sala')`** envía a sala excepto remitente.
- La **autenticación** debe hacerse en `handleConnection()`.
- Los **eventos del ciclo de vida** son `connection` y `disconnect`.
- Para **escalar WebSockets** horizontalmente, usa Redis adapter con `@socket.io/redis-adapter`.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la diferencia principal entre HTTP y WebSocket?</summary>

**Respuesta:** HTTP es unidireccional (el cliente inicia la comunicación). WebSocket es bidireccional (tanto cliente como servidor pueden iniciar comunicación en cualquier momento). WebSocket mantiene una conexión persistente, mientras que HTTP abre y cierra conexión por cada petición.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué decorador se usa para escuchar un evento entrante del cliente?</summary>

**Respuesta:** `@SubscribeMessage('nombre-del-evento')`. El método decorado se ejecuta cuando el cliente emite ese evento. Puede recibir el cuerpo del mensaje con `@MessageBody()` y el socket con `@ConnectedSocket()`.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cuál es la diferencia entre `server.emit()`, `client.emit()`, y `client.to().emit()`?</summary>

**Respuesta:** `server.emit()` envía el evento a **todos** los clientes conectados. `client.emit()` envía solo al **remitente**. `client.to('sala').emit()` envía a **todos en la sala excepto al remitente**.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo autenticas un WebSocket en NestJS?</summary>

**Respuesta:** En el método `handleConnection(client: Socket)`, extrayendo el token de `client.handshake.auth` o `client.handshake.query`, verificándolo, y llamando `client.disconnect()` si es inválido. El token se envía al conectar: `io(url, { auth: { token } })`.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Para qué sirven los namespaces y las salas en Socket.IO?</summary>

**Respuesta:** Los **namespaces** separan contextos lógicos de comunicación (ej: `/chat`, `/notificaciones`, `/colaboracion`). Las **salas (rooms)** agrupan sockets dentro de un namespace para emitir eventos a subconjuntos específicos (ej: `doc:documentoId` para colaboración en un documento). Un socket puede estar en múltiples salas simultáneamente.
</details>
