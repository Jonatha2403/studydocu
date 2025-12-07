// app/api/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import type { IncomingMessage } from 'http'
import formidable, { File as FormidableFile, Files, Fields } from 'formidable'
// 👇 OJO: quitamos el import top-level de pdf-parse
// import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'
import { createHash } from 'crypto'
import { readFile, unlink } from 'fs/promises'

export const config = {
  api: {
    bodyParser: false,
  },
}

function suggestCategory(text: string): string {
  text = text.toLowerCase()
  const checks = [
    { keywords: /resumen|en resumen|síntesis|conclusión/, category: 'Resumen' },
    { keywords: /ensayo|opinión|argumento|reflexión/, category: 'Ensayo' },
    { keywords: /tarea|pregunta|respuesta|instrucción|ejercicio/, category: 'Tarea' },
    { keywords: /examen|evaluación|prueba parcial|cuestionario|quiz/, category: 'Examen' },
  ]
  for (const check of checks) {
    if (check.keywords.test(text)) return check.category
  }
  return 'Otro'
}

interface ParsedFormOutput {
  filePath: string
  mimetype: string
  originalFilename: string | null
}

async function parseForm(req: NextRequest): Promise<ParsedFormOutput> {
  const form = formidable({ multiples: false, keepExtensions: true })

  return new Promise((resolve, reject) => {
    form.parse(req as unknown as IncomingMessage, (err: unknown, _fields: Fields, files: Files) => {
      if (err) {
        console.error('Error de Formidable al parsear:', err)
        return reject(new Error('Error al procesar los datos del formulario.'))
      }

      const fileEntry = files.file

      if (!fileEntry) {
        return reject(new Error('No se encontró ningún archivo con el nombre "file".'))
      }

      const currentFile: FormidableFile | undefined = Array.isArray(fileEntry)
        ? fileEntry[0]
        : fileEntry

      if (!currentFile || !currentFile.filepath) {
        return reject(new Error('El archivo subido no es válido o falta la ruta del archivo.'))
      }

      resolve({
        filePath: currentFile.filepath,
        mimetype: currentFile.mimetype || 'application/octet-stream',
        originalFilename: currentFile.originalFilename || null,
      })
    })
  })
}

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null

  try {
    const { filePath, mimetype, originalFilename } = await parseForm(req)
    tempFilePath = filePath

    const buffer = await readFile(tempFilePath)
    let text = ''

    if (mimetype === 'application/pdf') {
      // IMPORT DINÁMICO tipado para evitar usar "any"
      const pdfModule = await import('pdf-parse')
      const pdfParse = pdfModule.default as (data: Buffer) => Promise<{ text: string }>
      const pdfData = await pdfParse(buffer)
      text = pdfData.text
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const { value } = await mammoth.extractRawText({ buffer })
      text = value
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      let fullText = ''
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        fullText += XLSX.utils.sheet_to_csv(worksheet) + '\n\n'
      })
      text = fullText
    } else {
      console.warn(`Tipo de archivo no soportado: ${mimetype} (${originalFilename})`)
      return NextResponse.json(
        { error: `Tipo de archivo no soportado: ${mimetype}. Solo PDF, DOCX, XLSX.` },
        { status: 415 }
      )
    }

    text = text.trim()
    if (text.length < 250) {
      console.warn(`Documento muy corto: ${originalFilename} (${text.length} caracteres)`)
      return NextResponse.json(
        { error: 'El documento tiene menos de 250 caracteres legibles.' },
        { status: 400 }
      )
    }

    const hash = createHash('sha256').update(buffer).digest('hex')
    const category = suggestCategory(text)

    console.log(
      `✅ Archivo procesado: ${originalFilename}, Categoría: ${category}, Hash: ${hash.substring(
        0,
        10
      )}...`
    )

    return NextResponse.json({ text, hash, category, originalFilename })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido.'
    console.error('❌ Error en POST /api/route:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  } finally {
    if (tempFilePath) {
      try {
        await unlink(tempFilePath)
        console.log('🧽 Archivo temporal eliminado:', tempFilePath)
      } catch (cleanupError) {
        console.error('⚠️ Error al eliminar temporal:', tempFilePath, cleanupError)
      }
    }
  }
}
