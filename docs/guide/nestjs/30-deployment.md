---
title: Deployment en NestJS
description: Aprende a desplegar aplicaciones NestJS en producción con Railway, Render, AWS, Docker, CI/CD, variables de entorno, PM2, y estrategias de despliegue.
---

# Deployment en NestJS

Desplegar una app es como **mudarte a una casa nueva**: tienes que empacar todo (build), transportarlo (deploy), conectar los servicios (BD, Redis), y asegurarte de que todo funcione antes de invitar a los invitados (usuarios).

## ¿Qué es?

El **deployment** es el proceso de llevar tu aplicación NestJS del entorno de desarrollo a un entorno de producción accesible para los usuarios. Incluye build, configuración de entorno, base de datos, dominio, HTTPS, CI/CD y monitoreo.

```typescript
// main.ts — Configuración para producción
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de producción
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'https://miapp.com',
    credentials: true,
  });

  // Swagger solo en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Docs')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT || 3000);
}
```

## ¿Por qué es importante?

- **Disponibilidad**: tu app accesible 24/7 para usuarios reales.
- **Escalabilidad**: capacidad de crecer con la demanda.
- **Seguridad**: HTTPS, variables de entorno, secretos protegidos.
- **Automatización**: CI/CD para deploys rápidos y confiables.
- **Monitoreo**: detectar problemas antes que los usuarios.

## Problema que resuelve

Sin deployment estructurado, cada publicación es un riesgo:

```typescript
// ❌ Sin deployment estructurado
// 1. Haces build manual en tu máquina
// 2. Subes archivos por FTP
// 3. Olvidas cambiar variables de entorno
// 4. La BD de desarrollo apunta a producción → 💥

// ✅ Con deployment estructurado
// 1. git push → GitHub
// 2. GitHub Actions corre tests automáticamente
// 3. Si pasan, build y deploy automático
// 4. Variables de entorno configuradas en el panel
// 5. Rollback con un click si algo falla
```

## Cómo funciona

```
FLUJO DE DEPLOYMENT TÍPICO
────────────────────────────

   [Desarrollador]
        │
        ▼
   git push (main)
        │
        ▼
   [CI/CD — GitHub Actions]
   ├── npm ci (instalar dependencias)
   ├── npm test (correr tests)
   ├── npm run build (compilar NestJS)
   ├── Lint / Type check
   └── ✅ Todo OK
        │
        ▼
   [Deploy]
   ├── Railway: git push deploy
   ├── Render: auto-deploy desde branch
   ├── AWS: S3 + ECS / Elastic Beanstalk
   └── Docker: build image → push → deploy
        │
        ▼
   [Producción]
   ├── https://miapp.com
   ├── BD PostgreSQL en producción
   ├── Redis para caché/colas
   └── HTTPS con Let's Encrypt
```

## Sintaxis

### Scripts en package.json

```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "node dist/main",
    "start:dev": "nest start --watch",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "migration:run": "npx typeorm migration:run -d dist/database.config.js"
  }
}
```

## Ejemplo básico

Deploy en Railway (plataforma simple para Node.js).

```bash
# 1. Conectar repositorio a Railway
# 2. Configurar variables de entorno

# Variables en Railway Dashboard:
PORT=3000
NODE_ENV=production
DB_HOST=tu-db.railway.app
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=xxx
DB_NAME=nestjs
JWT_SECRET=xxx-super-secreto

# 3. Railway detecta package.json y ejecuta:
#    npm run build && npm start:prod
```

## Ejemplo intermedio

Deploy con Docker y Docker Compose.

<CodeGroup>
<CodeGroupItem title="Dockerfile">

```dockerfile
# === BUILD STAGE ===
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# === PRODUCTION STAGE ===
FROM node:20-alpine

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
```

</CodeGroupItem>

<CodeGroupItem title="docker-compose.yml">

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    env_file: .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - '5432:5432'

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data

volumes:
  pgdata:
  redis-data:
```

</CodeGroupItem>

<CodeGroupItem title=".dockerignore">

```text
node_modules
dist
.git
.env
.env.*
*.md
coverage
test
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo avanzado

CI/CD con GitHub Actions, multi-entorno y migraciones automáticas.

<CodeGroup>
<CodeGroupItem title=".github/workflows/deploy.yml">

```yaml
name: Deploy NestJS

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm run build
      - run: npm test
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USER: postgres
          DB_PASSWORD: postgres
          DB_NAME: test_db
          JWT_SECRET: test_secret

  deploy:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        run: |
          # Usar Railway CLI
          npm install -g @railway/cli
          railway up --service=api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

      - name: Run migrations
        run: |
          railway run npm run migration:run
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

</CodeGroupItem>

<CodeGroupItem title="ecosystem.config.js (PM2)">

```javascript
// PM2 — Process Manager para producción
module.exports = {
  apps: [
    {
      name: 'nestjs-api',
      script: 'dist/main.js',
      instances: 'max',           // Usar todos los CPUs
      exec_mode: 'cluster',       // Modo cluster
      env: {
        NODE_ENV: 'production',
      },
      env_file: '.env.production',
      max_memory_restart: '1G',   // Reiniciar si excede 1GB
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      merge_logs: true,
      autorestart: true,
      watch: false,
    },
  ],
};
```

</CodeGroupItem>

<CodeGroupItem title="main.ts para producción">

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix global
  app.setGlobalPrefix('api/v1');

  // CORS para producción
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Rate limiting opcional
  // app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API corriendo en puerto ${port}`);
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Pipeline completo de producción con Railway, base de datos, dominio personalizado y HTTPS.

```
ARQUITECTURA DE PRODUCCIÓN
────────────────────────────

   Usuarios
      │
      ▼
   [Cloudflare] — DNS, CDN, DDoS protection, SSL
      │
      ▼
   [Railway App] — https://miapp.com
   ├── NestJS API (4 workers, cluster mode)
   ├── PostgreSQL 16
   ├── Redis 7
   └── Bull Board para monitoreo de colas
      │
      ▼
   [Monitoreo]
   ├── Sentry: errores en producción
   ├── PM2: monitoreo de procesos
   └── LogTail: logs centralizados

ENVIRONMENT VARIABLES
──────────────────────
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://miapp.com,https://admin.miapp.com
DB_HOST=postgres.railway.internal
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<secreto>
DB_NAME=nestjs_prod
JWT_SECRET=<secreto-fuerte-64-chars>
REDIS_HOST=redis.railway.internal
REDIS_PORT=6379
SENTRY_DSN=<sentry-dsn>
```

## Buenas prácticas

### 1. Variables de entorno separadas por entorno

```bash
# .env.development — Desarrollo local
DB_HOST=localhost

# .env.production — Producción (solo en el servidor)
DB_HOST=produccion.railway.internal
```

### 2. Health check endpoint

```typescript
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

### 3. Graceful shutdown

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();  // Cerrar conexiones limpiamente

  // Cerrar todo al recibir SIGTERM
  process.on('SIGTERM', async () => {
    console.log('SIGTERM recibido. Cerrando graceful...');
    await app.close();
    process.exit(0);
  });
}
```

### 4. Logs estructurados en producción

```typescript
// Usar logger en JSON para mejor parsing
app.useLogger(new Logger({
  pinoHttp: {
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty' }
      : undefined,
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  },
}));
```

### 5. Migraciones automáticas en deploy

```bash
# En el script de deploy:
# 1. Ejecutar migraciones antes de iniciar la app
npx typeorm migration:run -d dist/config/database.config.js
# 2. Iniciar la app
node dist/main
```

## Errores comunes

### 1. Olvidar cambiar variables de entorno

```bash
# ❌ Error: subir a producción con DB_HOST=localhost
# La app intenta conectar a BD local y falla

# ✅ Correcto: variables de producción en panel del hosting
```

### 2. No hacer build antes de deploy

```bash
# ❌ Error: subir código TypeScript sin compilar
npm start  # Intenta ejecutar TS directamente en producción

# ✅ Correcto: build primero
npm run build
npm start:prod  # Ejecuta dist/main.js
```

### 3. Exponer secretos en el repositorio

```bash
# ❌ Error: .env.production en el repositorio
git add .env.production
git commit -m "Add env"

# ✅ Correcto: .gitignore + variables en panel del hosting
```

### 4. No monitorear la app en producción

```typescript
// ❌ Error: sin errores ni logs en producción
// Cuando algo falla, no sabes qué pasó

// ✅ Correcto: Sentry + logs
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Configuración** | Variables de entorno en producción. |
| **Variables de entorno** | Secretos y configuración sensible. |
| **Compilación** | `nest build` compila TS a JS para producción. |
| **CLI** | `nest build` y `nest start` para build/start. |
| **TypeORM** | Migraciones automáticas en deploy. |

## Resumen

- **Build**: `npm run build` compila TypeScript a JavaScript.
- **Start producción**: `node dist/main` con `NODE_ENV=production`.
- **Docker**: Multi-stage build para imágenes livianas (alpine).
- **PM2**: Process manager con cluster mode, logs y auto-reinicio.
- **Railway/Render**: Deploy automático desde git con zero config.
- **AWS**: Elastic Beanstalk, ECS, o EC2 para más control.
- **CI/CD**: GitHub Actions corre tests y deploy automático.
- **Variables de entorno**: secretos nunca en el código, siempre en el entorno.
- **Migraciones**: ejecutar antes de iniciar la app.
- **Monitoreo**: Sentry para errores, logs estructurados, health checks.
- **Graceful shutdown**: cerrar conexiones limpiamente al detener.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la diferencia entre `npm start` y `npm run start:prod`?</summary>

`npm start` corre `nest start` (modo desarrollo con live reload). `npm run start:prod` corre `node dist/main` (código compilado, sin dev tools).
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Por qué usar multi-stage build en Docker?</summary>

Para tener una imagen final más pequeña. El stage de build tiene todas las herramientas de compilación, el stage final solo tiene el código compilado y producción de dependencias.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué es un health check endpoint y para qué sirve?</summary>

Un endpoint (`GET /health`) que devuelve el estado de la app. Los orquestadores (Railway, Docker) lo usan para saber si la app está viva y reiniciarla si no responde.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo manejas migraciones de BD en deploy?</summary>

En el script de deploy, antes de iniciar la app, ejecutas `npx typeorm migration:run`. Así la BD se actualiza antes de que la nueva versión comience a servir requests.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Qué ventaja tiene usar PM2 con cluster mode en producción?</summary>

PM2 en cluster mode crea múltiples procesos de la app (uno por CPU), distribuyendo las requests entre ellos. Esto aprovecha todos los cores del servidor, da alta disponibilidad (si un worker muere, los otros siguen) y permite zero-downtime reload.
</details>
