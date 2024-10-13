import React, { useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container, CssBaseline, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const LoginPage = () => {
  const { handleLogin, handleGoogleLogin, role } = useContext(AuthContext); // Use the context functions
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'unlogged') {
      navigate('/'); // Redirect to home if user is logged in
    }
  }, [role, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);  // Store JWT token
          handleLogin();  // Use context function to update the role
        } else {
          formik.setErrors({ serverError: 'Invalid credentials. Please try again.' });
        }
      } catch (err) {
        formik.setErrors({ serverError: 'An error occurred. Please try again later.' });
      }
    },
  });

  const handleGoogleLoginSuccess = async (response) => {
    await handleGoogleLogin(response);  // Call Google login handler to set role
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>

        {formik.errors.serverError && (
          <Typography color="error" variant="body2">
            {formik.errors.serverError}
          </Typography>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>

        <Typography component="h2" variant="h6" sx={{ mt: 2 }}>
          Or sign in with Google
        </Typography>

        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}  // Handle Google login and set role
          onError={() => console.log('Google Login Failed')}
        />
      </Box>
    </Container>
  );
};

export default LoginPage;
