import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Ruler, 
  DollarSign, 
  Calendar, 
  FileText, 
  Clock, 
  ArrowUpRight, 
  User,
  History,
  ExternalLink,
  Share2
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { truncateEthAddress, formatDate, generateRandomHash } from '../lib/utils';
import MapDisplay from '../components/MapDisplay';
import TransactionCard from '../components/TransactionCard';

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Modern Apartment',
  location: 'New York, NY 10001',
  description: 'A beautiful modern apartment in the heart of Manhattan. Features include high ceilings, hardwood floors, and state-of-the-art appliances. The apartment is located in a secure building with 24-hour doorman service and a fitness center.',
  size: 120,
  price: 350000,
  images: [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&h=400',
    'https://images.unsplash.com/photo-1499916078039-922301b0eb9b?auto=format&fit=crop&w=800&h=400',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&h=400'
  ],
  owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  previousOwners: [
    {
      address: '0x3Dc6a85303C6Eb840bbed603C7C40F2b9F228656',
      from: '2022-05-10',
      to: '2023-09-15'
    }
  ],
  documentHash: '0x7da021495ca44d2b6b4a4fbc151898e4f99cadc7521eb97b3a2a5c539f83d015',
  createdAt: new Date('2023-09-15'),
  latitude: 40.7128,
  longitude: -74.006,
  transactions: [
    {
      id: '1',
      type: 'registration' as const,
      property_id: '1',
      property_title: 'Modern Apartment',
      to_address: '0x3Dc6a85303C6Eb840bbed603C7C40F2b9F228656',
      date: new Date('2022-05-10'),
      tx_hash: generateRandomHash(),
      block_number: 12056783,
      status: 'confirmed' as 'confirmed' | 'pending' | 'failed'
    },
    {
      id: '2',
      type: 'transfer' as const,
      property_id: '1',
      property_title: 'Modern Apartment',
      from_address: '0x3Dc6a85303C6Eb840bbed603C7C40F2b9F228656',
      to_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      date: new Date('2023-09-15'),
      tx_hash: '0x7d917a58c47765a045b23f19c3e535cfb29a4e3250c2fdf3bce897fcbd26d9ed',
      block_number: 13287349,
      status: 'confirmed' as 'confirmed' | 'pending' | 'failed'
    }
  ]
};

const mockDocuments = [
  {
    id: '1',
    name: 'Property Deed.pdf',
    type: 'pdf',
    size: '2.4 MB',
    hash: '0x7da021495ca44d2b6b4a4fbc151898e4f99cadc7521eb97b3a2a5c539f83d015',
    uploadedAt: new Date('2023-09-15')
  },
  {
    id: '2',
    name: 'Survey Report.pdf',
    type: 'pdf',
    size: '1.8 MB',
    hash: '0x3d1f85152a0b7e7f666668c446b3d334e962b3bf4b1c08bbf4e1d94e89a1c345',
    uploadedAt: new Date('2023-09-15')
  }
];

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getPropertyOwner } = useWeb3();
  const [property, setProperty] = useState<typeof mockProperty | null>(null);
  const [documents, setDocuments] = useState<typeof mockDocuments>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        // In a real app, fetch the property data from your API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate getting the current owner from blockchain
        const ownerAddress = await getPropertyOwner(id || '');
        
        // Simulate fetching property details
        setProperty(mockProperty);
        setDocuments(mockDocuments);
      } catch (error) {
        console.error('Error loading property data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPropertyData();
  }, [id, getPropertyOwner]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary"></div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/properties">Back to Properties</Link>
        </Button>
      </div>
    );
  }
  
  const isOwner = user?.role === 'owner' && user?.walletAddress === property.owner;
  
  return (
    <div className="container mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/properties">Properties</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>{property.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Property details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <Badge className="bg-land-primary text-white">
                Verified on Blockchain
              </Badge>
            </div>
            
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
            
            <div className="relative rounded-lg overflow-hidden h-[350px] mb-4">
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {property.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    className={`rounded-md overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-land-primary' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Property Information</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <DollarSign className="h-5 w-5 text-land-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-semibold">${property.price.toLocaleString()}</span>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Ruler className="h-5 w-5 text-land-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Size</span>
                  <span className="font-semibold">{property.size} sq.m</span>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-land-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Registered</span>
                  <span className="font-semibold">{formatDate(property.createdAt).split(',')[0]}</span>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Clock className="h-5 w-5 text-land-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Transactions</span>
                  <span className="font-semibold">{property.transactions.length}</span>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{property.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Property Location</h3>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <MapDisplay 
                  center={{ lat: property.latitude, lng: property.longitude }} 
                  markers={[{ lat: property.latitude, lng: property.longitude, title: property.title }]}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Ownership and actions */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Current Owner</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-land-primary" />
                </div>
                <div>
                  <p className="font-mono">{truncateEthAddress(property.owner)}</p>
                  <p className="text-sm text-muted-foreground">
                    Since {formatDate(property.createdAt).split(',')[0]}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {isOwner ? (
                <Button asChild className="w-full mb-3">
                  <Link to={`/transfer-property/${property.id}`}>
                    Transfer Property
                  </Link>
                </Button>
              ) : user?.role === 'official' ? (
                <Button asChild className="w-full mb-3" variant="outline">
                  <Link to={`/verify-property?id=${property.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Verify Property
                  </Link>
                </Button>
              ) : (
                <Button disabled className="w-full mb-3">
                  Not Your Property
                </Button>
              )}
              
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share Property
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Blockchain Data</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Property ID</p>
                  <p className="font-medium font-mono">{property.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Document Hash</p>
                  <p className="font-medium font-mono text-xs break-all">{property.documentHash}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Last Transaction</p>
                  <p className="font-medium font-mono text-xs break-all">
                    {truncateEthAddress(property.transactions[property.transactions.length - 1].tx_hash)}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto flex items-center text-land-primary"
                  >
                    View on Etherscan
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardContent className="p-6">
              <Tabs defaultValue="documents">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="documents" className="space-y-4 mt-4">
                  {documents.map(document => (
                    <div 
                      key={document.id}
                      className="p-3 border rounded-md flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium text-sm">{document.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {document.size} • {formatDate(document.uploadedAt).split(',')[0]}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="history" className="mt-4">
                  {property.previousOwners.map((previousOwner, index) => (
                    <div 
                      key={index}
                      className="mb-4 border-l-2 border-land-primary pl-4 relative"
                    >
                      <div className="absolute w-3 h-3 rounded-full bg-land-primary left-[-6.5px] top-1"></div>
                      <p className="font-medium font-mono">{truncateEthAddress(previousOwner.address)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(previousOwner.from).toLocaleDateString()} - {new Date(previousOwner.to).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  
                  <div className="border-l-2 border-land-primary pl-4 relative">
                    <div className="absolute w-3 h-3 rounded-full bg-land-primary left-[-6.5px] top-1"></div>
                    <p className="font-medium font-mono">{truncateEthAddress(property.owner)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(property.createdAt).split(',')[0]} - Present
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4 flex items-center justify-center"
                    asChild
                  >
                    <Link to={`/transactions?propertyId=${property.id}`}>
                      <History className="mr-2 h-4 w-4" />
                      View Full History
                    </Link>
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Transactions section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {property.transactions.map(transaction => (
            <TransactionCard 
              key={transaction.id}
              id={transaction.id}
              property_id={transaction.property_id}
              property_title={transaction.property_title}
              type={transaction.type}
              from_address={transaction.from_address}
              to_address={transaction.to_address}
              tx_hash={transaction.tx_hash}
              block_number={transaction.block_number}
              status={transaction.status}
              date={transaction.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
