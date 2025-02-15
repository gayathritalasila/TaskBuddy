import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import {
  setDoc,
  getDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import FirebaseApp from "../../firebase";
import { AppDispatch } from "../../../reduxStore";
import { login } from "./login.slice";
import { User } from "./login.state";

const auth = getAuth(FirebaseApp);
const googleProvider = new GoogleAuthProvider();
const postsDb = getFirestore(FirebaseApp);

const handleLogin = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    if (result.user) {
      const user: FirebaseUser = result.user;
      const userRef = doc(postsDb, "users", user.uid);
      const userSnapshot = await getDoc(userRef);

      let userBio = "";
      if (userSnapshot.exists()) {
        userBio = userSnapshot.data()?.bio || "";
      } else {
        // If the user doesn't exist in Firestore, create an initial entry
        await setDoc(userRef, {
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          email: user.email || "",
          bio: "",
        });
      }

      // Dispatch user data to Redux store
      const userData: User = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        bio: userBio,
      };

      localStorage.setItem("user",JSON.stringify(userData));
      dispatch(login(userData));
    }
  } catch (error) {
    console.error("Error during login:", (error as Error).message);
  }
};

export { handleLogin };
