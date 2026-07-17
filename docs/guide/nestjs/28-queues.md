---
title: Colas (Queues) en NestJS
description: Aprende a implementar colas de trabajo en NestJS con Bull, RabbitMQ, Kafka, procesamiento background, jobs, workers, colas prioritarias, scheduling y monitoreo.
---

# Colas (Queues) en NestJS

Las colas son como **la fila de atención al cliente en un banco**: en lugar de atender a todos al mismo tiempo (lo cual colapsaría el sistema), los clientes (tareas) esperan ordenadamente hasta que un cajero (worker) esté disponible.

## ¿Qué es?

Una **cola** es un mecanismo de comunicación asíncrona donde los productores encolan tareas (jobs) y los consumidores (workers) las procesan en orden. NestJS se integra principalmente con **Bull** (Redis) y también con RabbitMQ y Kafka para manejo de colas.

```typescript
// Productor: encola un trabajo
@Injectable()
export class NotificacionesService {
  constructor(
    @InjectQueue('notificaciones') private readonly queue: Queue,
  ) {}

  async enviarNotificacion(usuarioId: string, mensaje: string) {
    await this.queue.add('email-bienvenida', {
      usuarioId,
      mensaje,
    }, {
      attempts: 3,        // Reintentar 3 veces si falla
      backoff: 2000,      // Esperar 2s entre reintentos
    });
  }
}

// Consumidor (worker): procesa el trabajo
@Processor('notificaciones')
export class NotificacionesConsumer {
  @Process('email-bienvenida')
  async enviarEmail(job: Job<{ usuarioId: string; mensaje: string }>) {
    await this.emailService.enviar(job.data.usuarioId, job.data.mensaje);
  }
}
```

## ¿Por qué es importante?

Las colas son esenciales para **operaciones asíncronas y tareas pesadas**:

- **No bloquear al usuario**: Tareas lentas (enviar emails, generar PDFs) se procesan en background.
- **Resiliencia**: Si un worker falla, el job puede reintentarse en otro worker.
- **Escalabilidad**: Añades más workers para procesar más rápido.
- **Programación**: Ejecutar tareas en horarios específicos (cron).
- **Control de flujo**: Limitar cuántas tareas se procesan simultáneamente.

## Problema que resuelve

Sin colas, las tareas pesadas bloquean la respuesta HTTP:

```typescript
// ❌ Sin cola: el usuario espera hasta que termine
@Post('registro')
async registro(@Body() dto: RegistroDto) {
  const usuario = await this.authService.registrar(dto);

  // Tareas lentas que bloquean la respuesta
  await this.emailService.enviarBienvenida(usuario.email);  // 2-5s
  await this.reportesService.generarPDF(usuario.id);        // 5-10s
  await this.analyticsService.procesar(usuario);             // 1-3s

  return { mensaje: 'Usuario creado' };  // ¡El usuario esperó 10-18s!
}
```

Con colas, respondes inmediato y procesas después:

```typescript
// ✅ Con cola: respuesta inmediata, procesamiento en background
@Post('registro')
async registro(@Body() dto: RegistroDto) {
  const usuario = await this.authService.registrar(dto);

  // Encolar tareas — respuesta inmediata (< 100ms)
  await this.notificacionesQueue.add('email-bienvenida', { usuarioId: usuario.id });
  await this.reportesQueue.add('generar-pdf-perfil', { usuarioId: usuario.id });
  await this.analyticsQueue.add('procesar-usuario', { usuarioId: usuario.id });

  return { mensaje: 'Usuario creado. Recibirás un email en breve.' };
}
```

## Cómo funciona

### Arquitectura Bull + Redis

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Productor   │     │     Redis    │     │   Worker(s)  │
│  (NestJS)    │     │   (Cola)     │     │  (NestJS)    │
│              │     │              │     │              │
│  queue.add() │────▶│  cola:jobs   │────▶│ @Process()   │
│              │     │  cola:wait   │     │  procesar()  │
│              │     │  cola:active │     │              │
│              │     │  cola:failed │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Bull vs RabbitMQ vs Kafka

| Aspecto | Bull (Redis) | RabbitMQ | Kafka |
|---|---|---|---|
| **Persistencia** | Redis (RDB/AOF) | Sí (disco) | Sí (log) |
| **Velocidad** | Muy alta | Alta | Muy alta |
| **Reintentos** | Nativos | AMQP | Manual |
| **Programación** | Sí (cron) | No nativo | No nativo |
| **Prioridades** | Sí | Sí | No |
| **UI monitoreo** | Arena / Bull Board | Management UI | Tools |
| **Mejor para** | Jobs background, Node.js | Routing complejo, microservicios | Streaming, eventos masivos |

## Sintaxis

### Instalación

```bash
npm install @nestjs/bull bull
npm install -D @types/bull
# Redis es necesario (colas Bull usan Redis)
```

### Configuración

```typescript
// app.module.ts
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,  // Mantener últimos 100 completados
        removeOnFail: 50,       // Mantener últimos 50 fallidos
      },
    }),
    BullModule.registerQueue(
      { name: 'notificaciones' },
      { name: 'reportes' },
      { name: 'analytics' },
    ),
  ],
})
export class AppModule {}
```

### Decoradores Bull

| Decorador | Propósito |
|---|---|
| `@InjectQueue('nombre')` | Inyecta la cola (productor) |
| `@Processor('nombre')` | Marca clase como consumer de la cola |
| `@Process('job-name')` | Maneja un tipo específico de job |
| `@OnQueueActive()` | Hook cuando un job empieza |
| `@OnQueueCompleted()` | Hook cuando un job termina |
| `@OnQueueFailed()` | Hook cuando un job falla |
| `@OnQueueProgress()` | Hook para progreso |

## Ejemplo básico

Cola de notificaciones con reintentos y listeners.

<CodeGroup>
<CodeGroupItem title="notificaciones.service.ts">

```typescript
@Injectable()
export class NotificacionesService {
  constructor(
    @InjectQueue('notificaciones') private readonly queue: Queue,
  ) {}

  async enviarEmailBienvenida(usuarioId: string, email: string) {
    await this.queue.add('email-bienvenida', {
      usuarioId,
      email,
      tipo: 'bienvenida',
    }, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 1000 },
      priority: 1,  // Alta prioridad
    });
  }

  async enviarNotificacionPush(usuarioId: string, titulo: string, cuerpo: string) {
    await this.queue.add('push-notification', {
      usuarioId,
      titulo,
      cuerpo,
    }, {
      attempts: 3,
      priority: 2,
    });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="notificaciones.consumer.ts">

```typescript
@Processor('notificaciones')
export class NotificacionesConsumer {
  constructor(
    private readonly emailService: EmailService,
    private readonly pushService: PushService,
  ) {}

  @Process('email-bienvenida')
  async enviarEmail(job: Job<{ usuarioId: string; email: string; tipo: string }>) {
    console.log(`Procesando job ${job.id}: email a ${job.data.email}`);

    // Simular envío (podría fallar)
    await this.emailService.enviar({
      to: job.data.email,
      subject: '¡Bienvenido!',
      template: 'welcome',
      data: { usuarioId: job.data.usuarioId },
    });

    return { enviado: true, email: job.data.email };
  }

  @Process('push-notification')
  async enviarPush(job: Job<{ usuarioId: string; titulo: string; cuerpo: string }>) {
    await this.pushService.enviar(job.data.usuarioId, {
      titulo: job.data.titulo,
      cuerpo: job.data.cuerpo,
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Job ${job.id} iniciado: ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    console.log(`Job ${job.id} completado:`, result);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} falló (intento ${job.attemptsMade}):`, error.message);
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="registro.controller.ts">

```typescript
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  @Post('registro')
  async registro(@Body() dto: RegistroDto) {
    const usuario = await this.authService.registrar(dto);

    // No esperar a que el email se envíe
    await this.notificacionesService.enviarEmailBienvenida(usuario.id, usuario.email);

    return { mensaje: 'Registro exitoso', usuarioId: usuario.id };
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Colas con progreso, jobs programados (cron), concurrencia limitada y prioridades.

```typescript
@Injectable()
export class ReportesService {
  constructor(
    @InjectQueue('reportes') private readonly queue: Queue,
  ) {}

  // Job programado: reporte diario a las 8am
  async programarReporteDiario() {
    await this.queue.add('reporte-diario', {
      tipo: 'ventas',
      fecha: new Date().toISOString(),
    }, {
      repeat: { cron: '0 8 * * *' },  // Todos los días a las 8:00
      jobId: 'reporte-diario-ventas',  // ID único para evitar duplicados
    });
  }

  // Job con seguimiento de progreso
  async generarReporteGrande(usuarioId: string) {
    const job = await this.queue.add('reporte-grande', {
      usuarioId,
      tipo: 'completo',
    });

    return { jobId: job.id };  // Devolver ID para consultar progreso
  }
}

@Processor('reportes')
export class ReportesConsumer {
  @Process('reporte-grande')
  async generarReporte(job: Job) {
    const totalPasos = 10;

    for (let paso = 1; paso <= totalPasos; paso++) {
      // Simular trabajo
      await new Promise(r => setTimeout(r, 1000));

      // Actualizar progreso (0-100)
      await job.progress(Math.round((paso / totalPasos) * 100));
    }

    return { generado: true, archivo: 'reporte.pdf' };
  }

  @Process('reporte-diario')
  async reporteDiario(job: Job) {
    console.log(`Generando reporte diario: ${job.data.tipo}`);
    await this.reporteService.generar(job.data);
  }
}

// Consultar progreso desde un endpoint
@Get('reportes/:jobId/progreso')
async obtenerProgreso(@Param('jobId') jobId: string) {
  const job = await this.reportesQueue.getJob(jobId);
  if (!job) throw new NotFoundException();

  return {
    jobId: job.id,
    estado: await job.getState(),
    progreso: job.progress(),
    resultado: job.returnvalue,
    intentos: job.attemptsMade,
  };
}
```

## Ejemplo avanzado

Múltiples colas, workers separados en procesos distintos, sandboxing y Bull Board para monitoreo.

<CodeGroup>
<CodeGroupItem title="app.module.ts">

```typescript
@Module({
  imports: [
    BullModule.forRoot({ redis: { host: 'localhost', port: 6379 } }),
    BullModule.registerQueue(
      { name: 'notificaciones', defaultJobOptions: { attempts: 3 } },
      { name: 'reportes', defaultJobOptions: { attempts: 2, timeout: 300000 } },
      { name: 'analytics', defaultJobOptions: { attempts: 1 } },
      { name: 'email', defaultJobOptions: { attempts: 5, backoff: 2000 } },
    ),
  ],
  providers: [
    NotificacionesConsumer,
    ReportesConsumer,
    AnalyticsConsumer,
    EmailConsumer,
  ],
})
export class AppModule {}
```

</CodeGroupItem>

<CodeGroupItem title="bull-board.module.ts">

```typescript
// Bull Board — UI para monitorear colas
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'notificaciones',
      adapter: BullAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'reportes',
      adapter: BullAdapter,
    }),
  ],
})
export class QueueMonitorModule {}

// Luego accedes a: http://localhost:3000/admin/queues
```

</CodeGroupItem>

<CodeGroupItem title="worker-proceso-separado.ts">

```typescript
// main.ts — Worker en proceso separado
async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  // No necesita HTTP, solo procesar colas
}

// worker.module.ts
@Module({
  imports: [
    BullModule.forRoot({ redis: { host: 'localhost', port: 6379 } }),
    BullModule.registerQueue({ name: 'notificaciones' }),
  ],
  providers: [NotificacionesConsumer],
})
export class WorkerModule {}

// Ejecutar: nest start worker | node dist/worker-main
```

</CodeGroupItem>

<CodeGroupItem name="concurrencia.ts">

```typescript
// Control de concurrencia por tipo de job
@Processor('notificaciones')
export class NotificacionesConsumer {
  @Process({
    name: 'email-bienvenida',
    concurrency: 5,  // Procesar 5 emails simultáneamente
  })
  async enviarEmail(job: Job) { /* ... */ }

  @Process({
    name: 'push-notification',
    concurrency: 10,  // Push es más rápido, 10 concurrentes
  })
  async enviarPush(job: Job) { /* ... */ }
}

// Límite global de la cola
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notificaciones',
      limiter: {
        max: 50,          // Máximo 50 jobs
        duration: 1000,   // Por segundo
      },
    }),
  ],
})
export class NotificacionesModule {}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema de procesamiento de pedidos con múltiples colas.

```
ARQUITECTURA DE COLAS
─────────────────────────────────────────────────────────

  API Gateway
       │
       ├──▶ [pedidos_queue] ──▶ ProcesarPedidoWorker
       │                           │
       │                           ├──▶ [email_queue] ──▶ EnviarEmailWorker
       │                           │
       │                           ├──▶ [factura_queue] ──▶ GenerarFacturaWorker
       │                           │
       │                           └──▶ [inventario_queue] ──▶ ActualizarStockWorker
       │
       ├──▶ [analytics_queue] ──▶ AnalyticsWorker
       │
       └──▶ [reportes_queue] ──▶ ReportesWorker (cron: 0 8 * * *)

  Colas:
  ┌─────────────────┬─────────────┬──────────────┬──────────────┐
  │ Cola            │ Jobs        │ Prioridad    │ Reintentos   │
  ├─────────────────┼─────────────┼──────────────┼──────────────┤
  │ pedidos         │ procesar    │ Alta (1)     │ 3            │
  │ email           │ bienvenida  │ Media (2)    │ 5            │
  │                 │ factura     │ Media (2)    │ 3            │
  │ inventario      │ actualizar  │ Alta (1)     │ 2            │
  │ analytics       │ evento      │ Baja (3)     │ 1            │
  │ reportes        │ diario      │ Baja (3)     │ 2            │
  └─────────────────┴─────────────┴──────────────┴──────────────┘
```

## Buenas prácticas

### 1. Usa nombres descriptivos para jobs

```typescript
// ✅ Bien: nombres descriptivos
@Process('email-bienvenida')
@Process('generar-factura-pdf')
@Process('actualizar-stock-producto')

// ❌ Mal: nombres genéricos
@Process('job1')
@Process('task')
```

### 2. Define reintentos con backoff

```typescript
this.queue.add('email', data, {
  attempts: 5,
  backoff: { type: 'exponential', delay: 2000 },
  // Reintentos: 2s, 4s, 8s, 16s, 32s
});
```

### 3. Procesa colas en workers separados

```typescript
// Separar workers del API HTTP para escalar independientemente
// API: node dist/main (puerto 3000)
// Worker: node dist/worker (solo procesa colas)
```

### 4. Monitorea colas con Bull Board

```typescript
// Bull Board muestra: jobs activos, completados, fallidos, reintentos
// http://localhost:3000/admin/queues
```

### 5. Usa `removeOnComplete` y `removeOnFail` para limpiar

```typescript
BullModule.registerQueue({
  name: 'notificaciones',
  defaultJobOptions: {
    removeOnComplete: 100,  // Conserva últimos 100 completados
    removeOnFail: 50,       // Conserva últimos 50 fallidos
  },
});
```

## Errores comunes

### 1. No manejar errores en consumers

```typescript
// ❌ Error: excepción no manejada, el job no se reintenta
@Process('email')
async enviar(job: Job) {
  throw new Error('Error inesperado');  // Se pierde
}

// ✅ Correcto: Bull maneja el error, pero puedes loguearlo
@Process('email')
async enviar(job: Job) {
  try {
    await this.emailService.enviar(job.data);
  } catch (error) {
    console.error(`Job ${job.id} falló:`, error);
    throw error;  // Bull reintentará según la configuración
  }
}
```

### 2. Jobs que nunca se completan (timeout)

```typescript
// ❌ Error: job sin timeout puede quedarse colgado para siempre
@Process('pesado')
async procesar(job: Job) {
  // Operación infinita → job nunca se completa
}

// ✅ Correcto: definir timeout
BullModule.registerQueue({
  name: 'reportes',
  defaultJobOptions: { timeout: 300000 },  // 5 min máximo
});
```

### 3. No configurar `jobId` para jobs repetitivos

```typescript
// ❌ Error: cada reinicio crea un nuevo cron job
this.queue.add('diario', data, { repeat: { cron: '0 8 * * *' } });

// ✅ Correcto: usar jobId único
this.queue.add('diario', data, {
  repeat: { cron: '0 8 * * *' },
  jobId: 'reporte-diario-ventas',  // Evita duplicados
});
```

### 4. Mezclar trabajo síncrono pesado en el event loop

```typescript
// ❌ Error: operación CPU-bound bloquea el worker
@Process('imagen')
async procesarImagen(job: Job) {
  const buffer = sharp(job.data.imagen).resize(2000).toBuffer();  // Bloquea
}

// ✅ Correcto: delegar a worker thread o child process
@Process('imagen')
async procesarImagen(job: Job) {
  await this.imageProcessor.procesarEnWorker(job.data.imagen);
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Redis** | Almacenamiento subyacente de Bull para colas. |
| **Microservicios** | Las colas pueden ser la comunicación entre servicios (RabbitMQ, Kafka). |
| **Eventos** | Las colas son para trabajo; los eventos son para notificaciones. |
| **Programación** | Bull soporta jobs cron (`repeat: { cron }`). |
| **Bull Board** | UI para monitorear y gestionar colas desde el navegador. |

## Resumen

- Las **colas** permiten procesar tareas en background sin bloquear al usuario.
- **Bull** es la librería principal para colas con NestJS (usa Redis).
- `@InjectQueue('nombre')` inyecta la cola (productor).
- `@Processor('nombre')` + `@Process('job-type')` define consumidores (workers).
- Los jobs tienen **reintentos** configurables con backoff exponencial.
- Soporta **prioridades**, **progreso**, **timeout** y **concurrencia**.
- Jobs **programados** con cron: `repeat: { cron: '0 8 * * *' }`.
- **Bull Board** proporciona UI de monitoreo en `/admin/queues`.
- Workers en **procesos separados** para escalar independientemente.
- Usa colas para: emails, generación de PDFs, procesamiento de imágenes, reportes, integraciones.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la diferencia entre una cola (Bull) y un evento (EventEmitter)?</summary>

**Respuesta:** Los **eventos** son notificaciones en tiempo real dentro del mismo proceso (pub/sub síncrono o asíncrono). Las **colas** son para trabajo diferido que puede persistir, reintentarse, programarse y procesarse en workers separados. Una cola garantiza que el trabajo se procese (aunque sea más tarde); un evento puede perderse si no hay handler.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué pasa si un job falla en Bull?</summary>

**Respuesta:** Bull reintenta el job según la configuración `attempts` y `backoff`. Si se agotan los reintentos, el job pasa a estado **failed**. Puedes configurar `removeOnFail` para limpiar jobs fallidos viejos.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cómo escalas el procesamiento de colas horizontalmente?</summary>

**Respuesta:** Ejecutando múltiples **workers** (instancias del consumer) en diferentes procesos/máquinas. Bull usa Redis como coordinador: cuando un worker está libre, toma el siguiente job de la cola. Así, más workers = más procesamiento paralelo.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo ejecutas un job todos los días a las 8am con Bull?</summary>

**Respuesta:** Usando la opción `repeat` con cron:
```typescript
this.queue.add('reporte-diario', data, {
  repeat: { cron: '0 8 * * *' },
  jobId: 'reporte-diario-unico',  // Evita duplicados
});
```
Esto programa el job para ejecutarse diariamente a las 08:00.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Para qué sirve `concurrency` en `@Process`?</summary>

**Respuesta:** Define cuántas instancias del mismo tipo de job pueden procesarse simultáneamente en el mismo worker. Por ejemplo, `concurrency: 5` permite procesar 5 emails a la vez en lugar de uno por uno. Útil cuando el procesamiento es I/O-bound (llamadas HTTP, lectura de archivos).
</details>
