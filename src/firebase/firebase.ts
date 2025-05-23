import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name: string, email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message.split("/")[1].split("-").join(" "));
    }
  }
};

const login = async (email: string, password: string, redirect: () => void) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    if (user) {
      toast.success("Login Successful");
      redirect();
    }
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message.split("/")[1].split("-").join(" "));
    }
  }
};

const logout = () => {
  signOut(auth);
};

export { auth, db, login, signup, logout };
