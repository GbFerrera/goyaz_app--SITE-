"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconBrandWhatsapp, IconChevronDown, IconChevronRight, IconLayoutGrid } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://http://localhost:3334:3433';
  const [categories, setCategories] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push(`/?scroll=${sectionId}`);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollTarget = params.get('scroll');
    if (scrollTarget) {
      const checkElement = setInterval(() => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          clearInterval(checkElement);
          // Limpa o parâmetro da URL sem recarregar a página
          window.history.replaceState({}, '', '/');
        }
      }, 100);
      
      // Timeout de segurança
      setTimeout(() => clearInterval(checkElement), 2000);
    }
  }, [pathname]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE}/sales`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const uniqueCategories = Array.from(new Set(data.map((s: any) => s.category).filter(Boolean))) as string[];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Erro ao buscar categorias para navbar:', err);
      }
    }
    fetchCategories();
  }, [API_BASE]);

  const navItems = [
    {
      name: "Serviços",
      link: "/",
    },
    {
      name: "Vendas",
      link: "/vendas",
      hasDropdown: true,
    },
    {
      name: "Sobre nós",
      link: "/sobre",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          
          <div className="flex items-center justify-center flex-1 relative h-full">
            {navItems.map((item, idx) => (
              <div 
                key={item.name}
                className="relative h-full flex items-center px-4 py-2"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <a
                  href={item.link}
                  onClick={(e) => {
                    if (item.name === "Sobre nós") handleSectionClick(e, "quem-somos");
                    if (item.name === "Serviços") handleSectionClick(e, "como-ajudar");
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-goyaz-dark dark:text-neutral-300 hover:text-goyaz-accent transition-colors relative z-20"
                >
                  {item.name}
                  {item.hasDropdown && (
                    <IconChevronDown className={cn("w-4 h-4 transition-transform duration-200", hoveredItem === item.name && "rotate-180")} />
                  )}
                </a>

                <AnimatePresence>
                  {item.hasDropdown && hoveredItem === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64"
                    >
                      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden p-2">
                        {categories.length > 0 ? (
                          <div className="flex flex-col">
                            <a
                              href="/vendas"
                              className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm font-bold text-goyaz-accent transition-colors"
                            >
                              Ver Tudo
                            </a>
                            <div className="h-px bg-gray-100 dark:bg-neutral-800 my-1 mx-2" />
                            {categories.map((cat) => (
                              <a
                                key={cat}
                                href={`/vendas?category=${encodeURIComponent(cat)}`}
                                className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm text-gray-600 dark:text-neutral-400 hover:text-goyaz-dark dark:hover:text-white transition-colors capitalize"
                              >
                                {cat}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400 text-center">
                            Carregando categorias...
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="relative z-20 hidden lg:flex items-center space-x-2">
            <NavbarButton
              href="/contato"
              variant="secondary"
              className="text-goyaz-dark dark:text-white hover:text-goyaz-accent transition-colors flex items-center gap-2"
            >
            <IconBrandWhatsapp className="w-6 h-6 text-green-500" /> Fale Conosco
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <div key={`mobile-group-${idx}`} className="w-full">
                <a
                  href={item.link}
                  onClick={(e) => {
                    if (item.name === "Sobre nós") {
                      handleSectionClick(e, "quem-somos");
                      setIsMobileMenuOpen(false);
                    } else if (item.name === "Serviços") {
                      handleSectionClick(e, "como-ajudar");
                      setIsMobileMenuOpen(false);
                    } else if (!item.hasDropdown) {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="relative text-lg font-medium text-goyaz-dark dark:text-neutral-300 hover:text-goyaz-accent transition-colors py-2 flex items-center justify-between w-full"
                >
                  <span>{item.name}</span>
                </a>
                
                {item.hasDropdown && categories.length > 0 && (
                  <div className="mt-2 ml-2 flex flex-col gap-1 border-l-2 border-gray-100 dark:border-neutral-800 pl-4 py-1">
                    <a
                      href="/vendas"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-goyaz-accent/5 text-goyaz-accent text-sm font-bold transition-colors"
                    >
                      <IconLayoutGrid className="w-4 h-4" />
                      Ver Tudo
                    </a>
                    
                    {categories.map((cat) => (
                      <a
                        key={`mobile-cat-${cat}`}
                        href={`/vendas?category=${encodeURIComponent(cat)}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900 text-sm text-gray-600 dark:text-neutral-400 hover:text-goyaz-dark dark:hover:text-white transition-colors capitalize"
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-neutral-700" />
                          {cat}
                        </span>
                        <IconChevronRight className="w-4 h-4 opacity-50" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800 w-full">
              <NavbarButton
                href="/contato"
                variant="secondary"
                className="w-full text-goyaz-dark dark:text-white flex items-center justify-center gap-2"
              >
                <IconBrandWhatsapp className="w-6 h-6 text-green-500" /> Fale Conosco
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
