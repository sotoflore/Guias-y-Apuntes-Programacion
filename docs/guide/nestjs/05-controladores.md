---
title: Controladores en NestJS
description: Aprende qué son los controladores en NestJS, cómo manejan rutas HTTP, decoradores @Get, @Post, @Param, @Body y buenas prácticas para construir APIs REST.
---

# Controladores en NestJS

Los controladores son el punto de entrada de las peticiones HTTP en una aplicación NestJS. Actúan como recepcionistas que reciben las solicitudes del exterior, las validan y las redirigen a los servicios correspondientes.

## ¿Qué es?

Un **controlador** es una clase TypeScript decorada con `@Controller()` que se encarga de manejar las peticiones entrantes y devolver respuestas al cliente. Cada método dentro del controlador puede estar asociado a una ruta y un verbo HTTP específico.

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  @Get()
  findAll(): string {
    return 'Lista de usuarios';
  }
}
```

En este ejemplo, cuando alguien hace `GET /usuarios`, NestJS ejecuta el método `findAll()`.

## ¿Por qué es importante?

Sin controladores, tu código terminaría siendo una mezcla indescifrable de lógica de rutas, validación, acceso a datos y respuestas. Los controladores te permiten:

- **Separar responsabilidades**: cada capa tiene un trabajo claro.
- **Mantener el código organizado**: las rutas viven en un lugar predecible.
- **Escalar tu aplicación**: añadir nuevos endpoints es tan sencillo como crear un nuevo método o controlador.
- **Testear de forma aislada**: puedes probar la lógica de rutas sin depender de la base de datos o servicios externos.

:::tip
Piensa en un controlador como el **menú de un restaurante**. El cliente (navegador) hace un pedido (petición HTTP) y el mesero (controlador) lo lleva a la cocina (servicio) y luego trae el plato preparado (respuesta).
:::

## Problema que resuelve

Imagina que construyes una API sin controladores. Terminarías con código como este:

```typescript
// ❌ Sin controladores: todo mezclado
import { createServer } from 'http';
import { parse } from 'url';

const server = createServer((req, res) => {
  const { pathname } = parse(req.url || '', true);

  if (req.method === 'GET' && pathname === '/usuarios') {
    // lógica para listar usuarios...
    res.end('Lista de usuarios');
  } else if (req.method === 'POST' && pathname === '/usuarios') {
    // lógica para crear usuario...
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => res.end('Usuario creado'));
  }
  // más rutas aquí...
});
```

Este enfoque tiene graves problemas:

1. **Escalabilidad**: añadir 50 rutas vuelve este archivo inmantenible.
2. **Legibilidad**: la lógica de rutas, validación y negocio está mezclada.
3. **Testabilidad**: probar una ruta específica requiere mockear todo el servidor.
4. **Mantenibilidad**: un cambio en una ruta puede afectar a otras.

Los controladores de NestJS resuelven esto de forma elegante:

```typescript
// ✅ Con controladores: limpio y organizado
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }
}
```

## Cómo funciona

NestJS utiliza el **patrón Decorador** para asociar metadatos a las clases y sus métodos. Cuando la aplicación arranca, el **NestJS Router** escanea todos los controladores registrados y construye un mapa interno de rutas.

### Flujo de una petición

```
Cliente → Petición HTTP → NestJS Router → Controlador → Servicio → Base de Datos
                                    ↓                        ↓
                              Busca el controlador      Procesa la lógica
                              y método que coincide     de negocio
                              con la ruta y verbo
                                    ↓
                              Ejecuta el método
                              del controlador
                                    ↓
                              Devuelve respuesta ← Serializa a JSON ←
```

### Proceso interno paso a paso

1. **Registro**: los controladores se declaran en el módulo correspondiente mediante `controllers: []`.
2. **Escaneo**: NestJS lee los decoradores `@Controller()`, `@Get()`, `@Post()`, etc. y extrae el prefijo de ruta y los verbos HTTP.
3. **Enrutamiento**: construye un `RouterExplorer` que asocia cada combinación (ruta + verbo) con un método específico.
4. **Ejecución**: cuando llega una petición, el router encuentra el método adecuado, extrae los parámetros (query, body, params) y lo ejecuta.
5. **Respuesta**: el valor retornado por el método se serializa automáticamente a JSON (a menos que devuelvas un objeto `Response` de Node.js).

## Sintaxis

### Decoradores principales

| Decorador | Verbo HTTP | Uso |
|---|---|---|
| `@Get()` | GET | Obtener recursos |
| `@Post()` | POST | Crear recursos |
| `@Put()` | PUT | Actualizar recursos completos |
| `@Patch()` | PATCH | Actualizar recursos parcialmente |
| `@Delete()` | DELETE | Eliminar recursos |
| `@Options()` | OPTIONS | Consultar opciones del recurso |
| `@Head()` | HEAD | Obtener cabeceras sin cuerpo |
| `@All()` | Cualquiera | Responder a cualquier verbo |

### Decoradores de parámetros

| Decorador | Descripción |
|---|---|
| `@Param(key?: string)` | Parámetros de ruta (`:id`, `:slug`) |
| `@Body(key?: string)` | Cuerpo de la petición (POST, PUT, PATCH) |
| `@Query(key?: string)` | Parámetros query string (`?page=1`) |
| `@Headers(key?: string)` | Cabeceras HTTP |
| `@Ip()` | Dirección IP del cliente |
| `@Req()` | Objeto `Request` completo de Express/Fastify |
| `@Res()` | Objeto `Response` completo de Express/Fastify |

:::warning
Usar `@Res()` directamente desactiva algunas características de NestJS como los interceptores y el manejo de respuestas estándar. Prefiere devolver valores directamente.
:::

## Ejemplo básico

Construyamos un controlador simple para gestionar tareas pendientes.

```typescript
// tareas.controller.ts
import { Controller, Get, Post, Param, Body } from '@nestjs/common';

@Controller('tareas')
export class TareasController {
  private tareas: string[] = ['Aprender NestJS', 'Crear API REST'];

  @Get()
  obtenerTodas(): string[] {
    return this.tareas;
  }

  @Get(':id')
  obtenerUna(@Param('id') id: string): string {
    return this.tareas[Number(id)] || 'Tarea no encontrada';
  }

  @Post()
  crear(@Body('titulo') titulo: string): string {
    this.tareas.push(titulo);
    return `Tarea "${titulo}" creada con éxito`;
  }
}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TareasController } from './tareas.controller';

@Module({
  controllers: [TareasController],
})
export class AppModule {}
```

:::note
Este ejemplo usa un array en memoria. En una aplicación real usarías una base de datos y un servicio.
:::

## Ejemplo intermedio

Ahora con DTOs, validación y un servicio separado.

<CodeGroup>
<CodeGroupItem title="tareas.controller.ts">

```typescript
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CrearTareaDto } from './dto/crear-tarea.dto';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  async obtenerTodas() {
    return this.tareasService.obtenerTodas();
  }

  @Get(':id')
  async obtenerUna(@Param('id', ParseIntPipe) id: number) {
    return this.tareasService.obtenerUna(id);
  }

  @Post()
  async crear(@Body() crearTareaDto: CrearTareaDto) {
    return this.tareasService.crear(crearTareaDto);
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="tareas.service.ts">

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CrearTareaDto } from './dto/crear-tarea.dto';

@Injectable()
export class TareasService {
  private tareas: { id: number; titulo: string; completada: boolean }[] = [];
  private idCounter = 1;

  obtenerTodas() {
    return this.tareas;
  }

  obtenerUna(id: number) {
    const tarea = this.tareas.find(t => t.id === id);
    if (!tarea) throw new NotFoundException(`Tarea #${id} no encontrada`);
    return tarea;
  }

  crear(crearTareaDto: CrearTareaDto) {
    const tarea = {
      id: this.idCounter++,
      titulo: crearTareaDto.titulo,
      completada: false,
    };
    this.tareas.push(tarea);
    return tarea;
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="dto/crear-tarea.dto.ts">

```typescript
import { IsString, MinLength } from 'class-validator';

export class CrearTareaDto {
  @IsString()
  @MinLength(3)
  titulo: string;
}
```

</CodeGroupItem>
</CodeGroup>

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';

@Module({
  controllers: [TareasController],
  providers: [TareasService],
})
export class AppModule {}
```

<details>
<summary>🔍 ¿Qué mejoras introdujimos?</summary>

- **DTOs**: definimos la estructura esperada del body con validación.
- **Servicio**: separamos la lógica de negocio del controlador.
- **ParseIntPipe**: transformamos y validamos el `id` automáticamente.
- **Manejo de errores**: devolvemos `404` si la tarea no existe.
- **Métodos asíncronos**: preparamos el controlador para operaciones async reales.

</details>

## Ejemplo avanzado

Un controlador completo con paginación, filtros, versionado de API y documentación con Swagger.

```typescript
// tareas.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TareasService } from './tareas.service';
import { CrearTareaDto } from './dto/crear-tarea.dto';
import { ActualizarTareaDto } from './dto/actualizar-tarea.dto';
import { FiltroTareasDto } from './dto/filtro-tareas.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';

@ApiTags('Tareas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'tareas', version: '1' })
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Obtener todas las tareas del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de tareas paginada' })
  async obtenerTodas(
    @Query() filtros: FiltroTareasDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @UsuarioActual('id') usuarioId: number,
  ) {
    return this.tareasService.obtenerTodas(usuarioId, filtros, page, limit);
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async obtenerUna(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual('id') usuarioId: number,
  ) {
    return this.tareasService.obtenerUna(id, usuarioId);
  }

  @Post()
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  async crear(
    @Body() crearTareaDto: CrearTareaDto,
    @UsuarioActual('id') usuarioId: number,
  ) {
    return this.tareasService.crear(crearTareaDto, usuarioId);
  }

  @Patch(':id')
  @Version('1')
  @ApiOperation({ summary: 'Actualizar parcialmente una tarea' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarTareaDto: ActualizarTareaDto,
    @UsuarioActual('id') usuarioId: number,
  ) {
    return this.tareasService.actualizar(id, actualizarTareaDto, usuarioId);
  }

  @Delete(':id')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  async eliminar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual('id') usuarioId: number,
  ) {
    return this.tareasService.eliminar(id, usuarioId);
  }
}
```

```typescript
// dto/filtro-tareas.dto.ts
import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FiltroTareasDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  completada?: boolean;

  @IsOptional()
  @IsString()
  busqueda?: string;
}
```

<details>
<summary>🔍 ¿Qué hace este ejemplo avanzado?</summary>

1. **Autenticación**: protegemos todas las rutas con `JwtAuthGuard`.
2. **Usuario actual**: extraemos el ID del usuario autenticado mediante un decorador personalizado `@UsuarioActual()`.
3. **Versionado**: soporte para múltiples versiones de API.
4. **Paginación**: controlamos `page` y `limit` con valores por defecto.
5. **Filtros**: permitimos filtrar por estado y búsqueda mediante query params.
6. **Swagger**: documentación completa con `@nestjs/swagger`.
7. **Códigos HTTP explícitos**: `201` para creación, `204` para eliminación.
8. **Validación tipada**: todos los DTOs con decoradores `class-validator`.

</details>

## Caso de uso real

Imagina que trabajas en una startup que desarrolla una plataforma de gestión de proyectos similar a Trello o Asana. Tu API debe manejar:

- **Autenticación** de usuarios.
- **CRUD** de proyectos, tableros, listas y tarjetas.
- **Búsqueda** y filtros avanzados.
- **Notificaciones** en tiempo real.
- **Roles y permisos** por equipo.

Cada recurso tendría su propio controlador:

```typescript
// Estructura real de controladores en un proyecto empresarial
src/
  modules/
    auth/
      auth.controller.ts        # POST /auth/login, POST /auth/register
    usuarios/
      usuarios.controller.ts    # GET/PATCH /usuarios/:id
    proyectos/
      proyectos.controller.ts   # CRUD /proyectos
    tableros/
      tableros.controller.ts    # CRUD /proyectos/:proyectoId/tableros
    listas/
      listas.controller.ts      # CRUD /tableros/:tableroId/listas
    tarjetas/
      tarjetas.controller.ts    # CRUD /listas/:listaId/tarjetas
    equipos/
      equipos.controller.ts     # CRUD /equipos, miembros, roles
```

Cada controlador se mantiene pequeño y enfocado porque **solo maneja rutas y delega la lógica a servicios**.

:::tip
En una aplicación real, los controladores suelen tener **entre 3 y 8 métodos**. Si un controlador supera esa cantidad, considera dividirlo por subdominios.
:::

## Buenas prácticas

### 1. Mantén los controladores delgados

El controlador solo debe: recibir la petición, delegar al servicio y devolver la respuesta. **Nunca** pongas lógica de negocio aquí.

```typescript
// ✅ Bien
@Get(':id')
async obtener(@Param('id', ParseIntPipe) id: number) {
  return this.usuariosService.obtener(id);
}

// ❌ Mal
@Get(':id')
async obtener(@Param('id') id: string) {
  const usuarioId = parseInt(id, 10);
  if (isNaN(usuarioId)) throw new BadRequestException();
  const usuario = await this.db.query(`SELECT * FROM usuarios WHERE id = ${usuarioId}`);
  return usuario;
}
```

### 2. Usa DTOs para definir contratos claros

Nunca recibas el body como `any` o sin tipado. Usa siempre clases DTO con validación.

### 3. Versiona tu API desde el principio

```typescript
@Controller({ path: 'usuarios', version: '1' })
export class UsuariosV1Controller {}
```

### 4. Prefiere devolver valores a usar @Res()

NestJS serializa automáticamente los objetos retornados a JSON. Usar `@Res()` rompe esta característica.

### 5. Nombra los métodos de forma descriptiva

Usa nombres que reflejen la acción: `obtenerTodas()`, `crear()`, `actualizar()`, `eliminar()`.

### 6. Usa pipes de validación global

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

### 7. Agrupa rutas relacionadas con prefijos

```typescript
@Controller('usuarios')
@Controller('admin/usuarios')
```

## Errores comunes

### 1. Olvidar registrar el controlador en el módulo

```typescript
// ❌ Error: controlador no registrado
@Module({
  providers: [UsuariosService],
  // Falta: controllers: [UsuariosController],
})
export class UsuariosModule {}
```

> **Síntoma**: NestJS lanza `Cannot GET /usuarios` sin razón aparente.

### 2. Usar @Res() y esperar que NestJS maneje la respuesta

```typescript
// ❌ Error: pierdes interceptores y manejo estándar
@Get()
findAll(@Res() res: Response) {
  return res.json({ datos: [] });  // Los interceptores no se ejecutan
}
```

### 3. No usar pipes de validación

```typescript
// ❌ Error: id llega como string
@Get(':id')
obtener(@Param('id') id: number) {
  // id es string, no number
  return this.service.obtener(id);  // ¡Explota!
}
```

### 4. Métodos con demasiadas responsabilidades

```typescript
// ❌ Error: el controlador hace de todo
@Post()
async crear(@Body() dto: any) {
  // Validar manualmente
  if (!dto.email) throw new BadRequestException();
  // Enviar email
  await this.emailService.enviar(...);
  // Guardar en DB
  return this.db.save(dto);
  // Debería delegar al servicio
}
```

### 5. Olvidar que los controladores son singleton

Los controladores se instancian una sola vez (a menos que uses `SCOPE.REQUEST`). No guardes estado mutable en propiedades de clase.

```typescript
// ❌ Error: estado compartido entre peticiones
@Controller('contador')
export class ContadorController {
  private contador = 0;  // Este valor se comparte entre TODOS los usuarios

  @Post()
  incrementar() {
    this.contador++;  // Propenso a race conditions
    return this.contador;
  }
}
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Módulos** | Los controladores se agrupan dentro de módulos. Un módulo declara qué controladores contiene. |
| **Servicios** | Los controladores dependen de servicios para la lógica de negocio. La inyección se hace en el constructor. |
| **Pipes** | Se usan en los parámetros de los controladores para transformar y validar datos. |
| **Guards** | Protegen los controladores o métodos específicos verificando autenticación/permisos. |
| **Interceptors** | Envuelven la ejecución del controlador para transformar respuestas o medir tiempos. |
| **Filters** | Capturan excepciones lanzadas por los controladores y devuelven respuestas HTTP adecuadas. |
| **Decoradores personalizados** | Puedes crear decoradores propios para los parámetros de los controladores. |
| **DTOs** | Definen la estructura de los datos que entran y salen del controlador. |

## Resumen

- Los **controladores** manejan las peticiones HTTP entrantes y delegan la lógica a servicios.
- Se decoran con `@Controller()` y sus métodos con decoradores de verbo HTTP.
- Usan decoradores de parámetros (`@Param`, `@Body`, `@Query`) para extraer datos de la petición.
- **Nunca** deben contener lógica de negocio o acceso a bases de datos.
- Deben ser **delgados, enfocados y fáciles de testear**.
- Se registran en el módulo correspondiente mediante `controllers: []`.
- NestJS serializa automáticamente las respuestas a JSON.

## Quiz

Pon a prueba lo que aprendiste sobre controladores en NestJS.

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué decorador se usa para definir un controlador en NestJS?</summary>

**Respuesta:** `@Controller('prefijo')`. Este decorador marca la clase como un controlador y opcionalmente define un prefijo de ruta para todos sus métodos.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cuál es la principal responsabilidad de un controlador?</summary>

**Respuesta:** Recibir peticiones HTTP, extraer parámetros, delegar la lógica de negocio a servicios y devolver la respuesta al cliente. Nunca debe contener lógica de negocio.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Qué problema causa usar <code>@Res()</code> en un método del controlador?</summary>

**Respuesta:** Desactiva las características de NestJS como interceptores, el manejo estándar de respuestas y la serialización automática. Se pierde la integración con el pipeline de NestJS.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué decorador usarías para obtener el parámetro <code>:id</code> de la ruta <code>/usuarios/:id</code>?</summary>

**Respuesta:** `@Param('id')`. Extrae el valor del parámetro de ruta nombrado `id`. Combinado con `ParseIntPipe` para transformarlo a número.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Qué sucede si olvidas declarar un controlador en el array <code>controllers</code> de un módulo?</summary>

**Respuesta:** NestJS no registrará las rutas del controlador y las peticiones a esas rutas devolverán `404 Not Found`. El controlador existe como clase pero no está conectado al router de NestJS.
</details>
