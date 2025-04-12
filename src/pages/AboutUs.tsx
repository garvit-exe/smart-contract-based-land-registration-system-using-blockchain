
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList
} from "@/components/ui/breadcrumb";

// Import the refactored components
import AboutIntro from '@/components/about/AboutIntro';
import CoreValues from '@/components/about/CoreValues';
import TechnologySection from '@/components/about/TechnologySection';
import TeamSection from '@/components/about/TeamSection';
import JoinCTA from '@/components/about/JoinCTA';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="flex flex-row flex-wrap">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>About Us</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="max-w-7xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <AboutIntro />
            <CoreValues />
            <TechnologySection />
            <TeamSection />
            <JoinCTA />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
