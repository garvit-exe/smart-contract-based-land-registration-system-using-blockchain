
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, AlertCircle, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { truncateEthAddress } from '../lib/utils';

const VerifyProperty = () => {
  const [searchParams] = useSearchParams();
  const initialPropertyId = searchParams.get('id') || '';
  
  const { verifyProperty, isConnected, connectWallet } = useWeb3();
  const [propertyId, setPropertyId] = useState(initialPropertyId);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isVerified: boolean;
    owner: string;
  } | null>(null);
  
  const handleVerify = async () => {
    if (!propertyId) return;
    
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }
    
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const result = await verifyProperty(propertyId);
      setVerificationResult(result);
    } catch (error) {
      console.error('Error verifying property:', error);
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-land-primary text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <svg className="w-8 h-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Land Ledger
            </Link>
            
            <div className="ml-auto">
              <Link to="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Verify Property Ownership</h1>
          <p className="text-muted-foreground mb-8">
            Verify the authenticity and ownership of a property registered on the blockchain
          </p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <Input
                    placeholder="Enter Property ID"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={handleVerify}
                  disabled={!propertyId || isVerifying}
                  className="flex items-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Verify Property
                    </>
                  )}
                </Button>
              </div>
              
              {!isConnected && !verificationResult && (
                <Alert className="mt-4 bg-amber-50 text-amber-800 border-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex justify-between items-center">
                    <span>Connect your wallet to verify property details on the blockchain.</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white"
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          {verificationResult !== null && (
            <Card className={`mb-8 border-2 ${
              verificationResult.isVerified 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {verificationResult.isVerified ? (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                  )}
                  
                  <div>
                    <h2 className="text-xl font-bold">
                      {verificationResult.isVerified ? 'Property Verified' : 'Property Not Found'}
                    </h2>
                    <p className="text-sm">
                      {verificationResult.isVerified 
                        ? 'This property is registered on the blockchain and is authentic.' 
                        : 'This property ID could not be found on the blockchain.'
                      }
                    </p>
                  </div>
                </div>
                
                {verificationResult.isVerified && (
                  <>
                    <Separator className="my-4" />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Property ID</p>
                        <p className="font-medium">{propertyId}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Current Owner</p>
                        <p className="font-medium font-mono">{truncateEthAddress(verificationResult.owner)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        className="text-sm"
                        asChild
                      >
                        <Link to={`/properties/${propertyId}`}>
                          View Full Property Details
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">About Property Verification</h2>
            <p className="mb-4">
              Our blockchain-based property verification system allows you to verify the authenticity
              and current ownership of any registered property. Each property on our platform is
              assigned a unique ID that is recorded on the Ethereum blockchain.
            </p>
            <p className="mb-4">
              By entering a property ID, you can instantly verify:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>If the property is legitimately registered</li>
              <li>The current owner's blockchain address</li>
              <li>The complete transaction history</li>
              <li>Document authenticity through cryptographic verification</li>
            </ul>
            <p>
              This system provides transparency and security for all property transactions,
              eliminating fraud and simplifying the verification process.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-100 mt-auto">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-gray-600">
            &copy; {new Date().getFullYear()} Land Ledger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VerifyProperty;
