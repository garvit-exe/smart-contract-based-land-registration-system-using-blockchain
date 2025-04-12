
import { User } from "../types/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuthApi = () => {
  /**
   * Login with email and password using Supabase
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("API: Attempting login with Supabase for email:", email);
      
      // Trim and lowercase the email to ensure consistent format
      const formattedEmail = email.trim().toLowerCase();
      
      // Supabase auth sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password: password
      });
      
      if (error) {
        console.error('API: Supabase login error:', error.message);
        toast.error(error.message || "Invalid email or password");
        return false;
      }
      
      if (data?.user) {
        console.log("API: Supabase login successful");
        return true;
      } else {
        console.log("API: Supabase login failed");
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error('API: Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  /**
   * Register a new user using Supabase
   */
  const register = async (name: string, email: string, password: string, role: 'owner' | 'official'): Promise<boolean> => {
    try {
      console.log("API: Attempting registration with Supabase for email:", email);
      
      // Trim and lowercase the email to ensure consistent format
      const formattedEmail = email.trim().toLowerCase();
      
      // Register with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: formattedEmail,
        password: password,
        options: {
          data: {
            name: name,
            role: role
          }
        }
      });
      
      if (error) {
        console.error('API: Supabase registration error:', error.message);
        toast.error(error.message || 'An error occurred during registration');
        return false;
      }
      
      console.log("API: Supabase registration successful");
      toast.success("Registration successful! Please check your email for verification.");
      return true;
    } catch (error) {
      console.error('API: Registration error:', error);
      toast.error('An error occurred during registration');
      return false;
    }
  };

  /**
   * Fetch user data from Supabase
   */
  const fetchUserData = async (): Promise<User | null> => {
    try {
      console.log("API: Fetching Supabase user data");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("API: No active Supabase session found");
        return null;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("API: No Supabase user found");
        return null;
      }
      
      // Get user metadata
      const userData: User = {
        id: user.id,
        name: user.user_metadata.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: user.user_metadata.role || 'owner'
      };
      
      console.log("API: Supabase user data retrieved:", userData);
      return userData;
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      return null;
    }
  };

  /**
   * Update user wallet
   */
  const updateUserWallet = async (userId: string, address: string | null): Promise<boolean> => {
    try {
      console.log(`API: Updating wallet for user ${userId} to ${address ? 'new address' : 'null'}`);
      
      const { error } = await supabase
        .from('users')
        .update({ wallet_address: address })
        .eq('id', userId);
      
      if (error) {
        console.error('API: Update wallet error:', error.message);
        toast.error('Failed to update wallet address');
        return false;
      }
      
      if (address) {
        toast.success('Wallet address updated');
      } else {
        toast.success('Wallet disconnected');
      }
      return true;
    } catch (error) {
      console.error('API: Update wallet error:', error);
      toast.error('An error occurred while updating wallet');
      return false;
    }
  };

  /**
   * Logout the current user using Supabase
   */
  const logout = async (): Promise<void> => {
    try {
      console.log("API: Attempting to sign out user with Supabase");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('API: Supabase logout error:', error.message);
        throw error;
      }
      
      console.log("API: Supabase sign out successful");
    } catch (error) {
      console.error('API: Logout error:', error);
      throw error;
    }
  };

  return {
    login,
    register,
    fetchUserData,
    updateUserWallet,
    logout
  };
};
