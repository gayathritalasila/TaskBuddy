import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB7drgUuJpMTvcH7Hvg2DGS5B0TQFzohHg",
  authDomain: "photos-gallery-a8215.firebaseapp.com",
  projectId: "photos-gallery-a8215",
  storageBucket: "photos-gallery-a8215.appspot.com",
  messagingSenderId: "812279748322",
  appId: "1:812279748322:web:da92daedf360f49d78f0bb"
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);

export default FirebaseApp;