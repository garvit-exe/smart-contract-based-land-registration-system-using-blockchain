import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FileCheck, Landmark, Eye, EyeOff } from 'lucide-react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, checkSession } = useAuth();
  const { connectWallet } = useWeb3();
  
  // Get the page they were trying to access before being redirected to login
  const from = location.state?.from || '/dashboard';
  
  // Check session and redirect if already authenticated
  useEffect(() => {
    let isMounted = true;
    
    const verifyAuth = async () => {
      // Don't check during form submission
      if (isSubmitting) return;
      
      console.log("Login page - checking auth status");
      
      try {
        // Check if session exists even if we're not fully authenticated yet
        const hasSession = await checkSession();
        
        if (!isMounted) return;
        
        if (isAuthenticated || hasSession) {
          console.log("User is authenticated or has session, redirecting to:", from);
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
      }
    };
    
    verifyAuth();
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, navigate, from, isSubmitting, checkSession]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Attempting login with email:", email);
      const success = await login(email, password);
      
      if (success) {
        // Just wait for the auth state to change and useEffect to redirect
        console.log("Login successful, waiting for redirect");
      } else {
        console.log("Login failed");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login');
      setIsSubmitting(false);
    }
  };
  
  // Only show loading spinner during initial auth check, not during form submission
  if (isLoading && !isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary"></div>
        <p className="mt-4 text-gray-600">Checking authentication status...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
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
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your credentials to access the platform
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-land-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="remember" 
                className="text-sm font-normal cursor-pointer"
              >
                Remember me for 30 days
              </Label>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex items-start">
              <FileCheck className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Supabase Authentication</p>
                <p className="text-xs">
                  Sign in with your Supabase account<br />
                  Create an account if you don't have one
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
            
            <p className="text-sm text-gray-500 text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-land-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-8">
        <p className="text-sm text-gray-500">
          Need to verify a property?{' '}
          <Link to="/verify-property" className="text-land-primary hover:underline">
            Verify Property
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
