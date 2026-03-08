import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terminos y condiciones',
  description: 'Terminos y condiciones de uso de StudyDocu.',
  alternates: { canonical: '/terminos' },
}

const UPDATED_AT = '8 de marzo de 2026'

function Item({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </section>
  )
}

export default function TerminosPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Legal StudyDocu
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Terminos y condiciones</h1>
        <p className="mt-2 text-sm text-slate-600">Ultima actualizacion: {UPDATED_AT}</p>
      </header>

      <div className="space-y-4">
        <Item title="1. Aceptacion y alcance">
          <p>
            Al usar StudyDocu aceptas estos terminos. Si no estas de acuerdo, debes dejar de usar la
            plataforma.
          </p>
          <p>
            StudyDocu es una plataforma academica independiente y no afiliada oficialmente a
            universidades.
          </p>
        </Item>

        <Item title="2. Cuenta y seguridad">
          <p>Debes mantener tus credenciales seguras y la informacion de perfil actualizada.</p>
          <p>
            Eres responsable de la actividad realizada desde tu cuenta, salvo uso no autorizado
            reportado oportunamente.
          </p>
        </Item>

        <Item title="3. Contenido del usuario">
          <p>
            Cada usuario es responsable del contenido que sube, comparte o comenta (documentos,
            textos, enlaces, imagenes).
          </p>
          <p>
            Al subir contenido declaras que tienes derechos para publicarlo y otorgas a StudyDocu
            una licencia no exclusiva para alojarlo, mostrarlo y distribuirlo dentro de la
            plataforma.
          </p>
          <p>
            Se prohíbe contenido que infrinja derechos de autor, datos personales sensibles sin base
            legal, malware, fraude, acoso o actividades ilicitas.
          </p>
        </Item>

        <Item title="4. Moderacion, reporte y retiro">
          <p>
            StudyDocu puede revisar, limitar o retirar contenido y/o cuentas cuando detecte
            incumplimientos legales, riesgos de seguridad o violaciones a estos terminos.
          </p>
          <p>
            Los usuarios pueden reportar contenido. StudyDocu evaluara de buena fe y actuara segun
            criterio razonable de cumplimiento.
          </p>
        </Item>

        <Item title="5. Descargas, puntos y membresias">
          <p>
            Las reglas de descargas gratis, puntos, beneficios premium y limites operativos se
            publican en la plataforma y pueden actualizarse para evitar abuso.
          </p>
          <p>
            StudyDocu puede suspender beneficios obtenidos por fraude, automatizacion no permitida o
            manipulacion del sistema.
          </p>
        </Item>

        <Item title="6. Propiedad intelectual">
          <p>
            La marca, software, diseño y contenidos propios de StudyDocu estan protegidos por
            derechos de propiedad intelectual.
          </p>
          <p>
            No se permite copiar, descompilar, revender o explotar comercialmente la plataforma sin
            autorizacion escrita.
          </p>
        </Item>

        <Item title="7. Limitacion de responsabilidad">
          <p>
            StudyDocu se ofrece &quot;tal cual&quot;. No garantizamos disponibilidad ininterrumpida
            ni ausencia total de errores.
          </p>
          <p>
            En la maxima medida permitida por ley, StudyDocu no responde por daños indirectos, lucro
            cesante o perdidas derivadas del uso de contenido aportado por terceros.
          </p>
        </Item>

        <Item title="8. Suspension y terminacion">
          <p>
            Podemos suspender o cerrar cuentas por incumplimientos graves, uso abusivo o riesgos
            legales/tecnicos.
          </p>
          <p>El usuario puede dejar de usar la plataforma en cualquier momento.</p>
        </Item>

        <Item title="9. Ley aplicable y jurisdiccion">
          <p>
            Estos terminos se rigen por la normativa aplicable en Ecuador. Cualquier controversia se
            intentara resolver primero por via amistosa.
          </p>
        </Item>

        <Item title="10. Cambios a estos terminos">
          <p>
            StudyDocu puede actualizar estos terminos. La version vigente sera la publicada en esta
            pagina.
          </p>
        </Item>
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Para consultas legales o de cumplimiento:{' '}
        <a href="mailto:soporte@studydocu.ec" className="underline text-blue-700">
          soporte@studydocu.ec
        </a>
        . Tambien puedes revisar la{' '}
        <Link href="/privacidad" className="underline text-blue-700">
          Politica de privacidad
        </Link>
        .
      </p>
    </main>
  )
}
