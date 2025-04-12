
import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Search, Filter } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Define document type
type Document = {
  id: string;
  title: string;
  propertyId: string;
  uploadDate: Date;
  fileType: string;
  fileSize: string;
  hash: string;
};

// Mock documents data (we'll replace this with Supabase later)
const mockDocuments = [
  {
    id: '1',
    title: 'Title Deed - Modern Apartment',
    propertyId: '1',
    uploadDate: new Date('2023-09-15'),
    fileType: 'PDF',
    fileSize: '1.2 MB',
    hash: '0x7da021495ca44d2b6b4a4fbc151898e4f99cadc7521eb97b3a2a5c539f83d015',
  },
  {
    id: '2',
    title: 'Property Tax Certificate - Modern Apartment',
    propertyId: '1',
    uploadDate: new Date('2023-10-05'),
    fileType: 'PDF',
    fileSize: '0.8 MB',
    hash: '0x3d21c2f2fa92d54c6e2957a5e927c1a8c0e099b96d8a17a0cbf735dd246ce056',
  },
  {
    id: '3',
    title: 'Title Deed - Suburban House',
    propertyId: '2',
    uploadDate: new Date('2023-10-22'),
    fileType: 'PDF',
    fileSize: '1.5 MB',
    hash: '0x5bd84f5e2196a35f5c192bd12c290c9dfa6581bbf23bd6863214727422dd264b',
  },
  {
    id: '4',
    title: 'Property Survey - Suburban House',
    propertyId: '2',
    uploadDate: new Date('2023-11-05'),
    fileType: 'DWG',
    fileSize: '3.2 MB',
    hash: '0x9b7a27612acd49d6aaebb8791c0c30c04f0173587a48aa30a74956d8c938c0ae',
  },
];

// TODO: Replace with actual Supabase data in the future
const getDocuments = async (role: string | undefined) => {
  // This is a placeholder for future Supabase integration
  // For now, we'll return the mock data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (role === 'official') {
    return mockDocuments;
  } else {
    // For owners, only show documents for their properties
    const ownerProperties = ['1', '2']; // IDs of properties owned by this user
    return mockDocuments.filter(doc => 
      ownerProperties.includes(doc.propertyId)
    );
  }
};

const Documents = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [documentType, setDocumentType] = useState('all');
  
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', user?.role],
    queryFn: () => getDocuments(user?.role),
    enabled: !!user
  });
  
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  
  useEffect(() => {
    // Filter documents based on search term and document type
    let filtered = documents;
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (documentType !== 'all') {
      filtered = filtered.filter(doc => doc.fileType === documentType);
    }
    
    setFilteredDocuments(filtered);
  }, [documents, searchTerm, documentType]);
  
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
          <h1 className="text-2xl font-bold mb-1">Property Documents</h1>
          <p className="text-muted-foreground">
            {user?.role === 'official' 
              ? 'View and manage all property documents in the system'
              : 'View and manage documents for your properties'}
          </p>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents by title..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-48">
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="File Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="DWG">DWG</SelectItem>
              <SelectItem value="JPG">JPG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{doc.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{doc.uploadDate.toLocaleDateString()}</TableCell>
                    <TableCell>{doc.fileType}</TableCell>
                    <TableCell>{doc.fileSize}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">No documents found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
