
import React from 'react';
import { Shield, Link, Database, GitMerge } from 'lucide-react';

const TechnologySection: React.FC = () => {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Technology</h2>
      <p className="text-gray-700 mb-4">
        LandLedger uses a combination of blockchain technology, smart contracts, and 
        secure digital signatures to create a tamper-proof record of property ownership. 
        Our platform is built on Ethereum, one of the most widely used and secure blockchain 
        networks in the world.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-5 rounded-lg">
          <div className="flex items-center mb-3">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Smart Contract Architecture</h3>
          </div>
          <p className="text-gray-700 mb-3">
            Our system is powered by a Solidity smart contract that manages:
          </p>
          <ul className="list-disc list-inside text-gray-700 ml-2 space-y-1">
            <li>Secure property registration by verified government officials</li>
            <li>Transparent ownership transfers with permanent blockchain records</li>
            <li>Cryptographic verification of property documents</li>
            <li>Role-based access control for officials and property owners</li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-5 rounded-lg">
          <div className="flex items-center mb-3">
            <Database className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Enhanced Functionalities</h3>
          </div>
          <p className="text-gray-700 mb-3">
            Our blockchain implementation includes advanced features:
          </p>
          <ul className="list-disc list-inside text-gray-700 ml-2 space-y-1">
            <li>Property mortgage and loan management</li>
            <li>Verification badges for authenticated properties</li>
            <li>Comprehensive transaction history tracking</li>
            <li>Automated property valuation updates</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-purple-50 p-5 rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <Link className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Blockchain Integration</h3>
        </div>
        <p className="text-gray-700 mb-3">
          LandLedger seamlessly integrates with the Ethereum blockchain to provide:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-2 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-2">
          <li>Immutable record of all property transactions</li>
          <li>Decentralized validation of property documents</li>
          <li>Secure digital signatures for property transfers</li>
          <li>Smart contract enforcement of property rights</li>
          <li>Real-time verification of property ownership</li>
          <li>Protection against fraudulent property claims</li>
        </ul>
      </div>
      
      <div className="bg-amber-50 p-5 rounded-lg">
        <div className="flex items-center mb-3">
          <GitMerge className="w-5 h-5 text-amber-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Integration</h3>
        </div>
        <p className="text-gray-700 mb-3">
          Our platform combines blockchain technology with artificial intelligence to enhance the user experience:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-2 space-y-1">
          <li>AI-powered chatbot for instant assistance and guidance</li>
          <li>Automated document verification and fraud detection</li>
          <li>Intelligent property valuation estimates</li>
          <li>Predictive analytics for market trends</li>
        </ul>
      </div>
    </section>
  );
};

export default TechnologySection;
