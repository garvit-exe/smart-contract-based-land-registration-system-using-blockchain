
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-700 mb-2">Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or was moved to another URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Looking for something specific? Try navigating from the home page or contact support if you think this is an error.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
