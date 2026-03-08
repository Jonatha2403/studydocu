import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politica de privacidad',
  description: 'Politica de privacidad de StudyDocu.',
  alternates: { canonical: '/privacidad' },
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

export default function PrivacidadPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Marco de privacidad StudyDocu
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Politica de privacidad</h1>
        <p className="mt-2 text-sm text-slate-600">Ultima actualizacion: {UPDATED_AT}</p>
      </header>

      <div className="space-y-4">
        <Section title="1. Responsable y alcance">
          <p>
            StudyDocu actua como responsable del tratamiento de los datos personales necesarios para
            operar su plataforma, autenticar usuarios, mantener seguridad y prestar funcionalidades.
          </p>
          <p>
            Esta Politica aplica al sitio web, paneles, APIs, formularios y comunicaciones asociadas
            al servicio.
          </p>
        </Section>

        <Section title="2. Datos que recopilamos">
          <p>
            Podemos recopilar: datos de cuenta (correo, username), datos de perfil (universidad,
            carrera), datos de contenido (documentos, comentarios, reacciones), datos
            transaccionales (suscripcion/pagos segun corresponda) y logs tecnicos (eventos, IP
            aproximada, seguridad).
          </p>
        </Section>

        <Section title="3. Finalidades del tratamiento">
          <p>
            Tratamos datos para: operar la plataforma, gestionar cuentas, prevenir fraude, moderar
            contenido, ejecutar reglas de puntos/descargas y brindar soporte.
          </p>
          <p>
            Tambien para analitica interna, mejora de experiencia, estabilidad y cumplimiento legal.
          </p>
        </Section>

        <Section title="4. Bases de legitimacion">
          <p>
            Las bases principales son: ejecucion de la relacion de servicio, cumplimiento de
            obligaciones legales, interes legitimo en seguridad/prevencion de abuso y, cuando
            aplique, consentimiento del usuario.
          </p>
        </Section>

        <Section title="5. Uso de proveedores y transferencias">
          <p>
            StudyDocu puede apoyarse en proveedores tecnologicos para hosting, autenticacion,
            correo, almacenamiento, monitoreo y pagos. Dichos terceros tratan datos bajo condiciones
            de confidencialidad y seguridad razonables.
          </p>
          <p>
            Si existen transferencias internacionales de datos, se aplicaran medidas contractuales y
            tecnicas proporcionadas al riesgo.
          </p>
        </Section>

        <Section title="6. Conservacion y eliminacion">
          <p>
            Conservamos datos mientras sean necesarios para la operacion del servicio, atencion de
            reclamos, seguridad y cumplimiento normativo. Posteriormente, se eliminan o anonimizan
            cuando sea razonablemente posible.
          </p>
        </Section>

        <Section title="7. Seguridad de la informacion">
          <p>
            Aplicamos medidas tecnicas y organizativas razonables (controles de acceso, registros de
            auditoria, separacion de roles y mejores practicas operativas). No obstante, ningun
            sistema en internet garantiza seguridad absoluta.
          </p>
        </Section>

        <Section title="8. Derechos del titular">
          <p>
            El usuario puede solicitar acceso, actualizacion, rectificacion o supresion de datos,
            dentro de los limites legales y tecnicos aplicables.
          </p>
          <p>
            Para ejercer derechos, escribe a{' '}
            <a href="mailto:soporte@studydocu.ec" className="underline text-blue-700">
              soporte@studydocu.ec
            </a>
            .
          </p>
        </Section>

        <Section title="9. Cookies y almacenamiento local">
          <p>
            Usamos cookies y almacenamiento local para sesion, seguridad, preferencias y
            rendimiento. El bloqueo total de cookies puede afectar funciones esenciales.
          </p>
        </Section>

        <Section title="10. Menores de edad">
          <p>
            La plataforma no esta orientada a menores sin supervision. Si detectamos tratamiento no
            permitido, podremos limitar o eliminar la cuenta y datos relacionados.
          </p>
        </Section>

        <Section title="11. Contenido de terceros y enlaces externos">
          <p>
            StudyDocu puede incluir contenido o enlaces de terceros. Esta Politica no cubre
            practicas de privacidad de sitios externos, por lo que recomendamos revisar sus
            politicas propias.
          </p>
        </Section>

        <Section title="12. Cambios a esta politica">
          <p>
            Podemos actualizar esta Politica para reflejar cambios normativos, tecnicos o
            funcionales. La version vigente sera la publicada en esta pagina con fecha de
            actualizacion.
          </p>
        </Section>
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Tambien puedes revisar nuestros{' '}
        <Link href="/terminos" className="underline text-blue-700">
          Terminos y condiciones
        </Link>{' '}
        o la pagina de{' '}
        <Link href="/contacto" className="underline text-blue-700">
          Contacto
        </Link>
        .
      </p>
    </main>
  )
}
