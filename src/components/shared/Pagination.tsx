import { Pagination as AntdPagination } from "antd";
import { useLocation, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

type PaginationProps = {
  pages: {
    limit: number;
    total: number;
    currentPage: number;
    next: number;
    prev: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export const Pagination: React.FC<PaginationProps> = ({ pages }) => {
  const { limit, total, currentPage, next, prev, hasNext, hasPrev } = pages;
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  // lấy đường dẫn hiện tại
  const totalPages = Math.ceil(total / limit);

  const formatUrl = (page: number) => {
    if (searchParams.get("keyword")) {
      return `${pathname}?keyword=${searchParams.get("keyword")}&page=${page}`;
    }
    return `${pathname}?page=${page}`;
  };

  return (
    <AntdPagination
      current={currentPage}
      total={total}
      pageSize={limit}
      onChange={(page) => (window.location.href = formatUrl(page))}
      showSizeChanger={false}
      showQuickJumper
    />
  );
};

