
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Map,
  FileText,
  PlusSquare,
  Clock,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '../contexts/AuthContext';
import { Badge } from "@/components/ui/badge";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { 
      title: 'Dashboard', 
      icon: Home, 
      path: '/dashboard', 
      roles: ['owner', 'official'] 
    },
    { 
      title: 'Properties', 
      icon: Map, 
      path: '/properties', 
      roles: ['owner', 'official'] 
    },
    { 
      title: 'Register Property', 
      icon: PlusSquare, 
      path: '/register-property', 
      roles: ['official'],
      badge: 'Official'
    },
    { 
      title: 'Transaction History', 
      icon: Clock, 
      path: '/transactions', 
      roles: ['owner', 'official'] 
    },
    { 
      title: 'Documents', 
      icon: FileText, 
      path: '/documents', 
      roles: ['owner', 'official'] 
    },
    { 
      title: 'Profile', 
      icon: User, 
      path: '/profile', 
      roles: ['owner', 'official'] 
    },
  ];
  
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-land-border shadow-sm">
      <div className="p-4 border-b border-land-border">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-land-primary rounded-md p-1">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-land-primary">LandLedger</span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems
            .filter(item => !item.roles || item.roles.includes(user?.role || ''))
            .map((item) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium",
                    isActive(item.path) 
                      ? "bg-land-primary text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={cn("h-5 w-5", isActive(item.path) ? "text-white" : "text-gray-500")} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="outline" className="bg-white text-land-primary text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-land-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-land-accent text-white">
              <span className="text-xs font-medium">{user?.role === 'official' ? 'GO' : 'LO'}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.role === 'official' ? 'Government Official' : 'Land Owner'}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <HelpCircle className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
