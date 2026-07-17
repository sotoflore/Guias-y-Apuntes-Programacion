---
title: Autenticación en NestJS
description: Aprende a implementar autenticación en NestJS con JWT, Passport, sesiones, OAuth2, guards de autenticación, refresh tokens y estrategias personalizadas.
---

# Autenticación en NestJS

La autenticación es como **mostrar tu identificación en la entrada de un edificio**: el sistema verifica quién eres antes de dejarte pasar. Sin ella, cualquier persona podría acceder a recursos privados.

## ¿Qué es?

La **autenticación** es el proceso de verificar la identidad de un usuario. Responde a la pregunta **"¿quién eres?"**. En NestJS, se implementa típicamente usando el paquete `@nestjs/passport` junto con estrategias como JWT, OAuth2, o sesiones locales.

```typescript
// Estrategia JWT: verifica que el token sea válido y extrae el usuario
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const usuario = await this.authService.buscarPorId(payload.sub);
    if (!usuario) throw new UnauthorizedException();
    return usuario;  // Se inyecta en req.user
  }
}
```

## ¿Por qué es importante?

Sin autenticación, cualquier endpoint público expone datos sensibles:

- **Protección de datos**: Solo usuarios verificados acceden a recursos privados.
- **Personalización**: Saber quién eres permite mostrar tu contenido.
- **Auditoría**: Registrar qué usuario hizo qué operación.
- **Seguridad**: Bloquear accesos no autorizados.
- **Cumplimiento**: GDPR, SOC2, PCI-DSS requieren autenticación.

:::tip
Autenticación ≠ Autorización. La autenticación verifica **quién eres**; la autorización verifica **qué puedes hacer**. Primero autenticas, luego autorizas.
:::

## Problema que resuelve

Sin autenticación, cualquiera puede acceder a cualquier recurso:

```typescript
// ❌ Sin autenticación: cualquier persona accede a datos privados
@Controller('admin')
export class AdminController {
  @Get()
  async obtenerDashboard() {
    return { ventas: [], usuarios: [], datosPrivados: '...' };
  }

  @Delete('usuarios/:id')
  async eliminarUsuario(@Param('id') id: string) {
    return this.usuariosService.eliminar(id);  // Sin verificar quién llama
  }
}
```

Con autenticación, validas la identidad antes de procesar:

```typescript
// ✅ Con autenticación: solo usuarios verificados
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  @Get()
  async obtenerDashboard(@Req() req: Request) {
    console.log(`Usuario ${req.user.email} accedió al dashboard`);
    return this.adminService.obtenerDashboard();
  }

  @Delete('usuarios/:id')
  @Roles('admin')
  async eliminarUsuario(@Param('id') id: string) {
    return this.usuariosService.eliminar(id);
  }
}
```

## Cómo funciona

### Flujo de autenticación JWT

```
CLIENTE                      SERVIDOR
   │                            │
   │  POST /auth/login          │
   │  { email, password }       │
   │───────────────────────────▶│
   │                            │──▶ Validar credenciales
   │                            │──▶ Generar JWT
   │  { token, expiresIn }      │
   │◀───────────────────────────│
   │                            │
   │  GET /usuarios/perfil      │
   │  Authorization: Bearer jwt │
   │───────────────────────────▶│
   │                            │──▶ JwtStrategy.validate()
   │                            │──▶ Buscar usuario
   │  { id, nombre, email }    │
   │◀───────────────────────────│
   │                            │
   │  GET /admin/dashboard      │
   │  Authorization: Bearer jwt │
   │───────────────────────────▶│
   │                            │──▶ AuthGuard('jwt')
   │                            │──▶ RolesGuard (solo admin)
   │  403 Forbidden             │  ← No tiene rol admin
   │◀───────────────────────────│
```

### Componentes de autenticación

```
┌─────────────────────────────────────────────────┐
│                AUTH MODULE                       │
│                                                  │
│  ┌─────────────┐   ┌───────────────────────┐    │
│  │ AuthService  │   │ JwtStrategy           │    │
│  │ - login()    │   │ (PassportStrategy)    │    │
│  │ - register() │   │ - validate(payload)   │    │
│  │ - refresh()  │   │ → retorna usuario     │    │
│  └──────┬──────┘   └───────────┬───────────┘    │
│         │                      │                 │
│         ▼                      ▼                 │
│  ┌─────────────┐   ┌───────────────────────┐    │
│  │ JwtService   │   │ AuthGuard('jwt')      │    │
│  │ (de @nestjs/ │   │ (protege rutas)       │    │
│  │  jwt)        │   │                       │    │
│  └─────────────┘   └───────────────────────┘    │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Sintaxis

### Instalación

```bash
npm install @nestjs/passport passport passport-jwt @nestjs/jwt
npm install bcrypt  # Para hashear contraseñas
npm install -D @types/passport-jwt
```

### Estrategias de Passport

| Estrategia | Paquete | Cuándo usarla |
|---|---|---|
| `passport-jwt` | `passport-jwt` | APIs REST, SPAs, apps móviles |
| `passport-local` | `passport-local` | Login con email+password |
| `passport-google-oauth20` | `passport-google-oauth20` | Login con Google |
| `passport-github2` | `passport-github2` | Login con GitHub |
| `passport-facebook` | `passport-facebook` | Login con Facebook |
| `passport-custom` | `passport-custom` | Estrategia personalizada |

## Ejemplo básico

Login con JWT y guard de autenticación.

<CodeGroup>
<CodeGroupItem title="auth.module.ts">

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mi-secreto-temporal',
      signOptions: { expiresIn: '1h' },
    }),
    UsuariosModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
```

</CodeGroupItem>

<CodeGroupItem title="auth.service.ts">

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ token: string; usuario: Partial<Usuario> }> {
    const usuario = await this.usuariosService.buscarPorEmail(email);
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValida) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    return {
      token: this.jwtService.sign(payload),
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    };
  }

  async registrar(dto: RegistrarDto): Promise<{ token: string; usuario: Partial<Usuario> }> {
    const existente = await this.usuariosService.buscarPorEmail(dto.email);
    if (existente) throw new ConflictException('El email ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const usuario = await this.usuariosService.crear({ ...dto, passwordHash });

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    return {
      token: this.jwtService.sign(payload),
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    };
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="strategies/jwt.strategy.ts">

```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mi-secreto-temporal',
    });
  }

  async validate(payload: { sub: string; email: string; rol: string }) {
    const usuario = await this.usuariosService.buscarPorId(payload.sub);
    if (!usuario) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email, rol: payload.rol };
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="auth.controller.ts">

```typescript
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  async registrar(@Body() dto: RegistrarDto) {
    return this.authService.registrar(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('perfil')
  @UseGuards(AuthGuard('jwt'))
  async obtenerPerfil(@Req() req: Request) {
    return req.user;
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="usuarios.controller.ts">

```typescript
@Controller('usuarios')
export class UsuariosController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Autenticación con refresh tokens, OAuth2 (Google) y cuenta de usuario completa.

```typescript
// auth.service.ts — Con refresh tokens
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.buscarPorEmail(dto.email);
    if (!usuario || !(await bcrypt.compare(dto.password, usuario.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generarTokens(usuario);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const usuario = await this.usuariosService.buscarPorId(payload.sub);
      if (!usuario) throw new UnauthorizedException();
      return this.generarTokens(usuario);
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  private generarTokens(usuario: Usuario) {
    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };

    return {
      token: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    };
  }
}
```

<details>
<summary>🔍 Estrategia OAuth2 con Google</summary>

```typescript
// strategies/google.strategy.ts
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, emails } = profile;
    return {
      email: emails[0].value,
      nombre: name.givenName + ' ' + name.familyName,
      foto: profile.photos?.[0]?.value,
      accessToken,
    };
  }
}

// auth.controller.ts — Rutas OAuth
@Get('google')
@UseGuards(AuthGuard('google'))
async googleAuth() {
  // Redirige a Google para autenticación
}

@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleCallback(@Req() req: Request, @Res() res: Response) {
  const token = await this.authService.loginOAuth(req.user);
  res.redirect(`http://localhost:4200/dashboard?token=${token}`);
}
```
</details>

## Ejemplo avanzado

Autenticación multi-factor (2FA), estrategia de API key para servicios externos, y guard personalizado.

<CodeGroup>
<CodeGroupItem title="strategies/api-key.strategy.ts">

```typescript
// Estrategia de API Key para servicios externos
@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor() {
    super();
  }

  async validate(request: Request): Promise<any> {
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) throw new UnauthorizedException('API Key requerida');

    // Validar contra BD o variable de entorno
    const servicio = await this.apiKeysService.validar(apiKey as string);
    if (!servicio) throw new UnauthorizedException('API Key inválida');

    return { servicio: servicio.nombre, tipo: 'api-key' };
  }
}

// Uso: @UseGuards(AuthGuard('api-key'))
```

</CodeGroupItem>

<CodeGroupItem title="guard/two-factor.guard.ts">

```typescript
@Injectable()
export class TwoFactorGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Si el usuario no tiene 2FA habilitado, pasar
    if (!request.user?.tiene2FA) return true;

    // Esperar código 2FA en header o body
    const codigo2FA = request.headers['x-2fa-code'] || request.body?.codigo2FA;

    if (!codigo2FA) throw new UnauthorizedException('Código 2FA requerido');

    return this.authService.verificar2FA(request.user.id, codigo2FA);
  }
}

// Uso: @UseGuards(AuthGuard('jwt'), TwoFactorGuard)
```

</CodeGroupItem>

<CodeGroupItem title="strategies/ws-auth.guard.ts">

```typescript
// Autenticación para WebSockets
@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth?.token || client.handshake.query?.token;

    if (!token) return false;

    try {
      const payload = this.jwtService.verify(token);
      client.data.usuario = payload;
      return true;
    } catch {
      client.disconnect();
      return false;
    }
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema multi-tenant con autenticación JWT + refresh token + MFA + API keys.

```
ESTRUCTURA DEL SISTEMA AUTENTICACIÓN
─────────────────────────────────────────────────────────

  Flujo de login:
  1. POST /auth/login → { token (1h), refreshToken (7d) }
  2. Almacenar token en localStorage/httpOnly cookie
  3. Enviar token en header: Authorization: Bearer <token>
  4. Cuando expira: POST /auth/refresh → nuevo token
  5. Logout: POST /auth/logout → invalidar refresh token

  Estrategias:
  - JWT: Usuarios web/móvil
  - API Key: Servicios externos, webhooks
  - OAuth2 Google: Login social

  Guards aplicados por ruta:
  - @UseGuards(AuthGuard('jwt')) → Usuarios autenticados
  - @UseGuards(AuthGuard('api-key')) → Servicios externos
  - @UseGuards(AuthGuard('jwt'), RolesGuard) → Admin
  - @UseGuards(AuthGuard('jwt'), TwoFactorGuard) → 2FA requerido
```

## Buenas prácticas

### 1. Nunca almacenes contraseñas en texto plano

```typescript
// ✅ Bien: hash con bcrypt
const hash = await bcrypt.hash(password, 10);

// ✅ Verificar con bcrypt
const valida = await bcrypt.compare(password, hash);
```

### 2. Usa tokens con expiración y refresh tokens

```typescript
// Token corto (1h) para acceso
const token = this.jwtService.sign(payload, { expiresIn: '1h' });

// Refresh token largo (7d) para renovar
const refreshToken = this.jwtService.sign(payload, {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: '7d',
});
```

### 3. Siempre usa HTTPS en producción

Los tokens JWT viajan en headers. Si usas HTTP, un atacante puede interceptar el token.

### 4. Almacena el JWT en httpOnly cookie (no localStorage)

```typescript
// ✅ Más seguro: cookie httpOnly
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 1000, // 1h
});
```

### 5. Valida el usuario en cada request (no confíes solo en el token)

```typescript
// JwtStrategy valida que el usuario aún existe en BD
async validate(payload: any) {
  const usuario = await this.usuariosService.buscarPorId(payload.sub);
  if (!usuario) throw new UnauthorizedException();
  return usuario;  // Se inyecta en req.user
}
```

### 6. Usa variables de entorno para secretos

```bash
# .env
JWT_SECRET=una-cadena-muy-larga-y-segura-12345
JWT_REFRESH_SECRET=otra-cadena-segura-para-refresh-67890
```

## Errores comunes

### 1. No hashear contraseñas

```typescript
// ❌ Error: contraseña en texto plano
await this.usuariosService.crear({ email, password: '123456' });

// ✅ Correcto
const hash = await bcrypt.hash(password, 10);
await this.usuariosService.crear({ email, passwordHash: hash });
```

### 2. Token sin expiración

```typescript
// ❌ Error: token que nunca expira
const token = this.jwtService.sign(payload);  // Sin expiresIn

// ✅ Correcto
const token = this.jwtService.sign(payload, { expiresIn: '1h' });
```

### 3. Exponer información sensible en el token

```typescript
// ❌ Error: datos sensibles en el payload
const payload = { sub: user.id, password: user.passwordHash, tarjeta: user.tarjeta };
const token = this.jwtService.sign(payload);

// ✅ Correcto: solo lo necesario
const payload = { sub: user.id, email: user.email, rol: user.rol };
```

### 4. No validar el usuario en la estrategia JWT

```typescript
// ❌ Error: confiar ciegamente en el payload
async validate(payload: any) {
  return payload;  // Si el usuario fue eliminado, el token sigue siendo válido
}

// ✅ Correcto: verificar en BD
async validate(payload: any) {
  const usuario = await this.usuariosService.buscarPorId(payload.sub);
  if (!usuario) throw new UnauthorizedException();
  return usuario;
}
```

### 5. Olvidar importar PassportModule y JwtModule

```typescript
// ❌ Error: falta PassportModule
@Module({
  providers: [JwtStrategy],
})
export class AuthModule {}

// ✅ Correcto
@Module({
  imports: [PassportModule, JwtModule.register({ secret: '...' })],
  providers: [JwtStrategy],
})
export class AuthModule {}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Autorización** | Después de autenticar (identificar), autorizas (permisos). Son conceptos distintos pero complementarios. |
| **Guards** | Protegen rutas. `AuthGuard('jwt')` verifica el token. `RolesGuard` verifica permisos. |
| **JWT** | Estrategia de autenticación más común en APIs REST. Token autocontenido con payload. |
| **Passport** | Middleware de autenticación para Node.js. NestJS lo integra con `@nestjs/passport`. |
| **Módulos** | Los módulos exportan servicios y estrategias para compartir autenticación. |
| **WebSockets** | La autenticación WebSocket se hace en `handleConnection` usando `client.handshake.auth`. |

## Resumen

- La **autenticación** responde "¿quién eres?". La **autorización** responde "¿qué puedes hacer?".
- NestJS usa `@nestjs/passport` + `passport-jwt` para autenticación JWT.
- `AuthGuard('jwt')` protege rutas verificando el token automáticamente.
- `JwtStrategy.validate()` se ejecuta en cada request y retorna el usuario que se inyecta en `req.user`.
- Los tokens deben tener **expiración** (ej: 1h) y usar **refresh tokens** (ej: 7d).
- Las contraseñas se almacenan **hasheadas** con bcrypt, nunca en texto plano.
- Usa **variables de entorno** para JWT_SECRET y otros secretos.
- **HTTPS** es obligatorio en producción para proteger tokens en tránsito.
- **httpOnly cookies** son más seguras que localStorage para almacenar tokens.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuál es la diferencia entre autenticación y autorización?</summary>

**Respuesta:** La autenticación verifica **quién eres** (identidad). La autorización verifica **qué puedes hacer** (permisos). Primero te autenticas, luego se verifica si tienes permiso para la operación.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué hace el método `validate()` en una estrategia JWT?</summary>

**Respuesta:** Se ejecuta automáticamente después de verificar que el token JWT es válido. Debe buscar al usuario en BD y retornarlo. El objeto retornado se inyecta en `req.user`. Si retorna null o lanza excepción, la autenticación falla.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Por qué los tokens JWT deben tener expiración?</summary>

**Respuesta:** Porque si un token es robado, el atacante solo puede usarlo hasta que expire. Sin expiración, un token robado es válido para siempre. La práctica recomendada es token corto (1h) + refresh token (7d).
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué guard protege una ruta usando la estrategia JWT?</summary>

**Respuesta:** `@UseGuards(AuthGuard('jwt'))`. AuthGuard recibe el nombre de la estrategia Passport ('jwt') como argumento y delega en ella la verificación del token y la validación del usuario.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo se almacenan las contraseñas de forma segura?</summary>

**Respuesta:** Usando bcrypt con salt: `await bcrypt.hash(password, 10)`. Nunca en texto plano. Para verificarlas: `await bcrypt.compare(password, hash)`. El hash es irreversible, por lo que aunque la BD sea comprometida, las contraseñas no se pueden recuperar.
</details>
