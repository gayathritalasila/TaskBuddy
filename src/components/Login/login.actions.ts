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
      let isNewUser = false;  // Track if user is new

      if (userSnapshot.exists()) {
        userBio = userSnapshot.data()?.bio || "";
      } else {
        await setDoc(userRef, {
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          email: user.email || "",
          bio: "",
          createdAt: new Date(),  // Store account creation time
        });
        isNewUser = true;
      }

      // Dispatch user data to Redux store
      const userData: User = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        bio: userBio,
        isNewUser, // Add new user flag
      };

      localStorage.setItem("user", JSON.stringify(userData));
      dispatch(login(userData));

      if (isNewUser) {
        console.log("Welcome! This is a new user.");
      } else {
        console.log("Existing user logged in.");
      }
    }
  } catch (error) {
    console.error("Error during login:", (error as Error).message);
  }
};

export { handleLogin };
