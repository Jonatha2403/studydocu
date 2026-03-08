import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terminos y condiciones',
  description: 'Terminos y condiciones de uso de StudyDocu.',
  alternates: { canonical: '/terminos' },
}

const UPDATED_AT = '8 de marzo de 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
          Marco legal StudyDocu
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Terminos y condiciones</h1>
        <p className="mt-2 text-sm text-slate-600">Ultima actualizacion: {UPDATED_AT}</p>
      </header>

      <div className="space-y-4">
        <Section title="1. Objeto y aceptacion">
          <p>
            Estos Terminos regulan el acceso y uso de StudyDocu. Al navegar, registrarte o usar
            funcionalidades de la plataforma, aceptas su contenido.
          </p>
          <p>
            Si no estas de acuerdo con alguna clausula, debes abstenerte de usar el servicio.
            StudyDocu puede actualizar estos Terminos y la version vigente sera la publicada aqui.
          </p>
        </Section>

        <Section title="2. Definiciones basicas">
          <p>
            Plataforma: sitio web, aplicaciones, APIs y servicios asociados de StudyDocu. Usuario:
            persona que navega o utiliza una cuenta. Contenido del usuario: archivos, comentarios,
            perfiles, enlaces y demas material subido por usuarios.
          </p>
        </Section>

        <Section title="3. Registro, cuenta y seguridad">
          <p>
            El usuario debe proporcionar datos veraces y mantenerlos actualizados. Es responsable
            por la confidencialidad de su cuenta y por toda actividad realizada en ella.
          </p>
          <p>
            StudyDocu podra requerir verificaciones adicionales, restringir accesos sospechosos o
            suspender cuentas ante riesgo de fraude, suplantacion o incumplimientos.
          </p>
        </Section>

        <Section title="4. Contenido y licencias">
          <p>
            El usuario conserva la titularidad de su contenido, pero concede a StudyDocu una
            licencia no exclusiva, mundial, revocable y sin royalties para alojar, indexar,
            reproducir y mostrar dicho contenido con el fin de operar la plataforma.
          </p>
          <p>
            El usuario declara que cuenta con derechos o autorizaciones suficientes para publicar el
            contenido y que este no infringe derechos de terceros.
          </p>
        </Section>

        <Section title="5. Conducta prohibida">
          <p>
            Se prohíbe publicar material ilicito, infractor de derechos de autor, ofensivo,
            fraudulento, malware, spam, automatizacion abusiva, scraping no autorizado, o cualquier
            practica que afecte seguridad, disponibilidad o reputacion de StudyDocu.
          </p>
          <p>
            Tambien se prohíbe manipular metricas, puntos, logros, descargas o cualquier sistema de
            incentivos mediante medios no permitidos.
          </p>
        </Section>

        <Section title="6. Moderacion, reportes y enforcement">
          <p>
            StudyDocu puede moderar, ocultar, bloquear o eliminar contenido y cuentas cuando exista
            sospecha razonable de incumplimiento legal, riesgo de seguridad o violacion de estos
            Terminos.
          </p>
          <p>
            Los reportes de usuarios seran evaluados de buena fe. StudyDocu puede solicitar
            informacion adicional y adoptar medidas proporcionales segun la gravedad del caso.
          </p>
        </Section>

        <Section title="7. Servicios premium, puntos y descargas">
          <p>
            Las reglas de puntos, descargas gratis, limites de uso y beneficios premium son parte de
            la logica operativa de la plataforma y pueden ajustarse para prevenir abuso, fraude o
            cargas tecnicas desproporcionadas.
          </p>
          <p>
            En caso de deteccion de uso irregular, StudyDocu podra anular beneficios, revertir
            movimientos de puntos, limitar funcionalidades o suspender cuentas.
          </p>
        </Section>

        <Section title="8. Propiedad intelectual de StudyDocu">
          <p>
            El software, marca, interfaz, textos, diseno, codigo y elementos propios de StudyDocu
            estan protegidos por normas de propiedad intelectual.
          </p>
          <p>
            Queda prohibida su reproduccion, distribucion, ingenieria inversa, explotacion comercial
            o uso no autorizado sin consentimiento escrito.
          </p>
        </Section>

        <Section title="9. Disponibilidad y continuidad del servicio">
          <p>
            StudyDocu realiza esfuerzos razonables para mantener disponibilidad, pero no garantiza
            funcionamiento ininterrumpido ni libre de errores. Podran existir mantenimientos,
            actualizaciones o incidencias de terceros.
          </p>
        </Section>

        <Section title="10. Limitacion de responsabilidad">
          <p>
            En la maxima medida permitida por la ley, StudyDocu no sera responsable por danos
            indirectos, lucro cesante, perdida de oportunidad, perdida de datos o afectaciones
            derivadas del uso del contenido aportado por terceros usuarios.
          </p>
          <p>
            La responsabilidad total de StudyDocu, cuando aplique, se limitara al valor
            efectivamente pagado por el usuario en los ultimos 3 meses por el servicio directamente
            relacionado con el reclamo.
          </p>
        </Section>

        <Section title="11. Indemnidad">
          <p>
            El usuario acepta mantener indemne a StudyDocu frente a reclamos de terceros derivados
            de su contenido, su conducta o el incumplimiento de estos Terminos.
          </p>
        </Section>

        <Section title="12. Terminacion o suspension de cuenta">
          <p>
            StudyDocu podra suspender temporal o definitivamente cuentas por incumplimientos graves,
            reincidencia, fraude o riesgos legales/operativos.
          </p>
          <p>El usuario puede dejar de usar la plataforma en cualquier momento.</p>
        </Section>

        <Section title="13. Ley aplicable y jurisdiccion">
          <p>
            Estos Terminos se interpretan conforme a la normativa aplicable en Ecuador. Antes de
            iniciar acciones formales, las partes procuraran resolver controversias por via
            amistosa.
          </p>
        </Section>

        <Section title="14. Nulidad parcial y vigencia">
          <p>
            Si una clausula se considera invalida, las demas continuaran vigentes. Estos Terminos
            entran en vigor desde su publicacion y reemplazan versiones anteriores.
          </p>
        </Section>
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Consultas legales y cumplimiento:{' '}
        <a href="mailto:soporte@studydocu.ec" className="underline text-blue-700">
          soporte@studydocu.ec
        </a>
        . Revisa tambien la{' '}
        <Link href="/privacidad" className="underline text-blue-700">
          Politica de privacidad
        </Link>
        .
      </p>
    </main>
  )
}
