'use client';

import { useEffect, useState } from 'react';

interface Sale {
  id: number;
  admin_id: number;
  photos?: string[];
  category?: string;
  size?: string;
  price?: number;
  localization?: string;
  descriptions?: string;
  pluviometria?: string;
  created_at?: string;
  updated_at?: string;
}

export default function Vendas() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3433';
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSales() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/sales`);
        const data = await res.json();
        setSales(Array.isArray(data) ? data : []);
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
  return (
    <main className="pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-goyaz-dark mb-4">
            Propriedades Disponíveis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Confira nossas propriedades com reserva legal regularizada
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-goyaz-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando propriedades...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-goyaz-primary text-white rounded-lg hover:bg-goyaz-secondary transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhuma propriedade disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-goyaz-primary/20 to-goyaz-secondary/20 flex items-center justify-center overflow-hidden">
                  {sale.photos && sale.photos.length > 0 ? (
                    <img 
                      src={sale.photos[0]} 
                      alt={sale.category || 'Propriedade'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-16 h-16 text-goyaz-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  )}
                  {sale.price && sale.price > 0 && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-goyaz-primary text-white font-bold rounded-lg shadow-lg text-sm">
                      {Number(sale.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-goyaz-primary/10 text-goyaz-primary text-xs font-bold rounded uppercase">
                      {sale.category || 'Geral'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-goyaz-dark mb-2">
                    {sale.localization || 'Localização não informada'}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {sale.descriptions || 'Área rural com documentação completa e reserva legal regularizada'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{sale.size || '-'}</span>
                    <button className="px-4 py-2 bg-goyaz-primary text-white rounded-lg hover:bg-goyaz-secondary transition-colors">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
