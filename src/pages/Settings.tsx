
import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Wallet, 
  Globe, 
  Lock, 
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(120); // minutes
  
  // Security settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    // In a real app, this would call an API endpoint to update the password
    toast.success("Security settings updated successfully");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleSaveNotificationSettings = () => {
    toast.success("Notification preferences updated");
  };
  
  const handleEnableTwoFactor = () => {
    setTwoFactorAuth(true);
    toast.success("Two-factor authentication enabled");
  };
  
  const handleSessionTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSessionTimeout(value);
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center">
            <Wallet className="mr-2 h-4 w-4" />
            Wallet
          </TabsTrigger>
        </TabsList>
        
        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={user?.role === 'owner' ? 'Land Owner' : 'Government Official'} readOnly className="bg-gray-50" />
              </div>
              
              {user?.lastLogin && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Login Information</h4>
                  <p className="text-xs text-blue-700">
                    Last login: {new Date(user.lastLogin.time).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-700">
                    IP Address: {user.lastLogin.ip}
                  </p>
                </div>
              )}
              
              <div className="pt-4">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSecuritySettings} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit">
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Two-factor authentication</h4>
                      <p className="text-xs text-muted-foreground">
                        Receive a code via SMS to verify your identity when signing in
                      </p>
                    </div>
                    <Switch 
                      checked={twoFactorAuth} 
                      onCheckedChange={setTwoFactorAuth} 
                    />
                  </div>
                  
                  {!twoFactorAuth && (
                    <Button onClick={handleEnableTwoFactor}>
                      <Shield className="mr-2 h-4 w-4" />
                      Enable Two-Factor
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Session Settings</CardTitle>
                  <CardDescription>
                    Control how long your session stays active
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number" 
                      value={sessionTimeout}
                      onChange={handleSessionTimeoutChange}
                      min="5"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your session will expire after this period of inactivity
                    </p>
                  </div>
                  
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Timeout Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-transactions">Transaction Updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive emails about property transactions
                      </p>
                    </div>
                    <Switch 
                      id="email-transactions" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-security">Security Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified about security events like password changes or login attempts
                      </p>
                    </div>
                    <Switch 
                      id="email-security" 
                      checked={true} 
                      disabled
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Browser Notifications</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="browser-notifications">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow push notifications in your browser
                      </p>
                    </div>
                    <Switch 
                      id="browser-notifications" 
                      checked={browserNotifications} 
                      onCheckedChange={setBrowserNotifications} 
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveNotificationSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Wallet Settings */}
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Configuration</CardTitle>
              <CardDescription>
                Manage your blockchain wallet settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Connected Wallet</h3>
                {user?.walletAddress ? (
                  <div className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-md text-green-800">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Wallet Connected</p>
                      <p className="text-xs font-mono">{user.walletAddress}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-md text-amber-800">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">No Wallet Connected</p>
                      <p className="text-xs">Connect your wallet to interact with the blockchain</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Wallet Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                  
                  <Button variant="outline" disabled={!user?.walletAddress}>
                    <Globe className="mr-2 h-4 w-4" />
                    View on Etherscan
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-4">Transaction Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="gas-setting">Auto Gas Settings</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically adjust gas settings for optimal transaction speed
                      </p>
                    </div>
                    <Switch id="gas-setting" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="network">Selected Network</Label>
                    <p className="text-sm font-medium">Ethereum Mainnet</p>
                    <p className="text-xs text-muted-foreground">
                      This application only works on Ethereum Mainnet
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
