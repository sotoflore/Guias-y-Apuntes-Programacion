---
title: Autorización en NestJS
description: Aprende a implementar autorización en NestJS con roles, permisos, guards personalizados, @Roles decorator, RBAC, ABAC y control de acceso basado en políticas.
---

# Autorización en NestJS

La autorización es como **las llaves de diferentes habitaciones en un hotel**: después de identificarte en recepción (autenticación), las llaves determinan a qué puertas puedes entrar.

## ¿Qué es?

La **autorización** es el proceso que determina **qué acciones puede realizar un usuario autenticado**. Responde a la pregunta **"¿puedes hacer esto?"**. En NestJS, se implementa típicamente con **Guards**, el decorador `@Roles()` y el `Reflector`.

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesRequeridos) return true;  // Sin restricción

    const { user } = context.switchToHttp().getRequest();
    return rolesRequeridos.includes(user.rol);
  }
}
```

## ¿Por qué es importante?

La autorización es la **segunda línea de defensa** después de la autenticación:

- **Principio de mínimo privilegio**: Cada usuario solo accede a lo que necesita.
- **Seguridad por capas**: Aunque la autenticación sea correcta, la autorización limita daños.
- **Cumplimiento normativo**: GDPR, HIPAA, SOX exigen control de acceso.
- **Auditoría**: Saber qué usuario accedió a qué recurso.
- **Escalabilidad organizacional**: Diferentes roles tienen diferentes responsabilidades.

:::tip
Autenticación ≠ Autorización. La autenticación ocurre **primero**: "¿quién eres?". La autorización ocurre **después**: "¿qué puedes hacer?". Nunca autorices sin antes autenticar.
:::

## Problema que resuelve

Sin autorización, cualquier usuario autenticado puede hacer cualquier cosa:

```typescript
// ❌ Sin autorización: cualquier usuario autenticado puede eliminar usuarios
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  @Delete('usuarios/:id')
  async eliminarUsuario(@Param('id') id: string) {
    // Cualquier usuario con token JWT puede eliminar (incluso un usuario regular)
    return this.usuariosService.eliminar(id);
  }

  @Get('reportes/ventas')
  async reporteVentas() {
    // Mismo problema: todos ven datos sensibles
    return this.reportesService.ventas();
  }
}
```

Con autorización, cada endpoint define quién puede acceder:

```typescript
// ✅ Con autorización: roles y permisos protegen cada acción
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  @Delete('usuarios/:id')
  @Roles('admin')  // Solo administradores
  async eliminarUsuario(@Param('id') id: string) {
    return this.usuariosService.eliminar(id);
  }

  @Get('reportes/ventas')
  @Roles('admin', 'gerente')  // Admin y gerentes
  async reporteVentas() {
    return this.reportesService.ventas();
  }

  @Get('reportes/ventas/resumen')
  @Permisos('reportes:ver', 'reportes:resumen')  // Permisos específicos
  async reporteResumen() {
    return this.reportesService.resumen();
  }
}
```

## Cómo funciona

### Flujo de autorización

```
Petición autenticada (req.user existe)
        │
        ▼
┌───────────────────────────────┐
│       AuthGuard('jwt')        │ ← ¿Está autenticado?
│  (primero: autenticación)     │
└──────┬────────────────────────┘
       │ (pasa)
       ▼
┌───────────────────────────────┐
│       RolesGuard              │ ← ¿Tiene el rol requerido?
│  (segundo: autorización)      │
│                               │
│  1. Lee @Roles('admin')       │
│     del handler con Reflector │
│  2. Compara con req.user.rol  │
│  3. Decide si pasa o 403      │
└──────┬────────────────────────┘
       │ (tiene rol)
       ▼
┌───────────────────────────────┐
│    PermisosGuard (opcional)   │ ← ¿Tiene el permiso específico?
│  (tercero: permisos finos)    │
└──────┬────────────────────────┘
       │ (tiene permiso)
       ▼
    Route Handler
```

### Autorización RBAC vs ABAC

| Modelo | Descripción | Ejemplo |
|---|---|---|
| **RBAC** (Role-Based) | Acceso basado en roles del usuario | `@Roles('admin', 'editor')` |
| **ABAC** (Attribute-Based) | Acceso basado en atributos (usuario, recurso, contexto) | `@Policies('owner', 'self')` — solo el dueño del recurso |
| **PBAC** (Permission-Based) | Acceso basado en permisos específicos | `@Permisos('usuarios:eliminar')` |

## Sintaxis

### Decorador @Roles personalizado

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

### RolesGuard

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesRequeridos) return true;  // Sin roles definidos = acceso público

    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;  // No autenticado

    return rolesRequeridos.some(rol => user.rol === rol);
  }
}
```

### Aplicar en controladores

```typescript
@Controller('usuarios')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsuariosController {
  @Get()
  @Roles('admin', 'supervisor')  // Múltiples roles
  async obtenerTodos() {}

  @Get(':id')
  @Roles('admin', 'supervisor', 'editor')  // Rol específico
  async obtenerUno(@Param('id') id: string) {}

  @Post()
  @Roles('admin')  // Solo admin
  async crear(@Body() dto: any) {}
}
```

## Ejemplo básico

Sistema RBAC con roles y permisos básicos.

<CodeGroup>
<CodeGroupItem title="decorators/roles.decorator.ts">

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

</CodeGroupItem>

<CodeGroupItem title="decorators/permisos.decorator.ts">

```typescript
import { SetMetadata } from '@nestjs/common';

export const PERMISOS_KEY = 'permisos';
export const Permisos = (...permisos: string[]) => SetMetadata(PERMISOS_KEY, permisos);
```

</CodeGroupItem>

<CodeGroupItem title="guards/roles.guard.ts">

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesRequeridos) return true;

    const { user } = context.switchToHttp().getRequest();

    // Admin siempre pasa
    if (user.rol === 'superadmin') return true;

    return rolesRequeridos.includes(user.rol);
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="guards/permisos.guard.ts">

```typescript
@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisosRequeridos = this.reflector.getAllAndOverride<string[]>(PERMISOS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!permisosRequeridos) return true;

    const { user } = context.switchToHttp().getRequest();

    return permisosRequeridos.every(permiso =>
      user.permisos?.includes(permiso),
    );
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="usuarios.controller.ts">

```typescript
@Controller('usuarios')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermisosGuard)
export class UsuariosController {
  @Get()
  @Permisos('usuarios:leer')
  async obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Post()
  @Roles('admin')
  @Permisos('usuarios:crear')
  async crear(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);
  }

  @Delete(':id')
  @Roles('admin')
  async eliminar(@Param('id') id: string) {
    return this.usuariosService.eliminar(id);
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Autorización basada en el dueño del recurso (ABAC) y verificación de pertenencia a organización.

```typescript
// Guards/recurso.guard.ts — Solo el dueño del recurso o admin
@Injectable()
export class RecursoGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly recursosService: RecursosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const esPropietario = this.reflector.getAllAndOverride<boolean>(
      'esPropietario',
      [context.getHandler(), context.getClass()],
    );

    if (!esPropietario) return true;

    const request = context.switchToHttp().getRequest();
    const usuarioId = request.user.id;
    const recursoId = request.params.id;

    // Verificar que el recurso pertenece al usuario
    const recurso = await this.recursosService.buscarPorId(recursoId);
    return recurso?.usuarioId === usuarioId || request.user.rol === 'admin';
  }
}

// Decorador
export const EsPropietario = () => SetMetadata('esPropietario', true);

// Uso
@Controller('documentos')
@UseGuards(AuthGuard('jwt'), RolesGuard, RecursoGuard)
export class DocumentosController {
  @Get(':id')
  @EsPropietario()  // Solo dueño o admin
  async obtener(@Param('id') id: string) {
    return this.documentosService.obtener(id);
  }
}
```

```typescript
// AuthorizationService — Lógica de permisos centralizada
@Injectable()
export class AuthorizationService {
  puedeModificar(recurso: any, usuario: UsuarioAutenticado): boolean {
    // Admin siempre puede
    if (usuario.rol === 'admin') return true;
    // Dueño puede
    if (recurso.usuarioId === usuario.id) return true;
    return false;
  }

  puedeAccederAOrganizacion(orgId: string, usuario: UsuarioAutenticado): boolean {
    if (usuario.rol === 'superadmin') return true;
    return usuario.organizaciones?.includes(orgId) ?? false;
  }
}
```

## Ejemplo avanzado

Sistema de autorización basado en políticas (PBAC), jerarquía de roles y permisos dinámicos.

<CodeGroup>
<CodeGroupItem title="politicas/autorizacion.politica.ts">

```typescript
// Políticas de autorización (ABAC avanzado)
export interface Politica {
  nombre: string;
  evaluar(usuario: UsuarioAutenticado, recurso: any, contexto: any): boolean;
}

export class SoloAdminPolitica implements Politica {
  nombre = 'solo-admin';
  evaluar(usuario: UsuarioAutenticado): boolean {
    return usuario.rol === 'admin';
  }
}

export class SoloPropietarioPolitica implements Politica {
  nombre = 'solo-propietario';
  evaluar(usuario: UsuarioAutenticado, recurso: any): boolean {
    return recurso?.usuarioId === usuario.id;
  }
}

export class MismaOrganizacionPolitica implements Politica {
  nombre = 'misma-organizacion';
  evaluar(usuario: UsuarioAutenticado, recurso: any): boolean {
    return usuario.organizacionId === recurso?.organizacionId;
  }
}

export class DentroDeHorarioLaboralPolitica implements Politica {
  nombre = 'horario-laboral';
  evaluar(_usuario: any, _recurso: any, contexto: any): boolean {
    const hora = contexto.horaActual.getHours();
    return hora >= 9 && hora <= 18;
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="guards/policy.guard.ts">

```typescript
@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyService: PolicyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const politicasRef = this.reflector.getAllAndOverride<string[]>(POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!politicasRef || politicasRef.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const usuario = request.user;
    const parametros = {
      params: request.params,
      query: request.query,
      body: request.body,
    };

    for (const nombrePolitica of politicasRef) {
      const politica = this.policyService.obtener(nombrePolitica);
      if (!politica) continue;

      const contexto = { horaActual: new Date(), ip: request.ip, metodo: request.method };
      const recurso = await this.policyService.obtenerRecurso(context);

      if (!politica.evaluar(usuario, recurso, contexto)) {
        throw new ForbiddenException(`Política '${nombrePolitica}' no cumplida`);
      }
    }

    return true;
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="auth.module.ts">

```typescript
@Module({
  providers: [
    // Guards
    RolesGuard,
    PermisosGuard,
    RecursoGuard,
    PolicyGuard,
    // Servicios
    AuthorizationService,
    PolicyService,
  ],
  exports: [RolesGuard, PermisosGuard, AuthorizationService],
})
export class AuthModule {}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema multi-tenant con jerarquía de roles: SuperAdmin → AdminOrg → Editor → Viewer.

```
JERARQUÍA DE ROLES Y PERMISOS
─────────────────────────────────────────────────────────

                    ┌─────────────┐
                    │ SuperAdmin  │ ← Acceso total al sistema
                    │ (todo)      │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ Admin Org    │ ← Admin de una organización
                    │ (org:crud,   │
                    │  usuarios:  │
                    │  crud)      │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ Editor       │ ← Edita contenido de la org
                    │ (docs:crud,  │
                    │  comments:  │
                    │  crud)      │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ Viewer       │ ← Solo lectura
                    │ (docs:leer,  │
                    │  comments:  │
                    │  leer)      │
                    └─────────────┘

  Permisos heredados:
  - SuperAdmin: todos los permisos
  - AdminOrg: permisos de Editor + gestión de usuarios
  - Editor: permisos de Viewer + crear/editar
  - Viewer: solo leer

  Matriz de permisos:
  ┌─────────────┬────────┬────────┬────────┬────────┐
  │ Acción      │ Viewer │ Editor │ Admin  │ Super  │
  ├─────────────┼────────┼────────┼────────┼────────┤
  │ docs:leer   │ ✅     │ ✅     │ ✅     │ ✅     │
  │ docs:crear  │ ❌     │ ✅     │ ✅     │ ✅     │
  │ docs:editar │ ❌     │ ✅     │ ✅     │ ✅     │
  │ docs:eliminar│ ❌    │ ❌    │ ✅     │ ✅     │
  │ usuarios:crud│ ❌    │ ❌    │ ✅     │ ✅     │
  │ org:config   │ ❌    │ ❌    │ ✅     │ ✅     │
  │ sistema:todo │ ❌    │ ❌    │ ❌     │ ✅     │
  └─────────────┴────────┴────────┴────────┴────────┘
```

## Buenas prácticas

### 1. Autorización centralizada, no dispersa

```typescript
// ✅ Bien: guards centralizados reutilizables
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class Controller {}

// ❌ Mal: lógica de autorización en cada método
@Get()
async obtener(@Req() req: Request) {
  if (req.user.rol !== 'admin') throw new ForbiddenException();
  // Lógica...
}
```

### 2. Usa decoradores descriptivos

```typescript
// ✅ Bien: decoradores que se leen como lenguaje natural
@Roles('admin')
@Permisos('reportes:exportar')
@EsPropietario()

// ❌ Mal: strings mágicas sin contexto
@SetMetadata('r', ['a'])
```

### 3. Principio de mínimo privilegio

```typescript
// ✅ Bien: permisos específicos para cada acción
@Get()
@Permisos('documentos:leer')
async obtener() {}

@Post()
@Roles('editor', 'admin')
@Permisos('documentos:crear')
async crear() {}

// ❌ Mal: rol demasiado permisivo
@Get()
@Roles('viewer', 'editor', 'admin')  // Viewer no debería crear
async crear() {}
```

### 4. Siempre verifica autorización en el servidor

La autorización del lado del cliente es solo para UX. El servidor debe verificar **siempre** en cada petición.

### 5. Los roles deben ser planos o jerárquicos, pero no ambiguos

```typescript
// ✅ Bien: jerarquía explícita
const JERARQUIA_ROLES = {
  superadmin: ['admin', 'editor', 'viewer'],
  admin: ['editor', 'viewer'],
  editor: ['viewer'],
  viewer: [],
};

function rolTienePermiso(rol: string, permiso: string): boolean {
  // Recorrer jerarquía...
}
```

## Errores comunes

### 1. Confundir autenticación con autorización

```typescript
// ❌ Error: solo autentica, no autoriza
@UseGuards(AuthGuard('jwt'))
@Delete('usuarios/:id')
async eliminar(@Param('id') id: string) {
  // Cualquier usuario autenticado puede eliminar
}

// ✅ Correcto: autentica + autoriza
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Delete('usuarios/:id')
async eliminar(@Param('id') id: string) {
  // Solo admin puede eliminar
}
```

### 2. No verificar autorización en servicios

```typescript
// ❌ Error: el servicio asume que el controlador ya verificó
async eliminar(id: string) {
  return this.repo.delete(id);  // Sin verificación de permisos
}

// ✅ Correcto: el servicio también verifica (defensa en profundidad)
async eliminar(id: string, usuario: UsuarioAutenticado) {
  if (!this.authService.puedeEliminar(usuario, id)) {
    throw new ForbiddenException();
  }
  return this.repo.delete(id);
}
```

### 3. Roles hardcodeados sin jerarquía

```typescript
// ❌ Mal: cada endpoint lista roles manualmente
@Roles('admin')
@Roles('admin', 'supervisor')
@Roles('admin', 'editor')
@Roles('admin', 'gerente', 'supervisor')

// ✅ Mejor: usar jerarquía o permisos
@Permisos('usuarios:eliminar')
```

### 4. Olvidar el caso "sin roles definidos"

```typescript
// ❌ Error: si no hay roles, el guard rechaza
canActivate(context: ExecutionContext): boolean {
  const roles = this.reflector.get(ROLES_KEY, context.getHandler());
  return roles.includes(user.rol);  // Si roles es undefined, ¡error!
}

// ✅ Correcto: si no hay roles, permitir
canActivate(context: ExecutionContext): boolean {
  const roles = this.reflector.get(ROLES_KEY, context.getHandler());
  if (!roles) return true;  // Sin restricción
  return roles.includes(user.rol);
}
```

### 5. No usar el Reflector correctamente

```typescript
// ❌ Error: solo busca en el método (ignora decoradores del controlador)
const roles = this.reflector.get(ROLES_KEY, context.getHandler());

// ✅ Correcto: buscar en método y controlador
const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
  context.getHandler(),
  context.getClass(),
]);
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Autenticación** | Requisito previo. Debes saber **quién es** antes de decidir **qué puede hacer**. |
| **Guards** | Mecanismo de NestJS para implementar autorización. `RolesGuard`, `PermisosGuard`. |
| **Reflector** | Lee metadatos (roles, permisos) definidos por decoradores en controladores/métodos. |
| **JWT** | Los claims del JWT (rol, permisos) alimentan la decisión de autorización. |
| **Decoradores** | `@Roles()`, `@Permisos()` definen los requisitos de acceso en cada ruta. |
| **Exception Filters** | Capturan `ForbiddenException` (403) lanzada por guards de autorización. |

## Resumen

- La **autorización** determina **qué puede hacer** un usuario autenticado.
- Se implementa con **Guards** que verifican roles, permisos o políticas.
- `@Roles('admin')` define qué rol puede acceder a una ruta.
- `@Permisos('usuarios:eliminar')` define permisos específicos.
- Usa el **Reflector** para leer metadatos de decoradores dentro del guard.
- **RBAC**: basado en roles (admin, editor, viewer).
- **ABAC**: basado en atributos (dueño del recurso, organización).
- **PBAC**: basado en políticas reutilizables.
- La autorización debe estar en **múltiples capas**: controlador, servicio, base de datos.
- **Principio de mínimo privilegio**: cada usuario solo tiene los permisos necesarios.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la diferencia entre autenticación y autorización?</summary>

**Respuesta:** La autenticación responde "¿quién eres?" (identidad). La autorización responde "¿qué puedes hacer?" (permisos). La autenticación siempre va primero; sin identidad verificada, no tiene sentido autorizar.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué es el Reflector en NestJS y cómo se usa en autorización?</summary>

**Respuesta:** El `Reflector` es una utilidad de NestJS que permite leer metadatos definidos con `SetMetadata()` o decoradores personalizados como `@Roles()`. En autorización, el guard usa el Reflector para obtener los roles requeridos del controlador/método actual y compararlos con el rol del usuario autenticado.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué devuelve un guard cuando el usuario no tiene el rol requerido?</summary>

**Respuesta:** El guard debe retornar `false` o lanzar una excepción. Si retorna `false`, NestJS automáticamente responde con 403 Forbidden. Si lanza `ForbiddenException`, el exception filter puede personalizar la respuesta.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo aplicas múltiples guards de autorización a un controlador?</summary>

**Respuesta:** Pasándolos como array a `@UseGuards()`: `@UseGuards(AuthGuard('jwt'), RolesGuard, PermisosGuard)`. Se ejecutan en orden: primero se verifica autenticación, luego roles, luego permisos específicos.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo implementarías autorización donde un usuario solo puede editar sus propios recursos?</summary>

**Respuesta:** Con ABAC (Attribute-Based Access Control) usando un guard personalizado que compare `req.user.id` con `recurso.usuarioId`. El guard obtiene el recurso por ID de parámetro y verifica que el usuario autenticado sea el dueño o tenga rol admin.
</details>
