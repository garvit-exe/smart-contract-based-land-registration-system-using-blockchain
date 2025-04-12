
import { supabase } from "@/integrations/supabase/client";
import { PropertyData, TransactionData } from "@/types/supabase";

export async function getProperties(role: string | undefined, walletAddress: string | undefined) {
  try {
    console.log("Fetching properties for role:", role, "wallet:", walletAddress);
    let query = supabase.from('properties').select('*');
    
    // If user is not an official, only return their properties
    if (role !== 'official' && walletAddress) {
      query = query.eq('owner', walletAddress);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
    
    console.log("Properties fetched:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    throw error; // Re-throw to allow React Query to handle retries
  }
}

export async function getPropertyById(id: string) {
  try {
    console.log("Fetching property by ID:", id);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch property:', error);
    throw error; // Re-throw to allow React Query to handle retries
  }
}

export async function getTransactions(
  role: string | undefined, 
  walletAddress: string | undefined,
  propertyId?: string
) {
  try {
    console.log("Fetching transactions for role:", role, "wallet:", walletAddress, "propertyId:", propertyId);
    let query = supabase.from('transactions').select('*');
    
    // Filter by property if specified
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }
    
    // If user is not an official, only return their transactions
    if (role !== 'official' && walletAddress) {
      query = query.or(`from_address.eq.${walletAddress},to_address.eq.${walletAddress}`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    console.log("Transactions fetched:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error; // Re-throw to allow React Query to handle retries
  }
}

export async function getRecentTransactions(
  role: string | undefined, 
  walletAddress: string | undefined,
  limit: number = 3
) {
  try {
    console.log("Fetching recent transactions for role:", role, "wallet:", walletAddress, "limit:", limit);
    let query = supabase.from('transactions').select('*');
    
    // If user is not an official, only return their transactions
    if (role !== 'official' && walletAddress) {
      query = query.or(`from_address.eq.${walletAddress},to_address.eq.${walletAddress}`);
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent transactions:', error);
      throw error;
    }
    
    console.log("Recent transactions fetched:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch recent transactions:', error);
    throw error; // Re-throw to allow React Query to handle retries
  }
}
