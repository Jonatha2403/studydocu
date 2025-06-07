# ✅ Checklist de Pruebas - Interfaz StudyDocu

### 📍 Página principal `/`
- [ ] Carga con estilo iOS y gradientes
- [ ] Animaciones suaves con Framer Motion
- [ ] CTA "Empezar ahora" redirige a `/subir`
- [ ] CTA "Ver planes" redirige a `/suscripcion`
- [ ] Sección de universidades y testimonios visibles
- [ ] Responsive correctamente en móvil y tablet

---

### 🧭 Navbar (Desktop + Móvil)
- [ ] Navbar cambia según estado de usuario (logueado o no)
- [ ] Botón "Menú" en móvil abre y cierra correctamente
- [ ] Rutas funcionan: Inicio, Subir, Explorar, Perfil, Ranking
- [ ] Menú de usuario con avatar + logout (cuando logueado)

---

### 📤 Subida de Documentos `/subir`
- [ ] Valida archivos `.pdf`, `.docx`, `.xlsx`
- [ ] Ejecuta resumen IA y categorización
- [ ] Anti-spam activo (espera 2 minutos entre subidas)
- [ ] Actualiza puntos y logros al subir
- [ ] Documento aparece en `/explorar` y en Supabase

---

### 👁 Vista Previa `/vista-previa/[id]`
- [ ] Carga documento correctamente
- [ ] Muestra detalles, descripción, y vista previa
- [ ] Componente de comentarios funcional
- [ ] Se puede reaccionar o guardar como favorito

---

### 🔍 Explorador Global `/explorar`
- [ ] Buscador con texto funciona
- [ ] Filtros por universidad, carrera, tipo operativos
- [ ] Resultados cargan en grid responsivo
- [ ] Pagina correctamente con scroll infinito

---

### 👤 Perfil de Usuario `/perfil`
- [ ] Puntos, nivel, medalla cargan correctamente
- [ ] Logros desbloqueados visibles
- [ ] Historial de acciones aparece en orden
- [ ] Formulario de edición del perfil funcional

---

### ⭐ Favoritos `/mis-favoritos`
- [ ] Se pueden agregar/eliminar documentos favoritos
- [ ] La vista muestra solo los favoritos del usuario

---

### 🏆 Ranking `/ranking`
- [ ] Lista de usuarios por puntos
- [ ] Tu posición aparece resaltada
- [ ] Se visualiza avatar, nivel, puntos y medalla

---

### 🛡 Admin `/admin/dashboard`
- [ ] Estadísticas globales: total usuarios, documentos, etc.
- [ ] Lista de documentos pendientes por aprobar
- [ ] Se puede aprobar/rechazar con notificación automática
- [ ] Sección para reportes de usuarios activa

---

### 📱 PWA
- [ ] Se puede instalar como app en iOS y Android
- [ ] Muestra splash screen al iniciar (iOS)
- [ ] Funciona en modo offline (muestra `offline.html`)

---

### ✅ Resultado esperado
- [ ] Todas las rutas responden
- [ ] Flujo de usuario coherente (desde landing hasta favoritos)
- [ ] Sin errores 500 o 404

---

> Última revisión: [AUTOGENERADA - {fecha y hora}]
