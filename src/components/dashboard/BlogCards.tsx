import { Card, Avatar, Tag, Row, Col } from "antd";
import { EyeOutlined, CommentOutlined } from "@ant-design/icons";
import { TbPoint } from "react-icons/tb";
import { Link } from "react-router-dom";
import {BlogCardProps} from "../../types/Dashboard"

import user2 from "/src/assets/images/profile/user-2.jpg";
import user3 from "/src/assets/images/profile/user-3.jpg";
import img1 from "../../assets/images/blog/download.jpg";
import img2 from "../../assets/images/blog/tauchohang.jpg";
import img3 from "../../assets/images/blog/hoangsatruongsa.jpg";


const { Meta } = Card;
const BlogCardsData:BlogCardProps[]=[
  {
    avatar: user2,
    coveravatar: img1,
    read: "2 min Read",
    title: "Chào Buổi Sáng",
    category: "Social",
    name: "Nguyễn Đức Hoàng",
    view: "9,125",
    comments: "3",
    time: "Mon, Dec 20",
    url: "",
    description: "A morning greeting blog post.",
    link: "/blog/chao-buoi-sang",
  },
  {
    avatar: user2,
    coveravatar: img2,
    read: "2 min Read",
    title: "Một Tàu Chở hàng bị đắm",
    category: "Gadget",
    name: "Namizu",
    view: "4,150",
    comments: "38",
    time: "Sun, Dec 18",
    url: "",
    description: "A blog post about a sunken cargo ship.",
    link: "/blog/tau-cho-hang",
  },
  {
    avatar: user3,
    coveravatar: img3,
    read: "2 min Read",
    title: "Hoàng Sa Trường Sa là của Việt Nam",
    category: "Country",
    name: "Anonymous",
    view: "9,480",
    comments: "12",
    time: "Sat, Dec 17",
    url: "",
    description: "A patriotic blog post about Vietnam's islands.",
    link: "/blog/hoang-sa-truong-sa",
  },
]


const BlogCards = () => {
  return (
    <Row gutter={[24, 24]}>
      {/* tạo khoảng cách giữa các cột */}
      {BlogCardsData.map((item, i) => (
        <Col key={i} xs={24} sm={12} lg={8}> 
        {/* tuỳ theo loại màn hình */}
          <Link to={item.url}>
            <Card
              hoverable
              cover={ //khung
                <div
                  style={{
                    width: "100%",
                    height: "200px", // Đặt chiều cao cố định
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.coveravatar}
                    alt="blog-cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Cắt ảnh cho vừa khung
                    }}
                  />
                </div>
              }
              actions={[
                <div key="views">
                  <EyeOutlined /> {item.view}
                </div>,
                <div key="comments">
                  <CommentOutlined /> {item.comments}
                </div>,
                <div key="time">
                  <TbPoint size={15} /> {item.time}
                </div>,
              ]}
            >
              <Meta
                avatar={<Avatar src={item.avatar} />}
                title={<h5>{item.title}</h5>}
                description={
                  <>
                    <Tag color="blue">{item.category}</Tag>
                    <p style={{ marginTop: 8 }}>{item.name}</p>
                  </>
                }
              />
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default BlogCards;
//xong