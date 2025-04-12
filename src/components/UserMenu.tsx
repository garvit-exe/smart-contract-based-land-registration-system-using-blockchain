
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const UserMenu: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLogout = async () => {
    console.log("Handling logout from UserMenu");
    if (isLoading) {
      console.log("Logout aborted because isLoading is true");
      return;
    }
    
    try {
      console.log("Attempting to log out");
      await logout();
      console.log("Logout successful, navigating to login");
      navigate('/login', { replace: true });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Error during logout from UserMenu:', error);
      toast.error("Failed to log out properly");
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarFallback className="bg-land-primary text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? 'Logging out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
