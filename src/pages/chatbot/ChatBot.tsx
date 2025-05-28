import React, { useState } from "react";
import { Tabs } from "antd";
import { MessageSquare, Search, Sparkles, Zap, Brain } from "lucide-react";
import ResponseTab from "../../components/chatbot/response";
import AddResponseTab from "../../components/chatbot/AddResponseTab";
import AvailableModelsTab from "../../components/chatbot/AvailableModelsTab";
import AdvancedTestTab from "../../components/chatbot/AdvancedTestTab";

const { TabPane } = Tabs;

const aiModels = [
  {
    id: "restaurant-assistant",
    name: "Restaurant Assistant",
    description: "Specialized in restaurant operations, menu, and customer service",
    icon: <MessageSquare className="h-4 w-4" />,
    specialties: ["menu", "hours", "reservations", "location"],
    responseStyle: "friendly",
  },
  {
    id: "smart-search",
    name: "Smart Search",
    description: "Advanced search with fuzzy matching and context understanding",
    icon: <Search className="h-4 w-4" />,
    specialties: ["search", "recommendations", "suggestions"],
    responseStyle: "precise",
  },
  {
    id: "creative-ai",
    name: "Creative AI",
    description: "Creative responses for marketing and promotional content",
    icon: <Sparkles className="h-4 w-4" />,
    specialties: ["promotions", "specials", "events", "marketing"],
    responseStyle: "creative",
  },
  {
    id: "quick-responder",
    name: "Quick Responder",
    description: "Fast, concise answers for common questions",
    icon: <Zap className="h-4 w-4" />,
    specialties: ["hours", "location", "contact", "basic_info"],
    responseStyle: "concise",
  },
  {
    id: "analytical-ai",
    name: "Analytical AI",
    description: "Data-driven responses with detailed explanations",
    icon: <Brain className="h-4 w-4" />,
    specialties: ["analytics", "detailed_info", "explanations"],
    responseStyle: "detailed",
  },
];

const mockResponses = [
  {
    id: "1",
    keyword: "hours",
    response: "We're open from 10am to 10pm every day!",
    category: "operating_hours",
  },
  {
    id: "2",
    keyword: "menu",
    response:
      "You can view our full menu on our website or ask for specific dishes like pasta, pizza, or salads.",
    category: "menu_info",
  },
  {
    id: "3",
    keyword: "reservation",
    response:
      "To make a reservation, please call us at (123) 456-7890 or use our online booking system.",
    category: "booking",
  },
  {
    id: "4",
    keyword: "location",
    response:
      "We're located at 123 Main Street, Foodville. We offer both dine-in and takeout.",
    category: "location",
  },
  {
    id: "5",
    keyword: "delivery",
    response:
      "We offer delivery within 5km radius. Delivery fee is $3 and takes 30-45 minutes.",
    category: "delivery",
  },
  {
    id: "6",
    keyword: "payment",
    response:
      "We accept cash, credit cards, and digital payments like PayPal and mobile wallets.",
    category: "payment",
  },
  {
    id: "7",
    keyword: "special",
    response:
      "Check out our daily specials! Monday: 20% off pasta, Wednesday: Buy 1 get 1 pizza, Friday: Happy hour drinks.",
    category: "promotions",
  },
];

const ChatbotPage: React.FC = () => {
  const [responses, setResponses] = useState(mockResponses);

  interface Response {
    id: string;
    keyword: string;
    response: string;
    category: string;
  }

  interface AIModel {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    specialties: string[];
    responseStyle: string;
  }

  const addResponse = (newResponse: Response) => {
    setResponses((prev: Response[]) => [...prev, newResponse]);
  };

  return (
    <Tabs defaultActiveKey="responses">
      <TabPane tab="Responses" key="responses">
        <ResponseTab responses={responses} />
      </TabPane>
      <TabPane tab="Add Response" key="add-response">
        <AddResponseTab onAdd={addResponse} />
      </TabPane>
      <TabPane tab="Available AI Models" key="available-models">
        <AvailableModelsTab aiModels={aiModels} />
      </TabPane>
      <TabPane tab="Advanced Test" key="advanced-test">
        <AdvancedTestTab aiModels={aiModels} responses={responses} />
      </TabPane>
    </Tabs>
  );
};

export default ChatbotPage;
