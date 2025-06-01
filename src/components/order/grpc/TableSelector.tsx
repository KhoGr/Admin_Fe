import React, { useEffect, useState } from 'react';
import { Modal, Typography, Tag, Space, message, Divider, Tooltip } from 'antd';
import { Table as TableModel, TableStatus } from '../../../types/table';
import './TableSelectModal.css';

type Props = {
  open: boolean;
  tables: TableModel[];
  selected: TableModel[];
  guestCount: number;
  onSelect: (tables: TableModel[]) => void;
  onCancel: () => void;
  onClose: () => void;
};

const getStatusColor = (status: TableStatus) => {
  switch (status) {
    case 'available':
      return 'green';
    case 'occupied':
      return 'red';
    case 'reserved':
      return 'orange';
    case 'unavailable':
      return 'gray';
    default:
      return 'blue';
  }
};

const TableSelectModal = ({ open, tables, selected, guestCount, onSelect, onCancel }: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setSelectedIds(selected.map((t) => t.table_id));
  }, [selected]);

  const toggleTable = (id: number) => {
    const table = tables.find((t) => t.table_id === id);
    if (!table || table.status !== 'available') {
      message.warning('Chỉ được chọn bàn đang trống.');
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selectedTables = tables.filter((t) => selectedIds.includes(t.table_id));
    const totalSeats = selectedTables.reduce((sum, t) => sum + t.seat_count, 0);

    if (totalSeats < guestCount) {
      setError(`Tổng số ghế (${totalSeats}) không đủ cho ${guestCount} khách.`);
      return;
    }
    if (totalSeats > guestCount * 2) {
      setError(`Tổng số ghế (${totalSeats}) vượt quá nhu cầu (tối đa ${guestCount * 2} ghế).`);
      return;
    }

    setError('');
    onSelect(selectedTables);
  };

  return (
    <Modal
      open={open}
      title="Chọn bàn"
      onCancel={onCancel}
      onOk={handleConfirm}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Typography.Text strong>
        {guestCount > 0
          ? `Số khách: ${guestCount} (tối thiểu ${guestCount} ghế, tối đa ${guestCount * 2} ghế)`
          : 'Số khách: Chưa xác định'}
      </Typography.Text>

      <Divider />

      {/* Ẩn toàn bộ danh sách bàn nếu guestCount <= 0 */}
      {guestCount > 0 ? (
        <div className="table-grid">
          {tables.map((table) => {
            const isSelected = selectedIds.includes(table.table_id);
            const isDisabled = table.status !== 'available';

            return (
              <Tooltip
                key={table.table_id}
                title={`Bàn ${table.table_number} - ${table.seat_count} ghế (${table.status})`}
              >
                <Tag.CheckableTag
                  checked={isSelected}
                  onChange={() => {
                    if (!isDisabled) toggleTable(table.table_id);
                  }}
                  className="table-tag"
                  style={{
                    marginBottom: 8,
                    backgroundColor: isDisabled ? '#f5f5f5' : undefined,
                    borderColor: getStatusColor(table.status),
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.6 : 1,
                  }}
                >
                  Bàn {table.table_number} - Tầng {table.floor} ({table.seat_count} ghế)
                </Tag.CheckableTag>
              </Tooltip>
            );
          })}
        </div>
      ) : (
        <Typography.Text type="secondary">
          Vui lòng nhập số lượng khách để hiển thị danh sách bàn.
        </Typography.Text>
      )}

      {selectedIds.length > 0 && (
        <>
          <Divider />
          <Typography.Text strong>Đã chọn:</Typography.Text>
          <Space wrap style={{ marginTop: 8 }}>
            {tables
              .filter((t) => selectedIds.includes(t.table_id))
              .map((table) => (
                <Tag key={table.table_id} color={getStatusColor(table.status)}>
                  Bàn {table.table_number} - Tầng {table.floor} ({table.seat_count} ghế) - {table.status}
                </Tag>
              ))}
          </Space>
        </>
      )}

      {error && (
        <Typography.Text type="danger" style={{ marginTop: 12, display: 'block' }}>
          {error}
        </Typography.Text>
      )}
    </Modal>
  );
};

export default TableSelectModal;
