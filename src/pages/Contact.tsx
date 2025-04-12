
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Your message has been sent successfully!");
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Contact</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-land-primary/10 flex items-center justify-center text-land-primary mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">info@landledger.com</p>
                  <p className="text-gray-600">support@landledger.com</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-land-primary/10 flex items-center justify-center text-land-primary mb-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">Mon-Fri, 9am-5pm EST</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-land-primary/10 flex items-center justify-center text-land-primary mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Office</h3>
                  <p className="text-gray-600">123 Blockchain Avenue</p>
                  <p className="text-gray-600">San Francisco, CA 94104</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                />
              </div>
              
              <div className="space-y-2 mb-6">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={6}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full md:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Sending Message</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
