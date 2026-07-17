---
title: Validación de Datos en NestJS
description: Aprende a validar datos en NestJS con ValidationPipe, decoradores class-validator, DTOs, validación personalizada, whitelist, transformación y esquemas dinámicos.
---

# Validación de Datos en NestJS

La validación de datos es como **un filtro de seguridad en un aeropuerto**: antes de que el equipaje (datos) entre al avión (tu aplicación), pasa por controles que verifican que todo esté en orden.

## ¿Qué es?

La **validación de datos** es el proceso de verificar que los datos de entrada cumplan con reglas específicas antes de ser procesados por la aplicación. En NestJS, se implementa con **DTOs** (Data Transfer Objects), **class-validator** y **ValidationPipe**.

```typescript
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CrearUsuarioDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
```

## ¿Por qué es importante?

La validación es **la primera línea de defensa** de tu aplicación:

- **Seguridad**: Previene inyecciones, datos maliciosos y ataques.
- **Integridad**: Garantiza que los datos cumplan el formato esperado.
- **Experiencia de usuario**: Errores claros y tempranos.
- **Mantenibilidad**: Las reglas están declaradas, no dispersas en el código.
- **Documentación viva**: Los DTOs documentan qué datos espera cada endpoint.

:::tip
Nunca confíes en los datos del cliente. La validación del frontend es solo para UX — la validación real y de seguridad siempre debe estar en el backend.
:::

## Problema que resuelve

Sin validación, cada controlador debe verificar manualmente:

```typescript
// ❌ Sin validación: código repetitivo y propenso a errores
@Controller('usuarios')
export class UsuariosController {
  @Post()
  async crear(@Body() body: any) {
    if (!body.nombre || typeof body.nombre !== 'string') {
      throw new BadRequestException('Nombre inválido');
    }
    if (body.nombre.length < 2) {
      throw new BadRequestException('Nombre muy corto');
    }
    if (!body.email || !body.email.includes('@')) {
      throw new BadRequestException('Email inválido');
    }
    if (!body.password || body.password.length < 8) {
      throw new BadRequestException('Password muy corto');
    }
    // ... más validaciones manuales
    return this.usuariosService.crear(body);
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() body: any) {
    // Las mismas validaciones repetidas
    if (body.nombre && body.nombre.length < 2) {
      throw new BadRequestException('Nombre inválido');
    }
    // ...
  }
}
```

Con DTOs y ValidationPipe, las reglas se declaran una vez:

```typescript
// ✅ Con validación declarativa
export class CrearUsuarioDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

@Controller('usuarios')
export class UsuariosController {
  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    // Si llegamos aquí, los datos ya están validados
    return this.usuariosService.crear(dto);
  }
}
```

## Cómo funciona

### Flujo de validación

```
Petición POST /usuarios
  Body: { nombre: "A", email: "invalido", password: "123" }
        │
        ▼
┌───────────────────────────────────┐
│     ValidationPipe (global)       │
│                                   │
│  1. Transforma body plano en      │
│     instancia de CrearUsuarioDto  │
│                                   │
│  2. Ejecuta decoradores de        │
│     class-validator:              │
│     - @IsString() nombre          │
│     - @MinLength(2) nombre → FALLA│
│     - @IsEmail() email → FALLA    │
│     - @MinLength(8) password → FAL│
│                                   │
│  3. Si hay errores, lanza         │
│     BadRequestException con       │
│     lista de errores              │
└──────────────┬────────────────────┘
               │ (errores)
               ▼
┌───────────────────────────────────┐
│  Response: 400 Bad Request        │
│  {                                 │
│    "statusCode": 400,             │
│    "message": [                   │
│      "nombre debe tener al menos  │
│        2 caracteres",             │
│      "email debe ser un email     │
│        válido"                    │
│    ],                             │
│    "error": "Bad Request"         │
│  }                                 │
└───────────────────────────────────┘
```

### ValidationPipe integrado

```typescript
// main.ts — Configuración global
const app = await NestFactory.create(AppModule);

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,          // Elimina propiedades no decoradas
  forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
  transform: true,          // Transforma tipos automáticamente
  transformOptions: {
    enableImplicitConversion: true, // Convierte strings a números, etc.
  },
}));
```

## Sintaxis

### Instalación

```bash
npm install class-validator class-transformer
```

### Decoradores de class-validator

| Decorador | Valida que |
|---|---|
| `@IsString()` | Sea un string |
| `@IsNumber()` | Sea un número |
| `@IsInt()` | Sea un entero |
| `@IsBoolean()` | Sea booleano |
| `@IsEmail()` | Sea un email válido |
| `@IsDate()` | Sea una fecha |
| `@IsArray()` | Sea un array |
| `@IsEnum(Enum)` | Sea un valor de un enum |
| `@IsOptional()` | Puede estar ausente |
| `@MinLength(n)` | Mínimo n caracteres |
| `@MaxLength(n)` | Máximo n caracteres |
| `@Min(n)` | Mínimo n (número) |
| `@Max(n)` | Máximo n (número) |
| `@Matches(regex)` | Coincida con regex |
| `@IsPositive()` | Sea positivo |
| `@IsUUID()` | Sea UUID válido |
| `@ArrayNotEmpty()` | Array no vacío |
| `@ArrayMinSize(n)` | Array mínimo n elementos |
| `@ValidateNested()` | Valida objetos anidados |
| `@IsObject()` | Sea un objeto |

## Ejemplo básico

DTOs con validación para creación y actualización de usuarios.

<CodeGroup>
<CodeGroupItem title="crear-usuario.dto.ts">

```typescript
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';

export enum RolUsuario {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export class CrearUsuarioDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe tener mayúsculas, minúsculas y números',
  })
  password: string;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;
}
```

</CodeGroupItem>

<CodeGroupItem title="actualizar-usuario.dto.ts">

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CrearUsuarioDto } from './crear-usuario.dto';

// PartialType hace que todos los campos sean opcionales
export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {}
```

</CodeGroupItem>

<CodeGroupItem title="buscar-usuarios.dto.ts">

```typescript
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { RolUsuario } from './crear-usuario.dto';

export class BuscarUsuariosDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
```

</CodeGroupItem>

<CodeGroupItem title="usuarios.controller.ts">

```typescript
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    // dto ya está validado y tipado
    return this.usuariosService.crear(dto);
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
    return this.usuariosService.actualizar(id, dto);
  }

  @Get()
  async buscar(@Query() dto: BuscarUsuariosDto) {
    return this.usuariosService.buscar(dto);
  }
}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Validación anidada, arrays, grupos de validación y validación asíncrona.

<CodeGroup>
<CodeGroupItem title="pedido.dto.ts">

```typescript
import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsNumber,
  Min,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO anidado
export class ItemPedidoDto {
  @IsUUID()
  productoId: string;

  @IsString()
  nombre: string;

  @IsNumber()
  @Min(0.01)
  precio: number;

  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class CrearPedidoDto {
  @IsUUID()
  usuarioId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })  // Validar cada item del array
  @Type(() => ItemPedidoDto)
  items: ItemPedidoDto[];

  @IsOptional()
  @IsString()
  notas?: string;
}
```

</CodeGroupItem>

<CodeGroupItem title="validacion-personalizada.ts">

```typescript
// Validador personalizado
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'esUnico', async: true })
export class EsUnicoConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usuariosService: UsuariosService) {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    const usuario = await this.usuariosService.buscarPorEmail(email);
    return !usuario;  // true si no existe (válido)
  }

  defaultMessage(args: ValidationArguments) {
    return `El email $value ya está registrado`;
  }
}

// Uso en el DTO
import { Validate } from 'class-validator';

export class CrearUsuarioDto {
  @IsEmail()
  @Validate(EsUnicoConstraint)  // ← Validador personalizado asíncrono
  email: string;
}
```

</CodeGroupItem>

<CodeGroupItem title="validacion-grupos.ts">

```typescript
// Validación por grupos (misma clase, diferentes contextos)
import { IsEmail, IsString, MinLength, IsOptional, Groups } from 'class-validator';

export class UsuarioDto {
  @IsString({ groups: ['create', 'update'] })
  @MinLength(2, { groups: ['create', 'update'] })
  nombre: string;

  @IsEmail({ groups: ['create'] })  // Solo requerido en creación
  email: string;

  @IsString({ groups: ['create'] })
  @MinLength(8, { groups: ['create'] })
  password: string;

  @IsOptional({ groups: ['update'] })
  @IsString({ groups: ['update'] })
  bio?: string;
}

// Uso en controlador
@Post()
async crear(@Body(new ValidationPipe({ groups: ['create'] })) dto: UsuarioDto) {}

@Put(':id')
async actualizar(@Body(new ValidationPipe({ groups: ['update'] })) dto: UsuarioDto) {}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo avanzado

Validación dinámica, esquemas basados en roles y sanitización de datos.

<CodeGroup>
<CodeGroupItem title="validacion-dinamica.ts">

```typescript
// DTO que cambia según el rol del usuario
export class CrearContenidoDto {
  @IsString()
  @MinLength(10)
  titulo: string;

  @IsString()
  @MinLength(50)
  cuerpo: string;

  @IsOptional()
  @IsString()
  categoria?: string;
}

// DTO para admin (puede publicar inmediatamente)
export class CrearContenidoAdminDto extends CrearContenidoDto {
  @IsOptional()
  @IsBoolean()
  publicado?: boolean;

  @IsOptional()
  @IsDate()
  fechaPublicacion?: Date;
}

// Controlador convalidación dinámica según rol
@Post()
async crear(@Req() req: Request, @Body() dto: CrearContenidoDto | CrearContenidoAdminDto) {
  if (req.user.rol === 'admin') {
    // Validar como admin
    const validationPipe = new ValidationPipe({ transform: true });
    const adminDto = await validationPipe.transform(dto, {
      metatype: CrearContenidoAdminDto,
      type: 'body',
    } as any);
    return this.contenidoService.crear(adminDto);
  }
  return this.contenidoService.crear(dto);
}
```

</CodeGroupItem>

<CodeGroupItem title="sanitizacion.filter.ts">

```typescript
// Filtro para sanitizar datos de entrada (XSS prevention)
@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      return this.sanitizar(value);
    }
    if (Array.isArray(value)) {
      return value.map(item => this.transform(item));
    }
    if (value && typeof value === 'object') {
      const sanitized = {};
      for (const key of Object.keys(value)) {
        sanitized[key] = this.transform(value[key]);
      }
      return sanitized;
    }
    return value;
  }

  private sanitizar(texto: string): string {
    return texto
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}

// Uso en controlador
@Post()
async crear(@Body(SanitizePipe, ValidationPipe) dto: CrearUsuarioDto) {
  return this.usuariosService.crear(dto);
}
```

</CodeGroupItem>

<CodeGroupItem title="configuracion-validation-pipe.ts">

```typescript
// main.ts — Configuración completa de ValidationPipe
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    // === OPCIONES PRINCIPALES ===
    whitelist: true,                   // Elimina propiedades sin decorar
    forbidNonWhitelisted: true,        // Error si hay propiedades extra
    transform: true,                   // Transforma tipos automáticamente

    // === OPCIONES DE TRANSFORMACIÓN ===
    transformOptions: {
      enableImplicitConversion: true,  // "123" → 123, "true" → true
    },

    // === OPCIONES DE ERRORES ===
    disableErrorMessages: false,       // Muestra mensajes de error (false en prod)
    exceptionFactory: (errors) => {    // Personaliza el error
      const mensajes = errors.map(e => ({
        campo: e.property,
        errores: Object.values(e.constraints || {}),
        valorRecibido: e.value,
      }));
      return new BadRequestException({
        statusCode: 400,
        message: 'Error de validación',
        errors: mensajes,
      });
    },

    // === OPCIONES DE VALIDACIÓN ===
    validationError: {
      target: false,    // No incluir el objeto original en el error
      value: false,     // No incluir los valores en el error
    },

    // === OPCIONES AVANZADAS ===
    stopAtFirstError: false,  // Reportar todos los errores
    always: true,             // Aplicar validación siempre
  }));

  await app.listen(3000);
}
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Sistema de validación completo para un API de e-commerce.

```
DTOs DEL SISTEMA E-COMMERCE
─────────────────────────────────────────────────────────

  Productos:
  ┌──────────────────────────────────────────────┐
  │ CrearProductoDto                             │
  │ - nombre: string (2-100 chars)               │
  │ - descripcion: string (10-2000 chars)        │
  │ - precio: number (> 0, max 10 dígitos)       │
  │ - categoria: enum (electronica, ropa, hogar) │
  │ - tags: string[] (opcional, max 5)           │
  │ - stock: number (≥ 0)                       │
  │ - imagenes: url[] (opcional, max 10)         │
  └──────────────────────────────────────────────┘

  Pedidos:
  ┌──────────────────────────────────────────────┐
  │ CrearPedidoDto                                │
  │ - usuarioId: uuid                             │
  │ - items: ItemPedidoDto[] (1-50 items)         │
  │   - productoId: uuid                          │
  │   - cantidad: number (1-100)                  │
  │ - direccionEnvio: DireccionDto                │
  │   - calle: string (5-200 chars)               │
  │   - ciudad: string (2-100 chars)              │
  │   - codigoPostal: string (match /^\d{5}$/)    │
  │   - pais: string (2 chars, ISO)               │
  │ - metodoPago: enum (tarjeta, transferencia)   │
  └──────────────────────────────────────────────┘

  Validaciones especiales:
  - Email único (validación asíncrona contra BD)
  - RUT chileno válido (algoritmo de validación)
  - Precio con máximo 2 decimales
  - Stock suficiente antes de confirmar pedido
```

```typescript
// Ejemplo de respuesta de error personalizada
{
  "statusCode": 400,
  "message": "Error de validación",
  "errors": [
    {
      "campo": "email",
      "errores": ["email debe ser un email válido"],
      "valorRecibido": "invalido"
    },
    {
      "campo": "password",
      "errores": [
        "password debe tener al menos 8 caracteres",
        "La contraseña debe tener mayúsculas, minúsculas y números"
      ],
      "valorRecibido": "123"
    }
  ],
  "timestamp": "2026-06-08T12:00:00.000Z",
  "path": "/api/v1/usuarios"
}
```

## Buenas prácticas

### 1. Usa DTOs para cada operación

```typescript
// ✅ Bien: DTO específico para cada operación
CrearUsuarioDto
ActualizarUsuarioDto
BuscarUsuariosDto

// ❌ Mal: mismo tipo para todo
UsuarioDto  // Usado para crear, actualizar y responder
```

### 2. Aplica `whitelist: true` siempre

```typescript
// Con whitelist: true, propiedades como "isAdmin" se eliminan automáticamente
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

// Un atacante que envíe { nombre: "...", isAdmin: true } tendrá isAdmin eliminado
```

### 3. Usa `forbidNonWhitelisted: true` en desarrollo

```typescript
// Error si el cliente envía propiedades inesperadas
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,  // Lanza error en lugar de silenciar
}));
```

### 4. Usa `PartialType` para actualizaciones

```typescript
// Crea automáticamente un DTO con todos los campos opcionales
export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {}
```

### 5. No validar en el controlador

```typescript
// ❌ Mal: validación manual en el controlador
@Post()
async crear(@Body() dto: CrearUsuarioDto) {
  if (!dto.email.includes('@')) throw new BadRequestException();  // Ya validado por DTO
  return this.service.crear(dto);
}

// ✅ Bien: el ValidationPipe ya validó
@Post()
async crear(@Body() dto: CrearUsuarioDto) {
  return this.service.crear(dto);
}
```

### 6. Usa `@Type()` para convertir tipos en arrays y objetos anidados

```typescript
export class BuscarDto {
  @Type(() => Number)
  @IsInt()
  page: number;
}
```

## Errores comunes

### 1. No usar `class-transformer`

```typescript
// ❌ Error: los decoradores de validación no se ejecutan sin transformación previa
// El body llega como objeto plano, no como instancia de la clase DTO

// ✅ Correcto: instalar class-transformer y habilitar transform
import { Transform } from 'class-transformer';
```

### 2. Olvidar `@Type(() => Number)` para query params

```typescript
// ❌ Error: query params son strings, @IsInt() falla
page: number;  // "1" no es un número

// ✅ Correcto: transformar
@Type(() => Number)
@IsInt()
page: number;
```

### 3. DTOs sin decoradores

```typescript
// ❌ Error: DTO sin decoradores — no se valida nada
export class CrearUsuarioDto {
  nombre: string;
  email: string;
}

// ✅ Correcto: decorar cada campo
export class CrearUsuarioDto {
  @IsString() @MinLength(2) nombre: string;
  @IsEmail() email: string;
}
```

### 4. No validar objetos anidados

```typescript
// ❌ Error: dirección no se valida
export class CrearPedidoDto {
  @ValidateNested()  // ← Falta this!
  direccion: DireccionDto;
}

// ✅ Correcto
export class CrearPedidoDto {
  @ValidateNested()
  @Type(() => DireccionDto)
  direccion: DireccionDto;
}
```

### 5. Deshabilitar `whitelist` en producción

```typescript
// ❌ Error: un atacante puede inyectar propiedades no esperadas
app.useGlobalPipes(new ValidationPipe({ whitelist: false }));
// → Un body con { isAdmin: true, ...otrosDatos } pasaría la validación

// ✅ Siempre whitelist: true
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Pipes** | Los pipes transforman y validan datos. `ValidationPipe` es el pipe más usado. |
| **DTOs** | Definen la forma y validación de los datos de entrada/salida. |
| **class-validator** | Librería de decoradores para validar clases (DTOs). |
| **class-transformer** | Convierte objetos planos en instancias de clases DTO. |
| **Mapped Types** | `PartialType`, `PickType`, `OmitType` crean DTOs derivados. |
| **Exception Filters** | Capturan `BadRequestException` lanzada por ValidationPipe. |
| **Guards** | Se ejecutan antes que los pipes. La validación ocurre después de la autorización. |

## Resumen

- La **validación** garantiza que los datos de entrada cumplan reglas antes de procesarlos.
- NestJS usa **class-validator** (decoradores) y **ValidationPipe** (validador automático).
- Los **DTOs** definen la forma y reglas de los datos con decoradores como `@IsString()`, `@IsEmail()`, `@MinLength()`.
- `ValidationPipe` se configura globalmente en `main.ts` con opciones como `whitelist`, `transform`, `forbidNonWhitelisted`.
- **`whitelist: true`** elimina propiedades no decoradas (seguridad).
- **`transform: true`** convierte tipos automáticamente (strings a números, objetos planos a clases).
- Usa **`@Type(() => Tipo)`** para transformar correctamente arrays y objetos anidados.
- **`PartialType`** crea DTOs de actualización con todos los campos opcionales.
- **Validación personalizada** con `@ValidatorConstraint()` para reglas específicas (email único, RUT, etc.).

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué hace `whitelist: true` en el ValidationPipe?</summary>

**Respuesta:** Elimina automáticamente del objeto cualquier propiedad que no tenga un decorador de validación en el DTO. Esto evita que un atacante inyecte propiedades no esperadas como `isAdmin: true`.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Por qué necesitas `@Type(() => Number)` en un DTO para query params?</summary>

**Respuesta:** Porque los query params de HTTP siempre llegan como strings ("1", "true"). `@Type(() => Number)` convierte el string "1" a número 1 antes de que `@IsInt()` lo valide. Sin esto, la validación fallaría porque typeof "1" !== 'number'.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cuál es la diferencia entre `@IsOptional()` y la ausencia del decorador?</summary>

**Respuesta:** Sin decorador, el campo es **requerido** por defecto. `@IsOptional()` indica que el campo **puede estar ausente**, pero si está presente, se aplican las validaciones adicionales. Es útil para actualizaciones parciales.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué hace `PartialType(CrearUsuarioDto)`?</summary>

**Respuesta:** Crea un nuevo DTO donde **todos los campos** del DTO original se vuelven opcionales. Es útil para DTOs de actualización (PUT/PATCH) donde solo necesitas enviar los campos que cambian.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo validarías que un email no esté duplicado en la base de datos?</summary>

**Respuesta:** Con un **validador personalizado asíncrono**:
```typescript
@ValidatorConstraint({ name: 'emailUnico', async: true })
export class EmailUnicoConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usuariosService: UsuariosService) {}
  async validate(email: string): Promise<boolean> {
    const usuario = await this.usuariosService.buscarPorEmail(email);
    return !usuario;
  }
}
```
Luego en el DTO: `@Validate(EmailUnicoConstraint) email: string`.
</details>
