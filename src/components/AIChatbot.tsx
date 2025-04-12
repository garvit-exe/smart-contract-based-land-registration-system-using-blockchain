
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ArrowDown, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

// Mock predefined responses for the chatbot
const botResponses = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello! Welcome to LandLedger. How can I assist you with your property needs today?"
  },
  {
    keywords: ['register', 'registration', 'sign up', 'create account'],
    response: "To register a new account, please click on the 'Register' button in the top right corner of the homepage. You'll need to provide some basic information and verify your email address."
  },
  {
    keywords: ['property', 'land', 'register property', 'add property'],
    response: "Property registration requires official authorization. If you're a government official, you can register properties through the 'Register Property' section after logging in. Property owners can view their properties in the dashboard."
  },
  {
    keywords: ['transfer', 'sell', 'ownership', 'change owner'],
    response: "To transfer property ownership, navigate to your property details page and click on the 'Transfer Ownership' button. You'll need to provide the blockchain address of the new owner and confirm the transaction with your digital wallet."
  },
  {
    keywords: ['mortgage', 'loan', 'finance', 'funding'],
    response: "Our platform supports property mortgages and loans. Property owners can create a mortgage by specifying a lender address and amount. To learn more, visit the property details page and look for the 'Create Mortgage' option."
  },
  {
    keywords: ['verify', 'verification', 'authenticate', 'validate'],
    response: "Property verification is handled by authorized validators. Once a property is verified, it will display a verification badge. You can check a property's verification status on its details page."
  },
  {
    keywords: ['blockchain', 'smart contract', 'ethereum', 'web3'],
    response: "LandLedger uses Ethereum blockchain technology and smart contracts to create a secure, transparent property registry system. All property transactions are recorded on the blockchain, providing an immutable record of ownership."
  },
  {
    keywords: ['contact', 'support', 'help', 'assist'],
    response: "For additional support, please visit our Contact page or email support@landledger.com. Our team is available to assist you Monday through Friday, 9 AM to 5 PM EST."
  }
];

// Fallback response when no keywords match
const fallbackResponses = [
  "I don't have specific information about that yet. Could you please rephrase your question?",
  "I'm still learning about that topic. Can I help you with property registration, transfers, or verification instead?",
  "I'm not sure I understand. Could you try asking in a different way?",
  "That's a bit outside my knowledge area. I'm best at helping with property registration, transfers, and blockchain-related questions."
];

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I\'m your LandLedger assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const generateBotResponse = (userMessage: string): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    // Check for keyword matches
    for (const item of botResponses) {
      if (item.keywords.some(keyword => userMessageLower.includes(keyword))) {
        return item.response;
      }
    }
    
    // Return random fallback if no matches
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate bot thinking and typing
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: generateBotResponse(userMessage.text),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  if (!isOpen) {
    return (
      <Button 
        onClick={toggleChat} 
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <Card className={`fixed bottom-5 right-5 shadow-xl flex flex-col bg-white z-50 rounded-lg overflow-hidden 
      ${isMinimized ? 'w-72 h-16' : 'w-80 sm:w-96 h-[500px]'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white p-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-medium">LandLedger Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-white hover:text-white hover:bg-blue-700 rounded-full"
            onClick={toggleMinimize}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-white hover:text-white hover:bg-blue-700 rounded-full"
            onClick={toggleChat}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {message.sender === 'bot' && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/team-uploads/9776308b-6cf3-49e8-9485-cbfc41a6ffc4.png" />
                        <AvatarFallback>LL</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div 
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/team-uploads/9776308b-6cf3-49e8-9485-cbfc41a6ffc4.png" />
                      <AvatarFallback>LL</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 text-sm bg-white text-gray-800 border border-gray-200">
                      <span className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input 
                placeholder="Type a message..." 
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={input.trim() === ''} 
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIChatbot;
