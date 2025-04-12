
import React, { useState } from 'react';
import { User, Mail, Shield, Wallet, Copy, Check, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import { truncateEthAddress } from '@/lib/utils';

const Profile = () => {
  const { user } = useAuth();
  const { isConnected, connectWallet } = useWeb3();
  const [isCopied, setIsCopied] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  const copyToClipboard = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('Wallet address copied to clipboard');
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal account details
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4 border-2 border-land-primary/20">
                <AvatarFallback className="bg-land-primary text-white text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <p className="text-muted-foreground mb-3">{user.email}</p>
              
              <Badge className={user.role === 'official' ? 'bg-land-accent' : 'bg-land-primary'}>
                {user.role === 'official' ? 'Government Official' : 'Land Owner'}
              </Badge>
              
              <div className="mt-6 w-full space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Account Type:</span>
                  <span className="ml-auto font-medium capitalize">{user.role}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Email:</span>
                  <span className="ml-auto font-medium">{user.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Account Status:</span>
                  <span className="ml-auto">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Wallet Information</CardTitle>
                <CardDescription>
                  Manage your blockchain wallet connection
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isConnected && user.walletAddress ? (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 mr-2 text-land-primary" />
                      <h3 className="text-lg font-medium">Connected Wallet</h3>
                      <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                        Connected
                      </Badge>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                        <p className="font-mono font-medium">{truncateEthAddress(user.walletAddress, 14, 6)}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={copyToClipboard}
                      >
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-sm" 
                        asChild
                      >
                        <a 
                          href={`https://etherscan.io/address/${user.walletAddress}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View on Etherscan
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Wallet Connected</h3>
                    <p className="text-muted-foreground mb-6">
                      Connect your wallet to interact with the blockchain and manage your properties
                    </p>
                    <Button onClick={connectWallet}>
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Update your account information
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Account Type</Label>
                      <Input id="role" value={user.role === 'official' ? 'Government Official' : 'Land Owner'} disabled />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
