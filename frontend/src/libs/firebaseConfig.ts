import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQ-_jG7t5wRD3cfgOnyspX3VV0SirHaQg",
  authDomain: "webapp-bba41.firebaseapp.com",
  projectId: "webapp-bba41",
  storageBucket: "webapp-bba41.firebasestorage.app",
  messagingSenderId: "222287100289",
  appId: "1:222287100289:web:b50c24180b47fc5109d080",
  measurementId: "G-QL66WCNWHH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth };
