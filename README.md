# Casa Sur · Sitio, simulador, CRM y portal de clientes

Aplicación web en **Next.js 14** con **Firebase** (Firestore, Auth y Storage), lista para publicar en **Vercel**.

| Ruta | Qué es | Quién la usa |
|---|---|---|
| `/` | Sitio: hero, buscador y catálogo, guía DS1, simulador, proceso, testimonios y contacto | Familias |
| `/viviendas/[slug]` | Ficha de cada vivienda: galería, plano, especificaciones, ubicación y cotización | Familias |
| `/privacidad` | Aviso legal y de privacidad (plantilla a revisar por asesoría legal) | Todos |
| `/portal` | Entrada con código al seguimiento de la obra | Familias clientes |
| `/portal/CS-XXXXXX` | Etapa actual, fotos del avance y novedades | Familias clientes |
| `/admin` | Contactos que llegan del formulario (CRM) | Equipo |
| `/admin/proyectos` | Clientes en proceso, etapas y fotos | Equipo |

---

## 1. Crear el proyecto en Firebase (10 minutos)

1. Entra a <https://console.firebase.google.com> y crea un proyecto (por ejemplo `casa-sur`).
2. **Firestore Database** → Crear base de datos → modo producción → región `southamerica-west1` (Santiago).
3. **Authentication** → Comenzar → habilita **Correo electrónico/contraseña**.
4. **Storage** → Comenzar. Para usar Storage, Firebase pide el plan Blaze (pago por uso; con este volumen el costo es de centavos o cero).
5. **Configuración del proyecto → Tus apps → Web** → registra una app y copia los valores de `firebaseConfig`. Son las variables `NEXT_PUBLIC_FIREBASE_*`.
6. **Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada**. Del JSON que se descarga usa `project_id`, `client_email` y `private_key` para `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY`.
7. Copia el contenido de `firestore.rules` en **Firestore → Reglas** y el de `storage.rules` en **Storage → Reglas**, y publica.

### Crear tu usuario de administrador

1. **Authentication → Usuarios → Agregar usuario** con tu correo y una clave segura. Copia el **UID** que aparece.
2. **Firestore → Iniciar colección** con el nombre `admins`. Como ID del documento pega tu **UID** y agrega un campo `nombre` (texto) con tu nombre.
3. Repite para cada persona del equipo (por ejemplo, el supervisor).

---

## 2. Probar en tu computador

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev
```

Abre <http://localhost:3000>. El panel está en <http://localhost:3000/admin>.

---

## 3. Publicar en Vercel

1. Sube esta carpeta a un repositorio en GitHub.
2. En <https://vercel.com/new> importa el repositorio (Vercel detecta Next.js solo).
3. En **Environment Variables** pega todas las variables de `.env.example` con sus valores.
   - En `FIREBASE_PRIVATE_KEY` pega la clave completa con los `\n` tal como viene en el JSON.
4. **Deploy**. Cada vez que hagas `git push`, Vercel publica la nueva versión.
5. Dominio propio: **Settings → Domains** en Vercel (por ejemplo `casasur.cl`).
6. En Firebase → **Authentication → Configuración → Dominios autorizados**, agrega tu dominio de Vercel y el propio.

---

## 4. Cómo se usa día a día

**Llega un contacto.** Cuando alguien llena el formulario, aparece en `/admin` como *Nuevo* (y te llega un correo si configuraste Resend). Desde ahí lo llamas o le escribes por WhatsApp con un toque, cambias su estado, anotas lo conversado y registras la fecha de vencimiento de su subsidio. El panel te avisa en rojo cuando quedan menos de 90 días.

**Se convierte en cliente.** El botón *Convertir en cliente* crea su ficha con un código único (por ejemplo `CS-7KQ2PX`) y te lleva a ella.

**Durante la obra.** En la ficha cambias la etapa (con un mensaje opcional para la familia) y subes fotos desde el celular. La familia lo ve al instante en su portal. El botón *Copiar mensaje para la familia* deja listo el texto con el enlace y el código para mandarlo por WhatsApp.

---

## 5. Dónde cambiar cosas

> ⚠️ **Contenido de demostración.** Las viviendas de `lib/viviendas.ts`, sus disponibilidades y los testimonios de `components/sitio/Testimonios.tsx` son ficticios y se muestran con la etiqueta *Demo*. Reemplázalos antes de publicar. Las fotos de interiores son de ambientación (Unsplash) y tienen un respaldo visual si no cargan.

| Quiero cambiar… | Archivo |
|---|---|
| Viviendas del catálogo (precio, ubicación, disponibilidad, DS1, fotos) | `lib/viviendas.ts` |
| Pasar el catálogo a Firestore | `lib/catalogo.ts` (instrucciones en el archivo) |
| Textos educativos del DS1 | `lib/ds1.ts` |
| Colores, tipografías y componentes visuales | `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx` |
| Fotografías del hero y recortes | reemplaza `public/ranco.jpg` y ejecuta `node scripts/fotos.mjs` |
| Correo, redes sociales y URL del sitio | Variables `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_FACEBOOK`, `NEXT_PUBLIC_SITIO_URL` |
| Precios, características o imágenes de los modelos | `lib/config.ts` → `MODELOS` |
| Subsidio, ahorro mínimo, extra rural, cuotas del aporte | `lib/config.ts` |
| Comunas | `lib/config.ts` → `COMUNAS` |
| Etapas de la obra y sus textos para la familia | `lib/etapas.ts` |
| Teléfono, WhatsApp, asesor, horario, razón social | Variables `NEXT_PUBLIC_*` en Vercel |

La UF se consulta todos los días en mindicador.cl. Si el servicio no responde, se usa `UF_RESPALDO` de `lib/config.ts`.

---

## Seguridad

- El formulario público escribe a la base de datos **solo a través del servidor** (`/api/leads`), con validación y un campo trampa contra robots. Nadie puede leer los contactos desde afuera.
- El panel exige iniciar sesión y que tu UID esté en la colección `admins`. Las reglas de Firestore y Storage lo hacen cumplir también en el servidor de Firebase.
- El portal de la familia se lee desde el servidor con el código. Los códigos tienen 6 caracteres aleatorios (más de 1.000 millones de combinaciones).
- La clave de la cuenta de servicio (`FIREBASE_PRIVATE_KEY`) vive solo en las variables de Vercel. Nunca la subas a GitHub.

Antes de publicar, completa los datos legales del pie (razón social, N° de registro MINVU y N° de EGIS) solo cuando sean reales.
