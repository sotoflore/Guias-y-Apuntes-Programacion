---
title: Servicios en NestJS
description: Aprende qué son los servicios en NestJS, cómo encapsulan la lógica de negocio, cómo se comunican con controladores y cómo organizarlos profesionalmente.
---

# Servicios en NestJS

Los servicios son como los **chefs en un restaurante**: los meseros (controladores) toman los pedidos, pero son los chefs (servicios) quienes realmente preparan la comida. Sin ellos, no hay plato que servir.

## ¿Qué es?

Un **servicio** es una clase decorada con `@Injectable()` que encapsula la **lógica de negocio** de la aplicación. Es donde ocurre el trabajo real: validaciones de negocio, cálculos, orquestación de procesos, llamadas a bases de datos y comunicación con APIs externas.

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsuariosService {
  private readonly usuarios = [
    { id: 1, nombre: 'Ana', email: 'ana@email.com' },
  ];

  encontrarPorId(id: number) {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  crear(datos: { nombre: string; email: string }) {
    const nuevo = { id: this.usuarios.length + 1, ...datos };
    this.usuarios.push(nuevo);
    return nuevo;
  }
}
```

## ¿Por qué es importante?

Los servicios son el **corazón de la arquitectura limpia** en NestJS. Sin servicios:

- Los controladores se llenarían de lógica de negocio, volviéndose ilegibles e imposibles de testear.
- La lógica duplicada aparecería en cada controlador que necesite la misma funcionalidad.
- El código sería imposible de reutilizar entre diferentes partes de la aplicación.
- El testing se volvería complejo (probar rutas HTTP para verificar lógica de negocio).

Los servicios te permiten:

- **Centralizar la lógica de negocio** en un solo lugar.
- **Reutilizar funcionalidad** entre múltiples controladores o incluso otros servicios.
- **Testear lógica pura** sin necesidad de HTTP, bases de datos o archivos de configuración.
- **Orquestar operaciones complejas** combinando múltiples servicios y repositorios.
- **Mantener controladores delgados** con una sola responsabilidad.

:::tip
Una regla simple: si un método de controlador tiene más de 3-5 líneas, esa lógica debería estar en un servicio. Si el servicio crece demasiado, divídelo en servicios más pequeños.
:::

## Problema que resuelve

Sin servicios, los controladores terminan siendo **archivos gigantes** que mezclan responsabilidades:

```typescript
// ❌ Sin servicios: el controlador hace de TODO
@Controller('pedidos')
export class PedidosController {
  constructor(@InjectRepository(Pedido) private repo: Repository<Pedido>) {}

  @Post()
  async crear(@Body() dto: any) {
    // 1. Validación manual
    if (!dto.productos?.length) throw new BadRequestException('Productos requeridos');
    if (!dto.clienteId) throw new BadRequestException('Cliente requerido');

    // 2. Calcular total
    let total = 0;
    for (const item of dto.productos) {
      total += item.precio * item.cantidad;
    }

    // 3. Aplicar descuento
    if (dto.cupon === 'DESC10') total *= 0.9;

    // 4. Verificar stock
    for (const item of dto.productos) {
      const stock = await this.repo.query(`SELECT stock FROM productos WHERE id = $1`, [item.id]);
      if (stock[0].stock < item.cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${item.id}`);
      }
    }

    // 5. Crear pedido en BD
    const pedido = this.repo.create({ clienteId: dto.clienteId, total, items: dto.productos });
    const guardado = await this.repo.save(pedido);

    // 6. Enviar email
    await fetch('https://email-service.com/send', {
      method: 'POST',
      body: JSON.stringify({ to: dto.email, template: 'pedido_confirmado' }),
    });

    // 7. Loguear
    console.log(`Pedido ${guardado.id} creado - Total: $${total}`);

    return guardado;
  }
}
```

Este controlador hace **7 cosas diferentes**. Ilegible, imposible de testear, imposible de reutilizar.

Con servicios:

```typescript
// ✅ Con servicios: el controlador solo delega
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  async crear(@Body() dto: CrearPedidoDto) {
    return this.pedidosService.crear(dto);  // Una línea
  }
}

@Injectable()
export class PedidosService {
  constructor(
    private readonly pedidosRepo: PedidosRepository,
    private readonly productosService: ProductosService,
    private readonly descuentosService: DescuentosService,
    private readonly emailService: EmailService,
    private readonly logger: LoggerService,
  ) {}

  async crear(dto: CrearPedidoDto) {
    const total = await this.descuentosService.calcularTotal(dto);
    await this.productosService.verificarStock(dto.productos);
    const pedido = await this.pedidosRepo.guardar(dto, total);
    await this.emailService.enviarConfirmacion(dto.email, pedido);
    this.logger.info(`Pedido ${pedido.id} creado`);
    return pedido;
  }
}
```

Cada servicio tiene **una responsabilidad**. El controlador tiene **una línea**.

## Cómo funciona

### Relación Controlador → Servicio → Repositorio

```
Controlador                 Servicio                 Repositorio/Infraestructura
┌─────────────┐           ┌──────────────┐           ┌─────────────────────┐
│ Recibe HTTP  │           │ Lógica de    │           │ Acceso a datos      │
│ Valida params│ ────────► │ negocio      │ ────────► │ API externa         │
│ Delega       │           │ Orquestación │           │ Sistema de archivos │
│ Responde     │ ◄──────── │ Cálculos     │ ◄──────── │ Caché               │
└─────────────┘           └──────────────┘           └─────────────────────┘
```

### Flujo típico de un servicio

```
1. Controlador llama a servicio.metodo(dto)
        │
        ▼
2. Servicio recibe DTO ya validado por pipes
        │
        ▼
3. Servicio aplica lógica de negocio
   - Validaciones de negocio (¿tiene saldo? ¿está activo?)
   - Cálculos (total, impuestos, descuentos)
   - Decisiones (¿qué flujo seguir según el estado?)
        │
        ▼
4. Servicio llama a repositorios/APIs externas
        │
        ▼
5. Servicio transforma datos a formato de respuesta
        │
        ▼
6. Servicio retorna resultado al controlador
```

### Lo que un servicio NO debe hacer

```typescript
// ❌ Un servicio NO debe:
// - Acceder al objeto Request/Response HTTP
// - Validar formato de datos (eso es trabajo de Pipes/DTOs)
// - Manejar rutas HTTP (eso es trabajo del controlador)
// - Tener estado mutable global (compartido entre peticiones)

// ✅ Un servicio SÍ debe:
// - Contener lógica de negocio
// - Orquestar llamadas a repositorios y APIs
// - Aplicar reglas de dominio
// - Llamar a otros servicios
```

## Sintaxis

### Estructura básica

```typescript
@Injectable()
export class NombreService {
  constructor(
    // Dependencias inyectadas automáticamente
    private readonly otroServicio: OtroService,
    private readonly repositorio: Repositorio,
  ) {}

  // Métodos públicos (la API del servicio)
  async metodoPrincipal(dto: DtoEntrada): Promise<DtoSalida> {
    // 1. Validaciones de negocio
    // 2. Operaciones
    // 3. Llamadas a repositorios
    // 4. Transformación de respuesta
    return resultado;
  }

  // Métodos privados (helpers internos)
  private metodoInterno(dato: string): number {
    return dato.length;
  }
}
```

### Patrones de métodos en servicios

| Patrón | Descripción | Ejemplo |
|---|---|---|
| **CRUD** | Operaciones básicas de entidad | `crear()`, `obtener()`, `actualizar()`, `eliminar()` |
| **Búsqueda** | Consultas con filtros | `buscarPorEmail()`, `listarActivos()`, `obtenerConFiltros()` |
| **Orquestación** | Combina múltiples operaciones | `procesarPedido()`, `registrarUsuario()`, `ejecutarPago()` |
| **Validación de negocio** | Reglas de dominio | `puedeAcceder()`, `tieneSaldo()`, `esValidoPara()` |
| **Transformación** | Convierte datos entre formatos | `mapearADto()`, `enriquecerConDatos()` |

## Ejemplo básico

CRUD completo de tareas con servicio separado del controlador.

```typescript
// tareas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
}

@Injectable()
export class TareasService {
  private tareas: Tarea[] = [
    { id: 1, titulo: 'Aprender NestJS', completada: false },
    { id: 2, titulo: 'Crear API REST', completada: true },
  ];
  private idCounter = 3;

  obtenerTodas(): Tarea[] {
    return this.tareas;
  }

  obtenerUna(id: number): Tarea {
    const tarea = this.tareas.find(t => t.id === id);
    if (!tarea) throw new NotFoundException(`Tarea #${id} no encontrada`);
    return tarea;
  }

  crear(titulo: string): Tarea {
    const tarea: Tarea = {
      id: this.idCounter++,
      titulo,
      completada: false,
    };
    this.tareas.push(tarea);
    return tarea;
  }

  completar(id: number): Tarea {
    const tarea = this.obtenerUna(id);
    tarea.completada = true;
    return tarea;
  }

  eliminar(id: number): void {
    const index = this.tareas.findIndex(t => t.id === id);
    if (index === -1) throw new NotFoundException(`Tarea #${id} no encontrada`);
    this.tareas.splice(index, 1);
  }
}
```

```typescript
// tareas.controller.ts
import { Controller, Get, Post, Param, Delete, ParseIntPipe, Body } from '@nestjs/common';
import { TareasService } from './tareas.service';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  obtenerTodas() {
    return this.tareasService.obtenerTodas();
  }

  @Get(':id')
  obtenerUna(@Param('id', ParseIntPipe) id: number) {
    return this.tareasService.obtenerUna(id);
  }

  @Post()
  crear(@Body('titulo') titulo: string) {
    return this.tareasService.crear(titulo);
  }

  @Post(':id/completar')
  completar(@Param('id', ParseIntPipe) id: number) {
    return this.tareasService.completar(id);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    this.tareasService.eliminar(id);
    return { mensaje: 'Tarea eliminada' };
  }
}
```

## Ejemplo intermedio

Servicio que combina múltiples dependencias, llama a una API externa, aplica lógica de negocio y transforma respuestas.

<CodeGroup>
<CodeGroupItem title="clima/clima.service.ts">

```typescript
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class ClimaService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async obtenerClima(ciudad: string): Promise<{
    ciudad: string;
    temperatura: number;
    humedad: number;
    descripcion: string;
  }> {
    const apiKey = this.configService.get('CLIMA_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather`;

    this.logger.info(`Consultando clima para: ${ciudad}`);

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: { q: ciudad, appid: apiKey, units: 'metric', lang: 'es' },
        }),
      );

      return {
        ciudad: data.name,
        temperatura: Math.round(data.main.temp),
        humedad: data.main.humidity,
        descripcion: data.weather[0].description,
      };
    } catch (error) {
      this.logger.error(`Error consultando clima para ${ciudad}`, error);
      throw new HttpException(
        `No se pudo obtener el clima para ${ciudad}`,
        error.response?.status || 500,
      );
    }
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="clima/clima.controller.ts">

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { ClimaService } from './clima.service';

@Controller('clima')
export class ClimaController {
  constructor(private readonly climaService: ClimaService) {}

  @Get(':ciudad')
  async obtenerClima(@Param('ciudad') ciudad: string) {
    return this.climaService.obtenerClima(ciudad);
  }
}
```

</CodeGroupItem>
<CodeGroupItem title="clima/clima.module.ts">

```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClimaController } from './clima.controller';
import { ClimaService } from './clima.service';

@Module({
  imports: [HttpModule],
  controllers: [ClimaController],
  providers: [ClimaService],
})
export class ClimaModule {}
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo avanzado

Servicio con transacciones, manejo de errores, logging estructurado, eventos y comunicación entre servicios.

```typescript
// pedidos/pedidos.service.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';
import { ProductosService } from '../productos/productos.service';
import { ClientesService } from '../clientes/clientes.service';
import { EmailService } from '../../common/email/email.service';
import { LoggerService } from '../../common/logger/logger.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { PedidoCreadoEvent } from './events/pedido-creado.event';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
    @InjectRepository(PedidoItem)
    private readonly itemRepo: Repository<PedidoItem>,
    private readonly dataSource: DataSource,
    private readonly productosService: ProductosService,
    private readonly clientesService: ClientesService,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService,
  ) {}

  async crear(dto: CrearPedidoDto, usuarioId: number): Promise<Pedido> {
    // 1. Validar cliente
    const cliente = await this.clientesService.obtenerPorUsuario(usuarioId);
    if (!cliente.activo) {
      throw new BadRequestException('El cliente no puede realizar pedidos');
    }

    // 2. Validar y obtener productos
    const productos = await this.productosService.validarDisponibilidad(
      dto.items.map(i => i.productoId),
    );

    // 3. Calcular totales
    let subtotal = 0;
    const items: PedidoItem[] = [];

    for (const item of dto.items) {
      const producto = productos.find(p => p.id === item.productoId);
      if (!producto) {
        throw new NotFoundException(`Producto #${item.productoId} no encontrado`);
      }
      if (producto.stock < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`,
        );
      }

      const totalItem = producto.precio * item.cantidad;
      subtotal += totalItem;

      items.push(
        this.itemRepo.create({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          total: totalItem,
        }),
      );
    }

    // 4. Ejecutar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pedido = this.pedidoRepo.create({
        clienteId: cliente.id,
        items,
        subtotal,
        impuesto: subtotal * 0.19,
        total: subtotal * 1.19,
        estado: 'pendiente',
        creadoPor: usuarioId,
      });

      const pedidoGuardado = await queryRunner.manager.save(pedido);

      // Descontar stock
      for (const item of dto.items) {
        await this.productosService.descontarStock(
          item.productoId,
          item.cantidad,
          queryRunner.manager,
        );
      }

      await queryRunner.commitTransaction();

      // 5. Efectos secundarios (fuera de la transacción)
      this.eventEmitter.emit(
        'pedido.creado',
        new PedidoCreadoEvent(pedidoGuardado.id, cliente.email, pedidoGuardado.total),
      );

      this.logger.info(`Pedido ${pedidoGuardado.id} creado exitosamente`, {
        cliente: cliente.id,
        total: pedidoGuardado.total,
        items: items.length,
      });

      return pedidoGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error creando pedido`, error);
      throw new InternalServerErrorException('Error al procesar el pedido');
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerHistorial(usuarioId: number, page = 1, limit = 10) {
    const cliente = await this.clientesService.obtenerPorUsuario(usuarioId);

    const [pedidos, total] = await this.pedidoRepo.findAndCount({
      where: { clienteId: cliente.id },
      relations: ['items'],
      order: { creadoEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: pedidos,
      meta: {
        total,
        page,
        limit,
        totalPaginas: Math.ceil(total / limit),
      },
    };
  }

  async cancelar(pedidoId: number, usuarioId: number): Promise<Pedido> {
    const pedido = await this.pedidoRepo.findOne({
      where: { id: pedidoId, creadoPor: usuarioId },
      relations: ['items'],
    });

    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    if (pedido.estado !== 'pendiente') {
      throw new BadRequestException('Solo se pueden cancelar pedidos pendientes');
    }

    pedido.estado = 'cancelado';
    const cancelado = await this.pedidoRepo.save(pedido);

    // Restaurar stock
    for (const item of cancelado.items) {
      await this.productosService.restaurarStock(item.productoId, item.cantidad);
    }

    this.logger.info(`Pedido ${pedidoId} cancelado`);
    return cancelado;
  }
}
```

<details>
<summary>🔍 ¿Qué hace este servicio avanzado?</summary>

1. **Validación de negocio**: cliente activo, stock disponible.
2. **Cálculos**: subtotal, impuesto (19%), total.
3. **Transacción**: toda la operación es atómica (pedido + descuento de stock).
4. **Eventos**: emite `pedido.creado` para que otros servicios reaccionen (email, notificaciones).
5. **Rollback**: si algo falla, todo se deshace automáticamente.
6. **Paginación**: `obtenerHistorial` con metadata de paginación.
7. **Logging**: cada operación queda registrada con contexto.
8. **Manejo de errores**: cada error tiene un mensaje claro y un código HTTP apropiado.

</details>

## Caso de uso real

Servicios en una plataforma de e-learning como **Platzi**, **Coursera** o **Udemy**.

```typescript
// modules/cursos/services/inscripcion.service.ts
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CursosService } from './cursos.service';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { PagosService } from '../../pagos/services/pagos.service';
import { CertificadosService } from './certificados.service';
import { LoggerService } from '../../../common/logger/logger.service';

@Injectable()
export class InscripcionService {
  constructor(
    private readonly cursosService: CursosService,
    private readonly usuariosService: UsuariosService,
    private readonly pagosService: PagosService,
    private readonly certificadosService: CertificadosService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService,
  ) {}

  async inscribir(usuarioId: number, cursoId: number) {
    const usuario = await this.usuariosService.obtenerPerfil(usuarioId);
    const curso = await this.cursosService.obtenerConDetalles(cursoId);

    // Validaciones de negocio
    if (curso.estaBloqueado) {
      throw new ForbiddenException('El curso no está disponible');
    }

    const yaInscrito = curso.inscritos.some(i => i.usuarioId === usuarioId);
    if (yaInscrito) {
      throw new BadRequestException('Ya estás inscrito en este curso');
    }

    if (curso.cuposDisponibles <= 0) {
      throw new BadRequestException('El curso está lleno');
    }

    // Procesar según tipo de curso
    if (curso.esGratuito) {
      return this.inscribirGratis(usuario, curso);
    }

    return this.inscribirPago(usuario, curso);
  }

  private async inscribirGratis(usuario: any, curso: any) {
    const inscripcion = await this.cursosService.agregarInscrito(curso.id, {
      usuarioId: usuario.id,
      tipo: 'gratis',
      progreso: 0,
      fechaInicio: new Date(),
    });

    this.eventEmitter.emit('curso.inscrito', {
      usuarioId: usuario.id,
      cursoId: curso.id,
      tipo: 'gratis',
    });

    this.logger.info(`Usuario ${usuario.id} inscrito gratis en curso ${curso.id}`);
    return inscripcion;
  }

  private async inscribirPago(usuario: any, curso: any) {
    // Crear orden de pago
    const pago = await this.pagosService.crearOrden({
      usuarioId: usuario.id,
      monto: curso.precio,
      concepto: `Curso: ${curso.titulo}`,
    });

    return {
      requierePago: true,
      ordenId: pago.id,
      monto: curso.precio,
      urlPago: pago.url,
      curso: curso.titulo,
    };
  }

  async completarCurso(usuarioId: number, cursoId: number) {
    const inscripcion = await this.cursosService.obtenerInscripcion(usuarioId, cursoId);
    if (!inscripcion) throw new BadRequestException('No estás inscrito');

    const progreso = await this.cursosService.calcularProgreso(usuarioId, cursoId);
    if (progreso < 100) {
      throw new BadRequestException(`Progreso actual: ${progreso}%. Completa el 100%`);
    }

    // Marcar como completado
    await this.cursosService.marcarCompletado(usuarioId, cursoId);

    // Generar certificado si aplica
    const certificado = await this.certificadosService.generar(usuarioId, cursoId);

    // Notificar
    this.eventEmitter.emit('curso.completado', {
      usuarioId,
      cursoId,
      certificadoId: certificado.id,
    });

    this.logger.info(`Usuario ${usuarioId} completó curso ${cursoId}`);
    return { mensaje: '¡Curso completado!', certificado: certificado.url };
  }
}
```

```typescript
// modules/cursos/cursos.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Curso, Inscripcion]), forwardRef(() => PagosModule)],
  controllers: [CursosController],
  providers: [
    CursosService,
    InscripcionService,
    CertificadosService,
  ],
  exports: [CursosService, InscripcionService],
})
export class CursosModule {}
```

## Buenas prácticas

### 1. Un servicio por responsabilidad

```typescript
// ✅ Bien: servicios enfocados
UsuariosService      → solo lógica de usuarios
PedidosService       → solo lógica de pedidos
NotificacionesService → solo lógica de notificaciones

// ❌ Mal: servicio todopoderoso
// AdminService que hace: usuarios + pedidos + productos + notificaciones
```

### 2. Nombra los métodos de forma descriptiva

```typescript
// ✅ Bien: nombres que expresan intención
obtenerUsuariosActivos()
buscarPorEmail()
calcularTotalConImpuesto()
validarDisponibilidadStock()

// ❌ Mal: nombres genéricos
procesar()
ejecutar()
hacer()
run()
```

### 3. Usa DTOs para entrada y salida

```typescript
// ✅ Bien: tipos explícitos
async crear(dto: CrearUsuarioDto): Promise<UsuarioResponseDto> {}

// ❌ Mal: tipos genéricos
async crear(dto: any): Promise<any> {}
```

### 4. Los servicios deben ser stateless

No guardes estado mutable en propiedades de instancia:

```typescript
// ❌ Mal: estado mutable en singleton
@Injectable()
export class ContadorService {
  private contador = 0;  // COMPARTIDO entre todos los usuarios

  incrementar() { return ++this.contador; }
}

// ✅ Bien: stateless (recibe todo por parámetros)
@Injectable()
export class ContadorService {
  incrementar(valor: number): number { return valor + 1; }
}
```

### 5. Usa transacciones para operaciones que afectan múltiples tablas

```typescript
async operacionCompleja() {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // múltiples operaciones...
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
```

### 6. Emite eventos para efectos secundarios

```typescript
// ✅ Bien: desacopla responsabilidades
this.eventEmitter.emit('usuario.creado', new UsuarioCreadoEvent(usuario));
// Otros servicios reaccionan: enviar email, inicializar datos, notificar admins
```

### 7. No hagas logging excesivo

Loggea eventos importantes (creación, error, cancelación), no cada operación interna.

## Errores comunes

### 1. Servicios que acceden directamente a objetos HTTP

```typescript
// ❌ Mal: servicio acoplado a HTTP
@Injectable()
export class UsuariosService {
  obtenerUsuario(@Req() req: Request) { // ❌ Servicio no debería saber de HTTP
    return req.usuario;
  }
}

// ✅ Bien: el controlador pasa los datos
@Injectable()
export class UsuariosService {
  obtenerUsuario(id: number) {
    // Solo lógica de negocio
  }
}
```

### 2. Lógica de validación de datos en servicios

```typescript
// ❌ Mal: validación estructural en servicio
@Injectable()
export class UsuariosService {
  async crear(dto: any) {
    if (!dto.email?.includes('@')) {  // ❌ Esto va en DTO/Pipe
      throw new BadRequestException('Email inválido');
    }
  }
}

// ✅ Bien: el DTO valida, el servicio opera
async crear(dto: CrearUsuarioDto) {  // dto ya validado por ValidationPipe
  return this.repo.guardar(dto);
}
```

### 3. Dependencia circular entre servicios

```typescript
// ❌ Mal: A llama a B, B llama a A
// Solución: extraer la lógica compartida a un tercer servicio o usar EventEmitter

// ✅ Bien: usar eventos
// PedidosService emite 'pedido.creado'
// NotificacionesService escucha 'pedido.creado'
```

### 4. Servicio que esconde una dependencia

```typescript
// ❌ Mal: dependencia oculta creada con new
@Injectable()
export class MiServicio {
  hacerAlgo() {
    const db = new DatabaseService(); // ❌ No inyectado, no testeable
  }
}
```

### 5. Métodos de servicio demasiado largos

```typescript
// ❌ Mal: +50 líneas haciendo de todo
async procesarPedido(dto: any) { /* 80 líneas */ }

// ✅ Bien: dividir en métodos pequeños
async procesarPedido(dto: CrearPedidoDto) {
  this.validarCliente(dto.clienteId);
  await this.verificarStock(dto.items);
  const total = this.calcularTotal(dto);
  return this.guardarPedido(dto, total);
}
```

### 6. No manejar errores correctamente

```typescript
// ❌ Mal: error genérico
throw new Error('Algo salió mal');

// ✅ Bien: errores específicos de HTTP
throw new NotFoundException('Usuario no encontrado');
throw new ConflictException('Email ya registrado');
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Controladores** | Los servicios son llamados por los controladores. El controlador delega, el servicio ejecuta. |
| **Repositorios** | Los servicios usan repositorios para acceso a datos. El servicio orquesta, el repositorio ejecuta queries. |
| **DTOs** | Los servicios reciben y devuelven DTOs, definiendo contratos claros de entrada/salida. |
| **Módulos** | Los servicios se registran en `providers` del módulo y se exportan si otros módulos los necesitan. |
| **Inyección de Dependencias** | Los servicios se inyectan en controladores y otros servicios mediante el constructor. |
| **Pipes** | Los pipes validan los datos ANTES de que lleguen al servicio. El servicio recibe datos ya válidos. |
| **Guards** | Los guards protegen rutas ANTES de que el servicio se ejecute. |
| **Eventos** | Los servicios emiten eventos para desacoplar efectos secundarios (email, notificaciones). |
| **Exception Filters** | Capturan las excepciones que los servicios lanzan y las convierten en respuestas HTTP. |
| **Testing** | Los servicios son la unidad más fácil de testear: no requieren HTTP, solo instanciar con mocks. |

## Resumen

- Los **servicios** encapsulan la lógica de negocio y son la capa más importante de la aplicación.
- Se decoran con `@Injectable()` y se inyectan en controladores y otros servicios.
- **Un servicio = una responsabilidad**. Si crece demasiado, divídelo.
- Reciben DTOs validados, operan con repositorios, aplican reglas de negocio y retornan resultados.
- **No deben** acceder a HTTP, validar datos estructurales, ni tener estado mutable global.
- Usa **transacciones** para operaciones que afectan múltiples tablas.
- Usa **eventos** para efectos secundarios desacoplados.
- Los servicios son **fáciles de testear**: solo dependencias que puedes mockear.
- **Buenas prácticas**: nombres descriptivos, métodos pequeños, stateless, errores específicos, composición sobre herencia.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué decorador se usa para marcar una clase como servicio en NestJS?</summary>

**Respuesta:** `@Injectable()`. Este decorador registra la clase en el contenedor IoC de NestJS, permitiendo que sea inyectada en controladores y otros servicios.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cuál es la principal responsabilidad de un servicio?</summary>

**Respuesta:** Contener la **lógica de negocio** de la aplicación: cálculos, reglas de dominio, orquestación de procesos y coordinación entre repositorios y APIs externas. Los servicios no deben manejar HTTP ni validar datos estructurales.
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Por qué los servicios no deberían tener estado mutable en propiedades de instancia?</summary>

**Respuesta:** Porque por defecto los servicios son **singleton** (compartidos entre todas las peticiones). El estado mutable en una propiedad sería accesible por todos los usuarios simultáneamente, causando race conditions y datos corruptos.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué mecanismo usarías en un servicio para desacoplar efectos secundarios como enviar un email después de crear un pedido?</summary>

**Respuesta:** **Eventos** con `EventEmitter2`. El servicio emite un evento (ej: `pedido.creado`) y otros servicios escuchan ese evento para ejecutar efectos secundarios (email, notificaciones, logging). Esto evita dependencias directas entre servicios.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cuándo deberías usar una transacción de base de datos dentro de un servicio?</summary>

**Respuesta:** Cuando una operación afecta **múltiples tablas o registros** y necesita atomicidad. Por ejemplo: crear un pedido (insertar en `pedidos` + descontar stock en `productos`). Si una parte falla, todo debe revertirse para mantener la consistencia de los datos.
</details>
