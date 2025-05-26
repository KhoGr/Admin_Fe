import React, { useState } from 'react';
import { Card, Typography, Tabs, Input, Button, Switch, Table, Select, Badge , Space,Tooltip,Form, Tag} from 'antd';
import {
  MessageOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ExperimentOutlined,
  HighlightOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  MessageSquare,
  Plus,
  Save,
  Trash2,
  Send,
  Bot,
  User,
  Brain,
  Sparkles,
  Zap,
  Search,
} from 'lucide-react';
import { Label } from 'recharts';
import { useToast } from "../../shared/hook/toast/use-toast";


const { TabPane } = Tabs;
const { Column } = Table;
const { Option } = Select;

interface ChatbotResponse {
  id: string;
  keyword: string;
  response: string;
  category?: string;
}

interface ChatMessage {
  id: string;
  isBot: boolean;
  text: string;
  timestamp: Date;
  confidence?: number;
  model?: string;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  specialties: string[];
  responseStyle: string;
}

const aiModels: AIModel[] = [
  {
    id: 'restaurant-assistant',
    name: 'Restaurant Assistant',
    description: 'Specialized in restaurant operations, menu, and customer service',
    icon: <MessageSquare className="h-4 w-4" />,
    specialties: ['menu', 'hours', 'reservations', 'location'],
    responseStyle: 'friendly',
  },
];
const mockResponses: ChatbotResponse[] = [
  {
    id: "1",
    keyword: "hours",
    response: "We're open from 10am to 10pm every day!",
    category: "operating_hours"
  },
  {
    id: "2", 
    keyword: "menu",
    response: "You can view our full menu on our website or ask for specific dishes like pasta, pizza, or salads.",
    category: "menu_info"
  },
]
const searchResponses = (
  query: string,
  responses: ChatbotResponse[],
  modelId: string,
): { response: ChatbotResponse; confidence: number; model: string } | null => {
  const queryLower = query.toLowerCase().trim();
  const selectedModel = aiModels.find((m) => m.id === modelId);

  // Model-specific search logic
  let bestMatch: ChatbotResponse | undefined;
  let confidence = 0;

  // Direct keyword match
  bestMatch = responses.find((r) => queryLower.includes(r.keyword.toLowerCase()));
  if (bestMatch) {
    confidence = selectedModel?.id === 'quick-responder' ? 0.95 : 0.9;
    return { response: bestMatch, confidence, model: selectedModel?.name || 'Default' };
  }
  const synonyms: { [key: string]: string[] } = {
    hours: ['time', 'open', 'close', 'schedule', 'when'],
    menu: ['food', 'dish', 'eat', 'meal', 'cuisine', 'order'],
    reservation: ['book', 'table', 'reserve', 'appointment'],
    location: ['address', 'where', 'find', 'direction'],
    delivery: ['deliver', 'takeout', 'pickup', 'order'],
    payment: ['pay', 'money', 'cost', 'price', 'card', 'cash'],
    special: ['offer', 'discount', 'deal', 'promotion', 'sale'],
  };

  for (const [keyword, syns] of Object.entries(synonyms)) {
    if (syns.some((syn) => queryLower.includes(syn))) {
      const match = responses.find((r) => r.keyword === keyword);
      if (match) {
        // Adjust confidence based on model specialties
        const modelSpecialties = selectedModel?.specialties || [];
        const isSpecialty =
          modelSpecialties.includes(keyword) || modelSpecialties.includes(match.category || '');
        confidence = isSpecialty ? 0.85 : 0.7;

        return { response: match, confidence, model: selectedModel?.name || 'Default' };
      }
    }
  }

  // Smart search model gets higher confidence for partial matches
  if (modelId === 'smart-search') {
    const partialMatch = responses.find(
      (r) =>
        r.response.toLowerCase().includes(queryLower) ||
        queryLower.includes(r.keyword.toLowerCase().substring(0, 3)),
    );
    if (partialMatch) {
      return { response: partialMatch, confidence: 0.6, model: selectedModel?.name || 'Default' };
    }
  }

  return null;
};
export default function Chatbot() {
  const [chatEnabled, setChatEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('responses');
  const [responses, setResponses] = useState<ChatbotResponse[]>(mockResponses);
  const [keyword, setKeyword] = useState('');
  const [response, setResponse] = useState('');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('restaurant-assistant');
  const { toast } = useToast();

  // Enhanced chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      isBot: true,
      text: "Hi! I'm your intelligent restaurant assistant. I can help you with hours, menu, reservations, delivery, payments, and special offers. What would you like to know?",
      timestamp: new Date(),
      confidence: 1.0,
      model: 'Restaurant Assistant',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSaveResponse = () => {
    if (!keyword.trim() || !response.trim()) {
      toast({
        title: 'Missing information',
        description: 'Both keyword and response are required',
        variant: 'destructive',
      });
      return;
    }

    if (editingId) {
      setResponses(
        responses.map((item) =>
          item.id === editingId ? { ...item, keyword, response, category } : item,
        ),
      );
      toast({
        title: 'Response updated',
        description: `Updated response for keyword "${keyword}"`,
      });
      setEditingId(null);
    } else {
      const newResponse = {
        id: Date.now().toString(),
        keyword: keyword.toLowerCase().trim(),
        response: response.trim(),
        category: category || 'general',
      };
      setResponses([...responses, newResponse]);
      toast({
        title: 'Response added',
        description: `Added new response for keyword "${keyword}"`,
      });
    }

    setKeyword('');
    setResponse('');
    setCategory('');
  };

  const handleEdit = (item: ChatbotResponse) => {
    setKeyword(item.keyword);
    setResponse(item.response);
    setCategory(item.category || '');
    setEditingId(item.id);
    setActiveTab('add');
  };

  const handleDelete = (id: string) => {
    setResponses(responses.filter((item) => item.id !== id));
    toast({
      title: 'Response deleted',
      description: 'Chatbot response has been removed',
    });

    if (editingId === id) {
      setKeyword('');
      setResponse('');
      setCategory('');
      setEditingId(null);
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || !chatEnabled) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      isBot: false,
      text: userInput.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Enhanced search with model-specific logic
    const searchResult = searchResponses(userInput, responses, selectedModel);
    const currentModel = aiModels.find((m) => m.id === selectedModel);

    // Add bot response after a realistic delay
    setTimeout(() => {
      let botText = `I'm sorry, I don't understand that question. Can you try asking about our hours, menu, reservations, delivery, or special offers?`;
      let confidence = 0.1;
      let modelName = currentModel?.name || 'Default';

      if (searchResult) {
        botText = searchResult.response.response;
        confidence = searchResult.confidence;
        modelName = searchResult.model;

        // Apply model-specific response styling
        if (
          currentModel?.responseStyle === 'creative' &&
          searchResult.response.category === 'promotions'
        ) {
          botText = `✨ ${botText} Don't miss out on this amazing opportunity! 🎉`;
        } else if (currentModel?.responseStyle === 'concise') {
          botText = botText.split('.')[0] + '.'; // Keep only first sentence
        } else if (currentModel?.responseStyle === 'detailed') {
          botText += ' Feel free to ask if you need more specific information!';
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        isBot: true,
        text: botText,
        timestamp: new Date(),
        confidence,
        model: modelName,
      };

      setChatMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500);

    setUserInput('');
  };

  const categories = [
    'general',
    'operating_hours',
    'menu_info',
    'booking',
    'delivery',
    'payment',
    'promotions',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Enhanced Multi-Model Chatbot</h1>
        <div className="flex items-center space-x-2">
          <Label className="chatbot-status">Chatbot Active</Label>
          <Switch id="chatbot-status" checked={chatEnabled} onChange={setChatEnabled} />
        </div>
      </div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="w-full">
        <Tabs.TabPane tab="Responses" key="responses">
          <Card title={`Chatbot Responses (${responses.length})`}>
            <div style={{ maxHeight: 500, overflow: 'auto' }}>
              <Table dataSource={responses} rowKey="id" pagination={false}>
                <Table.Column title="Keyword" dataIndex="keyword" key="keyword" />
                <Table.Column
                  title="Category"
                  dataIndex="category"
                  key="category"
                  render={(text) => <Tag>{text || 'general'}</Tag>}
                />
                <Table.Column
                  title="Response"
                  dataIndex="response"
                  key="response"
                  render={(text) => (
                    <div
                      style={{
                        maxWidth: 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {text}
                    </div>
                  )}
                />
                <Table.Column
                  title="Actions"
                  key="actions"
                  width={100}
                  render={(_, item) => (
                    <Space>
                      <Tooltip title="Edit">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(item as ChatbotResponse)} />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(item.id)}
                        />
                      </Tooltip>
                    </Space>
                  )}
                />
              </Table>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="mt-4"
              onClick={() => {
                setActiveTab('add');
                setKeyword('');
                setResponse('');
                setCategory('');
                setEditingId(null);
              }}
            >
              Add New Response
            </Button>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab={editingId ? 'Edit Response' : 'Add Response'} key="add">
          <Card title={editingId ? 'Edit Response' : 'Add New Response'}>
            <Form layout="vertical" onFinish={handleSaveResponse}>
              <Form.Item label="Keyword or Phrase" required>
                <Input
                  placeholder="Enter keyword (e.g., hours, menu, location)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Category">
                <Select
                  value={category}
                  onChange={(value) => setCategory(value)}
                  placeholder="Select category"
                >
                  {categories.map((cat) => (
                    <Select.Option key={cat} value={cat}>
                      {cat}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Response">
                <Input.TextArea
                  rows={5}
                  placeholder="Enter the response that the chatbot should give"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editingId ? 'Update Response' : 'Add Response'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
