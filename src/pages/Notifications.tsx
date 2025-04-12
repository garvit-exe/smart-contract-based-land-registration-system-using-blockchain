
import React, { useState, useEffect } from 'react';
import { Bell, Check, AlertTriangle, FileCheck, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { calculateTimeAgo } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'success',
    title: 'Property Registration Completed',
    message: 'Your property "Modern Apartment" has been successfully registered on the blockchain.',
    isRead: true,
    timestamp: new Date('2023-11-25T09:24:00'),
    link: '/properties/1'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Transfer Request Pending',
    message: 'A property transfer request for "Suburban House" is waiting for your approval.',
    isRead: false,
    timestamp: new Date('2023-11-26T14:30:00'),
    link: '/properties/2'
  },
  {
    id: '3',
    type: 'info',
    title: 'Document Verification',
    message: 'Your property documents have been verified and added to the blockchain.',
    isRead: false,
    timestamp: new Date('2023-11-26T16:45:00'),
    link: '/documents'
  },
  {
    id: '4',
    type: 'success',
    title: 'Transfer Completed',
    message: 'Ownership of "Commercial Building" has been successfully transferred to you.',
    isRead: true,
    timestamp: new Date('2023-11-22T10:15:00'),
    link: '/properties/3'
  }
];

const NotificationItem = ({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: typeof mockNotifications[0],
  onMarkAsRead: (id: string) => void
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <FileCheck className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getBadgeClass = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <Card className={!notification.isRead ? 'border-l-4 border-l-land-primary' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className={`p-2 rounded-full ${
            notification.type === 'success' ? 'bg-green-100' :
            notification.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
          } mr-4`}>
            {getIcon()}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium">{notification.title}</h3>
              {!notification.isRead && (
                <Badge variant="outline" className="bg-land-primary/10 text-land-primary">
                  New
                </Badge>
              )}
            </div>
            
            <p className="text-muted-foreground text-sm mb-2">
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {calculateTimeAgo(notification.timestamp)}
              </span>
              
              <div className="flex items-center space-x-2">
                {!notification.isRead && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-8 text-xs ${getBadgeClass()}`}
                  asChild
                >
                  <a href={notification.link}>
                    View
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
      ? notifications.filter(n => !n.isRead)
      : notifications.filter(n => n.isRead);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your property transactions and system alerts
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={markAllAsRead}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all" className="relative">
              All
              {notifications.length > 0 && (
                <Badge className="ml-2 bg-land-primary text-white text-xs">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-land-primary text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {notifications.length === 0 ? (
            <EmptyState message="No notifications to display" />
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          {filteredNotifications.length === 0 ? (
            <EmptyState message="No unread notifications" />
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="read" className="mt-0">
          {filteredNotifications.length === 0 ? (
            <EmptyState message="No read notifications" />
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
    <h3 className="text-lg font-medium mb-2">{message}</h3>
    <p className="text-muted-foreground">
      You'll be notified here when there's activity related to your properties
    </p>
  </div>
);

export default Notifications;
