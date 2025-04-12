
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Map, Users, Rotate3d, Home, ArrowUpRight, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import PropertyCard from '../components/PropertyCard';
import TransactionCard from '../components/TransactionCard';
import { truncateEthAddress } from '../lib/utils';
import { getProperties, getRecentTransactions } from '../services/propertyService';
import { PropertyData, TransactionData } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { user } = useAuth();
  const { isConnected, connectWallet } = useWeb3();
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', user?.role, user?.walletAddress],
    queryFn: () => getProperties(user?.role, user?.walletAddress),
    enabled: !!user
  });
  
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['recentTransactions', user?.role, user?.walletAddress],
    queryFn: () => getRecentTransactions(user?.role, user?.walletAddress, 3),
    enabled: !!user
  });
  
  useEffect(() => {
    // Set loading state based on query loading states
    setIsLoading(propertiesLoading || transactionsLoading);
  }, [propertiesLoading, transactionsLoading]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        
        {!isConnected && (
          <Button onClick={connectWallet} className="mt-4 md:mt-0">
            <Rotate3d className="mr-2 h-4 w-4" /> 
            Connect Wallet
          </Button>
        )}
      </div>
      
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'official' ? 'Registered in the system' : 'In your ownership'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Value
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${properties.reduce((sum, property) => sum + property.price, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined property value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Area
            </CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.reduce((sum, property) => sum + property.size, 0).toLocaleString()} m²
            </div>
            <p className="text-xs text-muted-foreground">
              Combined property area
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'official' ? 'Total Users' : 'Wallet Address'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {user?.role === 'official' ? (
              <>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Active in the system
                </p>
              </>
            ) : (
              <>
                <div className="text-base font-mono font-medium">
                  {user?.walletAddress 
                    ? truncateEthAddress(user.walletAddress) 
                    : 'Not connected'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user?.walletAddress ? 'Connected wallet' : 'Please connect your wallet'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Properties Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {user?.role === 'official' ? 'Recently Registered Properties' : 'Your Properties'}
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/properties">
              View All <ArrowUpRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 3).map(property => (
            <PropertyCard 
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location}
              price={property.price}
              size={property.size}
              image={property.image_url || '/placeholder.svg'}
              owner={property.owner}
              createdAt={new Date(property.created_at)}
            />
          ))}
        </div>
      </div>
      
      {/* Recent Transactions Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/transactions">
              View All <History className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {transactions.map(transaction => (
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
      </div>
    </div>
  );
};

export default Dashboard;
