# ✈️ Fernius07 — Aviation Flight Deck Portfolio

Portfolio interactivo y animado con temática de aviación para **Iñigo Fernández García (`@Fernius07`)**, construido con **React 19 + Vite + Motion** y componentes oficiales de **[React Bits](https://github.com/DavidHDev/react-bits)**, preparado para desplegar en **Vercel** con sincronización en vivo con **GitHub** y **LinkedIn**.

---

## 🧩 Componentes de React Bits Utilizados
Todos los componentes están integrados en `src/components/react-bits/`:
- **`Radar`** (`Backgrounds/Radar`) — Radar WebGL2 interactivo con contactos móviles en el Hero.
- **`SplitFlapText`** (`TextAnimations/SplitFlapText`) — Panel mecánico de aeropuerto (Solari) en el Hero y en el Panel de Salidas (FIDS).
- **`TearTicket`** (`Micro/TearTicket`) — Tarjeta de embarque física interactiva con talón perforado arrancable para confirmar el embarque / contacto.
- **`DecryptedText`** (`TextAnimations/DecryptedText`) — Barra METAR aeronáutica con descifrado en tiempo real.
- **`BlurText`** (`TextAnimations/BlurText`) — Títulos animados con desenfoque progresivo al hacer scroll.
- **`CountUp`** (`TextAnimations/CountUp`) — Contadores de instrumentación para métricas de GitHub.
- **`TiltedCard` + `TiltedCardLayer`** (`Components/TiltedCard`) — Tarjetas 3D inclinables con brillo especular y cara trasera técnica para proyectos destacados.
- **`SpotlightCard`** (`Components/SpotlightCard`) — Tarjetas con haz de luz en la Bahía de Aviónica y Bitácora de LinkedIn.
- **`Dock`** (`Components/Dock`) — Dock flotante inferior estilo cabina con efecto lupa.
- **`Magnet`** (`Animations/Magnet`) & **`StarBorder`** (`Animations/StarBorder`) — Botones magnéticos con borde estelar animado.

---

## 🔄 Cómo funciona la sincronización automática (GitHub + LinkedIn)

### 1. GitHub en Vivo (`api/github.js` + `src/hooks/usePortfolioData.js`)
- En producción (Vercel), `/api/github` consulta en tiempo real:
  - `https://api.github.com/users/Fernius07`
  - `https://api.github.com/users/Fernius07/repos?per_page=100&sort=updated`
  - `https://api.github.com/users/Fernius07/events/public?per_page=20`
- Usa caché en el Edge de Vercel (`s-maxage=300, stale-while-revalidate=600`).
- **Cada vez que creas o actualizas un repositorio en GitHub**, aparece automáticamente como un nuevo vuelo en el **Panel de Salidas (FIDS)**, con su lenguaje, descripción, estrellas y URL de despliegue en vivo (`BOARDING`).
- *(Opcional recomendado)* Añade la variable de entorno `GITHUB_TOKEN` en Vercel (Project Settings → Environment Variables) para elevar el límite de peticiones de 60/h a 5.000/h.

### 2. LinkedIn Sincronizado (`api/linkedin.js` + `public/linkedin-profile.json`)
Dado que LinkedIn bloquea el scraping público directo sin autenticación, la web soporta **3 modos de actualización automática**:
1. **API en vivo en Vercel (automático sin editar código)**: Configura en Vercel una de estas variables de entorno:
   - `PROXYCURL_API_KEY` (conectado a `https://www.linkedin.com/in/i%C3%B1igo-fernandez-garcia/`), **o**
   - `RAPIDAPI_LINKEDIN_KEY`, **o**
   - `LINKEDIN_JSON_URL` (URL a un Gist o JSON remoto que actualices cuando quieras).
2. **GitHub Action Automática (`.github/workflows/sync-profile.yml`)**: Se ejecuta diariamente o manualmente (`workflow_dispatch`) para actualizar `public/linkedin-profile.json` y disparar un nuevo deploy en Vercel.
3. **Edición directa de `public/linkedin-profile.json`**: Al actualizar este JSON y hacer `git push`, Vercel actualiza tu sección de Bitácora automáticamente.

---

## 🚀 Desarrollo Local y Despliegue en Vercel

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

### Subir a GitHub y Publicar en Vercel
1. Crea un repositorio en tu cuenta `https://github.com/Fernius07` (por ejemplo `flight-deck-portfolio`).
2. Dentro de esta carpeta ejecuta:
   ```bash
   git add .
   git commit -m "feat: initial aviation flight deck portfolio with React Bits"
   git branch -M main
   git remote add origin https://github.com/Fernius07/TU-REPO.git
   git push -u origin main
   ```
3. Entra en [vercel.com](https://vercel.com), pulsa **Add New → Project**, importa tu repositorio de GitHub y pulsa **Deploy** (Framework: **Vite**).
4. *(Opcional)* En Vercel → **Settings → Environment Variables**, añade `GITHUB_TOKEN` y/o `PROXYCURL_API_KEY` / `LINKEDIN_JSON_URL`.
