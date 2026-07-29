---
title: Amazon EKS - Elastic Kubernetes Service
description: Guía completa de Amazon EKS: arquitectura, nodos, Managed Node Groups, Fargate Profiles, IAM Roles for Service Accounts, add-ons, kubectl, Helm y mejores prácticas.
---

# Amazon EKS - Elastic Kubernetes Service

## Tabla de contenidos

- [¿Qué es Amazon EKS?](#qué-es-amazon-eks)
- [Arquitectura de EKS](#arquitectura-de-eks)
- [Managed Node Groups vs Fargate Profiles](#managed-node-groups-vs-fargate-profiles)
- [Conceptos de Kubernetes](#conceptos-de-kubernetes)
- [IAM Roles for Service Accounts (IRSA)](#iam-roles-for-service-accounts-irsa)
- [EKS Add-ons](#eks-add-ons)
- [Cuándo usar EKS vs ECS](#cuándo-usar-eks-vs-ecs)
- [Consideraciones de costo](#consideraciones-de-costo)
- [kubectl y Helm](#kubectl-y-helm)
- [Mejores prácticas](#mejores-prácticas)
- [Errores comunes](#errores-comunes)
- [Ejemplos de código](#ejemplos-de-código)
- [Diagramas Mermaid](#diagramas-mermaid)
- [Preguntas frecuentes (FAQ)](#preguntas-frecuentes-faq)
- [Consejos para entrevistas](#consejos-para-entrevistas)
- [Resumen](#resumen)

---

## ¿Qué es Amazon EKS?

Amazon Elastic Kubernetes Service (EKS) es un servicio gestionado de Kubernetes que ejecuta clústeres de Kubernetes en la infraestructura de AWS sin necesidad de instalar, operar ni mantener tu propio plano de control de Kubernetes. Piensa en EKS como **Kubernetes sin los dolores de cabeza de administrarlo**: obtienes toda la potencia y flexibilidad de Kubernetes con la fiabilidad y escala de AWS.

Kubernetes es el orquestador de contenedores de código abierto más popular del mundo. EKS te permite ejecutar clústeres Kubernetes compatibles con upstream Kubernetes, lo que significa que tu conocimiento de Kubernetes, tus manifiestos YAML y tus herramientas (kubectl, Helm, Kustomize) funcionan exactamente igual.

### Características principales

| Característica | Descripción |
|----------------|-------------|
| **Gestionado** | AWS administra el plano de control de Kubernetes |
| **Compatible con upstream** | Versión actualizada de Kubernetes |
| **Multi-AZ** | Plano de control altamente disponible en 3 AZs |
| **Integración AWS** | IAM, VPC, ECR, CloudWatch, ALB/NLB |
| **Fargate** | Ejecutar pods sin gestionar nodos |
| **IRSA** | Permisos IAM granulares por service account |
| **EKS Anywhere** | Ejecutar EKS en tu propio data center |
| **EKS on Outposts** | EKS en infraestructura on-premises de AWS |

### Características del plano de control

| Componente | Descripción |
|------------|-------------|
| **API Server** | Endpoint para comunicarse con el clúster |
| **etcd** | Almacenamiento distribuido de estado |
| **Controller Manager** | Controla los loops de reconciliation |
| **Scheduler** | Planifica pods en nodos |
| **Cloud Controller Manager** | Integra con servicios AWS |

---

## Arquitectura de EKS

```mermaid
graph TB
    subgraph "AWS Cloud"
        subgraph "Plano de Control (AWS gestionado)"
            API[API Server]
            ETCD[(etcd)]
            CM[Controller Manager]
            SCH[Scheduler]
            CCM[Cloud Controller Manager]
        end
        
        subgraph "Plano de Datos"
            subgraph "Managed Node Group"
                N1[Nodo m5.xlarge]
                N2[Nodo m5.xlarge]
                N3[Nodo m5.xlarge]
            end
            
            subgraph "Fargate Profile"
                P1[Pod en Fargate]
                P2[Pod en Fargate]
            end
        end
        
        subgraph "Servicios AWS"
            ALB[ALB/NLB]
            ECR[ECR]
            EBS[EBS]
            CW[CloudWatch]
            IAM[IAM]
        end
    end
    
    K[kubectl / Helm] -->|HTTPS| API
    API --> ETCD
    API --> CM
    API --> SCH
    API --> CCM
    
    N1 --> API
    N2 --> API
    N3 --> API
    
    N1 --> ALB
    N1 --> ECR
    N2 --> ECR
    
    CCM --> ALB
    CCM --> EBS
    CCM --> IAM
```

### Arquitectura de red

```mermaid
graph TB
    subgraph "VPC 10.0.0.0/16"
        subgraph "Public Subnets (3 AZs)"
            ALB[ALB]
            NAT1[NAT Gateway AZ-a]
            NAT2[NAT Gateway AZ-b]
            NAT3[NAT Gateway AZ-c]
        end
        
        subgraph "Private Subnets - Node Group"
            N1[Nodo AZ-a]
            N2[Nodo AZ-b]
            N3[Nodo AZ-c]
        end
        
        subgraph "Private Subnets - Pods"
            POD1[Pod A]
            POD2[Pod B]
            POD3[Pod C]
        end
    end
    
    N1 --> POD1
    N1 --> POD2
    N2 --> POD3
    
    POD1 -->|via NAT| Internet
    ALB --> N1
    ALB --> N2
    ALB --> N3
```

---

## Managed Node Groups vs Fargate Profiles

| Característica | Managed Node Group | Fargate Profile |
|----------------|-------------------|-----------------|
| **Gestión de nodos** | AWS gestiona EC2 | AWS gestiona todo (serverless) |
| **Control de nodos** | SSH, AMI, instance type | Sin acceso SSH |
| **Escalado** | Cluster Autoscaler o Karpenter | Automático por pod |
| **Costo** | Pago por instancia EC2 | Pago por pod (vCPU + memoria/hora) |
| **Pod scheduling** | Kubernetes scheduler | AWS scheduler |
| **Persistent volumes** | EBS, EFS | Solo EFS |
| **GPU** | Sí (instancias P/G) | Sí (limitado) |
| **Spot Instances** | Soportado | Soportado (Fargate Spot) |
| **Cold start** | No | Posible (~30s) |
| **Ideal para** | Workloads estables, alta CPU | Workloads variables, batch |

### Managed Node Groups

```bash
# Crear Managed Node Group
aws eks create-nodegroup \
  --cluster-name mi-cluster \
  --nodegroup-name standard-workers \
  --node-role arn:aws:iam::123456789:role/eks-node-role \
  --instance-types m5.xlarge m5a.xlarge \
  --scaling-config minSize=2,maxSize=10,desiredSize=3 \
  --subnets subnet-abc subnet-def subnet-ghi \
  --ami-type AL2_x86_64 \
  --disk-size 100 \
  --labels env=production,team=backend \
  --tags Name=standard-workers,Environment=production
```

### Fargate Profiles

```bash
# Crear Fargate Profile
aws eks create-fargate-profile \
  --cluster-name mi-cluster \
  --fargate-profile-name serverless-workloads \
  --pod-execution-role-arn arn:aws:iam::123456789:role/eks-fargate-role \
  --subnets subnet-abc subnet-def \
  --selectors '[{
    "namespace": "serverless",
    "labels": {"compute": "fargate"}
  }]'
```

### Comparativa de configuración

| Aspecto | Managed Node Group | Fargate |
|---------|-------------------|---------|
| **Tamaño mínimo del pod** | 128 MB, 0.25 vCPU | 128 MB, 0.25 vCPU |
| **Tamaño máximo del pod** | Por instancia EC2 | 30 GB memoria, 4 vCPU |
| **Pods por nodo** | ~110 (depende de instancia) | 1 pod por Fargate task |
| **Init containers** | Soportado | Soportado |
| **DaemonSets** | Soportado | No soportado |
| **Host networking** | Soportado | No soportado |
| **Privileged mode** | Sí (si es necesario) | No |

---

## Conceptos de Kubernetes

### Pods

Un Pod es la unidad más pequeña desplegable en Kubernetes. Contiene uno o más contenedores que comparten red y almacenamiento.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mi-pod
  labels:
    app: mi-app
spec:
  containers:
    - name: app
      image: 123456789.dkr.ecr.us-east-1.amazonaws.com/mi-app:v1.0
      ports:
        - containerPort: 3000
      resources:
        requests:
          memory: "256Mi"
          cpu: "250m"
        limits:
          memory: "512Mi"
          cpu: "500m"
```

### Deployments

Un Deployment gestiona ReplicaSets y proporciona actualizaciones declarativas, rollback y auto-healing.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app-deployment
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mi-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: mi-app
    spec:
      containers:
        - name: app
          image: 123456789.dkr.ecr.us-east-1.amazonaws.com/mi-app:v1.2.0
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secrets
                  key: url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

### Services

Un Service expone un conjunto de pods como un servicio de red.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-app-service
  namespace: production
spec:
  selector:
    app: mi-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: mi-app-loadbalancer
  namespace: production
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internet-facing"
spec:
  type: LoadBalancer
  selector:
    app: mi-app
  ports:
    - protocol: TCP
      port: 443
      targetPort: 3000
```

### Ingress

Un Ingress gestiona el enrutamiento HTTP externo hacia services internos.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mi-app-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:123:certificate/abc
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS":443}]'
    alb.ingress.kubernetes.io/ssl-redirect: "443"
spec:
  rules:
    - host: api.midominio.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: mi-app-service
                port:
                  number: 80
```

### ConfigMaps y Secrets

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  API_URL: "https://api.midominio.com"
---
apiVersion: v1
kind: Secret
metadata:
  name: db-secrets
type: Opaque
data:
  url: cG9zdGdyZXNxbDovL3VzZXI6cGFzQGhvc3Q6NTQzMi9kYg==
  password: c2VjdXJlcGFzc3dvcmQ=
```

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mi-app-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mi-app-deployment
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 4
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
```

---

## IAM Roles for Service Accounts (IRSA)

IRSA permite asignar permisos IAM granulares a pods individuales en EKS, en lugar de permisos a nivel de nodo.

### Flujo de IRSA

```mermaid
sequenceDiagram
    participant Pod as Pod (service account)
    participant STS as AWS STS
    participant IAM as IAM Role
    participant AWS as Servicios AWS
    
    Pod->>STS: Solicita token (projected volume)
    STS->>STS: Valida OIDC provider + service account
    STS-->>Pod: Token temporal (15 min)
    Pod->>AWS: Usa token temporal
    AWS->>IAM: Valida permisos de la IAM Role
    IAM-->>AWS: Permisos concedidos
    AWS-->>Pod: Acceso autorizado
```

### Configurar IRSA

```bash
# 1. Crear OIDC Provider (una vez por clúster)
eksctl utils associate-iam-oidc-provider \
  --cluster mi-cluster \
  --approve

# 2. Crear IAM Role con política
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Federated": "arn:aws:iam::123456789:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/ABC123"},
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "oidc.eks.us-east-1.amazonaws.com/id/ABC123:sub": "system:serviceaccount:production:mi-app-sa",
        "oidc.eks.us-east-1.amazonaws.com/id/ABC123:aud": "sts.amazonaws.com"
      }
    }
  }]
}
EOF

aws iam create-role \
  --role-name eks-mi-app-role \
  --assume-role-policy-document file://trust-policy.json

# 3. Adjuntar política
aws iam attach-role-policy \
  --role-name eks-mi-app-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# 4. Anotar service account
kubectl annotate serviceaccount mi-app-sa \
  -n production \
  eks.amazonaws.com/role-arn=arn:aws:iam::123456789:role/eks-mi-app-role
```

### Ejemplo con eksctl (automático)

```yaml
# cluster.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: mi-cluster
  region: us-east-1
  version: "1.29"

iam:
  withOIDC: true
  serviceAccounts:
    - metadata:
        name: mi-app-sa
        namespace: production
      wellKnownPolicies:
        s3Read: true
    - metadata:
        name: external-dns-sa
        namespace: kube-system
      wellKnownPolicies:
        externalDNS: true

managedNodeGroups:
  - name: standard-workers
    instanceTypes:
      - m5.xlarge
    minSize: 2
    maxSize: 10
    desiredCapacity: 3
    privateNetworking: true
    labels:
      env: production
```

---

## EKS Add-ons

EKS Add-ons son componentes de software gestionados por AWS que facilitan la operación de clústeres.

### Add-ons disponibles

| Add-on | Descripción | Uso |
|--------|-------------|-----|
| **vpc-cni** | Plugin de red para IPs VPC nativas | Networking de pods |
| **coredns** | DNS para servicios | Service discovery |
| **kube-proxy** | Reglas de red en nodos | Networking |
| **ebs-csi-driver** | CSI driver para EBS | Persistent volumes |
| **efs-csi-driver** | CSI driver para EFS | Persistent volumes compartidos |
| **aws-load-balancer-controller** | Controlador ALB/NLB | Ingress y LoadBalancer |
| **external-dns** | DNS automático Route53 | DNS management |
| **cert-manager** | Gestión de certificados TLS | Certificados automático |
| **metrics-server** | Métricas de CPU/memoria | HPA |
| **cluster-autoscaler** | Escalado de nodos automático | Cost optimization |
| **karpenter** | Node provisioning inteligente | Escalado moderno |

### Instalar add-ons

```bash
# Instalar AWS Load Balancer Controller
eksctl create iamserviceaccount \
  --cluster mi-cluster \
  --namespace kube-system \
  --name aws-load-balancer-controller \
  --attach-policy-arn arn:aws:iam::aws:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve

helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  --namespace kube-system \
  --set clusterName=mi-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Instalar External DNS
eksctl create iamserviceaccount \
  --cluster mi-cluster \
  --namespace kube-system \
  --name external-dns \
  --attach-policy-arn arn:aws:iam::aws:policy/PolicyExternalDNS \
  --approve

helm install external-dns bitnami/external-dns \
  --namespace kube-system \
  --set provider=aws \
  --set policy=sync-only \
  --set sources[0]=ingress \
  --set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"=arn:aws:iam::123:role/external-dns-role

# Instalar Karpenter
helm install karpenter oci://public.ecr.aws/karpenter/karpenter \
  --namespace kube-system \
  --set settings.aws.clusterName=mi-cluster \
  --set settings.aws.clusterEndpoint=$(aws eks describe-cluster --name mi-cluster --query 'cluster.endpoint' --output text) \
  --set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"=arn:aws:iam::123:role/karpenter-role
```

### Karpenter NodePool

```yaml
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: default
spec:
  template:
    spec:
      requirements:
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["m", "c", "r"]
        - key: karpenter.k8s.aws/instance-generation
          operator: Gt
          values: ["2"]
      nodeClassRef:
        name: default
  limits:
    cpu: "100"
    memory: 400Gi
  disruption:
    consolidationPolicy: WhenEmpty
    consolidateAfter: 30s
---
apiVersion: karpenter.k8s.aws/v1beta1
kind: EC2NodeClass
metadata:
  name: default
spec:
  amiFamily: AL2
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: mi-cluster
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: mi-cluster
  role: KarpenterNodeRole-mi-cluster
```

---

## Cuándo usar EKS vs ECS

| Criterio | EKS | ECS |
|----------|-----|-----|
| **Conocimiento de Kubernetes** | Requerido | No necesario |
| **Multi-cloud** | Sí | No (solo AWS) |
| **Ecosistema de herramientas** | Extenso (Helm, Istio, ArgoCD) | Limitado a AWS |
| **Complejidad operativa** | Alta | Baja |
| **Costo de administración** | Alto | Bajo |
| **Flexibilidad de red** | Muy alta (CNI plugins) | Limitada |
| **Service mesh** | Istio, Linkerd, App Mesh | Service Connect |
| **GitOps** | ArgoCD, Flux | CodePipeline, GitHub Actions |
| **Políticas de red** | NetworkPolicies nativas | Limitadas |
| **Escalado de pods** | HPA, VPA, KEDA, Knative | ECS Auto Scaling |
| **Costo mensual típico** | ~$73 (control plane) + nodos | Solo nodos |
| **Caso de uso ideal** | Apps complejas, multi-cloud, equipo con K8s | Apps en AWS, simplicidad |

### Cuándo elegir EKS

- Tu equipo tiene experiencia con Kubernetes.
- Necesitas ejecutar en múltiples proveedores de nube.
- Requieres el ecosistema extenso de Kubernetes (Helm, Istio, ArgoCD).
- Necesitas políticas de red avanzadas (NetworkPolicies).
- Tienes workloads que requieren Knative, KEDA u otros operators de K8s.
- Necesitas EKS Anywhere para ejecutar en on-premises.

### Cuándo elegir ECS

- Tu aplicación es exclusivamente para AWS.
- Quieres minimizar la complejidad operativa.
- No tienes experiencia con Kubernetes.
- Prefieres una solución más simple y nativa de AWS.
- Tus necesidades de networking son estándar.

---

## Consideraciones de costo

### Costos de EKS

| Componente | Costo |
|------------|-------|
| **Control plane** | $0.10/hora (~$73/mes) |
| **Data processing** | $0.10 por GB (primeros 100 GB gratis) |
| **Nodos (EC2)** | Según tipo de instancia |
| **Fargate** | vCPU + memoria por hora |
| **ALB/NLB** | Según uso |
| **EBS/EFS** | Según uso |

### Estrategias de optimización de costos

| Estrategia | Ahorro |
|------------|--------|
| **Karpenter + Spot Instances** | 60-70% en nodos |
| **Right-sizing con VPA** | 20-30% |
| **Fargate para workloads variables** | 40-60% |
| **Cluster Autoscaler** | Evita nodos idle |
| **Graviton (ARM)** | 20% |
| **Reserved Instances** | 30-60% |
| **Consolidación de namespaces** | Menos overhead |

```bash
# Calcular costo estimado del clúster
# Nodos: 3 x m5.xlarge (4 vCPU, 16 GB) On-Demand
# 3 x $0.192/hora x 730h = $420.48/mes

# Con Spot (70% descuento):
# 3 x $0.058/hora x 730h = $126.14/mes

# Control plane: $73/mes

# Total On-Demand: ~$493/mes
# Total con Spot: ~$199/mes
```

---

## kubectl y Helm

### Configurar kubectl con EKS

```bash
# Configurar kubectl
aws eks update-kubeconfig --name mi-cluster --region us-east-1

# Verificar conexión
kubectl cluster-info
kubectl get nodes
kubectl get pods --all-namespaces

# Verificar versión de Kubernetes
kubectl version --short
```

### Comandos esenciales de kubectl

```bash
# Deployments
kubectl get deployments -n production
kubectl describe deployment mi-app -n production
kubectl rollout status deployment/mi-app -n production
kubectl rollout history deployment/mi-app -n production
kubectl rollout undo deployment/mi-app -n production
kubectl scale deployment mi-app --replicas=5 -n production

# Pods
kubectl get pods -n production -o wide
kubectl logs mi-app-xyz123 -n production
kubectl logs mi-app-xyz123 -n production -c sidecar
kubectl exec -it mi-app-xyz123 -n production -- /bin/sh

# Services
kubectl get svc -n production
kubectl get ingress -n production

# Secrets y ConfigMaps
kubectl get secrets -n production
kubectl create secret generic db-secrets --from-literal=url='postgres://...' -n production

# Debugging
kubectl get events -n production --sort-by='.lastTimestamp'
kubectl top pods -n production
kubectl top nodes
```

### Helm basics

```bash
# Agregar repositorios
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# Instalar chart
helm install mi-app bitnami/node -n production --create-namespace \
  --set image.repository=123456789.dkr.ecr.us-east-1.amazonaws.com/mi-app \
  --set image.tag=v1.2.0 \
  --set replicaCount=3 \
  --set resources.requests.memory=256Mi \
  --set resources.requests.cpu=250m

# Actualizar release
helm upgrade mi-app bitnami/node -n production \
  --set image.tag=v1.3.0

# Ver releases
helm list -n production
helm history mi-app -n production

# Rollback
helm rollback mi-app 1 -n production

# Desinstalar
helm uninstall mi-app -n production
```

### Helm Chart personalizado

```yaml
# Chart.yaml
apiVersion: v2
name: mi-app
description: Helm chart para mi aplicación
type: application
version: 0.1.0
appVersion: "1.0.0"

# values.yaml
replicaCount: 3

image:
  repository: 123456789.dkr.ecr.us-east-1.amazonaws.com/mi-app
  tag: "latest"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  className: alb
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
  hosts:
    - host: api.midominio.com
      paths:
        - path: /
          pathType: Prefix

resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70

# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mi-app.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "mi-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "mi-app.labels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: {{ .Values.service.targetPort }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
```

---

## Mejores prácticas

1. **Usa Managed Node Groups** para workloads estables y Fargate para variables.
2. **Implementa IRSA** en lugar de asignar permisos IAM a nivel de nodo.
3. **Instala Karpenter** para escalado de nodos moderno y eficiente.
4. **Usa Network Policies** para aislar tráfico entre namespaces.
5. **Habilita control plane logging** para auditoría y debugging.
6. **Usa Pod Disruption Budgets** para mantener disponibilidad durante mantenimiento.
7. **Implementa Resource Quotas** por namespace para evitar abuso de recursos.
8. **Configura liveness y readiness probes** en todos los deployments.
9. **Usa Helm o Kustomize** para gestión declarativa de configuración.
10. **Implementa GitOps** con ArgoCD o Flux para despliegues automatizados.

---

## Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| **unable to connect** | kubeconfig mal configurado | Ejecutar `aws eks update-kubeconfig` |
| **pending pods** | Nodos sin recursos suficientes | Escalar nodos o reducir requests |
| **ImagePullBackOff** | Imagen no accesible o credenciales | Verificar ECR permisos y Execution Role |
| **CrashLoopBackOff** | Error en la aplicación | Revisar logs con `kubectl logs` |
| **OOMKilled** | Memoria insuficiente | Aumentar limits en deployment |
| **Evicted** | Nodo bajo presión de disco/memoria | Ajustar resource requests/limits |
| **Service unreachable** | Network policy o selector incorrecto | Verificar labels y network policies |
| **IRSA not working** | OIDC provider no configurado o anotación incorrecta | Verificar OIDC y annotations |

---

## Ejemplos de código

### Ejemplo básico: Desplegar app con kubectl

```bash
#!/bin/bash
set -euo pipefail

CLUSTER="mi-cluster"
REGION="us-east-1"
APP="mi-app"
NAMESPACE="production"

# Configurar kubectl
aws eks update-kubeconfig --name "$CLUSTER" --region "$REGION"

# Crear namespace
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

# Crear secret
kubectl create secret generic db-secrets \
  --from-literal=url='postgres://user:pass@host:5432/db' \
  -n "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

# Crear deployment
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $APP
  namespace: $NAMESPACE
spec:
  replicas: 3
  selector:
    matchLabels:
      app: $APP
  template:
    metadata:
      labels:
        app: $APP
    spec:
      serviceAccountName: ${APP}-sa
      containers:
        - name: $APP
          image: 123456789.dkr.ecr.$REGION.amazonaws.com/$APP:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secrets
                  key: url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
EOF

# Crear service
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: $APP
  namespace: $NAMESPACE
spec:
  selector:
    app: $APP
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
EOF

# Crear ingress
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: $APP
  namespace: $NAMESPACE
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: $APP
                port:
                  number: 80
EOF

echo "App desplegada. Verificar con: kubectl get all -n $NAMESPACE"
```

### Ejemplo intermedio: Microservicios con Helm

```bash
#!/bin/bash
set -euo pipefail

# Crear estructura de Helm
mkdir -p mi-chart/templates
cd mi-chart

# Chart.yaml
cat > Chart.yaml << 'EOF'
apiVersion: v2
name: microservices
description: Arquitectura de microservicios en EKS
version: 1.0.0
appVersion: "1.0.0"
dependencies:
  - name: postgresql
    version: "13.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
EOF

# values.yaml
cat > values.yaml << 'EOF'
global:
  environment: production
  region: us-east-1

api:
  replicaCount: 3
  image:
    repository: 123456789.dkr.ecr.us-east-1.amazonaws.com/api-gateway
    tag: "latest"
  service:
    port: 80
    targetPort: 8080
  resources:
    requests:
      memory: "256Mi"
      cpu: "250m"
    limits:
      memory: "512Mi"
      cpu: "500m"
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 15
    targetCPU: 70

users:
  replicaCount: 2
  image:
    repository: 123456789.dkr.ecr.us-east-1.amazonaws.com/users-service
    tag: "latest"
  resources:
    requests:
      memory: "256Mi"
      cpu: "250m"

orders:
  replicaCount: 2
  image:
    repository: 123456789.dkr.ecr.us-east-1.amazonaws.com/orders-service
    tag: "latest"
  resources:
    requests:
      memory: "256Mi"
      cpu: "250m"

postgresql:
  enabled: true
  auth:
    existingSecret: db-secrets
EOF

# templates/_helpers.tpl
cat > templates/_helpers.tpl << 'EOF'
{{- define "microservices.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "microservices.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "microservices.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
environment: {{ .Values.global.environment }}
{{- end }}

{{- define "microservices.selectorLabels" -}}
app.kubernetes.io/name: {{ include "microservices.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
EOF

# templates/api-deployment.yaml
cat > templates/api-deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  labels:
    {{- include "microservices.labels" . | nindent 4 }}
    component: api-gateway
spec:
  replicas: {{ .Values.api.replicaCount }}
  selector:
    matchLabels:
      component: api-gateway
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        component: api-gateway
    spec:
      containers:
        - name: api
          image: "{{ .Values.api.image.repository }}:{{ .Values.api.image.tag }}"
          ports:
            - containerPort: {{ .Values.api.service.targetPort }}
          resources:
            {{- toYaml .Values.api.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /health
              port: {{ .Values.api.service.targetPort }}
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: {{ .Values.api.service.targetPort }}
            initialDelaySeconds: 5
            periodSeconds: 5
EOF

# templates/ingress.yaml
cat > templates/ingress.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: microservices
  labels:
    {{- include "microservices.labels" . | nindent 4 }}
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:123:certificate/abc
spec:
  rules:
    - host: api.midominio.com
      http:
        paths:
          - path: /api/users
            pathType: Prefix
            backend:
              service:
                name: users-service
                port:
                  number: {{ .Values.users.service.port | default 80 }}
          - path: /api/orders
            pathType: Prefix
            backend:
              service:
                name: orders-service
                port:
                  number: {{ .Values.orders.service.port | default 80 }}
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-gateway
                port:
                  number: {{ .Values.api.service.port }}
EOF

# Instalar
helm install mi-cluster . \
  --namespace production \
  --create-namespace \
  --values values.yaml

# Verificar
helm list -n production
kubectl get all -n production
```

### Ejemplo profesional: Cluster completo con eksctl

```yaml
# cluster-production.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: production-cluster
  region: us-east-1
  version: "1.29"
  tags:
    Environment: production
    ManagedBy: eksctl

availabilityZones:
  - us-east-1a
  - us-east-1b
  - us-east-1c

iam:
  withOIDC: true
  serviceAccounts:
    - metadata:
        name: aws-load-balancer-controller
        namespace: kube-system
      wellKnownPolicies:
        awsLoadBalancerController: true
    - metadata:
        name: external-dns
        namespace: kube-system
      wellKnownPolicies:
        externalDNS: true
    - metadata:
        name: ebs-csi-controller-sa
        namespace: kube-system
      wellKnownPolicies:
        ebsCSIController: true
    - metadata:
        name: app-sa
        namespace: production
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
        - arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess

vpc:
  cidr: 10.0.0.0/16
  nat:
    gateway: HighlyAvailable
  clusterEndpoints:
    publicAccess: true
    privateAccess: true

managedNodeGroups:
  - name: system
    instanceTypes:
      - m5.large
    minSize: 2
    maxSize: 5
    desiredCapacity: 3
    labels:
      role: system
    privateNetworking: true
    volumeSize: 100
    volumeType: gp3

  - name: application
    instanceTypes:
      - m5.xlarge
      - m5a.xlarge
      - m6i.xlarge
    minSize: 3
    maxSize: 20
    desiredCapacity: 5
    labels:
      role: application
    taints:
      - key: workload
        value: application
        effect: NoSchedule
    privateNetworking: true
    volumeSize: 100
    volumeType: gp3
    tags:
      Environment: production
    iam:
      withAddonPolicies:
        autoScaler: true
        ebs: true
        efs: true

  - name: spot-workers
    instanceTypes:
      - m5.xlarge
      - m5a.xlarge
      - m5d.xlarge
      - c5.xlarge
      - c5a.xlarge
    minSize: 0
    maxSize: 30
    desiredCapacity: 5
    labels:
      role: spot-workers
      lifecycle: spot
    taints:
      - key: lifecycle
        value: spot
        effect: NoSchedule
    spot: true
    privateNetworking: true
    volumeSize: 100
    volumeType: gp3

fargateProfiles:
  - name: serverless
    selectors:
      - namespace: serverless
      - namespace: kube-system
        labels:
          k8s-app: coredns
    tags:
      Environment: production

cloudWatch:
  clusterLogging:
    enableTypes:
      - api
      - audit
      - authenticator
      - controllerManager
      - scheduler
    logRetentionInDays: 30

addons:
  - name: vpc-cni
    version: latest
    attachPolicyARNs:
      - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
  - name: coredns
    version: latest
  - name: kube-proxy
    version: latest
  - name: aws-ebs-csi-driver
    version: latest
    wellKnownPolicies:
      ebsCSIController: true
```

---

## Diagramas Mermaid

### Arquitectura de EKS completa

```mermaid
graph TB
    subgraph "Internet"
        U[Usuarios]
        DEV[Desarrolladores]
    end
    
    subgraph "AWS Cloud"
        subgraph "Control Plane (AWS gestionado)"
            API[API Server]
            ETCD[(etcd)]
            SCH[Scheduler]
        end
        
        subgraph "Data Plane"
            subgraph "Managed Node Group - System"
                N1[Nodo system-1]
                N2[Nodo system-2]
            end
            
            subgraph "Managed Node Group - App"
                N3[Nodo app-1]
                N4[Nodo app-2]
                N5[Nodo app-3]
            end
            
            subgraph "Fargate"
                P1[Pod batch]
                P2[Pod cronjob]
            end
        end
        
        subgraph "Servicios AWS"
            ALB[ALB/NLB]
            ECR[ECR]
            RDS[(RDS)]
            S3[S3]
            CW[CloudWatch]
        end
    end
    
    U --> ALB
    ALB --> N3
    ALB --> N4
    ALB --> N5
    DEV -->|kubectl| API
    API --> ETCD
    API --> SCH
    N3 --> RDS
    N4 --> RDS
    N3 --> S3
    N5 --> ECR
    N1 --> CW
    N2 --> CW
```

### Ciclo de vida de un pod

```mermaid
stateDiagram-v2
    [*] --> Pending: kubectl apply
    Pending --> Pending: Esperando scheduling
    Pending --> ContainerCreating: Nodo asignado
    ContainerCreating --> Running: Contenedor listo
    Running --> Succeeded: Job completado
    Running --> Failed: Error
    Running --> Terminated: kubectl delete
    Failed --> Pending: Reintento
    Succeeded --> [*]
    Terminated --> [*]
```

### Despliegue con Helm + ArgoCD

```mermaid
sequenceDiagram
    participant D as Developer
    participant GH as GitHub
    participant AC as ArgoCD
    participant EKS as EKS Cluster
    participant ALB as ALB
    
    D->>GH: git push (Helm values actualizado)
    GH->>AC: Webhook: cambios detectados
    AC->>AC: Sync: comparar desired vs actual
    AC->>EKS: kubectl apply manifiestos
    EKS->>EKS: Actualizar pods (Rolling Update)
    EKS->>ALB: Health check OK
    AC-->>D: Deploy completado
```

### IRSA (IAM Roles for Service Accounts)

```mermaid
graph TB
    subgraph "EKS Cluster"
        SA[Service Account: mi-app-sa]
        POD[Pod: mi-app]
    end
    
    subgraph "AWS IAM"
        OIDC[OIDC Provider]
        ROLE[IAM Role: mi-app-role]
        POLICY[IAM Policy: S3 ReadOnly]
    end
    
    subgraph "Servicios AWS"
        S3[S3 Bucket]
    end
    
    POD --> SA
    SA -->|token projection| OIDC
    OIDC -->|valida SA + namespace| ROLE
    ROLE --> POLICY
    POD -->|token temporal| S3
    S3 -->|acceso permitido| POD
```

---

## Preguntas frecuentes (FAQ)

**¿Cuánto cuesta EKS?**
El plano de control cuesta $0.10/hora (~$73/mes). Los nodos se cobran según el tipo de instancia EC2. Fargate se cobra por vCPU/hora + memoria/hora.

**¿Cuándo usar EKS vs ECS?**
EKS cuando necesitas Kubernetes (multi-cloud, ecosistema extenso, equipo con experiencia K8s). ECS cuando tu app es para AWS y quieres simplicidad.

**¿Puedo migrar de ECS a EKS?**
Sí, pero requiere reescribir Task Definitions como Deployments de Kubernetes. No hay migración directa. Planifica la transición cuidadosamente.

**¿Qué es IRSA y por qué es importante?**
IRSA (IAM Roles for Service Accounts) permite asignar permisos IAM granulares a pods específicos, en lugar de permisos compartidos a nivel de nodo. Mejora significativamente la seguridad.

**¿Puedo ejecutar GPUs en EKS?**
Sí, usando instancias EC2 con GPU (P3, P4, G4, G5) en Managed Node Groups. También hay soporte limitado de GPU en Fargate desde 2023.

**¿Cómo actualizo la versión de Kubernetes en EKS?**
AWS soporta actualizaciones de versión menor (1.28 a 1.29) con un proceso gestionado desde la consola o CLI. Las actualizaciones de versión mayor requieren migración del clúster.

**¿Qué es Karpenter?**
Karpenter es un provisionador de nodos inteligente para Kubernetes que reemplaza al Cluster Autoscaler. Crea nodos automáticamente según las necesidades de los pods, con soporte nativo para Spot Instances y right-sizing.

**¿Puedo usar Istio en EKS?**
Sí, Istio funciona perfectamente en EKS. AWS también ofrece App Mesh como service mesh nativo, pero Istio es más popular y tiene más features.

---

## Consejos para entrevistas

1. **Explica EKS con la analogía**: "EKS es Kubernetes gestionado por AWS, como tener un equipo de operaciones 24/7 para tu clúster".
2. **Diferencia EKS vs ECS**: EKS = Kubernetes completo, más complejo pero más flexible. ECS = más simple pero limitado a AWS.
3. **Conoce IRSA**: Es la forma segura de dar permisos IAM a pods. Elimina la necesidad de permisos compartidos a nivel de nodo.
4. **Entiende Managed Node Groups vs Fargate**: Managed = tú controlas EC2. Fargate = serverless. Cada uno tiene sus trade-offs.
5. **Conoce Karpenter**: Es el futuro del escalado de nodos en EKS. Más inteligente que Cluster Autoscaler.
6. **Menciona Pod Disruption Budgets**: Garantizan disponibilidad durante mantenimiento de nodos.
7. **Habla de Network Policies**: Aíslan tráfico entre pods, algo que ECS no soporta nativamente.
8. **Entiende el costo**: $73/mes por el control plane + costo de nodos. Es más caro que ECS pero más flexible.
9. **Conoce Helm**: Es el gestor de paquetes de Kubernetes, esencial para managing deployments complejos.
10. **Menciona GitOps**: ArgoCD o Flux para despliegues declarativos y auditables.

---

## Resumen

Amazon EKS es el servicio gestionado de Kubernetes de AWS que ejecuta clústeres de Kubernetes altamente disponibles con plano de control gestionado por AWS. Ofrece Managed Node Groups (EC2 gestionado), Fargate Profiles (serverless), y la posibilidad de ejecutar en on-premises con EKS Anywhere.

Los conceptos clave de Kubernetes incluyen Pods (unidad mínima), Deployments (gestión de réplicas), Services (exposición de red), Ingress (enrutamiento HTTP), y HPA (escalado automático). IRSA permite asignar permisos IAM granulares a pods individuales de forma segura.

EKS cuesta $73/mes por el control plane, más el costo de los nodos. La optimización de costos se logra con Karpenter + Spot Instances (60-70% de ahorro), right-sizing con VPA, y Fargate para workloads variables.

EKS brilla en arquitecturas complejas multi-cloud, cuando necesitas el ecosistema extenso de Kubernetes (Helm, Istio, ArgoCD), o cuando tu equipo ya tiene experiencia con K8s. Para aplicaciones más simples exclusivamente en AWS, ECS es la opción más rápida y simple de implementar.
