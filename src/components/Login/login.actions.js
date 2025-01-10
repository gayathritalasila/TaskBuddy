import FirebaseApp from "../../firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  setDoc,
  getDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import { login, updateProfile as updateUserProfile } from "./login.slice";

const auth = getAuth(FirebaseApp);
const googleProvider = new GoogleAuthProvider();
const postsDb = getFirestore(FirebaseApp);

const handleLogin = async (dispatch) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      const userRef = doc(postsDb, "users", result.user.uid);
      const userSnapshot = await getDoc(userRef);

      let userBio = "";
      if (userSnapshot.exists()) {
        userBio = userSnapshot.data()?.bio || "";
      } else {
        // If the user doesn't exist in Firestore, create an initial entry
        await setDoc(userRef, {
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          email: result.user.email,
          bio: "",
        });
      }

      // Dispatch user data to Redux state, including bio
      dispatch(
        login({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          bio: userBio,
        })
      );
    }
  } catch (error) {
    console.error("Error during login:", error.message);
  }
};

export { handleLogin };
