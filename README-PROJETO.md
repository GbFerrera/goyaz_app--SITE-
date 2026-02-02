# Site Goyaz - Regularização Fundiária e Ambiental

Site desenvolvido com Next.js 16, React 19, TypeScript e TailwindCSS 4, seguindo princípios de mobile-first e boas práticas de programação.

## 🎨 Paleta de Cores

- **Verde Principal**: `#04C55F`
- **Verde Secundário**: `#00C65E`
- **Verde Escuro**: `#024344`
- **Verde Mais Escuro**: `#014245`
- **Amarelo**: `#FABD3B`
- **Amarelo Claro**: `#FFD759`

## 📋 Seções Implementadas

1. **Header** - Navegação fixa com menu responsivo
2. **Hero** - Seção inicial com marca d'água do logo
3. **CTA Verde** - Cards de regularização (Rural, Urbana, Reserva Legal)
4. **Depoimentos** - Seção com background escuro e cards de clientes
5. **Ajuda** - Segunda seção de cards de regularização
6. **Modal** - Modal de escolha do tipo de regularização

## 🚀 Como Executar

```bash
# Instalar dependências (se necessário)
npm install

# Executar servidor de desenvolvimento
npm run dev

# Abrir no navegador
# http://http://localhost:3334:3000
```

## 📱 Componentes

- `Header.tsx` - Cabeçalho com navegação responsiva
- `Button.tsx` - Componente de botão reutilizável com variantes
- `Modal.tsx` - Modal acessível com backdrop
- `RegularizationCard.tsx` - Cards para tipos de regularização
- `TestimonialCard.tsx` - Cards de depoimentos de clientes

## 🎯 Funcionalidades

- ✅ Design mobile-first
- ✅ Menu responsivo no mobile
- ✅ Modal interativo "Escolher Agora"
- ✅ Animações e transições suaves
- ✅ Acessibilidade (aria-labels, foco)
- ✅ TypeScript para type safety

## 🏗️ Estrutura do Projeto

```
goyaz-site/
├── app/
│   ├── page.tsx          # Página principal
│   └── globals.css       # Estilos globais e paleta
├── components/
│   ├── Header.tsx
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── RegularizationCard.tsx
│   └── TestimonialCard.tsx
└── public/               # Arquivos estáticos
```

## 🔧 Tecnologias

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript 5** - Type safety
- **TailwindCSS 4** - Estilização utility-first
- **PostCSS** - Processamento CSS
