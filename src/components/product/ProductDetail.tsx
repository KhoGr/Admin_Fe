// bug lòi sửa lại
import React, { useState } from "react";
import { Card, Button, Typography, Row, Col, Form, Input, message, Avatar, List } from "antd";
import { ShoppingCartOutlined, DollarOutlined } from "@ant-design/icons";
import moment from "moment";
import { getImageProduct, currencyFormat } from "../../utils/theme/helper";
import { Pagination } from "../../components/shared/Pagination";

const { Title, Text } = Typography;

interface ProductDetailProps {
  product: any;
  addToCart: (type?: string) => void;
  comments: any[];
  inputComment: any;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  pages: number;
}
// const ProductDetailData: ProductDetailProps[]=[
//     {
//         product:
//     }
// ]
const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  addToCart,
  comments,
  inputComment,
  onChangeInput,
  onSubmitComment,
  pages,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {/* Product Image & Details */}
      <Col xs={24} md={12}>
        <Card cover={<img alt={product.name} src={getImageProduct(product.image)} />} />
      </Col>
      <Col xs={24} md={12}>
        <Card>
          <Title level={2}>{product.name}</Title>
          <ul>
            <li><Text strong>Bảo hành:</Text> 12 Tháng</li>
            <li><Text strong>Đi kèm:</Text> {product.accessories}</li>
            <li><Text strong>Tình trạng:</Text> {product.status}</li>
            <li><Text strong>Khuyến Mại:</Text> {product.promotion}</li>
            <li id="price"><Text strong>Giá Bán (chưa VAT):</Text></li>
            <li id="price-number"><Title level={3}>{currencyFormat(product.price)}</Title></li>
            <li id="status">
              <Text type={product.is_stock ? "success" : "danger"}>{product.is_stock ? "Còn hàng" : "Hết hàng"}</Text>
            </li>
          </ul>
          <Button type="primary" icon={<DollarOutlined />} onClick={() => addToCart("buy-now")}>
            Mua ngay
          </Button>
          <Button type="default" icon={<ShoppingCartOutlined />} onClick={() => addToCart()} style={{ marginLeft: 10 }}>
            Thêm vào giỏ hàng
          </Button>
        </Card>
      </Col>

      {/* Product Description */}
      <Col span={24}>
        <Card title={`Đánh giá về ${product.name}`}>
          <Text>{product.details}</Text>
        </Card>
      </Col>

      {/* Comment Form */}
      <Col span={24}>
        <Card title="Bình luận sản phẩm">
          <Form layout="vertical" onFinish={onSubmitComment}>
            <Form.Item label="Tên" required>
              <Input name="name" value={inputComment.name || ""} onChange={onChangeInput} required />
            </Form.Item>
            <Form.Item label="Email" required>
              <Input name="email" value={inputComment.email || ""} onChange={onChangeInput} required type="email" />
            </Form.Item>
            <Form.Item label="Nội dung" required>
              <Input.TextArea name="content" value={inputComment.content || ""} onChange={onChangeInput} required rows={4} />
            </Form.Item>
            <Button type="primary" htmlType="submit">Gửi</Button>
          </Form>
        </Card>
      </Col>

      {/* Comments List */}
      <Col span={24}>
        <Card title="Danh sách bình luận">
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{item.name[0]}</Avatar>}
                  title={<Text strong>{item.name}</Text>}
                  description={<Text type="secondary">{moment(item.updatedAt).fromNow()}</Text>}
                />
                <p>{item.content}</p>
              </List.Item>
            )}
          />
        </Card>
      </Col>

      {/* Pagination */}
      <Col span={24}>
        <Pagination pages={{
          limit: 10, 
          total: pages, 
          currentPage: 1, 
          next: 2, 
          prev: 0, 
          hasNext: pages > 1, 
          hasPrev: false 
        }} />
      </Col>
    </Row>
  );
};

export default ProductDetail;