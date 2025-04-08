
////////
import { Table, Badge, Card, Avatar } from "antd";
import { ProductRevenueData,ColumnRenderRecord } from "src/types/Dashboard";
import product1 from "../../assets/images/products/minecraft.png";
import product2 from "../../assets/images/logos/logo.png";
import product3 from "/src/assets/images/products/dash-prd-3.jpg";
import product4 from "/src/assets/images/products/dash-prd-4.jpg";

const ProductRevenue = () => {
  const ProductTableData: ProductRevenueData[] = [
    {
      img: product1,
      name: "Minecraft App",
      seller: "Cường Nguyễn",
      process: "73.2%",
      statuscolor: "text-success",
      statusbg: "bg-lightsuccess",
      statustext: "Low",
    },
    {
      img: product2,
      name: "Ninja-English",
      seller: "nguyễn Đức Hoàng",
      process: "73.2%",
      statuscolor: "text-warning",
      statusbg: "bg-lightwarning",
      statustext: "Medium",
    },
    {
      img: product3,
      name: "Modernize Dashboard",
      seller: "Anil Kumar",
      process: "73.2%",
      statuscolor: "text-secondary",
      statusbg: "bg-lightsecondary",
      statustext: "Very High",
    },
    {
      img: product4,
      name: "Dashboard Co",
      seller: "George Cruize",
      process: "73.2%",
      statuscolor: "text-error",
      statusbg: "bg-lighterror",
      statustext: "High",
    },
  ];



  const columns: Array<{
    title: string;
    dataIndex: string;
    key: string;
    render?: (value: any, record: ColumnRenderRecord) => JSX.Element;
  }> = [
    {
      title: "Assigned",
      dataIndex: "assigned",
      key: "assigned",
      render: (_, record: ColumnRenderRecord) => (
        <div className="flex items-center gap-3">
          <Avatar shape="square" size={60} src={record.img} />
          <div>
            <h6 className="text-sm font-medium">{record.name}</h6>
            <p className="text-xs text-gray-500">{record.seller}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Progress",
      dataIndex: "process",
      key: "process",
      render: (process: string) => <span className="text-base">{process}</span>,
    },
    {
      title: "Priority",
      dataIndex: "statustext",
      key: "statustext",
      render: (text: string, record: ColumnRenderRecord) => (
        <Badge color={record.statuscolor} text={text} />
      ),
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: () => <h4>$3.5k</h4>,
    },
  ];

  return (
    <Card title="Revenue by Product" className="rounded-xl shadow-md">
      <Table
        columns={columns}
        dataSource={ProductTableData}
        pagination={false}
        rowKey={(record) => record.name}
      />
    </Card>
  );
};

export default ProductRevenue;
