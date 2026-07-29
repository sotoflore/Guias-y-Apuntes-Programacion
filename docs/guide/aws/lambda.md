---
title: AWS Lambda - Serverless Compute
description: Guía completa de AWS Lambda: funciones, runtimes, event sources, Lambda Layers, cold starts, Provisioned Concurrency, SAM, integraciones y mejores prácticas.
---

# AWS Lambda - Serverless Compute

## Tabla de contenidos

- [¿Qué es AWS Lambda?](#qué-es-aws-lambda)
- [Runtimes soportados](#runtimes-soportados)
- [Límites de Lambda](#límites-de-lambda)
- [Fuentes de eventos](#fuentes-de-eventos)
- [Lambda Layers](#lambda-layers)
- [Lambda@Edge](#lambdaedge)
- [Cold Starts explicados](#cold-starts-explicados)
- [Provisioned Concurrency](#provisioned-concurrency)
- [Variables de entorno](#variables-de-entorno)
- [Acceso a VPC](#acceso-a-vpc)
- [Patrones de integración](#patrones-de-integración)
- [Modelo de precios](#modelo-de-precios)
- [Mejores prácticas](#mejores-prácticas)
- [Errores comunes](#errores-comunes)
- [Cuándo NO usar Lambda](#cuándo-no-usar-lambda)
- [Ejemplos de código](#ejemplos-de-código)
- [SAM Template](#sam-template)
- [Diagramas Mermaid](#diagramas-mermaid)
- [Preguntas frecuentes (FAQ)](#preguntas-frecuentes-faq)
- [Consejos para entrevistas](#consejos-para-entrevistas)
- [Resumen](#resumen)

---

## ¿Qué es AWS Lambda?

AWS Lambda es un servicio de computación serverless que ejecuta tu código en respuesta a eventos sin que tengas que provisionar ni administrar servidores. Piensa en Lambda como **pagar solo por el café que bebes**: no pagas por un servidor entero que esté encendido esperando, sino que pagas exactamente por el tiempo que tu código se ejecuta y la memoria que utiliza.

Lambda se ejecuta de forma completamente gestionada por AWS. Solo subes tu código, configuras los disparadores (eventos) y Lambda se encarga de todo lo demás: infraestructura, parches, escalado automático y alta disponibilidad.

### Características principales

| Característica | Descripción |
|----------------|-------------|
| **Serverless** | Sin servidores que administrar |
| **Escalado automático** | De 0 a miles de instancias en segundos |
| **Pago por uso** | Solo pagas por los milisegundos de ejecución |
| **Event-driven** | Se ejecuta en respuesta a eventos de otros servicios |
| **Integraciones nativas** | Se conecta con +200 servicios de AWS y SAAS |
| **Múltiples runtimes** | Soporta Node.js, Python, Java, Go, .NET, Ruby |

### Analogía simplificada

| Concepto | Servidor tradicional | AWS Lambda |
|----------|----------------------|------------|
| Infraestructura | Compras el servidor | AWS lo gestiona |
| Escalado | Configuras manualmente | Automático e instantáneo |
| Pago | 24/7 aunque no se use | Solo por ejecución |
| Mantenimiento | Parches y actualizaciones | AWS se encarga |
| Disponibilidad | Tú la configuras | 99.95% por defecto |

---

## Runtimes soportados

| Runtime | Lenguaje | Versión mínima | Versión recomendada |
|---------|----------|----------------|---------------------|
| **Node.js** | JavaScript/TypeScript | 16.x (deprecado) | 20.x o 22.x |
| **Python** | Python | 3.8 (deprecado) | 3.12 o 3.13 |
| **Java** | Java | 8 (deprecado) | 17 o 21 |
| **Go** | Go | - | 1.21+ (custom runtime) |
| **.NET** | C#/F# | .NET 6 (deprecado) | .NET 8 |
| **Ruby** | Ruby | 2.7 (deprecado) | 3.3 |
| **Custom Runtime** | Cualquier lenguaje | - | Via `bootstrap` |

### Custom Runtime con Docker

```dockerfile
# Ejemplo: Custom Runtime para Rust
FROM public.ecr.aws/lambda/provided:al2 AS builder
RUN dnf install -y cargo rust
COPY . .
RUN cargo build --release

FROM public.ecr.aws/lambda/provided:al2
COPY --from=builder /target/release/mi-app /var/runtime/bootstrap
CMD ["mi-app"]
```

### Límites de ejecución por runtime

| Runtime | Memoria máxima | Timeout máximo | Package size |
|---------|---------------|----------------|--------------|
| Node.js | 10,240 MB | 900 s (15 min) | 250 MB (zip) / 10 GB (container) |
| Python | 10,240 MB | 900 s (15 min) | 250 MB (zip) / 10 GB (container) |
| Java | 10,240 MB | 900 s (15 min) | 250 MB (zip) / 10 GB (container) |
| Go | 10,240 MB | 900 s (15 min) | 250 MB (zip) / 10 GB (container) |
| .NET | 10,240 MB | 900 s (15 min) | 250 MB (zip) / 10 GB (container) |
| Custom | 10,240 MB | 900 s (15 min) | 250 MB (zip) / 10 GB (container) |

---

## Límites de Lambda

| Recurso | Límite predeterminado | Se puede aumentar |
|---------|----------------------|-------------------|
| **Memoria** | 128 MB - 10,240 MB | No (rango fijo) |
| **CPU** | Proporcional a la memoria | No (configurado automáticamente) |
| **Timeout** | 900 segundos (15 min) | No (máximo absoluto) |
| **Package size (zip)** | 50 MB (compressión) / 250 MB (sin comprimir) | No |
| **Package size (container)** | 10 GB | No |
| **Variables de entorno** | 4 KB totales | No |
| **Concurrencia por cuenta** | 1,000 (inicial) | Sí (con AWS Support) |
| **Invocaciones concurrentes** | 1,000 | Sí (request de aumento) |
| **Tamaño del payload** | 6 MB (síncrono) / 256 KB (asíncrono) | No |
| **Syslog / /tmp** | 512 MB a 10 GB (configurable) | No |
| **Descargas de red** | 1 GB (síncrono) | No |
| **Ejecuciones simultáneas** | Sin límite (pero con concurrencia) | La concurrencia se gestiona |

### CPU asignada

| Memoria (MB) | vCPU |
|--------------|------|
| 128 - 1,769 | 0.08 (1/8) |
| 1,770 - 3,539 | 0.17 (1/6) |
| 3,540 - 5,309 | 0.25 (1/4) |
| 5,310 - 7,079 | 0.33 (1/3) |
| 7,080 - 10,240 | 0.5 (1/2) |

> **Nota**: con 10 GB de memoria obtienes solo 6 vCPU. Para más CPU, considera ECS o Fargate.

---

## Fuentes de eventos

Lambda puede ser invocado por más de 200 fuentes de eventos en AWS y servicios de terceros.

### Fuentes síncronas (invocan Lambda directamente)

| Fuente | Evento | Uso típico |
|--------|--------|------------|
| **API Gateway** | HTTP request | APIs REST/HTTP serverless |
| **S3** | Creación/modificación de objetos | Procesamiento de imágenes |
| **Cognito** | Triggers de autenticación | Validación custom de tokens |
| **CloudFront** | Request HTTP (Lambda@Edge) | Transformación de contenido |
| **DynamoDB Streams** | Cambios en la tabla | Replicación de datos |
| **IoT Rules** | Datos de sensores | IoT processing |
| **CloudWatch Events/EventBridge** | Cron/eventos programados | Tareas periódicas |
| **SQS** | Mensajes en cola | Procesamiento de colas |
| **SNS** | Notificaciones | Fan-out de mensajes |

### Fuentes de eventos asíncronas

```mermaid
graph LR
    subgraph "Fuentes de eventos"
        S3[S3]
        SNS[SNS]
        CW[CloudWatch Events]
        IOT[IoT]
        Cognito[Cognito]
    end
    
    subgraph "AWS Lambda"
        L1[Función Lambda]
    end
    
    subgraph "Destinos"
        SQS_L[SQS]
        SNS_L[SNS]
        EVENTBRIDGE[EventBridge]
    end
    
    S3 --> L1
    SNS --> L1
    CW --> L1
    IOT --> L1
    Cognito --> L1
    
    L1 -->|éxito| SQS_L
    L1 -->|fallo| SNS_L
    L1 -->|on-success| EVENTBRIDGE
```

### Integración con SQS

```bash
# Crear función Lambda que procesa mensajes SQS
aws lambda create-function \
  --function-name process-sqs-messages \
  --runtime nodejs20.x \
  --handler index.handler \
  --role arn:aws:iam::123456789:role/lambda-sqs-role \
  --code ZipFile=fileb://function.zip \
  --timeout 30 \
  --memory-size 256

# Crear mapping de evento SQS → Lambda
aws lambda create-event-source-mapping \
  --function-name process-sqs-messages \
  --event-source-arn arn:aws:sqs:us-east-1:123456789:mi-cola \
  --batch-size 10 \
  --maximum-batching-window-in-seconds 30
```

---

## Lambda Layers

Lambda Layers permiten compartir código común entre múltiples funciones. Son paquetes de bibliotecas o dependencias que se adjuntan a una función.

### Casos de uso

| Capa | Contenido | Ejemplo |
|------|-----------|---------|
| **Bibliotecas compartidas** | Dependencias de terceros | `lodash`, `axios`, `pandas` |
| **Runtime custom** | Binarios y ejecutables | FFmpeg, ImageMagick |
| **Configuración compartida** | Archivos de configuración | Certificados, reglas de negocio |
| **SDKs personalizados** | Código interno de la empresa | Clientes API internos |

### Crear y usar Lambda Layer

```bash
# Crear layer (Node.js)
mkdir -p layer/nodejs
cd layer/nodejs
npm init -y
npm install sharp axios
cd ..
zip -r sharp-axios-layer.zip nodejs/

# Publicar layer
aws lambda publish-layer-version \
  --layer-name shared-dependencies \
  --zip-file fileb://sharp-axios-layer.zip \
  --compatible-runtimes nodejs20.x nodejs22.x

# Adjuntar layer a una función
aws lambda update-function-configuration \
  --function-name mi-funcion \
  --layers arn:aws:lambda:us-east-1:123456789:layer:shared-dependencies:1
```

### Límites de Layers

- Máximo **5 capas** por función.
- Tamaño total de todas las capas: **250 MB** sin comprimir.
- Las capas se extienden en `/opt/`.
- Compatible con cualquier runtime, incluido custom.

---

## Lambda@Edge

Lambda@Edge te permite ejecutar código Lambda en los bordes de la red de CloudFront, cerca de tus usuarios.

### Casos de uso

| Caso de uso | Descripción |
|-------------|-------------|
| **A/B Testing** | Servir diferentes versiones de contenido según headers |
| **Autenticación** | Validar tokens JWT en el edge antes de llegar al origen |
| **Geolocalización** | Mostrar contenido según la ubicación del usuario |
| **Transformación** | Modificar headers, URLs o contenido en tránsito |
| **Compresión** | Comprimir respuestas dinámicamente |
| **Enrutamiento** | Redirigir tráfico según reglas |

### Límites de Lambda@Edge

| Recurso | Viewer Request/Response | Origin Request/Response |
|---------|------------------------|------------------------|
| Memoria | 128 MB | 3,008 MB |
| Timeout | 5 segundos | 30 segundos |
| Package size | 1 MB | 50 MB |
| Funciones | 10 por distribución | 10 por distribución |

---

## Cold Starts explicados

Un cold start ocurre cuando Lambda necesita crear un nuevo entorno de ejecución para tu función. Este proceso incluye descargar el código, iniciar el runtime y ejecutar el initialization code.

### Flujo de Cold Start

```mermaid
stateDiagram-v2
    [*] --> Invocación
    Invocación --> CrearEntorno: Primera vez / escala
    CrearEntorno --> DescargarCódigo: 1-5s
    DescargarCoding --> IniciarRuntime: 0.5-2s
    IniciarRuntime --> EjecutarInit: 0.5-5s
    EjecutarInit --> EjecutarHandler: 0-1s
    
    Invocación --> EjecutarHandler: Warm start
    EjecutarHandler --> [*]
```

### Factores que afectan el Cold Start

| Factor | Impacto | Mitigación |
|--------|---------|------------|
| **Tamaño del package** | Más código = más tiempo de descarga | Usar Lambda Layers, minimizar dependencias |
| **Inicialización de runtime** | Java/Java son más lentos | Usar Node.js o Python |
| **Inicialización de BD** | Conexiones fuera del handler | Conexión persistente |
| **VPC access** | Configuración de red adicional | Usar PrivateLink o evitar VPC |
| **Memoria asignada** | Más memoria = más CPU | Asignar memoria suficiente |
| **Dependencias frías** | Carga de módulos lazy | Precargar en init |

### Cold start por runtime (promedio)

| Runtime | Cold Start típico | Warm start |
|---------|-------------------|------------|
| Node.js (128 MB) | 300-800 ms | < 1 ms |
| Node.js (512 MB) | 100-400 ms | < 1 ms |
| Python (128 MB) | 200-600 ms | < 1 ms |
| Python (512 MB) | 100-300 ms | < 1 ms |
| Java (512 MB) | 3,000-10,000 ms | < 1 ms |
| Java (1024 MB) | 1,500-5,000 ms | < 1 ms |
| .NET (512 MB) | 1,000-4,000 ms | < 1 ms |

### Estrategias para reducir Cold Starts

```javascript
// MAL: Conexión a BD dentro del handler (cold start en cada invocación)
exports.handler = async (event) => {
  const connection = await mysql.createConnection({...}); // Cada invocación
  // ...
};

// BIEN: Conexión a BD fuera del handler (se reutiliza en warm starts)
const connection = mysql.createConnection({...}); // Solo una vez

exports.handler = async (event) => {
  const result = await connection.query('SELECT ...'); // Reutiliza conexión
  // ...
};
```

---

## Provisioned Concurrency

Provisioned Concurrency mantiene un número de instancias "calientes" listas para ejecutar tu código sin cold start.

### Cuándo usar

- APIs que requieren latencia consistente.
- Aplicaciones con tráfico predecible.
- Endpoints críticos que no pueden tolerar cold starts.

### Configuración

```bash
# Configurar Provisioned Concurrency
aws lambda put-provisioned-concurrency-config \
  --function-name mi-api-handler \
  --qualifier prod \
  --provisioned-concurrent-executions 10

# Verificar configuración
aws lambda get-provisioned-concurrency-config \
  --function-name mi-api-handler \
  --qualifier prod

# Eliminar Provisioned Concurrency
aws lambda delete-provisioned-concurrency-config \
  --function-name mi-api-handler \
  --qualifier prod
```

### Precio de Provisioned Concurrency

| Componente | Costo |
|------------|-------|
| **Provisioned Concurrency** | Se cobra por hora por la memoria provisionada |
| **Requests** | $0.20 por 1M requests |
| **Duration** | $0.0000166667 por GB-segundo |
| **Storage** | $0.000003 por GB-hora (código + layers) |

> **Ejemplo**: 10 instancias con 512 MB cada una durante 1 mes ≈ $62.80/mes solo en Provisioned Concurrency.

---

## Variables de entorno

Las variables de entorno permiten configurar tu Lambda sin modificar el código.

### Configuración

```bash
# Configurar variables de entorno
aws lambda update-function-configuration \
  --function-name mi-funcion \
  --environment 'Variables={
    DATABASE_URL=postgresql://user:pass@host:5432/db,
    API_KEY=abc123,
    ENVIRONMENT=production,
    LOG_LEVEL=info
  }'
```

### Best practices para variables de entorno

| Práctica | Descripción |
|----------|-------------|
| **No almacenes secretos** | Usa AWS Secrets Manager o SSM Parameter Store |
| **Usa prefijos descriptivos** | `APP_`, `DB_`, `API_` para organizar |
| **Valores por defecto** | Maneja valores faltantes en el código |
| **Encriptación** | Usa KMS para datos sensibles (cifrado en tránsito y en reposo) |
| **Versionado** | Usa Alias de Lambda para diferentes ambientes |

```javascript
// Ejemplo: obtener configuración con fallbacks
const config = {
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/dev',
  apiKey: process.env.API_KEY,
  environment: process.env.ENVIRONMENT || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
};

if (!config.apiKey) {
  throw new Error('API_KEY es requerida');
}
```

---

## Acceso a VPC

Lambda puede ejecutarse dentro de una VPC para acceder a recursos privados como RDS, ElastiCache o endpoints de servicio de AWS.

### Consideraciones

| Aspecto | Sin VPC | Con VPC |
|---------|---------|---------|
| **Internet** | Acceso directo | Necesita NAT Gateway |
| **Cold start** | Más rápido (+0s) | Más lento (+1-5s) |
| **Seguridad** | Acceso público | Red privada |
| **Recursos** | Servicios públicos | RDS, ElastiCache, endpoints |
| **Costo** | Solo Lambda | Lambda + ENIs + NAT Gateway |

### Configurar acceso a VPC

```bash
# Configurar Lambda en VPC
aws lambda update-function-configuration \
  --function-name mi-funcion \
  --vpc-config SubnetIds=subnet-abc,subnet-def,SecurityGroupIds=sg-123
```

### Patrón: Lambda + RDS Proxy

```mermaid
graph TB
    subgraph "VPC"
        subgraph "Private Subnet"
            L[Lambda]
            RDS_PROXY[RDS Proxy]
            RDS[RDS Aurora]
        end
        
        subgraph "Public Subnet"
            NAT[NAT Gateway]
        end
    end
    
    L -->|conexión pooling| RDS_PROXY
    RDS_PROXY --> RDS
    L -->|internet| NAT
```

---

## Patrones de integración

### Patrón 1: API Gateway + Lambda (API REST)

```mermaid
graph LR
    U[Usuario] -->|HTTP| AG[API Gateway]
    AG -->|evento| L[Lambda]
    L -->|consulta| DB[(DynamoDB)]
    L -->|respuesta| AG
    AG -->|HTTP| U
```

### Patrón 2: Event-Driven con SQS

```mermaid
graph TB
    S3[S3 Upload] -->|evento| L1[Lambda: Process]
    L1 -->|mensaje| SQS[SQS Queue]
    SQS -->|trigger| L2[Lambda: Transform]
    L2 -->|resultado| DDB[(DynamoDB)]
    L2 -->|notificación| SNS[SNS Email]
```

### Patrón 3: Fan-out con SNS

```mermaid
graph TB
    AG[API Gateway] -->|evento| L1[Lambda: Author]
    L1 -->|evento| SNS[SNS Topic]
    SNS -->|suscriptor| L2[Lambda: Email]
    SNS -->|suscriptor| L3[Lambda: SMS]
    SNS -->|suscriptor| L4[Lambda: Push]
```

---

## Modelo de precios

| Componente | Precio (us-east-1) |
|------------|-------------------|
| **Requests** | $0.20 por 1 millón de requests |
| **Duration** | $0.0000166667 por GB-segundo |
| **Free Tier** | 1M requests + 400,000 GB-segundos/mes |
| **Provisioned Concurrency** | $0.0000041667 por GB-segundo |

### Ejemplo de cálculo

```
Función con 256 MB de memoria
1 millón de invocaciones/mes
Duración promedio: 200 ms

Costo de requests:
  1,000,000 - 1,000,000 (free tier) = 0 requests
  Costo = $0.00

Costo de duration:
  GB-segundos = (256/1024) GB × 200 ms × 1,000,000 = 50,000,000 GB-s
  50,000,000 - 400,000 (free tier) = 49,600,000 GB-s
  Costo = 49,600,000 × $0.0000166667 = $826.67

Costo total ≈ $826.67/mes
```

### Estrategias de optimización de costos

| Estrategia | Ahorro |
|------------|--------|
| **Reducir memoria** (si el workload lo permite) | 20-50% |
| **Minimizar duración** (optimizar código) | Variable |
| **Usar Graviton (ARM)** | ~20% |
| **Provisioned Concurrency** solo cuando es necesario | Variable |
| **Compartir dependencias con Layers** | Reducción de package size |
| **Batch processing** (más trabajo por invocación) | Variable |

---

## Mejores prácticas

1. **Inicializa fuera del handler**: conexiones, clientes HTTP, configuración.
2. **Usa async/await** y maneja todos los errores.
3. **Limita el tamaño del payload**: usa S3 para archivos grandes.
4. **Configura timeouts apropiados**: no uses el máximo (15 min) por defecto.
5. **Usa Dead Letter Queues** para eventos asíncronos fallidos.
6. **Implementa idempotencia**: las invocaciones asíncronas pueden reintentarse.
7. **Monitorea con X-Ray** para tracing distribuido.
8. **Usa Lambda Layers** para dependencias compartidas.
9. **Versiona con Aliases** para despliegues controlados.
10. **Evita VPC** si no necesitas acceder a recursos privados.

---

## Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| **Task timed out** | Timeout insuficiente | Aumentar timeout o optimizar código |
| **Cannot find module** | Dependencia no incluida en el package | Incluir en zip o usar Layer |
| **AccessDenied** | IAM Role sin permisos | Agregar permisos necesarios |
| **Rate exceeded** | Demasiadas invocaciones concurrentes | Solicitar aumento de concurrencia |
| **Unable to import module** | Error de sintaxis o importación | Revisar el código y dependencias |
| **Connection refused** | RDS/DB no accesible desde VPC | Verificar Security Groups y subnets |
| **Out of memory** | Memoria insuficiente | Aumentar memoria asignada |
| **Payload too large** | Payload > 6 MB (síncrono) | Usar S3 para transferir datos grandes |
| **Destination access denied** | Destino no accesible | Verificar permisos del DLQ/destino |

---

## Cuándo NO usar Lambda

| Escenario | Razón | Alternativa |
|-----------|-------|-------------|
| **Workloads > 15 min** | Timeout máximo de Lambda | ECS Fargate, EC2 |
| **Alto rendimiento de red** | Lambda tiene limitaciones de red | ECS con ENI dedicada |
| **Stateful applications** | Lambda es stateless | ECS, EKS, EC2 |
| **Tráfico constante y alto** | Costo más alto que un servidor dedicado | ECS Fargate, EC2 Reserved |
| **Procesamiento de big data** | Limitaciones de memoria y tiempo | EMR, Athena, Glue |
| **Streaming de datos** | Lambda procesa eventos individuales | Kinesis Data Streams + ECS |
| **Monitoreo de infraestructura** | No puede ejecutarse como daemon | EC2, ECS |
| **Contenedores > 10 GB** | Límite de imagen Docker | ECS Fargate, EKS |

---

## Ejemplos de código

### Ejemplo básico: API con API Gateway

```javascript
// index.js - Lambda function handler
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'Usuarios';

exports.handler = async (event) => {
  console.log('Evento recibido:', JSON.stringify(event));

  const { httpMethod, path, body } = event;

  try {
    if (httpMethod === 'POST' && path === '/usuarios') {
      const usuario = JSON.parse(body);
      const item = {
        id: usuario.id || generateId(),
        nombre: usuario.nombre,
        email: usuario.email,
        createdAt: new Date().toISOString(),
      };

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      }));

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Usuario creado', data: item }),
      };
    }

    if (httpMethod === 'GET' && path.startsWith('/usuarios/')) {
      const id = path.split('/')[2];

      const result = await docClient.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }));

      if (!result.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Usuario no encontrado' }),
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.Item),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Ruta no válida' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

### Ejemplo intermedio: Procesamiento de imágenes con S3

```javascript
// image-processor.js
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const s3Client = new S3Client({});
const BUCKET_DESTINO = process.env.BUCKET_DESTINO || 'imagenes-procesadas';

const SIZES = [
  { suffix: 'thumb', width: 150, height: 150 },
  { suffix: 'medium', width: 800, height: 600 },
  { suffix: 'large', width: 1920, height: 1080 },
];

// Inicialización fuera del handler (se reutiliza en warm starts)
console.log('Inicializando procesador de imágenes...');

exports.handler = async (event) => {
  console.log('Evento S3 recibido:', JSON.stringify(event));

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    // Ignorar archivos que ya están procesados
    if (key.startsWith('procesadas/')) {
      console.log(`Archivo ya procesado, ignorando: ${key}`);
      continue;
    }

    console.log(`Procesando: ${bucket}/${key}`);

    try {
      // Descargar imagen original
      const response = await s3Client.send(new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }));

      const imageBuffer = await streamToBuffer(response.Body);

      // Procesar cada tamaño
      for (const size of SIZES) {
        const resizedBuffer = await sharp(imageBuffer)
          .resize(size.width, size.height, {
            fit: 'cover',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85 })
          .toBuffer();

        const destinationKey = `procesadas/${size.suffix}/${key.split('/').pop()}`;

        await s3Client.send(new PutObjectCommand({
          Bucket: BUCKET_DESTINO,
          Key: destinationKey,
          Body: resizedBuffer,
          ContentType: 'image/jpeg',
          Metadata: {
            originalKey: key,
            processedSize: size.suffix,
            processedAt: new Date().toISOString(),
          },
        }));

        console.log(`Guardada: ${destinationKey} (${resizedBuffer.length} bytes)`);
      }
    } catch (error) {
      console.error(`Error procesando ${key}:`, error);
      throw error; // Re-lanzar para que S3 reintente
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Imágenes procesadas' }),
  };
};

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
```

### Ejemplo profesional: API completa con middleware y validación

```javascript
// api-handler.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { Logger } = require("@aws-lambda-powertools/logger");
const { Tracer } = require("@aws-lambda-powertools/tracer");
const { Metrics, MetricUnits } = require("@aws-lambda-powertools/metrics");

const logger = new Logger({ serviceName: 'api-gateway' });
const tracer = new Tracer({ serviceName: 'api-gateway' });
const metrics = new Metrics({ namespace: 'APIGateway', serviceName: 'usuarios' });

const dynamoClient = tracer.captureAWSv3Client(new DynamoDBClient({}));
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const ssmClient = new SSMClient({});

let tableName;

// Inicialización: obtener config de Parameter Store
async function init() {
  if (!tableName) {
    const param = await ssmClient.send(new GetParameterCommand({
      Name: process.env.TABLE_NAME_PARAM || '/api/usuarios/table-name',
    }));
    tableName = param.Parameter.Value;
    logger.info('Tabla configurada', { tableName });
  }
}

// Validación de entrada
function validateInput(body) {
  const errors = [];
  if (!body.nombre || body.nombre.length < 2) {
    errors.push('nombre es requerido (mínimo 2 caracteres)');
  }
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('email válido es requerido');
  }
  if (body.edad && (body.edad < 0 || body.edad > 150)) {
    errors.push('edad debe ser entre 0 y 150');
  }
  return errors;
}

// Respuesta estandarizada
function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': process.env._X_AMZN_TRACE_ID || 'unknown',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  tracer.captureLambdaHandler();
  logger.addContext(event.requestContext);

  await init();

  const { httpMethod, path, body: rawBody } = event;
  const pathSegments = path.split('/').filter(Boolean);

  const segment = tracer.getSegment();
  const subsegment = segment.addNewSubsegment('APIOperation');
  tracer.setSegment(subsegment);

  try {
    metrics.addMetric('ApiCalls', MetricUnits.Count, 1);

    // GET /usuarios
    if (httpMethod === 'GET' && pathSegments.length === 1) {
      const result = await docClient.send(new ScanCommand({
        TableName: tableName,
        Limit: 50,
      }));

      metrics.addMetric('ListUsers', MetricUnits.Count, 1);

      return response(200, {
        data: result.Items,
        count: result.Count,
        scannedCount: result.ScannedCount,
      });
    }

    // GET /usuarios/{id}
    if (httpMethod === 'GET' && pathSegments.length === 2) {
      const id = pathSegments[1];
      const result = await docClient.send(new GetCommand({
        TableName: tableName,
        Key: { id },
      }));

      if (!result.Item) {
        return response(404, { message: 'Usuario no encontrado' });
      }

      metrics.addMetric('GetUser', MetricUnits.Count, 1);
      return response(200, { data: result.Item });
    }

    // POST /usuarios
    if (httpMethod === 'POST' && pathSegments.length === 1) {
      const body = JSON.parse(rawBody);
      const errors = validateInput(body);

      if (errors.length > 0) {
        metrics.addMetric('ValidationError', MetricUnits.Count, 1);
        return response(400, { message: 'Validación fallida', errors });
      }

      const item = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        nombre: body.nombre,
        email: body.email,
        edad: body.edad || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await docClient.send(new PutCommand({
        TableName: tableName,
        Item: item,
      }));

      metrics.addMetric('CreateUser', MetricUnits.Count, 1);
      logger.info('Usuario creado', { userId: item.id });

      return response(201, { message: 'Usuario creado', data: item });
    }

    // DELETE /usuarios/{id}
    if (httpMethod === 'DELETE' && pathSegments.length === 2) {
      const id = pathSegments[1];

      const existing = await docClient.send(new GetCommand({
        TableName: tableName,
        Key: { id },
      }));

      if (!existing.Item) {
        return response(404, { message: 'Usuario no encontrado' });
      }

      await docClient.send(new DeleteCommand({
        TableName: tableName,
        Key: { id },
      }));

      metrics.addMetric('DeleteUser', MetricUnits.Count, 1);
      return response(200, { message: 'Usuario eliminado' });
    }

    return response(404, { message: 'Ruta no encontrada' });
  } catch (error) {
    logger.error('Error en la función', { error: error.message, stack: error.stack });
    metrics.addMetric('Errors', MetricUnits.Count, 1);
    return response(500, { message: 'Error interno del servidor' });
  } finally {
    subsegment.close();
    metrics.publishStoredMetrics();
  }
};
```

---

## SAM Template

### template.yaml completo

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: API Serverless completa con Lambda, API Gateway y DynamoDB

Globals:
  Function:
    Timeout: 10
    Runtime: nodejs20.x
    MemorySize: 256
    Tracing: Active
    Environment:
      Variables:
        POWERTOOLS_SERVICE_NAME: api-usuarios
        LOG_LEVEL: INFO
        TABLE_NAME: !Ref UsuariosTable
    Tags:
      Project: MiProyecto
      Environment: !Ref Environment

Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues: [dev, staging, production]

Resources:
  # ==========================================
  # DynamoDB Table
  # ==========================================
  UsuariosTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub 'usuarios-${Environment}'
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true
      Tags:
        - Key: Name
          Value: !Sub 'usuarios-${Environment}'

  # ==========================================
  # Lambda Function - CRUD Usuarios
  # ==========================================
  UsuariosFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: api-handler.handler
      CodeUri: src/
      Description: API CRUD de usuarios
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref UsuariosTable
        - SSMParameterReadPolicy:
            ParameterName: !Sub '/api/${Environment}/*'
      Events:
        GetUsuarios:
          Type: Api
          Properties:
            Path: /usuarios
            Method: GET
            RestApiId: !Ref ApiGateway
        GetUsuarioById:
          Type: Api
          Properties:
            Path: /usuarios/{id}
            Method: GET
            RestApiId: !Ref ApiGateway
        CreateUsuario:
          Type: Api
          Properties:
            Path: /usuarios
            Method: POST
            RestApiId: !Ref ApiGateway
        UpdateUsuario:
          Type: Api
          Properties:
            Path: /usuarios/{id}
            Method: PUT
            RestApiId: !Ref ApiGateway
        DeleteUsuario:
          Type: Api
          Properties:
            Path: /usuarios/{id}
            Method: DELETE
            RestApiId: !Ref ApiGateway

  # ==========================================
  # Lambda Function - Imágenes
  # ==========================================
  ImageProcessorFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: image-processor.handler
      CodeUri: src/
      Description: Procesador de imágenes desde S3
      MemorySize: 1024
      Timeout: 60
      Policies:
        - S3ReadPolicy:
            BucketName: !Ref ImagenesBucket
        - S3CrudPolicy:
            BucketName: !Ref ImagenesBucketProcesadas
      Layers:
        - !Sub 'arn:aws:lambda:${AWS::Region}:017000801446:layer:sharp:11'
      Events:
        ImageUpload:
          Type: S3
          Properties:
            Bucket: !Ref ImagenesBucket
            Events: s3:ObjectCreated:*
            Filters:
              S3Key:
                Rules:
                  - Name: prefix
                    Value: uploads/
                  - Name: suffix
                    Value: .jpg

  # ==========================================
  # API Gateway
  # ==========================================
  ApiGateway:
    Type: AWS::Serverless::Api
    Properties:
      Name: !Sub 'api-usuarios-${Environment}'
      StageName: !Ref Environment
      TracingEnabled: true
      MethodSettings:
        - ResourcePath: /*
          HttpMethod: '*'
          ThrottlingBurstLimit: 100
          ThrottlingRateLimit: 50

  # ==========================================
  # S3 Buckets
  # ==========================================
  ImagenesBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'imagenes-${Environment}-${AWS::AccountId}'
      VersioningConfiguration:
        Status: Enabled
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256

  ImagenesBucketProcesadas:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'imagenes-procesadas-${Environment}-${AWS::AccountId}'
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256

  # ==========================================
  # CloudWatch Alarms
  # ==========================================
  LambdaErrorAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub 'usuarios-errors-${Environment}'
      AlarmDescription: Errores en Lambda Usuarios
      Namespace: AWS/Lambda
      MetricName: Errors
      Dimensions:
        - Name: FunctionName
          Value: !Ref UsuariosFunction
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 5
      ComparisonOperator: GreaterThanOrEqualToThreshold
      AlarmActions:
        - !Ref AlertingSNSTopic

  LambdaThrottleAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub 'usuarios-throttles-${Environment}'
      Namespace: AWS/Lambda
      MetricName: Throttles
      Dimensions:
        - Name: FunctionName
          Value: !Ref UsuariosFunction
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 1
      ComparisonOperator: GreaterThanOrEqualToThreshold
      AlarmActions:
        - !Ref AlertingSNSTopic

  AlertingSNSTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: !Sub 'lambda-alerts-${Environment}'

Outputs:
  ApiEndpoint:
    Description: URL del endpoint de la API
    Value: !Sub 'https://${ApiGateway}.execute-api.${AWS::Region}.amazonaws.com/${Environment}'

  UsuariosFunctionArn:
    Description: ARN de la función Lambda
    Value: !GetAtt UsuariosFunction.Arn

  DynamoDBTableName:
    Description: Nombre de la tabla DynamoDB
    Value: !Ref UsuariosTable
```

---

## Diagramas Mermaid

### Arquitectura completa de Lambda

```mermaid
graph TB
    subgraph "Fuentes de eventos"
        AG[API Gateway]
        S3[S3]
        SQS[SQS]
        SNS[SNS]
        CW[CloudWatch Events]
        DDB[DynamoDB Streams]
    end
    
    subgraph "AWS Lambda"
        L1[Función API]
        L2[Función Procesador]
        L3[Función Cron]
    end
    
    subgraph "Servicios backend"
        DDB_T[(DynamoDB)]
        RDS[(RDS)]
        S3_OUT[S3 Output]
    end
    
    subgraph "Observabilidad"
        CW_M[CloudWatch Metrics]
        CW_L[CloudWatch Logs]
        XRAY[X-Ray Tracing]
    end
    
    AG --> L1
    S3 --> L2
    SQS --> L2
    CW --> L3
    DDB --> L3
    
    L1 --> DDB_T
    L1 --> RDS
    L2 --> S3_OUT
    L3 --> DDB_T
    
    L1 --> CW_M
    L1 --> CW_L
    L1 --> XRAY
```

### Ciclo de vida de Lambda

```mermaid
stateDiagram-v2
    [*] --> Creada
    Creada --> Active: publish-version
    Active --> Active: update-function-code
    Active --> Active: update-config
    Active --> Inactive: delete
    Active --> Versioned: alias->version
    Versioned --> Active: promote alias
    Inactive --> [*]
```

### Flujo de invocación asíncrona con reintentos

```mermaid
flowchart TD
    A[Evento] --> B[Lambda: Primer intento]
    B -->|Éxito| C[Destino: Éxito]
    B -->|Error| D{Reintentar?}
    D -->|Sí < 2 intentos| B
    D -->|No > 2 intentos| E[DLQ: SQS/SNS]
    E --> F[Monitoreo manual]
```

---

## Preguntas frecuentes (FAQ)

**¿Cuál es la diferencia entre Lambda y EC2?**
Lambda es serverless: AWS gestiona la infraestructura, escala automáticamente y solo pagas por uso. EC2 te da control total sobre la instancia pero requieres administrarla. Lambda es ideal para workloads event-driven; EC2 para workloads que necesitan estado o control total.

**¿Puedo ejecutar Lambda en VPC?**
Sí, pero esto añade latencia de cold start (1-5s) y necesitas NAT Gateway para acceso a internet. Solo úsalo cuando necesites acceder a recursos privados como RDS o ElastiCache.

**¿Qué es un Cold Start y cómo lo evito?**
Un cold start es la inicialización de un nuevo entorno de ejecución. Lo minimizas usando Provisioned Concurrency, reduciendo el tamaño del package, inicializando fuera del handler y usando runtimes ligeros.

**¿Cuánto cuesta Lambda realmente?**
Para 1M de invocaciones con 256 MB y 200ms de duración, el costo es ~$0.20 (requests) + ~$826 (duration) = ~$826/mes. El free tier cubre 1M requests + 400,000 GB-s/mes.

**¿Puedo ejecutar código de Python con librerías nativas?**
Sí, usando Lambda Layers o empaquetando las librerías en el zip. Alternativamente, puedes usar un Docker container image (hasta 10 GB).

**¿Lambda tiene límite de concurrencia?**
Sí, el límite predeterminado es 1,000 concurrentes por región. Puedes solicitar un aumento. El Reserved Concurrency garantiza que una función tenga un tope de concurrencia dedicado.

**¿Cómo manejo errores en Lambda?**
Para eventos síncronos, Lambda retorna el error al invocador. Para asíncronos, reintenta 2 veces antes de enviar al DLQ. Usa Dead Letter Queues y destinations para manejar fallos.

---

## Consejos para entrevistas

1. **Explica Lambda con la analogía del café**: "Pagas solo por lo que consumes, como un café por consumo".
2. **Conoce los límites clave**: 15 min timeout, 10 GB memoria, 250 MB package, 6 MB payload síncrono.
3. **Explica Cold Starts**: qué son, por qué ocurren y cómo mitigarlos (Provisioned Concurrency, init fuera del handler).
4. **Diferencia síncrono vs asíncrono**: retrys automáticos en asíncrono, DLQ, destinations.
5. **Conoce Lambda Layers**: cuándo usarlos y sus limitaciones (5 capas, 250 MB total).
6. **Entiende VPC access**: cold start adicional, necesidad de NAT Gateway.
7. **Sabe cuándo NO usar Lambda**: workloads > 15 min, alto rendimiento de red, contenedores grandes.
8. **Conoce los event sources**: S3, API Gateway, DynamoDB Streams, SQS, SNS, EventBridge.
9. **Menciona Powertools**: logger, tracer y metrics para observabilidad.
10. **Habla de SAM/CDK**: Infrastructure as Code para desplegar Lambda.

---

## Resumen

AWS Lambda es el servicio serverless de compute que ejecuta código en respuesta a eventos sin administrar servidores. Soporta múltiples runtimes (Node.js, Python, Java, Go, .NET, Ruby) y se integra con más de 200 fuentes de eventos.

Los conceptos clave incluyen Cold Starts (inicialización de entorno), Lambda Layers (código compartido), Provisioned Concurrency (evitar cold starts), y Dead Letter Queues (manejo de errores). Lambda tiene un free tier generoso de 1M requests/mes.

Los límites importantes son: 15 minutos de timeout, 10 GB de memoria, 250 MB de package sin comprimir, y 6 MB de payload síncrono. Para workloads más pesados, considera ECS Fargate o EC2.

Lambda brilla en APIs serverless, procesamiento de eventos, automatizaciones y microservicios event-driven. Para workloads stateful, de larga duración o con necesidades de red intensivas, otras opciones como ECS son más apropiadas.
