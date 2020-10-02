import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = firebase.initializeApp({
	apiKey: "AIzaSyD7oM3_j-pdEblwQrgmTls5Ny2ZfTXTkkY",
	authDomain: "instagram-clone-react-bcef1.firebaseapp.com",
	databaseURL: "https://instagram-clone-react-bcef1.firebaseio.com",
	projectId: "instagram-clone-react-bcef1",
	storageBucket: "instagram-clone-react-bcef1.appspot.com",
	messagingSenderId: "596925547295",
	appId: "1:596925547295:web:cb88fbb9dc311700c3e62a",
	measurementId: "G-XJT8952BG9",
});

const db = firebaseConfig.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
