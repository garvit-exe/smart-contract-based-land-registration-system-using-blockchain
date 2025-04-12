
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Ruler, DollarSign, User, FileText, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { truncateEthAddress } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  size: number;
  price: number;
  image: string;
  owner: string;
  documentHash?: string;
  createdAt: Date;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  size,
  price,
  image,
  owner,
  documentHash,
  createdAt
}) => {
  const { user } = useAuth();
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&h=400"}
          alt={title}
          className="h-48 w-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-land-primary text-white">
          Verified on Blockchain
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{location}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center">
            <Ruler className="h-4 w-4 mr-2 text-land-primary" />
            <span className="text-sm">{size} sq.m</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-land-primary" />
            <span className="text-sm">${price.toLocaleString()}</span>
          </div>
          <div className="flex items-center col-span-2">
            <User className="h-4 w-4 mr-2 text-land-primary" />
            <span className="text-sm">{truncateEthAddress(owner)}</span>
          </div>
        </div>
        
        {documentHash && (
          <div className="flex items-center text-xs mb-4">
            <FileText className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-gray-500 truncate">
              Doc: {documentHash.substring(0, 16)}...
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link to={`/properties/${id}`}>View Details</Link>
        </Button>
        
        {user?.role === 'owner' && (
          <Button asChild>
            <Link to={`/transfer-property/${id}`}>Transfer</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
