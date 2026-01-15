'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import RegularizationCard from '@/components/RegularizationCard';
import Modal from '@/components/Modal';
import { ListCheck } from 'lucide-react';

export default function Servicos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'rural' | 'urbana' | 'reserva' | null>(null);

  const handleSelectType = (type: 'rural' | 'urbana' | 'reserva') => {
    setSelectedType(type);
    setIsModalOpen(false);
  };

  return (
    <>
      <main className="pt-5 min-h-screen overflow-hidden">
        {/* Seção Informativa */}
        <section className="relative bg-white overflow-hidden">
          <div 
            className="absolute inset-0 opacity-25 bg-no-repeat bg-right-bottom bg-contain"
            style={{ backgroundImage: 'url(/logo.png)' }}
          />
          <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl relative z-10">
            <div className="max-w-xl">
              <p className="text-[#04C55F] font-semibold mb-4 text-sm md:text-base">
                Gestão Regulamentaria
              </p>
              <h1 className="text-black text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Escolha O Tipo De Regularização Que Você Precisa.
              </h1>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                podemos atuar tanto em áreas rurais quanto urbanas, incluindo também o processo de compra de reservas legais, garantindo conformidade total com as normas ambientais e fundiárias.
              </p>
            </div>
          </div>
        </section>

       {/* Seção com Button Modal */}
        <section className="bg-gradient-to-br from-[#04C55F] to-[#00C65E] py-12 md:py-16 relative">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Qual tipo de regularização você precisa hoje?
                </h2>
              </div>
              <Button 
                className="bg-white"
                onClick={() => setIsModalOpen(true)}
              >
                <ListCheck className="w-5 h-5 text-black" />
                <p className="ml-2 text-black">Escolher Agora</p>
              </Button>
            </div>
          </div>
        </section>

        {/* Seção com Card Selecionado */}
        {selectedType && (
          <section className="bg-gradient-to-br from-[#04C55F] to-[#00C65E] py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="max-w-md mx-auto">
                {selectedType === 'rural' && (
                  <RegularizationCard
                    type="rural"
                    title="Rurais"
                    description="precisamos das seguintes documentações e informações"
                    items={[
                      'Documentação do Imóvel',
                      'CCIR',
                      'ITR e Declaração',
                      'CAR',
                      'Benfeitorias',
                      'Descrição do Imóvel'
                    ]}
                  />
                )}
                {selectedType === 'urbana' && (
                  <RegularizationCard
                    type="urbana"
                    title="Urbanas"
                    description="precisamos das seguintes documentações e informações"
                    items={[
                      'Documentação do Imóvel',
                      'Recibo',
                      'IPTU',
                      'Benfeitorias',
                      'Descrição do Imóvel'
                    ]}
                  />
                )}
                {selectedType === 'reserva' && (
                  <RegularizationCard
                    type="reserva"
                    title="Reserva Legal"
                    description="Confira as opções de reservas legais disponíveis."
                    items={[]}
                    hasMap={true}
                  />
                )}
              </div>
            </div>
          </section>
        )}

      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Escolha o tipo de regularização
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Selecione a opção que melhor se adequa à sua necessidade
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => handleSelectType('rural')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#04C55F] hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 bg-[#04C55F] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Regularização Rural</h3>
              <p className="text-gray-600 text-sm">Para propriedades rurais e áreas agricultáveis</p>
            </button>

            <button 
              onClick={() => handleSelectType('urbana')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#04C55F] hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 bg-[#04C55F] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Regularização Urbana</h3>
              <p className="text-gray-600 text-sm">Para imóveis urbanos e loteamentos</p>
            </button>

            <button 
              onClick={() => handleSelectType('reserva')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#04C55F] hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 bg-[#04C55F] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Reserva Legal</h3>
              <p className="text-gray-600 text-sm">Registro de reserva legal</p>
            </button>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h4 className="font-semibold mb-3">Não sabe qual escolher?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Nossa equipe está pronta para te ajudar a identificar a melhor opção para o seu caso.
            </p>
            <Button variant="primary" className="w-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Falar com Especialista
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}