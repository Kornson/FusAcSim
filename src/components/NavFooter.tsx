import type { ReactNode } from 'react';

interface NavFooterProps {
  onBack: () => void;
  right?: ReactNode;
  marginTop?: number;
  hideOnPrint?: boolean;
}

export function NavFooter({ onBack, right, marginTop = 24, hideOnPrint }: NavFooterProps) {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'space-between', marginTop }}
      {...(hideOnPrint ? { 'data-print-hide': true } : {})}
    >
      <button className="btn-outline" onClick={onBack}>
        ← Retour
      </button>
      {right}
    </div>
  );
}
