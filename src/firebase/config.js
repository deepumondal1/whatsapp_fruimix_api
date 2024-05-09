const { API_KEY, PROJECT_ID, SENDER_ID, APP_ID, MEASUREMENT_ID } = process.env;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import firebase from "firebase";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore/lite'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: fb_apiKey,
//   authDomain: fb_authDomain,
//   projectId: fb_projectId,
//   storageBucket: fb_storageBucket,
//   messagingSenderId: fb_messagingSenderId,
//   appId: fb_appId,
//   measurementId: fb_measurementId
// };

const firebaseConfig = {
  apiKey: `${API_KEY}`,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  projectId: `${PROJECT_ID}`,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  messagingSenderId: `${SENDER_ID}`,
  appId: `${APP_ID}`,
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  measurementId: `G-${MEASUREMENT_ID}`,
};


// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app)
// const db = app.firestore()

export { 
  db
}