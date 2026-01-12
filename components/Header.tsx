'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#04C55F] flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <div>
            <h1 className="text-[#04C55F] font-bold text-lg leading-tight">Goyaz</h1>
            <p className="text-xs text-gray-600 leading-tight">Regularização Fundiária e Ambiental</p>
          </div>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <ul className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 md:top-auto bg-white md:bg-transparent shadow-lg md:shadow-none gap-6 p-4 md:p-0`}>
          <li>
            <a href="/servicos" className="text-gray-700 hover:text-[#04C55F] transition-colors font-medium">
              Serviços
            </a>
          </li>
          <li>
            <a href="#sobre" className="text-gray-700 hover:text-[#04C55F] transition-colors font-medium border-b-2 border-[#04C55F]">
              Sobre Nós
            </a>
          </li>
          <li>
            <a href="#contato" className="text-gray-700 hover:text-[#04C55F] transition-colors font-medium">
              Contato
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
