import React from "react";
import { Card, Col, Row, Typography, Tag } from "antd";
import { MessageSquare, Search, Sparkles, Zap, Brain } from "lucide-react";

import { AIModel } from "../../types/aiModel";

const { Title, Paragraph } = Typography;

interface AvailableModelsTabProps {
  aiModels: AIModel[];
}

const iconMap: Record<AIModel["response_style"], React.ReactNode> = {
  friendly: <MessageSquare className="h-4 w-4" />,
  precise: <Search className="h-4 w-4" />,
  creative: <Sparkles className="h-4 w-4" />,
  concise: <Zap className="h-4 w-4" />,
  detailed: <Brain className="h-4 w-4" />,
};

const AvailableModelsTab: React.FC<AvailableModelsTabProps> = ({ aiModels }) => {
  return (
    <div>
      <Title level={4}>Available AI Models</Title>
      <Paragraph>Select from the list of supported AI models for your chatbot.</Paragraph>

      <Row gutter={[16, 16]}>
        {aiModels.map((model) => (
          <Col xs={24} sm={12} lg={8} key={model.id}>
            <Card
              title={model.name}
              bordered
              hoverable
              extra={iconMap[model.response_style]}
            >
              <Paragraph>{model.description}</Paragraph>
              <Paragraph>
                <strong>Style:</strong>{" "}
                <Tag color="blue">{model.response_style}</Tag>
              </Paragraph>
              {Array.isArray(model.specialties) && model.specialties.length > 0 && (
                <div>
                  <strong>Specialties:</strong>
                  <div style={{ marginTop: 4 }}>
                    {model.specialties.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AvailableModelsTab;
