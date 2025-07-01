import React, { useEffect, useState } from 'react';
import { Button, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

import {
  InventoryBatchPayload,
  InventoryBatchResponse,
} from '../../types/inventoryBatch';
import inventoryBatchApi from '../../api/inventoryBatchApi';

import AddInventoryBatchModal from '../../components/inventory/AddInventoryBatchModal';
import InventoryBatchTable from '../../components/inventory/InventoryBatchTable';

const InventoryBatchPage: React.FC = () => {
  const [batches, setBatches] = useState<InventoryBatchResponse[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [existingUnits, setExistingUnits] = useState<string[]>([]);

  const [editBatch, setEditBatch] = useState<InventoryBatchResponse | null>(null);

  const fetchBatches = async (month: Dayjs) => {
    try {
      const monthString = month.format('YYYY-MM');
      const res = await inventoryBatchApi.getByMonth(monthString);
      setBatches(res.data);
      extractUniqueUnits(res.data);
    } catch (err) {
      message.error('Failed to fetch inventory batches');
    }
  };

  const fetchItemNames = async () => {
    try {
      const res = await inventoryBatchApi.getUniqueItemNames();
      setExistingNames(res.data);
    } catch (err) {
      message.error('Failed to fetch item names');
    }
  };

  const extractUniqueUnits = (data: InventoryBatchResponse[]) => {
    const units = Array.from(new Set(data.map(b => b.unit)));
    setExistingUnits(units);
  };

  useEffect(() => {
    fetchBatches(selectedMonth);
    fetchItemNames();
  }, [selectedMonth]);

  const handleAdd = async (data: InventoryBatchPayload) => {
    try {
      await inventoryBatchApi.create(data);
      message.success('Batch added successfully');
      setModalOpen(false);
      fetchBatches(selectedMonth);
      fetchItemNames();
    } catch (err) {
      message.error('Failed to add batch');
    }
  };

  const handleUpdate = async (data: InventoryBatchPayload) => {
    if (!editBatch) return;
    try {
      await inventoryBatchApi.update(editBatch.id, data);
      message.success('Batch updated successfully');
      setModalOpen(false);
      setEditBatch(null);
      fetchBatches(selectedMonth);
    } catch (err) {
      message.error('Failed to update batch');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await inventoryBatchApi.delete(id);
      message.success('Batch deleted successfully');
      fetchBatches(selectedMonth);
    } catch (err) {
      message.error('Failed to delete batch');
    }
  };

  const handleEdit = (batch: InventoryBatchResponse) => {
    setEditBatch(batch);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Inventory Batch Management</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            setEditBatch(null);
            setModalOpen(true);
          }}
        >
          Add New Batch
        </Button>
      </Space>

      <InventoryBatchTable
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        batches={batches}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddInventoryBatchModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditBatch(null);
        }}
        onSubmit={editBatch ? handleUpdate : handleAdd}
        existingNames={existingNames}
        existingUnits={existingUnits}
        initialData={editBatch}
      />
    </div>
  );
};

export default InventoryBatchPage;
