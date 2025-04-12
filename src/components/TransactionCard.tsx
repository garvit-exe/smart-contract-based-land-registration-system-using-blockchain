
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, User, ExternalLink, Calendar, FileText, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { truncateEthAddress } from '@/lib/utils';

interface TransactionCardProps {
  id: string;
  property_id: string;
  property_title: string;
  type: 'registration' | 'transfer' | 'verification' | 'mortgage';
  from_address?: string;
  to_address?: string;
  tx_hash: string;
  block_number: number;
  status: 'confirmed' | 'pending' | 'failed';
  date: Date;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  id,
  type,
  property_id,
  property_title,
  from_address,
  to_address,
  date,
  tx_hash,
  block_number,
  status = 'confirmed'
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {type === 'registration' ? 'Property Registration' : 
           type === 'transfer' ? 'Property Transfer' : 
           type === 'verification' ? 'Property Verification' :
           'Property Mortgage'}
        </CardTitle>
        <Badge className={
          type === 'registration' ? 'bg-land-primary' : 
          type === 'transfer' ? 'bg-land-accent' :
          type === 'verification' ? 'bg-amber-500' :
          'bg-purple-500'
        }>
          {type === 'registration' ? 'Registration' : 
           type === 'transfer' ? 'Transfer' : 
           type === 'verification' ? 'Verification' :
           'Mortgage'}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <div className="my-2">
          <p className="text-xs text-gray-500">Property</p>
          <p className="font-medium">{property_title}</p>
          <p className="text-xs text-gray-500">ID: {property_id}</p>
        </div>
        
        <div className="flex items-center mt-4">
          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
          <span className="text-sm">{format(date, 'PPP')}</span>
        </div>
        
        <Separator className="my-3" />
        
        {type === 'transfer' && from_address && (
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm">From</span>
            </div>
            <span className="text-sm font-mono">{truncateEthAddress(from_address)}</span>
          </div>
        )}
        
        {(type === 'registration' || type === 'transfer' || type === 'mortgage') && to_address && (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm">To</span>
            </div>
            <span className="text-sm font-mono">{truncateEthAddress(to_address)}</span>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-xs text-gray-500">Block #{block_number}</span>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            View on Etherscan
          </Button>
        </div>
        
        <div className={`mt-4 flex items-center justify-center ${
          status === 'confirmed' ? 'text-land-success' : 
          status === 'pending' ? 'text-amber-500' : 
          'text-red-500'
        }`}>
          {status === 'confirmed' ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Confirmed on blockchain</span>
            </>
          ) : status === 'pending' ? (
            <>
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Pending confirmation</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Failed transaction</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
