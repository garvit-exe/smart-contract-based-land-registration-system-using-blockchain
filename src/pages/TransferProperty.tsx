
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MapPin, 
  DollarSign, 
  Ruler, 
  FileText, 
  AlertCircle, 
  Check 
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import { truncateEthAddress } from '../lib/utils';

// Mock property data (in a real app, this would come from an API)
const mockProperty = {
  id: '1',
  title: 'Modern Apartment',
  location: 'New York, NY 10001',
  size: 120,
  price: 350000,
  image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&h=400',
  owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  documentHash: '0x7da021495ca44d2b6b4a4fbc151898e4f99cadc7521eb97b3a2a5c539f83d015',
  createdAt: new Date('2023-09-15')
};

const TransferProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transferProperty, connectWallet, isConnected, isLoading: web3Loading } = useWeb3();
  
  const [property, setProperty] = useState<typeof mockProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        // In a real app, fetch the property data from your API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate fetching property details
        setProperty(mockProperty);
      } catch (error) {
        console.error('Error loading property data:', error);
        toast.error("Failed to load property data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPropertyData();
  }, [id]);
  
  const handleTransfer = async () => {
    if (!property) return;
    
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) {
        toast.error("Please connect your wallet to transfer property");
        return;
      }
    }
    
    if (!newOwnerAddress) {
      toast.error("Please enter a recipient address");
      return;
    }
    
    if (!newOwnerAddress.startsWith('0x') || newOwnerAddress.length !== 42) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    
    if (confirmationText !== 'transfer') {
      toast.error("Please type 'transfer' to confirm");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await transferProperty(property.id, newOwnerAddress);
      
      if (success) {
        toast.success("Property transferred successfully!");
        
        // In a real app, you would update your backend as well
        setTimeout(() => {
          navigate('/properties');
        }, 1500);
      }
    } catch (error) {
      console.error("Error transferring property:", error);
      toast.error("Failed to transfer property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary"></div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/properties">Back to Properties</Link>
        </Button>
      </div>
    );
  }
  
  // Check if the current user is the property owner
  const isOwner = user?.walletAddress === property.owner;
  
  if (!isOwner) {
    return (
      <div className="container mx-auto py-12">
        <Alert className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unauthorized Access</AlertTitle>
          <AlertDescription>
            You must be the property owner to transfer this property.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-6">
          <Button asChild>
            <Link to={`/properties/${id}`}>Back to Property Details</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/properties">Properties</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={`/properties/${id}`}>{property.title}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>Transfer</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Transfer Property Ownership</h1>
        <p className="text-muted-foreground">
          Transfer ownership of your property on the blockchain
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Property Information</h2>
              
              <div className="space-y-4">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                
                <div>
                  <h3 className="font-semibold text-lg">{property.title}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Price</Label>
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-land-primary" />
                      {property.price.toLocaleString()} USD
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground text-xs">Size</Label>
                    <p className="flex items-center">
                      <Ruler className="h-4 w-4 mr-1 text-land-primary" />
                      {property.size} sq.m
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-muted-foreground text-xs">Current Owner</Label>
                  <p className="font-mono text-sm">{truncateEthAddress(property.owner)}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground text-xs">Property ID</Label>
                  <p className="font-mono text-sm">{property.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
            <FileText className="h-4 w-4" />
            <AlertTitle>Blockchain Transaction</AlertTitle>
            <AlertDescription>
              Transferring property ownership will create a permanent record on the blockchain.
              This action cannot be reversed once completed.
            </AlertDescription>
          </Alert>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Transfer Details</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-owner">Current Owner</Label>
                  <Input
                    id="current-owner"
                    value={property.owner}
                    disabled
                    className="font-mono bg-muted"
                  />
                </div>
                
                <div className="flex items-center justify-center my-4">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-owner">New Owner Address</Label>
                  <Input
                    id="new-owner"
                    placeholder="0x..."
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the Ethereum wallet address of the new owner
                  </p>
                </div>
                
                <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Required</AlertTitle>
                  <AlertDescription>
                    Type 'transfer' below to confirm this ownership transfer
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmation">Confirmation</Label>
                  <Input
                    id="confirmation"
                    placeholder="type 'transfer'"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value.toLowerCase())}
                  />
                </div>
                
                <Button
                  onClick={handleTransfer}
                  className="w-full"
                  disabled={isSubmitting || web3Loading || confirmationText !== 'transfer' || !newOwnerAddress}
                >
                  {isSubmitting ? 'Processing...' : 'Transfer Ownership'}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  You'll be asked to confirm this transaction in your wallet
                </p>
              </div>
            </CardContent>
          </Card>
          
          {!isConnected && (
            <Alert className="mt-6 bg-amber-50 text-amber-800 border-amber-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Connection Required</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span>Connect your wallet to proceed with the transfer.</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white"
                  onClick={connectWallet}
                >
                  Connect
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferProperty;
