
import React from 'react';
import { Briefcase, Mail, GraduationCap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TeamMemberProps {
  member: {
    name: string;
    role: string;
    email: string;
    education: string;
    skills: string[];
    contribution: string;
    statement: string;
    image: string;
  };
}

const TeamMember: React.FC<TeamMemberProps> = ({ member }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="overflow-hidden bg-gray-200 h-64">
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
        <div className="flex items-center text-land-primary mt-1 mb-3">
          <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm font-medium">{member.role}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <GraduationCap className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
          <span>{member.education}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <Mail className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
          <span className="truncate">{member.email}</span>
        </div>
        
        <Separator className="my-3" />
        
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Skills</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {member.skills.map((skill, i) => (
              <span key={i} className="inline-block bg-gray-100 px-2 py-1 text-xs rounded text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-auto text-sm text-gray-600">
          <div className="italic">&ldquo;{member.statement.substring(0, 100)}...&rdquo;</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
