import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('unlogged');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setRole('unlogged');
    setUserInfo({ name: '', email: '' });
  }, []);

  const handleLogin = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        // Check if the token is expired
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          handleLogout();  // Token expired, log the user out
        } else {
          setRole(decodedToken.role || 'unlogged');
          setUserInfo({
            name: decodedToken.name || 'User',
            email: decodedToken.email || 'user@example.com',
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        handleLogout(); // Invalid token, log out the user
      }
    }
  }, [handleLogout]);  // Include handleLogout in the dependency array

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
        localStorage.setItem('token', data.token);
        handleLogin();
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
  }, [handleLogin]);  // Include handleLogin in the dependency array

  return (
    <AuthContext.Provider value={{ role, setRole, userInfo, handleLogin, handleLogout, handleGoogleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
