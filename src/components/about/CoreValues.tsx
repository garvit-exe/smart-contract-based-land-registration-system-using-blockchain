
import React from 'react';
import { Shield, MapPin, BookOpen } from 'lucide-react';

const CoreValues: React.FC = () => {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
      <p className="text-gray-700 mb-6">
        To eliminate fraud and disputes in land ownership by creating an immutable, 
        transparent record of property transactions that can be trusted by all parties.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 mt-10">
        <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 rounded-lg bg-land-primary/10 flex items-center justify-center text-land-primary mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Security First</h3>
          <p className="text-gray-600">
            We prioritize the security and integrity of property records above all else, 
            using advanced cryptographic techniques to protect your data.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 rounded-lg bg-land-primary/10 flex items-center justify-center text-land-primary mb-4">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Perspective</h3>
          <p className="text-gray-600">
            Our solution is designed to work across different legal jurisdictions and can 
            be adapted to meet the specific needs of various countries and regions.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 rounded-lg bg-land-primary/10 flex items-center justify-center text-land-primary mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Educational Focus</h3>
          <p className="text-gray-600">
            We're committed to educating users about blockchain technology and its benefits 
            for land registration, making complex technology accessible to everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
