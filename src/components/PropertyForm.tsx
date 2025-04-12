
import React, { useState } from 'react';
import { toast } from "sonner";
import { MapPin, UploadCloud, X } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MapDisplay from './MapDisplay';

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters."
  }),
  size: z.number().min(1, {
    message: "Size must be greater than 0."
  }),
  price: z.number().min(1, {
    message: "Price must be greater than 0."
  }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  onSubmit: (data: FormValues & { documents: File[] }) => void;
  isLoading?: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, isLoading = false }) => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [previewLocation, setPreviewLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      size: 0,
      price: 0,
      latitude: 0,
      longitude: 0,
      description: "",
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length > 0) {
      // Check if any file is larger than 5MB
      const tooLarge = selectedFiles.some(file => file.size > 5 * 1024 * 1024);
      
      if (tooLarge) {
        toast.error("One or more files are too large. Maximum size is 5MB.");
        return;
      }
      
      setDocuments(prev => [...prev, ...selectedFiles]);
    }
  };
  
  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (values: FormValues) => {
    if (documents.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }
    
    onSubmit({ ...values, documents });
  };
  
  const handlePreviewLocation = () => {
    const latitude = form.getValues('latitude');
    const longitude = form.getValues('longitude');
    
    if (latitude && longitude) {
      setPreviewLocation({ lat: latitude, lng: longitude });
    } else {
      toast.error("Please enter valid latitude and longitude");
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modern House with Garden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full property address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (sq.m)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the property..." 
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <label className="block text-sm font-medium mb-2">Documents</label>
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md p-4">
                <div className="flex items-center justify-center">
                  <label 
                    htmlFor="document-upload" 
                    className="flex flex-col items-center justify-center w-full cursor-pointer"
                  >
                    <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload documents</p>
                    <p className="text-xs text-gray-400 mt-1">PDF or images up to 5MB</p>
                    <Input 
                      id="document-upload" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
              </div>
              
              {documents.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {documents.map((file, index) => (
                    <li 
                      key={index} 
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                    >
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Property Location</h3>
                  <MapPin className="text-land-primary h-4 w-4" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.0" 
                            step="0.000001"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.0" 
                            step="0.000001"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePreviewLocation}
                  className="w-full mb-4"
                >
                  Preview Location
                </Button>
                
                <div className="h-[300px] bg-gray-100 rounded-md overflow-hidden">
                  <MapDisplay 
                    center={previewLocation || { lat: 40.7128, lng: -74.006 }} 
                    markers={previewLocation ? [previewLocation] : []}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? 'Processing...' : 'Register Property'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;
