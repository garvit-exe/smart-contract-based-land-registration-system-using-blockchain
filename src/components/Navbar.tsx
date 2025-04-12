
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { isConnected, connectWallet } = useWeb3();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  return (
    <nav className="bg-white border-b border-land-border shadow-sm py-2 px-4 flex items-center justify-between">
      <div className="flex lg:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <div className="hidden lg:block">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-land-primary focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {!isConnected && (
          <Button 
            onClick={connectWallet}
            variant="outline" 
            className="bg-land-muted text-land-primary hover:bg-land-muted/80"
          >
            Connect Wallet
          </Button>
        )}
        
        {isConnected && (
          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
            Wallet Connected
          </span>
        )}
        
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-land-error"></span>
          </Button>
        </Link>
        
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
