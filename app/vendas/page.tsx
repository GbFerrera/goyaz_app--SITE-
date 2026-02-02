'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Ruler, CloudRain, ArrowRight, Filter, X } from 'lucide-react';

interface Sale {
  id: number;
  admin_id: number;
  photos?: any; // Can be string[], JSON string, or array of objects
  category?: string;
  size?: string;
  price?: number;
  localization?: string;
  descriptions?: string;
  pluviometria?: string;
  created_at?: string;
  updated_at?: string;
}

function VendasContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://http://192.168.1.38:3433:3433';
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showPluviometria, setShowPluviometria] = useState(false);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    async function fetchSales() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/sales`);
        const data = await res.json();
        setSales(Array.isArray(data) ? data : []);
        setFilteredSales(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar propriedades:', err);
        setError('Não foi possível carregar as propriedades');
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, []);

  useEffect(() => {
    let result = sales;

    if (searchTerm) {
      result = result.filter(sale => 
        sale.localization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.descriptions?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'Todas') {
      result = result.filter(sale => sale.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    setFilteredSales(result);
  }, [searchTerm, selectedCategory, sales]);

  const categories = ['Todas', ...Array.from(new Set(sales.map(s => s.category).filter(Boolean))) as string[]];

  const formatCurrency = (value: number | string | undefined) => {
    if (!value) return '';
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const parsePhotos = (photos: any): string[] => {
    if (!photos) return [];
    if (Array.isArray(photos)) {
      return photos.map(p => typeof p === 'string' ? p : p.url).filter(Boolean);
    }
    if (typeof photos === 'string') {
      try {
        const parsed = JSON.parse(photos);
        if (Array.isArray(parsed)) return parsed.map(p => typeof p === 'string' ? p : p.url).filter(Boolean);
      } catch {
        return photos.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  return (
    <main className="min-h-screen bg-white pt-12 lg:pt-5">
      {/* Header Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-goyaz-accent/10 rounded-full mb-6"
            >
            
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold text-goyaz-dark mb-6 tracking-tight"
            >
              Propriedades Disponíveis
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-500 max-w-2xl leading-relaxed"
            >
              Explore nossa seleção de áreas rurais e urbanas com documentação completa 
              e reserva legal regularizada pela nossa equipe de especialistas.
            </motion.p>
          </div>

          {/* Search and Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 p-4 lg:p-6 mb-12 border border-gray-100 max-w-4xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Buscar por localização ou descrição..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-goyaz-accent/20 transition-all text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="relative min-w-[180px]">
                  <select 
                    className="w-full appearance-none px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-goyaz-accent/20 transition-all text-gray-700 font-medium cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sales Grid */}
      <section className="pb-24">
        <div className="container mx-auto max-w-7xl px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-goyaz-accent/20 border-t-goyaz-accent rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-500 font-medium">Buscando as melhores áreas para você...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-[40px] border border-red-100">
              <p className="text-red-600 font-medium mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-4 bg-goyaz-dark text-white rounded-2xl hover:bg-black transition-all font-bold"
              >
                Tentar Novamente
              </button>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-gray-100">
              <p className="text-gray-500 font-medium">Nenhuma propriedade encontrada com esses filtros.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('Todas');}}
                className="mt-4 text-goyaz-accent font-bold hover:underline"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              <AnimatePresence>
                {filteredSales.map((sale, index) => {
                  const salePhotos = parsePhotos(sale.photos);
                  return (
                    <motion.div
                      key={sale.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2"
                    >
                      {/* Card Image */}
                      <div className="relative h-72 overflow-hidden">
                        {salePhotos.length > 0 ? (
                          <img 
                            src={salePhotos[0]} 
                            alt={sale.category || 'Propriedade'} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <img src="/logo-preta.png" alt="Logo" className="w-12 h-12 opacity-10" />
                          </div>
                        )}
                        
                        {/* Price Badge */}
                        {sale.price && sale.price > 0 && (
                          <div className="absolute top-6 right-6 px-5 py-2.5 bg-white/95 backdrop-blur-sm text-goyaz-dark font-black rounded-2xl shadow-xl text-sm border border-white/20">
                            {Number(sale.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute bottom-6 left-6 px-4 py-1.5 bg-goyaz-accent text-white font-bold rounded-xl shadow-lg text-[10px] uppercase tracking-wider">
                          {sale.category || 'Geral'}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-8">
                        <div className="flex items-start gap-3 mb-4">
                          <MapPin className="w-5 h-5 text-goyaz-accent shrink-0 mt-1" />
                          <h3 className="text-xl lg:text-2xl font-bold text-goyaz-dark leading-tight lowercase first-letter:uppercase">
                            {sale.localization || 'Localização não informada'}
                          </h3>
                        </div>

                        <p className="text-gray-500 text-sm lg:text-base mb-8 line-clamp-2 leading-relaxed lowercase first-letter:uppercase">
                          {sale.descriptions || 'Área com documentação completa e reserva legal regularizada pela Goyaz.'}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-gray-50">
                          {sale.category && ['imóvel rural', 'imóvel urbano', 'reserva legal'].includes(sale.category.toLowerCase()) && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Ruler className="w-4 h-4" />
                              <span className="text-xs font-medium uppercase tracking-tight">{sale.size || '-'}</span>
                            </div>
                          )}
                          {sale.pluviometria && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSale(sale);
                                setShowPluviometria(true);
                              }}
                              className="flex items-center gap-2 text-goyaz-accent hover:text-goyaz-yellow transition-colors group/pluv"
                            >
                              <CloudRain className="w-4 h-4" />
                              <span className="text-xs font-bold uppercase tracking-tight underline decoration-goyaz-accent/30 underline-offset-4">Índice Pluv.</span>
                            </button>
                          )}
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => {
                            setSelectedSale(sale);
                            setActivePhotoIndex(0);
                          }}
                          className="w-full bg-gray-50 group-hover:bg-goyaz-accent text-gray-700 group-hover:text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300"
                        >
                          <span>Ver Detalhes</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Reusing Branding */}
      <section className="bg-goyaz-dark py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img src="/logo-branca.png" alt="Logo" className="w-full h-auto translate-x-1/2 translate-y-1/4 scale-150" />
        </div>
        
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[60px] p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Não encontrou o que procurava?</h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Temos uma base de dados offline com centenas de outras propriedades. 
                Fale com nossos especialistas e encontraremos a área ideal para o seu projeto.
              </p>
            </div>
            
            <a 
              href="https://wa.me/5511992044690" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-goyaz-accent hover:bg-goyaz-yellow transition-all duration-300 text-white font-bold py-5 px-10 rounded-full flex items-center gap-4 shadow-2xl hover:shadow-goyaz-accent/30 hover:-translate-y-1 whitespace-nowrap"
            >
              <div className="bg-white/20 p-2 rounded-xl">
                <img src="/logo-branca.png" alt="G" className="w-5 h-5 object-contain" />
              </div>
              <span>Falar com Consultor</span>
            </a>
          </div>
        </div>
      </section>

      {/* Property Details Modal */}
      <AnimatePresence>
        {selectedSale && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSale(null)}
              className="absolute inset-0 bg-goyaz-dark/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedSale(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white lg:text-goyaz-dark lg:bg-gray-100 lg:hover:bg-gray-200 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Gallery */}
              <div className="w-full lg:w-3/5 bg-black relative flex items-center justify-center min-h-[300px] lg:min-h-0">
                {parsePhotos(selectedSale.photos).length > 0 ? (
                  <>
                    <img 
                      src={parsePhotos(selectedSale.photos)[activePhotoIndex]} 
                      alt="Property" 
                      className="w-full h-full object-contain"
                    />
                    
                    {parsePhotos(selectedSale.photos).length > 1 && (
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-2xl">
                        {parsePhotos(selectedSale.photos).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activePhotoIndex ? 'bg-goyaz-accent w-8' : 'bg-white/50 hover:bg-white'}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-white/20">
                    <img src="/logo-branca.png" alt="Logo" className="w-20 opacity-10" />
                    <p className="text-sm font-medium">Sem fotos disponíveis</p>
                  </div>
                )}
              </div>

              {/* Modal Content */}
              <div className="w-full lg:w-2/5 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
                <div className="inline-block px-4 py-1.5 bg-goyaz-accent/10 rounded-full mb-6">
                  <span className="text-goyaz-accent font-bold text-xs uppercase tracking-widest">
                    {selectedSale.category || 'Oportunidade'}
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-goyaz-dark mb-6 leading-tight lowercase first-letter:uppercase">
                  {selectedSale.localization}
                </h2>

                <div className="flex items-center gap-4 mb-8">
                  <div className="text-3xl font-black text-goyaz-accent">
                    {formatCurrency(selectedSale.price)}
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  {selectedSale.category && ['imóvel rural', 'imóvel urbano', 'reserva legal'].includes(selectedSale.category.toLowerCase()) && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 rounded-2xl text-goyaz-accent">
                        <Ruler className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Área Total</p>
                        <p className="text-lg font-bold text-goyaz-dark">{selectedSale.size || 'Sob consulta'}</p>
                      </div>
                    </div>
                  )}

                  {selectedSale.pluviometria && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-50 rounded-2xl text-goyaz-accent">
                          <CloudRain className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Índice Pluviométrico</p>
                          <p className="text-sm font-medium text-gray-500">Mapa de precipitação da região</p>
                        </div>
                      </div>
                      <div className="mt-2 rounded-3xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 group/map relative">
                        <img 
                          src={selectedSale.pluviometria} 
                          alt="Mapa Pluviométrico" 
                          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                          onClick={() => setShowPluviometria(true)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/map:bg-black/5 transition-colors pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl text-goyaz-accent">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Localização</p>
                      <p className="text-lg font-bold text-goyaz-dark lowercase first-letter:uppercase">{selectedSale.localization}</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm text-gray-500 mb-12">
                  <p className="text-base leading-relaxed whitespace-pre-line lowercase first-letter:uppercase">
                    {selectedSale.descriptions}
                  </p>
                </div>

                <a 
                  href={`https://wa.me/5511992044690?text=Olá, tenho interesse na propriedade em ${selectedSale.localization} (${selectedSale.category})`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-goyaz-dark hover:bg-black text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl hover:shadow-gray-200"
                >
                  <img src="/logo-branca.png" alt="G" className="w-5 h-5 object-contain" />
                  <span>Tenho Interesse</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Pluviometria Image Modal */}
      <AnimatePresence>
        {showPluviometria && selectedSale?.pluviometria && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPluviometria(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center"
            >
              <button 
                onClick={() => setShowPluviometria(false)}
                className="absolute -top-12 lg:top-0 right-0 z-10 p-3 text-white hover:text-goyaz-accent transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={selectedSale.pluviometria} 
                  alt="Mapa Pluviométrico Full" 
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                />
              </div>

              <div className="mt-6 text-center">
                <p className="text-white font-bold text-xl mb-1">{selectedSale.localization}</p>
                <p className="text-white/60 text-sm">Índice Pluviométrico da Propriedade</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Vendas() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-goyaz-accent/20 border-t-goyaz-accent rounded-full animate-spin"></div>
      </div>
    }>
      <VendasContent />
    </Suspense>
  );
}
