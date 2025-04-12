
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { ethers } from "ethers";
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, DollarSign, Wallet } from 'lucide-react';

const PropertyMortgage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { contract, signer, isLoading, connectWallet, isConnected } = useWeb3();
  
  const [property, setProperty] = useState<any>(null);
  const [lenderAddress, setLenderAddress] = useState("");
  const [mortgageAmount, setMortgageAmount] = useState("");
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);
  const [mortgageStatus, setMortgageStatus] = useState({
    isMortgaged: false,
    lender: "",
    amount: ""
  });
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        if (!id) return;
        
        setIsLoadingProperty(true);

        // Fetch property details from Supabase
        const mockProperty = {
          id: id,
          title: "Modern Apartment",
          location: "New York, NY 10001",
          owner: await signer?.getAddress(),
          image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
        };
        
        setProperty(mockProperty);
        
        // Check mortgage status if connected to blockchain
        if (contract) {
          try {
            const status = await contract.getMortgageStatus(id);
            setMortgageStatus({
              isMortgaged: status.isMortgaged,
              lender: status.lender,
              amount: ethers.utils.formatEther(status.amount)
            });
          } catch (error) {
            console.error("Error fetching mortgage status:", error);
            // If contract call fails, assume not mortgaged
            setMortgageStatus({
              isMortgaged: false,
              lender: "",
              amount: ""
            });
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
      } finally {
        setIsLoadingProperty(false);
      }
    };
    
    if (isConnected) {
      fetchPropertyDetails();
    }
  }, [id, contract, signer, isConnected]);
  
  const handleCreateMortgage = async () => {
    if (!contract || !signer || !id) {
      toast.error("Wallet not connected or missing property ID");
      return;
    }
    
    if (!lenderAddress || !ethers.utils.isAddress(lenderAddress)) {
      toast.error("Please enter a valid lender wallet address");
      return;
    }
    
    if (!mortgageAmount || parseFloat(mortgageAmount) <= 0) {
      toast.error("Please enter a valid mortgage amount");
      return;
    }
    
    try {
      const amountInWei = ethers.utils.parseEther(mortgageAmount);
      
      toast.info("Creating mortgage on the blockchain. Please wait...");
      
      const tx = await contract.createMortgage(id, lenderAddress, amountInWei);
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success("Mortgage created successfully!");
        
        // Update mortgage status
        setMortgageStatus({
          isMortgaged: true,
          lender: lenderAddress,
          amount: mortgageAmount
        });
        
        // Reset form
        setLenderAddress("");
        setMortgageAmount("");
      } else {
        toast.error("Transaction failed");
      }
    } catch (error: any) {
      console.error("Error creating mortgage:", error);
      toast.error(error.reason || "Failed to create mortgage");
    }
  };
  
  const handleReleaseMortgage = async () => {
    if (!contract || !id) {
      toast.error("Wallet not connected or missing property ID");
      return;
    }
    
    try {
      toast.info("Releasing mortgage on the blockchain. Please wait...");
      
      const tx = await contract.releaseMortgage(id);
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success("Mortgage released successfully!");
        
        // Update mortgage status
        setMortgageStatus({
          isMortgaged: false,
          lender: "",
          amount: ""
        });
      } else {
        toast.error("Transaction failed");
      }
    } catch (error: any) {
      console.error("Error releasing mortgage:", error);
      toast.error(error.reason || "Failed to release mortgage. Only the lender can release a mortgage.");
    }
  };
  
  if (isLoadingProperty) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="container mx-auto">
        <Card className="my-8">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The property you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => navigate('/properties')}>
                Back to Properties
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!isConnected) {
    return (
      <div className="container mx-auto">
        <Card className="my-8">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6">
                You need to connect your wallet to access mortgage functionality.
              </p>
              <Button onClick={connectWallet} disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Property Mortgage</h1>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Property Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <img 
                src={property.image} 
                alt={property.title}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-lg font-semibold">{property.title}</h2>
              <p className="text-muted-foreground mb-2">{property.location}</p>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex">
                  <span className="font-medium w-32">Owner:</span>
                  <span className="font-mono">{property.owner ? `${property.owner.substring(0, 6)}...${property.owner.substring(38)}` : 'Unknown'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Property ID:</span>
                  <span className="font-mono">{property.id}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Current Mortgage Status</CardTitle>
          </CardHeader>
          <CardContent>
            {mortgageStatus.isMortgaged ? (
              <div>
                <div className="bg-amber-50 border border-amber-100 rounded-md p-4 mb-4">
                  <div className="flex items-center text-amber-800 mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="font-semibold">This property is currently mortgaged</span>
                  </div>
                  <p className="text-amber-700 text-sm">
                    The property ownership can't be transferred until the mortgage is released by the lender.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Lender Address</Label>
                    <div className="font-mono text-sm mt-1 bg-gray-50 p-2 rounded border">
                      {mortgageStatus.lender}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Mortgage Amount</Label>
                    <div className="font-medium text-sm mt-1 bg-gray-50 p-2 rounded border">
                      {mortgageStatus.amount} ETH
                    </div>
                  </div>
                  
                  {mortgageStatus.lender.toLowerCase() === (property.owner || '').toLowerCase() ? (
                    <div className="pt-4">
                      <Button
                        variant="destructive"
                        onClick={handleReleaseMortgage}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Processing..." : "Release Mortgage"}
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        Only the lender can release this mortgage.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-green-50 border border-green-100 rounded-md p-4 mb-4">
                  <p className="text-green-700 text-sm">
                    This property has no active mortgage. The owner has full transfer rights.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Property owners can create a mortgage to secure loans or financing against their property.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {!mortgageStatus.isMortgaged && property.owner && property.owner.toLowerCase() === (user?.walletAddress || '').toLowerCase() && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create New Mortgage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lenderAddress">Lender Wallet Address</Label>
                  <Input
                    id="lenderAddress"
                    placeholder="0x..."
                    value={lenderAddress}
                    onChange={(e) => setLenderAddress(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="mortgageAmount">Mortgage Amount (ETH)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="mortgageAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      value={mortgageAmount}
                      onChange={(e) => setMortgageAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleCreateMortgage}
                  disabled={isLoading || !lenderAddress || !mortgageAmount}
                  className="w-full mt-2"
                >
                  {isLoading ? "Processing..." : "Create Mortgage"}
                </Button>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Creating a mortgage will register a lien against this property on the blockchain.
                  This will prevent property transfers until the mortgage is released by the lender.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PropertyMortgage;
