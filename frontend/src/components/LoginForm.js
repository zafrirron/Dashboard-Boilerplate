import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { TextField, Button, Box, Typography, Container, CssBaseline, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginPage = () => {
  const navigate = useNavigate();

  // Handle form submission for email/password login
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
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);  // Store JWT token
          navigate('/');  // Redirect to home after login
        } else {
          formik.setErrors({ serverError: 'Invalid credentials. Please try again.' });
        }
      } catch (err) {
        formik.setErrors({ serverError: 'An error occurred. Please try again later.' });
      }
    },
  });

  // Handle Google login
  const handleGoogleLoginSuccess = async (response) => {
    try {
      const googleToken = response.credential;
      const res = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);  // Store JWT token
        navigate('/');  // Redirect to home after login
      } else {
        formik.setErrors({ serverError: 'Google login failed. Please try again.' });
      }
    } catch (err) {
      formik.setErrors({ serverError: 'Google authentication error. Please try again.' });
    }
  };

  const handleGoogleLoginFailure = (error) => {
    formik.setErrors({ serverError: 'Google login failed. Please try again.' });
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

        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
        />
      </Box>
    </Container>
  );
};

export default LoginPage;
