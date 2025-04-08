import { Card, Timeline, Typography } from "antd";
import { Link } from "react-router-dom";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Activity } from "src/types/Dashboard";

const {  Text } = Typography;



const ActivitySteps: Activity[] = [
  { time: "09:00", action: "Đến công ty", color: "blue" },
  { time: "12:00", action: "Nghỉ trưa", id: "#ML-3467", color: "orange" },
  { time: "13:00", action: "Làm Ca chiều", color: "orange" },
  { time: "18:00", action: "Tan làm", id: "#ML-3467", color: "green" },
  { time: "20:00", action: "Làm bài tập", color: "red" },
  { time: "22:00", action: "Rải Lao", color: "blue" },
];

const DailyActivity: React.FC = () => {
  return (
    <Card title="Daily Activities" bordered={false} style={{ width: "100%" }}>
      <Timeline>
        {ActivitySteps.map((item, index) => (
          <Timeline.Item
            key={index}
            color={item.color}
            dot={index === 0 ? <ClockCircleOutlined style={{ fontSize: "16px" }} /> : undefined}
          >
            {/* index =0 thì hiển thị mặt đồng hồ không sẽ là dot */}
            <Text strong>{item.time}</Text> - {item.action} <br />
            {item.id && (
              <Link to="#" style={{ color: "#1890ff" }}>
                {item.id}
              </Link>
            )}
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};

export default DailyActivity;
