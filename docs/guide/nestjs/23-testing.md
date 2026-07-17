---
title: Testing en NestJS
description: Aprende a escribir tests unitarios, de integración y e2e en NestJS con Jest, Supertest, TestFactory, mocks, spies y configuración de testing.
---

# Testing en NestJS

Imagina que construyes un puente colgante. Antes de abrirlo al público, ¿no probarías cada cable, cada viga y el comportamiento con viento fuerte? Pues **el testing es probar cada cable (unit test), cada sección (integration test) y el puente completo (e2e test)** antes de que los usuarios crucen.

## ¿Qué es?

El **testing** en NestJS es la práctica de verificar que cada parte de tu aplicación funciona correctamente. NestJS proporciona herramientas integradas con **Jest** para tests unitarios, de integración y end-to-end (e2e).

```typescript
// Test unitario de un servicio
describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debería crear un usuario', async () => {
    const dto = { email: 'test@test.com', password: '123456' };
    const usuario = await service.registrar(dto);

    expect(usuario.email).toBe('test@test.com');
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });
});
```

## ¿Por qué es importante?

- **Confianza**: Sabes que el código funciona antes de desplegar.
- **Prevención de regresiones**: Un cambio no rompe funcionalidad existente.
- **Documentación viva**: Los tests describen cómo debe comportarse el código.
- **Diseño mejorado**: Código testeable es código bien diseñado (DI, módulos).
- **Ahorro de tiempo**: Bugs detectados temprano son más baratos de arreglar.

## Problema que resuelve

Sin tests, cada cambio es un salto al vacío:

```typescript
// ❌ Sin tests: no sabes si un cambio rompe algo
@Injectable()
export class AuthService {
  constructor(private usersRepository: Repository<User>) {}

  async registrar(dto: CreateUserDto) {
    // Cambiaste esta línea... ¿sigue funcionando?
    const usuario = this.usersRepository.create({
      ...dto,
      // rol: 'user',  // ❌ Comentaste esto sin saber qué depende de ello
    });
    return this.usersRepository.save(usuario);
  }
}

// ✅ Con tests: sabes exactamente qué funciona y qué no
// El test te dice: "FAIL — se esperaba rol 'user' pero se recibió undefined"
```

## Cómo funciona

NestJS usa **TestingModule** y **TestFactory** para crear módulos aislados donde puedes reemplazar providers reales por mocks.

```
Test.createTestingModule({
  providers: [
    AuthService,
    { provide: UserRepository, useValue: mockRepo },
  ],
})
            │
            ▼
    TestingModule (compilado)
            │
            ├── module.get(AuthService) → instancia real
            └── module.get(UserRepository) → mock (no BD real)
```

## Sintaxis

### Instalación

```bash
# NestJS ya incluye Jest, pero instalas utilerías adicionales
npm install -D @nestjs/testing @types/jest ts-jest
npm install -D supertest @types/supertest  # Para e2e
```

### TestFactory

| Método | Propósito |
|---|---|
| `Test.createTestingModule({})` | Crear módulo de testing |
| `.compile()` | Compilar el módulo (asíncrono) |
| `module.get<T>(type)` | Obtener provider/controller |
| `module.createNestApplication()` | Crear app Nest completa |
| `module.init()` | Inicializar módulo sin HTTP |

## Ejemplo básico

Test unitario de un servicio con mock de repositorio.

<CodeGroup>
<CodeGroupItem title="auth.service.ts">

```typescript
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async registrar(dto: CreateUserDto): Promise<User> {
    const usuario = this.usersRepository.create(dto);
    return this.usersRepository.save(usuario);
  }

  async buscarPorEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
```

</CodeGroupItem>

<CodeGroupItem title="auth.service.spec.ts">

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

// Mock del repositorio
const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registrar', () => {
    it('debería crear y guardar un usuario', async () => {
      const dto: CreateUserDto = {
        email: 'user@test.com',
        password: '123456',
        nombre: 'Test User',
      };

      const usuarioEsperado = { id: 1, ...dto };
      mockUserRepository.create.mockReturnValue(usuarioEsperado);
      mockUserRepository.save.mockResolvedValue(usuarioEsperado);

      const resultado = await service.registrar(dto);

      expect(resultado).toEqual(usuarioEsperado);
      expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(usuarioEsperado);
    });

    it('debería lanzar error si el email ya existe', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1 });
      mockUserRepository.save.mockRejectedValue(new Error('Email duplicado'));

      await expect(
        service.registrar({ email: 'existente@test.com', password: '123' })
      ).rejects.toThrow('Email duplicado');
    });
  });

  describe('buscarPorEmail', () => {
    it('debería retornar un usuario si existe', async () => {
      const usuario = { id: 1, email: 'user@test.com' };
      mockUserRepository.findOne.mockResolvedValue(usuario);

      const resultado = await service.buscarPorEmail('user@test.com');

      expect(resultado).toEqual(usuario);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
      });
    });

    it('debería retornar null si no existe', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const resultado = await service.buscarPorEmail('noexiste@test.com');

      expect(resultado).toBeNull();
    });
  });
});
```

</CodeGroupItem>
</CodeGroup>

## Ejemplo intermedio

Test de controlador con mock de servicio, y test de guard con ExecutionContext.

```typescript
// auth.controller.spec.ts — Test de controlador
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    registrar: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('POST /auth/registro', () => {
    it('debería llamar a authService.registrar y retornar el resultado', async () => {
      const dto = { email: 'test@test.com', password: '123456' };
      const resultado = { id: 1, email: 'test@test.com' };

      mockAuthService.registrar.mockResolvedValue(resultado);

      const response = await controller.registro(dto);

      expect(response).toEqual(resultado);
      expect(mockAuthService.registrar).toHaveBeenCalledWith(dto);
    });
  });
});


// jwt-auth.guard.spec.ts — Test de guard
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: Reflector, useValue: { get: jest.fn() } },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('debería permitir acceso si hay token válido', () => {
    const context = createMockContext({ user: { id: 1 } });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('debería denegar acceso sin token', () => {
    const context = createMockContext({});

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});

function createMockContext(extra: any): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ ...extra }),
    }),
    getHandler: () => null,
    getClass: () => null,
  } as unknown as ExecutionContext;
}
```

## Ejemplo avanzado

Test de integración con base de datos real (SQLite en memoria) y test e2e con Supertest.

<CodeGroup>
<CodeGroupItem title="users.service.int-spec.ts">

```typescript
// Test de integración con SQLite en memoria
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService (Integración)', () => {
  let service: UsersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('debería crear un usuario en BD real', async () => {
    const usuario = await service.registrar({
      email: 'test@test.com',
      password: 'hashed123',
      nombre: 'Test',
    });

    expect(usuario.id).toBeDefined();
    expect(usuario.email).toBe('test@test.com');

    // Verificar que realmente se guardó
    const encontrado = await service.buscarPorEmail('test@test.com');
    expect(encontrado).toBeDefined();
  });
});
```

</CodeGroupItem>

<CodeGroupItem title="app.e2e-spec.ts">

```typescript
// Test e2e (end-to-end): prueba el flujo completo
// e2e/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider('DATABASE_CONNECTION')
      .useValue({})  // Mockear BD para e2e
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/registro', () => {
    it('debería registrar un usuario y retornar 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registro')
        .send({
          email: 'test@e2e.com',
          password: '123456',
          nombre: 'E2E Test',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@e2e.com');
    });

    it('debería retornar 400 si faltan campos', async () => {
      await request(app.getHttpServer())
        .post('/auth/registro')
        .send({ email: 'incompleto@test.com' })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('debería retornar JWT con credenciales válidas', async () => {
      // Primero registrar
      await request(app.getHttpServer())
        .post('/auth/registro')
        .send({ email: 'login@test.com', password: '123456', nombre: 'Login' });

      // Luego login
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@test.com', password: '123456' })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.access_token).toBeTruthy();
    });
  });
});
```

</CodeGroupItem>

<CodeGroupItem title="jest-e2e.config.ts">

```typescript
// jest-e2e.config.ts — Configuración para tests e2e
export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

</CodeGroupItem>
</CodeGroup>

## Caso de uso real

Pirámide de testing en una aplicación NestJS completa.

```
PIRÁMIDE DE TESTING
─────────────────────

          ╱╲
         ╱  ╲
        ╱ E2E ╲          ← Pocos tests de flujo completo
       ╱────────╲        ← Supertest + app real
      ╱          ╲
     ╱ Integración╲      ← Tests con BD real (SQLite :memory:)
    ╱──────────────╲     ← Verifica que módulos funcionan juntos
   ╱                ╲
  ╱  Unitarios       ╲   ← Muchos tests rápidos y aislados
 ╱────────────────────╲  ← Mocks de todo lo externo
╱                      ╲

ESTRUCTURA DE ARCHIVOS
───────────────────────

src/
├── auth/
│   ├── auth.service.ts
│   ├── auth.service.spec.ts       ← Unit test (mock repositorio)
│   ├── auth.controller.ts
│   ├── auth.controller.spec.ts    ← Unit test (mock servicio)
│   ├── auth.service.int-spec.ts   ← Integración (BD real)
│   └── dto/
├── users/
│   └── ...
└── common/
    └── guards/
        ├── jwt-auth.guard.ts
        └── jwt-auth.guard.spec.ts  ← Unit test (mock context)

e2e/
├── app.e2e-spec.ts               ← Flujo completo (registro → login → ruta protegida)
└── jest-e2e.config.ts
```

## Buenas prácticas

### 1. Sigue la pirámide de testing

```typescript
// ✅ Muchos unit tests, algunos de integración, pocos e2e
// Unitarios: ~70% del código probado
// Integración: ~20%
// E2E: ~10%
```

### 2. Usa `beforeEach` para resetear mocks

```typescript
beforeEach(async () => {
  module = await Test.createTestingModule({ /* ... */ }).compile();
});

afterEach(() => {
  jest.clearAllMocks();  // Limpiar mocks entre tests
});
```

### 3. Prueba comportamientos, no implementaciones

```typescript
// ✅ Bien: probar resultado final
it('debería retornar usuario creado', async () => { /* */ });

// ❌ Mal: probar implementación interna
it('debería llamar a save 3 veces', async () => { /* */ });
```

### 4. Usa `describe` e `it` descriptivos

```typescript
describe('AuthService', () => {
  describe('registrar', () => {
    it('debería crear usuario con email y contraseña', () => {});
    it('debería lanzar error si el email existe', () => {});
    it('debería hashear la contraseña antes de guardar', () => {});
  });
});
```

### 5. No testes infraestructura externa en unitarios

```typescript
// ❌ Mal: unit test que contacta BD real
it('debería conectar a PostgreSQL', async () => {
  await service.conectar();  // Falla si no hay BD
});

// ✅ Bien: mockear repositorio
it('debería crear usuario', async () => {
  mockRepo.create.mockReturnValue(usuario);
  // No necesita BD real
});
```

## Errores comunes

### 1. No limpiar mocks entre tests

```typescript
// ❌ Error: el mock arrastra datos del test anterior
it('test 1', () => { service.registrar(); });
it('test 2', () => { expect(mock.save).toHaveBeenCalledTimes(1); }); // ❌ 2!

// ✅ Correcto: limpiar en afterEach
afterEach(() => jest.clearAllMocks());
```

### 2. Testear detalles internos

```typescript
// ❌ Error: probar que se llamó a un método privado
it('debería llamar a método interno', () => {
  expect(service['generateHash']).toHaveBeenCalled();
});

// ✅ Correcto: probar comportamiento observable
it('debería retornar contraseña hasheada', () => {
  expect(resultado.password).not.toBe('123456');
});
```

### 3. Crear tests frágiles

```typescript
// ❌ Error: test que falla si cambias algo irrelevante
expect(response).toMatchSnapshot();  // Falla si cambias formato

// ✅ Correcto: probar lo esencial
expect(response.id).toBeDefined();
expect(response.email).toBe(dto.email);
```

### 4. No cerrar la app después de tests e2e

```typescript
// ❌ Error: proceso queda colgado
afterAll(() => {});  // No cierra app → process hang

// ✅ Correcto: cerrar app
afterAll(async () => { await app.close(); });
```

## Relación con otros conceptos

| Concepto | Relación |
|---|---|
| **Inyección de dependencias** | Permite reemplazar providers reales por mocks en tests. |
| **Módulos** | Test.createTestingModule usa la misma sintaxis. |
| **Pipes/Guards** | Se testean unitariamente con mocks de ExecutionContext. |
| **TypeORM** | Se mockea con `getRepositoryToken` o SQLite en memoria. |
| **ConfigService** | Se sobreescribe con `.overrideProvider(ConfigService)`. |

## Resumen

- NestJS usa **Jest** como framework de testing por defecto.
- **Unit tests**: prueba servicios/controladores de forma aislada con mocks.
- **Integration tests**: prueba módulos funcionando juntos (BD real o liviana).
- **E2E tests**: prueba flujo completo con `supertest` y app real.
- `Test.createTestingModule()` crea módulos aislados para testing.
- Reemplaza providers con `useValue`/`useClass` para mockear.
- Usa `jest.fn()` para mocks y `jest.spyOn()` para espiar métodos reales.
- Sigue la pirámide de testing: muchos unitarios, algunos de integración, pocos e2e.
- Siempre limpia mocks con `jest.clearAllMocks()` en afterEach.

## Quiz

<details>
<summary><strong>Pregunta 1:</strong> ¿Qué diferencia hay entre un test unitario y uno de integración?</summary>

**Unitario**: prueba un componente aislado (servicio, controlador) con todas sus dependencias mockeadas. **Integración**: prueba varios componentes funcionando juntos, usualmente con base de datos real o en memoria.
</details>

<details>
<summary><strong>Pregunta 2:</strong> ¿Cómo mockeas un repositorio de TypeORM en un test?</summary>

Usando `getRepositoryToken(Entidad)` como provider token, y `useValue` con un objeto que tenga los métodos mockeados (create, save, findOne, etc.).
</details>

<details>
<summary><strong>Pregunta 3:</strong> ¿Para qué sirve `Test.createTestingModule()`?</summary>

Crea un módulo de NestJS aislado para testing, donde puedes reemplazar providers reales por mocks y luego obtener las instancias para probarlas.
</details>

<details>
<summary><strong>Pregunta 4:</strong> ¿Qué es un spy y cómo se diferencia de un mock?</summary>

Un **mock** reemplaza completamente un método/función. Un **spy** (`jest.spyOn`) envuelve un método real y permite verificar que se llamó, pero también puede llamar al método real o mockearlo condicionalmente.
</details>

<details>
<summary><strong>Pregunta 5:</strong> ¿Cómo pruebas un controlador protegido por un guard en e2e?</summary>

En el test e2e, primero llamas a `/auth/login` con credenciales válidas para obtener un token JWT, luego incluyes el token en el header `Authorization: Bearer <token>` en la request a la ruta protegida.
</details>
