# 📘 StudyDocu - Plataforma Académica Inteligente

**StudyDocu** es una plataforma tipo StuDocu, desarrollada con tecnologías modernas y enfoque visual estilo iOS + ClickUp. Permite a los estudiantes subir, gestionar, visualizar y explorar documentos universitarios de forma eficiente, segura y atractiva.

---

## 🚀 Tecnologías principales
- **Next.js App Router** (estructura modular por ruta)
- **Tailwind CSS** + **Framer Motion** (estilo tipo iOS)
- **Supabase** (auth, base de datos, almacenamiento)
- **PWA + splash screens iOS** (offline incluido)
- **OpenAI** (resumen de documentos, moderación, sugerencias)

---

## 📁 Estructura del Proyecto (visual)

```
📦 studydocu
├── .next/                     → Archivos compilados por Next.js
├── app/                      → Rutas (Next.js App Router)
│   ├── admin/                → Panel de administración
│   ├── api/                  → Endpoints o acciones internas
│   ├── dashboard/            → Dashboard de usuario
│   ├── documents/            → Vista de documentos
│   ├── explorar/             → Buscador global con filtros
│   ├── mis-favoritos/        → Documentos guardados
│   ├── perfil/               → Perfil con logros e historial
│   ├── ranking/              → Ranking de usuarios por puntos
│   ├── subir/                → Subida de documentos
│   ├── suscripcion/          → Planes premium
│   ├── vista-previa/         → Vista previa de documentos
│   ├── favicon.ico           → Ícono principal
│   ├── layout.tsx            → Layout global con fuente SF Pro
│   ├── page.tsx              → Landing estilo ClickUp
│
├── components/               → Componentes reutilizables
│   ├── ui/                   → Botones, inputs, etc.
│   ├── ActivityHistory.tsx
│   ├── AdminRoleManager.tsx
│   ├── Auth.tsx
│   ├── ClientWrapper.tsx
│   ├── CommentBox.tsx
│   ├── DocumentDetails.tsx
│   ├── DocumentPreview.tsx
│   ├── FavoriteButton.tsx
│   ├── HistorialAcciones.tsx
│   ├── LikeButton.tsx
│   ├── Navbar.tsx
│   ├── NotificationPanel.tsx
│   ├── PaymentOptions.tsx
│   ├── RankingTable.tsx
│   ├── ReportForm.tsx
│   ├── UploadForm.tsx
│   ├── UserAchievements.tsx
│   ├── UserInfo.tsx
│   ├── UserMenu.tsx
│   ├── UserProfile.tsx
│   ├── UserProfileEdit.tsx
│
├── lib/                      → Lógica y utilidades
│   ├── ai-utils.tsx          → IA: resumen, moderación
│   ├── grantAchievements.ts  → Asignación de logros
│   ├── medallas.ts           → Niveles y medallas
│   ├── supabase.ts           → Cliente Supabase
│   ├── utils.ts              → Funciones generales
│
├── public/                   → Archivos estáticos
│   ├── fonts/                → SF Pro Display
│   ├── icons/                → Íconos y favicons
│   ├── manifest.json         → Configuración PWA
│   ├── offline.html
│   ├── service-worker.js
│   ├── splashscreens/        → (añadir para iOS)
│
├── .env.local                → Variables de entorno
├── next.config.ts            → Configuración avanzada
├── tailwind.config.ts        → Temas, fuentes, colores
├── tsconfig.json             → TypeScript
├── postcss.config.js         → Plugins Tailwind
├── README.md                 → Documentación general
```

---

## ✨ Funcionalidades destacadas

- ✅ Subida de documentos .pdf, .docx, .xlsx
- ✅ Vista previa inteligente
- ✅ Búsqueda global con filtros por universidad, carrera, tipo
- ✅ Panel de usuario con estadísticas y progreso
- ✅ Favoritos, comentarios, reportes
- ✅ Ranking de usuarios por puntos
- ✅ Sistema de logros y niveles con IA
- ✅ Panel admin para aprobar documentos y banear usuarios
- ✅ Notificaciones reales + visualización de acciones
- ✅ App PWA + splashscreen iOS + soporte offline

---

## ⚙️ Instalación local

1. Clona este repositorio y entra a la carpeta:
```bash
git clone https://github.com/tu-org/studydocu.git
cd studydocu
```

2. Instala dependencias:
```bash
npm install
```

3. Crea tu archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_publica
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Ejecuta el proyecto:
```bash
npm run dev
```

5. Abre en navegador:
```
http://localhost:3000
```

---

## 📱 Estilo iOS / UI
- Fuente: `SF Pro Display`
- Tailwind con diseño tipo Apple
- Gradientes suaves, botones grandes, animaciones framer-motion

---

## 🧠 Futuro
- 🧩 Chat entre estudiantes
- 📤 Exportación de apuntes compartidos
- 🔗 Integración con Canvas / Moodle
- 📊 Panel de métricas avanzadas para admins

---

## 👨‍💻 Créditos
**Desarrollado por:** Emprende con Jonathan · 2025  
Diseño e integración técnica con IA OpenAI.

---

© 2025 StudyDocu · Todos los derechos reservados.
