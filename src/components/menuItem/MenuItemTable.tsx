import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useTheme,
  TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { deleteMenuItem } from '../../redux/slices/menuItem.slice';
import { setMessage } from '../../redux/slices/message.slice';
import { MenuItem } from '../../types/menuItem';
import { Category } from '../../types/category';

interface MenuItemTableProps {
  menuItems: MenuItem[];
  onDetail: (menuItem: MenuItem) => void;
  categories: Category[];
}

const MenuItemTable: React.FC<MenuItemTableProps> = ({ menuItems, onDetail, categories }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatPriceVND = (price: number) => {
    return (
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      })
        .format(price)
        .replace('₫', '') + '₫'
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteMenuItem(id)).unwrap();
      dispatch(setMessage({ message: 'Xóa món ăn thành công', type: 'success' }));
    } catch (err) {
      dispatch(setMessage({ message: (err as string) || 'Xóa thất bại', type: 'error' }));
    }
  };

  const handleDetail = (menuItem: MenuItem) => {
    onDetail(menuItem);
  };

  const paginatedItems = menuItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (!menuItems || menuItems.length === 0) {
    return (
      <Typography align="center" mt={4}>
        Không có món nào trong thực đơn.
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.palette.text.primary }}>STT</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Tên món</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Ảnh</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Danh mục</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Giá</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Khuyến mãi</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Tình trạng</TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.primary }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item, index) => {
              const category = categories.find((cat) => cat.id === item.category_id);
              return (
                <TableRow key={item.item_id}>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{item.name}</TableCell>
                  <TableCell>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Không có ảnh
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    {category?.name || 'Không rõ'}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    {formatPriceVND(item.price)}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    {item.discount_percent}%
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    {item.is_available ? 'Còn bán' : 'Hết hàng'}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleDetail(item)}>
                      <InfoIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.item_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={menuItems.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} trong ${count}`}
      />
    </>
  );
};

export default MenuItemTable;
