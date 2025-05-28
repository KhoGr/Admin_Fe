// components/ResponseTab.tsx
import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;
interface Response {
  id: string;
  keyword: string;
  response: string;
  category: string;
}

interface ResponseTabProps {
  responses: Response[];
}

const ResponseTab: React.FC<ResponseTabProps> = ({ responses }) => {
  return (
    <div>
      <Title level={4}>Response</Title>
      <Paragraph>
        This is the Response tab content. You can display your chatbot responses here.
      </Paragraph>
      {/* Place your chatbot UI or logic here */}
    </div>
  );
};

export default ResponseTab;
