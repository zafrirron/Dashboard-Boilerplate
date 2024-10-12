import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchUsers, addUser, deleteUser, toggleUserActive } from '../api/userApi';  
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsersFromApi = async () => {
    try {
      const response = await fetchUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsersFromApi();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);  
      fetchUsersFromApi(); 
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      role: Yup.string().required('Role is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingUserId) {
          await toggleUserActive(editingUserId, values);  
          setEditingUserId(null);
        } else {
          await addUser(values);  
        }
        fetchUsersFromApi(); 
        resetForm();
        setIsAdding(false);  
      } catch (error) {
        console.error('Error adding or updating user:', error);
      }
    },
  });

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    formik.setValues({
      name: user.name,
      email: user.email,
      password: '****', 
      role: user.role,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    formik.resetForm();
  };

  return (
    <div>
      <h2>User Management</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Password</TableCell> 
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <Select
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        error={formik.touched.role && Boolean(formik.errors.role)}
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="logged">User</MenuItem>
                      </Select>
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                      />
                    ) : (
                      '****' 
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <>
                        <IconButton onClick={formik.handleSubmit}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleCancelEdit}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEdit(user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteUser(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
            {isAdding && (
              <TableRow>
                <TableCell>
                  <TextField
                    id="name"
                    name="name"
                    label="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    id="role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="logged">User</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{/* Created At is set by the backend */}</TableCell>
                <TableCell>
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={formik.handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!isAdding && (
        <Button variant="contained" color="primary" onClick={() => setIsAdding(true)} sx={{ mt: 2 }}>
          Add New User
        </Button>
      )}
    </div>
  );
};

export default UserManagementPage;
