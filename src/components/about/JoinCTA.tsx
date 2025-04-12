
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const JoinCTA: React.FC = () => {
  return (
    <section className="mt-12 mb-4 bg-gray-50 p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Journey</h2>
      <p className="text-gray-700 mb-4">
        At LandLedger, we're committed to revolutionizing property management through blockchain technology.
        Our team of experts is dedicated to creating secure, transparent, and efficient solutions.
      </p>
      <Link 
        to="/contact" 
        className="inline-flex items-center text-land-primary hover:text-land-primary/80 font-medium"
      >
        Get in touch with our team
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </section>
  );
};

export default JoinCTA;
