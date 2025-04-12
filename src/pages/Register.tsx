import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Landmark, Building2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '../contexts/AuthContext';
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, checkSession } = useAuth();
  
  useEffect(() => {
    let isMounted = true;
    
    const verifyAuth = async () => {
      if (isSubmitting) return;
      
      console.log("Register page - checking auth status");
      
      try {
        const hasSession = await checkSession();
        
        if (!isMounted) return;
        
        if (isAuthenticated || hasSession) {
          console.log("User is authenticated or has session, redirecting to dashboard");
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
      }
    };
    
    verifyAuth();
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, navigate, isSubmitting, checkSession]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Attempting registration with email:", email);
      const success = await register(name, email, password, role as 'owner' | 'official');
      
      if (success) {
        toast.success("Account created successfully!");
        // Navigate will happen via useEffect when isAuthenticated changes
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (isLoading && !isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary"></div>
        <p className="mt-4 text-gray-600">Checking authentication status...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <Landmark className="h-8 w-8 text-land-primary mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Land Ledger</h1>
        </div>
        <p className="text-gray-500 text-center">
          Secure Land Registration using Blockchain
        </p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Register to access the land registration platform
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select
                value={role}
                onValueChange={setRole}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">
                    <div className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span>Land Owner</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="official">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span>Government Official</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {role === 'owner' 
                  ? 'As a land owner, you can view and transfer your properties.'
                  : 'As a government official, you can register new properties and approve transfers.'}
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
            
            <p className="text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-land-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
