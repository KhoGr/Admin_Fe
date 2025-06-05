// src/components/CustomerSelect.tsx
import { Select, message } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import customerApi from '../../../api/customerApi';
import { CustomerModel } from '../../../types/Customer';

const { Option } = Select;

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

const CustomerSelect = ({ value, onChange }: Props) => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchCustomers = async () => {
    setFetching(true);
    try {
      const res = await customerApi.getAll();
      setCustomers(res.data || []);
    } catch {
      message.error('Không thể tải danh sách khách hàng');
    } finally {
      setFetching(false);
    }
  };

  const debouncedFetchCustomers = useCallback(debounce(fetchCustomers, 500), []);

  useEffect(() => {
    if (value) fetchCustomers(); // fetch khi có sẵn customer_id (sửa đơn hàng)
  }, [value]);

  return (
    <Select
      showSearch
      placeholder="Tìm khách hàng"
      value={value}
      filterOption={false}
      onSearch={debouncedFetchCustomers}
      onFocus={fetchCustomers}
      loading={fetching}
      onChange={onChange}
      allowClear
    >
      {customers.map((c) => (
        <Option key={c.customer_id} value={String(c.customer_id)}>
          {c.user_info?.name} ({c.user_info?.account?.email})
        </Option>
      ))}
    </Select>
  );
};

export default CustomerSelect;
