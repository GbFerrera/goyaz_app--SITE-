"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";

export function AppNavbar() {
  const navItems = [
    {
      name: "Serviços",
      link: "/",
    },
    {
      name: "Vendas",
      link: "/vendas",
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
          <NavItems items={navItems} />
          <div className="relative z-20 hidden lg:flex items-center space-x-2">
            <NavbarButton
              href="/contato"
              variant="secondary"
              className="text-goyaz-dark dark:text-white hover:text-goyaz-primary transition-colors"
            >
              Fale Conosco
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
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-lg font-medium text-goyaz-dark dark:text-neutral-300 hover:text-goyaz-primary transition-colors py-2"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800 w-full">
              <NavbarButton
                href="/contato"
                variant="secondary"
                className="w-full text-goyaz-dark dark:text-white"
              >
                Fale Conosco
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
