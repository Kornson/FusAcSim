import { useState } from 'react';
import type { ReactNode } from 'react';
import { createRoom, joinRoom } from '../lib/api';
import { ensureAnonymousSession, supabaseConfigured } from '../lib/supabaseClient';
import type { RoomSession } from '../session';
import type { Difficulty } from '../../types';

interface RoomJoinProps {
  onJoined: (session: RoomSession) => void;
  onBack: () => void;
}

function randomCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '23456789';
  let out = '';
  for (let i = 0; i < 4; i++) out += letters[Math.floor(Math.random() * letters.length)];
  for (let i = 0; i < 2; i++) out += digits[Math.floor(Math.random() * digits.length)];
  return out;
}

export function RoomJoin({ onJoined, onBack }: RoomJoinProps) {
  const [tab, setTab] = useState<'create' | 'join'>('join');
  const [code, setCode] = useState('');
  const [teamName, setTeamName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [startingBudget, setStartingBudget] = useState(250);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setBusy(true);
    setError(null);
    try {
      await ensureAnonymousSession();
      const newCode = randomCode();
      const room = await createRoom(newCode, difficulty, startingBudget);
      const team = await joinRoom(room.code, teamName.trim() || 'Fonds A');
      onJoined({ roomId: room.id, teamId: team.id, teamName: team.name, code: room.code });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    setBusy(true);
    setError(null);
    try {
      await ensureAnonymousSession();
      const team = await joinRoom(code.trim(), teamName.trim());
      onJoined({ roomId: team.room_id, teamId: team.id, teamName: team.name, code: code.trim().toUpperCase() });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '60px 34px' }}>
      <button
        onClick={onBack}
        className="btn-outline"
        style={{ marginBottom: 24 }}
      >
        ← Retour
      </button>

      {!supabaseConfigured && (
        <div
          style={{
            marginBottom: 20,
            padding: '14px 18px',
            background: '#F9EDEA',
            border: '1px solid #E7C3BB',
            borderRadius: 12,
            color: '#93341A',
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          ⚠ Supabase n'est pas configuré (variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquantes dans
          .env). Le mode multijoueur ne peut pas fonctionner tant que ce n'est pas fait.
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          onClick={() => setTab('join')}
          style={{
            flex: 1,
            appearance: 'none',
            cursor: 'pointer',
            fontFamily: "'Bricolage Grotesque'",
            fontWeight: 700,
            fontSize: 14,
            padding: '11px 16px',
            borderRadius: 12,
            border: `2px solid ${tab === 'join' ? '#C1502E' : '#E8DBC6'}`,
            background: tab === 'join' ? '#F4E3C4' : '#FFFDF7',
            color: tab === 'join' ? '#93341A' : '#6B5A4B',
          }}
        >
          Rejoindre une salle
        </button>
        <button
          onClick={() => setTab('create')}
          style={{
            flex: 1,
            appearance: 'none',
            cursor: 'pointer',
            fontFamily: "'Bricolage Grotesque'",
            fontWeight: 700,
            fontSize: 14,
            padding: '11px 16px',
            borderRadius: 12,
            border: `2px solid ${tab === 'create' ? '#C1502E' : '#E8DBC6'}`,
            background: tab === 'create' ? '#F4E3C4' : '#FFFDF7',
            color: tab === 'create' ? '#93341A' : '#6B5A4B',
          }}
        >
          Créer une salle
        </button>
      </div>

      <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 20, padding: 28 }}>
        {tab === 'join' ? (
          <>
            <Field label="CODE DE LA SALLE">
              <input
                className="field-input"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ex. DEAL42"
                style={{ width: '100%', fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 18, letterSpacing: '.08em' }}
              />
            </Field>
            <Field label="NOM DE VOTRE ÉQUIPE / FONDS">
              <input
                className="field-input"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="ex. Atlas Capital"
                style={{ width: '100%', fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 16 }}
              />
            </Field>
            <button
              className="btn-primary full"
              disabled={busy || !code.trim() || !teamName.trim()}
              onClick={handleJoin}
              style={{ opacity: busy || !code.trim() || !teamName.trim() ? 0.6 : 1 }}
            >
              {busy ? 'Connexion…' : 'Rejoindre la salle →'}
            </button>
          </>
        ) : (
          <>
            <Field label="NOM DE VOTRE ÉQUIPE / FONDS">
              <input
                className="field-input"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="ex. Atlas Capital"
                style={{ width: '100%', fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 16 }}
              />
            </Field>
            <Field label="DIFFICULTÉ DES RIVAUX SIMULÉS RESTANTS">
              <select
                className="field-input"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                style={{ width: '100%', fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 14 }}
              >
                <option value="easy">Facile</option>
                <option value="normal">Normal</option>
                <option value="hard">Difficile</option>
              </select>
            </Field>
            <Field label="TRÉSORERIE DE DÉPART (M€)">
              <input
                className="field-input"
                type="number"
                value={startingBudget}
                onChange={(e) => setStartingBudget(Number(e.target.value))}
                style={{ width: '100%', fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 16 }}
              />
            </Field>
            <button
              className="btn-primary full"
              disabled={busy || !teamName.trim()}
              onClick={handleCreate}
              style={{ opacity: busy || !teamName.trim() ? 0.6 : 1 }}
            >
              {busy ? 'Création…' : 'Créer la salle →'}
            </button>
          </>
        )}

        {error && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: '#F9EDEA', border: '1px solid #E7C3BB', borderRadius: 10, color: '#93341A', fontSize: 13, fontWeight: 600 }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: "'Space Mono'", fontSize: 10.5, letterSpacing: '.14em', color: '#A0907A', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}
