import type { ReactNode } from 'react';

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(140% 120% at 15% -10%, #FBF4E8 0%, #F2E6D0 55%, #EAD9BC 100%)',
        fontFamily: "'Space Grotesk',sans-serif",
        color: '#241812',
        paddingBottom: 60,
      }}
    >
      {children}
    </div>
  );
}
