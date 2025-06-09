import React, { useEffect, useState } from "react";
import { Tabs, Spin } from "antd";
import toast from "react-hot-toast"; // ✅ Dùng toast từ react-hot-toast

import ResponseTab from "../../components/chatbot/response";
import AddResponseTab from "../../components/chatbot/AddResponseTab";
import AvailableModelsTab from "../../components/chatbot/AvailableModelsTab";
import AdvancedTestTab from "../../components/chatbot/AdvancedTestTab";
import chatbotResponseApi from "../../api/chatbotResponseApi";
import aiModelApi from "../../api/aiModelApi";
import {
  ChatbotResponse,
  CreateChatbotResponseDTO,
  UpdateChatbotResponseDTO,
} from "../../types/chatbotResponse";
import { AIModel } from "../../types/aiModel";

const { TabPane } = Tabs;

const ChatbotPage: React.FC = () => {
  const [responses, setResponses] = useState<ChatbotResponse[]>([]);
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [responsesData, aiModelsData] = await Promise.all([
        chatbotResponseApi.getAll(),
        aiModelApi.getAll(),
      ]);

      setResponses(responsesData.data);
      setAiModels(aiModelsData.data);
    } catch (err) {
      console.error("Error fetching data", err);
      toast.error("Không thể tải dữ liệu chatbot."); // ✅ Toast error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = async (responseId: number) => {
  try {
    await chatbotResponseApi.delete(responseId);
    setResponses((prev) => prev.filter((r) => r.response_id !== responseId));
    toast.success("Xoá phản hồi thành công.");
  } catch (err) {
    console.error("Lỗi khi xoá phản hồi", err);
    toast.error("Không thể xoá phản hồi.");
  }
};

  const handleSubmit = async (
    data: CreateChatbotResponseDTO | UpdateChatbotResponseDTO,
    isUpdate: boolean
  ) => {
    try {
      if (isUpdate && "response_id" in data) {
        const updated = await chatbotResponseApi.update(Number(data.response_id), data);
        setResponses((prev) =>
          prev.map((r) => (r.response_id === updated.data.response_id ? updated.data : r))
        );
        toast.success("Cập nhật phản hồi thành công."); // ✅ Toast success
      } else {
        const created = await chatbotResponseApi.create(data as CreateChatbotResponseDTO);
        setResponses((prev) => [...prev, created.data]);
        toast.success("Thêm phản hồi mới thành công."); // ✅ Toast success
      }
    } catch (err) {
      console.error("Lỗi khi lưu phản hồi", err);
      toast.error("Không thể lưu phản hồi."); // ✅ Toast error
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Tabs defaultActiveKey="responses">
      <TabPane tab="Responses" key="responses">
        <ResponseTab responses={responses} onDelete={handleDelete} />
      </TabPane>
      <TabPane tab="Add Response" key="add-response">
        <AddResponseTab onSubmit={handleSubmit} aiModels={aiModels} />
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
