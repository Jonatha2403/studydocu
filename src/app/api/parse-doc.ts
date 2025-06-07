// pages/api/parse-doc.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File, Fields, Files } from 'formidable'; // Importar tipos de formidable
import fs from 'fs/promises'; // Usar fs.promises para async/await
import pdfParse from 'pdf-parse'; // Asume que @types/pdf-parse está instalado
import mammoth from 'mammoth'; // Mammoth usualmente incluye sus propios tipos
import * as XLSX from 'xlsx'; // XLSX también suele incluir sus tipos

export const config = {
  api: {
    bodyParser: false, // Esencial para que formidable maneje el stream de subida
  },
};

interface ParsedFileResult {
  text?: string;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ParsedFileResult>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido. Solo se acepta POST.' });
  }

  // Considerar configurar opciones como uploadDir y maxFileSize para formidable
  // const form = formidable({ multiples: false, uploadDir: '/tmp/myuploads', maxFileSize: 5 * 1024 * 1024 /* 5MB */ });
  const form = formidable({ multiples: false });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    // Tipado explícito para err, fields, y files, aunque @types/formidable debería ayudar.
    // El tipo de 'err' de formidable puede ser complejo, 'any' es un fallback aquí.
    // 'fields' será formidable.Fields y 'files' será formidable.Files.

    const uploadedFile = files.file; // 'file' es el nombre del campo en el FormData del cliente

    if (err) {
      console.error('Error al parsear el formulario con formidable:', err);
      return res.status(500).json({ error: 'Error interno al procesar la subida.' });
    }

    if (!uploadedFile || Array.isArray(uploadedFile) && uploadedFile.length === 0) {
      return res.status(400).json({ error: 'No se recibió ningún archivo o el archivo está vacío.' });
    }

    const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
    const tempFilePath = file.filepath; // formidable guarda el archivo temporalmente

    try {
      const buffer = await fs.readFile(tempFilePath);
      let extractedText = '';

      // Opcional: Validación más robusta del tipo de archivo usando magic numbers si la seguridad es crítica
      // ya que el mimetype enviado por el cliente puede ser manipulado.

      if (file.mimetype === 'application/pdf') {
        const parsed = await pdfParse(buffer);
        extractedText = parsed.text;
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { // DOCX
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') { // XLSX
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        // Procesar todas las hojas o la primera como antes:
        let fullText = "";
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          fullText += XLSX.utils.sheet_to_csv(sheet) + "\n\n"; // Añadir separador entre hojas
        });
        extractedText = fullText.trim();
        // Nota: sheet_to_csv puede no ser ideal para "texto puro". Considera sheet_to_txt o iterar celdas.
      } else {
        console.warn('Intento de subida de tipo de archivo no compatible:', file.mimetype, file.originalFilename);
        return res.status(400).json({ error: `Tipo de archivo no compatible: ${file.mimetype}. Sube PDF, DOCX o XLSX.` });
      }

      if (!extractedText || extractedText.trim().length < 250) {
        // Ajusta este umbral según tus necesidades
        const message = `El contenido extraído es demasiado corto (menos de 250 caracteres) o el archivo está vacío/corrupto. Contenido: ${extractedText.substring(0,50)}...`;
        console.warn(message, { documentName: file.originalFilename });
        return res.status(400).json({ error: message });
      }

      return res.status(200).json({ text: extractedText.trim() });

    } catch (processingError: any) {
      console.error('Error al procesar el archivo:', processingError, { documentName: file.originalFilename });
      return res.status(500).json({ error: `Error al procesar el archivo: ${processingError.message || 'Error desconocido'}` });
    } finally {
      // **Importante: Limpiar el archivo temporal después de procesarlo**
      try {
        await fs.unlink(tempFilePath);
        console.log('Archivo temporal eliminado:', tempFilePath);
      } catch (cleanupError) {
        console.error('Error al eliminar el archivo temporal:', tempFilePath, cleanupError);
        // Este error no se envía al cliente, pero es importante para el mantenimiento del servidor.
      }
    }
  });
}