# 🎨 Theme Tokens de StudyDocu

Este archivo contiene todos los tokens de diseño definidos en `theme.css` para facilitar el desarrollo visual y mantener una coherencia de marca.

---

## 🎨 Colores Principales

| Token                     | Valor        | Descripción               |
|---------------------------|--------------|----------------------------|
| `--color-primary`         | #7C3AED      | Color principal (morado)  |
| `--color-primary-light`   | #A78BFA      | Variante clara del primario |
| `--color-primary-dark`    | #5B21B6      | Variante oscura del primario |

| Token                       | Valor        | Descripción                 |
|-----------------------------|--------------|------------------------------|
| `--color-secondary`         | #3B82F6      | Color secundario (azul)     |
| `--color-secondary-light`   | #60A5FA      | Variante clara del secundario |
| `--color-secondary-dark`    | #1D4ED8      | Variante oscura del secundario |

---

## 🧱 Fondo y Texto

| Token                    | Valor     | Descripción             |
|--------------------------|-----------|--------------------------|
| `--color-bg-light`       | #f8fafc   | Fondo claro              |
| `--color-bg-dark`        | #0B1120   | Fondo oscuro             |
| `--color-text-light`     | #1e293b   | Texto sobre fondo claro  |
| `--color-text-dark`      | #f1f5f9   | Texto sobre fondo oscuro |

---

## ✅ Estados

| Token               | Valor     |
|---------------------|-----------|
| `--color-success`   | #16a34a   |
| `--color-error`     | #dc2626   |
| `--color-warning`   | #f59e0b   |

---

## ✏️ Tipografía

| Token         | Valor                                                                  |
|---------------|------------------------------------------------------------------------|
| `--font-sans` | SF Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, etc.     |

---

## 🧱 Bordes

| Token            | Valor    |
|------------------|----------|
| `--radius-sm`    | 0.25rem  |
| `--radius-md`    | 0.5rem   |
| `--radius-lg`    | 0.75rem  |
| `--radius-xl`    | 1rem     |
| `--radius-full`  | 9999px   |

---

## 🌫️ Sombras

| Token           | Valor                                                    |
|------------------|----------------------------------------------------------|
| `--shadow-sm`   | `0 1px 2px 0 rgb(0 0 0 / 0.03)`                           |
| `--shadow-md`   | `0 4px 6px -1px rgb(0 0 0 / 0.07)`                        |
| `--shadow-lg`   | `0 10px 15px -3px rgb(0 0 0 / 0.07)`                      |
| `--shadow-card` | `0 10px 20px -5px rgb(0 0 0 / 0.1)`                       |

---

## 🧩 Componentes Base

### Botón (`.btn`)

```css
.btn {
  @apply inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition shadow-sm bg-primary text-white hover:bg-primary-dark;
}
