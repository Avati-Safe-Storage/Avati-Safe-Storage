import { createContext, useContext, useState } from 'react';

export type UserRole = 'super_admin' | 'warehouse_supervisor' | 'staff' | 'client';

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

interface AuthState {
  user: AppUser | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Dev auto-login: start already signed in as admin so ProtectedRoute passes on first render
  const [state, setState] = useState<Omit<AuthState, 'signIn' | 'signOut'>>({
    user: { id: 'admin-001', email: 'admin@avati.com', name: 'Admin User', role: 'super_admin' },
    role: 'super_admin',
    loading: false,
  });

  const signIn = async (email: string, _password?: string) => {
    const isAdmin = email.includes('admin') || email.includes('@avati.com') && !email.includes('avt.');
    const role: UserRole = isAdmin ? 'super_admin' : 'client';
    setState({
      user: { id: isAdmin ? 'admin-001' : 'AVT-CUS-0001', email, name: isAdmin ? 'Admin User' : 'Rahul Mehta', role },
      role,
      loading: false,
    });
  };

  const signOut = async () => {
    setState({ user: null, role: null, loading: false });
  };


  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
