---
title: Configuración en NestJS
description: Aprende a gestionar la configuración de tu aplicación NestJS con @nestjs/config, variables de entorno, validación, entornos múltiples, y mejores prácticas.
---

# Configuración en NestJS

Imagina que construyes una app que en **desarrollo** usa una base de datos local, en **testing** otra, y en **producción** una tercera. Cambiar manualmente las credenciales cada vez es como **cambiar las llaves de cada puerta de tu casa cada vez que viajas**: impráctico y propenso a errores.

## ¿Qué es?

La **configuración** en NestJS es el mecanismo para centralizar y gestionar valores variables según el entorno: credenciales de BD, URLs de APIs, puertos, secretos, etc. Se implementa con `@nestjs/config` que integra **dotenv** con el sistema de módulos de Nest.

```typescript
// configuracion.service.ts
@Injectable()
export class ConfiguracionService {
  constructor(private configService: ConfigService) {}

  get puerto() {
    return this.configService.get<number>('PORT', 3000);
  }

  get baseDatos() {
    return {
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      nombre: this.configService.get<string>('DB_NAME', 'mi_app'),
    };
  }
}
```

## ¿Por qué es importante?

- **Separa código de configuración**: el mismo código funciona en distintos entornos.
- **Seguridad**: secretos y claves fuera del código fuente.
- **Validación temprana**: detecta configuraciones faltantes al iniciar.
- **Tipado**: acceso con tipos gracias a TypeScript.
- **Facilidad**: un solo archivo `.env` para todo el equipo.

## Problema que resuelve

Sin configuración, los valores duros (hardcoded) son difíciles de mantener:

```typescript
// ❌ Sin configuración: valores quemados en el código
@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: 'localhost',           // ❌ No cambia entre entornos
      port: 5432,                  // ❌ Hardcoded
      username: 'root',            // ❌ Sin seguridad
      password: 'password123',     // ❌ 🔥 Grave error de seguridad
      database: 'mi_app_dev',      // ❌ Fijo
    }),
  ],
})
export class AppModule {}

// ✅ Con configuración: valores desde variables de entorno
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Cómo funciona

```
.env               ConfigModule       ConfigService
┌──────┐           ┌────────────┐     ┌──────────────┐
│ PORT=│──────▶    │ Carga.env  │────▶│ get('PORT')   │
│ 3000  │           │ ╮          │     │              │
│      │           │ Valida     │     │ Devuelve     │
│ DB_  │           │ esquema    │     │ valor con    │
│ HOST │           │ ╯          │     │ tipado       │
└──────┘           └────────────┘     └──────────────┘
```

## Sintaxis

### Instalación

```bash
npm install @nestjs/config
npm install joi          # Para validación de esquema (opcional)
```

### ConfigModule

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,           // Disponible en todos los módulos sin importar
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
      }),
    }),
  ],
})
export class AppModule {}
```

### ConfigService

| Método | Descripción | Ejemplo |
|---|---|---|
| `get<T>(key, default?)` | Obtener valor | `config.get('PORT', 3000)` |
| `getOrThrow<T>(key)` | Obtener o lanzar excepción | `config.getOrThrow('JWT_SECRET')` |
| `has(key)` | Verificar si existe | `config.has('REDIS_HOST')` |
| `internal` | Acceso al objeto interno | `config.internal` |

### Opciones de ConfigModule.forRoot()

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `envFilePath` | `string \| string[]` | `.env` | Ruta(s) al archivo .env |
| `ignoreEnvFile` | `boolean` | `false` | Ignorar archivo .env (útil en producción) |
| `validationSchema` | `Joi.ObjectSchema` | - | Esquema Joi para validar variables |
| `validate` | `Function` | - | Función personalizada de validación |
| `isGlobal` | `boolean` | `false` | Hacer disponible globalmente |
| `cache` | `boolean` | `false` | Cachear variables |

## Ejemplo básico

Archivos `.env` y acceso básico.

<CodeGroup>
<CodeGroupItem title=".env">

```text
# Entorno
NODE_ENV=development

# Servidor
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mi_app_dev

# JWT
JWT_SECRET=mi-secreto-super-seguro-123
JWT_EXPIRES_IN=7d

# APIs externas
API_STRIPE_KEY=sk_test_xxx
API_SENDGRID_KEY=SG.xxx
```

</CodeGroupItem>

<CodeGroupItem title=".env.production">

```text
NODE_ENV=production
PORT=8080
DB_HOST=produccion-db.aws.com
DB_PORT=5432
DB_USER=admin_prod
DB_PASSWORD=contraseñaRealSegura
DB_NAME=mi_app_prod
JWT_SECRET=secretoRealDeProduccion
API_STRIPE_KEY=sk_live_xxx
API_SENDGRID_KEY=SG.real_key
```

</CodeGroupItem>

<CodeGroupItem title="app.module.ts">

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
```

</CodeGroupItem>

<CodeGroupItem title="servicios/email.service.ts">

```typescript
@Injectable()
export class EmailService {
  constructor(private config: ConfigService) {}

  enviarEmail(to: string, subject: string, body: string) {
    const apiKey = this.config.getOrThrow<string>('SENDGRID_API_KEY');

    // Usar API key para enviar email
    return fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personalizations: [{ to: [{ email: to }] }] }),
    });
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Configuración por módulos, validación con Joi, y archivos multi-entorno.

```typescript
// config/database.config.ts — Configuración agrupada
export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV !== 'production',
  },
});

// config/app.config.ts
export default () => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    name: process.env.APP_NAME || 'NestJS API',
    cors: process.env.CORS_ENABLED === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],  // Cargar configuraciones agrupadas
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().min(10).required(),
        DB_HOST: Joi.string().required(),
        DB_PASSWORD: Joi.when('NODE_ENV', {
          is: 'production',
          then: Joi.string().required(),
          otherwise: Joi.string().optional(),
        }),
      }),
      validationOptions: { abortEarly: true },
    }),
  ],
})
export class AppModule {}

// Acceder a configuración agrupada
@Injectable()
export class DatabaseService {
  constructor(private config: ConfigService) {
    const dbConfig = this.config.get('database');
    // { host: 'localhost', port: 5432, ... }
  }
}
```

## Ejemplo avanzado

Configuración dinámica, caché, validación personalizada, y configuración asíncrona.

<CodeGroup>
<CodeGroupItem title="validacion personalizada">

```typescript
// config/validation.ts — Validador personalizado
export function validate(config: Record<string, any>) {
  const requiredVars = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
  ];

  for (const key of requiredVars) {
    if (!config[key]) {
      throw new Error(`❌ Falta la variable de entorno: ${key}`);
    }
  }

  // Validar puerto
  const port = parseInt(config.PORT, 10);
  if (isNaN(port) || port < 0 || port > 65535) {
    throw new Error('❌ PORT debe ser un número entre 0 y 65535');
  }

  // Parsear booleanos
  config.CORS_ENABLED = config.CORS_ENABLED === 'true';

  return config;
}

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      validate,  // Usar validador personalizado
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

</CodeGroupItem>

<CodeGroupItem title="config dinámica con caché">

```typescript
// Configuración con caché para mejorar performance
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,  // Cachear variables para acceso más rápido
    }),
  ],
})
export class AppModule {}

// @nestjs/config cachea internamente los valores
// Similar a hacer:
const cache = new Map();
function get(key: string) {
  if (cache.has(key)) return cache.get(key);
  const value = process.env[key];
  cache.set(key, value);
  return value;
}
```

</CodeGroupItem>

<CodeGroupItem title="config asíncrona">

```typescript
// Configuración que depende de una fuente externa (vault, AWS Secrets)
@Module({
  imports: [
    ConfigModule.forRootAsync({
      useFactory: async () => {
        // Cargar secretos desde AWS Secrets Manager
        const secrets = await getSecretsFromAWS();

        // Cargar .env local
        dotenv.config();

        return {
          isGlobal: true,
          load: [() => secrets],
        };
      },
    }),
  ],
})
export class AppModule {}
```

</CodeGroupItem>

<CodeGroupItem title="config.service.ts tipado">

```typescript
// Clase tipada para acceso a configuración
@Injectable()
export class AppConfig {
  constructor(private config: ConfigService) {}

  get port(): number {
    return this.config.getOrThrow<number>('PORT');
  }

  get database(): DatabaseConfig {
    return {
      host: this.config.getOrThrow('DB_HOST'),
      port: this.config.getOrThrow<number>('DB_PORT'),
      username: this.config.getOrThrow('DB_USER'),
      password: this.config.getOrThrow('DB_PASSWORD'),
      database: this.config.getOrThrow('DB_NAME'),
    };
  }

  get jwt(): JwtConfig {
    return {
      secret: this.config.getOrThrow('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
    };
  }

  get isProduction(): boolean {
    return this.config.get('NODE_ENV') === 'production';
  }
}

// Uso tipado
@Injectable()
export class AuthService {
  constructor(private appConfig: AppConfig) {
    // appConfig.jwt.secret — autocompletado y tipado
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema multi-entorno con diferentes configuraciones por módulo.

```
ESTRUCTURA DE ARCHIVOS
────────────────────────

src/
├── config/
│   ├── app.config.ts          # Configuración de la app
│   ├── database.config.ts     # Configuración de BD
│   ├── jwt.config.ts          # Configuración JWT
│   ├── redis.config.ts        # Configuración Redis
│   └── validation.ts          # Validación personalizada
├── config.service.ts          # Servicio tipado
└── main.ts

.env.development               # Variables para desarrollo
.env.test                      # Variables para testing
.env.production                # Variables para producción

┌──────────────┬───────────────┬──────────────────┐
│ Variable      │ Desarrollo     │ Producción        │
├──────────────┼───────────────┼──────────────────┤
│ DB_HOST      │ localhost      │ prod-db.aws.com   │
│ DB_PASSWORD  │ (vacío en dev) │ Secrets Manager   │
│ JWT_SECRET   │ dev-secret     │ prod-secret-vault │
│ LOG_LEVEL    │ debug          │ error             │
│ CORS_ORIGIN  │ *              │ https://app.com   │
└──────────────┴───────────────┴──────────────────┘
```

## Buenas prácticas

### 1. Usa `isGlobal: true` con cuidado

```typescript
// ✅ Bien: ConfigModule global en AppModule
ConfigModule.forRoot({ isGlobal: true });

// Así no necesitas importarlo en cada módulo
```

### 2. Valida la configuración al iniciar

```typescript
// Con Joi o validación personalizada
// ✅ Detecta errores al arrancar, no en runtime
```

### 3. No subas `.env` al repositorio (excepto `.env.example`)

```text
# .gitignore
.env
.env.local
.env.production
```

```bash
# .env.example — sí se sube (sin valores reales)
PORT=3000
DB_HOST=localhost
```

### 4. Usa `getOrThrow()` para valores obligatorios

```typescript
const jwtSecret = this.config.getOrThrow('JWT_SECRET');
// Lanza error si falta — mejor que undefined silencioso
```

### 5. Agrupa configuraciones relacionadas

```typescript
export default () => ({
  database: { /* ... */ },
  redis: { /* ... */ },
  jwt: { /* ... */ },
});
// Acceso: config.get('database.host')
```

### 6. Diferencia entre desarrollo y producción

```typescript
const isDev = config.get('NODE_ENV') === 'development';
const isProd = config.get('NODE_ENV') === 'production';
```

## Errores comunes

### 1. Variables de entorno faltantes

```typescript
// ❌ Error: no validar produce errores silenciosos
const dbPassword = config.get('DB_PASSWORD');  // undefined

// ✅ Correcto: validar esquema o usar getOrThrow
const dbPassword = config.getOrThrow('DB_PASSWORD');
```

### 2. Olvidar `isGlobal: true`

```typescript
// ❌ Error: ConfigService no disponible en otros módulos
ConfigModule.forRoot({});  // isGlobal false por defecto

// ✅ Correcto: importar en AppModule con isGlobal
ConfigModule.forRoot({ isGlobal: true });
```

### 3. Subir `.env` con contraseñas reales al repo

```bash
# ❌ Error: contraseñas en el historial de git
git add .env
git commit -m "Add env file"

# ✅ Correcto: .env en .gitignore
# Solo .env.example con valores placeholder
```

### 4. No parsear tipos correctamente

```typescript
// ❌ Error: port es string, no number
const port = config.get('PORT');  // "3000" (string)
fetch(`http://localhost:${port}`);  // Funciona, pero incorrecto

// ✅ Correcto: parsear con genérico
const port = config.get<number>('PORT');  // 3000 (number)

// Para parseo explícito:
const port = parseInt(config.get('PORT'), 10);
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Módulos** | ConfigModule se importa en AppModule para toda la app. |
| **Módulos dinámicos** | ConfigModule.forRoot() es un módulo dinámico. |
| **Providers** | ConfigService es un provider global. |
| **Testing** | En tests, usas `.overrideProvider(ConfigService)` para mockear. |
| **CLI** | Puedes pasar variables al iniciar: `NODE_ENV=production nest start`. |

## Resumen

- `@nestjs/config` integra **dotenv** con el sistema DI de NestJS.
- Variables de entorno en archivos `.env.{entorno}`.
- `ConfigModule.forRoot()` carga y expone `ConfigService`.
- `isGlobal: true` para disponibilidad en toda la app sin importar.
- Valida con **Joi** o función personalizada (`validate`).
- `get()` con valor por defecto; `getOrThrow()` para obligatorias.
- Agrupa configuraciones relacionadas con `load`.
- **Nunca subas** `.env` con secretos reales al repositorio.
- Parsing de tipos: `config.get<number>('PORT')`.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cómo accedes a una variable de entorno en NestJS?</summary>

Usando `ConfigService.get('VARIABLE')`. Si necesitas que sea obligatoria, usa `config.getOrThrow('VARIABLE')`.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué hace `isGlobal: true` en ConfigModule?</summary>

Hace que `ConfigService` esté disponible en toda la aplicación sin necesidad de importar `ConfigModule` en cada módulo hijo.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué archivo .env carga NestJS por defecto?</summary>

Carga `.env` en la raíz del proyecto. Puedes especificar otro con `envFilePath: '.env.production'`.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo validas que todas las variables necesarias existan al iniciar?</summary>

Con `validationSchema` (Joi) o con una función personalizada en la opción `validate` de `ConfigModule.forRoot()`.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo evitas que secretos como JWT_SECRET queden en el código?</summary>

Nunca hardcodear valores. Usar variables de entorno: `config.getOrThrow('JWT_SECRET')`. Asegurarse de que `.env` esté en `.gitignore` y solo subir `.env.example` con valores placeholder.
</details>
