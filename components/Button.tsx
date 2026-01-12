import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  icon,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#04C55F] text-white hover:bg-[#039e4d] active:scale-95',
    secondary: 'bg-[#024344] text-white hover:bg-[#014245] active:scale-95',
    outline: 'border-2 border-[#024344] text-[#024344] hover:bg-[#024344] hover:text-white active:scale-95'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
