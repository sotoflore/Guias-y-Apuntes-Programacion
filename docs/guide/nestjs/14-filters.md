---
title: Exception Filters en NestJS
description: Aprende qué son los Exception Filters en NestJS, cómo capturar y manejar errores de forma centralizada, y crear filtros personalizados para respuestas consistentes.
---

# Exception Filters en NestJS

Los Exception Filters son como el **personal de emergencias** de tu aplicación: cuando algo sale mal, ellos se encargan de capturar el error, procesarlo y devolver una respuesta clara y estructurada al cliente.

## ¿Qué es?

Un **Exception Filter** es una clase decorada con `@Catch()` que implementa la interfaz `ExceptionFilter`. Su trabajo es interceptar las excepciones que se lanzan en cualquier parte de la aplicación y convertirlas en respuestas HTTP consistentes.

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      mensaje: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## ¿Por qué es importante?

Sin Exception Filters, cada error no manejado devolvería un `500 Internal Server Error` genérico o —peor aún— un stack trace completo exponiendo detalles internos de tu aplicación.

- **Seguridad**: evitas filtrar información interna (stack traces, rutas de archivos, config).
- **Consistencia**: todas las respuestas de error tienen el mismo formato JSON.
- **Centralización**: un solo lugar para manejar todos los errores, sin try/catch en cada controlador.
- **Personalización**: puedes cambiar el formato, código HTTP y mensaje de cada error.
- **Registro (logging)**: puedes loguear errores automáticamente antes de responder.
- **Multi-entorno**: respuestas detalladas en desarrollo, genéricas en producción.

:::tip
En Express sin NestJS, cada ruta necesita su propio `try/catch` y formateo manual de errores. Los Exception Filters eliminan esa redundancia por completo.
:::

## Problema que resuelve

Sin filters, cada error se maneja de forma distinta:

```typescript
// ❌ Sin filters: manejo inconsistente de errores
@Controller('usuarios')
export class UsuariosController {
  @Get(':id')
  async obtenerUno(@Param('id', ParseIntPipe) id: number) {
    try {
      const usuario = await this.usuariosService.obtenerUno(id);
      return usuario;
    } catch (error) {
      // ❌ Respuesta manual, formato distinto cada vez
      return {
        error: true,
        message: error.message,
        status: 500,
      };
    }
  }

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    try {
      return await this.usuariosService.crear(dto);
    } catch (error) {
      // ❌ Formato diferente al anterior
      return {
        success: false,
        msg: 'Error al crear usuario',
      };
    }
  }
}
```

Cada método devuelve errores en un formato distinto. El frontend no sabe qué esperar. Con filters:

```typescript
// ✅ Con filters: todas las respuestas de error son idénticas
@Controller('usuarios')
export class UsuariosController {
  @Get(':id')
  async obtenerUno(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.obtenerUno(id);
    // Si lanza excepción → el filter la captura y formatea automáticamente
  }

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);
  }
}
```

## Cómo funciona

### Arquitectura de manejo de errores

NestJS tiene una **capa global de excepciones** que actúa como el último recurso. Cuando ocurre un error:

```
Controlador o Servicio
        ↓ (lanza excepción)
        ↓
¿Hay un filter local (@UseFilters)?
   Sí → filter local captura la excepción
   No  → ↓
        ↓
¿Hay un filter a nivel de controlador?
   Sí → filter de controlador captura la excepción
   No  → ↓
        ↓
¿Hay un filter global?
   Sí → filter global captura la excepción
   No  → ↓
        ↓
Filter por defecto de NestJS (devuelve 500 Internal Server Error)
```

### Jerarquía de captura

| Prioridad | Ámbito | Cómo se aplica |
|---|---|---|
| 1 (más alta) | **Método** | `@UseFilters(Filter)` en un método específico |
| 2 | **Controlador** | `@UseFilters(Filter)` en la clase del controlador |
| 3 | **Global** | `app.useGlobalFilters(new Filter())` o provider global |
| 4 (por defecto) | **NestJS core** | `BaseExceptionFilter` incorporado |

### El flujo dentro del filter

```
catch(exception, host)
    │
    ├─ exception: la excepción capturada
    │
    └─ host: ArgumentsHost
         ├─ switchToHttp() → request, response
         ├─ switchToWs()   → client, data
         └─ switchToRpc()  → context
```

## Sintaxis

### Decoradores y clases base

| Elemento | Descripción |
|---|---|
| `@Catch(ExceptionType)` | Indica qué tipo(s) de excepción capturar |
| `implements ExceptionFilter<T>` | Interfaz que obliga a implementar `catch()` |
| `ArgumentsHost` | Contexto de ejecución (HTTP, WS, RPC) |
| `HttpException` | Clase base para excepciones HTTP |
| `@UseFilters(Filter)` | Aplica un filter a método, clase o global |

### Excepciones HTTP incorporadas

| Clase | Código | Uso típico |
|---|---|---|
| `BadRequestException` | 400 | Validación fallida, datos inválidos |
| `UnauthorizedException` | 401 | No autenticado |
| `ForbiddenException` | 403 | No autorizado (sin permisos) |
| `NotFoundException` | 404 | Recurso no encontrado |
| `MethodNotAllowedException` | 405 | Método HTTP no permitido |
| `ConflictException` | 409 | Conflicto (ej: email duplicado) |
| `UnprocessableEntityException` | 422 | Entidad no procesable |
| `TooManyRequestsException` | 429 | Rate limiting |
| `InternalServerErrorException` | 500 | Error interno |
| `ServiceUnavailableException` | 503 | Servicio no disponible |

## Ejemplo básico

Un filter simple que captura cualquier `HttpException` y devuelve una respuesta JSON estructurada.

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      mensaje:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message,
      timestamp: new Date().toISOString(),
      ruta: ctx.getRequest().url,
    };

    response.status(status).json(errorResponse);
  }
}
```

```typescript
// usuarios.controller.ts
import { Controller, Get, Param, ParseIntPipe, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Controller('usuarios')
@UseFilters(HttpExceptionFilter)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get(':id')
  async obtenerUno(@Param('id', ParseIntPipe) id: number) {
    // Si lanza NotFoundException, el filter la captura
    return this.usuariosService.obtenerUno(id);
  }
}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class AppModule {}
```

:::note
Cuando aplicas `@UseFilters()` a nivel de clase, el filter manejará las excepciones de **todos** los métodos del controlador.
:::

## Ejemplo intermedio

Filtros específicos por tipo de excepción, inyección de dependencias y formato multi-entorno.

<CodeGroup>
<CodeGroupItem title="http-exception.filter.ts">

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const mensaje = this.extraerMensaje(exception);

    this.logger.warn(
      `[${request.method}] ${request.url} → ${status}: ${mensaje}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      mensaje,
      error: exception.name,
      timestamp: new Date().toISOString(),
      ruta: request.url,
    });
  }

  private extraerMensaje(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') return response;
    if (typeof response === 'object') {
      const msg = (response as any).message;
      if (Array.isArray(msg)) return msg.join(', ');
      return msg || exception.message;
    }
    return exception.message;
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="not-found.filter.ts">

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(404).json({
      success: false,
      statusCode: 404,
      mensaje: 'El recurso solicitado no existe',
      sugerencia: 'Verifica que el ID o la ruta sean correctos',
      timestamp: new Date().toISOString(),
    });
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="usuarios.controller.ts">

```typescript
import { Controller, Get, Post, Param, Body, ParseIntPipe, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { NotFoundFilter } from './filters/not-found.filter';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Controller('usuarios')
@UseFilters(HttpExceptionFilter)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get(':id')
  @UseFilters(NotFoundFilter)  // Sobrescribe el filter de clase para 404
  async obtenerUno(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.obtenerUno(id);
  }

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);
  }
}
```

</CodeGroupItem>
</CodeGroup>

<details>
<summary>🔍 ¿Cómo funciona la jerarquía aquí?</summary>

1. `@UseFilters(HttpExceptionFilter)` a nivel de clase captura **todas** las `HttpException` de cualquier método.
2. `@UseFilters(NotFoundFilter)` a nivel de método **sobrescribe** al de clase **solo** para `NotFoundException`.
3. Si el método `obtenerUno` lanza un `NotFoundException`, lo captura `NotFoundFilter`. Si lanza cualquier otra `HttpException`, lo captura `HttpExceptionFilter`.

</details>

## Ejemplo avanzado

Sistema completo de manejo de errores con filtro global, logging estructurado, respuesta multi-formato, soporte para WebSockets y GraphQL.

```typescript
// all-exceptions.filter.ts — Filtro global que captura TODAS las excepciones
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { WsException } from '@nestjs/websockets';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctxType = host.getType();

    if (ctxType === 'http') {
      this.handleHttpException(exception, host);
    } else if (ctxType === 'ws') {
      this.handleWsException(exception, host);
    } else if (ctxType === 'rpc') {
      this.handleRpcException(exception);
    }
  }

  private handleHttpException(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let mensaje = 'Error interno del servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      mensaje = typeof res === 'string' ? res : (res as any).message || exception.message;

      if (Array.isArray(mensaje)) {
        mensaje = mensaje.join('; ');
      }
    } else if (exception instanceof Error) {
      mensaje =
        process.env.NODE_ENV === 'development'
          ? exception.message
          : 'Error interno del servidor';
    }

    this.logger.error(
      `[${request.method}] ${request.url} → ${status}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse: Record<string, any> = {
      success: false,
      statusCode: status,
      mensaje,
      timestamp: new Date().toISOString(),
      ruta: request.url,
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.trace =
        exception instanceof Error ? exception.stack : undefined;
    }

    response.status(status).json(errorResponse);
  }

  private handleWsException(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    const error = {
      event: 'error',
      data: {
        mensaje:
          exception instanceof WsException
            ? exception.message
            : 'Error interno del WebSocket',
      },
    };
    client.emit(error.event, error.data);
  }

  private handleRpcException(exception: unknown) {
    throw exception instanceof HttpException
      ? exception
      : new InternalServerErrorException('Error en microservicio');
  }
}
```

```typescript
// filters/validation-exception.filter.ts — Filtro específico para errores de validación
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse() as any;

    response.status(400).json({
      success: false,
      statusCode: 400,
      mensaje: 'Error de validación',
      errores: Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message.map((msg: string) => ({
            descripcion: msg,
            codigo: 'VALIDATION_ERROR',
          }))
        : [{ descripcion: exceptionResponse.message, codigo: 'VALIDATION_ERROR' }],
      timestamp: new Date().toISOString(),
    });
  }
}
```

```typescript
// main.ts — Configuración global de filtros
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Orden: filtros más específicos primero, luego el general
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new AllExceptionsFilter(),
  );

  const logger = new Logger('Bootstrap');
  await app.listen(3000);
  logger.log('Aplicación iniciada en puerto 3000');
}
```

:::warning
El orden de los filtros globales importa. NestJS ejecuta el **primer** filtro que coincida con el tipo de excepción. Pon los filtros más específicos (`ValidationExceptionFilter`) antes que los genéricos (`AllExceptionsFilter`).
:::

<details>
<summary>🔍 ¿Qué hace este ejemplo avanzado?</summary>

1. **AllExceptionsFilter**: captura **cualquier** excepción (`@Catch()` sin argumentos), maneja HTTP, WebSocket y RPC.
2. **ValidationExceptionFilter**: captura solo `BadRequestException` y formatea errores de validación con estructura detallada.
3. **Entorno development**: muestra stack trace completo; producción oculta detalles internos.
4. **Logging**: registra cada error con método, ruta, código de estado y stack trace.
5. **Multi-protocolo**: un solo filtro maneja HTTP, WebSocket y microservicios.

</details>

## Caso de uso real

En una plataforma fintech como **Stripe** o **Mercado Pago**, los errores deben ser precisos, consistentes y seguros.

```typescript
// Estructura de filtros en un proyecto fintech
src/
  common/
    filters/
      all-exceptions.filter.ts          # Captura global
      domain-exception.filter.ts         # Errores de dominio de negocio
      validation-exception.filter.ts     # Errores de validación 422
      rate-limit.filter.ts               # Errores 429 Too Many Requests
      auth-exception.filter.ts           # Errores 401/403 formateados
```

```typescript
// domain-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

// Excepción de dominio personalizada
export class DomainException extends Error {
  constructor(
    public readonly codigo: string,
    public readonly mensaje: string,
    public readonly statusCode: number = 400,
    public readonly detalles?: Record<string, any>,
  ) {
    super(mensaje);
  }
}

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.statusCode).json({
      success: false,
      tipo: 'DOMAIN_ERROR',
      codigo: exception.codigo,
      mensaje: exception.mensaje,
      detalles: exception.detalles || undefined,
      trackingId: ctx.getRequest().id,  // Correlation ID
      timestamp: new Date().toISOString(),
    });
  }
}
```

```typescript
// Uso en servicios
@Injectable()
export class PagosService {
  async procesarPago(usuarioId: number, monto: number) {
    const saldo = await this.cuentasService.obtenerSaldo(usuarioId);

    if (saldo < monto) {
      throw new DomainException(
        'SALDO_INSUFICIENTE',
        `Saldo disponible ($${saldo}) insuficiente para el pago de $${monto}`,
        422,
        { saldoDisponible: saldo, montoSolicitado: monto },
      );
    }

    if (monto > 10000) {
      throw new DomainException(
        'MONTO_EXCEDE_LIMITE',
        'El monto supera el límite permitido para transacciones',
        403,
        { limiteMaximo: 10000 },
      );
    }
  }
}
```

## Buenas prácticas

### 1. Crea filtros específicos para cada tipo de error

```typescript
// ✅ Bien: filtros atómicos
@Catch(NotFoundException)     → NotFoundFilter
@Catch(ValidationError)       → ValidationFilter
@Catch(DomainException)       → DomainFilter
@Catch()                      → AllExceptionsFilter (último recurso)
```

### 2. Usa un Correlation ID en cada error

```typescript
// Útil para debugging y trazabilidad
errorResponse.trackingId = request['correlationId'] || uuid();
```

### 3. Nunca expongas stack traces en producción

```typescript
response.status(status).json({
  mensaje: process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : exception.message,
  trace: process.env.NODE_ENV === 'development'
    ? exception.stack
    : undefined,
});
```

### 4. Registra (log) todos los errores

Usa `Logger` de NestJS o un servicio de logging externo:

```typescript
this.logger.error({
  mensaje: exception.message,
  stack: exception.stack,
  ruta: request.url,
  metodo: request.method,
  usuario: request.usuario?.id,
  timestamp: new Date().toISOString(),
});
```

### 5. Mantén un formato de respuesta consistente

Define una interfaz global para respuestas de error:

```typescript
interface ErrorResponse {
  success: false;
  statusCode: number;
  mensaje: string | string[];
  error?: string;
  timestamp: string;
  ruta?: string;
  trackingId?: string;
  errores?: { descripcion: string; codigo: string }[];
}
```

### 6. No uses try/catch para errores que ya capturan los filters

Deja que los filters hagan su trabajo:

```typescript
// ❌ Innecesario: el filter ya captura la excepción
@Get(':id')
async obtenerUno(@Param('id') id: number) {
  try {
    return await this.service.obtenerUno(id);
  } catch (error) {
    throw error;  // Redundante
  }
}

// ✅ Correcto: deja que el filter maneje el error
@Get(':id')
async obtenerUno(@Param('id') id: number) {
  return this.service.obtenerUno(id);
}
```

### 7. Usa filtros globales como providers si necesitan DI

```typescript
// main.ts — forma provider (requiere registro en módulo)
const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new AllExceptionsFilter());  // Sin DI

// Alternativa con DI: usa APP_FILTER
// app.module.ts
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,  // Se inyectan dependencias
    },
  ],
})
export class AppModule {}
```

## Errores comunes

### 1. Olvidar el decorador @Catch()

```typescript
// ❌ Error: sin @Catch(), el filtro nunca se ejecuta
export class MiFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Nunca se llama
  }
}

// ✅ Correcto
@Catch(HttpException)
export class MiFilter implements ExceptionFilter { ... }
```

### 2. Capture excepción genérica sin manejar el tipo

```typescript
// ❌ Error: asume que siempre es HttpException
@Catch()
export class AllFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();  // ¡Error si no es HttpException!
  }
}

// ✅ Correcto
@Catch()
export class AllFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      // Manejar HttpException
    } else {
      // Manejar error desconocido
    }
  }
}
```

### 3. Confundir el orden de los filtros globales

```typescript
// ❌ Error: el genérico atrapa todo antes que el específico
app.useGlobalFilters(
  new AllExceptionsFilter(),       // Captura PRIMERO
  new ValidationExceptionFilter(), // Nunca se ejecuta para BadRequestException
);

// ✅ Correcto: específicos primero
app.useGlobalFilters(
  new ValidationExceptionFilter(), // Captura BadRequestException
  new AllExceptionsFilter(),       // Captura el resto
);
```

### 4. Usar @UseFilters sin registrar dependencias

Si tu filtro inyecta servicios, debes registrarlo como provider o usar `APP_FILTER`:

```typescript
// ❌ Error: LoggerService no estará disponible
@UseFilters(new LoggerExceptionFilter())  // Creado manualmente, sin DI

// ✅ Correcto: NestJS gestiona la instancia
@UseFilters(LoggerExceptionFilter)  // Referencia a la clase, NestJS inyecta
```

### 5. No devolver respuesta en el filter

```typescript
// ❌ Error: filter sin respuesta → timeout del cliente
catch(exception: HttpException, host: ArgumentsHost) {
  // No llama a response.json() ni response.end()
  console.log(exception.message);
}

// ✅ Correcto: siempre envía una respuesta
catch(exception: HttpException, host: ArgumentsHost) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  response.status(500).json({ mensaje: 'Error' });
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Pipes** | Los pipes lanzan `BadRequestException` cuando falla la validación, que los filters capturan y formatean. |
| **Guards** | Los guards lanzan `UnauthorizedException` (401) o `ForbiddenException` (403), manejadas por filters. |
| **Interceptors** | Los interceptors pueden transformar respuestas exitosas, pero las excepciones pasan a los filters. |
| **Middlewares** | Los middlewares pueden lanzar excepciones, pero no tienen acceso al `ExceptionFilter` — pasan al siguiente nivel. |
| **Logger** | Los filters son el lugar ideal para integrar logging de errores con `LoggerService`. |
| **WebSockets** | Los filters pueden manejar `WsException` para clientes de WebSocket con `switchToWs()`. |
| **Microservicios** | Los filters manejan excepciones en transporte RPC con `switchToRpc()`. |
| **Módulos** | Los filtros globales se registran como providers mediante `APP_FILTER`. |

## Resumen

- Los **Exception Filters** capturan y manejan excepciones lanzadas por cualquier capa de la aplicación.
- Se aplican con `@Catch(Tipo)` y `@UseFilters()` a nivel de **método**, **controlador** o **global**.
- La jerarquía de captura es: método → controlador → global → default de NestJS.
- El filtro global `@Catch()` captura **todas** las excepciones (HTTP, WebSocket, RPC).
- Los filtros pueden **inyectar dependencias** si se usan como clases (no instancias) o con `APP_FILTER`.
- **Buenas prácticas**: filtros específicos primero, formato consistente, logging, Correlation ID, ocultar stack en producción.
- **Nunca** expongas stack traces en producción, **siempre** responde al cliente, y **no** uses try/catch redundantes.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué hace el decorador <code>@Catch()</code> sin argumentos?</summary>

**Respuesta:** Captura **todas** las excepciones de cualquier tipo. Es útil para filtros globales que manejan cualquier error imprevisto. Siempre debe ser el último recurso en la cadena de filtros.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cuál es el orden de prioridad en la jerarquía de filtros?</summary>

**Respuesta:** 1. Filtro a nivel de método (mayor prioridad), 2. Filtro a nivel de controlador, 3. Filtro global, 4. Filtro por defecto de NestJS (BaseExceptionFilter). El primero que coincide captura la excepción.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cómo registras un filtro global que necesita inyección de dependencias?</summary>

**Respuesta:** Usando el token `APP_FILTER` en la sección `providers` del módulo: `{ provide: APP_FILTER, useClass: MiFilter }`. Esto permite que NestJS instancie el filtro y le inyecte sus dependencias.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué método de ArgumentsHost usas para obtener el request/response en un filter HTTP?</summary>

**Respuesta:** `host.switchToHttp()`. Este método devuelve un objeto con `getRequest()` y `getResponse()`. Para WebSockets se usa `switchToWs()` y para microservicios `switchToRpc()`.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Por qué es importante NO exponer el stack trace en producción?</summary>

**Respuesta:** Por seguridad. El stack trace revela rutas de archivos, estructura del proyecto, nombres de funciones y versión de dependencias — información valiosa para un atacante. En producción siempre debe mostrarse un mensaje genérico y loguear internamente el detalle.
</details>
