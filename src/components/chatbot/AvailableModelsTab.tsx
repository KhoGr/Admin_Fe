// components/AvailableModelsTab.tsx
import React from "react";
import { Card, Col, Row, Typography, Tag } from "antd";
import { MessageSquare, Search, Sparkles, Zap, Brain } from "lucide-react";

const { Title, Paragraph } = Typography;

interface Model {
  name: string;
  description: string;
  version: string;
  tags: string[];
}
interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  specialties: string[];
  responseStyle: string;
}

interface AvailableModelsTabProps {
  aiModels: AIModel[];
}
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

const availableModels: Model[] = [
  {
    name: "GPT-4",
    description: "Advanced reasoning, creativity, and language understanding.",
    version: "4.0",
    tags: ["OpenAI", "Advanced", "Premium"]
  },
  {
    name: "GPT-3.5",
    description: "Fast, cost-effective, and capable for general usage.",
    version: "3.5",
    tags: ["OpenAI", "Balanced", "Default"]
  },
  {
    name: "Claude 3",
    description: "Anthropic's conversational model for safe and fluent dialogue.",
    version: "3.0",
    tags: ["Anthropic", "Safe", "Fluent"]
  },
  {
    name: "LLaMA 2",
    description: "Meta's open-source foundation model optimized for efficiency.",
    version: "2.0",
    tags: ["Meta", "Open Source", "Efficient"]
  },
  {
    name: "Rasa 2",
    description: "Chưa test.",
    version: "2.0",
    tags: ["Meta", "Open Source", "Efficient"]
  }
];

const AvailableModelsTab: React.FC<AvailableModelsTabProps> = ({ aiModels }) => {
  return (
    <div>
      <Title level={4}>Available AI Models</Title>
      <Paragraph>Select from the list of supported AI models for your chatbot.</Paragraph>

      <Row gutter={[16, 16]}>
        {availableModels.map((model) => (
          <Col xs={24} sm={12} lg={8} key={model.name}>
            <Card title={model.name} bordered hoverable>
              <Paragraph>{model.description}</Paragraph>
              <Paragraph>
                <strong>Version:</strong> {model.version}
              </Paragraph>
              <div>
                {model.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AvailableModelsTab;
