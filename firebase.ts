
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDib4XvOqakanveiPEZQUtWs518xnGwWPc",
  authDomain: "school-app-69.firebaseapp.com",
  databaseURL: "https://school-app-69-default-rtdb.firebaseio.com",
  projectId: "school-app-69",
  storageBucket: "school-app-69.firebasestorage.app",
  messagingSenderId: "153041769042",
  appId: "1:153041769042:web:f9b383f06e0c23bc10c58b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
