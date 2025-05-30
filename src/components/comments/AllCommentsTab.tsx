import {
  Button,
  Card,
  Table,
  Tooltip,
  Popconfirm,
  Space,
  Input,
  Select,
  Row,
  Col,
} from 'antd';
import { StarFilled } from '@ant-design/icons';
import { Comment } from '../../types/comment';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import customerApi from '../../api/customerApi';

// Simple implementation of useMemo for this context
function useMemo<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<{ deps: any[]; value: T }>();
  if (!ref.current || deps.some((dep, i) => dep !== ref.current!.deps[i])) {
    ref.current = { deps, value: factory() };
  }
  return ref.current.value;
}

type Props = {
  comments: Comment[];
  onEdit: (comment: Comment) => void;
  setIsOpen: (open: boolean) => void;
  onDelete: (commentId: string) => void;
  onSearch: (filters: { itemName?: string; customerId?: number; rating?: number }) => void;
};

const AllCommentsTab = ({
  comments,
  onEdit,
  setIsOpen,
  onDelete,
  onSearch,
}: Props) => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<{
    itemName: string;
    customerId?: number;
    rating?: number;
  }>({
    itemName: '',
    customerId: undefined,
    rating: undefined,
  });

  const [customerOptions, setCustomerOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const debouncedSearch = useMemo(() => {
    return debounce(async (value: string) => {
      if (!value.trim()) return;
      try {
        const results = await customerApi.searchByName(value);
        const options = results.map((customer) => ({
          label: customer.user_info?.name || 'Unknown',
          value: customer.customer_id,
        }));
        setCustomerOptions(options);
      } catch (error) {
        console.error('Search customer failed:', error);
      }
    }, 300);
  }, []);

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

const handleFilterChange = (
  field: string,
  value: string | number | undefined
) => {
  setFilters((prev) => {
    if (field === 'customerId') {
      return {
        ...prev,
        [field]: value === undefined ? undefined : Number(value),
      };
    }
    return { ...prev, [field]: value };
  });
};


  const handleSearch = () => {
      console.log('🧪 Filters before search:', filters); // 👈 LOG NÀY

    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      itemName: '',
      customerId: undefined,
      rating: undefined,
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const columns = [
    {
      title: 'Menu Item',
      render: (_: any, record: Comment) => (
        <Button
          type="link"
          onClick={() => navigate(`/menu-items?highlight=${record.item_id}`)}
        >
          {record.menu_item_name || 'Unnamed Item'}
        </Button>
      ),
    },
    {
      title: 'User',
      dataIndex: 'user_name',
    },
    {
      title: 'Rating',
      render: (_: any, record: Comment) => (
        <div>
          {[...Array(5)].map((_, i) => (
            <StarFilled
              key={i}
              style={{
                color: i < record.rating ? '#fadb14' : '#d9d9d9',
                fontSize: 14,
                marginRight: 2,
              }}
            />
          ))}
          <span style={{ marginLeft: 8 }}>{record.rating}/5</span>
        </div>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      render: (text: string) => (
        <Tooltip title={text}>
          <div
            style={{
              maxWidth: 300,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      render: (_: any, record: Comment) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              onEdit(record);
              setIsOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this comment?"
            onConfirm={() => onDelete(String(record.comment_id))}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder="Search by menu item"
            value={filters.itemName}
            onChange={(e) => handleFilterChange('itemName', e.target.value)}
            allowClear
          />
        </Col>
        <Col span={6}>
          <Select
            showSearch
            placeholder="Search customer by name"
            filterOption={false}
            onSearch={debouncedSearch}
            onChange={(value) => handleFilterChange('customerId', value)}
            value={filters.customerId}
            allowClear
            style={{ width: '100%' }}
            options={customerOptions}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Filter by rating"
            value={filters.rating}
            onChange={(value) => handleFilterChange('rating', value)}
            allowClear
            style={{ width: '100%' }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Select.Option key={star} value={star}>
                {star} star{star > 1 ? 's' : ''}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={3}>
          <Button type="primary" onClick={handleSearch} style={{ width: '100%' }}>
            Search
          </Button>
        </Col>
        <Col span={3}>
          <Button onClick={handleReset} style={{ width: '100%' }}>
            Reset
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={comments}
        rowKey="comment_id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default AllCommentsTab;
