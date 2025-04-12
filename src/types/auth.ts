
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'official';
  walletAddress?: string; // Optional wallet address
  lastLogin?: {
    time: string;
    ip: string;
  }; // Optional last login information
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'owner' | 'official') => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserWallet: (address: string | null) => Promise<void>;
  checkSession: () => Promise<boolean>;
}
