---
title: Amazon SNS - Simple Notification Service
description: Guía completa de Amazon SNS: topics, suscripciones, fan-out pattern, message filtering, encryptación, pricing y mejores prácticas.
---

# Amazon SNS - Simple Notification Service

## ¿Qué es SNS?

Imagina que eres el administrador de un grupo de WhatsApp con 100 personas. Cuando quieres enviar un mensaje, lo escribes una vez y **todas las personas lo reciben al mismo tiempo**. **Amazon SNS (Simple Notification Service)** es exactamente eso: un sistema de mensajería **pub-sub** que entrega notificaciones a múltiples suscriptores simultáneamente.

```mermaid
flowchart TB
    Publisher["📢 Publisher\n(Lambda/API GW)"] -->|"Publica mensaje"| TOPIC["📨 SNS Topic"]
    TOPIC -->|"Entrega"| SUB1["📧 Email\nadmin@mi-app.com"]
    TOPIC -->|"Entrega"| SUB2["📱 SMS\n+52 55 1234 5678"]
    TOPIC -->|"Entrega"| SUB3["🔔 Lambda\nProcesarPedido"]
    TOPIC -->|"Entrega"| SUB4["🗄️ SQS\nColaWebhooks"]
    TOPIC -->|"Entrega"| SUB5["📱 Push\nApp Móvil"]
```

:::tip
SNS es **push-based** (envía mensajes a suscriptores), mientras que SQS es **pull-based** (los consumidores buscan mensajes).
:::

## Topics: FIFO vs Standard

| Característica | Standard Topic | FIFO Topic |
|---|---|---|
| Orden | No garantizada | Estrictamente ordenada |
| Throughput | **Millones por segundo** | **300 msg/s** (3,000 con batch) |
| Deduplicación | No | Sí (Message Deduplication ID) |
| Message Group ID | No | Sí (requerido) |
| Suscripciones | HTTP, email, SMS, SQS, Lambda, mobile push | SQS, Lambda, HTTP(S), email |
| Costo | $0.50/millón | $1.00/millón |
| Nombre | Hasta 256 caracteres | Termina en `.fifo` |

```bash
# Crear Standard Topic
aws sns create-topic --name mi-topic

# Crear FIFO Topic
aws sns create-topic --name mi-topic.fifo --attributes '{"FifoTopic": "true", "ContentBasedDeduplication": "true"}'
```

## Tipos de Suscripciones

| Tipo | Protocolo | Descripción |
|---|---|---|
| **HTTP/HTTPS** | HTTP | Webhook a tu servidor |
| **Email** | email | Notificación por correo |
| **Email-JSON** | email-json | JSON por correo |
| **SMS** | sms | Mensaje de texto |
| **SQS** | sqs | Cola SQS (para procesamiento) |
| **Lambda** | lambda | Invoca función Lambda |
| **Mobile Push** | application | Push notifications (APNS, FCM) |

```mermaid
flowchart TB
    TOPIC["SNS Topic\nmi-notificaciones"]
    TOPIC -->|"email"| EMAIL["📧 admin@mi-app.com"]
    TOPIC -->|"sms"| SMS["📱 +52 55 1234"]
    TOPIC -->|"sqs"| SQS1["🗄️ SQS Pedidos"]
    TOPIC -->|"sqs"| SQS2["🗄️ SQS Logging"]
    TOPIC -->|"lambda"| LAMBDA["⚡ Lambda\nEnviarEmail"]
    TOPIC -->|"https"| WEBHOOK["🌐 Webhook\nmi-app.com/notify"]
    TOPIC -->|"application"| PUSH["📱 Push\niOS/Android"]
```

```bash
# Suscribir email
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:mi-topic \
  --protocol email \
  --notification-endpoint admin@mi-app.com

# Suscribir SQS
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:mi-topic \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:us-east-1:123456789012:mi-cola

# Suscribir Lambda
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:mi-topic \
  --protocol lambda \
  --notification-endpoint arn:aws:lambda:us-east-1:123456789012:function:MiFuncion

# Suscribir SMS
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:mi-topic \
  --protocol sms \
  --notification-endpoint "+525512345678"

# Suscribir HTTPS (webhook)
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:mi-topic \
  --protocol https \
  --notification-endpoint https://mi-app.com/webhook
```

## Message Filtering

**Message Filtering** permite que cada suscripción reciba solo los mensajes que le interesan, usando filtros basados en **message attributes**.

```mermaid
flowchart TB
    TOPIC["SNS Topic"]
    TOPIC -->|"Filter: pedidos"| SQS_PEDIDOS["SQS Pedidos"]
    TOPIC -->|"Filter: usuarios"| SQS_USUARIOS["SQS Usuarios"]
    TOPIC -->|"Filter: pagos"| LAMBDA_PAGOS["Lambda Pagos"]
    TOPIC -->|"Sin filtro"| ALL["SQS Todos"]
```

```bash
# Crear suscripción con filtro
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:mi-topic \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:us-east-1:123456789012:mi-cola-pedidos \
  --attributes '{"FilterPolicy": "{\"event_type\": [\"pedido_creado\", \"pedido_actualizado\"]}'}'

# Filter policy para múltiples atributos
aws sns set-subscription-attributes \
  --subscription-arn arn:aws:sns:us-east-1:123456789012:mi-topic:abc123 \
  --attribute-name FilterPolicy \
  --attribute-value '{
    "event_type": ["pedido_creado"],
    "priority": ["high", "critical"],
    "region": [{"prefix": "us-"}]
  }'
```

### Ejemplos de Filter Policy

```json
{
  "event_type": ["pedido_creado", "pedido_cancelado"],
  "priority": ["high", "critical"],
  "amount": [{"numeric": [">=", 100]}],
  "source": [{"prefix": "order-service-"}]
}
```

| Operador | Descripción | Ejemplo |
|---|---|---|
| Exact match | Igualdad exacta | `"event_type": ["pedido_creado"]` |
| Prefix | Prefijo del string | `"source": [{"prefix": "order-"}]` |
| Anything-but | Excluir valores | `"status": [{"anything-but": ["test"]}]` |
| Numeric | Comparaciones numéricas | `"amount": [{"numeric": [">=", 100]}]` |
| IP prefix | Rango de IPs | `"source_ip": [{"prefix": "10.0."}]` |

## Message Attributes

```bash
# Publicar con atributos
aws sns publish \
  --topic-arn arn:aws:sns:us-east-1:123456789012:mi-topic \
  --message "Nuevo pedido #12345" \
  --message-attributes '{
    "event_type": {"DataType": "String", "StringValue": "pedido_creado"},
    "priority": {"DataType": "String", "StringValue": "high"},
    "amount": {"DataType": "Number", "StringValue": "150.00"}
  }'
```

## Fan-Out Pattern (SNS + SQS)

El **Fan-Out Pattern** es cuando un evento se distribuye a múltiples servicios simultáneamente. Es el patrón más común con SNS.

```mermaid
flowchart TB
    EVENTO["Evento\n(Pedido Creado)"] --> SNS["SNS Topic"]
    SNS -->|"Suscripción 1"| SQS1["SQS: Notificaciones\n→ Email/SMS"]
    SNS -->|"Suscripción 2"| SQS2["SQS: Inventario\n→ Actualizar Stock"]
    SNS -->|"Suscripción 3"| SQS3["SQS: Analytics\n→ Dashboard"]
    SNS -->|"Suscripción 4"| LAMBDA["Lambda: Facturación\n→ Generar Factura"]
    SQS1 --> EC1["EC2: Email Service"]
    SQS2 --> EC2["EC2: Inventory Service"]
    SQS3 --> LAMBDA2["Lambda: Analytics"]
```

```bash
# Crear fan-out: SNS → múltiples SQS
# 1. Crear SNS Topic
aws sns create-topic --name pedidos-events

# 2. Crear SQS para cada consumidor
aws sqs create-queue --queue-name sqs-notificaciones
aws sqs create-queue --queue-name sqs-inventario
aws sqs create-queue --queue-name sqs-analytics

# 3. Suscribir cada SQS al topic
aws sns subscribe --topic-arn arn:aws:sns:us-east-1:123456789012:pedidos-events --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:123456789012:sqs-notificaciones
aws sns subscribe --topic-arn arn:aws:sns:us-east-1:123456789012:pedidos-events --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:123456789012:sqs-inventario
aws sns subscribe --topic-arn arn:aws:sns:us-east-1:123456789012:pedidos-events --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:123456789012:sqs-analytics
```

:::tip
El fan-out con SNS + SQS es la forma estándar de **desacoplar microservicios**. Un evento llega una vez y cada servicio lo procesa de forma independiente.
:::

## Application y Platform Notifications

### Mobile Push Notifications

```mermaid
flowchart LR
    APP["App Móvil"] -->|"Token"| SNS["SNS Platform\nApplication"]
    SNS --> APNS["APNS\n(iOS)"]
    SNS --> FCM["FCM\n(Android)"]
    SNS --> ADM["ADM\n(Fire OS)"]
```

```bash
# Crear Platform Application (iOS)
aws sns create-platform-application \
  --name "MiApp-iOS" \
  --platform APNS \
  --attributes '{
    "PlatformCredential": "-----BEGIN PRIVATE KEY-----\n..."
  }'

# Registrar Device Token
aws sns create-platform-endpoint \
  --platform-application-arn arn:aws:sns:us-east-1:123456789012:app/APNS/MiApp-iOS \
  --token "device-token-from-ios"
```

## Encryptación

| Tipo | Descripción |
|---|---|
| SSE-SNS | AWS gestiona claves de encriptación |
| SSE-KMS | Usas claves KMS (customer-managed) |

```bash
# Habilitar SSE-KMS
aws sns set-topic-attributes \
  --topic-arn arn:aws:sns:us-east-1:123456789012:mi-topic \
  --attribute-name KmsMasterKeyId \
  --attribute-value alias/mi-key-sns
```

## Access Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowPublishFromAccountB",
    "Effect": "Allow",
    "Principal": {"AWS": "arn:aws:iam::999888777666:root"},
    "Action": "sns:Publish",
    "Resource": "arn:aws:sns:us-east-1:123456789012:mi-topic"
  }, {
    "Sid": "AllowSubscribeFromAccountB",
    "Effect": "Allow",
    "Principal": {"AWS": "arn:aws:iam::999888777666:root"},
    "Action": "sns:Subscribe",
    "Resource": "arn:aws:sns:us-east-1:123456789012:mi-topic"
  }]
}
```

## Precio

| Concepto | Costo |
|---|---|
| Standard Topic | $0.50 por millón de publicaciones |
| FIFO Topic | $1.00 por millón de publicaciones |
| HTTP/HTTPS/Email/SMS/Lambda delivery | $0.06 por 100,000 |
| Mobile Push | Gratis |
| Data transfer out | $0.09/GB |
| SMS | Variable por país |

## Mejores Prácticas

1. **Usa SQS como intermediario** entre SNS y consumidores para durabilidad
2. **Implementa message filtering** para reducir procesamiento innecesario
3. **Habilita SSE-KMS** para topics con datos sensibles
4. **Usa FIFO topics** cuando necesitas orden estricto
5. **Configura DLQ** en las suscripciones SQS para mensajes fallidos
6. **Monitorea con CloudWatch** (NumberOfMessagesPublished, DeliveryFails)
7. **Usa tags** para gestión de costos
8. **No publiques datos sensibles** sin encryptación

## Errores Comunes

| Error | Consecuencia | Solución |
|---|---|---|
| Sin DLQ en suscripciones SQS | Mensajes fallidos se pierden | Configurar DLQ |
| Filter policy mal configurado | Mensajes no llegan a suscriptor | Verificar FilterPolicy syntax |
| Suscripción email sin confirmar | No recibe mensajes | Confirmar desde el email |
| Sin permisos para Lambda | Suscripción Lambda falla | Dar permiso SNS a Lambda |
| FIFO sin Message Group ID | Error al publicar | Incluir Message Group ID |

## Preguntas Frecuentes (FAQ)

**¿SNS vs SQS?**
SNS es push (envía a suscriptores). SQS es pull (consumidor busca). SNS + SQS = Fan-Out pattern.

**¿Puedo tener múltiples suscripciones?**
Sí. Puedes tener miles de suscripciones por topic.

**¿SNS entrega exactly-once?**
No. SNS es at-least-once. Para exactly-once, usa SQS FIFO después de SNS.

**¿Puedo usar SNS para SMS?**
Sí. SNS soporta SMS a nivel global con costos por país.

## Tips para Entrevistas

1. **SNS = pub-sub (push), SQS = cola (pull)**
2. **Fan-out pattern:** SNS → múltiples SQS para distribuir eventos
3. **Message Filtering** reduce costos al evitar procesamiento innecesario
4. **FIFO SNS** tiene throughput limitado (300 msg/s) pero garantiza orden
5. **SNS + SQS** es más duradero que SNS directo a Lambda
6. **SMS pricing** varía por país y destino (local/internacional)

## Resumen

| Componente | Descripción |
|---|---|
| Topic | Canal de publicación de mensajes |
| Standard Topic | Alto throughput, sin orden |
| FIFO Topic | Orden estricto, exactly-once |
| Subscription | Conexión entre topic y consumidor |
| Filter Policy | Filtrar mensajes por atributos |
| Message Attribute | Metadatos del mensaje |
| Fan-Out | Distribuir evento a múltiples servicios |
| Platform Application | Push notifications (APNS, FCM) |
| Access Policy | Controlar quién publica/suscribe |
