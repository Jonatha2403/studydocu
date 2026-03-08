import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politica de privacidad',
  description: 'Politica de privacidad de StudyDocu.',
  alternates: { canonical: '/privacidad' },
}

const UPDATED_AT = '8 de marzo de 2026'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
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
          Legal StudyDocu
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Politica de privacidad</h1>
        <p className="mt-2 text-sm text-slate-600">Ultima actualizacion: {UPDATED_AT}</p>
      </header>

      <div className="space-y-4">
        <Block title="1. Informacion que recopilamos">
          <p>
            Recopilamos datos de registro y uso, como: correo, username, universidad, actividad en
            plataforma, documentos subidos, interacciones y logs tecnicos de seguridad.
          </p>
        </Block>

        <Block title="2. Finalidades del tratamiento">
          <p>Usamos los datos para operar StudyDocu, autenticar usuarios y prevenir fraude.</p>
          <p>
            Tambien para mejorar funcionalidades (explorar, vista previa, puntos, logros, soporte y
            analitica interna).
          </p>
        </Block>

        <Block title="3. Base legal y minimizacion">
          <p>
            Tratamos datos necesarios para prestar el servicio, cumplir obligaciones legales y
            proteger la seguridad de la plataforma.
          </p>
          <p>
            Aplicamos principio de minimizacion: no solicitamos datos innecesarios para el uso
            normal del servicio.
          </p>
        </Block>

        <Block title="4. Conservacion de datos">
          <p>
            Conservamos datos mientras la cuenta este activa o mientras exista necesidad operativa,
            legal o de seguridad.
          </p>
          <p>
            Cuando corresponde, eliminamos o anonimamos informacion segun politicas internas y
            requerimientos aplicables.
          </p>
        </Block>

        <Block title="5. Comparticion con terceros">
          <p>
            Podemos usar proveedores de infraestructura y servicios (hosting, autenticacion, pagos,
            correo, analitica) bajo controles razonables de seguridad y confidencialidad.
          </p>
          <p>No vendemos datos personales a terceros.</p>
        </Block>

        <Block title="6. Seguridad">
          <p>
            Implementamos medidas tecnicas y organizativas razonables para proteger la informacion;
            sin embargo, ningun sistema es 100% infalible.
          </p>
        </Block>

        <Block title="7. Derechos del usuario">
          <p>
            Puedes solicitar acceso, correccion o eliminacion de datos dentro de lo permitido por la
            ley y por las obligaciones de seguridad/plataforma.
          </p>
          <p>Puedes gestionar parte de tu informacion desde tu perfil y configuracion de cuenta.</p>
        </Block>

        <Block title="8. Cookies y tecnologias similares">
          <p>
            Usamos cookies o almacenamiento local para autenticacion, preferencia de idioma/tema y
            funcionamiento de la sesion.
          </p>
        </Block>

        <Block title="9. Menores de edad">
          <p>
            StudyDocu no esta dirigida a menores sin supervision. Si detectamos datos de menores sin
            base valida, podremos restringir o eliminar la cuenta.
          </p>
        </Block>

        <Block title="10. Cambios a esta politica">
          <p>
            Podemos actualizar esta politica para reflejar mejoras del servicio o cambios
            normativos. La version vigente sera la publicada en esta pagina.
          </p>
        </Block>
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Contacto de privacidad:{' '}
        <a href="mailto:soporte@studydocu.ec" className="underline text-blue-700">
          soporte@studydocu.ec
        </a>
        . Revisa tambien nuestros{' '}
        <Link href="/terminos" className="underline text-blue-700">
          Terminos y condiciones
        </Link>
        .
      </p>
    </main>
  )
}
