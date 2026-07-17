---
title: Instalación y configuración de NestJS
description: Guía paso a paso para instalar NestJS, configurar el CLI, estructurar el proyecto y preparar el entorno de desarrollo con TypeScript.
---

# Instalación y configuración de NestJS

Antes de construir cualquier cosa con NestJS, necesitas preparar el taller. Aquí aprenderás a instalar todo lo necesario, crear tu primer proyecto y entender cada archivo que genera el CLI.

## ¿Qué es?

La **instalación de NestJS** es el proceso de preparar tu entorno de desarrollo para crear aplicaciones con este framework. Incluye:

- Instalar Node.js y npm
- Instalar el CLI de NestJS (`@nestjs/cli`)
- Crear un nuevo proyecto
- Entender la estructura de archivos generada
- Configurar TypeScript y variables de entorno

```bash
# Instalación mínima (sin CLI)
npm install @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs
```

## ¿Por qué es importante?

Una instalación correcta es la base de todo proyecto. Errores comunes como versiones incompatibles de Node.js, TypeScript mal configurado o dependencias faltantes pueden hacerte perder horas de debugging.

- **El CLI de NestJS** te ahorra escribir boilerplate manualmente.
- **TypeScript bien configurado** evita errores de tipo en producción.
- **Estructura de proyecto estándar** permite que cualquier dev de NestJS entienda tu código.
- **Scripts de npm configurados** agilizan el desarrollo, build y testing.

:::tip
El CLI de NestJS no es obligatorio, pero es **altamente recomendado**. Así como `create-react-app` para React o `ng new` para Angular, el CLI de NestJS genera la estructura base con las mejores prácticas ya aplicadas.
:::

## Problema que resuelve

Sin una instalación guiada, configurar un proyecto NestJS desde cero requiere:

1. Crear manualmente `tsconfig.json` con todos los flags correctos.
2. Instalar las dependencias correctas con versiones compatibles.
3. Configurar `nest-cli.json` para el build.
4. Crear la estructura de directorios a mano.
5. Configurar scripts de npm para dev, build, test.
6. Configurar el punto de entrada (`main.ts`) correctamente.

El CLI resuelve todo esto en **un solo comando**:

```bash
# ❌ Instalación manual: ~30 minutos de configuración
# ✅ Con CLI: 10 segundos
nest new mi-proyecto
```

## Cómo funciona

### Prerrequisitos

NestJS requiere **Node.js v16 o superior** (recomendado v20+ para NestJS v11).

```bash
# Verificar versiones instaladas
node --version   # ≥ 16, recomendado ≥ 20
npm --version    # ≥ 8
```

### Instalación del CLI

```bash
npm install -g @nestjs/cli
```

Esto instala el comando `nest` globalmente. Puedes verificar con:

```bash
nest --version  # Muestra la versión del CLI
```

### Creación de un nuevo proyecto

```bash
nest new nombre-del-proyecto
```

El CLI te preguntará:

1. **Package manager**: npm, yarn, pnpm (elige el que uses).
2. **Git**: si inicializar un repositorio git.

```
? Which package manager would you like to use? (Use arrow keys)
❯ npm
  yarn
  pnpm
  bun
```

### Estructura generada

```
nombre-del-proyecto/
├── src/
│   ├── app.controller.ts       # Controlador principal
│   ├── app.controller.spec.ts  # Tests del controlador
│   ├── app.module.ts           # Módulo raíz
│   ├── app.service.ts          # Servicio principal
│   └── main.ts                 # Punto de entrada
├── test/
│   ├── app.e2e-spec.ts         # Tests end-to-end
│   └── jest-e2e.json           # Config de Jest para e2e
├── node_modules/
├── .eslintrc.js                # Config de ESLint
├── .prettierrc                 # Config de Prettier
├── nest-cli.json               # Config del CLI de NestJS
├── tsconfig.json               # Config de TypeScript
├── tsconfig.build.json         # Config de TypeScript para build
├── package.json
└── README.md
```

### Scripts de package.json

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

### Flujo de arranque

```
npm run start:dev
    ↓
nest start --watch
    ↓
tsc compila TypeScript → /dist
    ↓
Node ejecuta dist/main.js
    ↓
NestFactory.create(AppModule)
    ↓
Express server escucha en puerto 3000
    ↓
Watcher monitorea cambios → recompila automáticamente
```

## Sintaxis

### Comandos del CLI

| Comando | Descripción |
|---|---|
| `nest new <nombre>` | Crea un nuevo proyecto |
| `nest generate module <nombre>` | Genera un módulo |
| `nest generate controller <nombre>` | Genera un controlador |
| `nest generate service <nombre>` | Genera un servicio |
| `nest generate guard <nombre>` | Genera un guard |
| `nest generate pipe <nombre>` | Genera un pipe |
| `nest generate interceptor <nombre>` | Genera un interceptor |
| `nest generate filter <nombre>` | Genera un exception filter |
| `nest generate middleware <nombre>` | Genera un middleware |
| `nest generate class <nombre>` | Genera una clase genérica |
| `nest build` | Compila el proyecto a JavaScript |
| `nest start` | Inicia la aplicación |
| `nest info` | Muestra información del entorno |

### Abreviaturas del CLI

```bash
nest g mo usuarios     # module
nest g co usuarios     # controller
nest g s usuarios      # service
nest g gu auth         # guard
nest g pi validate     # pipe
nest g int transform   # interceptor
nest g f http-error    # filter
nest g mi logger       # middleware
```

## Ejemplo básico

Crear y ejecutar tu primer proyecto NestJS.

```bash
# Paso 1: Instalar el CLI
npm install -g @nestjs/cli

# Paso 2: Crear proyecto
nest new mi-primera-api
# Selecciona npm como package manager

# Paso 3: Entrar al directorio
cd mi-primera-api

# Paso 4: Iniciar en modo desarrollo
npm run start:dev

# Paso 5: Abrir navegador en http://localhost:3000
# Deberías ver: Hello World!
```

```typescript
// src/main.ts (generado automáticamente)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

```typescript
// src/app.controller.ts (generado automáticamente)
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

## Ejemplo intermedio

Configuración de un proyecto con ESLint, Prettier, Debugger y múltiples entornos.

```bash
# Crear proyecto con opciones avanzadas
nest new api-restful \
  --package-manager npm \
  --strict \
  --skip-git
```

<CodeGroup>
<CodeGroupItem title=".env">

```text
# Variables de entorno
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
DATABASE_URL=postgresql://localhost:5432/mi-db
JWT_SECRET=mi-secreto-super-seguro
JWT_EXPIRES_IN=1d
```

</CodeGroupItem>
<CodeGroupItem title="src/config/env.config.ts">

```typescript
export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
```

</CodeGroupItem>
<CodeGroupItem title="tsconfig.json">

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

</CodeGroupItem>
<CodeGroupItem title=".vscode/launch.json">

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "console": "integratedTerminal",
      "restart": true,
      "autoAttachChildProcesses": true
    }
  ]
}
```

</CodeGroupItem>
</CodeGroup>

```bash
# Iniciar con debugger (F5 en VSCode)
npm run start:debug

# O directamente con el CLI
nest start --debug --watch
```

## Ejemplo avanzado

Configuración profesional de un proyecto NestJS para producción con Docker, CI/CD y múltiples entornos.

```dockerfile
# Dockerfile — Multi-stage build
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY --from=development /usr/src/app ./
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

```yaml
# .dockerignore
node_modules
dist
.git
.env
*.md
```

```yaml
# docker-compose.yml
services:
  api:
    build:
      context: .
      target: development
    command: npm run start:dev
    ports:
      - '3000:3000'
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    environment:
      NODE_ENV: development
      PORT: 3000
      DATABASE_URL: postgresql://postgres:postgres@db:5432/mi-db
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mi-db
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
      - run: npm run test:e2e
```

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - build
  - test
  - deploy

variables:
  NODE_VERSION: '20'

lint:
  stage: lint
  script:
    - npm ci
    - npm run lint

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  script:
    - npm ci
    - npm test

deploy:
  stage: deploy
  script:
    - echo "Deploy a producción..."
  only:
    - main
```

<Details>
<summary>🔍 Explicación del multi-stage build</summary>

1. **Stage development**: instala dependencias completas (devDependencies incluidas).
2. **Stage build**: compila TypeScript a JavaScript en `/dist`.
3. **Stage production**: copia solo `dist/` y dependencias de producción. Imagen final mínima.
4. **docker-compose**: monta el código como volumen para hot-reload en desarrollo.

</Details>

## Caso de uso real

Script de inicialización que usan empresas como **Nike** o **Adidas** para estandarizar la creación de nuevos microservicios.

```bash
#!/bin/bash
# create-nest-service.sh — Script corporativo para crear microservicios

SERVICE_NAME=$1

if [ -z "$SERVICE_NAME" ]; then
  echo "Uso: ./create-nest-service.sh nombre-del-servicio"
  exit 1
fi

echo "🚀 Creando microservicio: $SERVICE_NAME"

# Crear proyecto
nest new $SERVICE_NAME \
  --package-manager npm \
  --strict \
  --skip-git

cd $SERVICE_NAME

# Instalar dependencias corporativas estándar
npm install @nestjs/config @nestjs/throttler @nestjs/swagger
npm install -D @types/node eslint-config-corporativo

# Crear estructura de directorios
mkdir -p src/common/{decorators,filters,guards,interceptors,pipes}
mkdir -p src/config
mkdir -p src/modules/health

# Generar health check
nest generate module modules/health
nest generate controller modules/health

# Crear archivo de configuración
cat > .env << EOF
PORT=3000
NODE_ENV=development
SERVICE_NAME=$SERVICE_NAME
EOF

# Crear archivo .env.example
cat > .env.example << EOF
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/db
JWT_SECRET=change-me
EOF

echo "✅ Microservicio $SERVICE_NAME creado exitosamente"
echo "📁 Estructura:"
tree src --charset=utf-8
```

## Buenas prácticas

### 1. Usa `--strict` al crear el proyecto

```bash
nest new proyecto --strict
```

Esto activa `strictNullChecks`, `noImplicitAny` y `strictBindCallApply` en el `tsconfig.json`.

### 2. Mantén Node.js actualizado

```bash
# Usa nvm (Windows: nvm-windows) para gestionar versiones
nvm install 20
nvm use 20
```

### 3. Configura el CLI para generar archivos sin tests

```json
// nest-cli.json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  },
  "generateOptions": {
    "spec": false  // No generar archivos .spec.ts automáticamente
  }
}
```

### 4. Usa `npm ci` en lugar de `npm install` en CI

```bash
npm ci  # Instala exactamente lo que está en package-lock.json
```

### 5. Configura el ValidationPipe desde el inicio

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(3000);
}
```

### 6. Organiza las importaciones

```typescript
// Orden recomendado
// 1. Módulos de NestJS
import { Module, Controller, Get } from '@nestjs/common';

// 2. Módulos de terceros
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// 3. Módulos propios
import { UsuariosModule } from './modules/usuarios/usuarios.module';
```

### 7. Usa `deleteOutDir` en nest-cli.json

```json
{
  "compilerOptions": {
    "deleteOutDir": true  // Limpia /dist antes de cada build
  }
}
```

## Errores comunes

### 1. Versión incorrecta de Node.js

```bash
# ❌ Error: Node.js < 16
You are running Node.js v14.x
NestJS requires Node.js v16 or higher.

# ✅ Solución: actualizar Node.js
nvm install 20
```

### 2. Olvidar instalar el CLI globalmente

```bash
# ❌ Error: comando nest no encontrado
bash: nest: command not found

# ✅ Solución: instalar globalmente
npm install -g @nestjs/cli
```

### 3. Conflictos de versiones entre paquetes

```bash
# ❌ Error: versiones incompatibles
npm ERR! ERESOLVE unable to resolve dependency tree

# ✅ Solución: usar --legacy-peer-deps o actualizar
npm install --legacy-peer-deps
# O mejor: actualizar todas las dependencias
npm update
```

### 4. No tener `experimentalDecorators` en tsconfig.json

```json
// ❌ Error: decorators no funcionan
// ✅ Configuración correcta
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 5. Puerto ocupado

```bash
# ❌ Error: puerto 3000 en uso
Error: listen EADDRINUSE :::3000

# ✅ Soluciones:
# 1. Cambiar puerto: PORT=3001 npm run start:dev
# 2. Matar proceso: npx kill-port 3000
#    (Windows: netstat -ano | findstr :3000, luego taskkill /PID <id>)
```

### 6. No incluir `reflect-metadata` en las importaciones

```typescript
// ❌ Error: decorators no funcionan
import { NestFactory } from '@nestjs/core';
// Falta: import 'reflect-metadata';

// ✅ Correcto
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **CLI de NestJS** | Herramienta fundamental para scaffolding. Todos los componentes (módulos, controladores, servicios) se generan con `nest generate`. |
| **TypeScript** | NestJS depende de TypeScript y sus decoradores. El `tsconfig.json` debe tener `experimentalDecorators` y `emitDecoratorMetadata`. |
| **Módulos** | `AppModule` es el módulo raíz generado por defecto. Todos los demás módulos se importan aquí. |
| **Main.ts** | Punto de entrada. Aquí se configuran pipes globales, filtros, CORS, Swagger y más. |
| **Variables de entorno** | `@nestjs/config` se integra con `ConfigModule.forRoot()` para leer `.env`. |
| **Docker** | Contenedoriza la aplicación para desarrollo y producción. El multi-stage build optimiza el tamaño de la imagen. |
| **Testing** | Jest se configura automáticamente. `app.controller.spec.ts` y `test/app.e2e-spec.ts` se generan por defecto. |

## Resumen

- Instala NestJS con `npm install -g @nestjs/cli` y crea proyectos con `nest new`.
- El CLI genera la estructura completa: módulo raíz, controlador, servicio, tests, ESLint, Prettier, TypeScript.
- Usa `npm run start:dev` para desarrollo con hot-reload.
- Configura `ValidationPipe` global, variables de entorno con `@nestjs/config`, y CORS desde el día uno.
- Para producción: multi-stage Docker, CI/CD con GitHub Actions o GitLab CI, y variables de entorno separadas por entorno.
- El CLI también genera componentes individuales: `nest g co`, `nest g s`, `nest g mo`, etc.
- Mantén Node.js ≥ 20, usa `--strict` en el proyecto, y no olvides `reflect-metadata`.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué comando usarías para crear un nuevo proyecto NestJS?</summary>

**Respuesta:** `nest new nombre-del-proyecto`. Durante la creación, el CLI pregunta qué package manager usar (npm, yarn, pnpm, bun).
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué flag del tsconfig.json es indispensable para que funcionen los decoradores en NestJS?</summary>

**Respuesta:** `experimentalDecorators: true` y `emitDecoratorMetadata: true`. Sin ellos, los decoradores como `@Controller()`, `@Injectable()` y `@Module()` no funcionan.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué comando del CLI genera un controlador?</summary>

**Respuesta:** `nest generate controller usuarios` o su abreviatura `nest g co usuarios`. Crea `usuarios.controller.ts` y su archivo de test.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cuál es la diferencia entre `npm run start:dev` y `npm run start:prod`?</summary>

**Respuesta:** `start:dev` ejecuta `nest start --watch`, que compila TypeScript en caliente y reinicia la app ante cambios. `start:prod` ejecuta directamente `node dist/main` desde el JavaScript compilado previamente, sin watcher.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Qué archivo se genera automáticamente en la raíz del proyecto para configurar el comportamiento del CLI de NestJS?</summary>

**Respuesta:** `nest-cli.json`. Aquí se configura el `sourceRoot`, `compilerOptions` (como `deleteOutDir`), y `generateOptions`.
</details>
