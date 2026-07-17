---
title: Rutas y enrutamiento en NestJS
description: Aprende cómo funcionan las rutas en NestJS, decoradores HTTP, parámetros de ruta, query params, rutas dinámicas, versionado y buenas prácticas de enrutamiento.
---

# Rutas y enrutamiento en NestJS

Las rutas son como el **mapa de calles de una ciudad**: definen cómo llegar a cada destino (recurso) de tu API. Sin un buen sistema de rutas, los clientes nunca encontrarán lo que buscan.

## ¿Qué es?

El **enrutamiento** en NestJS es el mecanismo que asocia una combinación de **método HTTP + ruta** a un método específico de un controlador. Cada ruta es una puerta de entrada a una funcionalidad de tu aplicación.

```typescript
@Controller('usuarios')
export class UsuariosController {
  @Get(':id')
  obtenerUno(@Param('id') id: string) {
    // GET /usuarios/123 → este método se ejecuta
    return { id, nombre: 'Ana' };
  }
}
```

## ¿Por qué es importante?

Un sistema de rutas bien diseñado es la **base de toda API REST**. Las rutas importan porque:

- **Definen la interfaz pública** de tu API — es lo que ven los clientes.
- **Organizan los recursos** de forma lógica y predecible.
- **Afectan la experiencia del desarrollador** que consume tu API.
- **Determinan la escalabilidad** — una estructura de rutas clara permite añadir endpoints sin conflicto.
- **Influyen en la seguridad** — rutas bien diseñadas facilitan aplicar guards y filtros.

:::tip
Las rutas en NestJS siguen el estándar RESTful. Si entiendes REST, entiendes las rutas de NestJS. Si no, piensa en ellas como verbos (GET, POST) aplicados a sustantivos (/usuarios, /productos).
:::

## Problema que resuelve

Sin un sistema de enrutamiento declarativo, tendrías que construir el mapa de rutas a mano:

```typescript
// ❌ Sin enrutamiento declarativo: if-else gigante
const express = require('express');
const app = express();

// Rutas mezcladas con lógica de servidor
app.get('/api/usuarios', async (req, res) => { /* ... */ });
app.get('/api/usuarios/:id', async (req, res) => { /* ... */ });
app.post('/api/usuarios', async (req, res) => { /* ... */ });
app.put('/api/usuarios/:id', async (req, res) => { /* ... */ });
app.delete('/api/usuarios/:id', async (req, res) => { /* ... */ });

// Agrupar rutas relacionadas requiere prefijos manuales
app.get('/api/productos', async (req, res) => { /* ... */ });
app.get('/api/productos/:id', async (req, res) => { /* ... */ });

// Rutas anidadas se vuelven complejas
app.get('/api/usuarios/:userId/pedidos', async (req, res) => { /* ... */ });
```

Con NestJS, las rutas se declaran con decoradores y se organizan en controladores:

```typescript
// ✅ Con NestJS: rutas declarativas y organizadas
@Controller('usuarios')
export class UsuariosController {
  @Get()
  obtenerTodos() { /* GET /usuarios */ }

  @Get(':id')
  obtenerUno(@Param('id') id: string) { /* GET /usuarios/:id */ }

  @Post()
  crear(@Body() dto: CrearUsuarioDto) { /* POST /usuarios */ }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarDto) { /* PUT /usuarios/:id */ }

  @Delete(':id')
  eliminar(@Param('id') id: string) { /* DELETE /usuarios/:id */ }
}

@Controller('productos')
export class ProductosController {
  @Get()
  obtenerTodos() { /* GET /productos */ }
}
```

## Cómo funciona

### Construcción de rutas

NestJS combina el **prefijo del controlador** con la **ruta del decorador del método**:

```
@Controller('usuarios')  →  Prefijo base: /usuarios
  @Get()                 →  Ruta: /usuarios       (GET)
  @Get(':id')            →  Ruta: /usuarios/:id   (GET)
  @Post()                →  Ruta: /usuarios       (POST)
  @Get(':id/pedidos')    →  Ruta: /usuarios/:id/pedidos (GET)
```

### Prefijo global

Puedes definir un prefijo global para toda la aplicación:

```typescript
// main.ts
const app = await NestFactory.create(AppModule);
app.setGlobalPrefix('api/v1');
// Todas las rutas ahora son: /api/v1/usuarios, /api/v1/productos, etc.
```

### Proceso interno de enrutamiento

```
1. NestJS escanea controladores registrados en módulos
        │
        ▼
2. Lee @Controller('usuarios') → extrae prefijo
        │
        ▼
3. Lee @Get(':id') → extrae método + ruta
        │
        ▼
4. Construye mapa interno:
   { path: '/usuarios/:id', method: 'GET', handler: obtenerUno }
        │
        ▼
5. Cuando llega GET /usuarios/123:
   - Busca coincidencia en el mapa
   - Extrae parámetros (:id = "123")
   - Ejecuta el manejador
```

## Sintaxis

### Decoradores de ruta HTTP

| Decorador | Método HTTP | Uso |
|---|---|---|
| `@Get(path?)` | GET | Obtener recursos |
| `@Post(path?)` | POST | Crear recursos |
| `@Put(path?)` | PUT | Reemplazar recursos |
| `@Patch(path?)` | PATCH | Actualizar parcialmente |
| `@Delete(path?)` | DELETE | Eliminar recursos |
| `@Options(path?)` | OPTIONS | Consultar opciones |
| `@Head(path?)` | HEAD | Obtener cabeceras |
| `@All(path?)` | Cualquiera | Responder a cualquier método |

### Decoradores de parámetros

| Decorador | Extrae | Ejemplo de ruta | Valor |
|---|---|---|---|
| `@Param('id')` | Parámetro de ruta | `/usuarios/:id` | `"123"` |
| `@Query('page')` | Query string | `/usuarios?page=1` | `"1"` |
| `@Body()` | Cuerpo de la petición | POST `/usuarios` | `{ nombre: "Ana" }` |
| `@Headers('authorization')` | Cabecera HTTP | — | `"Bearer token..."` |
| `@Ip()` | IP del cliente | — | `"192.168.1.1"` |
| `@Req()` | Objeto Request completo | — | `req` |
| `@Res()` | Objeto Response completo | — | `res` |

### Patrones de ruta

```typescript
// Parámetro estático
@Get('perfil')               // /usuarios/perfil

// Parámetro dinámico
@Get(':id')                  // /usuarios/123

// Múltiples parámetros
@Get(':categoria/:producto') // /productos/electronica/iphone-15

// Parámetro opcional (regex)
@Get(':id?')                 // /usuarios o /usuarios/123

// Wildcard
@Get('*')                    // /usuarios/cualquier/cosa

// Rutas con guiones
@Get('ultimo-login')         // /usuarios/ultimo-login
```

:::warning
Las rutas estáticas deben declararse **antes** que las rutas dinámicas. Si `@Get('perfil')` está después de `@Get(':id')`, NestJS interpretará "perfil" como un `:id`.
:::

## Ejemplo básico

API REST básica con rutas CRUD para una entidad.

```typescript
// productos.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';

@Controller('productos')
export class ProductosController {
  private productos = [
    { id: 1, nombre: 'Laptop', precio: 1200 },
    { id: 2, nombre: 'Mouse', precio: 25 },
  ];

  @Get()
  obtenerTodos() {
    return this.productos;
  }

  @Get(':id')
  obtenerUno(@Param('id', ParseIntPipe) id: number) {
    const prod = this.productos.find(p => p.id === id);
    if (!prod) throw new NotFoundException(`Producto #${id} no encontrado`);
    return prod;
  }

  @Post()
  crear(@Body() body: { nombre: string; precio: number }) {
    const nuevo = { id: this.productos.length + 1, ...body };
    this.productos.push(nuevo);
    return nuevo;
  }

  @Put(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) throw new NotFoundException();
    this.productos[index] = { id, ...body };
    return this.productos[index];
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) throw new NotFoundException();
    this.productos.splice(index, 1);
    return { mensaje: `Producto #${id} eliminado` };
  }
}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';

@Module({
  controllers: [ProductosController],
})
export class AppModule {}
```

**Rutas generadas:**

| Método | Ruta | Función |
|---|---|---|
| GET | `/productos` | Listar todos |
| GET | `/productos/:id` | Obtener uno |
| POST | `/productos` | Crear |
| PUT | `/productos/:id` | Actualizar |
| DELETE | `/productos/:id` | Eliminar |

## Ejemplo intermedio

Rutas anidadas, query params, prefijos por controlador y rutas con múltiples parámetros.

<CodeGroup>
<CodeGroupItem title="usuarios.controller.ts">

```typescript
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // GET /usuarios?page=1&limit=10&activo=true
  @Get()
  async obtenerTodos(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('activo') activo?: string,
  ) {
    return this.usuariosService.obtenerTodos({ page, limit, activo });
  }

  // GET /usuarios/:id
  @Get(':id')
  async obtenerUno(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.obtenerUno(id);
  }

  // GET /usuarios/:id/pedidos
  @Get(':id/pedidos')
  async obtenerPedidos(
    @Param('id', ParseIntPipe) id: number,
    @Query('estado') estado?: string,
  ) {
    return this.usuariosService.obtenerPedidos(id, estado);
  }

  // GET /usuarios/:id/pedidos/:pedidoId
  @Get(':id/pedidos/:pedidoId')
  async obtenerPedido(
    @Param('id', ParseIntPipe) id: number,
    @Param('pedidoId', ParseIntPipe) pedidoId: number,
  ) {
    return this.usuariosService.obtenerPedido(id, pedidoId);
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="busqueda.controller.ts">

```typescript
import { Controller, Get, Query } from '@nestjs/common';

@Controller('busqueda')
export class BusquedaController {
  // GET /busqueda?q=laptop&categoria=electronica&orden=precio_asc
  @Get()
  async buscar(
    @Query('q') query: string,
    @Query('categoria') categoria?: string,
    @Query('orden') orden?: 'precio_asc' | 'precio_desc' | 'nombre',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    if (!query) throw new BadRequestException('Parámetro "q" es requerido');
    return this.busquedaService.buscar({ query, categoria, orden, page });
  }
}
```

</CodeGroupItem>
</CodeGroup>

```typescript
// main.ts — Prefijo global
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');  // Todas las rutas: /api/v1/...

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
```

**Rutas generadas:**

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/usuarios?page=1&limit=10` | Usuarios paginados |
| GET | `/api/v1/usuarios/5` | Usuario específico |
| GET | `/api/v1/usuarios/5/pedidos` | Pedidos del usuario |
| GET | `/api/v1/usuarios/5/pedidos/99` | Pedido específico |
| GET | `/api/v1/busqueda?q=laptop` | Búsqueda |

## Ejemplo avanzado

Versionado de API, controladores con múltiples prefijos, rutas con parámetros avanzados y enrutamiento condicional.

```typescript
// v1/productos.controller.ts — Versión 1
import { Controller, Get, Post, Param } from '@nestjs/common';

@Controller({ path: 'productos', version: '1' })
export class ProductosV1Controller {
  @Get()
  obtenerTodos() {
    return [{ id: 1, nombre: 'Producto V1', precio: 100 }];
  }
}
```

```typescript
// v2/productos.controller.ts — Versión 2
import { Controller, Get, Post, Param } from '@nestjs/common';

@Controller({ path: 'productos', version: '2' })
export class ProductosV2Controller {
  @Get()
  obtenerTodos() {
    return [
      { id: 1, nombre: 'Producto V2', precio: 100, moneda: 'USD', stock: 50 },
    ];
  }

  @Post()
  crear(@Body() dto: any) {
    return { ...dto, version: 'v2', creadoEn: new Date().toISOString() };
  }
}
```

```typescript
// main.ts — Configuración de versionado
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,  // /v1/productos, /v2/productos
    // type: VersioningType.HEADER,  // Header: Accept: application/json+v1
    // type: VersioningType.MEDIA_TYPE,  // Content-Type: application/json;v=1
  });

  await app.listen(3000);
}
```

```typescript
// admin/admin.controller.ts — Múltiples prefijos con path dinámico
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller({ path: 'admin/usuarios', version: '1' })
export class AdminUsuariosController {
  @Get()
  async listarTodos() {
    return this.adminService.listarUsuarios();
  }

  @Get(':id')
  async obtenerDetalle(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.obtenerDetalle(id);
  }

  @Get(':id/actividad')
  async obtenerActividad(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.obtenerActividad(id);
  }
}
```

```typescript
// controlador con enrutamiento condicional
import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('contenido')
export class ContenidoController {
  // GET /contenido/destacado  →  Contenido destacado
  // GET /contenido/:slug      →  Contenido por slug
  @Get(':slug')
  async obtener(@Param('slug') slug: string, @Req() req: Request) {
    if (slug === 'destacado') {
      return this.contenidoService.obtenerDestacados();
    }
    return this.contenidoService.obtenerPorSlug(slug);
  }
}
```

<details>
<summary>🔍 Tipos de versionado en NestJS</summary>

| Tipo | Cómo se indica la versión | Ejemplo de ruta |
|---|---|---|
| `URI` | En la URL | `/v1/productos`, `/v2/productos` |
| `HEADER` | Cabecera HTTP | `Accept: application/json+v1` |
| `MEDIA_TYPE` | Content-Type | `Content-Type: application/json;v=1` |

Para habilitar versionado por defecto para controladores sin `version`:

```typescript
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
```

</details>

## Caso de uso real

Estructura de rutas de una API de comercio electrónico como **Amazon** o **Mercado Libre**.

```
RUTAS DE LA API
─────────────────────────────────────────────────────────

# Módulo de Autenticación
POST   /api/v1/auth/registro
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/perfil

# Módulo de Usuarios
GET    /api/v1/usuarios
GET    /api/v1/usuarios/:id
PATCH  /api/v1/usuarios/:id
DELETE /api/v1/usuarios/:id
GET    /api/v1/usuarios/:id/direcciones
POST   /api/v1/usuarios/:id/direcciones
PUT    /api/v1/usuarios/:id/direcciones/:dirId

# Módulo de Productos
GET    /api/v1/productos
GET    /api/v1/productos/:id
GET    /api/v1/productos/:id/reviews
POST   /api/v1/productos/:id/reviews
GET    /api/v1/productos/:id/preguntas

# Módulo de Búsqueda
GET    /api/v1/busqueda?q=laptop&categoria=electronica&page=1&sort=precio_asc

# Módulo de Carrito
GET    /api/v1/carrito
POST   /api/v1/carrito/items
PATCH  /api/v1/carrito/items/:itemId
DELETE /api/v1/carrito/items/:itemId

# Módulo de Pedidos
POST   /api/v1/pedidos
GET    /api/v1/pedidos
GET    /api/v1/pedidos/:id
PATCH  /api/v1/pedidos/:id/estado
GET    /api/v1/pedidos/:id/seguimiento

# Módulo de Pagos
POST   /api/v1/pagos/tarjeta
POST   /api/v1/pagos/transferencia
GET    /api/v1/pagos/:id

# Módulo de Admin
GET    /api/v1/admin/panel
GET    /api/v1/admin/usuarios
GET    /api/v1/admin/ventas
GET    /api/v1/admin/ventas/:id/detalle
```

```typescript
// Estructura de controladores para este caso de uso
src/
  modules/
    auth/
      auth.controller.ts       # /api/v1/auth/*
    usuarios/
      usuarios.controller.ts   # /api/v1/usuarios/*
      direcciones.controller.ts # /api/v1/usuarios/:id/direcciones/*
    productos/
      productos.controller.ts  # /api/v1/productos/*
    busqueda/
      busqueda.controller.ts   # /api/v1/busqueda
    carrito/
      carrito.controller.ts    # /api/v1/carrito/*
    pedidos/
      pedidos.controller.ts    # /api/v1/pedidos/*
    pagos/
      pagos.controller.ts      # /api/v1/pagos/*
    admin/
      admin.controller.ts      # /api/v1/admin/*
```

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
```

## Buenas prácticas

### 1. Usa nombres en plural para recursos

```typescript
// ✅ Bien
@Controller('usuarios')
@Controller('productos')
@Controller('pedidos')

// ❌ Mal
@Controller('usuario')  // Singular
@Controller('getUsuarios')  // Verbo
@Controller('lista-de-usuarios')  // Innecesariamente largo
```

### 2. Mantén una estructura RESTful consistente

```
GET    /recursos        → Listar
POST   /recursos        → Crear
GET    /recursos/:id    → Obtener uno
PUT    /recursos/:id    → Reemplazar completo
PATCH  /recursos/:id    → Actualizar parcial
DELETE /recursos/:id    → Eliminar
```

### 3. Usa rutas anidadas para relaciones

```typescript
// ✅ Bien: refleja la jerarquía
GET /usuarios/:id/pedidos
GET /usuarios/:id/pedidos/:pedidoId

// ❌ Mal: plano
GET /pedidos-por-usuario/:id
```

### 4. Define el prefijo global en un solo lugar

```typescript
// ✅ Bien: un setGlobalPrefix en main.ts
app.setGlobalPrefix('api/v1');

// ❌ Mal: prefijo hardcodeado en cada controlador
@Controller('api/v1/usuarios')
@Controller('api/v1/productos')
```

### 5. Ordena rutas estáticas antes que dinámicas

```typescript
// ✅ Bien
@Get('perfil')     // /usuarios/perfil
@Get(':id')        // /usuarios/123

// ❌ Mal: :id atrapará "perfil"
@Get(':id')        // /usuarios/123
@Get('perfil')     // NUNCA se ejecuta
```

### 6. Versiona tu API desde el principio

```typescript
app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
```

Es más fácil añadir versión 2 cuando tienes versión 1, que añadir versionado a una API sin él.

### 7. Usa query params para filtros, no parámetros de ruta

```typescript
// ✅ Bien: filtros como query params
GET /productos?categoria=electronica&precioMax=500&orden=nombre

// ❌ Mal: filtros como parámetros de ruta
GET /productos/categoria/electronica/precioMax/500
```

### 8. Cada controlador debe tener un prefijo claro

```typescript
@Controller('usuarios')      // Todas las rutas empiezan con /usuarios
@Controller('admin/panel')   // Rutas administrativas: /admin/panel
```

## Errores comunes

### 1. Rutas estáticas después de rutas dinámicas

```typescript
// ❌ Error: 'contar' nunca se ejecutará porque :id lo atrapa antes
@Get(':id')
obtenerUno(@Param('id') id: string) {}

@Get('contar')
contar() {}

// ✅ Correcto: estáticas primero
@Get('contar')
contar() {}

@Get(':id')
obtenerUno(@Param('id') id: string) {}
```

### 2. Olvidar el prefijo global al documentar

Si tienes `setGlobalPrefix('api/v1')`, la ruta real es `/api/v1/usuarios`, no `/usuarios`. Asegúrate de reflejar esto en Swagger y documentación.

### 3. Parámetros de ruta sin ParseIntPipe

```typescript
// ❌ Error: id es string, no number
@Get(':id')
obtener(@Param('id') id: number) {
  return this.service.obtener(id + 1); // "5" + 1 = "51", no 6
}

// ✅ Correcto
@Get(':id')
obtener(@Param('id', ParseIntPipe) id: number) {
  return this.service.obtener(id + 1); // 5 + 1 = 6
}
```

### 4. Conflictos entre rutas de diferentes controladores

```typescript
// ❌ Error: dos controladores registran la misma ruta
@Controller('productos')
export class ProductosController {
  @Get(':id') obtener() {}
}

@Controller('productos')
export class OtroProductosController {
  @Get(':id') obtener() {}  // ¡Conflicto!
}
```

### 5. Rutas demasiado profundas o complejas

```typescript
// ❌ Mal: demasiado profundo
/usuarios/:id/pedidos/:pedidoId/items/:itemId/reviews/:reviewId/comentarios

// ✅ Bien: máximo 2-3 niveles
/usuarios/:id/pedidos
/pedidos/:pedidoId/items
/items/:itemId/reviews
```

### 6. Usar verbos en las rutas

```typescript
// ❌ Mal: el verbo está en el decorador, no en la ruta
@Post('crear-usuario')   // POST /usuarios/crear-usuario

// ✅ Bien: el recurso + el verbo HTTP bastan
@Post()                   // POST /usuarios
@Controller('usuarios')
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Controladores** | Las rutas se definen dentro de controladores mediante decoradores HTTP. |
| **Módulos** | Los controladores (y sus rutas) se registran en los módulos. |
| **Parámetros** | `@Param`, `@Query`, `@Body` extraen datos de la ruta y la petición. |
| **Pipes** | Los pipes transforman y validan los parámetros extraídos de las rutas. |
| **Guards** | Protegen rutas completas o métodos específicos. |
| **Prefijo global** | `setGlobalPrefix()` añade un prefijo a TODAS las rutas de la app. |
| **Versionado** | `enableVersioning()` permite múltiples versiones de rutas. |
| **Swagger** | Documenta automáticamente todas las rutas registradas. |

## Resumen

- Las **rutas** asocian un método HTTP + path con un método del controlador.
- El **prefijo del controlador** + la **ruta del decorador** = ruta completa.
- Usa `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete` para los verbos HTTP.
- `@Param` extrae parámetros de la ruta, `@Query` para query params, `@Body` para el cuerpo.
- Las **rutas estáticas** deben ir antes que las **dinámicas**.
- `app.setGlobalPrefix('api/v1')` añade un prefijo global.
- `app.enableVersioning()` activa el versionado de API.
- **RESTful**: nombres en plural, recursos anidados para relaciones, verbos HTTP para acciones.
- **Buenas prácticas**: rutas estáticas antes que dinámicas, filtros en query params, versionado desde el inicio, controladores con prefijos claros.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> Si un controlador tiene <code>@Controller('usuarios')</code> y un método tiene <code>@Get(':id/pedidos')</code>, ¿cuál es la ruta completa?</summary>

**Respuesta:** `GET /usuarios/:id/pedidos`. NestJS concatena el prefijo del controlador con la ruta del método.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Qué problema causa declarar una ruta dinámica antes que una estática?</summary>

**Respuesta:** La ruta estática nunca se ejecutará porque el parámetro dinámico (`:id`) atrapará cualquier valor, incluyendo la palabra clave de la ruta estática. Por ejemplo, si `@Get(':id')` está antes que `@Get('perfil')`, la ruta `perfil` se interpretará como un `id`.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Cuál es la diferencia entre <code>@Param('id')</code> y <code>@Query('page')</code>?</summary>

**Respuesta:** `@Param('id')` extrae un valor del **path** de la URL (`/usuarios/123` → `"123"`), mientras que `@Query('page')` extrae un valor del **query string** (`/usuarios?page=1` → `"1"`).
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué comando en main.ts hace que todas las rutas comiencen con <code>/api/v1/</code>?</summary>

**Respuesta:** `app.setGlobalPrefix('api/v1')`. Esto antepone `api/v1` a TODAS las rutas registradas, sin necesidad de modificar cada controlador individualmente.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Por qué es recomendable versionar la API desde el inicio?</summary>

**Respuesta:** Porque cuando la API crece y necesitas hacer cambios incompatibles (ej: cambiar la estructura de una respuesta), la versión anterior debe seguir funcionando para los clientes existentes. Es mucho más fácil si ya tienes `/v1/` desde el día uno que añadirlo después con cientos de clientes conectados.
</details>
