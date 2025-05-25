import { useState } from "react";
import { Form, Input, Button, Tabs, Card, TimePicker } from "antd";
import { ClockCircleOutlined, EnvironmentOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import RestaurantMap from "../../components/map/RestaurantMap";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

const { TabPane } = Tabs;
const { TextArea } = Input;

const schema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  description: z.string().optional(),
  phone: z.string().min(5, "Phone number is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address is required"),
  openingTime: z.string(),
  closingTime: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  name: "Restaurant Name",
  description: "A nice restaurant...",
  phone: "+1234567890",
  email: "contact@restaurant.com",
  address: "123 Main St",
  openingTime: "09:00",
  closingTime: "22:00",
  latitude: 40.712776,
  longitude: -74.005974,
  websiteUrl: "https://restaurant.com",
  logoUrl: "",
};

export default function Settings() {
  const [location, setLocation] = useState({
    lat: defaultValues.latitude!,
    lng: defaultValues.longitude!,
  });

  const { control, handleSubmit, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    toast.success("Settings saved!");
  };

  const onMapChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Restaurant Settings</h1>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Tabs defaultActiveKey="general" style={{ marginTop: 24 }}>
          <TabPane
            key="general"
            tab={
              <span>
                <SettingOutlined /> General
              </span>
            }
          >
            <Card>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Form.Item label="Restaurant Name" validateStatus={fieldState.error ? "error" : ""} help={fieldState.error?.message}>
                    <Input {...field} />
                  </Form.Item>
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Form.Item label="Description">
                    <TextArea rows={4} {...field} />
                  </Form.Item>
                )}
              />
              <Controller
                control={control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Form.Item label="Phone" validateStatus={fieldState.error ? "error" : ""} help={fieldState.error?.message}>
                    <Input {...field} />
                  </Form.Item>
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Form.Item label="Email" validateStatus={fieldState.error ? "error" : ""} help={fieldState.error?.message}>
                    <Input type="email" {...field} />
                  </Form.Item>
                )}
              />
              <Controller
                control={control}
                name="websiteUrl"
                render={({ field, fieldState }) => (
                  <Form.Item label="Website" validateStatus={fieldState.error ? "error" : ""} help={fieldState.error?.message}>
                    <Input {...field} />
                  </Form.Item>
                )}
              />
            </Card>
          </TabPane>

          <TabPane
            key="hours"
            tab={
              <span>
                <ClockCircleOutlined /> Hours
              </span>
            }
          >
            <Card>
              <Controller
                control={control}
                name="openingTime"
                render={({ field }) => (
                  <Form.Item label="Opening Time">
                    <Input type="time" {...field} />
                  </Form.Item>
                )}
              />
              <Controller
                control={control}
                name="closingTime"
                render={({ field }) => (
                  <Form.Item label="Closing Time">
                    <Input type="time" {...field} />
                  </Form.Item>
                )}
              />
            </Card>
          </TabPane>

          <TabPane
            key="location"
            tab={
              <span>
                <EnvironmentOutlined /> Location
              </span>
            }
          >
            <Card>
              <Controller
                control={control}
                name="address"
                render={({ field, fieldState }) => (
                  <Form.Item label="Address" validateStatus={fieldState.error ? "error" : ""} help={fieldState.error?.message}>
                    <Input {...field} />
                  </Form.Item>
                )}
              />
              <div style={{ height: 400, borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
                <RestaurantMap location={location} onLocationChange={onMapChange} />
              </div>
              <Controller
                control={control}
                name="latitude"
                render={({ field }) => (
                  <Form.Item label="Latitude">
                    <Input
                      type="number"
                      step="0.000001"
                      {...field}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        field.onChange(val);
                        setLocation((prev) => ({ ...prev, lat: val }));
                      }}
                    />
                  </Form.Item>
                )}
              />
              <Controller
                control={control}
                name="longitude"
                render={({ field }) => (
                  <Form.Item label="Longitude">
                    <Input
                      type="number"
                      step="0.000001"
                      {...field}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        field.onChange(val);
                        setLocation((prev) => ({ ...prev, lng: val }));
                      }}
                    />
                  </Form.Item>
                )}
              />
            </Card>
          </TabPane>
        </Tabs>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
