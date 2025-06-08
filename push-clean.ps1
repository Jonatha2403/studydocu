# ✅ push-limpio.ps1
Write-Host "🚀 Iniciando push limpio a GitHub..." -ForegroundColor Cyan

# 1. Elimina carpetas pesadas del historial usando BFG
if (-Not (Test-Path "./bfg-1.14.0.jar")) {
  Write-Host "❌ No se encontró 'bfg-1.14.0.jar'. Descárgalo desde: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor Red
  exit
}

Write-Host "🧹 Ejecutando BFG para eliminar 'node_modules/' del historial..."
java -jar "./bfg-1.14.0.jar" --delete-folders node_modules --no-blob-protection

# 2. Limpia referencias antiguas y reduce tamaño del repo
Write-Host "🧼 Ejecutando limpieza profunda del repositorio..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 3. Commit actual si hay cambios
Write-Host "📝 Añadiendo archivos nuevos (excepto ignorados)..."
git add .

$msg = Read-Host "✍️  Escribe el mensaje del commit"
git commit -m "$msg"

# 4. Push forzado al repositorio remoto
Write-Host "📡 Subiendo con push forzado (puede sobrescribir historial remoto)"
git push origin --force

Write-Host "✅ Push limpio completado." -ForegroundColor Green
