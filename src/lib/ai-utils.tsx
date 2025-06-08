import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import xlsx from 'xlsx'

/**
 * Limpia el texto extraído para análisis: quita saltos de línea, múltiples espacios, caracteres especiales.
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Reemplaza múltiples espacios por uno
    .replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ.,;:!?¿¡()%-]/g, '') // Elimina caracteres especiales no deseados
    .trim()
}

/**
 * Categoriza automáticamente un documento con base en su contenido textual.
 */
export async function categorizeDocument(filePath: string, extension: string): Promise<string> {
  let rawText = ''

  try {
    if (extension === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath)
      const pdfData = await pdfParse(dataBuffer)
      rawText = pdfData.text
    } else if (extension === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath })
      rawText = result.value
    } else if (extension === '.xlsx') {
      const workbook = xlsx.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      if (!sheetName) return 'General'
      const sheet = workbook.Sheets[sheetName]
      rawText = xlsx.utils.sheet_to_csv(sheet)
    } else {
      return 'General'
    }
  } catch (err) {
    console.error('❌ Error leyendo el archivo:', err)
    return 'General'
  }

  const text = cleanText(rawText).toLowerCase()

  const categorias = [
    { nombre: 'Marketing', keywords: ['marketing', 'publicidad', 'cliente'] },
    { nombre: 'Contabilidad', keywords: ['contabilidad', 'balance', 'financiero'] },
    { nombre: 'Derecho', keywords: ['constitución', 'derecho', 'ley'] },
    { nombre: 'Matemáticas', keywords: ['matemáticas', 'álgebra', 'geometría'] },
    { nombre: 'Programación', keywords: ['programación', 'javascript', 'código'] },
    { nombre: 'Psicología', keywords: ['psicología', 'mente', 'conducta'] },
    { nombre: 'Administración', keywords: ['empresa', 'gestión', 'administración'] },
    { nombre: 'Educación', keywords: ['educación', 'pedagogía', 'aprendizaje'] },
  ]

  for (const categoria of categorias) {
    if (categoria.keywords.some((keyword) => text.includes(keyword))) {
      return categoria.nombre
    }
  }

  return 'General'
}

/**
 * Evalúa si el documento debe ser aprobado automáticamente.
 * Requiere mínimo 300 caracteres legibles.
 */
export async function shouldAutoApprove(filePath: string): Promise<boolean> {
  const ext = path.extname(filePath).toLowerCase()

  if (!['.pdf', '.docx', '.xlsx'].includes(ext)) return false

  try {
    const stats = fs.statSync(filePath)
    if (stats.size < 10000) return false

    let content = ''

    if (ext === '.pdf') {
      const pdfData = await pdfParse(fs.readFileSync(filePath))
      content = pdfData.text
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath })
      content = result.value
    } else if (ext === '.xlsx') {
      const workbook = xlsx.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      if (!sheetName) return false
      const sheet = workbook.Sheets[sheetName]
      content = xlsx.utils.sheet_to_csv(sheet)
    }

    return cleanText(content).length > 300
  } catch (error: unknown) {
    console.error('❌ Error evaluando aprobación automática:', error)
    return false
  }
}
