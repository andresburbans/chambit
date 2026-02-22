# Chambit | Si hay chamba, hay Chambit. 

Chambit es una app web (PWA) que conecta personas con expertos locales para resolver necesidades reales de forma rápida, cercana y con contexto territorial.

## 🚀 ¿Qué problema resuelve?
En muchos barrios y ciudades hay talento disponible, pero encontrar a la persona correcta suele ser lento, informal y poco transparente.

Chambit reduce esa fricción con:
- Búsqueda por servicio y ubicación.
- Flujo de solicitud/oferta entre cliente y experto.
- Paneles para seguimiento de oportunidades.
- Experiencia mobile-first, instalable como PWA.

## 🌐 Puesdes ver la app funcional aqui!
Para ver la web app funcionando en entorno real:

[👉 Abrir Chambit en producción](PEGAR_AQUI_LINK_FIREBASE_HOSTING)

## 🏗️ Stack tecnológico
- Next.js 15 + React 18 + TypeScript
- Firebase (Auth, Firestore, Storage y Functions)
- Lógica SIG con indexación hexagonal y contexto geoespacial
- PWA (instalable, orientada a mobile)
- Python para experimentación analítica y validación de modelos

## 🧪 Ejecución local
```bash
npm install
npm run dev
```

## 🧠 Novedad: Motor de búsqueda de alfanumérico a geo-contextual
Chambit propone un motor que no se limita a comparar texto. En lugar de devolver resultados solo por coincidencia de palabras, estima **relevancia territorial + intención + probabilidad de éxito**.

### 1) Abstracción espacial con hexágonos (SIG)
El territorio se discretiza en celdas hexagonales para medir vecindad real con menos sesgo direccional:

$$
h = \mathcal{H}(\text{lat}, \text{lon}, r)
$$

donde $\mathcal{H}$ es el indexador espacial y $r$ la resolución. Sobre cada celda se construyen señales locales (densidad, oferta activa, histórico de respuesta, etc.).

Una señal típica de cercanía puede modelarse con decaimiento exponencial:

$$
K(d)=e^{-d/\tau}
$$

con $d$ distancia efectiva y $\tau$ escala territorial.

### 2) Principio bayesiano para confianza contextual
La probabilidad de que un experto $E$ sea adecuado para una solicitud $q$ en un contexto $c$ puede expresarse como:

$$
P(E\mid q,c)=\frac{P(q,c\mid E)\,P(E)}{P(q,c)}
$$

Esto permite combinar evidencia previa (histórico, reputación, cumplimiento) con evidencia nueva (contexto actual).

### 3) ML y DL para Learning to Rank (LRT)
Con features semánticas, geoespaciales y de comportamiento, un modelo aprende una función de ranking:

$$
\hat{y}=f_{\theta}(x)
$$

Para entrenamiento por pares (pairwise ranking), una forma común de pérdida es:

$$
\mathcal{L}=\sum_{(i,j)} \log\left(1+e^{-(\hat{y}_i-\hat{y}_j)}\right)
$$

El objetivo es que los resultados más útiles para el usuario queden arriba de forma consistente.

### 4) Fusión heurística final
El score final combina componentes interpretable + aprendizaje:

$$
S=\alpha\,K(d)+\beta\,P(E\mid q,c)+\gamma\,f_{\theta}(x)+\delta\,A
$$

con:

$$
\alpha+\beta+\gamma+\delta=1
$$

Aquí $A$ representa ajustes de negocio/experiencia (disponibilidad, latencia de respuesta, estado operativo). Resultado: un ranking más humano, territorial y accionable.


## 💛 Agradecimiento al reto Platzi
Este proyecto fue impulsado por el Reto Developer Foundations de Platzi. Su enfoque educativo y el ritmo del reto me dieron la valentía para transformar una tesis con código desordenado y baja motivación en un camino claro, intenso y emocionante. Lo que estuvo estancado por meses avanzó en una semana de esfuerzo profundo con resultados gratificantes. Verlo hecho realidad ha sido una experiencia muy especial.

## 👨‍💻 Autor
**Andrés Burbano**  
> **Lema:** "Disfruto soñar, amor crear."
Cali, Colombia

- Email: `Burbano.hub@gmail.com`
- Instagram: https://www.instagram.com/burbano_va/
- LinkedIn: https://www.linkedin.com/in/andresbusu/
- GitHub: https://github.com/andresburbans

## 📝 Nota
Por razones de investigación aplicada y protección de la lógica de negocio, este repositorio expone el frontend y el código necesario para comprender la propuesta del proyecto.
