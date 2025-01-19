import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAZNno8rzsECGJrm4UOkPPFYlNMpmFSMDA",
  authDomain: "aluben-b8ceb.firebaseapp.com",
  projectId: "aluben-b8ceb",
  storageBucket: "aluben-b8ceb.firebasestorage.app",
  messagingSenderId: "414771071849",
  appId: "1:414771071849:web:c5494deaaed06f0f30cbf8",
  measurementId: "G-746WSSVQCN"
};


export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
