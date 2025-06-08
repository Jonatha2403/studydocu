// src/app/api/parse-doc.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { Files } from 'formidable'
import fs from 'fs/promises'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface ParsedFileResult {
  text?: string
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ParsedFileResult>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Método no permitido. Solo se acepta POST.' })
  }

  const form = formidable({ multiples: false })

  form.parse(req, async (err, _fields, files: Files) => {
    const uploadedFile = files.file

    if (err) {
      console.error('Error al parsear el formulario:', err)
      return res.status(500).json({ error: 'Error interno al procesar la subida.' })
    }

    if (!uploadedFile || (Array.isArray(uploadedFile) && uploadedFile.length === 0)) {
      return res
        .status(400)
        .json({ error: 'No se recibió ningún archivo o el archivo está vacío.' })
    }

    const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile
    const tempFilePath = file.filepath

    try {
      const buffer = await fs.readFile(tempFilePath)
      let extractedText = ''

      if (file.mimetype === 'application/pdf') {
        const parsed = await pdfParse(buffer)
        extractedText = parsed.text
      } else if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ buffer })
        extractedText = result.value
      } else if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        let fullText = ''
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName]
          fullText += XLSX.utils.sheet_to_csv(sheet) + '\n\n'
        })
        extractedText = fullText.trim()
      } else {
        return res.status(400).json({ error: `Tipo de archivo no compatible: ${file.mimetype}` })
      }

      if (!extractedText || extractedText.trim().length < 250) {
        const message = `El contenido extraído es muy corto o está vacío.`
        return res.status(400).json({ error: message })
      }

      return res.status(200).json({ text: extractedText.trim() })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      console.error('Error al procesar el archivo:', error)
      return res.status(500).json({ error: `Error al procesar el archivo: ${message}` })
    } finally {
      try {
        await fs.unlink(tempFilePath)
      } catch (cleanupError) {
        console.error('Error al eliminar archivo temporal:', cleanupError)
      }
    }
  })
}
