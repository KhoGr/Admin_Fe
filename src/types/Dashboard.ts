export interface BlogCardProps {
  title: string;
  description: string;
  link: string;
}

//Daily activity
export interface Activity {
  time: string;
  action: string;
  id?: string;
  color: "blue" | "red" | "green" | "orange" | "gray";
}

//Blog Card
export interface BlogCardProps{
  avatar: string,
  coveravatar: string,
  read: string,
  title: string,
  category: "Social" | "Gadget" | "Country",
  name: string,
  view: string,
  comments: string,
  time: string,
  url: string,
}
//Product Reneuve
export interface ProductRevenueData{
  img: string,
  name: string,
  seller: string,
  process: string,
  statuscolor: string,
  statusbg: string,
  statustext: "Low"|"Medium"| "High"|"Very High",
}
export interface ColumnRenderRecord {
  img: string;
  name: string;
  seller: string;
  process: string;
  statuscolor: string;
  statusbg: string;
  statustext: string;
  budget?: string;
}