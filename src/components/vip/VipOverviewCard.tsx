import { Card, Statistic, Row, Col } from 'antd';

type Props = {
  totalSpent: number;
  avgPoints: number;
  userCount: number;
};

export const VipOverviewCard = ({ totalSpent, avgPoints, userCount }: Props) => {
  return (
    <Card title="Thống kê tổng quan" bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Statistic
            title="Tổng chi tiêu VIP"
            value={totalSpent}
            precision={0}
            prefix="₫"
            valueStyle={{ fontWeight: 500 }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Điểm TB/khách hàng"
            value={Math.round(avgPoints)}
            valueStyle={{ fontWeight: 500 }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Tổng thành viên"
            value={userCount}
            valueStyle={{ fontWeight: 500 }}
          />
        </Col>
      </Row>
    </Card>
  );
};
