import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('unlogged');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  // Get token expiry time from .env (in seconds)
  const tokenExpiryTime = process.env.TOKEN_EXPIRY_TIME ? parseInt(process.env.REACT_APP_TOKEN_EXPIRY_TIME) : 3600;

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setRole('unlogged');
    setUserInfo({ name: '', email: '' });
    console.log('User logged out due to token expiration or manual logout');
  }, []);

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.log('Token expired, logging out...');
          handleLogout();  // Log out if the token has expired
        }
      } catch (error) {
        console.error('Error decoding token during expiration check:', error);
        handleLogout(); // Invalid token, log out the user
      }
    }
  }, [handleLogout]);

  const handleLogin = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        // Check if the token is expired based on the expiry time from .env
        if (decodedToken.exp && (decodedToken.exp < currentTime || (decodedToken.iat + tokenExpiryTime) < currentTime)) {
          console.log('Token expired, logging out...');
          handleLogout();  // Token expired, log the user out
        } else {
          setRole(decodedToken.role || 'unlogged');
          setUserInfo({
            name: decodedToken.name || 'User',
            email: decodedToken.email || 'user@example.com',
          });
          console.log('User logged in successfully');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        handleLogout(); // Invalid token, log out the user
      }
    }
  }, [handleLogout, tokenExpiryTime]);

  const handleGoogleLogin = async (googleResponse) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleResponse.credential }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store token and then update role
        handleLogin();  // Use handleLogin after Google login to update role and user info
      } else {
        console.log('Failed to login with Google.');
      }
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  // Automatically check for the token on initial app load
  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  // Set an interval to check token expiration every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Checking token expiration...');
      checkTokenExpiration();
    }, 60 * 1000); // Check every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [checkTokenExpiration]);

  return (
    <AuthContext.Provider value={{ role, setRole, userInfo, handleLogin, handleLogout, handleGoogleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
