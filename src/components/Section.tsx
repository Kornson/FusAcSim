import type { ReactNode } from 'react';

interface SectionProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export function Section({ eyebrow, title, children }: SectionProps) {
  return (
    <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 20, padding: '26px 28px', marginBottom: 18 }}>
      <div style={{ fontFamily: "'Space Mono'", fontSize: 10.5, letterSpacing: '.18em', color: '#93341A', marginBottom: 6 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', margin: '0 0 12px' }}>
        {title}
      </h2>
      <div className="howto-body" style={{ fontSize: 15, lineHeight: 1.65, color: '#3A2E24' }}>
        {children}
      </div>
    </div>
  );
}
