import { Card, Col, Row, Statistic } from "antd";
import { Crown, Star, TrendingUp, Users } from "lucide-react";

type Props = {
  stats: {
    diamond: number;
    gold: number;
    silver: number;
    bronze: number;
  };
};

export const VipStatsCards = ({ stats }: Props) => {
  const items = [
    {
      title: "Diamond",
      value: stats.diamond,
      icon: <Crown className="h-4 w-4 text-purple-500" />,
      description: "Thành viên cao cấp nhất",
    },
    {
      title: "Gold",
      value: stats.gold,
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      description: "Thành viên vàng",
    },
    {
      title: "Silver",
      value: stats.silver,
      icon: <TrendingUp className="h-4 w-4 text-gray-400" />,
      description: "Thành viên bạc",
    },
    {
      title: "Bronze",
      value: stats.bronze,
      icon: <Users className="h-4 w-4 text-orange-500" />,
      description: "Thành viên đồng",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col xs={24} sm={12} md={12} lg={6} key={item.title}>
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{item.title}</span>
              {item.icon}
            </div>
            <Statistic value={item.value} valueStyle={{ fontSize: 24, fontWeight: "bold" }} />
            <div className="text-xs text-gray-500 mt-1">{item.description}</div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
