import React from 'react';
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
  Box,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { deleteCategory } from '../../redux/slices/categories.slice';
import { setMessage } from '../../redux/slices/message.slice';
import { Category } from '../../types/category';

interface CategoryTableProps {
  categories: Category[];
  onDetail: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories,onDetail }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      dispatch(setMessage({ message: 'Xóa danh mục thành công', type: 'success' }));
    } catch (err) {
      dispatch(setMessage({ message: (err as string) || 'Xóa thất bại', type: 'error' }));
    }
  };

  const handleDetail = (category: Category) => {
    onDetail(category);
  };

  if (!categories || categories.length === 0) {
    return (
      <Typography align="center" mt={4}>
        Không có danh mục nào.
      </Typography>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: theme.palette.text.primary }}>STT</TableCell>
            <TableCell sx={{ color: theme.palette.text.primary }}>Tên danh mục</TableCell>
            <TableCell sx={{ color: theme.palette.text.primary }}>Mô tả</TableCell>
            <TableCell align="center" sx={{ color: theme.palette.text.primary }}>
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((cat, index) => (
            <TableRow key={cat.id}>
              <TableCell sx={{ color: theme.palette.text.primary }}>{index + 1}</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>{cat.name}</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>{cat.description}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => handleDetail(cat)}>
                  <InfoIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(cat.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;
