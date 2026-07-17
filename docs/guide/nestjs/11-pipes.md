---
title: Pipes en NestJS
description: Aprende qué son los Pipes en NestJS, cómo transforman y validan datos, pipes incorporados, pipes personalizados y uso con DTOs.
---

# Pipes en NestJS

Los Pipes son como **filtros de agua**: reciben datos crudos, los limpian, transforman y aseguran que sean seguros antes de que lleguen al controlador.

## ¿Qué es?

Un **Pipe** es una clase decorada con `@Injectable()` que implementa la interfaz `PipeTransform`. Tiene dos funciones principales:

1. **Transformación**: convertir los datos de entrada al formato deseado (ej: `string` → `number`).
2. **Validación**: evaluar si los datos son válidos y lanzar una excepción si no lo son.

```typescript
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const id = parseInt(value, 10);
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }
    return id;
  }
}
```

## ¿Por qué es importante?

Sin Pipes, cada controlador tendría que validar y transformar sus propios parámetros manualmente, llevando a código repetitivo, propenso a errores y difícil de mantener.

- **Estandarizan la validación**: toda la validación vive en un solo lugar con una API consistente.
- **Eliminan código boilerplate**: olvídate de `if (isNaN(id))` en cada método.
- **Son declarativos**: decoras el parámetro con el Pipe y ya.
- **Se componen**: puedes encadenar múltiples Pipes en un mismo parámetro.
- **Son reutilizables**: el mismo Pipe de validación sirve en mil controladores.
- **Se integran con `class-validator` y `class-transformer`**: validación basada en decoradores sobre DTOs.

:::tip
Los Pipes son el mecanismo principal de validación en NestJS. Si vienes de Express, olvídate de los middlewares de validación — los Pipes son más potentes y están mejor integrados.
:::

## Problema que resuelve

Sin Pipes, el controlador se llena de validación manual:

```typescript
// ❌ Sin Pipes: validación manual en cada método
@Controller('usuarios')
export class UsuariosController {
  @Get(':id')
  async obtenerUno(@Param('id') id: string) {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new BadRequestException('El ID debe ser un número');
    }
    if (idNum <= 0) {
      throw new BadRequestException('El ID debe ser positivo');
    }
    return this.usuariosService.obtenerUno(idNum);
  }

  @Post()
  async crear(@Body() body: any) {
    if (!body.nombre || typeof body.nombre !== 'string') {
      throw new BadRequestException('Nombre requerido');
    }
    if (body.nombre.length < 3) {
      throw new BadRequestException('Nombre debe tener al menos 3 caracteres');
    }
    if (!body.email || !body.email.includes('@')) {
      throw new BadRequestException('Email inválido');
    }
    return this.usuariosService.crear(body);
  }
}
```

Con Pipes, este desastre desaparece:

```typescript
// ✅ Con Pipes: validación declarativa y limpia
@Controller('usuarios')
export class UsuariosController {
  @Get(':id')
  async obtenerUno(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuariosService.obtenerUno(id);
  }

  @Post()
  async crear(
    @Body(new ValidationPipe({ whitelist: true })) dto: CrearUsuarioDto,
  ) {
    return this.usuariosService.crear(dto);
  }
}
```

## Cómo funciona

### Ciclo de vida de un Pipe

1. **Registro**: el Pipe se asocia a un parámetro, método, controlador o es global.
2. **Recepción**: llega el valor crudo del parámetro (string desde HTTP, objeto desde body).
3. **Ejecución**: NestJS llama a `transform(value, metadata)` con el valor y metadatos del parámetro.
4. **Salida**:
   - Si es válido → retorna el valor transformado.
   - Si es inválido → lanza `BadRequestException` (o cualquier excepción).
5. **Propagación**: el valor transformado se inyecta como argumento al método del controlador.

```
Valor crudo ("42") → Pipe → Valor transformado (42) → Método del controlador
                           ↘ Si es inválido → BadRequestException → Exception Filter
```

### Metadata del Pipe

El segundo argumento `metadata` contiene información sobre el parámetro:

```typescript
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;  // Tipo del parámetro (clase DTO, etc.)
  data?: string;             // String pasado al decorador (@Param('id'))
}
```

### Niveles de aplicación

| Nivel | Ámbito | Cómo se aplica |
|---|---|---|
| **Global** | Toda la aplicación | `app.useGlobalPipes(new ValidationPipe())` |
| **Controlador** | Todos los métodos del controlador | `@UsePipes(new ValidationPipe())` |
| **Método** | Un método específico | `@UsePipes(new ValidationPipe())` |
| **Parámetro** | Un parámetro específico | `@Param('id', ParseIntPipe)` |

## Sintaxis

### Pipes incorporados (built-in)

| Pipe | Función | Ejemplo |
|---|---|---|
| `ValidationPipe` | Valida DTOs con decoradores `class-validator` | `@Body(ValidationPipe) dto: CrearDto` |
| `ParseIntPipe` | Convierte string a number | `@Param('id', ParseIntPipe) id: number` |
| `ParseFloatPipe` | Convierte string a float | `@Query('precio', ParseFloatPipe) p: number` |
| `ParseBoolPipe` | Convierte string a boolean | `@Query('activo', ParseBoolPipe) a: boolean` |
| `ParseArrayPipe` | Convierte string a array | `@Query('ids', ParseArrayPipe) ids: number[]` |
| `ParseUUIDPipe` | Valida que sea UUID | `@Param('uuid', ParseUUIDPipe) id: string` |
| `ParseEnumPipe` | Valida que sea un enum válido | `@Query('rol', ParseEnumPipe) r: Rol` |
| `DefaultValuePipe` | Provee valor por defecto | `@Query('page', DefaultValuePipe(1)) p: number` |

### Opciones comunes

`ParseIntPipe`, `ParseFloatPipe`, etc. pueden recibir opciones:

```typescript
@Param('id', new ParseIntPipe({
  errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
  exceptionFactory: (msg) => new BadRequestException(`ID inválido: ${msg}`),
}))
id: number;
```

## Ejemplo básico

Usando los pipes incorporados de NestJS.

```typescript
// usuarios.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  ParseBoolPipe,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  private usuarios = [
    { id: 1, nombre: 'Ana', activo: true },
    { id: 2, nombre: 'Luis', activo: false },
  ];

  @Get()
  async obtenerTodos(
    @Query('activo', new DefaultValuePipe(false), ParseBoolPipe)
    soloActivos: boolean,
  ) {
    if (soloActivos) {
      return this.usuarios.filter(u => u.activo);
    }
    return this.usuarios;
  }

  @Get(':id')
  async obtenerUno(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }
    return usuario;
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
`DefaultValuePipe` siempre debe ir **antes** del pipe de transformación, ya que proporciona un valor por defecto solo si el valor es `undefined`.
:::

## Ejemplo intermedio

Validación de DTOs con `class-validator` y `class-transformer`, más pipes personalizados.

<CodeGroup>
<CodeGroupItem title="crear-usuario.dto.ts">

```typescript
import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearUsuarioDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  @IsInt()
  @Min(18, { message: 'Debe ser mayor de 18 años' })
  @Max(120)
  @Type(() => Number)
  edad: number;

  @IsOptional()
  @IsString()
  telefono?: string;
}
```

</CodeGroupItem>
<CodeGroupItem title="trim-pipe.pipe.ts">

```typescript
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (Array.isArray(value)) {
      return value.map(item => this.transform(item));
    }
    if (value && typeof value === 'object') {
      const trimmed: Record<string, any> = {};
      for (const key of Object.keys(value)) {
        trimmed[key] = this.transform(value[key]);
      }
      return trimmed;
    }
    return value;
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="usuarios.controller.ts">

```typescript
import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { TrimPipe } from './pipes/trim-pipe.pipe';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UsePipes(new TrimPipe())
  async crear(
    @Body(new ValidationPipe({
      whitelist: true,            // Elimina propiedades no decoradas
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extrañas
      transform: true,            // Transforma tipos automáticamente
    }))
    dto: CrearUsuarioDto,
  ) {
    return this.usuariosService.crear(dto);
  }

  @Post(':id/activar')
  async activar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuariosService.activar(id);
  }
}
```

</CodeGroupItem>
</CodeGroup>

<details>
<summary>🔍 ¿Qué hace cada parte?</summary>

- **CrearUsuarioDto**: define las reglas de validación con decoradores `class-validator`.
- **TrimPipe**: pipe personalizado que elimina espacios en blanco recursivamente.
- **ValidationPipe con `whitelist: true`**: solo permite propiedades decoradas en el DTO.
- **ValidationPipe con `transform: true`**: convierte automáticamente `"18"` → `18` para `@Type(() => Number)`.
- **forbidNonWhitelisted**: rechaza peticiones con propiedades inesperadas (protección extra).

</details>

## Ejemplo avanzado

Sistema completo de validación con pipes personalizados, transformación avanzada y un ValidationPipe global configurado profesionalmente.

```typescript
// validation-pipe-global.config.ts
import { ValidationPipe, BadRequestException } from '@nestjs/common';

export const configuracionValidationPipeGlobal = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  disableErrorMessages: process.env.NODE_ENV === 'production',
  exceptionFactory: (errors) => {
    const mensajes = errors.map((error) => ({
      propiedad: error.property,
      restricciones: Object.values(error.constraints || {}),
    }));
    return new BadRequestException({
      statusCode: 400,
      mensaje: 'Error de validación',
      errores: mensajes,
    });
  },
});
```

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuracionValidationPipeGlobal } from './common/pipes/validation-pipe-global.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipe global: se aplica a TODOS los controladores
  app.useGlobalPipes(configuracionValidationPipeGlobal);

  await app.listen(3000);
}
```

```typescript
// pipes/parse-id.pipe.ts — Pipe personalizado avanzado
import {
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  constructor(
    private readonly options?: { min?: number; max?: number; name?: string },
  ) {}

  transform(value: string): number {
    const fieldName = this.options?.name || 'ID';

    if (value === undefined || value === null) {
      throw new BadRequestException(`${fieldName} es requerido`);
    }

    const id = parseInt(value, 10);

    if (isNaN(id)) {
      throw new BadRequestException(`${fieldName} debe ser un número válido`);
    }

    if (this.options?.min !== undefined && id < this.options.min) {
      throw new BadRequestException(
        `${fieldName} debe ser mayor o igual a ${this.options.min}`,
      );
    }

    if (this.options?.max !== undefined && id > this.options.max) {
      throw new BadRequestException(
        `${fieldName} debe ser menor o igual a ${this.options.max}`,
      );
    }

    return id;
  }
}
```

```typescript
// pipes/filter-pipe.pipe.ts — Pipe que transforma query params
import { Injectable, PipeTransform } from '@nestjs/common';

interface FiltrosQuery {
  page: number;
  limit: number;
  sort: 'asc' | 'desc';
  search?: string;
}

@Injectable()
export class ParseFiltrosPipe implements PipeTransform<any, FiltrosQuery> {
  transform(value: any): FiltrosQuery {
    return {
      page: Math.max(1, parseInt(value?.page, 10) || 1),
      limit: Math.min(100, Math.max(1, parseInt(value?.limit, 10) || 10)),
      sort: value?.sort === 'asc' ? 'asc' : 'desc',
      search: value?.search?.trim() || undefined,
    };
  }
}
```

```typescript
// pipes/file-validation.pipe.ts — Pipe para validar archivos
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly options: {
      maxSizeMb: number;
      allowedMimeTypes: string[];
    },
  ) {}

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    const maxBytes = this.options.maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException(
        `El archivo no debe superar ${this.options.maxSizeMb}MB`,
      );
    }

    if (!this.options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Permitidos: ${this.options.allowedMimeTypes.join(', ')}`,
      );
    }

    return file;
  }
}
```

```typescript
// Uso del FileValidationPipe en un controlador
@Post('upload')
@UseInterceptors(FileInterceptor('archivo'))
async subirArchivo(
  @UploadedFile(new FileValidationPipe({
    maxSizeMb: 5,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  }))
  archivo: Express.Multer.File,
) {
  return this.archivosService.guardar(archivo);
}
```

<details>
<summary>🔍 ¿Qué hace este ejemplo avanzado?</summary>

1. **ValidationPipe global** con configuración profesional (whitelist, transform, mensajes de error personalizados).
2. **ParseIdPipe** configurable con rango mínimo/máximo y nombre personalizado.
3. **ParseFiltrosPipe** que transforma query params crudos en un objeto tipado con valores por defecto seguros.
4. **FileValidationPipe** que valida tamaño y tipo MIME de archivos subidos.
5. Todos los pipes son **reutilizables** en cualquier controlador.

</details>

## Caso de uso real

En una API de comercio electrónico como **Mercado Libre** o **Amazon**, los Pipes se usan en cada endpoint:

```typescript
// Controlador de productos en un e-commerce real
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async buscar(
    @Query() filtros: BuscarProductosDto,       // Validado globalmente
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('precioMin', new DefaultValuePipe(0), ParseFloatPipe) precioMin: number,
    @Query('precioMax', new DefaultValuePipe(999999), ParseFloatPipe) precioMax: number,
  ) {
    return this.productosService.buscar({ ...filtros, page, limit, precioMin, precioMax });
  }

  @Get(':id')
  async obtener(
    @Param('id', new ParseIdPipe({ min: 1, name: 'ID de producto' })) id: number,
  ) {
    return this.productosService.obtener(id);
  }

  @Post()
  async crear(
    @Body() dto: CrearProductoDto,  // Validado por el ValidationPipe global
  ) {
    return this.productosService.crear(dto);
  }

  @Post(':id/imagen')
  @UseInterceptors(FileInterceptor('imagen'))
  async subirImagen(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(new FileValidationPipe({
      maxSizeMb: 10,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    }))
    imagen: Express.Multer.File,
  ) {
    return this.productosService.subirImagen(id, imagen);
  }
}
```

```typescript
// BuscarProductosDto con validación avanzada
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class BuscarProductosDto {
  @IsOptional()
  @IsString()
  q?: string;  // Búsqueda textual

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precioMin?: number;

  @IsOptional()
  @IsNumber()
  @Max(999999)
  @Type(() => Number)
  precioMax?: number;

  @IsOptional()
  @IsString()
  ordenar?: 'precio_asc' | 'precio_desc' | 'nombre' | 'relevancia';
}
```

## Buenas prácticas

### 1. Usa ValidationPipe global con whitelist

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

Esto asegura que **todas** las peticiones sean validadas, sin excepción.

### 2. Prefiere los pipes incorporados antes que crear los tuyos

`ParseIntPipe`, `ParseUUIDPipe`, etc. cubren el 90% de los casos. Solo crea pipes personalizados cuando necesites lógica específica.

### 3. Un pipe = una responsabilidad

```typescript
// ✅ Bien: pipes atómicos
@Param('id', TrimPipe, ParseIntPipe)

// ❌ Mal: pipe que hace demasiado
class MegaPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') value = value.trim();
    const num = parseInt(value, 10);
    if (isNaN(num)) throw new BadRequestException();
    return num;
  }
}
```

### 4. Orden de los pipes importa

Los pipes se ejecutan en el orden en que se declaran:

```typescript
@Query('nombre', TrimPipe, MinLengthPipe)
// 1. TrimPipe elimina espacios
// 2. MinLengthPipe verifica longitud mínima
```

### 5. No hagas lógica de negocio en un Pipe

Los pipes son para transformación y validación de entrada. La lógica de negocio va en los servicios.

```typescript
// ✅ Bien: pipe valida formato de email
@Body() dto: CrearUsuarioDto  // ValidationPipe valida @IsEmail()

// ❌ Mal: pipe verifica si el email ya existe en BD
class EmailUnicoPipe implements PipeTransform {
  async transform(value: string) {
    const existe = await this.db.findByEmail(value);  // Lógica de negocio aquí NO
    if (existe) throw new BadRequestException('Email ya registrado');
    return value;
  }
}
```

### 6. Configura `disableErrorMessages` en producción

```typescript
new ValidationPipe({
  disableErrorMessages: process.env.NODE_ENV === 'production',
})
```

### 7. Usa `@Type(() => Number)` para transformación implícita

```typescript
import { Type } from 'class-transformer';

export class FiltrosDto {
  @Type(() => Number)
  page: number;

  @Type(() => Number)
  limit: number;
}
```

## Errores comunes

### 1. Olvidar que los parámetros de ruta llegan como string

```typescript
// ❌ Error: id es string, no number
@Get(':id')
obtener(@Param('id') id: number) {
  return this.service.obtener(id + 1);  // "1" + 1 = "11", no 2
}

// ✅ Correcto
@Get(':id')
obtener(@Param('id', ParseIntPipe) id: number) {
  return this.service.obtener(id + 1);  // 1 + 1 = 2
}
```

### 2. Pipes globales no aplican a controladores de entrada de网关

Los pipes globales no se aplican automáticamente a gateways de WebSockets o microservicios. Debes aplicar `@UsePipes()` explícitamente.

### 3. No usar `transform: true` con DTOs sin `@Type()`

```typescript
// ❌ Error: aunque transforms true, no sabe qué tipo usar
export class FiltrosDto {
  page: number;  // Sin @Type(), page seguirá siendo string
}

// ✅ Correcto
export class FiltrosDto {
  @Type(() => Number)
  page: number;
}
```

### 4. Pipes que retornan undefined/null se inyectan como tales

Si un pipe retorna `undefined`, el parámetro del controlador recibirá `undefined`. Usa `DefaultValuePipe` si necesitas valores por defecto.

### 5. Olvidar que ValidationPipe lanza BadRequestException

```typescript
// ❌ Error: catch específico no capturará la excepción del pipe
@Post()
@UseFilters(new MiFilter())
async crear(@Body(new ValidationPipe()) dto: CrearDto) {
  // Si ValidationPipe falla, lanza BadRequestException
  // MiFilter debe poder manejarla
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Controladores** | Los pipes se aplican a los parámetros de los controladores (`@Param`, `@Body`, `@Query`). |
| **DTOs** | Los DTOs definen la estructura de datos y los decoradores de validación que los pipes evalúan. |
| **class-validator / class-transformer** | Bibliotecas que habilitan la validación declarativa mediante decoradores en los DTOs. |
| **Exception Filters** | Capturan las excepciones lanzadas por los pipes (`BadRequestException`). |
| **Interceptors** | Los pipes se ejecutan antes que los interceptors. Un pipe fallido evita que el interceptor se ejecute. |
| **Guards** | Los guards se ejecutan antes que los pipes. Si el guard rechaza la petición, los pipes nunca se ejecutan. |
| **Custom Providers** | Los pipes pueden inyectar dependencias si se registran como providers. |
| **Middleware** | Los middlewares operan a nivel HTTP antes de los guards y pipes. |

## Resumen

- Los **Pipes** transforman y validan datos en el punto de entrada de los controladores.
- Implementan `PipeTransform` con el método `transform(value, metadata)`.
- Se aplican a nivel **global**, **controlador**, **método** o **parámetro**.
- Los pipes **incorporados** (`ParseIntPipe`, `ValidationPipe`, etc.) cubren la mayoría de casos.
- **ValidationPipe** + **class-validator** + **class-transformer** = validación declarativa poderosa.
- Usa `whitelist: true`, `forbidNonWhitelisted: true` y `transform: true` en tu ValidationPipe global.
- Los pipes se ejecutan en **orden de declaración** y antes de los interceptors.
- **Nunca** pongas lógica de negocio en un pipe — valida y transforma, nada más.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Cuáles son las dos responsabilidades principales de un Pipe?</summary>

**Respuesta:** Transformación (convertir datos al formato deseado) y Validación (asegurar que los datos cumplen reglas). Ambas se implementan en el método `transform()`.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué pipe incorporado usarías para convertir el string <code>"42"</code> al número <code>42</code> en un parámetro de ruta?</summary>

**Respuesta:** `ParseIntPipe`. Se usa como `@Param('id', ParseIntPipe) id: number`. Lanza `BadRequestException` si el valor no es un número válido.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué hace la opción <code>whitelist: true</code> en ValidationPipe?</summary>

**Respuesta:** Elimina automáticamente cualquier propiedad del body que no tenga un decorador de validación en el DTO. Es una medida de seguridad para evitar inyección de propiedades no esperadas.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿En qué orden se ejecutan Guards, Pipes e Interceptors?</summary>

**Respuesta:** Guards → Interceptors (pre) → Pipes → Controlador → Interceptors (post). Los guards deciden si la petición continúa, luego los interceptors envuelven la ejecución, y finalmente los pipes transforman los parámetros justo antes del controlador.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cuándo deberías crear un Pipe personalizado en lugar de usar los incorporados?</summary>

**Respuesta:** Cuando necesitas lógica de transformación o validación específica que los pipes incorporados no cubren, como sanitizar entradas (TrimPipe), validar archivos, transformar objetos complejos, o aplicar reglas de negocio personalizadas. El 90% de los casos se cubre con `ValidationPipe` y `ParseIntPipe`.
</details>
