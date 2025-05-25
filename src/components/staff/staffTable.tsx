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
  Box,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import { StaffModel } from '../../types/staff';
import staffApi from '../../api/staffApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface StaffTableProps {
  staffList: StaffModel[];
  onDetail: (staff: StaffModel) => void;
  onReload?: () => void;
}

const StaffTable: React.FC<StaffTableProps> = ({ staffList = [], onDetail, onReload }) => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const maxPage = Math.ceil(staffList.length / rowsPerPage);

  const handleDelete = async (userId: number) => {
    try {
      await staffApi.delete(userId);
      alert('Xóa nhân viên thành công');
      onReload?.();
    } catch (error) {
      alert('Xóa nhân viên thất bại');
    }
  };

  const handleDetail = (staff: StaffModel) => {
    onDetail(staff);
  };

  const paginatedItems = staffList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  console.log('staffList:', staffList);

  if (!Array.isArray(staffList) || staffList.length === 0) {
    return (
      <Typography align="center" mt={4}>
        Không có nhân viên nào.
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
              <TableCell>Chức vụ</TableCell>
              <TableCell>Lương</TableCell>
              <TableCell>Loại làm việc</TableCell>
              <TableCell>Ngày vào làm</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((staff, index) => (
              <TableRow key={staff.staff_id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{staff.user?.name || '—'}</TableCell>
                <TableCell>{staff.user?.account?.email || '—'}</TableCell>
                <TableCell>{staff.position || '—'}</TableCell>
                <TableCell>
                  {staff.salary
                    ? Number(staff.salary).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })
                    : '—'}
                </TableCell>
                <TableCell>{staff.working_type || '—'}</TableCell>
                <TableCell>
                  {staff.joined_date
                    ? new Date(staff.joined_date).toLocaleDateString('vi-VN')
                    : '—'}
                </TableCell>
                <TableCell>{staff.note || '—'}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleDetail(staff)}>
                    <InfoIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(staff.user_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Custom Pagination */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          variant="contained"
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          Trang trước
        </Button>
        <Typography>
          Trang {page + 1} / {maxPage}
        </Typography>
        <Button
          variant="contained"
          disabled={page >= maxPage - 1}
          onClick={() => setPage((prev) => Math.min(prev + 1, maxPage - 1))}
        >
          Trang sau
        </Button>
      </Box>
    </>
  );
};

export default StaffTable;
