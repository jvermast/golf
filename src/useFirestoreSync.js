import { useEffect, useRef, useCallback, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const DOC_PATH = 'trip/scores';

export function useFirestoreSync(scores, players, setScores, setPlayers) {
  const [status, setStatus] = useState(db ? 'connecting' : 'offline');
  const [lastSync, setLastSync] = useState(null);
  const skipNext = useRef(false);
  const timer = useRef(null);

  // Real-time listener
  useEffect(() => {
    if (!db) { setStatus('offline'); return; }

    const unsub = onSnapshot(doc(db, 'trip', 'scores'), (snap) => {
      if (snap.exists() && !skipNext.current) {
        const data = snap.data();
        if (data.scores) setScores(data.scores);
        if (data.players) setPlayers(data.players);
        setLastSync(new Date());
      }
      skipNext.current = false;
      setStatus('connected');
    }, (err) => {
      console.error('Firestore error:', err);
      setStatus('error');
    });

    return () => unsub();
  }, [setScores, setPlayers]);

  // Write to Firestore (debounced)
  const syncToFirestore = useCallback(async (newScores, newPlayers) => {
    if (!db) return;
    try {
      skipNext.current = true;
      await setDoc(doc(db, 'trip', 'scores'), {
        scores: newScores,
        players: newPlayers,
        updatedAt: new Date().toISOString(),
      });
      setLastSync(new Date());
    } catch (e) {
      console.error('Firestore write error:', e);
      skipNext.current = false;
    }
  }, []);

  const debouncedSync = useCallback((newScores, newPlayers) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => syncToFirestore(newScores, newPlayers), 600);
  }, [syncToFirestore]);

  return { status, lastSync, debouncedSync };
}
