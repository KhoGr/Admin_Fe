import type { CascaderProps } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import React, { Children, useState } from 'react';


const { Option } = Select;
interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}
// tìm cách sửa bằng cách dùng map
const residences: CascaderProps<DataNodeType>['options'] = [
  {
    value: 'Việt Nam',
    label: 'Việt Nam',
    children: [
      {
        value: 'Hà Nội',
        label: 'Hà Nội',
        children: [
          {
            value: 'Thanh xuân',
            label: 'Hai Bà Trưng',
          },
        ],
      },
    ],
  },
  {
    value: 'Hải Phòng',
    label: 'Hải Phòng',
    children: [
      {
        value: 'Kiến An',
        label: 'Kiến An',
        children: [
          {
            value: 'Đồng Hoà',
            label: 'Đồng Hoà',
          },
        ],
      },
    ],
  },
];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const FormPage: React.FC = () => {
  // làm rõ về cái này

  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('received values of form: ', values);
  };
  const phoneNumber = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="84">+84</Option>
        <Option value="85">+85</Option>
        {/* nghiên cứu logic sdt ở đoạn này */}
      </Select>
    </Form.Item>
  );
  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

  const onWebsiteChange = (value: string) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(['.com', '.org', '.net'].map((domain) => `${value}${domain}`));
    }
  };
  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  return (
    <ProCard layout="center">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ['zhejiang', 'hangzhou', 'xihu'],
          prefix: '86',
        }}
        style={{ maxWidth: 600, margin: 'auto', color: 'white' }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'the input is not valid E-mail',
            },
            {
              required: true,
              message: 'Input your email',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your passowrd',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Comfirm PassWord"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'please comfirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!'),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="residence"
          label="Habitual Residence"
          rules={[
            {
              type: 'array',
              required: true,
              message: 'Please select your habitual residence!',
            },
          ]}
        >
          <Cascader options={residences} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Input your phone number here' }]}
        >
          <Input addonBefore={phoneNumber} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="website"
          label="Website"
          rules={[{ required: true, message: 'Please input website!' }]}
        >
          <AutoComplete options={websiteOptions} placeholder="website">
            <Input />
          </AutoComplete>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select gender' }]}
        >
          <Select placeholder="select your gender">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Captcha" extra="Are you human?">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true,
                    message: 'Please input the captcha you got!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button>Get captcha</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </ProCard>
  );
};
