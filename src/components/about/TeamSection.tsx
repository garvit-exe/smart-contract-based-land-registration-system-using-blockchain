
import React from 'react';
import TeamMember from './TeamMember';

export const teamMembers = [
  {
    name: "Rohan Gautam",
    role: "Project Manager",
    email: "rohangautam2022@vitbhopal.ac.in",
    education: "B.Tech in CSE",
    skills: ["Project Management", "Team Leadership", "Problem Solving"],
    contribution: "As the project manager, I oversaw the entire development process, coordinated team efforts, and ensured timely delivery. I helped facilitate communication between different teams and maintained project documentation to ensure cohesion across all components.",
    statement: "I'm a tech enthusiast who believes in debugging life one line of code at a time. If there's a problem, I'm either solving it or pretending it's a 'feature' until I do!",
    image: "/team-uploads/e69ec5f9-94a9-49d1-b652-8f65df08fcb4.png"
  },
  {
    name: "Riya Gupta",
    role: "Blockchain Architect",
    email: "riyagupta2022@vitbhopal.ac.in",
    education: "B.Tech in CSE",
    skills: ["Blockchain Technology", "Smart Contract Development", "Ethereum"],
    contribution: "Riya architected our blockchain infrastructure, designing secure and efficient smart contracts for property transactions. Her expertise in blockchain technology ensured a transparent and tamper-proof system for land records.",
    statement: "I code because I like to turn coffee into solutions! Blockchain is my playground, and I'm here to make the future tamper-proof, one smart contract at a time.",
    image: "/team-uploads/9776308b-6cf3-49e8-9485-cbfc41a6ffc4.png"
  },
  {
    name: "Shashidhar Kittur",
    role: "Backend Lead",
    email: "shashidharkittur2022@vitbhopal.ac.in",
    education: "B.Tech in CSE",
    skills: ["Backend Development", "System Architecture", "API Design"],
    contribution: "As Backend Lead, I designed and implemented the core application infrastructure, creating robust APIs that seamlessly connected our frontend with blockchain services. My focus on scalability and security ensured a reliable foundation for the entire platform.",
    statement: "I'm passionate about blockchain's potential to redefine trust in technology. Whether it's crafting a smart contract or debugging backend APIs, I'm here to build solutions that are as resilient as they are innovative.",
    image: "/team-uploads/621296c2-ce7f-47d8-84bb-93137e2954a9.png"
  },
  {
    name: "Garvit",
    role: "Frontend Lead",
    email: "garvit2022@vitbhopal.ac.in",
    education: "B.Tech in CSE",
    skills: ["Frontend Architecture", "UI/UX Design", "Responsive Development"],
    contribution: "As Frontend Lead, I designed and implemented the user interface architecture, ensuring an intuitive and responsive experience across all devices. I established best practices for the team and led the integration of frontend components with blockchain functionality.",
    statement: "I build the web because I believe that a good interface is the first step to making great things happen. Let's make the internet a better place, one line of code at a time!",
    image: "/team-uploads/2fff17dd-0d14-49a4-abd9-8ed0f0e21690.png"
  },
  {
    name: "Uday Upadhyay",
    role: "AI & Blockchain Integration Specialist",
    email: "udayupadhyay2022@vitbhopal.ac.in",
    education: "Int M.tech in AIML",
    skills: ["AI Integration", "Chatbot Development", "Blockchain Technology"],
    contribution: "I spearheaded the development of our intelligent chatbot system and seamlessly integrated it with our blockchain infrastructure. By leveraging AI and natural language processing, I created intuitive conversational flows that enhance user experience while maintaining the security benefits of our decentralized architecture.",
    statement: "I code because I love transforming ideas into reality! AI and machine learning are my tools, and I'm here to build smarter systems that learn, adapt, and inspire.",
    image: "/team-uploads/137d5d62-0b14-41d4-a3d4-5d2f498cf7dc.png"
  },
  {
    name: "Shashwat Balodhi",
    role: "AI Lead",
    email: "shashwatbalodhi2022@vitbhopal.ac.in",
    education: "Int M.tech in AI",
    skills: ["Machine Learning", "Natural Language Processing", "AI Infrastructure"],
    contribution: "As AI Lead, I designed and implemented our AI-powered document analysis system. I developed robust machine learning models for automated validation and verification of property documents, ensuring accuracy and reliability in our data processing pipeline while maintaining security and compliance standards.",
    statement: "I'm dedicated to leveraging artificial intelligence to solve real-world problems. By combining technical expertise with a focus on user needs, I strive to create AI solutions that are both powerful and accessible.",
    image: "/team-uploads/39bdfe0b-b10f-46ad-ae94-b4da9db5f23d.png"
  },
  {
    name: "Saiyed Alwaz Hussain",
    role: "Blockchain Security Specialist",
    email: "saiyedawlazhussain2022@vitbhopal.ac.in",
    education: "Int. Mtech in Cyber Security",
    skills: ["Blockchain Security", "Smart Contract Auditing", "Secure System Design"],
    contribution: "I focused on ensuring the security and integrity of our blockchain implementation. My work included implementing robust security protocols, conducting smart contract audits, and designing secure communication channels between our frontend, backend, and blockchain components.",
    statement: "I strive to bridge the gap between innovative technologies and user-centric solutions. By leveraging blockchain and modern web development practices, I aim to build systems that are not only secure but also intuitive and impactful.",
    image: "/team-uploads/b5155028-4874-46e3-9774-bf88fba01886.png"
  },
  {
    name: "Chinmay Bhoyar",
    role: "Blockchain Development Engineer",
    email: "chinmaybhoyar2022@vitbhopal.ac.in",
    education: "B.Tech in CSE with specialization in Health Informatics",
    skills: ["Ethereum Development", "Smart Contract Testing", "Contract Optimization"],
    contribution: "I enhanced our blockchain infrastructure through optimized smart contract development and implementation of automated testing frameworks. My work improved contract efficiency, reduced gas costs, and ensured the reliability of our decentralized applications through comprehensive test coverage.",
    statement: "I am passionate about the transformative potential of blockchain technology. By focusing on quality, efficiency, and security in smart contract development, I aim to build solutions that deliver real value to users while maintaining the highest technical standards.",
    image: "/team-uploads/64a96914-b88c-47ca-b246-bc085b53f2d0.png"
  }
];

const TeamSection: React.FC = () => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Meet Our Team</h2>
      <p className="text-gray-700 mb-8">
        Our diverse team brings together expertise in blockchain technology, software development, 
        artificial intelligence, and cybersecurity to create a comprehensive solution for secure 
        and transparent land registry management.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} member={member} />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
