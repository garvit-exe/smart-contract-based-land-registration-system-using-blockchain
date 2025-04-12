
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Search, Filter, ArrowUpRight, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '../contexts/AuthContext';
import TransactionCard from '../components/TransactionCard';
import { getTransactions } from '../services/propertyService';
import { TransactionData } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Transactions = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  
  // Use React Query for better data fetching with automatic retries and caching
  const { 
    data: transactions = [], 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['transactions', user?.role, user?.walletAddress],
    queryFn: () => getTransactions(user?.role, user?.walletAddress),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
  
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionData[]>([]);
  
  // Filter transactions whenever source data or filters change
  useEffect(() => {
    console.log("Filtering transactions. Total count:", transactions.length);
    // Filter transactions based on search and type
    let filtered = [...transactions]; // Create a copy to avoid mutation
    
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.property_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.tx_hash?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (transactionType !== 'all') {
      filtered = filtered.filter(tx => tx.type === transactionType);
    }
    
    // Sort by date (newest first)
    filtered = filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, transactionType]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="container mx-auto py-12">
        <Card className="bg-red-50">
          <CardContent className="p-6 flex flex-col items-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Transactions</h2>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Failed to load transactions. Please try again."}
            </p>
            <Button onClick={() => refetch()} className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Transaction History</h1>
          <p className="text-muted-foreground">
            {user?.role === 'official' 
              ? 'View all blockchain transactions in the system'
              : 'View transactions related to your properties'}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0 flex items-center" 
          onClick={() => refetch()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by property name or transaction hash..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="registration">Registrations</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
              <SelectItem value="verification">Verifications</SelectItem>
              <SelectItem value="mortgage">Mortgages</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No Transaction History</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            There are no blockchain transactions recorded yet.
          </p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No Results Found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search criteria or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {filteredTransactions.map(transaction => (
            <TransactionCard 
              key={transaction.id}
              id={transaction.id}
              property_id={transaction.property_id || ''}
              property_title={transaction.property_title}
              type={transaction.type as 'registration' | 'transfer' | 'verification' | 'mortgage'}
              from_address={transaction.from_address || ''}
              to_address={transaction.to_address || ''}
              tx_hash={transaction.tx_hash}
              block_number={transaction.block_number}
              status={transaction.status as 'confirmed' | 'pending' | 'failed'}
              date={new Date(transaction.created_at)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;
