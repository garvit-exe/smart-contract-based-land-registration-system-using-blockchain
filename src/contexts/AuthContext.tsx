
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { useAuthApi } from '../hooks/useAuthApi';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { login: apiLogin, register: apiRegister, fetchUserData, updateUserWallet: apiUpdateWallet, logout: apiLogout } = useAuthApi();
  
  // Check if session exists in Supabase
  const checkSession = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error("Error checking session:", error);
      return false;
    }
  };

  // Update authentication status when user changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  // Setup auth state listener and check initial session
  useEffect(() => {
    console.log("Setting up Supabase auth state listener...");
    let isMounted = true; // Track component mount state
    
    // IMPORTANT: First set up the auth state listener, then check for existing session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Supabase auth state changed:", event);
        
        if (!isMounted) return;
        
        if (session?.user) {
          // Use setTimeout to avoid potential Supabase deadlock
          setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              const userData = await fetchUserData();
              if (userData && isMounted) {
                setUser(userData);
                console.log("User data set after auth change:", userData);
              }
            } catch (error) {
              console.error("Error fetching user data after auth change:", error);
              if (isMounted) {
                setUser(null);
              }
            } finally {
              if (isMounted) {
                setIsLoading(false);
              }
            }
          }, 0);
        } else {
          console.log("No session after auth change, clearing user");
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      }
    );
    
    // Initial session check
    const initialSessionCheck = async () => {
      try {
        if (!isMounted) return;
        
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && isMounted) {
          console.log("Found existing Supabase session");
          try {
            const userData = await fetchUserData();
            if (userData && isMounted) {
              setUser(userData);
              console.log("Initial user data set:", userData);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            if (isMounted) {
              setUser(null);
            }
          }
        } else if (isMounted) {
          console.log("No existing Supabase session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          // Always set loading to false after initial check
          setIsLoading(false);
        }
      }
    };
    
    // Run initial session check
    initialSessionCheck();
    
    // Cleanup subscription and mounted state on unmount
    return () => {
      isMounted = false;
      console.log("Cleaning up Supabase auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Attempting login with Supabase for email:", email);
    setIsLoading(true);
    
    try {
      const success = await apiLogin(email, password);
      
      if (!success) {
        console.log("Login failed at auth context level");
        setIsLoading(false);
        return false;
      }
      
      console.log("Login successful at auth context level");
      return true;
    } catch (error) {
      console.error("Error in login:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Register
  const register = async (name: string, email: string, password: string, role: 'owner' | 'official'): Promise<boolean> => {
    console.log("Attempting registration with Supabase...");
    setIsLoading(true);
    
    try {
      const success = await apiRegister(name, email, password, role);
      if (!success) {
        setIsLoading(false);
      }
      return success;
    } catch (error) {
      console.error("Error in register:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Update user wallet
  const updateUserWallet = async (address: string | null) => {
    if (!user) return;
    
    try {
      await apiUpdateWallet(user.id, address);
      
      // Update local user state
      const updatedUser = { 
        ...user, 
        walletAddress: address || undefined 
      };
      
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating wallet:", error);
      toast.error("Failed to update wallet address");
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    console.log("Logging out user with Supabase...");
    setIsLoading(true);
    
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error("Error in logout:", error);
      toast.error("An error occurred during logout");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserWallet,
    checkSession
  };

  console.log("Auth context current state:", { 
    isAuthenticated,
    isLoading,
    hasUser: !!user
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
