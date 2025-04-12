
import type { Database } from '@/integrations/supabase/types';

// Type for Property data from Supabase
export type PropertyData = Database['public']['Tables']['properties']['Row'];

// Type for Transaction data from Supabase
export type TransactionData = Database['public']['Tables']['transactions']['Row'];

// Type for User data from Supabase
export type UserData = Database['public']['Tables']['users']['Row'];

// Type for Property Insert
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];

// Type for Transaction Insert
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

// Type for User Update
export type UserUpdate = Database['public']['Tables']['users']['Update'];

// Transaction status type
export type TransactionStatus = 'confirmed' | 'pending' | 'failed';

// Transaction type
export type TransactionType = 'registration' | 'transfer' | 'verification' | 'mortgage';
