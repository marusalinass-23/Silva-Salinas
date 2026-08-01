# Gastos - Casa Silva Salinas (versión app/PWA)

Guía paso a paso para alguien que nunca ha hecho esto. Tómate tu tiempo,
ningún paso requiere saber programar — son formularios y botones.

En total son 4 partes:
1. Crear tu base de datos gratis (Supabase) — ~10 min
2. Pegar tus datos de Supabase en el proyecto — ~2 min
3. Subir el proyecto a GitHub — ~10 min
4. Publicarlo como página/app y ponerlo en el celular — ~5 min

---

## Parte 1: Crear tu base de datos gratis (Supabase)

1. Ve a **https://supabase.com** en tu navegador y dale clic a
   **"Start your project"** / "Sign up". Entra con tu cuenta de GitHub o
   de Gmail (lo que te resulte más fácil).
2. Dale clic a **"New project"**.
3. Elige o crea una "Organization" (te va a sugerir una, está bien dejarla).
4. Llena el formulario:
   - **Name**: `gastos-casa-salinas`
   - **Database Password**: pon una y **guárdala** en algún lado (no la
     vas a necesitar para esta guía, pero es buena costumbre guardarla).
   - **Region**: elige una cercana, ej. "East US" o "South America".
5. Dale **"Create new project"** y espera 1-2 minutos mientras se prepara
   (verás una barra de progreso).

### Crear la tabla donde se guardan los datos

6. Ya adentro del proyecto, en el menú de la izquierda busca el ícono de
   **"SQL Editor"** (parece `>_`).
7. Dale clic a **"New query"**.
8. Pega exactamente esto:

   ```sql
   create table appdata (
     key text primary key,
     value text
   );

   alter table appdata enable row level security;

   create policy "Allow all access"
   on appdata
   for all
   using (true)
   with check (true);
   ```

9. Dale clic a **"Run"** (o Ctrl+Enter). Debe decir "Success. No rows
   returned".

   *Nota honesta: la política de arriba deja la tabla abierta a quien
   tenga tus datos de conexión — no hay usuarios/contraseñas reales
   detrás. Es el mismo nivel de seguridad tipo "llave de casa" que ya
   tienen los PIN de la app, no es una caja fuerte de banco.*

### Obtener tus datos de conexión

10. En el menú de la izquierda, dale clic al ícono de engrane ⚙️
    **"Project Settings"**.
11. Dale clic a **"API"** (en el submenú).
12. Ahí vas a ver dos cosas que necesitas:
    - **Project URL** (algo como `https://abcdefgh.supabase.co`)
    - **anon public** key, en la sección "Project API keys" (un texto
      largo que empieza distinto cada vez)

    **Deja esa pantalla abierta** (o cópialos en notas) — los vas a
    necesitar en la Parte 2.

✅ Supabase listo.

---

## Parte 2: Pegar tus datos de Supabase en el proyecto

1. Abre el archivo **`src/supabaseConfig.js`** que te entregué.
2. Vas a ver algo así:

   ```js
   export const supabaseConfig = {
     url: "https://TU_PROYECTO.supabase.co",
     anonKey: "TU_ANON_PUBLIC_KEY",
   };
   ```

3. Reemplaza `"https://TU_PROYECTO.supabase.co"` por tu **Project URL**,
   y `"TU_ANON_PUBLIC_KEY"` por tu **anon public key** (ambos del paso 12
   de la Parte 1). Deja las comillas.
4. Guarda el archivo.

Esto lo puedes editar directamente en la página web de GitHub más adelante
(Parte 3) si no quieres instalar nada en tu computadora — te digo cómo.

---

## Parte 3: Subir el proyecto a GitHub

1. Ve a **https://github.com** y crea una cuenta gratis si no tienes
   (botón "Sign up").
2. Ya adentro, dale clic al **"+"** arriba a la derecha → **"New repository"**.
3. Ponle un nombre, ej. `gastos-casa-salinas`. Déjalo en **"Public"**.
   NO marques "Add a README file". Dale **"Create repository"**.
4. En la pantalla que sigue, busca el link que dice
   **"uploading an existing file"** (es un link de texto azul, a la mitad
   de la página).
5. Ahora, en tu computadora, **descomprime** la carpeta que te dí
   (`gastos-pwa.zip`) y arrastra **todos los archivos y carpetas de adentro**
   (no la carpeta misma, lo que está adentro) a esa página de GitHub.
   - Asegúrate de incluir la carpeta `.github` (a veces las carpetas que
     empiezan con punto no se ven fácil — si tu explorador de archivos las
     esconde, activa "mostrar archivos ocultos").
   - **No subas** la carpeta `node_modules` ni `dist` si por accidente
     existieran en tu copia — no se necesitan.
6. Abajo, en "Commit changes", dale clic a **"Commit changes"**.

Si quieres editar `src/supabaseConfig.js` directo ahí en vez de hacerlo
antes: entra al archivo en GitHub, dale clic al lápiz ✏️ (editar), pega tus
datos de Supabase, y dale "Commit changes" también.

✅ Proyecto subido.

---

## Parte 4: Publicarlo y ponerlo en el celular

1. En tu repositorio de GitHub, ve a **"Settings"** (pestaña arriba).
2. En el menú de la izquierda, dale clic a **"Pages"**.
3. En "Build and deployment" → "Source", elige **"GitHub Actions"**
   (no "Deploy from a branch").
4. Ve a la pestaña **"Actions"** (arriba del repositorio). Deberías ver un
   proceso corriendo llamado "Publicar en GitHub Pages" — espera 1-2
   minutos a que se ponga con una palomita ✅ verde.
   - Si no arrancó solo, dale clic en él y luego a "Run workflow".
5. Regresa a **Settings → Pages** — arriba te va a mostrar un link tipo:

   `https://tu-usuario.github.io/gastos-casa-salinas/`

   Ese es tu link final. Ábrelo — deberías ver la pantalla de "Gastos" con
   el login de PIN.

### Ponerlo como app en el celular

**iPhone (en Safari):**
1. Abre el link de arriba en Safari.
2. Toca el ícono de compartir (cuadrito con flecha hacia arriba).
3. "Agregar a pantalla de inicio" → confirma.

**Android (en Chrome):**
1. Abre el link en Chrome.
2. Toca los tres puntitos arriba a la derecha.
3. "Agregar a pantalla de inicio" / "Instalar app" → confirma.

Manda el mismo link a Fernanda y a Ricardo para que hagan lo mismo en sus
teléfonos. Los tres van a compartir los mismos datos automáticamente
gracias a Supabase.

---

## Si algo no funciona

- **La app carga pero no guarda nada / se queda en "Cargando…":**
  revisa que copiaste bien la URL y la anon key en
  `src/supabaseConfig.js`, y que corriste el SQL del paso 8-9 de la
  Parte 1 (la tabla `appdata` debe existir, visible en "Table Editor").
- **La palomita en "Actions" sale roja ❌:** dale clic para ver el detalle
  del error — casi siempre es un archivo que faltó subir (revisa que
  subiste la carpeta `.github/workflows/deploy.yml`).
- Para cualquier duda sobre Supabase o GitHub que no cubra esta guía,
  puedes buscar el error exacto que te salga — son plataformas muy usadas
  y casi todo está resuelto en foros.
