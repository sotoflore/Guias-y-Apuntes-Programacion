---
title: Guards en NestJS
description: Aprende qué son los Guards en NestJS, cómo protegen rutas, implementan autenticación y autorización, y diferencias con middlewares.
---

# Guards en NestJS

Los Guards son como **guardias de seguridad** en la entrada de un edificio. Revisan si la persona que llega tiene permiso para entrar y, si no, la rechazan antes de que pueda hacer cualquier otra cosa.

## ¿Qué es?

Un **Guard** es una clase decorada con `@Injectable()` que implementa la interfaz `CanActivate`. Su única responsabilidad es determinar si una petición debe ser procesada o rechazada, devolviendo `true` (permite el paso) o `false` (lanza un `ForbiddenException`).

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return !!request.headers.authorization;
  }
}
```

## ¿Por qué es importante?

Sin Guards, cualquier persona podría acceder a cualquier ruta de tu API. Los Guards son importantes porque:

- **Centralizan la lógica de autorización** en un solo lugar en lugar de esparcirla en cada controlador.
- **Se ejecutan antes que los pipes e interceptores**, asegurando que solo peticiones autorizadas lleguen a la lógica de negocio.
- **Son declarativos**: aplicas protección con un simple decorador `@UseGuards()`.
- **Son reutilizables**: el mismo Guard sirve para proteger múltiples rutas o controladores completos.
- **Se integran con el sistema de inyección de dependencias** de NestJS, permitiendo acceder a servicios.

:::tip
Los Guards son una de las características que diferencian a NestJS de otros frameworks como Express, donde la autorización suele manejarse con middleware genérico y condicional.
:::

## Problema que resuelve

Imagina que tienes una API con rutas públicas y privadas. Sin Guards, terminarías verificando permisos manualmente en cada método:

```typescript
// ❌ Sin Guards: verificación manual en cada ruta
@Controller('usuarios')
export class UsuariosController {
  @Get()
  async obtenerTodos(@Req() req: Request) {
    const token = req.headers.authorization;
    if (!token) throw new UnauthorizedException();
    const usuario = await this.authService.validarToken(token);
    if (!usuario) throw new UnauthorizedException();
    if (usuario.rol !== 'admin') throw new ForbiddenException();
    return this.usuariosService.obtenerTodos();
  }

  @Get(':id')
  async obtenerUno(@Req() req: Request, @Param('id') id: string) {
    const token = req.headers.authorization;
    if (!token) throw new UnauthorizedException();
    const usuario = await this.authService.validarToken(token);
    if (!usuario) throw new UnauthorizedException();
    return this.usuariosService.obtenerUno(id);
  }
}
```

Este código tiene graves problemas:

1. **Duplicación**: la verificación del token se repite en cada método.
2. **Mezcla de responsabilidades**: el controlador debería ocuparse de rutas, no de autorización.
3. **Errores humanos**: es fácil olvidar verificar en un método nuevo.
4. **Dificultad de mantenimiento**: cambiar la lógica de autorización requiere modificar N archivos.

Con Guards, todo esto desaparece:

```typescript
// ✅ Con Guards: separación total de responsabilidades
@Controller('usuarios')
@UseGuards(AuthGuard, RolesGuard)
export class UsuariosController {
  @Get()
  @Roles('admin')
  async obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Get(':id')
  async obtenerUno(@Param('id') id: string) {
    return this.usuariosService.obtenerUno(id);
  }
}
```

## Cómo funciona

Los Guards operan dentro del **pipeline de ejecución** de NestJS. Cuando llega una petición, el flujo es:

```
Petición HTTP → Middlewares → Guards → Interceptors (antes) → Pipes → Controlador
                                                                    ↓
                                                           Interceptors (después) → Filtros
```

### Ciclo de vida de un Guard

1. **Registro**: el Guard se declara como provider en un módulo y se aplica con `@UseGuards()`.
2. **Instanciación**: NestJS crea una instancia del Guard (puede ser singleton o por request).
3. **Ejecución**: antes de ejecutar el controlador, NestJS llama a `canActivate()`.
4. **Decisión**:
   - Si retorna `true` → la petición continúa al siguiente paso.
   - Si retorna `false` → NestJS lanza `ForbiddenException` (403).
   - Si lanza una excepción → NestJS la propaga al Exception Filter.
5. **Contexto de ejecución**: el Guard recibe un objeto `ExecutionContext` que contiene información de la petición, el controlador y el método.

### ExecutionContext

`ExecutionContext` extiende de `ArgumentsHost` y proporciona métodos como:

| Método | Descripción |
|---|---|
| `switchToHttp().getRequest()` | Obtiene el objeto Request (HTTP) |
| `switchToWs().getClient()` | Obtiene el cliente (WebSockets) |
| `switchToRpc().getData()` | Obtiene los datos (RPC) |
| `getClass()` | Obtiene la clase del controlador |
| `getHandler()` | Obtiene el manejador (método del controlador) |
| `getType()` | Devuelve `'http'`, `'ws'` o `'rpc'` |

## Sintaxis

### Decoradores principales

| Decorador | Ámbito | Descripción |
|---|---|---|
| `@UseGuards(Guard1, Guard2)` | Método o controlador | Aplica uno o varios Guards |
| `@UseGuards(Guard1)` (a nivel de clase) | Controlador completo | Protege todos los métodos del controlador |

### Combinación con decoradores personalizados

```typescript
@Controller('usuarios')
@UseGuards(AuthGuard)
export class UsuariosController {

  @Get('publicos')
  obtenerPublicos() {
    // Protegido por AuthGuard
  }

  @Get()
  @Roles('admin')  // Decorador personalizado
  @UseGuards(RolesGuard)
  obtenerTodos() {
    // Protegido por AuthGuard + RolesGuard
  }
}
```

## Ejemplo básico

Un Guard simple que verifica la presencia de un token en las cabeceras.

```typescript
// auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Token de autorización requerido');
    }

    // Simulación: en un caso real validarías el token
    const usuario = { id: 1, nombre: 'Juan', rol: 'user' };
    request.usuario = usuario;

    return true;
  }
}
```

```typescript
// usuarios.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller('usuarios')
@UseGuards(AuthGuard)
export class UsuariosController {

  @Get('perfil')
  obtenerPerfil() {
    return { mensaje: 'Acceso autorizado' };
  }

  @Get('publico')
  obtenerPublico() {
    return { mensaje: 'Este endpoint también requiere autenticación' };
  }
}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';

@Module({
  controllers: [UsuariosController],
})
export class AppModule {}
```

:::note
A nivel de clase, `@UseGuards(AuthGuard)` protege **todos** los métodos del controlador. Si necesitas rutas públicas, debes aplicar el Guard solo a métodos específicos o crear un decorador `@Public()`.
:::

## Ejemplo intermedio

Guard de roles combinado con un decorador personalizado `@Roles()` y uso de metadata de Reflectors.

<CodeGroup>
<CodeGroupItem title="roles.decorator.ts">

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

</CodeGroupItem>
<CodeGroupItem title="roles.guard.ts">

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos del decorador @Roles()
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles requeridos, permitir acceso
    if (!rolesRequeridos || rolesRequeridos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuario = request.usuario;

    if (!usuario) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const tieneRol = rolesRequeridos.includes(usuario.rol);
    if (!tieneRol) {
      throw new ForbiddenException(
        `Se requiere uno de estos roles: ${rolesRequeridos.join(', ')}`,
      );
    }

    return true;
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="usuarios.controller.ts">

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('usuarios')
@UseGuards(AuthGuard)
export class UsuariosController {

  @Get()
  @Roles('admin')
  @UseGuards(RolesGuard)
  async obtenerTodos() {
    return { mensaje: 'Solo admins pueden ver esto' };
  }

  @Get('perfil')
  async obtenerPerfil() {
    return { mensaje: 'Cualquier usuario autenticado puede ver esto' };
  }

  @Get('moderadores')
  @Roles('admin', 'moderator')
  @UseGuards(RolesGuard)
  async obtenerModeradores() {
    return { mensaje: 'Admins y moderadores pueden ver esto' };
  }
}
```

</CodeGroupItem>
</CodeGroup>

<details>
<summary>🔍 ¿Cómo funciona el sistema de roles?</summary>

1. `@Roles('admin')` guarda metadatos usando `SetMetadata`.
2. `RolesGuard` usa `Reflector` para leer esos metadatos.
3. Compara los roles requeridos con el rol del usuario autenticado.
4. Si el usuario no tiene el rol necesario, lanza `ForbiddenException`.
5. `getAllAndOverride` permite que el decorador a nivel de método sobrescriba al de clase.

</details>

## Ejemplo avanzado

Sistema completo de autenticación y autorización con JWT, roles, permisos granulares, contexto de WebSocket y Guards globales.

```typescript
// jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const esPublico = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (esPublico) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extraerToken(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['usuario'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }

  private extraerToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

```typescript
// public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

```typescript
// permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permisos = (...permisos: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permisos);
```

```typescript
// permissions.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsuariosService } from '../usuarios/usuarios.service';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usuariosService: UsuariosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permisosRequeridos = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permisosRequeridos || permisosRequeridos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuarioId = request.usuario?.sub;

    if (!usuarioId) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Obtener permisos del usuario desde la base de datos
    const permisosUsuario = await this.usuariosService.obtenerPermisos(usuarioId);

    const tienePermiso = permisosRequeridos.every((permiso) =>
      permisosUsuario.includes(permiso),
    );

    if (!tienePermiso) {
      throw new ForbiddenException(
        'No tienes los permisos necesarios para esta acción',
      );
    }

    return true;
  }
}
```

```typescript
// ws-auth.guard.ts - Guard para WebSockets
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  WsException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization;

    if (!token) {
      throw new WsException('Token no proporcionado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.usuario = payload;
      return true;
    } catch {
      throw new WsException('Token inválido');
    }
  }
}
```

```typescript
// aplicación global en main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Guard global (se aplica a TODAS las rutas)
  app.useGlobalGuards(new JwtAuthGuard(...));

  await app.listen(3000);
}
```

<details>
<summary>🔍 ¿Qué hace este ejemplo avanzado?</summary>

1. **JwtAuthGuard**: Guard global que verifica tokens JWT en todas las rutas, excepto las marcadas como `@Public()`.
2. **@Public()**: decorador para marcar rutas que no requieren autenticación (login, register).
3. **PermissionsGuard**: verifica permisos granulares (ej: `leer:usuarios`, `escribir:usuarios`).
4. **WsAuthGuard**: versión para WebSockets que extrae el token del handshake.
5. **Inyección de servicios**: los Guards pueden inyectar y usar cualquier servicio de NestJS.
6. **Reflector avanzado**: mezcla metadatos de método y clase para decidir permisos.

</details>

## Caso de uso real

En una plataforma SaaS multiinquilino como **Notion**, **Slack** o **Trello**, los Guards son esenciales para manejar:

- **Autenticación**: verificar que el usuario está logueado.
- **Pertenencia al workspace**: verificar que el usuario pertenece al workspace solicitado.
- **Roles por workspace**: admin, member, viewer.
- **Permisos por recurso**: quién puede leer, escribir, eliminar en cada tablero/proyecto.
- **Rate limiting**: cuántas peticiones puede hacer cada usuario.

```typescript
// Estructura real de Guards en un proyecto empresarial
src/
  modules/
    auth/
      guards/
        jwt-auth.guard.ts          # Verifica token JWT
        refresh-token.guard.ts     # Verifica refresh token
    workspaces/
      guards/
        workspace-member.guard.ts   # Verifica pertenencia al workspace
        workspace-role.guard.ts     # Verifica rol dentro del workspace
    recursos/
      guards/
        recurso-owner.guard.ts      # Verifica propiedad del recurso
        recurso-permission.guard.ts # Verifica permisos específicos
    common/
      guards/
        throttler.guard.ts         # Rate limiting
        api-key.guard.ts           # Autenticación por API key
```

```typescript
// Ejemplo de workspace-member.guard.ts
@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(
    private readonly workspacesService: WorkspacesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const usuarioId = request.usuario.sub;
    const workspaceId = request.params.workspaceId;

    const esMiembro = await this.workspacesService
      .esMiembro(workspaceId, usuarioId);

    if (!esMiembro) {
      throw new ForbiddenException(
        'No eres miembro de este workspace',
      );
    }

    return true;
  }
}
```

## Buenas prácticas

### 1. Un solo propósito por Guard

Cada Guard debe tener **una única responsabilidad**. No mezcles autenticación con roles ni roles con permisos.

```typescript
// ✅ Bien: Guards atómicos
@UseGuards(AuthGuard, RolesGuard, PermissionsGuard)

// ❌ Mal: un Guard que hace todo
@UseGuards(MegaGuard)  // Auth + Roles + Permisos en una sola clase
```

### 2. Usa Reflector para leer metadatos

No hardcodees roles o permisos dentro del Guard. Usa decoradores personalizados con `SetMetadata` y `Reflector`.

### 3. Aplica Guards globales con cuidado

```typescript
// main.ts - Se aplica a TODAS las rutas
app.useGlobalGuards(new JwtAuthGuard());
```
Si usas Guards globales, necesitas un decorador `@Public()` para las rutas públicas.

### 4. Inyecta servicios en los Guards

Los Guards tienen acceso al contenedor DI de NestJS. Úsalos para consultar bases de datos o servicios externos.

### 5. Responde con excepciones HTTP estándar

- `UnauthorizedException` (401) → cuando el usuario no está autenticado.
- `ForbiddenException` (403) → cuando el usuario no tiene permisos.
- `WsException` → en WebSockets.

### 6. Combina Guards a nivel de clase y método

```typescript
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)   // Nivel clase: Auth + Roles
export class AdminController {

  @Get('dashboard')
  @Roles('admin')
  obtenerDashboard() {}  // Hereda AuthGuard + RolesGuard

  @Get('salud')
  @Public()              // Excepción: ruta pública
  obtenerSalud() {}
}
```

### 7. Testea tus Guards unitariamente

```typescript
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockJwtService: MockJwtService;

  beforeEach(() => {
    mockJwtService = { verifyAsync: jest.fn() };
    guard = new AuthGuard(mockJwtService as any, mockReflector as any);
  });

  it('debe permitir acceso con token válido', async () => {
    const mockContext = crearMockContext({ authorization: 'Bearer token-valido' });
    mockJwtService.verifyAsync.mockResolvedValue({ sub: 1 });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('debe rechazar sin token', async () => {
    const mockContext = crearMockContext({});
    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });
});
```

## Errores comunes

### 1. Olvidar registrar el Guard como provider

```typescript
// ❌ Error: Guard no registrado
@Module({
  controllers: [UsuariosController],
  // Falta: providers: [AuthGuard, RolesGuard],
})
```

> **Síntoma**: NestJS lanza `Nest can't resolve dependencies of AuthGuard`.

### 2. No devolver un booleano o lanzar excepción

```typescript
// ❌ Error: no devuelve nada (undefined)
canActivate(context: ExecutionContext) {
  const token = context.switchToHttp().getRequest().headers.authorization;
  if (token) {
    return true;  // ✅ Correcto
  }
  // ❌ Falta: throw new UnauthorizedException() o return false
}
```

### 3. Usar @Res() dentro de un Guard

```typescript
// ❌ Error: no debes modificar la respuesta desde un Guard
canActivate(context: ExecutionContext) {
  const res = context.switchToHttp().getResponse();
  res.status(401).json({ error: 'No autorizado' });  // ❌
  return true;  // Ya es demasiado tarde
}
```

### 4. Confundir Guards con Middlewares

| Middleware | Guard |
|---|---|
| No sabe qué controlador se ejecutará | Sabe exactamente qué controlador y método |
| No tiene acceso a decoradores | Puede leer metadatos con `Reflector` |
| Opera antes de los Guards | Opera después de middlewares |
| Ideal para logging, parsing, CORS | Ideal para autenticación, autorización |

### 5. No manejar la asincronía correctamente

```typescript
// ❌ Error: забыл async/await
canActivate(context: ExecutionContext): boolean {
  const result = this.service.validarToken(token);  // Promise, no boolean
  return result;  // Esto devuelve un Promise, no un boolean
}

// ✅ Correcto
async canActivate(context: ExecutionContext): Promise<boolean> {
  const result = await this.service.validarToken(token);
  return result;
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Middlewares** | Los middlewares se ejecutan antes que los Guards. A diferencia de los Guards, los middlewares no saben qué controlador manejará la petición. |
| **Pipes** | Se ejecutan después de los Guards. Si el Guard rechaza la petición, los pipes nunca se ejecutan. |
| **Interceptors** | Envuelven la ejecución del controlador. Los Guards deciden si el interceptor siquiera se ejecuta. |
| **Decoradores personalizados** | Los Guards se combinan con decoradores como `@Roles()` o `@Public()` para leer metadatos. |
| **Reflector** | Clase fundamental que permite a los Guards leer los metadatos definidos por decoradores. |
| **Exception Filters** | Capturan las excepciones que los Guards lanzan (`UnauthorizedException`, `ForbiddenException`). |
| **Módulos** | Los Guards se registran como providers en los módulos. También pueden ser globales. |
| **WebSockets** | Los Guards funcionan también para WebSockets usando `switchToWs()`. |

## Resumen

- Los **Guards** determinan si una petición puede continuar basándose en condiciones como autenticación, roles o permisos.
- Implementan la interfaz `CanActivate` y retornan `true` (permiso) o `false` / lanzan excepción (denegado).
- Se aplican con el decorador `@UseGuards()` a nivel de método o clase.
- Pueden ser **globales** (se aplican a todas las rutas) o **locales** (a un controlador o método específico).
- Usan `Reflector` y `SetMetadata` para leer decoradores personalizados como `@Roles()`.
- Se ejecutan **después** de middlewares pero **antes** de pipes, interceptores y el controlador.
- Cada Guard debe tener **una única responsabilidad**: auth, roles o permisos, no todo mezclado.
- Son **testeables** de forma aislada y se integran con el sistema de DI de NestJS.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué interfaz debe implementar un Guard en NestJS?</summary>

**Respuesta:** `CanActivate`. Esta interfaz obliga a implementar el método `canActivate()` que recibe un `ExecutionContext` y retorna un booleano o una Promise/Observable de booleano.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué diferencia principal hay entre un Middleware y un Guard?</summary>

**Respuesta:** Los Guards tienen acceso al `ExecutionContext`, lo que les permite saber qué controlador y método se ejecutarán, y pueden leer metadatos con `Reflector`. Los middlewares operan a nivel de request sin conocer el contexto del controlador.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué excepción lanza NestJS automáticamente cuando un Guard retorna <code>false</code>?</summary>

**Respuesta:** `ForbiddenException` que resulta en un error HTTP 403 Forbidden. Si el Guard lanza `UnauthorizedException`, será un 401 Unauthorized.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo marcas una ruta como pública cuando tienes un Guard global aplicado?</summary>

**Respuesta:** Creando un decorador personalizado `@Public()` que use `SetMetadata('isPublic', true)`, y en el Guard verificar ese metadato con `Reflector` para saltar la autenticación cuando `isPublic` es `true`.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿En qué orden se ejecutan estos componentes? Guards, Interceptors, Middlewares, Pipes</summary>

**Respuesta:** El orden correcto es: Middlewares → Guards → Interceptors (pre) → Pipes → Controlador → Interceptors (post). Los Guards actúan como la puerta de entrada antes de cualquier procesamiento de la ruta.
</details>
