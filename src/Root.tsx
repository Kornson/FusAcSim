import { useState } from 'react';
import { PageShell } from './components/PageShell';
import { HowToPlay } from './components/HowToPlay';
import { Course } from './components/Course';
import SoloApp from './SoloApp';
import { Landing } from './multiplayer/screens/Landing';
import { MultiplayerApp } from './multiplayer/MultiplayerApp';

type Mode = 'landing' | 'solo' | 'multiplayer' | 'howto' | 'course';

function Root() {
  const [mode, setMode] = useState<Mode>('landing');

  if (mode === 'solo') return <SoloApp />;
  if (mode === 'multiplayer') return <MultiplayerApp onExit={() => setMode('landing')} />;
  if (mode === 'howto') {
    return (
      <PageShell>
        <HowToPlay onBack={() => setMode('landing')} />
      </PageShell>
    );
  }
  if (mode === 'course') {
    return (
      <PageShell>
        <Course onBack={() => setMode('landing')} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Landing
        onPickSolo={() => setMode('solo')}
        onPickMultiplayer={() => setMode('multiplayer')}
        onHowToPlay={() => setMode('howto')}
        onCourse={() => setMode('course')}
      />
    </PageShell>
  );
}

export default Root;
