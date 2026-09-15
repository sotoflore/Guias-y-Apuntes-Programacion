# IA generativa en AWS

La **Inteligencia Artificial** generativa (IA generativa) es una rama de la inteligencia artificial capaz de crear contenido nuevo a partir de instrucciones o datos proporcionados por el usuario. Puede generar texto, imágenes, código, audio y otros tipos de contenido. A diferencia de los sistemas tradicionales de IA, que suelen centrarse en clasificar, predecir o detectar patrones, la IA generativa puede producir contenido original y mantener conversaciones utilizando lenguaje natural.

En **Amazon Web Services** (AWS), la IA generativa se integra con los servicios de computación, almacenamiento, bases de datos y seguridad de la nube para permitir que las organizaciones desarrollen aplicaciones inteligentes sin tener que construir y administrar toda la infraestructura de IA desde cero.

## 1. Conceptos clave

### 1.1 Aprendizaje profundo
El **aprendizaje profundo** (Deep Learning - DL) es un subconjunto del machine learning en el que los modelos se entrenan mediante capas de neuronas artificiales que imitan el cerebro humano. Cada una de las capas de estas redes neuronales resume y envía información a la capa siguiente hasta que se produce un modelo final.

![Aprendizaje profundo](/aws/ia-ml/ia-generativa-aws-aprendizaje-profundo.png)

### 1.2 IA generativa
La **IA generativa** es un tipo de aprendizaje profundo impulsado por modelos de ML extremadamente grandes, conocidos como **modelos fundacionales** (FM). Los FM reciben entrenamiento previo con vastas colecciones de datos. Si bien los modelos de ML tradicionales se entrenan para realizar tareas particulares, los FM se pueden adaptar para realizar múltiples tareas.

Los modelos de lenguaje de gran tamaño (LLM) son un tipo popular de FM entrenado para utilizar el lenguaje humano. Los modelos fundacionales también se pueden utilizar para crear videos, imágenes, música y mucho más.

![IA generativa](/aws/ia-ml/ia-generativa-intro.png)

### 1.3 IA generativa en AWS
AWS ofrece los siguientes tipos de soluciones de IA generativa:

- **Amazon SageMaker JumpStart**: un centro de ML con FM y soluciones de ML prediseñadas que se pueden implementar con unos pocos clics.

- **Amazon Bedrock**: un servicio completamente administrado que se utiliza para adaptar e implementar FM de Amazon y otras empresas líderes de IA.

- **Amazon Q**: un asistente de IA interactivo que se puede integrar en los repositorios de información de una empresa.

![IA generativa en aws](/aws/ia-ml/ia-generativa-aws-intro.png)

## 2. Soluciones de IA generativa de AWS

Analicemos con más detalle algunas de las soluciones de IA generativa de AWS. Esto incluye el uso de **Amazon SageMaker JumpStart** para acelerar el desarrollo de modelos y **Amazon Bedrock** para implementar FM de alto rendimiento a través de una única API. **Amazon Q** se integra a sus repositorios de información existentes para responder preguntas y ayudar a generar información y contenido nuevo.

### 2.1 Amazon SageMaker JumpStart

![Amazon SageMaker JumpStart](/icons/amazon-sageMaker.svg)

**SageMaker JumpStart** es un centro de machine learning dentro de la IA de SageMaker que acelera el proceso de creación, entrenamiento e implementación de modelos de ML. SageMaker JumpStart ofrece una biblioteca de soluciones de ML prediseñadas en varios dominios, como la visión artificial, el NLP y los datos tabulares. Estos modelos previamente entrenados se pueden ajustar para adaptarse a sus necesidades específicas y se pueden implementar con solo unos pocos clics.

#### 2.1.1 Casos de uso comunes

- **Implementaciones rápidas de modelos de ML**. Implemente modelos previamente entrenados de forma rápida sin necesidad de ser un experto en ML.

- **Soluciones personalizadas y ajustadas**. Ajuste los FM previamente entrenados con los datos específicos de su dominio.

- **Experimentos y prototipos de ML**. Compare el rendimiento de diferentes modelos antes de comprometerse con un enfoque específico.

### 2.2 Amazon Bedrock

![Amazon Bedrock](/icons/amazon-bedrock.svg)

**Amazon Bedrock** es un servicio completamente administrado que se diseñó específicamente para trabajar con modelos fundacionales de gran tamaño y crear aplicaciones de IA generativa. Proporciona acceso a los FM de Amazon y de las principales startups de IA, como **Claude** y **Stable Diffusion**, todo a través de una **API unificada**. Con Amazon Bedrock, puede experimentar rápidamente con FM, ajustarlos con sus propios datos e integrarlos sin problemas en sus aplicaciones de AWS.

#### 2.2.1 Casos de uso comunes

- **IA generativa de nivel empresarial**. Cree aplicaciones de IA generativa listas para la producción con una seguridad, privacidad y escalabilidad de nivel empresarial.

- **Generación de contenido multimodal**. Cree aplicaciones que puedan generar varios tipos de contenido, como textos e imágenes.

- **IA conversacional avanzada**. Desarrolle agentes conversacionales avanzados que se conecten a los datos de su empresa para dar respuestas precisas.

### 2.3 Amazon Q

![Amazon Q](/icons/amazon-q.svg)

**Amazon Q** es un asistente de IA generativa que puede ayudar a las empresas a optimizar sus procesos, tomar decisiones con mayor rapidez y mejorar la productividad de sus empleados. Puede ayudar a todos los empleados a obtener información acerca de sus datos y acelerar sus tareas.

Se compone de los siguientes dos productos.

#### 2.3.1 Amazon Q Business

**Amazon Q Business** puede responder a preguntas urgentes, ayudar a resolver problemas y realizar acciones con los datos y la experiencia que se encuentran en los repositorios de información de su empresa. Amazon Q Business ofrece esta asistencia personalizada con una conexión segura a los sistemas más utilizados.

**Casos de uso**: solicitudes de información, flujos de trabajo automatizados y extracción de información

#### 2.3.2 Amazon Q Developer

**Amazon Q Developer** ofrece recomendaciones de código a fin de acelerar el desarrollo de aplicaciones de lenguajes de codificación, entre los que se incluyen C#, Java, JavaScript, Python y TypeScript. Se integra con varios IDE y ayuda a los desarrolladores a escribir código de forma más rápida al generar funciones completas y bloques de código lógicos.

**Casos de uso**: generación de código más rápida, fiabilidad y seguridad mejoradas y revisiones de código automatizadas.

---

**Referencias recomendadas**:

- [Amazon SageMaker JumpStart](https://aws.amazon.com/sagemaker/jumpstart/)
- [Amazon Bedrock](https://aws.amazon.com/bedrock/)
- [Amazon Q Business](https://aws.amazon.com/q/business/)
- [Amazon Q Developer](https://aws.amazon.com/q/developer/)