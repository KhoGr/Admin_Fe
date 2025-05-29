import React, { useEffect } from "react";
import { Form, Input, Select, Button, InputNumber } from "antd";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableStatus, Table } from "../../types/table";

const { Option } = Select;

type Props = {
  initialValues?: Table;
  onSubmit: (data: TableFormData) => void;
  loading?: boolean;
};

const statusEnum = z.enum(["available", "occupied", "reserved", "unavailable"]);

const schema = z.object({
  table_number: z.string().nonempty("Vui lòng nhập số bàn"),
  status: statusEnum,
  seat_count: z.number({ invalid_type_error: "Vui lòng nhập số chỗ" }).min(1, "Số chỗ phải lớn hơn 0"),
  floor: z.number({ invalid_type_error: "Vui lòng nhập tầng" }).min(0, "Tầng phải từ 0 trở lên").optional(),
  note: z.string().optional(),
});

export type TableFormData = z.infer<typeof schema>;

const TableForm: React.FC<Props> = ({ initialValues, onSubmit, loading }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TableFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      table_number: "",
      status: "available",
      seat_count: 1,
      floor: undefined,
      note: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        table_number: initialValues.table_number,
        status: initialValues.status,
        seat_count: initialValues.seat_count,
        floor: initialValues.floor,
        note: initialValues.note || "",
      });
    }
  }, [initialValues, reset]);

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Số bàn"
        validateStatus={errors.table_number ? "error" : ""}
        help={errors.table_number?.message}
      >
        <Controller
          name="table_number"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Nhập số bàn" />}
        />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        validateStatus={errors.status ? "error" : ""}
        help={errors.status?.message}
      >
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Chọn trạng thái">
              <Option value="available">Còn trống</Option>
              <Option value="occupied">Đang sử dụng</Option>
              <Option value="reserved">Đã đặt</Option>
              <Option value="unavailable">Không sử dụng</Option>
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Số chỗ ngồi"
        validateStatus={errors.seat_count ? "error" : ""}
        help={errors.seat_count?.message}
      >
        <Controller
          name="seat_count"
          control={control}
          render={({ field }) => (
            <InputNumber {...field} min={1} style={{ width: "100%" }} />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Tầng"
        validateStatus={errors.floor ? "error" : ""}
        help={errors.floor?.message}
      >
        <Controller
          name="floor"
          control={control}
          render={({ field }) => (
            <InputNumber {...field} min={0} placeholder="Nhập tầng (0 nếu tầng trệt)" style={{ width: "100%" }} />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Ghi chú"
        validateStatus={errors.note ? "error" : ""}
        help={errors.note?.message}
      >
        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <Input.TextArea {...field} placeholder="Nhập ghi chú nếu có" rows={3} />
          )}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Cập nhật" : "Tạo mới"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TableForm;
