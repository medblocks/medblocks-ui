import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'
import mixpanel from "mixpanel-browser"

mixpanel.init("0658a1e4db1c6419b0d7288a821fd851")

const firebaseConfig = {
  apiKey: "AIzaSyDvHfzNKlU9R0BmFdaLS6ejYDJX29RwYR4",
  authDomain: "voiceintern-49259.firebaseapp.com",
  databaseURL: "https://voiceintern-49259.firebaseio.com",
  projectId: "voiceintern-49259",
  storageBucket: "voiceintern-49259.appspot.com",
  messagingSenderId: "912574563071",
  appId: "1:912574563071:web:8d6d0ac566427f9f6a42ca",
  measurementId: "G-0CJN9YKG28"
};

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()
export const db = firebase.firestore()
export const storage = firebase.storage()
export type firebaseUser = firebase.User
export const FieldValue = firebase.firestore.FieldValue