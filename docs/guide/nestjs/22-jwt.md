---
title: JWT en NestJS
description: Aprende a implementar JWT (JSON Web Tokens) en NestJS, creación, verificación, payload, refresh tokens, blacklist, y mejores prácticas de seguridad con tokens.
---

# JWT en NestJS

JWT es como un **carnet de identidad digital firmado**: contiene información sobre el usuario y está sellado para que nadie pueda modificarlo sin que se note.

## ¿Qué es?

**JWT** (JSON Web Token) es un estándar abierto (RFC 7519) que define una forma compacta y autocontenida de transmitir información entre partes como un objeto JSON firmado digitalmente. En NestJS se usa principalmente para autenticación y autorización en APIs REST.

```typescript
// Generar un token JWT
const token = this.jwtService.sign({
  sub: 'user_123',
  email: 'ana@email.com',
  rol: 'admin',
}, { expiresIn: '1h' });

// El token se ve así (codificado):
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImVtYWlsIjoiYW5hQGVtYWlsLmNvbSJ9.abc123...
```

## ¿Por qué es importante?

JWT es el estándar de facto para autenticación en APIs modernas porque:

- **Stateless**: El servidor no necesita almacenar sesiones. El token contiene todo.
- **Autocontenido**: El payload incluye datos del usuario y claims.
- **Portable**: Funciona en web, móvil, microservicios, third-party.
- **Firmado**: Garantiza que no fue alterado (pero no encriptado).
- **Eficiente**: No requiere consultas a BD para verificar la identidad.

:::tip
JWT no es solo para autenticación. También se usa para intercambio seguro de información, tokens de verificación de email, reseteo de contraseñas, y más.
:::

## Problema que resuelve

Antes de JWT, la autenticación en APIs usaba sesiones del lado del servidor:

```typescript
// ❌ Sesiones: estado en servidor, difícil de escalar
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() dto: any, @Session() session: any) {
    const usuario = await this.authService.validar(dto);
    session.usuarioId = usuario.id;  // Estado en servidor
    return { mensaje: 'Login exitoso' };
  }

  @Get('perfil')
  async perfil(@Session() session: any) {
    const usuario = await this.usuariosService.buscarPorId(session.usuarioId);
    return usuario;
  }
}

// ❌ Problemas:
// - Escalar horizontalmente requiere sesiones compartidas (Redis)
// - Sesiones ocupando memoria del servidor
// - No funciona bien con apps móviles
// - CSRF vulnerable
```

Con JWT, no hay estado en el servidor:

```typescript
// ✅ JWT: sin estado en servidor, escalable
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const usuario = await this.authService.validar(dto);
    const token = this.jwtService.sign({
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });
    return { token };  // El cliente guarda el token
  }

  @Get('perfil')
  @UseGuards(AuthGuard('jwt'))
  async perfil(@Req() req: Request) {
    return req.user;  // Extraído del JWT por la estrategia
  }
}
```

## Cómo funciona

### Estructura de un JWT

```
┌─────────────┐ ┌─────────────────────┐ ┌──────────────────┐
│   HEADER    │ │      PAYLOAD        │ │     SIGNATURE    │
│             │ │                     │ │                  │
│ {           │ │ {                   │ │ HMACSHA256(      │
│  "alg":     │ │  "sub": "123",      │ │   base64Url(     │
│   "HS256",  │ │  "name": "Ana",     │ │    header)       │
│  "typ":     │ │  "iat": 1516239022, │ │  + "." +         │
│   "JWT"     │ │  "exp": 1516242622  │ │  base64Url(      │
│ }           │ │ }                   │ │   payload),      │
│             │ │                     │ │   secret)        │
└─────────────┘ └─────────────────────┘ └──────────────────┘
```

### Flujo JWT en NestJS

```
CLIENTE                     NESTJS SERVER
   │                              │
   │  POST /auth/login            │
   │  { email: "a@b.com",        │
   │    password: "..." }         │
   │─────────────────────────────▶│── AuthService.login()
   │                              │── Validar credenciales
   │                              │── jwtService.sign(payload)
   │  { token: "eyJ...",         │
   │    expiresIn: "1h" }        │
   │◀─────────────────────────────│
   │                              │
   │  GET /api/usuarios           │
   │  Authorization: Bearer eyJ.. │
   │─────────────────────────────▶│── AuthGuard('jwt')
   │                              │── JwtStrategy.validate()
   │                              │── jwtService.verify()
   │                              │── req.user = { ... }
   │  [{ id: 1, nombre: ... }]   │
   │◀─────────────────────────────│
```

### Claims estándar

| Claim | Nombre | Descripción |
|---|---|---|
| `iss` | Issuer | Quién emitió el token |
| `sub` | Subject | A quién se refiere (ej: userId) |
| `aud` | Audience | Destinatario del token |
| `exp` | Expiration | Cuándo expira (timestamp) |
| `nbf` | Not Before | No válido antes de (timestamp) |
| `iat` | Issued At | Cuándo fue emitido (timestamp) |
| `jti` | JWT ID | Identificador único del token |

## Sintaxis

### Instalación

```bash
npm install @nestjs/jwt
```

### Módulo JWT

```typescript
// auth.module.ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '1h',
    algorithm: 'HS256',
  },
}),

// O asíncrono (desde ConfigService):
JwtModule.registerAsync({
  useFactory: (config: ConfigService) => ({
    secret: config.get('JWT_SECRET'),
    signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '1h') },
  }),
  inject: [ConfigService],
}),
```

### JwtService

```typescript
// Firmar (crear)
this.jwtService.sign(payload, options?)
this.jwtService.signAsync(payload, options?)

// Verificar
this.jwtService.verify(token, options?)
this.jwtService.verifyAsync(token, options?)

// Decodificar (sin verificar firma)
this.jwtService.decode(token)  // Solo para depuración
```

## Ejemplo básico

Creación, verificación y uso de JWT en un flujo completo de autenticación.

<CodeGroup>
<CodeGroupItem title="auth.service.ts">

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const usuario = await this.usuariosService.buscarPorEmail(dto.email);
    if (!usuario) throw new UnauthorizedException();

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) throw new UnauthorizedException();

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    };
  }

  async refrescarToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Generar nuevo access token
      const nuevoPayload = { sub: payload.sub, email: payload.email, rol: payload.rol };
      return { accessToken: this.jwtService.sign(nuevoPayload) };
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="strategies/jwt.strategy.ts">

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload): Promise<UsuarioAutenticado> {
    const usuario = await this.usuariosService.buscarPorId(payload.sub);

    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');
    if (!usuario.activo) throw new UnauthorizedException('Usuario inactivo');

    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}

export interface TokenPayload {
  sub: string;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}

export interface UsuarioAutenticado {
  id: string;
  email: string;
  rol: string;
}
```

</CodeGroupItem>

<CodeGroupItem title="auth.controller.ts">

```typescript
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body() dto: { refreshToken: string }) {
    return this.authService.refrescarToken(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request) {
    // Invalidar token (opcional: blacklist)
    return { mensaje: 'Sesión cerrada' };
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

JWT con claims personalizados, roles y verificación de permisos en el token.

```typescript
// auth.service.ts — Payload enriquecido
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const usuario = await this.usuariosService.buscarPorEmail(dto.email);
    if (!usuario) throw new UnauthorizedException();

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      permisos: usuario.permisos,         // Claims personalizados
      organizacionId: usuario.orgId,
      tenant: usuario.tenant,
      autenticacion: '2fa-verificada',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',   // Token corto para acceso
      issuer: 'mi-app',
      audience: 'mi-app-api',
      subject: usuario.email,
      jwtid: crypto.randomUUID(),  // ID único para blacklist
    });

    const refreshToken = this.jwtService.sign(
      { sub: usuario.id, tokenVersion: usuario.tokenVersion },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    return { accessToken, refreshToken, expiraEn: 900 };
  }
}
```

```typescript
// auth.controller.ts — Cambio de contraseña invalida todos los tokens
@Controller('auth')
export class AuthController {
  @Post('cambiar-password')
  @UseGuards(AuthGuard('jwt'))
  async cambiarPassword(@Req() req: Request, @Body() dto: CambiarPasswordDto) {
    await this.authService.cambiarPassword(req.user.id, dto);

    // Incrementar tokenVersion → todos los refresh tokens anteriores invalidados
    return {
      mensaje: 'Contraseña actualizada. Debes iniciar sesión de nuevo.',
      requiereRelogin: true,
    };
  }
}
```

## Ejemplo avanzado

JWT con blacklist en Redis, rotación de llaves y tokens de un solo uso.

<CodeGroup>
<CodeGroupItem title="jwt-blacklist.service.ts">

```typescript
@Injectable()
export class JwtBlacklistService {
  constructor(
    @Inject(RedisClient)
    private readonly redis: Redis,
  ) {}

  async agregarABlacklist(jti: string, exp: number): Promise<void> {
    // Guardar hasta que expire el token
    const ttl = Math.max(0, exp - Math.floor(Date.now() / 1000));
    if (ttl > 0) {
      await this.redis.set(`blacklist:${jti}`, '1', 'EX', ttl);
    }
  }

  async estaEnBlacklist(jti: string): Promise<boolean> {
    const result = await this.redis.get(`blacklist:${jti}`);
    return result === '1';
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="strategies/jwt-blacklist.strategy.ts">

```typescript
@Injectable()
export class JwtBlacklistStrategy extends PassportStrategy(Strategy, 'jwt-blacklist') {
  constructor(
    private readonly blacklistService: JwtBlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<any> {
    // Verificar blacklist
    if (payload.jti && await this.blacklistService.estaEnBlacklist(payload.jti)) {
      throw new UnauthorizedException('Token revocado');
    }
    return payload;
  }
}

// auth.controller.ts — Logout con blacklist
@Post('logout')
@UseGuards(AuthGuard('jwt-blacklist'))
async logout(@Req() req: Request) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = this.jwtService.decode(token!) as any;

  await this.blacklistService.agregarABlacklist(decoded.jti, decoded.exp);
  return { mensaje: 'Token invalidado' };
}
```

</CodeGroupItem>

<CodeGroupItem title="token-reset-password.ts">

```typescript
// Token de un solo uso para reseteo de contraseña
@Injectable()
export class PasswordResetService {
  constructor(private readonly jwtService: JwtService) {}

  async generarTokenReseteo(usuarioId: string): Promise<string> {
    return this.jwtService.sign(
      { sub: usuarioId, proposito: 'reset-password', usado: false },
      { expiresIn: '15m', jwtid: crypto.randomUUID() },
    );
  }

  async verificarTokenReseteo(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (payload.proposito !== 'reset-password') {
        throw new Error('Token inválido para este propósito');
      }

      // El token es de un solo uso — en producción, verificar en BD
      return payload.sub; // usuarioId
    } catch {
      throw new BadRequestException('Token inválido o expirado');
    }
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema de autenticación JWT completo con múltiples tipos de token.

```
TIPOS DE TOKEN JWT EN EL SISTEMA
─────────────────────────────────────────────────────────

  1. Access Token  → Expira: 15 min, Propósito: Acceso a API
  2. Refresh Token → Expira: 7 días, Propósito: Renovar access token
  3. Email Verification → Expira: 24h, Propósito: Confirmar email
  4. Password Reset → Expira: 15 min, Propósito: Resetear contraseña
  5. API Key → Expira: 1 año, Propósito: Acceso para servicios externos

  Claims comunes:
  {
    "sub": "user_abc123",
    "email": "ana@empresa.com",
    "rol": "admin",
    "permisos": ["usuarios:leer", "usuarios:escribir", "reportes:ver"],
    "orgId": "org_456",
    "jti": "unique-token-id",
    "iss": "api.mi-app.com",
    "aud": "mi-app-api",
    "iat": 1700000000,
    "exp": 1700000900
  }

  Flujo de renovación:
  1. Access token expira → 401 Unauthorized
  2. Cliente envía POST /auth/refresh con refresh token
  3. Servidor verifica refresh token → genera nuevo access token
  4. Cliente recibe nuevo access token y reintenta la petición original
```

## Buenas prácticas

### 1. Usa secretos fuertes y diferentes para access y refresh

```typescript
// ✅ Bien: secretos diferentes y largos
JwtModule.register({
  secret: process.env.JWT_SECRET,  // Para access token
});
// Refresh usa otro secreto
this.jwtService.sign(payload, {
  secret: process.env.JWT_REFRESH_SECRET,
});
```

### 2. Tokens cortos para acceso, largos para refresh

```typescript
const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
const refreshToken = this.jwtService.sign(payload, {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: '7d',
});
```

### 3. No pongas datos sensibles en el payload

```typescript
// ❌ Mal: datos sensibles en el payload
const payload = { sub: user.id, passwordHash: user.hash, tarjeta: '4242...' };

// ✅ Bien: solo identificadores y datos públicos
const payload = { sub: user.id, email: user.email, rol: user.rol };
```

### 4. Siempre verifica el token, no solo lo decodifiques

```typescript
// ✅ Verificar (lanza error si es inválido)
this.jwtService.verify(token);

// ❌ Decodificar (NO verifica firma, cualquiera puede modificarlo)
this.jwtService.decode(token);  // Solo para debugging
```

### 5. Usa jti (JWT ID) para blacklist de tokens

```typescript
const token = this.jwtService.sign(payload, {
  jwtid: crypto.randomUUID(),  // ID único para este token
});
```

### 6. Implementa rotación de refresh tokens

```typescript
// Cada vez que se usa un refresh token, se invalida y se genera uno nuevo
async refreshToken(refreshToken: string) {
  // 1. Verificar y obtener payload
  // 2. Generar NUEVO refresh token
  // 3. El anterior deja de ser válido (opcional: incrementar versión)
}
```

## Errores comunes

### 1. Compartir el secreto JWT en el código fuente

```typescript
// ❌ Error: hardcodeado
JwtModule.register({ secret: 'mi-secreto-123' });

// ✅ Correcto: variable de entorno
JwtModule.register({ secret: process.env.JWT_SECRET });
```

### 2. No verificar la expiración

```typescript
// ❌ Error: ignoreExpiration = true ignora tokens vencidos
super({ jwtFromRequest: ..., ignoreExpiration: true });

// ✅ Correcto: verificar expiración
super({ jwtFromRequest: ..., ignoreExpiration: false });
```

### 3. Token demasiado grande

```typescript
// ❌ Error: payload enorme (el token viaja en cada request)
const payload = { sub: user.id, ...user, avatar: 'base64...' };
// → Token de 50KB en cada petición

// ✅ Bien: payload mínimo
const payload = { sub: user.id, email: user.email, rol: user.rol };
```

### 4. No manejar correctamente la rotación de refresh tokens

```typescript
// ❌ Error: refresh token infinito
async refresh(refreshToken: string) {
  const payload = this.jwtService.verify(refreshToken, { secret: REFRESH_SECRET });
  return { token: this.jwtService.sign({ sub: payload.sub }) };
  // El mismo refresh token puede usarse infinitamente
}
```

### 5. Usar JWT para sesiones que requieren invalidación inmediata

```typescript
// ❌ Error: JWT no se puede invalidar (sin blacklist)
// Si bloqueas a un usuario, su JWT sigue siendo válido hasta que expire

// ✅ Soluciones:
// - Tokens cortos (15 min)
// - Blacklist en Redis
// - Verificar versión del token contra BD en cada request
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Autenticación** | JWT es el mecanismo de autenticación más usado en APIs REST con NestJS. |
| **Autorización** | Los claims del JWT (rol, permisos) determinan qué puede hacer el usuario. |
| **Passport** | `passport-jwt` integra JWT con el sistema de Passport de NestJS. |
| **Guards** | `AuthGuard('jwt')` protege rutas verificando el JWT automáticamente. |
| **bcrypt** | Se usa para hashear contraseñas antes de comparar con las credenciales del login. |
| **Redis** | Almacena blacklist de JWT, refresh tokens y sesiones. |
| **ConfigService** | Provee los secretos JWT desde variables de entorno. |

## Resumen

- **JWT** es un token JSON firmado digitalmente, autocontenido y stateless.
- Estructura: **Header** (algoritmo + tipo) + **Payload** (datos) + **Signature** (firma).
- `@nestjs/jwt` provee `JwtModule` y `JwtService` para firmar y verificar.
- `jwtService.sign(payload, options?)` crea tokens; `jwtService.verify(token)` los valida.
- Los tokens deben ser **cortos** (15m-1h) para acceso y **largos** (7d) para refresh.
- El payload solo debe contener **identificadores y claims públicos**.
- Usa **jti** para identificar tokens únicos y poder invalidarlos.
- La **blacklist** en Redis permite invalidar tokens antes de su expiración.
- El secreto JWT debe ser una **variable de entorno** fuerte y única.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué significa que JWT sea "autocontenido"?</summary>

**Respuesta:** Significa que toda la información necesaria para autenticar al usuario está dentro del token mismo (payload + firma). El servidor no necesita consultar una base de datos o sesión para verificar la identidad.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cuál es la diferencia entre `jwtService.sign()` y `jwtService.verify()`?</summary>

**Respuesta:** `sign()` crea un nuevo token firmando un payload con el secreto. `verify()` valida que un token existente tenga una firma válida y no haya expirado. `verify()` lanza error si el token es inválido o expiró.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Por qué no deberías decodificar un JWT con `jwtService.decode()` para fines de autenticación?</summary>

**Respuesta:** Porque `decode()` solo parsea el payload **sin verificar la firma**. Un atacante puede modificar el payload y el decode lo mostrará como válido. Siempre usa `verify()` que sí verifica la integridad del token.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Cómo invalidas un JWT antes de que expire?</summary>

**Respuesta:** Usando una **blacklist** (generalmente Redis) donde almacenas el `jti` del token hasta su expiración. En la estrategia JWT, verificas si el token está en la blacklist antes de permitir el acceso. Otra opción: usar tokens muy cortos (15 min) y refresh tokens.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cuál es el propósito de un refresh token?</summary>

**Respuesta:** Obtener un nuevo access token cuando el actual expira, sin que el usuario tenga que volver a iniciar sesión. El refresh token tiene larga duración (7d) y se almacena de forma segura. Cuando el access token expira, el cliente usa el refresh token para obtener uno nuevo.
</details>
