
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, PlusSquare, Map as MapIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyCard from '../components/PropertyCard';
import MapDisplay from '../components/MapDisplay';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProperties } from '../services/propertyService';
import { PropertyData } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';

const Properties = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', user?.role, user?.walletAddress],
    queryFn: () => getProperties(user?.role, user?.walletAddress),
    enabled: !!user
  });
  
  const [filteredProperties, setFilteredProperties] = useState<PropertyData[]>([]);
  
  useEffect(() => {
    // Filter properties based on search term
    const filtered = properties.filter(property => 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.location && property.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Sort properties
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'size-high':
          return b.size - a.size;
        case 'size-low':
          return a.size - b.size;
        default:
          return 0;
      }
    });
    
    setFilteredProperties(sorted);
  }, [properties, searchTerm, sortBy]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-land-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Properties</h1>
          <p className="text-muted-foreground">
            {user?.role === 'official' 
              ? 'Manage and view all registered properties'
              : 'View and manage your properties'
            }
          </p>
        </div>
        
        {user?.role === 'official' && (
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/register-property">
              <PlusSquare className="mr-2 h-4 w-4" />
              Register New Property
            </Link>
          </Button>
        )}
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search properties by name or location..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="size-high">Size: Large to Small</SelectItem>
                <SelectItem value="size-low">Size: Small to Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center">
                <MapIcon className="w-4 h-4 mr-1" />
                Map
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProperties.length} of {properties.length} properties
        </p>
        
        {user?.role === 'official' && (
          <Badge variant="outline" className="bg-land-accent/10 text-land-accent">
            Official View
          </Badge>
        )}
      </div>
      
      {/* Properties display - Wrap TabsContent within the same Tabs component */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="grid" className="m-0">
          {filteredProperties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map(property => (
                <PropertyCard 
                  key={property.id}
                  {...property}
                  image={property.image_url || ''}
                  createdAt={new Date(property.created_at)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2">No properties found</p>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="map" className="m-0">
          <div className="bg-gray-100 rounded-lg overflow-hidden h-[600px]">
            <MapDisplay 
              center={
                filteredProperties.length > 0 && filteredProperties[0].latitude && filteredProperties[0].longitude
                  ? { lat: filteredProperties[0].latitude, lng: filteredProperties[0].longitude }
                  : { lat: 39.8283, lng: -98.5795 } // Center of USA
              } 
              markers={filteredProperties
                .filter(property => property.latitude && property.longitude)
                .map(property => ({
                  lat: property.latitude!,
                  lng: property.longitude!,
                  title: property.title
                }))}
              zoom={filteredProperties.length > 0 ? 10 : 4}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Properties;
