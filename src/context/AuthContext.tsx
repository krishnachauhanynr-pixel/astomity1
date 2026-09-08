import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { auth, googleAuthProvider } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

type AuthRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role?: AuthRole) => Promise<void>;
  loginWithEmail: (email: string, password: string, role: AuthRole) => Promise<void>;
  registerWithEmail: (email: string, password: string, role: AuthRole) => Promise<void>;
  becomeSeller: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
        const requestedRole = window.localStorage.getItem('astomity-auth-role') || 'CUSTOMER';
        try {
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: requestedRole }),
          });
          window.localStorage.removeItem('astomity-auth-role');
          const data = await res.json();
          if (data.success) {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: data.role,
            });
          } else {
            setUser(null);
          }
        } catch (e) {
          console.error(e);
          setUser(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (role: AuthRole = 'CUSTOMER') => {
    try {
      window.localStorage.setItem('astomity-auth-role', role);
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const loginWithEmail = async (email: string, password: string, role: AuthRole) => {
    window.localStorage.setItem('astomity-auth-role', role);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      window.localStorage.removeItem('astomity-auth-role');
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string, role: AuthRole) => {
    window.localStorage.setItem('astomity-auth-role', role);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      window.localStorage.removeItem('astomity-auth-role');
      throw error;
    }
  };

  const becomeSeller = async () => {
    if (!auth.currentUser) {
      await login('SELLER');
      return;
    }

    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'SELLER' }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(idToken);
        setUser(currentUser => currentUser ? { ...currentUser, role: 'SELLER' } : currentUser);
      }
    } catch (error) {
      console.error('Seller registration failed', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, registerWithEmail, becomeSeller, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
