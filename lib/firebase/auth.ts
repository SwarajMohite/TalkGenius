import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './config';

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signupUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential;
};

export const logoutUser = () => {
  return signOut(auth);
};

export const onAuthChange = (callback: any) => {
  return onAuthStateChanged(auth, callback);
};

// FIXED VERSION - Remove the parentheses issue:
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // ← This should be empty parentheses, no parameters
      resolve(user);
    });
  });
};