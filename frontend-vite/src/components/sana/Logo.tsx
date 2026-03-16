import { Package } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#2563EB] rounded-lg p-1.5 flex items-center justify-center">
        <Package className={`${sizeClasses[size]} text-white`} />
      </div>
      {showText && (
        <span className={`font-semibold text-[#0F172A] ${textSizeClasses[size]}`}>
          SANA
        </span>
      )}
    </div>
  );
}
