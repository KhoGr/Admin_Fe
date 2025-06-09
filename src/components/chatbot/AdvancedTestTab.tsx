import React, { useState } from 'react';
import { Card, Input, Select, Button, Badge } from 'antd';
import { SendOutlined, RobotOutlined } from '@ant-design/icons';
import {
  ChatbotResponse,
} from "../../types/chatbotResponse";
import { AIModel } from "../../types/aiModel";
import chatbotResponseApi from '../../api/chatbotResponseApi';

interface ChatMessage {
  id: string;
  isBot: boolean;
  text: string;
  timestamp: Date;
  confidence?: number;
  model?: string;
}

const { Option } = Select;

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const lenA = a.length;
  const lenB = b.length;

  for (let i = 0; i <= lenB; i++) matrix[i] = [i];
  for (let j = 0; j <= lenA; j++) matrix[0][j] = j;

  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }

  return matrix[lenB][lenA];
}

function calculateConfidence(input: string, keyword: string): number {
  const distance = levenshteinDistance(input.toLowerCase(), keyword.toLowerCase());
  const maxLen = Math.max(input.length, keyword.length);
  const similarity = 1 - distance / maxLen;
  return Math.round(similarity * 100) / 100;
}

const AdvancedTestTab = ({
  aiModels,
  responses
}: {
  aiModels: AIModel[];
  responses: ChatbotResponse[];
}) => {
  const [selectedModel, setSelectedModel] = useState(aiModels[0]?.id || '');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEnabled = true;

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      isBot: false,
      text: userInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    // Call GPT via handleQuery
    chatbotResponseApi.handleQuery(userInput)
      .then((res) => {
        const botMessage: ChatMessage = {
          id: Date.now().toString() + '-bot',
          isBot: true,
          text: res.data.reply,
          model: selectedModel,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMessage]);
      })
      .catch(() => {
        // Fallback to keyword-based match
        let bestMatch: ChatbotResponse | undefined;
        let highestConfidence = 0;

        for (const r of responses) {
          const confidence = calculateConfidence(userInput, r.keyword);
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            bestMatch = r;
          }
        }

        const fallbackText =
          highestConfidence >= 0.5 && bestMatch
            ? bestMatch.response
            : "Xin lỗi, tôi chưa hiểu câu hỏi này!";

        const fallbackMessage: ChatMessage = {
          id: Date.now().toString() + '-fallback',
          isBot: true,
          text: fallbackText,
          confidence: highestConfidence,
          model: selectedModel,
          timestamp: new Date()
        };

        setChatMessages(prev => [...prev, fallbackMessage]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const currentModel = aiModels.find((m) => m.id === selectedModel);

  return (
    <div className="advanced-test-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
      <Card title="Multi-Model Chatbot Test" bordered style={{ height: '100%' }}>


        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, height: 400, overflowY: 'auto' }}>
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
                marginBottom: 12
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  background: msg.isBot ? '#f0f0f0' : '#1890ff',
                  color: msg.isBot ? '#000' : '#fff',
                  padding: 10,
                  borderRadius: 12
                }}
              >
                <div style={{ fontSize: 14 }}>{msg.text}</div>
                {msg.isBot && msg.confidence !== undefined && (
                  <div style={{ marginTop: 4 }}>
                    <Badge count={`${msg.model} - ${(msg.confidence * 100).toFixed(0)}%`} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ color: '#999' }}>
              <RobotOutlined /> Typing...
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <Input
            placeholder="Ask a question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onPressEnter={handleSendMessage}
            disabled={!chatEnabled || isTyping}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!chatEnabled || !userInput.trim() || isTyping}
          />
        </div>
      </Card>

      <div className="side-column" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Current Model Info">
          {currentModel && (
            <>
              <div style={{ fontWeight: 500 }}>{currentModel.name}</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{currentModel.description}</div>
              <div>
                <strong>Specialties: </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {currentModel.specialties?.map((sp) => (
                    <Badge key={sp} count={sp} style={{ backgroundColor: '#f0f0f0', color: '#000' }} />
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <strong>Response Style:</strong>{' '}
                <Badge count={currentModel.response_style} style={{ backgroundColor: '#e6f7ff' }} />
              </div>
            </>
          )}
        </Card>

        <Card title="Quick Test Queries">
          {["What are your hours?", "Do you deliver food?", "How can I make a reservation?", "What's on the menu today?", "Do you accept credit cards?", "Any special offers?", "Where are you located?"]
            .map((q, i) => (
              <Button
                key={i}
                onClick={() => {
                  setUserInput(q);
                  setTimeout(() => handleSendMessage(), 200);
                }}
                style={{ marginBottom: 4 }}
                disabled={!chatEnabled || isTyping}
                block
              >
                {q}
              </Button>
            ))}
        </Card>

        <Card title="Chat Statistics">
          <p>Total Messages: <strong>{chatMessages.length}</strong></p>
          <p>Bot Responses: <strong>{chatMessages.filter(m => m.isBot).length}</strong></p>
          <p>User Messages: <strong>{chatMessages.filter(m => !m.isBot).length}</strong></p>
          <p>Knowledge Base: <strong>{responses.length} responses</strong></p>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedTestTab;
