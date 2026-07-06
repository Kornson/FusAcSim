import { SCREEN_ORDER, STEP_LABELS } from '../engine';
import type { Screen } from '../types';

interface StepperProps {
  screen: Screen;
}

export function Stepper({ screen }: StepperProps) {
  const curIdx = SCREEN_ORDER.indexOf(screen);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 34px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
        {STEP_LABELS.map((label, i) => {
          const active = i === curIdx;
          const done = curIdx > i;
          const bg = active ? '#241812' : 'transparent';
          const dotBg = active ? '#E0973A' : done ? '#C1502E' : '#E3D3B6';
          const dotColor = active ? '#241812' : done ? '#FBF4E8' : '#A0907A';
          const mark = done ? '✓' : String(i + 1).padStart(2, '0');
          const textColor = active ? '#FBF4E8' : done ? '#93341A' : '#A0907A';
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '7px 15px',
                  borderRadius: 999,
                  background: bg,
                  transition: 'all .3s',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: dotBg,
                    color: dotColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Space Mono'",
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                >
                  {mark}
                </div>
                <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 13, color: textColor }}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && <div style={{ width: 22, height: 2, background: '#DAC9AB', margin: '0 2px' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
