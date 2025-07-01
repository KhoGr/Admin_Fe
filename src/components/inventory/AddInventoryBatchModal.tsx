import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
} from 'antd';
import { InventoryBatchPayload, InventoryBatchResponse } from '../../types/inventoryBatch';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InventoryBatchPayload, id?: number) => void;
  existingNames?: string[];
  existingUnits?: string[];
  initialData?: InventoryBatchResponse | null;
}

const AddInventoryBatchModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  existingNames = [],
  existingUnits = [],
  initialData = null,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        quantity: initialData.quantity,
        unit: initialData.unit,
        total_value: initialData.total_value,
        supplier: initialData.supplier,
      });
    } else {
      form.resetFields();
    }
  }, [initialData]);

  const handleFinish = (values: any) => {
    const quantity = parseFloat(values.quantity);
    const totalValue = parseFloat(values.total_value);

    const payload: InventoryBatchPayload = {
      name: values.name,
      quantity,
      unit: values.unit,
      unit_price: totalValue / quantity,
      total_value: totalValue,
      supplier: values.supplier,
    };

    onSubmit(payload, initialData?.id);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={initialData ? 'Edit Inventory Batch' : 'Add Inventory Batch'}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => form.submit()}
      okText={initialData ? 'Update' : 'Add'}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Item Name"
          rules={[{ required: true, message: 'Please enter item name' }]}
        >
          <Select
            showSearch
            placeholder="Select or type new item"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Form.Item noStyle shouldUpdate>
                  {() => (
                    <Input
                      style={{ margin: 8 }}
                      placeholder="Type new item"
                      onPressEnter={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        if (value) {
                          form.setFieldsValue({ name: value });
                        }
                      }}
                    />
                  )}
                </Form.Item>
              </>
            )}
            options={existingNames.map((name) => ({ label: name, value: name }))}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: 'Please enter quantity' }]}
        >
          <Input placeholder="e.g. 5, 10.5" />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Unit"
          rules={[{ required: true, message: 'Please enter unit' }]}
        >
          <Select
            showSearch
            placeholder="Select or type new unit"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Form.Item noStyle shouldUpdate>
                  {() => (
                    <Input
                      style={{ margin: 8 }}
                      placeholder="Type new unit"
                      onPressEnter={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        if (value) {
                          form.setFieldsValue({ unit: value });
                        }
                      }}
                    />
                  )}
                </Form.Item>
              </>
            )}
            options={existingUnits.map((unit) => ({ label: unit, value: unit }))}
          />
        </Form.Item>

        <Form.Item
          name="total_value"
          label="Total Price"
          rules={[{ required: true, message: 'Please enter total price' }]}
        >
          <Input placeholder="e.g. 120000" />
        </Form.Item>

        <Form.Item
          name="supplier"
          label="Supplier"
          rules={[{ required: true, message: 'Please enter supplier' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddInventoryBatchModal;
