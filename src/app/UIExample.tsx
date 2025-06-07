'use client'

import React from 'react'

export default function UIExample() {
  return (
    <div className="min-h-screen bg-appBackground-light dark:bg-appBackground-dark text-appForeground-light dark:text-appForeground-dark p-6 space-y-10">
      <h1 className="text-3xl font-bold">🎨 Vista previa de estilos globales</h1>

      {/* Botones */}
      <div className="space-x-4">
        <button className="btn">Botón primario</button>
        <button className="btn-secondary">Secundario</button>
        <button className="btn-outline">Outline</button>
        <button className="btn-danger">Eliminar</button>
      </div>

      {/* Tarjeta */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">🧾 Tarjeta de ejemplo</h2>
        <p>Este es un ejemplo de tarjeta con fondo y sombra adaptados al tema.</p>
      </div>

      {/* Tags y Badges */}
      <div className="space-x-2">
        <span className="tag">#Etiqueta</span>
        <span className="badge">5</span>
        <span className="badge badge-success">✔ Éxito</span>
        <span className="badge badge-error">✖ Error</span>
      </div>

      {/* Toast */}
      <div className="toast toast-success">
        ✅ Acción completada exitosamente.
      </div>

      <div className="toast toast-error">
        ❌ Ha ocurrido un error inesperado.
      </div>
    </div>
  )
}
