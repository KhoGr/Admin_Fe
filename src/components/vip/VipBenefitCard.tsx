import { Card, Tooltip } from 'antd';
import { Gift, Headphones, Truck } from 'lucide-react';
import { VipLevel } from '../../types/vip';

type Props = {
  levels: VipLevel[];
  getVipIcon: (levelName: string) => JSX.Element;
  getVipColor: (levelName: string) => string; 
};

export const VipBenefitCard = ({ levels, getVipIcon, getVipColor }: Props) => {
  return (
    <Card title="Quyền lợi theo Level VIP">
      {levels.map((level) => {
        const benefits = level.benefits || {};
        return (
          <div
            key={level.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            {/* Left: Level icon + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: getVipColor(level.name),
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getVipIcon(level.name)}
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{level.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  Tổng chi tiêu từ {level.min_total_spent.toLocaleString()}đ
                </div>
              </div>
            </div>

            {/* Right: Benefit info */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>
                {level.discount_percent}% giảm giá
              </div>
              <div style={{ fontSize: 12, color: '#888', display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                {benefits.freeDelivery && (
                  <Tooltip title="Giao hàng miễn phí">
                    <Truck style={{ width: 14, height: 14 }} />
                  </Tooltip>
                )}
                {benefits.prioritySupport && (
                  <Tooltip title="Hỗ trợ ưu tiên">
                    <Headphones style={{ width: 14, height: 14 }} />
                  </Tooltip>
                )}
                {'monthlyVouchers' in benefits && (
                  <Tooltip title="Voucher hàng tháng">
                    <Gift style={{ width: 14, height: 14 }} />
                  </Tooltip>
                )}
                {'monthlyVouchers' in benefits && (
                  <span>{benefits.monthlyVouchers} voucher/tháng</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
};
