---
title: "Patrones de Arquitectura en AWS"
description: "Guía completa de patrones de arquitectura en AWS: Web Apps, Serverless, Microservicios, Event-Driven, CQRS, Multi-tenant y Disaster Recovery."
---

# Patrones de Arquitectura en AWS

## Visión General

Este documento describe los patrones de arquitectura más comunes y recomendados en AWS, con diagramas Mermaid detallados, ventajas, desventajas, consideraciones de costo y cuándo usar cada uno.

```mermaid
graph TB
    subgraph "Patrones de Arquitectura"
        WA[Web Application]
        TWA[Traditional Web App]
        MS[Microservices]
        SL[Serverless]
        ED[Event-Driven]
        CQRS[CQRS]
        MT[Multi-Tenant SaaS]
        MR[Multi-Region HA]
        DR[Disaster Recovery]
        CO[Cost-Optimized]
        AI[AI/ML Architecture]
        MOB[Mobile Backend]
    end
```

---

## 1. Web Application (React + API Gateway + Lambda + DynamoDB)

### Descripción
Arquitectura serverless moderna para aplicaciones web SPA (Single Page Application) con backend serverless.

### Cuándo Usar
- Aplicaciones de inicio o MVP
- APIs RESTful o GraphQL
- Cargas de trabajo con tráfico variable
- Cuando quieres minimizar costos operativos

### Diagrama

```mermaid
graph TB
    subgraph "Frontend"
        BROWSER[Browser]
        CDN[CloudFront CDN]
    end
    
    subgraph "Backend Serverless"
        APIGW[API Gateway]
        L1[Lambda - Auth]
        L2[Lambda - Users]
        L3[Lambda - Orders]
        L4[Lambda - Products]
    end
    
    subgraph "Data Layer"
        DDB[DynamoDB - Users]
        DDB2[DynamoDB - Orders]
        DDB3[DynamoDB - Products]
    end
    
    subgraph "Supporting Services"
        COGNITO[Cognito]
        S3_STATIC[S3 - Static Assets]
        S3_UPLOAD[S3 - Uploads]
        SES[SES - Email]
        SQS[SQS - Queue]
    end
    
    BROWSER --> CDN
    CDN --> S3_STATIC
    BROWSER --> APIGW
    APIGW --> L1
    APIGW --> L2
    APIGW --> L3
    APIGW --> L4
    
    L1 --> COGNITO
    L2 --> DDB
    L3 --> DDB2
    L4 --> DDB3
    
    L3 --> SQS
    SQS --> SES
    L2 --> S3_UPLOAD
```

### Componentes Principales

| Componente | Servicio AWS | Propósito |
|---|---|---|
| Frontend | S3 + CloudFront | Hosting SPA + CDN global |
| Auth | Cognito | Autenticación y autorización |
| API | API Gateway | Routing y rate limiting |
| Compute | Lambda | Lógica de negocio serverless |
| Database | DynamoDB | Base de datos NoSQL |
| Cola | SQS | Desacoplamiento async |
| Email | SES | Envío de emails |

### Ejemplo de CDK TypeScript

```typescript
import { App, Stack, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Table, BillingMode, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as path from 'path';

export class ServerlessWebAppStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // DynamoDB Tables
    const usersTable = new Table(this, 'UsersTable', {
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const ordersTable = new Table(this, 'OrdersTable', {
      partitionKey: { name: 'orderId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Cognito
    const userPool = new UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
    });

    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool,
    });

    // Lambda Functions
    const authLambda = new NodejsFunction(this, 'AuthFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/auth/handler.ts'),
      environment: {
        USER_POOL_ID: userPool.userPoolId,
      },
    });

    const usersLambda = new NodejsFunction(this, 'UsersFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/users/handler.ts'),
      environment: {
        USERS_TABLE: usersTable.tableName,
      },
    });

    const ordersLambda = new NodejsFunction(this, 'OrdersFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/orders/handler.ts'),
      environment: {
        ORDERS_TABLE: ordersTable.tableName,
      },
    });

    // API Gateway
    const api = new RestApi(this, 'Api', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: Cors.ALL_METHODS,
      },
    });

    const authResource = api.root.addResource('auth');
    authResource.addMethod('POST', new LambdaIntegration(authLambda));

    const usersResource = api.root.addResource('users');
    usersResource.addMethod('GET', new LambdaIntegration(usersLambda));
    usersResource.addMethod('POST', new LambdaIntegration(usersLambda));

    const ordersResource = api.root.addResource('orders');
    ordersResource.addMethod('GET', new LambdaIntegration(ordersLambda));
    ordersResource.addMethod('POST', new LambdaIntegration(ordersLambda));

    // Permissions
    usersTable.grantReadWriteData(usersLambda);
    ordersTable.grantReadWriteData(ordersLambda);

    // Outputs
    new CfnOutput(this, 'ApiUrl', { value: api.url });
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
  }
}
```

### Pros y Contras

| Pros | Contras |
|---|---|
| Escalabilidad automática | Cold starts en Lambda |
| Costo bajo (pago por uso) | Complejidad de debugging |
| Sin gestión de servidores | Limitaciones de Lambda (15 min timeout) |
| Deploy simple | Vendor lock-in con AWS |
| Seguridad integrada | DynamoDB tiene curva de aprendizaje |

### Consideraciones de Costo
- **Tráfico bajo:** $5-20/mes
- **Tráfico medio:** $50-200/mes
- **Tráfico alto:** $200-1000+/mes
- La mayor parte del costo viene de API Gateway y Lambda invocations

---

## 2. Traditional Web App (ALB + EC2 + RDS)

### Descripción
Arquitectura clásica de tres capas con servidores gestionados, ideal para aplicaciones monolíticas o que requieren control total del servidor.

### Cuándo Usar
- Aplicaciones legacy migradas a la nube
- Apps que necesitan software específico instalado en el servidor
- Bases de datos relacionales complejas
- Cuando necesitas control total del OS

### Diagrama

```mermaid
graph TB
    subgraph "Internet"
        USER[Usuario]
    end
    
    subgraph "DMZ / Public"
        ALB[Application Load Balancer]
        WAF[WAF]
    end
    
    subgraph "Private Subnet"
        EC2_1[EC2 - Web Server 1]
        EC2_2[EC2 - Web Server 2]
        EC2_3[EC2 - App Server]
    end
    
    subgraph "Data Subnet"
        RDS Primary[RDS Primary]
        RDS Standby[RDS Standby]
        REDIS[ElastiCache Redis]
    end
    
    USER --> WAF
    WAF --> ALB
    ALB --> EC2_1
    ALB --> EC2_2
    EC2_1 --> EC2_3
    EC2_2 --> EC2_3
    EC2_3 --> RDS Primary
    EC2_3 --> REDIS
    RDS Primary --> RDS Standby
```

### CDK TypeScript

```typescript
import { App, Stack, CfnOutput, Tags, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  Vpc, SubnetType, SecurityGroup, Peer, Port,
  Instance, InstanceType, InstanceClass, MachineImage,
  AmazonLinuxGeneration, UserData,
} from 'aws-cdk-lib/aws-ec2';
import {
  LoadBalancer, ApplicationProtocol, TargetType,
  ApplicationTargetGroup, ListenerCondition,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import {
  DatabaseInstance, DatabaseInstanceEngine,
  PostgresEngineVersion, Credentials, BackupRetention,
} from 'aws-cdk-lib/aws-rds';

export class TraditionalWebAppStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new Vpc(this, 'Vpc', {
      maxAzs: 2,
      subnetConfiguration: [
        { name: 'Public', subnetType: SubnetType.PUBLIC, cidrMask: 24 },
        { name: 'Private', subnetType: SubnetType.PRIVATE_WITH_EGRESS, cidrMask: 24 },
        { name: 'Data', subnetType: SubnetType.PRIVATE_ISOLATED, cidrMask: 24 },
      ],
    });

    // Security Groups
    const albSg = new SecurityGroup(this, 'ALBSG', { vpc });
    albSg.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
    albSg.addIngressRule(Peer.anyIpv4(), Port.tcp(443));

    const webSg = new SecurityGroup(this, 'WebSG', { vpc });
    webSg.addIngressRule(albSg, Port.tcp(80));

    const dbSg = new SecurityGroup(this, 'DBSG', { vpc });
    dbSg.addIngressRule(webSg, Port.tcp(5432));

    // EC2 Instances
    const userData = UserData.forLinux();
    userData.addCommands(
      'yum update -y',
      'yum install -y httpd php php-pgsql',
      'systemctl start httpd',
      'systemctl enable httpd',
    );

    const webServers: Instance[] = [];
    for (let i = 0; i < 2; i++) {
      webServers.push(new Instance(this, `WebServer${i + 1}`, {
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
        machineImage: MachineImage.latestAmazonLinux2(),
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroup: webSg,
        userData,
      }));
    }

    // ALB
    const alb = new LoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true,
      securityGroup: albSg,
    });

    const listener = alb.addListener('Listener', { port: 80 });
    listener.addTargets('WebTargetGroup', {
      port: 80,
      protocol: ApplicationProtocol.HTTP,
      targets: webServers,
    });

    // RDS
    const database = new DatabaseInstance(this, 'Database', {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_15_4,
      }),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
      credentials: Credentials.fromGeneratedSecret('dbadmin'),
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSg],
      multiAz: true,
      backupRetention: BackupRetention.days(7),
      allocatedStorage: 100,
      storageEncrypted: true,
    });

    Tags.of(this).add('Environment', 'production');
  }
}
```

### Pros y Contras

| Pros | Contras |
|---|---|
| Control total del servidor | Gestión manual de servidores |
| Sin limitaciones de Lambda | Costo fijo mensual alto |
| Compatible con cualquier app | Requiere escalado manual o auto-scaling |
| Base de datos relacional completa | Más operaciones de mantenimiento |
| Easy debugging | Menos resiliente que serverless |

### Consideraciones de Costo
- **Mínimo recomendado:** ~$100-300/mes (2 t3.medium + RDS + ALB)
- **Producción típica:** $500-2000/mes
- Incluye costos fijos de EC2 + RDS + ALB +数据传输

---

## 3. Microservices Architecture

### Descripción
Aplicación descompuesta en servicios pequeños e independientes, cada uno con su propia base de datos y ciclo de vida.

### Cuándo Usar
- Equipos grandes que trabajan en partes diferentes
- Cuando necesitas escalabilidad independiente por servicio
- Aplicaciones con múltiples dominios de negocio
- Cuando diferentes servicios tienen diferentes requisitos de performance

### Diagrama

```mermaid
graph TB
    subgraph "Client"
        CLIENT[Web/Mobile Client]
    end
    
    subgraph "API Gateway"
        GW[API Gateway]
    end
    
    subgraph "Service Mesh / Service Discovery"
        SD[Service Discovery]
    end
    
    subgraph "Microservicios"
        SVC1[User Service]
        SVC2[Product Service]
        SVC3[Order Service]
        SVC4[Payment Service]
        SVC5[Notification Service]
    end
    
    subgraph "Data Stores"
        DB1[DynamoDB]
        DB2[RDS PostgreSQL]
        DB3[DynamoDB]
        DB4[RDS MySQL]
        CACHE[ElastiCache]
    end
    
    subgraph "Messaging"
        SNS[SNS]
        SQS[SQS]
        EVENTBRIDGE[EventBridge]
    end
    
    CLIENT --> GW
    GW --> SD
    SD --> SVC1
    SD --> SVC2
    SD --> SVC3
    SD --> SVC4
    SD --> SVC5
    
    SVC1 --> DB1
    SVC2 --> DB2
    SVC3 --> DB3
    SVC4 --> DB4
    SVC2 --> CACHE
    
    SVC1 --> SNS
    SVC2 --> SQS
    SVC3 --> EVENTBRIDGE
    SVC4 --> SNS
    SVC5 --> SQS
```

### Ejemplo de CDK - User Service

```typescript
import { Construct } from 'constructs';
import { Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Table, BillingMode, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import * as path from 'path';

export class UserServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // DynamoDB
    const usersTable = new Table(this, 'UsersTable', {
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // SNS for events
    const userEventsTopic = new Topic(this, 'UserEvents', {
      topicName: 'user-events',
    });

    // SQS for async processing
    const notificationQueue = new Queue(this, 'NotificationQueue', {
      queueName: 'user-notifications',
    });

    // Lambda
    const userLambda = new NodejsFunction(this, 'UserFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/users/handler.ts'),
      environment: {
        USERS_TABLE: usersTable.tableName,
        USER_EVENTS_TOPIC: userEventsTopic.topicArn,
      },
    });

    usersTable.grantReadWriteData(userLambda);
    userEventsTopic.grantPublish(userLambda);
    notificationQueue.grantConsumeMessages(userLambda);

    // API
    const api = new RestApi(this, 'UserServiceApi');
    const users = api.root.addResource('users');
    users.addMethod('GET', new LambdaIntegration(userLambda));
    users.addMethod('POST', new LambdaIntegration(userLambda));
    const user = users.addResource('{userId}');
    user.addMethod('GET', new LambdaIntegration(userLambda));

    new CfnOutput(this, 'ApiUrl', { value: api.url });
  }
}
```

### Pros y Contras

| Pros | Contras |
|---|---|
| Independencia de despliegue | Complejidad operacional |
| Escalabilidad por servicio | Comunicación inter-servicios compleja |
| Polyglot (cada servicio su lenguaje) | Testing de integración difícil |
| Aislamiento de fallos | Consistencia de datos distribuida |
| Equipes autónomos | Más infraestructura needed |

---

## 4. Serverless Architecture

### Descripción
Arquitectura completamente serverless donde no gestionas ningún servidor. Todo se ejecuta en funciones gestionadas.

### Diagrama

```mermaid
graph TB
    subgraph "Trigger Layer"
        APIGW[API Gateway]
        S3EVENT[S3 Event]
        CW[CloudWatch Events]
        DDBSTREAM[DynamoDB Stream]
        KINESIS[Kinesis Stream]
    end
    
    subgraph "Compute Layer"
        LAMBDA1[Lambda - API Handler]
        LAMBDA2[Lambda - S3 Processor]
        LAMBDA3[Lambda - Scheduler]
        LAMBDA4[Lambda - Stream Processor]
        STEP[Step Functions]
    end
    
    subgraph "Data Layer"
        DDB[DynamoDB]
        S3[S3 Bucket]
        AURORA[Aurora Serverless]
        REDIS[ElastiCache]
    end
    
    subgraph "Integration Layer"
        SNS[SNS]
        SQS[SQS]
        EVENTBRIDGE[EventBridge]
    end
    
    APIGW --> LAMBDA1
    S3EVENT --> LAMBDA2
    CW --> LAMBDA3
    DDBSTREAM --> LAMBDA4
    KINESIS --> STEP
    
    LAMBDA1 --> DDB
    LAMBDA1 --> S3
    LAMBDA2 --> DDB
    LAMBDA3 --> STEP
    LAMBDA4 --> SNS
    
    SNS --> SQS
    SQS --> LAMBDA1
    EVENTBRIDGE --> LAMBDA1
```

### Pros y Contras

| Pros | Contras |
|---|---|
| Escalabilidad infinita | Cold starts |
| Cero mantenimiento | Limitaciones de timeout |
| Pago solo por uso | Vendor lock-in |
| Deploy instantáneo | Debugging complejo |
| Alta disponibilidad | Testing local difícil |

### Consideraciones de Costo
- **Tráfico bajo:** $1-10/mes
- **Tráfico medio:** $10-100/mes
- **Tráfico alto:** $100-500+/mes
- Muy costo-efectivo para cargas de trabajo variables

---

## 5. Event-Driven Architecture

### Descripción
Arquitectura basada en eventos donde los servicios se comunican de forma asíncrona a través de eventos.

### Diagrama

```mermaid
graph TB
    subgraph "Event Sources"
        API[API Call]
        DB_CHANGE[Database Change]
        SCHEDULE[Schedule]
        FILE[File Upload]
    end
    
    subgraph "Event Router"
        EB[EventBridge]
        SNS[SNS]
    end
    
    subgraph "Event Processors"
        L1[Order Processor]
        L2[Inventory Processor]
        L3[Email Processor]
        L4[Analytics Processor]
        L5[Payment Processor]
    end
    
    subgraph "Event Stores"
        DDB[DynamoDB]
        ES[OpenSearch]
        S3[S3 Data Lake]
    end
    
    API --> EB
    DB_CHANGE --> EB
    SCHEDULE --> EB
    FILE --> EB
    
    EB --> SNS
    SNS --> L1
    SNS --> L2
    SNS --> L3
    SNS --> L4
    SNS --> L5
    
    L1 --> DDB
    L2 --> DDB
    L3 --> S3
    L4 --> ES
    L5 --> DDB
```

### EventBridge Rule Example

```typescript
import { Rule, EventBus, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

// Rule para eventos de DynamoDB
const orderRule = new Rule(this, 'OrderCreatedRule', {
  eventBus: EventBus.fromEventBusArn(this, 'CustomBus', eventBusArn),
  eventPattern: {
    source: ['com.miapp.orders'],
    detailType: ['OrderCreated'],
  },
});
orderRule.addTarget(new LambdaFunction(orderProcessor));

// Rule para schedule
const reportRule = new Rule(this, 'DailyReport', {
  schedule: Schedule.cron({ minute: '0', hour: '8' }),
});
reportRule.addTarget(new LambdaFunction(reportGenerator));
```

### Pros y Contras

| Pros | Contras |
|---|---|
| Desacoplamiento total | Flujo de control complejo |
| Escalabilidad por evento | Debugging difícil |
| Resiliencia | Eventual consistency |
| Extensible | Testing complejo |
| Procesamiento asíncrono | Posible duplicate processing |

---

## 6. CQRS Pattern

### Descripción
Command Query Responsibility Segregation: separa las operaciones de lectura (query) de las de escritura (command) en diferentes modelos.

### Diagrama

```mermaid
graph TB
    subgraph "Client"
        CLIENT[Client]
    end
    
    subgraph "Command Side"
        CMD_API[Command API]
        CMD_DB[(Write Database)]
        CMD_LAMBDA[Command Lambda]
    end
    
    subgraph "Query Side"
        QUERY_API[Query API]
        QUERY_DB[(Read Database)]
        QUERY_CACHE[Cache Layer]
        QUERY_LAMBDA[Query Lambda]
    end
    
    subgraph "Synchronization"
        CDC[Change Data Capture]
        STREAM[DynamoDB Streams]
        SYNCHRONIZER[Sync Service]
    end
    
    CLIENT --> CMD_API
    CLIENT --> QUERY_API
    
    CMD_API --> CMD_LAMBDA
    CMD_LAMBDA --> CMD_DB
    CMD_DB --> CDC
    CDC --> SYNCHRONIZER
    SYNCHRONIZER --> QUERY_DB
    
    QUERY_API --> QUERY_LAMBDA
    QUERY_LAMBDA --> QUERY_CACHE
    QUERY_CACHE --> QUERY_DB
```

### Ejemplo con DynamoDB Streams

```typescript
import { Table, BillingMode, AttributeType, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import { EventSourceMapping, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

// Write Table (Command)
const writeTable = new Table(this, 'WriteTable', {
  partitionKey: { name: 'PK', type: AttributeType.STRING },
  stream: StreamViewType.NEW_AND_OLD_IMAGES,
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// Read Table (Query)
const readTable = new Table(this, 'ReadTable', {
  partitionKey: { name: 'PK', type: AttributeType.STRING },
  sortKey: { name: 'SK', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// Sync Lambda
const syncLambda = new NodejsFunction(this, 'SyncFunction', {
  runtime: Runtime.NODEJS_18_X,
  handler: 'handler',
  entry: path.join(__dirname, '../lambda/sync/handler.ts'),
  environment: {
    READ_TABLE: readTable.tableName,
  },
});

// DynamoDB Stream → Lambda
new EventSourceMapping(this, 'StreamMapping', {
  eventSourceArn: writeTable.tableStreamArn,
  target: syncLambda,
  startingPosition: StartingPosition.TRIM_HORIZON,
  batchSize: 100,
});

writeTable.grantStreamRead(syncLambda);
readTable.grantWriteData(syncLambda);
```

### Pros y Contras

| Pros | Contras |
|---|---|
| Escalabilidad independiente de reads/writes | Complejidad de implementación |
| Optimización de cada lado | Consistencia eventual |
| Reads optimizados | Sincronización entre modelos |
| Writes optimizados | Más infraestructura |

---

## 7. Multi-Tenant SaaS Architecture

### Descripción
Arquitectura que sirve a múltiples clientes (tenants) desde una sola instancia de la aplicación, con aislamiento de datos.

### Diagrama

```mermaid
graph TB
    subgraph "Tenant Layer"
        T1[Tenant 1]
        T2[Tenant 2]
        T3[Tenant 3]
    end
    
    subgraph "API Gateway + Auth"
        APIGW[API Gateway]
        COGNITO[Cognito]
        TENANT_RESOLVER[Tenant Resolver]
    end
    
    subgraph "Application Layer"
        L1[Lambda - API]
        L2[Lambda - Processing]
    end
    
    subgraph "Data Layer - Isolation Strategies"
        DB1[(Shared DB - Tenant ID Column)]
        DB2[(Database per Tenant)]
        DB3[(Schema per Tenant)]
    end
    
    T1 --> APIGW
    T2 --> APIGW
    T3 --> APIGW
    APIGW --> COGNITO
    COGNITO --> TENANT_RESOLVER
    TENANT_RESOLVER --> L1
    L1 --> L2
    L2 --> DB1
    L2 --> DB2
    L2 --> DB3
```

### Tenant Resolver Lambda

```typescript
// lambda/tenant-resolver/handler.ts
export const handler = async (event: any) => {
  const claims = event.requestContext.authorizer.claims;
  const tenantId = claims['custom:tenantId'];
  
  return {
    statusCode: 200,
    headers: {
      'X-Tenant-ID': tenantId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tenantId }),
  };
};
```

### Pros y Contras

| Pros | Contras |
|---|---|
| Eficiencia de costos compartida | Complejidad de aislamiento |
| Escalabilidad centralizada | Riesgo de noisy neighbor |
| Mantenimiento simplificado | Diferentes requirements por tenant |
| Deploy统一 | Compliance challenges |

---

## 8. Multi-Region High Availability

### Descripción
Arquitectura desplegada en múltiples regiones para alta disponibilidad y baja latencia global.

### Diagrama

```mermaid
graph TB
    subgraph "Global"
        R53[Route 53 - DNS]
        CF[CloudFront - CDN]
    end
    
    subgraph "Region: us-east-1"
        ALB1[ALB]
        EC2_1[EC2 Auto Scaling]
        RDS1[RDS Primary]
        S3_1[S3]
    end
    
    subgraph "Region: eu-west-1"
        ALB2[ALB]
        EC2_2[EC2 Auto Scaling]
        RDS2[RDS Standby]
        S3_2[S3]
    end
    
    subgraph "Region: ap-southeast-1"
        ALB3[ALB]
        EC2_3[EC2 Auto Scaling]
        RDS3[RDS Read Replica]
        S3_3[S3]
    end
    
    R53 --> ALB1
    R53 --> ALB2
    R53 --> ALB3
    
    ALB1 --> EC2_1
    ALB2 --> EC2_2
    ALB3 --> EC2_3
    
    EC2_1 --> RDS1
    EC2_2 --> RDS2
    EC2_3 --> RDS3
    
    RDS1 --> |"Cross-Region Replication"| RDS2
    RDS1 --> |"Read Replica"| RDS3
    
    S3_1 --> |"Cross-Region Replication"| S3_2
    S3_1 --> |"Cross-Region Replication"| S3_3
```

### Route 53 Configuration

```typescript
import { HostedZone, RecordSet, RecordType, RoutingPolicy } from 'aws-cdk-lib/aws-route53';

// Latency-based routing
new RecordSet(this, 'MultiRegionRecord', {
  zone: hostedZone,
  recordName: 'api.miapp.com',
  recordType: RecordType.A,
  target: RecordTarget.fromAlias(new LoadBalancerTarget(alb1)),
  region: 'us-east-1',
  routingPolicy: RoutingPolicy.latency(),
});

// Failover routing
new RecordSet(this, 'PrimaryRecord', {
  zone: hostedZone,
  recordName: 'api.miapp.com',
  recordType: RecordType.A,
  target: RecordTarget.fromAlias(new LoadBalancerTarget(alb1)),
  failover: RecordFailover.PRIMARY,
});

new RecordSet(this, 'SecondaryRecord', {
  zone: hostedZone,
  recordName: 'api.miapp.com',
  recordType: RecordType.A,
  target: RecordTarget.fromAlias(new LoadBalancerTarget(alb2)),
  failover: RecordFailover.SECONDARY,
});
```

### Pros y Contras

| Pros | Contras |
|---|---|
| Alta disponibilidad (99.99%+) | Complejidad operacional alta |
| Baja latencia global | Costo significativamente mayor |
| Disaster recovery | Sincronización de datos compleja |
| Cumplimiento de data residency | Requiere expertise multi-region |

---

## 9. Disaster Recovery Patterns

### Diagrama Comparativo

```mermaid
graph TB
    subgraph "Backup/Restore"
        RPO1[RPO: Horas]
        RTO1[RTO: Horas]
        C1[Costo: Bajo]
    end
    
    subgraph "Pilot Light"
        RPO2[RPO: Minutos]
        RTO2[RTO: Minutos]
        C2[Costo: Medio]
    end
    
    subgraph "Warm Standby"
        RPO3[RPO: Segundos]
        RTO3[RTO: Minutos]
        C3[Costo: Alto]
    end
    
    subgraph "Active-Active"
        RPO4[RPO: 0]
        RTO4[RTO: 0]
        C4[Costo: Muy Alto]
    end
```

### Backup/Restore

```mermaid
graph LR
    PRIMARY[Primary Region] --> |"Backup"| S3_BACKUP[S3 Backup]
    S3_BACKUP --> |"Restore"| DR_REGION[DR Region]
    DR_REGION --> RDS_RESTORE[RDS Restored]
```

### Pilot Light

```mermaid
graph LR
    PRIMARY[Primary Region] --> |"Async Replication"| DR_RDS[DR RDS - Standby]
    DR_RDS --> |"Scale Up"| DR_EC2[DR EC2 - Stopped]
    DR_EC2 --> |"Start"| ACTIVE[Active DR]
```

### Warm Standby

```mermaid
graph LR
    PRIMARY[Primary Region] --> |"Multi-AZ"| DR_REGION[DR Region]
    DR_REGION --> |"Scaled Down"| SMALL_EC2[Small EC2 Fleet]
    SMALL_EC2 --> |"Scale Up"| FULL_EC2[Full EC2 Fleet]
```

### Active-Active

```mermaid
graph LR
    R53[Route 53] --> REGION1[Region 1 - Active]
    R53 --> REGION2[Region 2 - Active]
    REGION1 --> |"Sync"| REGION2
    REGION2 --> |"Sync"| REGION1
```

---

## 10. Cost-Optimized Architecture

### Diagrama

```mermaid
graph TB
    subgraph "Compute Optimization"
        EC2_SPOT[EC2 Spot Instances - 90% off]
        EC2_SAVINGS[EC2 Savings Plans - 40% off]
        LAMBDA[Lambda - Pay per use]
        FARGATE[Fargate - No server management]
    end
    
    subgraph "Storage Optimization"
        S3_IA[S3 Infrequent Access - 40% off]
        S3_GLACIER[S3 Glacier - 70% off]
        EBS_GP3[EBS gp3 - Most cost effective]
    end
    
    subgraph "Database Optimization"
        DDB_CAPACITY[DynamoDB On-Demand]
        AURORA_SERVERLESS[Aurora Serverless]
        RDS_SAVINGS[RDS Reserved Instances]
    end
    
    subgraph "Monitoring"
        COST_EXPLORER[Cost Explorer]
        BUDGETS[AWS Budgets]
        CUR[CUR - Cost Usage Report]
    end
```

---

## 11. AI/ML Architecture with SageMaker

### Diagrama

```mermaid
graph TB
    subgraph "Data Pipeline"
        S3_DATA[S3 - Data Lake]
        GLUE[Glue - ETL]
        KINESIS[Kinesis - Streaming Data]
    end
    
    subgraph "ML Pipeline"
        SAGEMAKER[SageMaker]
        TRAINING[Training Job]
        PIPELINE[SageMaker Pipeline]
        MONITORING[Model Monitor]
    end
    
    subgraph "Inference"
        ENDPOINT[Endpoint - Real-time]
        BATCH_TRANSFORM[Batch Transform]
        LAMBDA_INFERENCE[Lambda - API]
    end
    
    subgraph "Frontend"
        APIGW[API Gateway]
        APP[Application]
    end
    
    S3_DATA --> GLUE
    KINESIS --> GLUE
    GLUE --> SAGEMAKER
    SAGEMAKER --> TRAINING
    TRAINING --> PIPELINE
    PIPELINE --> ENDPOINT
    PIPELINE --> BATCH_TRANSFORM
    ENDPOINT --> LAMBDA_INFERENCE
    LAMBDA_INFERENCE --> APIGW
    APIGW --> APP
    SAGEMAKER --> MONITORING
```

---

## 12. Mobile Backend Architecture

### Diagrama

```mermaid
graph TB
    subgraph "Mobile Client"
        IOS[iOS App]
        ANDROID[Android App]
    end
    
    subgraph "Edge Layer"
        CF[CloudFront]
        APIGW[API Gateway]
    end
    
    subgraph "Auth"
        COGNITO[Cognito User Pool]
        COGNITO_IDENTITY[Cognito Identity Pool]
    end
    
    subgraph "Compute"
        LAMBDA[Lambda Functions]
        APPSYNC[AppSync - GraphQL]
    end
    
    subgraph "Data"
        DDB[DynamoDB]
        S3[S3 - Media]
        ELASTICSEARCH[OpenSearch]
    end
    
    subgraph "Offline Support"
        APOLLO[Apollo Cache]
    end
    
    IOS --> CF
    ANDROID --> CF
    CF --> APIGW
    CF --> APPSYNC
    
    APIGW --> COGNITO
    APPSYNC --> COGNITO
    
    APPSYNC --> LAMBDA
    APIGW --> LAMBDA
    
    LAMBDA --> DDB
    LAMBDA --> S3
    LAMBDA --> ELASTICSEARCH
    
    COGNITO --> COGNITO_IDENTITY
    COGNITO_IDENTITY --> S3
```

### Pros y Contras (Mobile Backend)

| Pros | Contras |
|---|---|
| GraphQL nativo (AppSync) | Complejidad de AppSync |
| Soporte offline integrado | Vendor lock-in |
| Sync automático | Learning curve alta |
| Escalabilidad automática | Costos de sync |
| Real-time subscriptions | Debugging difícil |

---

## Resumen Comparativo

| Patrón | Complejidad | Costo | Escalabilidad | Ideal Para |
|---|---|---|---|---|
| Web App Serverless | Baja | Bajo | Alta | MVPs, APIs |
| Traditional Web App | Media | Medio | Media | Apps legacy |
| Microservices | Alta | Medio-Alto | Muy Alta | Apps grandes |
| Serverless | Baja | Bajo | Infinita | Event-driven |
| Event-Driven | Media | Bajo-Medio | Alta | Desacoplamiento |
| CQRS | Alta | Medio | Muy Alta | Reads/Writes intensivos |
| Multi-Tenant SaaS | Alta | Bajo | Alta | SaaS products |
| Multi-Region | Muy Alta | Alto | Muy Alta | Global apps |
| Disaster Recovery | Media | Variable | Alta | Business continuity |
| AI/ML | Alta | Alto | Variable | ML workloads |
| Mobile Backend | Media | Bajo-Medio | Alta | Mobile apps |

---
