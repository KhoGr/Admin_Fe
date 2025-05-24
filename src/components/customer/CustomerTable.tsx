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

import { CustomerModel } from '../../types/Customer';
import customerApi from '../../api/customerApi';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../redux/slices/message.slice';
import { RootState } from '../../redux/store';

interface CustomerTableProps {
  customers: CustomerModel[];
  onDetail: (customer: CustomerModel) => void;
  onReload?: () => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onDetail, onReload }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (userId: number) => {
    try {
      await customerApi.delete(userId);
      dispatch(setMessage({ message: 'Xóa khách hàng thành công', type: 'success' }));
      onReload?.();
    } catch (error) {
      dispatch(setMessage({ message: 'Xóa khách hàng thất bại', type: 'error' }));
    }
  };

  const handleDetail = (customer: CustomerModel) => {
    onDetail(customer);
  };

  const paginatedItems = customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (!customers || customers.length === 0) {
    return (
      <Typography align="center" mt={4}>
        Không có khách hàng nào.
      </Typography>
    );
  }

  return (
    <>
      {user && (
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Xin chào, {user.name} ({user.email})
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Điểm tích lũy</TableCell>
              <TableCell>Tổng chi tiêu</TableCell>
              <TableCell>Hạng</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item, index) => (
              <TableRow key={item.customer_id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{item.user?.name || '—'}</TableCell>
                <TableCell>{item.user?.account?.email || '—'}</TableCell>
                <TableCell>{item.loyalty_point}</TableCell>
                <TableCell>
                  {Math.min(Number(item.total_spent), 9999999999).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </TableCell>
                <TableCell>{item.membership_level}</TableCell>
                <TableCell>{item.note || '—'}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleDetail(item)}>
                    <InfoIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item.user_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={customers.length}
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

export default CustomerTable;
