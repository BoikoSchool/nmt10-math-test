// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqTfrh0Gi_5KLwrgUNcEHnljc2spys2bE",
  authDomain: "nmt-math-test.firebaseapp.com",
  projectId: "nmt-math-test",
  storageBucket: "nmt-math-test.firebasestorage.app",
  messagingSenderId: "910027677667",
  appId: "1:910027677667:web:1c2d276046be5380ee8ad6"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Підключення до Firebase Auth та Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);