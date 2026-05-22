import type { ReactNode } from 'react';

interface SectionFrameProps {
  children: ReactNode;
  className?: string;
}

const ShavingCorner = ({ flip }: { flip?: boolean }) => (
  <div
    className={`absolute ${flip ? 'right-0 scale-x-[-1]' : 'left-0'} top-0 w-24 h-24 pointer-events-none overflow-hidden`}
    aria-hidden="true"
  >
    <svg viewBox="0 0 96 96" className="w-full h-full" fill="none">
      <path d="M4,4 Q24,-2 28,20 Q32,38 12,42" stroke="#c2440a" strokeWidth="2.5" strokeLinecap="round" fill="none" className="shaving-line" style={{animationDelay:'0s'}} />
      <path d="M2,18 Q18,10 26,30 Q34,48 16,52" stroke="#a83800" strokeWidth="2" strokeLinecap="round" fill="none" className="shaving-line" style={{animationDelay:'0.4s'}} />
      <path d="M14,2 Q30,8 32,26 Q34,46 18,54" stroke="#e05010" strokeWidth="2" strokeLinecap="round" fill="none" className="shaving-line" style={{animationDelay:'0.8s'}} />
      <path d="M28,4 Q46,2 50,22 Q54,42 36,48" stroke="#b84020" strokeWidth="1.5" strokeLinecap="round" fill="none" className="shaving-line" style={{animationDelay:'0.2s'}} />
      <path d="M4,32 Q10,50 30,52 Q48,54 50,72" stroke="#d04818" strokeWidth="2" strokeLinecap="round" fill="none" className="shaving-line" style={{animationDelay:'0.6s'}} />
    </svg>
  </div>
);

const ShavingCornerBottom = ({ flip }: { flip?: boolean }) => (
  <div
    className={`absolute ${flip ? 'right-0 scale-x-[-1]' : 'left-0'} bottom-0 w-24 h-24 pointer-events-none overflow-hidden`}
    aria-hidden="true"
  >
    <svg viewBox="0 0 96 96" className="w-full h-full rotate-180" fill="none">
      <path d="M4,4 Q24,-2 28,20 Q32,38 12,42" stroke="#c2440a" strokeWidth="2.5" strokeLinecap="round" fill="none" className="shaving-line" style={{animationDelay:'0.1s'}} />
      <path d="M2,18 Q18,10 26,30 Q34,48 16,52" stroke="#a83800" strokeWidth="2" strokeLinecap="round" fill="none" className="shaving-line" style={{animationDelay:'0.5s'}} />
      <path d="M14,2 Q30,8 32,26 Q34,46 18,54" stroke="#e05010" strokeWidth="2" strokeLinecap="round" fill="none" className="shaving-line" style={{animationDelay:'0.9s'}} />
    </svg>
  </div>
);

export default function SectionFrame({ children, className = '' }: SectionFrameProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <ShavingCorner />
      <ShavingCorner flip />
      <ShavingCornerBottom />
      <ShavingCornerBottom flip />
      {children}
    </div>
  );
}
