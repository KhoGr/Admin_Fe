import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import { WorkShift } from "../../types/workship";
import dayjs from "dayjs";

type Props = {
  shifts: WorkShift[];
};

const ScheduleStats: React.FC<Props> = ({ shifts }) => {
  const totalShifts = shifts.length;

  const totalHours = shifts.reduce((sum, shift) => {
    const start = dayjs(shift.start_time, "HH:mm:ss");
    const end = dayjs(shift.end_time, "HH:mm:ss");
    const hours = end.diff(start, "minute") / 60;
    return sum + (hours > 0 ? hours : 0);
  }, 0);



  return (
    <></>
    // <Row gutter={16} style={{ marginBottom: 24 }}>
    //   <Col xs={24} sm={8}>
    //     <Card>
    //       <Statistic title="Tổng số ca làm" value={totalShifts} />
    //     </Card>
    //   </Col>
    //   <Col xs={24} sm={8}>
    //     <Card>
    //       <Statistic title="Tổng số giờ làm" value={totalHours.toFixed(2)} suffix="giờ" />
    //     </Card>
    //   </Col>

    // </Row>
  );
};

export default ScheduleStats;
