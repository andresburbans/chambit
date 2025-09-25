# Chambit PWA

## Descripción
Chambit es una Progressive Web App (PWA) que conecta a clientes con expertos locales para diversos servicios. Inspirada en plataformas como Indeed, permite a los usuarios buscar, ofertar y gestionar servicios de manera intuitiva, con una interfaz responsiva y moderna.

## Características Principales
- **PWA (Progressive Web App):** Instalable en dispositivos, funciona offline con service worker.
- **Autenticación de Usuarios:** Registro e inicio de sesión con email/contraseña o Google.
- **Gestión de Perfiles (CRUD):** Creación y edición de perfiles para clientes y expertos.
- **Búsqueda de Servicios:** Barra de búsqueda con autocompletado, filtros y visualización responsiva.
- **Flujo de Ofertas:** Clientes pueden ofertar por servicios con validaciones.
- **Dashboards:** Paneles diferenciados para clientes ("Mis Solicitudes") y expertos ("Mis Oportunidades").
- **UI/UX Responsiva:** Adaptable a móvil, tablet y escritorio con paleta de colores personalizada.

## Stack Tecnológico
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI.
- **Backend:** Firebase (Authentication, Firestore, Cloud Storage).
- **Formularios y Validación:** React Hook Form, Zod.
- **IA:** Genkit AI (para futuras integraciones).
- **Otros:** Lucide React (iconos), Date-fns (fechas), Embla Carousel (carruseles).

## Configuración del Entorno

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Firebase (para configuración de proyecto)

### Pasos para Clonar el Repositorio
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/chambit.git
   cd chambit
   ```

### Instalación de Dependencias
1. Instala las dependencias:
   ```bash
   npm install
   ```

### Configuración de Firebase
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilita Authentication (con proveedores de email/contraseña y Google).
3. Crea una base de datos Firestore.
4. Ve a Configuración del Proyecto > SDK de Firebase > Config y copia la configuración.
5. Crea un archivo `.env.local` en la raíz del proyecto y agrega las variables de entorno:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
   ```
   **Nota:** Nunca subas `.env.local` al repositorio; está en `.gitignore`.

## Cómo Ejecutar el Proyecto
1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La app estará disponible en `http://localhost:3000` (o el puerto configurado, ej. 9002 según `package.json`).

2. Para desarrollo con Genkit AI:
   ```bash
   npm run genkit:dev
   ```

3. Para build de producción:
   ```bash
   npm run build
   npm start
   ```

## Estructura de Carpetas
- `/src/app`: Rutas de Next.js (páginas y layouts).
- `/src/components`: Componentes reutilizables (UI, auth, services).
- `/src/lib`: Utilidades, tipos, configuración de Firebase, datos placeholder.
- `/src/hooks`: Hooks personalizados (ej. `use-mobile`).
- `/docs`: Documentación adicional (blueprint).
- `/public`: Archivos estáticos (favicon, imágenes).

Para más detalles técnicos, consulta `ARCHITECTURE.md`.
