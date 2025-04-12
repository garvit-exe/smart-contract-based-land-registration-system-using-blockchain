
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  roles: Array<'owner' | 'official'>;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated, isLoading, checkSession } = useAuth();
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

  console.log("RoleBasedRoute - isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "user role:", user?.role, "checking:", checking);

  // Show loading indicator only during initial checks
  if (isLoading || checking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary"></div>
        <p className="ml-3 text-land-primary">Verifying permissions...</p>
      </div>
    );
  }

  // If not authenticated and no active session, redirect to login
  if (!isAuthenticated && !sessionExists) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user doesn't have the required role, redirect to dashboard
  if (!user || !roles.includes(user.role)) {
    console.log("User doesn't have required role, redirecting to dashboard");
    toast.warning('You do not have permission to access this page');
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and has the required role, render children
  console.log("User authenticated with required role, rendering content");
  return <>{children}</>;
};

export default RoleBasedRoute;
