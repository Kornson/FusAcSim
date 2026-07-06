import type { ReactNode } from 'react';

interface ScreenHeaderProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  maxWidth?: number;
}

export function ScreenHeader({ eyebrow, title, children, maxWidth = 640 }: ScreenHeaderProps) {
  return (
    <div style={{ textAlign: 'center', maxWidth, margin: '0 auto' }}>
      <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
        {title}
      </h2>
      {children && <p style={{ fontSize: 15, color: '#5B4B3E', margin: 0 }}>{children}</p>}
    </div>
  );
}
