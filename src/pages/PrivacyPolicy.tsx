
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, Check } from 'lucide-react';
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '../contexts/AuthContext';

const PrivacyPolicy = () => {
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if policy has already been accepted
  useEffect(() => {
    const hasAccepted = localStorage.getItem('privacyPolicyAccepted');
    if (hasAccepted === 'true') {
      setPolicyAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    if (acceptPolicy) {
      localStorage.setItem('privacyPolicyAccepted', 'true');
      setPolicyAccepted(true);
      toast.success("Privacy Policy accepted");
      
      // If the user came from somewhere else (via state), redirect them back
      const navigatedFrom = window.history.state?.usr?.from;
      if (navigatedFrom) {
        navigate(navigatedFrom);
      }
    } else {
      toast.error("You must accept the Privacy Policy to continue");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Privacy Policy</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-land-primary mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          
          <div className="text-gray-500 mb-6">
            Last updated: April 11, 2025
          </div>
          
          {!policyAccepted && (
            <Alert className="mb-8 bg-amber-50 text-amber-800 border-amber-200">
              <Lock className="h-4 w-4" />
              <AlertTitle>Accept Our Privacy Policy</AlertTitle>
              <AlertDescription>
                Please read and accept our Privacy Policy to continue using the LandLedger platform.
              </AlertDescription>
            </Alert>
          )}
          
          {policyAccepted && (
            <Alert className="mb-8 bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertTitle>Privacy Policy Accepted</AlertTitle>
              <AlertDescription>
                You have accepted our Privacy Policy and can use all features of the LandLedger platform.
              </AlertDescription>
            </Alert>
          )}
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                This Privacy Policy explains how LandLedger ("we", "us", "our") collects, uses, and shares your 
                personal information when you use our land registry blockchain application ("the Service").
              </p>
              <p className="text-gray-700 mb-4">
                We are committed to protecting your personal information and your right to privacy. When you 
                use our service, you trust us with your personal information. We take your privacy very seriously. 
                In this privacy policy, we describe our privacy policy. We seek to explain to you in the clearest 
                way possible what information we collect, how we use it, and what rights you have in relation to it.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                <strong>Personal Information</strong>: When you register for an account, we collect your name, email 
                address, and wallet address. For government officials, we may collect additional verification information.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Property Information</strong>: We collect data related to properties, including location, size, 
                price, and ownership details.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Transaction Information</strong>: We record details of property registrations, transfers, and 
                verifications on the blockchain.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Usage Data</strong>: We collect information about how you interact with our service, including 
                access times, pages viewed, and features used.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4 space-y-2">
                <li>Verify your identity and process property transactions</li>
                <li>Create and maintain an immutable record of property ownership</li>
                <li>Provide, operate, and maintain our service</li>
                <li>Improve, personalize, and expand our service</li>
                <li>Understand and analyze how you use our service</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you about updates, security alerts, and support</li>
                <li>Find and prevent fraud</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Blockchain and Public Information</h2>
              <p className="text-gray-700 mb-4">
                <strong>Blockchain Transparency</strong>: Please note that transactions recorded on the blockchain are 
                public by design. While personal identifiers are minimized, property transactions and wallet addresses 
                are publicly visible on the blockchain.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Public Property Records</strong>: Basic property information, including location and ownership 
                status, may be publicly visible within our platform to authenticated users.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. How We Share Your Information</h2>
              <p className="text-gray-700 mb-4">
                We may share information with:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4 space-y-2">
                <li>Government authorities for legal compliance purposes</li>
                <li>Service providers who help us operate our platform</li>
                <li>Other users as necessary to complete property transactions</li>
                <li>Legal authorities in response to lawful requests</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 mb-4 space-y-2">
                <li>Access the personal information we have about you</li>
                <li>Correct inaccuracies in your personal information</li>
                <li>Request deletion of your personal information where applicable</li>
                <li>Object to our processing of your personal information</li>
                <li>Request a copy of your personal information</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Note</strong>: Due to the nature of blockchain technology, information recorded on the blockchain 
                cannot be altered or deleted. This includes property transactions and wallet addresses.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about this Privacy Policy or our practices, please contact us at:
              </p>
              <p className="text-gray-700 mb-4">
                Email: privacy@landledger.com<br />
                Address: 123 Blockchain Avenue, San Francisco, CA 94104<br />
                Phone: +1 (555) 123-4567
              </p>
            </CardContent>
          </Card>
          
          {!policyAccepted && (
            <div className="flex flex-col items-center border-t border-gray-200 pt-8 mt-8">
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox 
                  id="accept-policy" 
                  checked={acceptPolicy} 
                  onCheckedChange={(checked) => setAcceptPolicy(checked === true)}
                />
                <Label 
                  htmlFor="accept-policy" 
                  className="text-gray-700 cursor-pointer"
                >
                  I have read and accept the Privacy Policy
                </Label>
              </div>
              
              <Button onClick={handleAccept} disabled={!acceptPolicy} size="lg">
                Accept and Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
