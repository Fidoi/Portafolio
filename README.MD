# Mi Portafolio

Este es mi portafolio personal, un sitio web donde presento quién soy, qué hago, en qué he trabajado y cómo me gusta construir proyectos. Lo hice para tener un espacio que reúna mi perfil profesional, mis habilidades, mis proyectos y también un poco de mi personalidad.

La idea principal de este portafolio es que cualquiera pueda conocerme rápido, entender mi forma de trabajar y revisar los proyectos que he desarrollado, todo en una sola página moderna hecha con Next.js.

## ¿Qué contiene mi portafolio?

Organicé el sitio en distintas secciones para que sea fácil de navegar:

- **Inicio**: una presentación general sobre mí, mi CV, gráficos con las tecnologías que uso y algunos dibujos que hice como hobbie.
- **Proyectos**: muestra los proyectos personales y académicos más importantes.
- **Integraciones**: aquí está la IA con la que se puede conversar dentro del portafolio.
- **Contacto**: un formulario para enviarme un mensaje por correo con nombre, correo y mensaje.
- **Música**: un reproductor en la esquina superior izquierda con una playlist personalizada.
- **Tema**: un switch para alternar entre modo claro y modo oscuro.

## ¿Cómo funciona?

Quise que este portafolio fuera una experiencia simple, clara e interactiva:

- Presento mi información profesional de forma resumida, pero con suficiente contexto para que se entienda mi perfil.
- La sección de proyectos permite revisar el trabajo que he hecho, con enlaces a producción y repositorios cuando corresponde.
- La integración de IA funciona con Gemini y responde dentro del mismo sitio.
- El formulario de contacto se conecta con Resend para enviar correos.
- La música y el cambio de tema hacen que el portafolio tenga una experiencia más personal y agradable.

## Tecnologías principales

- **Next.js**
- **Prisma**
- **Gemini AI**
- **Resend**
- **PostgreSQL**

## Variables de entorno

Este proyecto necesita estas variables de entorno para funcionar correctamente:

```env
# =========================
# DATABASE (PRISMA)
# =========================
DATABASE_URL="postgresql://user:password@host:5432/database"

# =========================
# CHATBOT (GEMINI)
# =========================
GOOGLE_API_KEY="tu_google_gemini_api_key"
GOOGLE_API_KEY_2="tu_segunda_google_gemini_api_key"

# =========================
# RESEND
# =========================
RESEND_API_KEY="tu_resend_api_key"
FROM_EMAIL="no-reply@tudominio.com"
CONTACT_EMAIL="tu_correo_personal@tudominio.com"
```

### Sobre las API keys

Uso **dos claves de Gemini** (`GOOGLE_API_KEY` y `GOOGLE_API_KEY_2`) para tener un respaldo automático cuando una de ellas se queda sin cuota gratuita o deja de responder por límite de uso. El sistema intenta usar la primera y, si ya no quedan tokens disponibles, cambia automáticamente a la segunda.

Si ambas claves llegan al límite, el chatbot deja de responder y muestra el mensaje correspondiente indicando que se acabaron los usos gratuitos disponibles.

## Contacto

La sección de contacto me permite recibir mensajes directamente desde el portafolio mediante un formulario sencillo. Ese envío se procesa con **Resend**, usando el correo definido en `CONTACT_EMAIL`.

## Estado del proyecto

Este portafolio sigue siendo un espacio vivo (o al menos eso quiero 😆), en el que también he estado corrigiendo errores críticos y algunos problemas de compatibilidad entre versiones, que últimamente han estado bastante pesados. De momento, lo estoy haciendo más llevadero tanto para mí como para la gente que llegue a verlo.
