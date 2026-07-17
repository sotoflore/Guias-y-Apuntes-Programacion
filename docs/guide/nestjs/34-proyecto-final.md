---
title: Proyecto Final con NestJS
description: Guía completa para construir un proyecto final con NestJS que integra todos los conceptos aprendidos: módulos, controladores, servicios, TypeORM, autenticación JWT, WebSockets, microservicios, colas, testing y deployment.
---

# Proyecto Final con NestJS

Has recorrido todo el camino. Ahora es momento de **construir tu primera aplicación completa** combinando todo lo aprendido, como un chef que después de aprender cada técnica por separado prepara su primer gran banquete.

## ¿Qué es?

El **proyecto final** es una aplicación NestJS completa del mundo real que integra la mayoría de los conceptos del curso: autenticación, autorización, base de datos, validación, WebSockets, microservicios, colas, caché, testing y deployment.

```typescript
// Visión general del proyecto
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ /* ... */ }),
    AuthModule,
    UsersModule,
    TasksModule,
    NotificationsModule,
    ChatModule,
    ReportsModule,
    QueueModule,
    CacheModule.register({ store: redisStore, /* ... */ }),
    BullModule.forRoot({ redis: { host: 'localhost', port: 6379 } }),
  ],
})
export class AppModule {}
```

## ¿Por qué es importante?

- **Integración**: ver cómo todos los conceptos trabajan juntos.
- **Portafolio**: un proyecto completo que mostrar a empleadores.
- **Experiencia real**: enfrentar problemas reales de arquitectura.
- **Confianza**: demostrarte a ti mismo que puedes construir apps completas.
- **Base**: punto de partida para tus propios proyectos.

## Problema que resuelve

Saber conceptos aislados no es suficiente:

```typescript
// ❌ Saber conceptos por separado no prepara para el mundo real
// Sabes: módulos, DI, TypeORM, JWT, WebSockets, colas
// Pero... ¿cómo los combinas en una sola app?

// ✅ El proyecto final muestra la integración completa
// Módulos ↔ Controladores ↔ Servicios ↔ TypeORM
// JWT ↔ Guards ↔ WebSockets
// Colas ↔ Microservicios ↔ Caché
```

## Descripción del proyecto

**TaskFlow** — Una aplicación de gestión de tareas en equipo con tiempo real.

### Funcionalidades

| Funcionalidad | Tecnología | Concepto aplicado |
|---|---|---|
| Registro y login | JWT + bcrypt | Autenticación |
| CRUD de tareas | TypeORM + PostgreSQL | Base de datos |
| Roles (admin, member) | Guards + RBAC | Autorización |
| Chat en tiempo real | WebSocket + Gateway | WebSockets |
| Notificaciones push | Bull + Redis | Colas |
| Dashboard de reportes | Caché + Redis | Performance |
| Logging de actividad | Microservicio + Kafka | Microservicios |
| Tests unitarios y e2e | Jest + Supertest | Testing |
| Documentación | Swagger | API Docs |

### Estructura del proyecto

```
taskflow/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── jwt.strategy.ts
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts
│   │       └── roles.guard.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   ├── tasks/
│   │   ├── tasks.module.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.controller.ts
│   │   └── entities/
│   │       └── task.entity.ts
│   ├── chat/
│   │   ├── chat.module.ts
│   │   ├── chat.gateway.ts
│   │   └── chat.service.ts
│   ├── notifications/
│   │   ├── notifications.module.ts
│   │   ├── notifications.service.ts
│   │   ├── notifications.consumer.ts
│   │   └── notifications.gateway.ts
│   ├── reports/
│   │   ├── reports.module.ts
│   │   ├── reports.service.ts
│   │   └── reports.controller.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── dto/
│   │   │   └── pagination.dto.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   └── app.config.ts
│   ├── app.module.ts
│   └── main.ts
├── e2e/
│   └── app.e2e-spec.ts
├── test/
│   └── jest-e2e.json
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Implementación paso a paso

### 1. Configuración inicial

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'taskflow'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    ChatModule,
    NotificationsModule,
    ReportsModule,
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        ttl: 300,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 2. Módulo de autenticación (JWT)

```typescript
// auth/auth.module.ts
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES', '7d') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

// auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ ...dto, password: hashedPassword });
    await this.usersRepo.save(user);

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { user, token };
  }
}
```

### 3. Módulo de tareas (CRUD con autorización)

```typescript
// tasks/tasks.service.ts
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateTaskDto, user: User) {
    const task = this.tasksRepo.create({ ...dto, createdBy: user });
    const saved = await this.tasksRepo.save(task);

    // Encolar notificación
    await this.notificationsService.notifyTaskCreated(saved, user);

    return saved;
  }

  async findAll(user: User, pagination: PaginationDto) {
    const query = this.tasksRepo.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'assigned')
      .leftJoinAndSelect('task.createdBy', 'creator')
      .skip(pagination.skip)
      .take(pagination.take);

    // Filtro por rol: admin ve todas, member solo las suyas
    if (user.role === 'member') {
      query.where('task.assignedToId = :userId OR task.createdById = :userId',
        { userId: user.id });
    }

    return query.getManyAndCount();
  }

  @CacheEvict('tasks:dashboard')  // Limpiar caché al actualizar
  async update(id: string, dto: UpdateTaskDto, user: User) {
    const task = await this.tasksRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException();

    Object.assign(task, dto);
    return this.tasksRepo.save(task);
  }
}

// tasks/tasks.controller.ts
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(dto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query() pagination: PaginationDto) {
    return this.tasksService.findAll(user, pagination);
  }

  @Get('dashboard')
  @Roles('admin')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('tasks:dashboard')
  async getDashboard() {
    return this.tasksService.getDashboardStats();
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
```

### 4. Chat en tiempo real (WebSockets)

```typescript
// chat/chat.gateway.ts
@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, { socketId: string; userId: string }>();

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    try {
      const payload = this.jwtService.verify(token);
      this.connectedClients.set(client.id, {
        socketId: client.id,
        userId: payload.sub,
      });

      // Unir a sala de su equipo
      client.join(`team:${payload.teamId}`);

      client.emit('connected', { message: 'Conectado al chat' });
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('message:send')
  async handleMessage(client: Socket, payload: { content: string; taskId: string }) {
    // Guardar mensaje en BD
    const message = await this.chatService.saveMessage({
      content: payload.content,
      taskId: payload.taskId,
      userId: this.connectedClients.get(client.id)?.userId,
    });

    // Emitir a todos en la sala de la tarea
    this.server.to(`task:${payload.taskId}`).emit('message:new', message);
  }

  // Enviar notificación en tiempo real
  sendNotification(userId: string, notification: any) {
    const client = Array.from(this.connectedClients.values())
      .find(c => c.userId === userId);

    if (client) {
      this.server.to(client.socketId).emit('notification', notification);
    }
  }
}
```

### 5. Colas para notificaciones

```typescript
// notifications/notifications.service.ts
@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private queue: Queue,
    private chatGateway: ChatGateway,
  ) {}

  async notifyTaskCreated(task: Task, createdBy: User) {
    const job = await this.queue.add('task:created', {
      taskId: task.id,
      title: task.title,
      createdBy: createdBy.id,
      assignedTo: task.assignedToId,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });

    return { jobId: job.id };
  }

  @Cron('0 8 * * *')  // Recordatorio diario a las 8am
  async sendDailyReminders() {
    const tasksDueToday = await this.tasksService.getTasksDueToday();

    for (const task of tasksDueToday) {
      await this.queue.add('task:reminder', {
        taskId: task.id,
        userId: task.assignedToId,
        title: task.title,
      });
    }
  }
}

// notifications/notifications.consumer.ts
@Processor('notifications')
export class NotificationsConsumer {
  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly emailService: EmailService,
  ) {}

  @Process('task:created')
  async handleTaskCreated(job: Job) {
    const { assignedTo, title } = job.data;

    // Notificación en tiempo real
    this.chatGateway.sendNotification(assignedTo, {
      type: 'task:created',
      message: `Tarea asignada: ${title}`,
    });

    // Email si está fuera de línea
    await this.emailService.sendEmail(assignedTo, {
      subject: 'Nueva tarea asignada',
      body: `<h1>${title}</h1><p>Has recibido una nueva tarea.</p>`,
    });
  }

  @Process('task:reminder')
  async handleReminder(job: Job) {
    const { userId, title } = job.data;
    this.chatGateway.sendNotification(userId, {
      type: 'task:reminder',
      message: `⏰ Recordatorio: "${title}" vence hoy`,
    });
  }
}
```

### 6. Tests (unitarios y e2e)

```typescript
// tasks/tasks.service.spec.ts — Test unitario
describe('TasksService', () => {
  let service: TasksService;
  let mockRepo: MockType<Repository<Task>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn(),
            })),
          },
        },
        { provide: NotificationsService, useValue: { notifyTaskCreated: jest.fn() } },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('debería crear tarea y encolar notificación', async () => {
    const user = { id: '1', role: 'admin' } as User;
    const dto = { title: 'Test', description: 'Desc', assignedToId: '2' };
    const expected = { id: '1', ...dto, createdBy: user };

    mockRepo.create.mockReturnValue(expected);
    mockRepo.save.mockResolvedValue(expected);

    const result = await service.create(dto, user);

    expect(result).toEqual(expected);
    expect(mockRepo.create).toHaveBeenCalledWith({ ...dto, createdBy: user });
  });
});
```

### 7. Docker y deployment

```dockerfile
# Dockerfile (multi-stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main"]
```

```yaml
# docker-compose.yml
services:
  app: &app
    build: .
    ports: ['3000:3000']
    env_file: .env
    depends_on: [postgres, redis]
    restart: unless-stopped

  worker:
    <<: *app
    command: node dist/worker  # Worker separado para colas
    ports: []

  postgres:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      POSTGRES_DB: taskflow
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  redis:
    image: redis:7-alpine
    volumes: [redis-data:/data]

volumes:
  pgdata:
  redis-data:
```

## Recursos adicionales

### Plantilla para empezar

```bash
# Clonar template
git clone https://github.com/tu-usuario/nestjs-taskflow-template
cd nestjs-taskflow-template
npm install
cp .env.example .env
# Configurar BD y Redis
npm run start:dev
```

### CheckList de funcionalidades

- [ ] Autenticación JWT (registro + login)
- [ ] CRUD de tareas con TypeORM
- [ ] Roles y autorización (admin/member)
- [ ] Chat en tiempo real con WebSockets
- [ ] Notificaciones push con Bull + Redis
- [ ] Caché de dashboard con Redis
- [ ] Reportes y estadísticas
- [ ] Tests unitarios (cobertura > 70%)
- [ ] Tests e2e (flujo completo)
- [ ] Documentación con Swagger
- [ ] Docker compose para desarrollo
- [ ] CI/CD (GitHub Actions)
- [ ] Deployment (Railway / Render / AWS)

## Buenas prácticas

### 1. Organiza por dominios, no por roles técnicos

```
src/
├── auth/        # Todo lo relacionado con autenticación
├── tasks/       # Todo lo relacionado con tareas
└── chat/        # Todo lo relacionado con chat
```

### 2. Un módulo por funcionalidad

```typescript
// Cada funcionalidad es un módulo independiente
@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
```

### 3. Tests desde el día 1

```typescript
// Escribe tests mientras desarrollas, no al final
// TDD opcional, pero al menos tests después de implementar
```

### 4. Documenta con Swagger

```typescript
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Post()
  create(@Body() dto: CreateTaskDto) { /* ... */ }
}
```

### 5. Variables de entorno para todo

```typescript
// Nada hardcodeado, todo configurable
const port = config.get('PORT', 3000);
const dbHost = config.getOrThrow('DB_HOST');
```

## Errores comunes

### 1. Querer hacer todo a la vez

```typescript
// ❌ Error: intentar implementar todas las features en un día
// ✅ Correcto: feature por feature, una a la vez
// Semana 1: Auth + Users
// Semana 2: Tasks CRUD
// Semana 3: WebSockets + Chat
// Semana 4: Colas + Notificaciones
```

### 2. No escribir tests hasta el final

```typescript
// ❌ Error: "los tests los agrego después"
// (spoiler: nunca los agregas)

// ✅ Correcto: test mientras implementas
```

### 3. Ignorar el manejo de errores

```typescript
// ❌ Sin manejo de errores
try {
  await this.service.algo();
} catch (error) {
  // No hacer nada
  console.log('error');
}

// ✅ Con manejo de errores
try {
  await this.service.algo();
} catch (error) {
  this.logger.error('Error en servicio:', error);
  throw new InternalServerErrorException('Algo salió mal');
}
```

### 4. No configurar CORS para producción

```typescript
// ❌ Error: CORS no configurado
app.enableCors();  // Cualquier origen puede acceder

// ✅ Correcto: CORS restringido
app.enableCors({
  origin: ['https://miapp.com', 'https://admin.miapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});
```

## Próximos pasos

```
DESPUÉS DEL PROYECTO FINAL
────────────────────────────

  1. Despliega el proyecto en Railway/Render
  2. Agrega un frontend (React, Angular, Vue)
  3. Implementa más features:
     - Upload de archivos
     - Búsqueda con Elasticsearch
     - Pagos con Stripe
     - Exportar reportes a PDF/Excel
  4. Agrega monitoreo (Sentry, PM2)
  5. Contribuye a proyectos open source NestJS
  6. Explora:
     - NestJS + GraphQL
     - NestJS + Serverless (AWS Lambda)
     - NestJS + RabbitMQ avanzado
```

## Resumen

- El **proyecto final** integra todos los conceptos del curso.
- **TaskFlow**: app de gestión de tareas con chat, notificaciones y reportes.
- Arquitectura modular por dominio (auth, tasks, chat, notifications).
- **Autenticación JWT** + roles (admin/member).
- **CRUD** con TypeORM y PostgreSQL.
- **Chat en tiempo real** con WebSockets (Socket.IO).
- **Notificaciones asíncronas** con Bull + Redis.
- **Caché** con Redis para reportes y dashboard.
- **Tests** unitarios (Jest) y e2e (Supertest).
- **Docker** multi-stage + Docker Compose.
- **Deploy** en Railway/Render con CI/CD.
- Construye feature por feature, testea desde el inicio.

¡Felicidades! Has completado el curso de NestJS. Ahora tienes las herramientas para construir aplicaciones backend profesionales, escalables y mantenibles. El siguiente paso es **construir tu propio proyecto** y compartirlo con el mundo.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la mejor estrategia para abordar un proyecto NestJS desde cero?</summary>

Dividir el proyecto en módulos por dominio (auth, tasks, chat, notifications) e implementar una funcionalidad a la vez. Empezar con la configuración base, luego auth, luego el core CRUD, y después las features adicionales como WebSockets y colas.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué ventajas tiene separar workers de colas en procesos independientes?</summary>

Escalabilidad independiente (puedes tener más workers que servidores API), aislamiento de fallos (un worker crash no afecta la API), y optimización de recursos (workers usan CPU intensivo, API usa I/O).
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cómo decides qué va en un microservicio vs qué queda en el monolito?</summary>

Microservicios para funcionalidades que: necesitan escalar independientemente, tienen sus propios datos, equipos separados, o diferentes requisitos de recursos. En un proyecto pequeño/mediano, empieza con monolito modular y extrae microservicios cuando sea necesario.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cuál es la diferencia entre un proyecto tutorial y uno real?</summary>

Un proyecto real tiene: tests, manejo de errores, logging, monitoreo, configuración por entorno, documentación, CI/CD, seguridad (CORS, rate limiting, validación), y está diseñado para escalar y ser mantenido por un equipo.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Qué deberías hacer después de completar este proyecto final?</summary>

Desplegarlo para tenerlo en tu portafolio, agregar un frontend, explorar temas avanzados (GraphQL, serverless, microservicios reales), contribuir a proyectos open source, y empezar tu propio proyecto personal usando NestJS.
</details>
