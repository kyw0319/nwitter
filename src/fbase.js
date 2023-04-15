// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAXicknB-yFhmLb9DV-zmEOsGZzf9rMNmg',
  authDomain: 'localsns-4963b.firebaseapp.com',
  projectId: 'localsns-4963b',
  storageBucket: 'localsns-4963b.appspot.com',
  messagingSenderId: '197322686315',
  appId: '1:197322686315:web:8ae865d88d7da1d6dfd62e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
// Firebase Authentication 초기화, auth에 참조, auth를 수출.
export const auth = getAuth();
