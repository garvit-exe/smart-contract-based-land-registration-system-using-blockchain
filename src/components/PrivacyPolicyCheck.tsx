
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivacyPolicyCheckProps {
  children: React.ReactNode;
}

const PrivacyPolicyCheck: React.FC<PrivacyPolicyCheckProps> = ({ children }) => {
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Don't redirect if already on these pages
  const excludedPaths = ['/privacy-policy', '/login', '/register', '/'];

  useEffect(() => {
    const checkPolicyAcceptance = () => {
      const hasAccepted = localStorage.getItem('privacyPolicyAccepted');
      setIsPolicyAccepted(hasAccepted === 'true');
      setIsLoading(false);
    };
    
    checkPolicyAcceptance();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary"></div>
      </div>
    );
  }

  // Allow access to excluded paths even if policy is not accepted
  if (excludedPaths.some(path => location.pathname.startsWith(path))) {
    return <>{children}</>;
  }

  // Redirect to privacy policy if not accepted
  if (!isPolicyAccepted) {
    return <Navigate to="/privacy-policy" state={{ from: location.pathname }} replace />;
  }

  // If policy is accepted, render the children
  return <>{children}</>;
};

export default PrivacyPolicyCheck;
