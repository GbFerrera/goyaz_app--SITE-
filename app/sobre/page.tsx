export default function Sobre() {
  return (
    <main className="pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-goyaz-dark mb-4">
            Sobre Nós
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Especialistas em regularização fundiária e ambiental
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-goyaz-dark mb-6">
              Nossa História
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              A Goyaz nasceu com o propósito de facilitar e agilizar processos de
              regularização fundiária e ambiental, oferecendo soluções completas
              para proprietários rurais e urbanos.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Com anos de experiência no mercado, nossa equipe especializada
              garante conformidade total com as normas ambientais e fundiárias,
              proporcionando segurança jurídica aos nossos clientes.
            </p>
          </div>

          <div className="bg-gradient-to-br from-goyaz-primary/10 to-goyaz-secondary/10 rounded-xl p-8 flex items-center justify-center">
            <svg
              className="w-48 h-48 text-goyaz-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
              <path d="M 12 12 L 8 22 L 16 22 Z" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-goyaz-dark mb-8 text-center">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-goyaz-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-goyaz-dark mb-2">
                Compromisso
              </h3>
              <p className="text-gray-600">
                Dedicação total aos nossos clientes e seus projetos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-goyaz-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-goyaz-dark mb-2">
                Expertise
              </h3>
              <p className="text-gray-600">
                Conhecimento profundo em legislação ambiental e fundiária
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-goyaz-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-goyaz-dark mb-2">
                Agilidade
              </h3>
              <p className="text-gray-600">
                Processos otimizados para resultados rápidos e eficientes
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
