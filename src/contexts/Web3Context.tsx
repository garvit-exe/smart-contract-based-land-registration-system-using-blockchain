
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { ethers } from "ethers";
import { useAuth } from './AuthContext';
import LandRegistryABI from '../contracts/LandRegistryABI';
import { generateRandomHash } from '../lib/utils';
import { supabase } from "../integrations/supabase/client";

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  isConnected: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => Promise<boolean>;
  registerProperty: (id: string, location: string, size: number, price: number, documentHash: string) => Promise<boolean>;
  transferProperty: (propertyId: string, newOwner: string) => Promise<boolean>;
  getPropertyOwner: (propertyId: string) => Promise<string>;
  verifyProperty: (propertyId: string) => Promise<{ isVerified: boolean; owner: string }>;
  getMortgageStatus: (propertyId: string) => Promise<{ isMortgaged: boolean; lender: string; amount: string }>;
  getPropertyVerificationStatus: (propertyId: string) => Promise<boolean>;
  getTransactionHistory: (propertyId: string) => Promise<any[]>;
}

// Contract address would come from environment variables in production
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example address

const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { user, updateUserWallet } = useAuth();

  // Initialize provider when window.ethereum is available
  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
          
          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          
          if (accounts.length > 0 && user?.walletAddress) {
            const newSigner = web3Provider.getSigner();
            setSigner(newSigner);
            
            // Initialize contract
            const landRegistryContract = new ethers.Contract(
              CONTRACT_ADDRESS,
              LandRegistryABI,
              newSigner
            );
            setContract(landRegistryContract);
            
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Error initializing web3 provider:", error);
        }
      }
    };
    
    initProvider();
  }, [user]);

  const connectWallet = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!provider || !window.ethereum) {
        toast.error("MetaMask is not installed!");
        return false;
      }
      
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        const newSigner = provider.getSigner();
        setSigner(newSigner);
        
        // Initialize contract
        const landRegistryContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          LandRegistryABI,
          newSigner
        );
        setContract(landRegistryContract);
        
        setIsConnected(true);
        
        // Update user's wallet address if logged in
        if (user) {
          updateUserWallet(accounts[0]);
        }
        
        toast.success("Wallet connected successfully!");
        return true;
      } else {
        toast.error("Failed to connect wallet!");
        return false;
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Error connecting wallet. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Clear our state
      setSigner(null);
      setContract(null);
      setIsConnected(false);
      
      // Update user's wallet address if logged in
      if (user) {
        await updateUserWallet(null);
      }
      
      toast.success("Wallet disconnected successfully!");
      return true;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Error disconnecting wallet. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Property registration using the contract
  const registerProperty = async (
    id: string, 
    location: string, 
    size: number, 
    price: number, 
    documentHash: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (!contract || !signer) {
        toast.error("Wallet not connected!");
        return false;
      }
      
      if (user?.role !== 'official') {
        toast.error("Only officials can register properties!");
        return false;
      }
      
      // Get the current address
      const address = await signer.getAddress();
      
      // Call the actual contract method with valuation (price in wei)
      const priceInWei = ethers.utils.parseEther(price.toString());
      const tx = await contract.registerProperty(
        id,
        address, // Assuming the caller is the initial owner
        location,
        documentHash,
        priceInWei
      );
      
      // Wait for the transaction to be mined
      toast.info("Blockchain transaction in progress. Please wait...");
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Get the transaction hash
        const txHash = receipt.transactionHash;
        
        // Save transaction to database
        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            type: 'registration',
            property_title: `Property ${id.substring(0, 4)}`,
            to_address: address,
            tx_hash: txHash,
            block_number: receipt.blockNumber,
            status: 'confirmed'
          });
          
        if (txError) {
          console.error("Error recording transaction:", txError);
        }
        
        toast.success("Property registered successfully on the blockchain!");
        return true;
      } else {
        toast.error("Transaction failed");
        return false;
      }
    } catch (error: any) {
      console.error("Error registering property:", error);
      // Provide more specific error message if possible
      if (error.reason) {
        toast.error(`Failed to register property: ${error.reason}`);
      } else {
        toast.error("Failed to register property on blockchain");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Property transfer using the contract
  const transferProperty = async (propertyId: string, newOwner: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (!contract || !signer) {
        toast.error("Wallet not connected!");
        return false;
      }
      
      // Check if property is mortgaged
      try {
        const mortgageStatus = await contract.getMortgageStatus(propertyId);
        if (mortgageStatus.isMortgaged) {
          toast.error("Cannot transfer mortgaged property!");
          return false;
        }
      } catch (error) {
        console.error("Error checking mortgage status:", error);
        // Continue with transfer if we can't check mortgage status
      }
      
      // Call the actual contract method
      const tx = await contract.transferProperty(propertyId, newOwner);
      
      // Wait for the transaction to be mined
      toast.info("Blockchain transaction in progress. Please wait...");
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Get the transaction hash and our address
        const txHash = receipt.transactionHash;
        const fromAddress = await signer.getAddress();
        
        // Save transaction to database
        const { data: propertyData } = await supabase
          .from('properties')
          .select('title')
          .eq('id', propertyId)
          .single();
          
        const propertyTitle = propertyData?.title || `Property ${propertyId.substring(0, 4)}`;
        
        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            type: 'transfer',
            property_title: propertyTitle,
            from_address: fromAddress,
            to_address: newOwner,
            tx_hash: txHash,
            block_number: receipt.blockNumber,
            status: 'confirmed'
          });
          
        if (txError) {
          console.error("Error recording transaction:", txError);
        }
        
        // Update property owner in database
        const { error: updateError } = await supabase
          .from('properties')
          .update({ owner: newOwner })
          .eq('id', propertyId);
          
        if (updateError) {
          console.error("Error updating property owner:", updateError);
        }
        
        toast.success("Property transferred successfully on the blockchain!");
        return true;
      } else {
        toast.error("Transaction failed");
        return false;
      }
    } catch (error: any) {
      console.error("Error transferring property:", error);
      if (error.reason) {
        toast.error(`Failed to transfer property: ${error.reason}`);
      } else {
        toast.error("Failed to transfer property");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get property owner from contract
  const getPropertyOwner = async (propertyId: string): Promise<string> => {
    try {
      if (!contract) {
        toast.error("Blockchain connection not established");
        return "";
      }
      
      // Call the actual contract method
      const owner = await contract.getPropertyOwner(propertyId);
      return owner;
    } catch (error: any) {
      console.error("Error getting property owner:", error);
      if (error.reason) {
        toast.error(`Failed to get property owner: ${error.reason}`);
      } else {
        toast.error("Failed to get property owner from blockchain");
      }
      return "";
    }
  };

  // Verify property using contract
  const verifyProperty = async (propertyId: string): Promise<{ isVerified: boolean; owner: string }> => {
    try {
      if (!contract) {
        toast.error("Blockchain connection not established");
        return { isVerified: false, owner: "" };
      }
      
      try {
        // Call the getPropertyDetails method
        const details = await contract.getPropertyDetails(propertyId);
        
        // If we get here without an error, the property exists
        return { 
          isVerified: details.isRegistered, 
          owner: details.owner 
        };
      } catch (error) {
        console.error("Property not found:", error);
        return { isVerified: false, owner: "" };
      }
    } catch (error) {
      console.error("Error verifying property:", error);
      toast.error("Failed to verify property");
      return { isVerified: false, owner: "" };
    }
  };

  // Get mortgage status from contract
  const getMortgageStatus = async (propertyId: string): Promise<{ isMortgaged: boolean; lender: string; amount: string }> => {
    try {
      if (!contract) {
        toast.error("Blockchain connection not established");
        return { isMortgaged: false, lender: "", amount: "0" };
      }
      
      try {
        // Call the getMortgageStatus method
        const status = await contract.getMortgageStatus(propertyId);
        
        return {
          isMortgaged: status.isMortgaged,
          lender: status.lender,
          amount: ethers.utils.formatEther(status.amount)
        };
      } catch (error) {
        console.error("Error getting mortgage status:", error);
        return { isMortgaged: false, lender: "", amount: "0" };
      }
    } catch (error) {
      console.error("Error getting mortgage status:", error);
      toast.error("Failed to get mortgage status");
      return { isMortgaged: false, lender: "", amount: "0" };
    }
  };

  // Get property verification status from contract
  const getPropertyVerificationStatus = async (propertyId: string): Promise<boolean> => {
    try {
      if (!contract) {
        return false;
      }
      
      try {
        // Call the getVerificationStatus method
        const status = await contract.getVerificationStatus(propertyId);
        return status;
      } catch (error) {
        console.error("Error getting verification status:", error);
        return false;
      }
    } catch (error) {
      console.error("Error getting verification status:", error);
      return false;
    }
  };

  // Get transaction history from contract
  const getTransactionHistory = async (propertyId: string): Promise<any[]> => {
    try {
      if (!contract) {
        toast.error("Blockchain connection not established");
        return [];
      }
      
      try {
        // Call the getTransactionHistory method
        const history = await contract.getTransactionHistory(propertyId);
        
        // Format the transaction data
        return history.map((tx: any) => ({
          propertyId: tx.propertyId,
          from: tx.from,
          to: tx.to,
          type: tx.transactionType,
          timestamp: new Date(Number(tx.timestamp) * 1000),
          value: ethers.utils.formatEther(tx.value)
        }));
      } catch (error) {
        console.error("Error getting transaction history:", error);
        return [];
      }
    } catch (error) {
      console.error("Error getting transaction history:", error);
      toast.error("Failed to get transaction history");
      return [];
    }
  };

  const value = {
    provider,
    signer,
    contract,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    registerProperty,
    transferProperty,
    getPropertyOwner,
    verifyProperty,
    getMortgageStatus,
    getPropertyVerificationStatus,
    getTransactionHistory
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
