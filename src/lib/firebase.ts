// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEYX5yld9VMVBMcH2rSaKJp5Ot-ti6li8",
  authDomain: "gudang-da023.firebaseapp.com",
  projectId: "gudang-da023",
  storageBucket: "gudang-da023.appspot.com",
  messagingSenderId: "194681531832",
  appId: "1:194681531832:web:f8d8c8fe9220eb21c5f34d"
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };