'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Instagram, Facebook, MessageCircle, ArrowRight, ArrowLeft, X, CheckCircle2, FileText, Info } from 'lucide-react';
import { IconBrandWhatsapp } from "@tabler/icons-react";
import CardCarousel from '@/components/cardCarousel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

const testimonials = [
  {
    name: "Felipe Gomes",
    role: "Produtor de Soja e Milho",
    property: "Fazenda Retiro",
    image: "https://i.pravatar.cc/150?u=felipe",
    text: "Eu fazia toda a gestão em planilhas do Excel. Eram 30 ou 40... O processo da Goyaz trouxe uma clareza que eu não tinha. Agora consigo acompanhar cada etapa da regularização ambiental com tranquilidade.",
    rating: 5
  },
  {
    name: "Ricardo Santos",
    role: "Pecuarista",
    property: "Fazenda Santa Fé",
    image: "https://i.pravatar.cc/150?u=ricardo",
    text: "A equipe da Goyaz foi fundamental para resolver a pendência de reserva legal que se arrastava por anos. Profissionalismo e agilidade que superaram minhas expectativas.",
    rating: 5
  },
  {
    name: "Ana Paula Silva",
    role: "Proprietária Rural",
    property: "Sítio Primavera",
    image: "https://i.pravatar.cc/150?u=ana",
    text: "Excelente atendimento. O suporte jurídico me deu toda a segurança necessária para assinar os documentos de georreferenciamento. Recomendo fortemente a todos os produtores.",
    rating: 5
  },
  {
    name: "Marcos Oliveira",
    role: "Investidor Imobiliário",
    property: "Loteamento Vale Verde",
    image: "https://i.pravatar.cc/150?u=marcos",
    text: "Regularizar áreas urbanas não é fácil, mas com a Goyaz o processo fluiu sem burocracia excessiva. A plataforma deles é intuitiva e o suporte é sempre presente.",
    rating: 5
  }
];

const areas = [
  {
    title: "Jurídico",
    description: "Nossa equipe jurídica especializada garante que todos os processos estejam em conformidade com as leis vigentes, proporcionando segurança e tranquilidade em todas as etapas da regularização.",
    image: "/juridico.png"
  },
  {
    title: "Ambiental",
    description: "Atuamos na preservação e conformidade ambiental, realizando estudos de impacto e licenciamentos necessários para garantir a sustentabilidade do seu projeto rural ou urbano.",
    image: "/ambiental.png"
  },
  {
    title: "Agrimensura",
    description: "Utilizamos tecnologia de ponta para medições precisas de terras, georreferenciamento e demarcações, fundamentais para a correta documentação e posse da propriedade.",
    image: "/agrimensura.png"
  },
  {
    title: "Imobiliários",
    description: "Gestão completa de processos imobiliários, desde a análise documental até a regularização final em cartório, otimizando o valor e a legalidade do seu patrimônio.",
    image: "/imobiliario.png"
  }
];

export default function Servicos() {
  const swiperHelpRef = useRef<any>(null);
  const [currentArea, setCurrentArea] = useState(0);
  const [direction, setDirection] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeHelpIndex, setActiveHelpIndex] = useState(0);
  const [whatsappPhraseIndex, setWhatsappPhraseIndex] = useState(0);
  const [docsModal, setDocsModal] = useState<{ isOpen: boolean; type: 'rural' | 'urbano' | 'ambiental' | null }>({ isOpen: false, type: null });

  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://http://localhost:3334:3433';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      value = value.replace(/^(\d*)/, "($1");
    }
    
    setFormData({ ...formData, phone: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitDocs = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Upload files
      const uploadedDocs = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch(`${API_BASE}/uploads`, {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) throw new Error('Falha no upload');
        const data = await res.json();
        uploadedDocs.push(data.url);
      }

      // 2. Create client
      const res = await fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone,
          email: formData.email,
          documents: uploadedDocs.map(url => ({
            url,
            name: 'Documento enviado pelo site',
            date: new Date().toISOString(),
            description: `${docsModal.type === 'rural' ? 'Regularização Rural' : docsModal.type === 'ambiental' ? 'Regularização Ambiental' : 'Regularização Urbana'} - ${formData.description}`,
            caseTitle: docsModal.type === 'rural' ? 'Regularização Rural' : docsModal.type === 'ambiental' ? 'Regularização Ambiental' : 'Regularização Urbana',
            caseStatus: 'Pendente'
          })),
        }),
      });

      if (!res.ok) throw new Error('Falha ao criar cliente');

      setSubmitSuccess(true);
      setTimeout(() => {
        setDocsModal({ isOpen: false, type: null });
        setSubmitSuccess(false);
        setFormData({ name: '', phone: '', email: '', description: '' });
        setSelectedFiles([]);
      }, 3000);

    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappPhrases = [
    "Precisa de ajuda?",
    "Comprar reserva Legal",
    "Fale com um especialista",
    "Regularize sua área agora",
    "Dúvidas? Chame no Whats!"
  ];

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setWhatsappPhraseIndex((prev) => (prev + 1) % whatsappPhrases.length);
    }, 4000);
    return () => clearInterval(phraseTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentArea((prev) => (prev + 1) % areas.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
    <main className="pt-24 lg:pt-5 flex items-center min-h-[600px] lg:min-h-[700px]">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex gap-4 flex-col lg:flex-row items-center justify-between sm:gap-8">
          {/* Coluna da Esquerda - Texto */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[48%] text-center lg:text-left"
          > 
            <h1 className="text-goyaz-dark text-3xl sm:text-4xl font-bold leading-tight lg:text-5xl xl:text-[55px]">
              Escolha o tipo de <br className="hidden lg:block" />
              Regularização que <br className="hidden lg:block" />
              <span className="text-goyaz-accent"> Você Precisa.</span>
            </h1>

            <p className="hidden sm:block mt-4 lg:mt-6 text-base lg:text-lg leading-relaxed text-gray-600 max-w-xl mx-auto lg:mx-0">
              podemos atuar tanto em áreas rurais quanto urbanas, incluindo também
              o processo de compra de reservas legais, garantindo conformidade total
              com as normas ambientais e fundiárias.
            </p>
          </motion.div>

          {/* Coluna da Direita - Imagem Maior */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:flex w-full lg:w-[48%] justify-center lg:justify-end relative z-20"
          >
            <div className="relative w-full flex items-center justify-center">
              <img 
                src="/secretaria.png" 
                alt="Secretaria de Regularização" 
                className="w-full h-auto max-w-2xl object-contain drop-shadow-2xl relative z-10" 
              />
            </div>
          </motion.div>
        </div>
      </div>
      {/* Docs Modal */}
      <AnimatePresence>
        {docsModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDocsModal({ isOpen: false, type: null })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-goyaz-dark p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-white text-xl font-bold">Envio de Documentação</h3>
                  <p className="text-white/60 text-sm">
                    {docsModal.type === 'rural' ? 'Regularização Rural' : docsModal.type === 'ambiental' ? 'Regularização Ambiental' : 'Regularização Urbana'}
                  </p>
                </div>
                <button 
                  onClick={() => setDocsModal({ isOpen: false, type: null })}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 max-h-[80vh] overflow-y-auto">
                {submitSuccess ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                    <h3 className="text-2xl font-bold text-gray-800">Sucesso!</h3>
                    <p className="text-gray-600 text-center">
                      Seus documentos foram enviados. Nossa equipe entrará em contato em breve.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitDocs} className="space-y-6">
                    {/* Lista de Documentos Necessários */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-goyaz-accent" />
                        Documentos Necessários:
                      </p>
                      <ul className="space-y-1.5">
                        {docsModal.type === 'rural' ? (
                          <>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Documentação de posse (Escritura/Contrato)
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              CCIR (Certificado de Cadastro de Imóvel Rural)
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              ITR + Declaração
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              CAR (Cadastro Ambiental Rural)
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Fotos das benfeitorias existentes
                            </li>
                          </>
                        ) : docsModal.type === 'ambiental' ? (
                          <>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Documentação da propriedade
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Licenças ambientais existentes
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Estudos ambientais anteriores
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Fotos da área de interesse
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Documentação de posse (Escritura/Contrato)
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Espelho do IPTU
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Descrição detalhada do imóvel
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-goyaz-accent mt-1.5 shrink-0" />
                              Fotos das benfeitorias existentes
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-goyaz-accent focus:ring-1 focus:ring-goyaz-accent outline-none transition-all"
                          placeholder="Digite seu nome"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-goyaz-accent focus:ring-1 focus:ring-goyaz-accent outline-none transition-all"
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-goyaz-accent focus:ring-1 focus:ring-goyaz-accent outline-none transition-all"
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descrição do Caso
                          <span className="block text-xs text-gray-500 font-normal mt-0.5">
                            Descreva brevemente o que você precisa ou o histórico do seu caso
                          </span>
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-goyaz-accent focus:ring-1 focus:ring-goyaz-accent outline-none transition-all min-h-[100px] text-sm resize-none"
                          placeholder={docsModal.type === 'rural' 
                            ? "Ex: Gostaria de regularizar uma área rural que recebi de herança..." 
                            : docsModal.type === 'ambiental'
                            ? "Ex: Preciso de licenciamento ambiental para meu projeto..."
                            : "Ex: Gostaria de regularizar meu imóvel urbano que não possui escritura..."}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Anexar Documentos
                          <span className="block text-xs text-gray-500 font-normal mt-0.5">
                            Selecione os arquivos solicitados ({docsModal.type === 'rural' ? 'CCIR, ITR, CAR...' : docsModal.type === 'ambiental' ? 'Licenças, Estudos...' : 'IPTU, Escritura...'})
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-goyaz-accent hover:bg-goyaz-accent/5 transition-all"
                          >
                            <FileText className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">
                              {selectedFiles.length > 0 
                                ? `${selectedFiles.length} arquivo(s) selecionado(s)` 
                                : 'Clique para selecionar arquivos'}
                            </span>
                          </label>
                        </div>
                        {selectedFiles.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                  <span className="truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(index)}
                                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-all"
                                  title="Remover arquivo"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-goyaz-accent hover:bg-goyaz-yellow disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Documentação
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>

    {/* Seção Quem Somos */}
    <motion.section 
      id="quem-somos"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#E3DCD2] rounded-[40px] lg:rounded-[60px] xl:rounded-[100px] shadow-[0_35px_45px_5px_rgba(61,45,39,0.45)] py-12 lg:py-20 xl:py-24"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Coluna da Esquerda - Texto */}
          <div className="w-full lg:w-[45%] z-20 text-center lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 sm:mt-0 text-goyaz-dark text-3xl lg:text-4xl font-bold mb-6"
            >
              Quem Somos ?
            </motion.h2>
            
            {/* Texto Geral Estático */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-700 leading-relaxed mb-8 text-sm lg:text-base px-4 lg:px-0"
            >
              A Goyaz Regularização é uma empresa dedicada a oferecer soluções completas
              em regularização fundiária e ambiental. Nossa missão é simplificar processos 
              complexos e garantir a segurança jurídica do seu patrimônio.
            </motion.p>

            {/* Texto da Área Dinâmico */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentArea}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block min-h-[100px] lg:min-h-[120px] px-4 lg:px-0"
              >
                <h3 className="text-xl lg:text-2xl font-bold text-goyaz-accent mb-2 lg:mb-3">
                  {areas[currentArea].title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  {areas[currentArea].description}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Controles/Dots */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex justify-center lg:justify-start gap-3 mt-8"
            >
              {areas.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentArea ? 1 : -1);
                    setCurrentArea(idx);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentArea === idx ? 'bg-goyaz-accent w-8' : 'border border-goyaz-accent'
                  }`}
                />
              ))}
            </motion.div>
          </div>

          {/* Coluna da Direita - Carrossel de 3 Imagens Maiores */}
          <div className="w-full lg:w-[55%] flex justify-center items-center relative overflow-visible mt-8 lg:mt-0">
            {/* Mobile Carousel (Swiper) */}
            <div className="w-full lg:hidden">
              <CardCarousel 
                items={areas} 
                activeIndex={currentArea}
                onIndexChange={(index) => {
                  setDirection(index > currentArea ? 1 : -1);
                  setCurrentArea(index);
                }}
              />
            </div>

            {/* Desktop Carousel (Framer Motion) */}
            <div className="hidden lg:flex relative w-full max-w-[500px] xl:max-w-[600px] justify-center items-center h-[500px] xl:h-[600px]">
              <AnimatePresence initial={false} custom={direction}>
                {[-1, 0, 1].map((offset) => {
                  const index = (currentArea + offset + areas.length) % areas.length;
                  const isCenter = offset === 0;
                  
                  return (
                    <motion.div
                      key={`${index}-${offset}`}
                      custom={direction}
                      initial={{ 
                        opacity: 0, 
                        scale: 0.8,
                        x: offset * 120,
                        zIndex: isCenter ? 10 : 0 
                      }}
                      animate={{ 
                        opacity: isCenter ? 1 : 0.3, 
                        scale: isCenter ? 1 : 0.75,
                        x: offset * 150,
                        zIndex: isCenter ? 10 : 5,
                        filter: isCenter ? 'blur(0px)' : 'blur(4px)'
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.5,
                        x: (offset - direction) * 120,
                        zIndex: 0
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 25 
                      }}
                      className="absolute w-[320px] h-[320px] xl:w-[420px] xl:h-[420px]"
                    >
                      <div className={`w-full h-full rounded-[60px] xl:rounded-[80px] overflow-hidden shadow-2xl border-4 ${isCenter ? 'border-white' : 'border-transparent'} relative`}>
                        <img 
                          src={areas[index].image} 
                          alt={areas[index].title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.section>

    {/* Seção Nosso Objetivo */}
    <section className="pb-20 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Coluna da Esquerda - Imagem da Equipe */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <img 
              src="/grupo.png" 
              alt="Nossa Equipe" 
              className="w-full h-auto rounded-b-[100px] shadow-xl" 
            />
          </motion.div>

          {/* Coluna da Direita - Texto */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <h2 className="text-goyaz-dark text-3xl lg:text-4xl font-bold mb-8 leading-tight">
              Nosso objetivo e como <br className="hidden lg:block" /> Podemos te ajudar
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Nosso objetivo é transformar a complexidade da regularização fundiária e ambiental em 
                processos simples, seguros e transparentes para nossos clientes. Atuamos com 
                excelência técnica para garantir que sua propriedade esteja em total conformidade 
                com as exigências legais e ambientais.
              </p>
              <p>
                Ajudamos você a valorizar seu patrimônio através da regularização completa, 
                oferecendo suporte especializado em áreas jurídicas, ambientais e de agrimensura. 
                Seja no campo ou na cidade, nossa equipe está pronta para assegurar que cada etapa 
                do seu processo seja conduzida com agilidade e rigor jurídico.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>


    {/* Seção Esse Serviço É Para Você? */}
    <section>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-[40px] lg:rounded-[60px] xl:rounded-[100px] shadow-2xl flex flex-col lg:flex-row min-h-[500px] lg:h-[650px]">
          
          {/* Coluna da Esquerda - Texto com Background */}
          <div className="relative w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 overflow-hidden">
            {/* Background da Esquerda */}
            <img 
              src="/bg-fazenda.png" 
              alt="Background Fazenda" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay para o texto */}
            <div className="absolute inset-0 bg-black/60" />
            
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-white text-3xl lg:text-[40px] font-bold mb-6 leading-tight"
              >
                Esse serviço é para Você?
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6 text-white/90 text-sm lg:text-base leading-relaxed"
              >
                <p>
                  Se você possui uma propriedade rural ou urbana e enfrenta incertezas quanto à documentação, este serviço foi desenhado para você. Garantimos que seu patrimônio esteja protegido juridicamente, eliminando riscos de posse e valorizando seu imóvel no mercado.
                </p>
                <p>
                  Para produtores que buscam conformidade ambiental total. Atuamos na regularização de reservas legais e licenciamentos, permitindo que você foque na produtividade enquanto cuidamos de toda a burocracia técnica e legal exigida pelos órgãos competentes.
                </p>
                <p>
                  Ideal para quem deseja agilidade e segurança em processos imobiliários complexos. Nossa equipe multidisciplinar une tecnologia de agrimensura e expertise jurídica para resolver desde medições de terras até a entrega da escritura definitiva.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Coluna da Direita - Imagem Cheia */}
          <div className="hidden lg:block relative lg:w-1/2 lg:min-h-full overflow-hidden">
            <img 
              src="/mulher-assinando.png" 
              alt="Mulher Assinando" 
              className="absolute inset-0 w-full h-full object-cover object-center" 
            />
          </div>
        </div>
      </div>
    </section>

    

    {/* Seção Como podemos te ajudar? */}
    <section id="como-ajudar" className="relative w-full min-h-screen bg-goyaz-darker overflow-hidden flex flex-col items-center py-16 md:py-20 mt-10 md:mt-20">
      {/* Backgrounds com Formas Arredondadas e Alturas Variadas */}
      <div className="absolute inset-0 w-full h-full px-4 md:px-20 gap-8 md:gap-16 opacity-30 pointer-events-none">
        {/* Desktop Backgrounds */}
        <div className="hidden md:flex w-full h-full gap-8 md:gap-16">
          <div className="flex-1 h-[70%] mt-[15%] relative overflow-hidden rounded-[10px]">
            <img src="/image-rural.png" alt="Rural" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-goyaz-darker/20" />
          </div>
          <div className="flex-1 h-[85%] mt-[5%] relative overflow-hidden rounded-[10px]">
            <img src="/image-urbano.png" alt="Urbano" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-goyaz-darker/20" />
          </div>
          <div className="flex-1 h-[65%] mt-[-1%] relative overflow-hidden rounded-[10px]">
            <img src="/image-reserva.png" alt="Reserva" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-goyaz-darker/20" />
          </div>
        </div>

        {/* Mobile Background - Dinâmico */}
        <div className="md:hidden absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHelpIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img 
                src={activeHelpIndex === 0 ? "/image-rural.png" : activeHelpIndex === 1 ? "/image-urbano.png" : "/image-reserva.png"} 
                alt="Background Mobile" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-goyaz-darker/40" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Conteúdo Centralizado */}
      <div className="relative z-10 container mx-auto px-4 text-center mb-12 md:mb-16">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white text-xs md:text-base font-medium tracking-widest uppercase mb-3 md:mb-4"
        >
          Ajudamos você desde o início
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white text-3xl md:text-6xl font-bold mb-4 md:mb-6"
        >
          Como podemos te ajudar?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-base md:text-lg"
        >
          Selecione a opção abaixo que deseja
        </motion.p>
      </div>

      {/* Grid/Carousel de Cards */}
      <div className="relative z-10 w-full max-w-7xl px-4 group/carousel">
        {/* Setas de Navegação (Mobile/Tablet) */}
        <div className="lg:hidden absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 flex justify-between px-2 pointer-events-none">
          <button 
            onClick={() => swiperHelpRef.current?.slidePrev()}
            className={`w-10 h-10 rounded-full bg-goyaz-accent shadow-lg border border-white/20 flex items-center justify-center text-goyaz-dark pointer-events-auto active:scale-95 transition-all duration-300 ${activeHelpIndex === 0 ? 'invisible opacity-0' : 'visible opacity-100'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => swiperHelpRef.current?.slideNext()}
            className={`w-10 h-10 rounded-full bg-goyaz-accent shadow-lg border border-white/20 flex items-center justify-center text-goyaz-dark pointer-events-auto active:scale-95 transition-all duration-300 ${activeHelpIndex === 2 ? 'invisible opacity-0' : 'visible opacity-100'}`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Container Mobile/Tablet com Swiper */}
        <div className="lg:hidden">
          <Swiper
            onSwiper={(swiper) => (swiperHelpRef.current = swiper)}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            onSlideChange={(swiper) => setActiveHelpIndex(swiper.realIndex)}
            modules={[EffectCoverflow]}
            className="w-full pb-12 overflow-visible"
          >
            {/* Card Rurais */}
            <SwiperSlide className="w-[calc(100vw-64px)] max-w-[400px]">
              <div className="bg-white rounded-tl-[32px] rounded-[10px] p-6 flex flex-col h-[520px] shadow-2xl">
                <span className="text-[#00D65F] text-xs font-bold tracking-widest uppercase mb-2">Regularização</span>
                <h3 className="text-goyaz-dark text-3xl font-bold mb-6">Rurais</h3>
                <p className="text-gray-900 font-bold text-sm mb-4">Precisaremos das seuintes informações e documentações</p>
                <ul className="space-y-3 mb-10 flex-grow">
                  {['CAR (Cadastro Ambiental Rural)', 'Georreferenciamento', 'Documentação do terreno', 'CCIR', 'ITR + Declaração'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D65F] mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setDocsModal({ isOpen: true, type: 'rural' })}
                  className="w-full bg-[#00D65F] hover:bg-[#00B851] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-6"
                >
                  Enviar documentos
                </button>
                <a href="#" className="text-center text-gray-900 font-bold text-sm underline underline-offset-4">
                  Caso tenha dúvida entre em contato com nosso time de suporte
                </a>
              </div>
            </SwiperSlide>

            {/* Card Urbanas */}
            <SwiperSlide className="w-[calc(100vw-64px)] max-w-[400px]">
              <div className="bg-white rounded-tl-[32px] rounded-[10px] p-6 flex flex-col h-[520px] shadow-2xl">
                <span className="text-[#00D65F] text-xs font-bold tracking-widest uppercase mb-2">Regularização</span>
                <h3 className="text-goyaz-dark text-3xl font-bold mb-6">Urbanas</h3>
                <p className="text-gray-900 font-bold text-sm mb-4">Precisaremos das seuintes informações e documentacões </p>
                <ul className="space-y-3 mb-10 flex-grow">
                  {['Tipo de empreendimento', 'Endereço completo', 'Documentação de posse', 'IPTU', 'Benfeitorias'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D65F] mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setDocsModal({ isOpen: true, type: 'urbano' })}
                  className="w-full bg-[#00D65F] hover:bg-[#00B851] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-6"
                >
                  Enviar documentação
                </button>
                <a href="#" className="text-center text-gray-900 font-bold text-sm underline underline-offset-4">
                  Caso tenha dúvida entre em contato com nosso time de suporte
                </a>
              </div>
            </SwiperSlide>

            {/* Card Ambiental */}
            <SwiperSlide className="w-[calc(100vw-64px)] max-w-[400px]">
              <div className="bg-white rounded-tl-[32px] rounded-[10px] p-6 flex flex-col h-[520px] shadow-2xl">
                <span className="text-[#00D65F] text-xs font-bold tracking-widest uppercase mb-2">Regularização</span>
                <h3 className="text-goyaz-dark text-3xl font-bold mb-6">Ambiental</h3>
                <p className="text-gray-900 font-bold text-sm mb-4">Zona urbana: tipo de empreendimento e endereço (Mercado, posto). Zona rural: CAR, georreferenciamento e documentação do terreno.</p>
                <ul className="space-y-3 mb-10 flex-grow">
                  {['Tipo de empreendimento e endereço', 'CAR e georreferenciamento', 'Documentação do terreno', 'Licenciamento ambiental'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D65F] mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setDocsModal({ isOpen: true, type: 'ambiental' })}
                  className="w-full bg-[#00D65F] hover:bg-[#00B851] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-6"
                >
                  Solicitar consultoria
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a href="#" className="text-center text-gray-900 font-bold text-sm underline underline-offset-4">
                  Caso tenha dúvida entre em contato com nosso time de suporte
                </a>
              </div>
            </SwiperSlide>

            {/* Card Reserva Legal */}
            <SwiperSlide className="w-[calc(100vw-64px)] max-w-[400px]">
              <div className="bg-white rounded-tl-[32px] rounded-[10px] p-6 flex flex-col h-[520px] shadow-2xl">
                <span className="text-[#00D65F] text-xs font-bold tracking-widest uppercase mb-2">Reservas legais disponíveis</span>
                <h3 className="text-goyaz-dark text-3xl font-bold mb-6">Reserva Legal</h3>
                <p className="text-gray-900 font-bold text-sm mb-4">Confira as opções de reservas legais disponíveis.</p>
                <div className="rounded-2xl overflow-hidden mb-10 flex-grow border border-gray-100">
                  <img src="/image-reserva.png" alt="Reserva Legal" className="w-full h-48 object-cover" />  
                </div>
                <Link 
                  href="/vendas?category=Reserva%20legal"
                  className="w-full bg-[#00D65F] hover:bg-[#00B851] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-6"
                >
                  Ver reservas
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#" className="text-center text-gray-900 font-bold text-sm underline underline-offset-4">
                  Caso tenha dúvida entre em contato com nosso time de suporte
                </a>
              </div>
            </SwiperSlide>
          </Swiper>

          {/* Dots de navegação mobile/tablet */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveHelpIndex(idx);
                  swiperHelpRef.current?.slideTo(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeHelpIndex === idx ? 'bg-goyaz-accent w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Carousel Desktop */}
        <div className="hidden lg:block">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={32}
            slidesPerView={3}
            navigation={{
              nextEl: '.services-next',
              prevEl: '.services-prev',
            }}
            pagination={{
              el: '.services-pagination',
              clickable: true,
            }}
            breakpoints={{
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="services-swiper"
          >
            {/* Card Rurais */}
            <SwiperSlide>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-tl-[32px] rounded-[10px] p-8 flex flex-col h-[520px] shadow-2xl"
              >
                <span className="text-[#00D65F] text-xs font-bold tracking-widest uppercase mb-2">Regularização</span>
                <h3 className="text-goyaz-dark text-3xl font-bold mb-6">Rurais</h3>
                <p className="text-gray-900 font-bold text-sm mb-4">Precisaremos das seuintes informações e documentações</p>
                <ul className="space-y-3 mb-10 flex-grow">
                  {['CAR (Cadastro Ambiental Rural)', 'Georreferenciamento', 'Documentação do terreno', 'CCIR', 'ITR + Declaração'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D65F] mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setDocsModal({ isOpen: true, type: 'rural' })}
                  className="w-full bg-[#00D65F] hover:bg-[#00B851] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-6"
                >
                  Enviar documentos
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <a href="#" className="text-center text-gray-900 font-bold text-sm underline underline-offset-4 hover:text-goyaz-accent transition-colors">
                  Caso tenha dúvida entre em contato com nosso time de suporte
                </a>
              </motion.div>
            </SwiperSlide>

            {/* Card Urbanas */}
            <SwiperSlide>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-tl-[32px] rounded-[10px] p-8 flex flex-col h-[520px] shadow-2xl"
              >
                <span className="text-[#00D65F] text-xs font-bold tracking-widest uppercase mb-2">Regularização</span>
                <h3 className="text-goyaz-dark text-3xl font-bold mb-6">Urbanas</h3>
                <p className="text-gray-900 font-bold text-sm mb-4">Precisaremos das seuintes informações e documentações</p>
                <ul className="space-y-3 mb-10 flex-grow">
                  {['Tipo de empreendimento', 'Endereço completo', 'Documentação de posse', 'IPTU', 'Benfeitorias'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D65F] mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setDocsModal({ isOpen: true, type: 'urbano' })}
                  className="w-full bg-[#00D65F] hover:bg-[#00B851] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-6"
                >
                  Enviar documentação
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <a href="#" className="text-center text-gray-900 font-bold text-sm underline underline-offset-4 hover:text-goyaz-accent transition-colors">
                  Caso tenha dúvida entre em contato com nosso time de suporte
                </a>
              </motion.div>
            </SwiperSlide>

            {/* Card Ambiental */}
            <SwiperSlide>
              <motion.div  
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-tl-[32px] rounded-[10px] p-8 flex flex-col h-[520px] shadow-2xl"
              >
                <span className="text-[#00D65F] text-xs font-bold tracking-widest uppercase mb-2">Regularização</span>
                <h3 className="text-goyaz-dark text-3xl font-bold mb-6">Ambiental</h3>
                <p className="text-gray-900 font-bold text-sm mb-4">Precisaremos das seguintes informações e documentações</p>
                <ul className="space-y-3 mb-10 flex-grow">
                  {['Tipo de empreendimento e endereço', 'CAR e georreferenciamento', 'Documentação do terreno', 'Licenciamento ambiental'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D65F] mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setDocsModal({ isOpen: true, type: 'ambiental' })}
                  className="w-full bg-[#00D65F] hover:bg-[#00B851] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-6"
                >
                  Solicitar consultoria
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a href="#" className="text-center text-gray-900 font-bold text-sm underline underline-offset-4 hover:text-goyaz-accent transition-colors">
                  Caso tenha dúvida entre em contato com nosso time de suporte
                </a>
              </motion.div>
            </SwiperSlide>

            {/* Card Reserva Legal */}
            <SwiperSlide>
              <motion.div  
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-tl-[32px] rounded-[10px] p-8 flex flex-col h-[520px] shadow-2xl"
              >
                <span className="text-[#00D65F] text-xs font-bold tracking-widest uppercase mb-2">Reservas legais disponíveis</span>
                <h3 className="text-goyaz-dark text-3xl font-bold mb-6">Reserva Legal</h3>
                <p className="text-gray-900 font-bold text-sm mb-4">Confira as opções de reservas legais disponíveis.</p>
                <div className="rounded-2xl overflow-hidden mb-10 flex-grow border border-gray-100">
                  <img src="/image-reserva.png" alt="Reserva Legal" className="w-full h-48 object-cover" />  
                </div>
                <Link 
                  href="/vendas?category=Reserva%20Legal"
                  className="w-full bg-[#00D65F] hover:bg-[#00B851] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-6"
                >
                  Ver reservas
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#" className="text-center text-gray-900 font-bold text-sm underline underline-offset-4 hover:text-goyaz-accent transition-colors">
                  Caso tenha dúvida entre em contato com nosso time de suporte
                </a>
              </motion.div>
            </SwiperSlide>
          </Swiper>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button className="services-prev w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-6 h-6 text-goyaz-dark" />
            </button>
            <div className="services-pagination flex gap-2"></div>
            <button className="services-next w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-6 h-6 text-goyaz-dark" />
            </button>
          </div>
        </div>
      </div>
    </section>

      {/* Seção Histórias de Sucesso */}
      <section className="relative w-full py-24 bg-[#3D2D27] overflow-hidden">
        {/* Background Logo Opaca */}
        <div className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none">
          <img 
            src="/logo-bg.png" 
            alt="Goyaz Background" 
            className="w-full h-auto object-contain translate-y-1/4"
          />
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-goyaz-accent text-sm lg:text-base font-bold tracking-widest uppercase mb-4"
            >
              Histórias de Sucesso
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight"
            >
              Clientes Que Transformaram Sua Regularização Com Nossa Solução
            </motion.h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Carousel Container - Desktop */}
            <div className="hidden lg:block relative overflow-hidden px-4">
              <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 xl:p-12 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center shadow-2xl relative"
                  >
                    {/* Quote Icon Background */}
                    <Quote className="absolute top-4 right-4 lg:top-8 lg:right-8 w-16 h-16 lg:w-20 xl:w-24 lg:h-20 xl:h-24 text-gray-100 -z-0 rotate-12" />

                    {/* Imagem do Cliente */}
                    <div className="relative z-10 w-24 h-24 lg:w-40 xl:w-48 lg:h-40 xl:h-48 flex-shrink-0">
                      <div className="w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden border-4 border-goyaz-accent/20">
                        <img 
                          src={testimonials[currentTestimonial].image} 
                          alt={testimonials[currentTestimonial].name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 lg:-bottom-4 lg:-right-4 bg-goyaz-accent p-2 lg:p-3 rounded-xl lg:rounded-2xl shadow-lg">
                        <Quote className="w-4 h-4 lg:w-5 xl:w-6 lg:h-5 xl:h-6 text-white fill-current" />
                      </div>
                    </div>

                    {/* Conteúdo do Depoimento */}
                    <div className="relative z-10 flex-grow text-center lg:text-left">
                      <div className="flex justify-center lg:justify-start gap-1 mb-4 lg:mb-6">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 lg:w-5 h-5 text-goyaz-accent fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-gray-700 text-base lg:text-lg xl:text-xl italic leading-relaxed mb-6 lg:mb-8">
                        "{testimonials[currentTestimonial].text}"
                      </p>

                      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="text-center lg:text-left">
                          <h4 className="text-goyaz-dark font-bold text-lg lg:text-xl xl:text-2xl lowercase">{testimonials[currentTestimonial].name}</h4>
                          <p className="text-gray-500 text-xs lg:text-sm xl:text-base lowercase">
                            {testimonials[currentTestimonial].role} • <span className="text-goyaz-accent font-medium">{testimonials[currentTestimonial].property}</span>
                          </p>
                        </div>

                        <button className="w-full lg:w-auto bg-goyaz-accent hover:bg-goyaz-yellow transition-all duration-300 text-white font-bold py-3 px-6 lg:px-8 rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1">
                          <img src="/logo-branca.png" alt="Logo" className="w-5 h-5 object-contain" />
                          Regularizar Agora
                        </button>
                      </div>
                    </div>
                  </motion.div>
              </AnimatePresence>
            </div>

            {/* Swiper Carousel - Mobile */}
            <div className="lg:hidden px-4">
              <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                modules={[EffectCoverflow, Autoplay]}
                className="w-full py-10"
                onSlideChange={(swiper) => setCurrentTestimonial(swiper.activeIndex)}
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={index} className="w-[85%] sm:w-[70%]">
                    <div className="bg-white rounded-[32px] p-6 flex flex-col items-center shadow-xl relative overflow-hidden">
                      <Quote className="absolute top-4 right-4 w-12 h-12 text-gray-100 -z-0 rotate-12" />
                      
                      {/* Imagem do Cliente */}
                      <div className="relative z-10 w-20 h-20 mb-4">
                        <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-goyaz-accent/20">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-goyaz-accent fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-gray-700 text-sm italic leading-relaxed text-center mb-6">
                        "{testimonial.text}"
                      </p>

                      <div className="text-center mb-6">
                        <h4 className="text-goyaz-dark font-bold text-lg lowercase">{testimonial.name}</h4>
                        <p className="text-gray-500 text-[10px] lowercase">
                          {testimonial.role} • <span className="text-goyaz-accent font-medium">{testimonial.property}</span>
                        </p>
                      </div>

                      <button className="w-full bg-goyaz-accent text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm">
                        <img src="/logo-branca.png" alt="Logo" className="w-4 h-4 object-contain" />
                        Regularizar Agora
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Indicadores (Dots) */}
            <div className="flex justify-center gap-3 mt-4 lg:mt-12">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2.5 transition-all duration-500 rounded-full ${
                    currentTestimonial === idx ? 'w-10 bg-goyaz-accent' : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Ir para depoimento ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção Final CTA */}
      <section className="relative w-full pt-16 lg:pt-24 pb-0 overflow-hidden flex items-end min-h-[600px] lg:min-h-[550px] z-10">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/bg-plantio.png" 
            alt="Background Plantio" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto max-w-7xl px-6 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-16">
            {/* Imagem do Senhor */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 flex justify-center lg:justify-start items-end relative z-40 order-2 lg:order-1"
            >
              <div className="relative group flex items-end">
                <div className="absolute -inset-4 bg-goyaz-accent/20 rounded-[50px] blur-xl group-hover:bg-goyaz-accent/30 transition-all duration-500" />
                <img 
                  src="/imagem-senhor.png" 
                  alt="Produtor Rural" 
                  className="relative rounded-t-[32px] lg:rounded-t-[40px] shadow-2xl w-full max-w-[220px] sm:max-w-[280px] lg:max-w-md object-cover border-2 border-white/10 border-b-0 -mb-1 lg:-mb-2"
                />
              </div>
            </motion.div>

            {/* Texto e CTA */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 text-white text-center lg:text-left pb-16 lg:pb-24 order-1 lg:order-2"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight px-2 lg:px-0">
                Regularização Ambiental Completa
              </h2>
              <p className="text-sm lg:text-lg text-white/90 mb-8 lg:mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 px-4 lg:px-0">
                Atuamos em áreas rurais e urbanas, oferecendo suporte técnico e jurídico em todo o processo de regularização ambiental. Garantimos conformidade total com as normas ambientais e fundiárias.
              </p>
              
              <button className="bg-goyaz-accent hover:bg-goyaz-yellow transition-all duration-300 text-white font-bold py-3.5 lg:py-4 px-8 lg:px-10 rounded-full flex items-center gap-3 lg:gap-4 shadow-2xl hover:shadow-goyaz-accent/30 hover:-translate-y-1 mx-auto lg:mx-0">
                <div className="bg-white/20 p-1.5 lg:p-2 rounded-lg lg:rounded-xl">
                  <img src="/logo-branca.png" alt="G" className="w-4 h-4 lg:w-5 lg:h-5 object-contain" />
                </div>
                <span className="text-sm lg:text-base">Fale Com Um Especialista</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 -mt-6 lg:-mt-12 bg-transparent">
        <div className="bg-white rounded-t-[32px] lg:rounded-t-[60px] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="container mx-auto max-w-7xl px-6 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
              
              {/* Logo e Info */}
              <div className="flex flex-col items-center lg:items-start gap-6 col-span-1 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="bg-goyaz-dark p-2 rounded-xl shadow-lg">
                    <img src="/logo-branca.png" alt="Goyaz" className="w-7 h-7 object-contain" />
                  </div>
                  <span className="text-xl font-black text-goyaz-dark tracking-tighter uppercase">Goyaz</span>
                </div>
                <div className="space-y-6 w-full">
                  <div className="text-center lg:text-left">
                    <h4 className="text-goyaz-accent font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Unidade São Paulo</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Avenida Otto Baumgart, 800<br />Vila Guilherme - SP
                    </p>
                  </div>
                  <div className="text-gray-500 text-xs space-y-2 text-center lg:text-left border-t border-gray-100 pt-4 lg:border-0 lg:pt-0">
                    <p className="font-medium text-goyaz-dark">(11) 99204-4690</p>
                    <p className="font-medium text-goyaz-dark">(11) 94048-1246</p>
                    <p className="text-gray-400">(11) 2975-2711 - Ramal 104</p>
                  </div>
                </div>
              </div>

              {/* Navegação */}
              <div className="grid grid-cols-2 gap-8 col-span-1 lg:col-span-2 lg:px-12">
                <div className="flex flex-col items-center lg:items-start gap-4">
                  <h4 className="text-goyaz-dark font-black text-[10px] uppercase tracking-[0.2em]">Empresa</h4>
                  <nav className="flex flex-col gap-3">
                    <a href="#" className="text-gray-500 hover:text-goyaz-accent transition-all text-xs hover:translate-x-1">Início</a>
                    <a href="#" className="text-gray-500 hover:text-goyaz-accent transition-all text-xs hover:translate-x-1">Sobre Nós</a>
                    <a href="#" className="text-gray-500 hover:text-goyaz-accent transition-all text-xs hover:translate-x-1">Serviços</a>
                  </nav>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-4">
                  <h4 className="text-goyaz-dark font-black text-[10px] uppercase tracking-[0.2em]">Suporte</h4>
                  <nav className="flex flex-col gap-3">
                    <a href="#" className="text-gray-500 hover:text-goyaz-accent transition-all text-xs hover:translate-x-1">Privacidade</a>
                    <a href="#" className="text-gray-500 hover:text-goyaz-accent transition-all text-xs hover:translate-x-1">Contato</a>
                  </nav>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="flex flex-col items-center lg:items-end gap-6 col-span-1 lg:col-span-1">
                <h4 className="text-goyaz-dark font-black text-[10px] uppercase tracking-[0.2em]">Siga-nos</h4>
                <div className="flex gap-4">
                  {[
                    { icon: MessageCircle, href: "#" },
                    { icon: Facebook, href: "#" },
                    { icon: Instagram, href: "#" }
                  ].map((social, i) => (
                    <a key={i} href={social.href} className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-goyaz-dark hover:bg-goyaz-accent hover:text-white transition-all duration-300 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1">
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
                <div className="text-center lg:text-right mt-2">
                  <p className="text-gray-400 text-[9px] uppercase tracking-widest">
                    Desenvolvido por
                  </p>
                  <p className="text-goyaz-dark font-bold text-xs">Link System</p>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Barra Final */}
        <div className="py-8 text-center px-4">
          <p className="text-gray-400 text-[8px] lg:text-[9px] uppercase tracking-[0.3em] leading-relaxed">
            © 2026 Goyaz Soluções Fundiárias & Ambientais.<br className="lg:hidden" /> Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Botão WhatsApp Flutuante */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={whatsappPhraseIndex}
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-gray-100 mb-1"
          >
            <p className="text-goyaz-dark text-xs font-semibold whitespace-nowrap">
              {whatsappPhrases[whatsappPhraseIndex]}
            </p>
            {/* Triângulo do balão */}
            <div className="absolute -bottom-1 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100"></div>
          </motion.div>
        </AnimatePresence>

        <motion.a
          href="https://wa.me/5511992044690"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)]"
        >
          {/* Efeito de Pulso */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25"></span>
          
          <IconBrandWhatsapp className='text-white h-10 w-10'/>
          
          {/* Badge de notificação */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
        </motion.a>
      </div>
    </>
  );
}
