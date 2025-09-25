# Plan de Pruebas para Chambit PWA

## 1. Resumen del Proyecto y Contexto
**Nombre del Proyecto:** Chambit  
**Contexto:** PWA de mercado de servicios locales construida con Next.js, TypeScript y Firebase. Incluye funcionalidades de autenticación, gestión de perfiles, búsqueda de servicios, ofertas y dashboards para clientes y expertos.

**Objetivo del Plan de Pruebas:** Validar la funcionalidad, UI/UX, integración con Firebase y responsividad de la aplicación.

## 2. Documentación de Pruebas (Testing)

### 2.1. Estrategia de Pruebas
La estrategia de pruebas se enfoca en cuatro áreas clave para asegurar la calidad del frontend y la integración con Firebase:

- **Pruebas Unitarias:** Se deben crear para componentes individuales (ej. `ServiceCard`, `AuthForm`) y funciones de utilidad (ej. validaciones con Zod, helpers en `utils.ts`). Usar Jest y React Testing Library para simular renders y eventos.
- **Pruebas de Integración:** Validar la interacción entre componentes del frontend y servicios de Firebase (ej. formulario de perfil escribiendo en Firestore, autenticación actualizando el estado global).
- **Pruebas de Extremo a Extremo (E2E):** Simular flujos completos de usuario usando Playwright o Cypress, cubriendo desde login hasta envío de ofertas.
- **Pruebas de UI y Responsividad:** Verificar consistencia visual con Storybook o herramientas como Chromatic, y adaptabilidad a diferentes tamaños de pantalla usando media queries y breakpoints.

Herramientas recomendadas: Jest para unitarias, Playwright para E2E, y Lighthouse para performance/responsividad.

### 2.2. Casos de Prueba Detallados

#### Funcionalidad 1: Autenticación de Usuarios

| ID del Caso | Funcionalidad | Escenario de Prueba | Pasos a Seguir | Resultado Esperado |
|-------------|---------------|---------------------|---------------|-------------------|
| TC-AUTH-01 | Registro de Usuario | Registro de un nuevo usuario cliente con correo y contraseña válidos | 1. Navegar a /register. 2. Ingresar nombre, email válido, contraseña. 3. Seleccionar rol 'cliente'. 4. Hacer clic en 'Registrar'. | Usuario registrado, redirigido a dashboard, perfil creado en Firebase. |
| TC-AUTH-02 | Registro de Usuario | Intento de registro con un correo ya existente | 1. Intentar registrar con email ya usado. 2. Enviar formulario. | Error mostrado: "Email ya registrado". |
| TC-AUTH-03 | Inicio de Sesión | Inicio de sesión con credenciales válidas | 1. Navegar a /login. 2. Ingresar email y contraseña correctos. 3. Hacer clic en 'Iniciar Sesión'. | Usuario logueado, redirigido a dashboard según rol. |
| TC-AUTH-04 | Inicio de Sesión | Inicio de sesión con contraseña incorrecta | 1. Ingresar email correcto y contraseña errónea. 2. Enviar. | Error: "Credenciales inválidas". |
| TC-AUTH-05 | Inicio de Sesión | Flujo de inicio de sesión con Google | 1. Hacer clic en 'Continuar con Google'. 2. Autorizar en popup. | Usuario logueado con datos de Google, perfil actualizado. |
| TC-AUTH-06 | Cierre de Sesión | Cierre de sesión y redirección | 1. Hacer clic en logout en header. | Usuario deslogueado, redirigido a /. |

#### Funcionalidad 2: Gestión de Perfiles (CRUD)

| ID del Caso | Funcionalidad | Escenario de Prueba | Pasos a Seguir | Resultado Esperado |
|-------------|---------------|---------------------|---------------|-------------------|
| TC-PROF-01 | Perfil de Usuario | Un usuario cliente completa su perfil por primera vez | 1. Loguearse como cliente nuevo. 2. Completar campos en /profile. 3. Guardar. | Perfil guardado en Firestore, popup de "Conviértete en experto" mostrado. |
| TC-PROF-02 | Perfil de Usuario | Un usuario actualiza información de perfil | 1. Editar teléfono en perfil. 2. Guardar cambios. | Datos actualizados en UI y Firestore. |
| TC-PROF-03 | Perfil de Usuario | Visualización del popup "Conviértete en experto" en primer login | 1. Login como cliente nuevo. | Popup aparece automáticamente. |
| TC-PROF-04 | Conversión a Experto | Flujo para convertirse en experto | 1. Clic en popup. 2. Completar formulario multi-paso. 3. Enviar. | Rol cambiado a 'experto', servicios creados. |
| TC-PROF-05 | Creación de Servicio | Validación de precios en formulario | 1. Ingresar precio < mínimo. 2. Intentar guardar. | Error de validación mostrado. |
| TC-PROF-06 | Edición de Servicio | Un experto edita un servicio existente | 1. Ir a /dashboard. 2. Editar servicio. 3. Guardar. | Servicio actualizado en Firestore y UI. |

#### Funcionalidad 3: Búsqueda y Visualización de Resultados

| ID del Caso | Funcionalidad | Escenario de Prueba | Pasos a Seguir | Resultado Esperado |
|-------------|---------------|---------------------|---------------|-------------------|
| TC-SEARCH-01 | Búsqueda | Funcionalidad de autocompletado | 1. Escribir en barra de búsqueda. | Sugerencias aparecen dinámicamente. |
| TC-SEARCH-02 | Búsqueda | Ejecución de búsqueda y lista de tarjetas | 1. Buscar término. 2. Ver resultados. | Lista de tarjetas mostrada correctamente. |
| TC-SEARCH-03 | Búsqueda | Scroll infinito en resultados | 1. Scroll al final de lista. | Más resultados cargados automáticamente. |
| TC-SEARCH-04 | Interacción | Tarjeta en escritorio | 1. Clic en tarjeta. | Panel derecho actualizado con detalles. |
| TC-SEARCH-05 | Interacción | Tarjeta en móvil | 1. Clic en tarjeta. | Modal bottom-sheet desplegado. |
| TC-SEARCH-06 | Interacción | Cierre de modal | 1. Clic en X o fondo. | Modal cerrado, vuelta a lista. |

#### Funcionalidad 4: Flujo de Oferta (UI y Validación)

| ID del Caso | Funcionalidad | Escenario de Prueba | Pasos a Seguir | Resultado Esperado |
|-------------|---------------|---------------------|---------------|-------------------|
| TC-OFFER-01 | Oferta | Clic en "Ofertar" | 1. Ver detalles de servicio. 2. Clic "Ofertar". | Formulario de oferta mostrado. |
| TC-OFFER-02 | Oferta | Validación de precio | 1. Ingresar precio < 80% del base. 2. Enviar. | Error: "Precio demasiado bajo". |
| TC-OFFER-03 | Oferta | Envío de oferta | 1. Completar y enviar oferta. | Solicitud en dashboard cliente con estado "pendiente". |

#### Funcionalidad 5: Dashboards de Usuario y Roles

| ID del Caso | Funcionalidad | Escenario de Prueba | Pasos a Seguir | Resultado Esperado |
|-------------|---------------|---------------------|---------------|-------------------|
| TC-DASH-01 | Dashboard | Cliente ve "Mis Solicitudes" | 1. Login como cliente. 2. Ir a /dashboard. | Pestaña "Mis Solicitudes" visible. |
| TC-DASH-02 | Dashboard | Experto ve "Mis Oportunidades" | 1. Login como experto. 2. Ir a /dashboard. | Pestaña "Mis Oportunidades" visible. |
| TC-DASH-03 | Dashboard | Regla "un ticket a la vez" | 1. Experto con oportunidad aceptada. 2. Intentar aceptar otra. | Nueva aceptación bloqueada. |

#### Funcionalidad 6: UI/UX y Responsividad

| ID del Caso | Funcionalidad | Escenario de Prueba | Pasos a Seguir | Resultado Esperado |
|-------------|---------------|---------------------|---------------|-------------------|
| TC-UI-01 | UI | Paleta de colores aplicada | 1. Revisar todas las pantallas. | Colores consistentes según diseño. |
| TC-UI-02 | Responsividad | Layout en breakpoints | 1. Cambiar tamaño ventana a 390px, 768px, 1280px. | Layout adapta correctamente. |
| TC-UI-03 | UI | Consistencia de componentes | 1. Ver botones, tarjetas, formularios. | Estilos uniformes en todas las pantallas. |