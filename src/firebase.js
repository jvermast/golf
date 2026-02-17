import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCCH835UBWVooV3yP_7xaCA0K9514TNYHQ",
  authDomain: "myrtle-e63f0.firebaseapp.com",
  projectId: "myrtle-e63f0",
  storageBucket: "myrtle-e63f0.firebasestorage.app",
  messagingSenderId: "437620771514",
  appId: "1:437620771514:web:4a207a172e626324b4d083"
};

// Only initialize if config is filled in
let db = null;
if (firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db };
export const isConfigured = () => !!firebaseConfig.apiKey;
