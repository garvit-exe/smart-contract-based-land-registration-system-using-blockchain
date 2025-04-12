import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield, BookOpen, ArrowRight, Database, Lock, Info, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-3 py-1 text-sm font-medium bg-land-primary/10 text-land-primary rounded-full mb-4">
                  Blockchain-Powered Land Registry
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Secure Land Registration on Blockchain
              </motion.h1>
              
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                LandLedger leverages blockchain technology to create a transparent, 
                secure, and immutable record of land ownership. Say goodbye to fraud, 
                disputes, and complicated paperwork.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button size="lg" asChild>
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2">
              <motion.div
                className="relative rounded-2xl bg-white p-1 shadow-xl ring-1 ring-gray-200 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <svg 
                  className="w-full h-auto" 
                  viewBox="0 0 800 600" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="800" height="600" fill="#f8fafc" />
                  <path d="M0 150L800 150V550H0V150Z" fill="#eef2ff" />
                  <rect x="100" y="200" width="600" height="300" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                  <rect x="150" y="250" width="200" height="30" rx="4" fill="#dbeafe" />
                  <rect x="150" y="300" width="300" height="20" rx="4" fill="#eff6ff" />
                  <rect x="150" y="340" width="250" height="20" rx="4" fill="#eff6ff" />
                  <rect x="150" y="380" width="275" height="20" rx="4" fill="#eff6ff" />
                  <rect x="150" y="420" width="175" height="40" rx="4" fill="#3b82f6" />
                  <rect x="450" y="250" width="200" height="170" rx="8" fill="#bfdbfe" />
                  <path d="M450 330L650 330" stroke="#93c5fd" strokeWidth="2" />
                  <path d="M480 350L620 350" stroke="#93c5fd" strokeWidth="2" />
                  <path d="M500 370L600 370" stroke="#93c5fd" strokeWidth="2" />
                  <path d="M520 390L580 390" stroke="#93c5fd" strokeWidth="2" />
                  <circle cx="550" cy="290" r="30" fill="#60a5fa" />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-land-primary/20 to-transparent rounded-xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Blockchain Land Registry?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform combines the security of blockchain with user-friendly interfaces
              to revolutionize how property ownership is registered and transferred.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-8 w-8" />}
              title="Immutable Records"
              description="All property records are stored on the blockchain, making them tamper-proof and permanently accessible."
            />
            
            <FeatureCard 
              icon={<Lock className="h-8 w-8" />}
              title="Secure Transfers"
              description="Transfer property ownership with cryptographic security, eliminating fraud and unauthorized changes."
            />
            
            <FeatureCard 
              icon={<MapPin className="h-8 w-8" />}
              title="Geospatial Integration"
              description="View properties on interactive maps with precise location data linked to blockchain records."
            />
            
            <FeatureCard 
              icon={<Database className="h-8 w-8" />}
              title="Transparent History"
              description="Access the complete history of any property, including all previous owners and transactions."
            />
            
            <FeatureCard 
              icon={<BookOpen className="h-8 w-8" />}
              title="Digital Documentation"
              description="Store and access property documents digitally, eliminating the need for physical paperwork."
            />
            
            <FeatureCard 
              icon={<ArrowRight className="h-8 w-8" />}
              title="Streamlined Process"
              description="Register and transfer properties in minutes instead of weeks, with automated verification."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-land-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to experience the future of land registration?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Join thousands of property owners and government officials who are already
              benefiting from our blockchain-based land registry system.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/properties">
                  Explore Properties
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link to="/verify-property">
                  Verify Ownership
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="bg-land-primary rounded-md p-1 mr-2">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-land-primary">LandLedger</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Secure, transparent land registry powered by blockchain
              </p>
            </div>
            
            <div className="flex gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/properties" className="text-gray-600 hover:text-land-primary">Properties</Link></li>
                  <li><Link to="/verify-property" className="text-gray-600 hover:text-land-primary">Verification</Link></li>
                  <li><Link to="/dashboard" className="text-gray-600 hover:text-land-primary">Dashboard</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/about-us" className="text-gray-600 hover:text-land-primary flex items-center">
                      <Info className="h-3.5 w-3.5 mr-1" />
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-600 hover:text-land-primary flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="text-gray-600 hover:text-land-primary flex items-center">
                      <Shield className="h-3.5 w-3.5 mr-1" />
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} LandLedger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-12 h-12 rounded-lg bg-land-primary/10 flex items-center justify-center text-land-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Index;
