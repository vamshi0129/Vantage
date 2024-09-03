import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTRHXdAlIm071A-3oGN-BGv7Z3y-Z2jzY",
  authDomain: "fir-6512c.firebaseapp.com",
  projectId: "fir-6512c",
  storageBucket: "fir-6512c.appspot.com",
  databaseURL: "https://fir-6512c-default-rtdb.firebaseio.com",
  messagingSenderId: "879873853629",
  appId: "1:879873853629:web:7727f69d561580219c0fd4",
  measurementId: "G-QXTNK1PW8K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
