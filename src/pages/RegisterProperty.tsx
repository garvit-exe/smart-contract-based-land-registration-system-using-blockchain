import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Check, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
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
import { Link } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import { generateRandomHash } from '../lib/utils';
import { supabase } from "../integrations/supabase/client";
import type { PropertyInsert } from "../types/supabase";

const RegisterProperty = () => {
  const { user } = useAuth();
  const { registerProperty, connectWallet, isConnected } = useWeb3();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: any) => {
    if (!user) {
      toast.error("You must be logged in to register a property");
      return;
    }
    
    if (user.role !== 'official') {
      toast.error("Only government officials can register properties");
      return;
    }
    
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) {
        toast.error("Please connect your wallet to register a property");
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a hash for the property documents
      const documentHash = generateRandomHash();
      
      // Generate a property ID
      const propertyId = Math.random().toString(36).substring(2, 10);
      
      // Call the contract method
      const success = await registerProperty(
        propertyId,
        data.location,
        data.size,
        data.price,
        documentHash
      );
      
      if (success) {
        // Save property data to Supabase
        const propertyData: PropertyInsert = {
          title: data.title || `Property ${propertyId.substring(0, 4)}`,
          location: data.location,
          size: parseInt(data.size),
          price: parseInt(data.price),
          owner: user.walletAddress || '',
          document_hash: documentHash,
          // Add optional fields if available in data
          description: data.description || null,
          image_url: data.image || null
        };
        
        const { data: insertedProperty, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select('id')
          .single();
          
        if (error) {
          console.error("Error saving property to database:", error);
          toast.error("Property was registered on blockchain but failed to save details to database");
        } else {
          // Record the transaction in Supabase
          const { error: txError } = await supabase
            .from('transactions')
            .insert({
              type: 'registration',
              property_id: insertedProperty?.id,
              property_title: propertyData.title,
              to_address: user.walletAddress,
              tx_hash: generateRandomHash(), // In a real app, use the actual tx hash
              block_number: Math.floor(Math.random() * 1000000) + 15000000, // Mock block number
              status: 'confirmed'
            });
            
          if (txError) {
            console.error("Error recording transaction:", txError);
          }
          
          toast.success("Property registered successfully on the blockchain and database!");
          
          setTimeout(() => {
            navigate('/properties');
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error registering property:", error);
      toast.error("Failed to register property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
          <BreadcrumbLink>Register Property</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Register New Property</h1>
        <p className="text-muted-foreground">
          Register a new property on the blockchain as a government official
        </p>
      </div>
      
      <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
        <FileText className="h-4 w-4" />
        <AlertTitle>Official Registration Process</AlertTitle>
        <AlertDescription>
          As a government official, you are registering this property on the blockchain. 
          This action will create an immutable record of ownership that cannot be altered.
          Ensure all details are accurate before proceeding.
        </AlertDescription>
      </Alert>
      
      {!isConnected && (
        <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Connection Required</AlertTitle>
          <AlertDescription>
            You need to connect your wallet before registering a property. The registration
            process requires signing a blockchain transaction.
          </AlertDescription>
        </Alert>
      )}
      
      <PropertyForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
};

export default RegisterProperty;
