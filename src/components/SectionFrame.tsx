import type { ReactNode } from 'react';

interface SectionFrameProps {
  children: ReactNode;
  className?: string;
}

/* Спиральная стружка — SVG как на фото: завитой рулон со штриховкой */
const WoodCurl = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 160 110"
    className={`pointer-events-none select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Внешний завиток — большой спираль */}
    <path
      d="M140,80 C150,55 145,28 120,18 C95,8 68,20 58,42 C48,64 60,90 82,95 C104,100 124,84 128,64 C132,44 118,28 100,26 C82,24 68,36 66,52 C64,68 76,80 90,80 C104,80 112,70 110,58 C108,46 98,40 88,44"
      stroke="#d4a96a"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
      opacity="0.9"
    />
    {/* Внутренняя линия для объёма */}
    <path
      d="M138,82 C148,57 143,30 118,20 C93,10 66,22 56,44 C46,66 58,92 80,97 C102,102 122,86 126,66 C130,46 116,30 98,28 C80,26 66,38 64,54 C62,70 74,82 88,82 C102,82 110,72 108,60 C106,48 96,42 86,46"
      stroke="#c49058"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
    {/* Штриховка — рёбра стружки */}
    <path d="M132,46 C128,44 124,43 120,43" stroke="#b87c48" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M128,36 C122,33 116,32 110,33" stroke="#b87c48" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M118,26 C110,24 102,24 95,26" stroke="#b87c48" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M100,20 C90,19 80,20 72,23" stroke="#b87c48" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M76,22 C68,26 62,32 58,40" stroke="#b87c48" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M54,52 C52,60 54,70 60,78" stroke="#b87c48" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M68,90 C76,96 86,98 96,97" stroke="#b87c48" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M110,92 C118,88 124,82 126,74" stroke="#b87c48" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M130,62 C132,54 130,46 126,40" stroke="#b87c48" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    {/* Конец стружки — отогнутый край */}
    <path
      d="M86,46 C80,48 76,54 78,60 C80,66 86,68 90,65"
      stroke="#d4a96a"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />
    {/* Тень под стружкой */}
    <ellipse cx="95" cy="102" rx="42" ry="5" fill="#a0784a" opacity="0.12"/>
  </svg>
);

export default function SectionFrame({ children, className = '' }: SectionFrameProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Левый верхний угол */}
      <div className="absolute -left-4 -top-2 w-36 h-28 wood-curl-spin opacity-70">
        <WoodCurl className="w-full h-full rotate-[-20deg]" />
      </div>
      {/* Правый верхний угол */}
      <div className="absolute -right-4 -top-2 w-36 h-28 wood-curl-spin opacity-70" style={{ animationDelay: '-5s' }}>
        <WoodCurl className="w-full h-full rotate-[200deg] scale-x-[-1]" />
      </div>
      {/* Левый нижний */}
      <div className="absolute -left-4 -bottom-2 w-28 h-22 wood-curl-spin opacity-50" style={{ animationDelay: '-10s' }}>
        <WoodCurl className="w-full h-full rotate-[160deg]" />
      </div>
      {/* Правый нижний */}
      <div className="absolute -right-4 -bottom-2 w-28 h-22 wood-curl-spin opacity-50" style={{ animationDelay: '-15s' }}>
        <WoodCurl className="w-full h-full rotate-[-160deg] scale-x-[-1]" />
      </div>
      {children}
    </div>
  );
}
