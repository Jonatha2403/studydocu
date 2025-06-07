// app/api/route.ts
import { NextRequest, NextResponse } from 'next/server'
import formidable, { File as FormidableFile, Files, Fields } from 'formidable' // Importar tipos
import pdfParse from 'pdf-parse' // Asegúrate de tener @types/pdf-parse
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'
import { createHash } from 'crypto'
import { readFile, unlink } from 'fs/promises' // Añadir unlink para eliminar archivos

export const config = {
  api: {
    bodyParser: false, // Necesario para que formidable procese el stream
  },
}

// Función para categorizar texto (sin cambios, parece funcional para su propósito)
function suggestCategory(text: string): string {
  text = text.toLowerCase();
  const checks = [
    { keywords: /resumen|en resumen|síntesis|conclusión/, category: 'Resumen' },
    { keywords: /ensayo|opinión|argumento|reflexión/, category: 'Ensayo' },
    { keywords: /tarea|pregunta|respuesta|instrucción|ejercicio/, category: 'Tarea' },
    { keywords: /examen|evaluación|prueba parcial|cuestionario|quiz/, category: 'Examen' },
  ];
  for (const check of checks) {
    if (check.keywords.test(text)) return check.category;
  }
  return 'Otro'; // Categoría por defecto
}

// Promisify formidable.parse y mejorar el manejo de tipos
interface ParsedFormOutput {
  filePath: string;
  mimetype: string;
  originalFilename: string | null;
}

async function parseForm(req: NextRequest): Promise<ParsedFormOutput> {
  // Nota: formidable espera un IncomingMessage de Node.js.
  // Usar req.formData() es más idiomático para Route Handlers.
  // Si continúas con formidable, el casteo `req as any` es una solución común pero no ideal.
  const form = formidable({ 
    multiples: false, 
    keepExtensions: true,
    // Podrías especificar uploadDir y maxFileSize aquí:
    // uploadDir: '/tmp/myuploads', 
    // maxFileSize: 10 * 1024 * 1024 // 10MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req as any, (err: any, fields: Fields, files: Files) => {
      if (err) {
        console.error('Error de Formidable al parsear:', err);
        return reject(new Error('Error al procesar los datos del formulario.'));
      }

      const fileEntry = files.file; // 'file' debe ser el name="" del input en el cliente

      if (!fileEntry) {
        return reject(new Error('No se encontró ningún archivo con el nombre "file".'));
      }

      // files.file puede ser File o File[]. Lo manejamos:
      const currentFile: FormidableFile | undefined = Array.isArray(fileEntry) 
        ? fileEntry[0] 
        : fileEntry;

      if (!currentFile || !currentFile.filepath) {
        return reject(new Error('El archivo subido no es válido o falta la ruta del archivo.'));
      }

      resolve({
        filePath: currentFile.filepath,
        mimetype: currentFile.mimetype || 'application/octet-stream', // Mimetype por defecto
        originalFilename: currentFile.originalFilename || null,
      });
    });
  });
}

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null; // Para asegurar la limpieza del archivo

  try {
    const { filePath, mimetype, originalFilename } = await parseForm(req);
    tempFilePath = filePath; // Guardar para limpieza en el finally

    const buffer = await readFile(tempFilePath);
    let text = '';

    // Validación de tipo de archivo (considerar validación por magic numbers para más seguridad)
    if (mimetype === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const { value } = await mammoth.extractRawText({ buffer });
      text = value;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      let fullText = "";
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        fullText += XLSX.utils.sheet_to_csv(worksheet) + "\n\n"; // Extraer como CSV y concatenar hojas
      });
      text = fullText;
      // Nota: Para Excel, `sheet_to_txt` o iterar celdas podría ser mejor para "texto puro".
    } else {
      console.warn(`Intento de subida de tipo de archivo no soportado: ${mimetype} (Archivo: ${originalFilename})`);
      return NextResponse.json({ error: `Tipo de archivo no soportado: ${mimetype}. Solo se aceptan PDF, DOCX, XLSX.` }, { status: 415 });
    }

    text = text.trim();
    if (text.length < 250) { // Umbral de longitud mínima
      console.warn(`Documento con contenido demasiado corto: ${originalFilename} (Longitud: ${text.length})`);
      return NextResponse.json({ error: 'El documento tiene menos de 250 caracteres de texto legible.' }, { status: 400 });
    }

    const hash = createHash('sha256').update(buffer).digest('hex');
    const category = suggestCategory(text);

    console.log(`Archivo procesado: ${originalFilename}, Categoría: ${category}, Hash: ${hash.substring(0,10)}...`);
    return NextResponse.json({ text, hash, category, originalFilename });

  } catch (err: any) {
    console.error('Error en el handler POST /api/parse-doc:', err);
    return NextResponse.json({ error: err.message || 'Error desconocido al procesar el documento.' }, { status: 500 });
  } finally {
    // Limpiar el archivo temporal subido por formidable
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
        console.log('Archivo temporal eliminado correctamente:', tempFilePath);
      } catch (cleanupError) {
        // Este error es secundario, el principal ya se habrá enviado al cliente.
        console.error('Error al eliminar el archivo temporal:', tempFilePath, cleanupError);
      }
    }
  }
}