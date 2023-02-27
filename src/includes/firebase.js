import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAJDQHNCCji1rTV75ugIv6JmJ0f6ig91XY',
  authDomain: 'vue-pinia-music.firebaseapp.com',
  projectId: 'vue-pinia-music',
  storageBucket: 'vue-pinia-music.appspot.com',
  appId: '1:174942943254:web:d8e7c61def55f664015d37',
};

export default firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');

export { auth, db, usersCollection, storage, songsCollection };
