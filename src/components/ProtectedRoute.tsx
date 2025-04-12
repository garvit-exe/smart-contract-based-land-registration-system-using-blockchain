
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, checkSession } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [sessionExists, setSessionExists] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const verifySession = async () => {
      try {
        const hasSession = await checkSession();
        if (isMounted) {
          setSessionExists(hasSession);
          setChecking(false);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        if (isMounted) {
          setSessionExists(false);
          setChecking(false);
        }
      }
    };
    
    verifySession();
    
    return () => {
      isMounted = false;
    };
  }, [checkSession]);

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "checking:", checking, "sessionExists:", sessionExists);

  // Show loading indicator only during initial checks
  if (isLoading || checking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary"></div>
        <p className="ml-3 text-land-primary">Verifying authentication...</p>
      </div>
    );
  }

  // If not authenticated and no active session, redirect to login
  if (!isAuthenticated && !sessionExists) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated or has active session, render children
  console.log("User authenticated or has session, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
