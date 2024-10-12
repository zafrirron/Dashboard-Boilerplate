import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';  
import { GoogleOAuthProvider } from '@react-oauth/google';  // Import GoogleOAuthProvider
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import LoginPage from './pages/LoginPage';
import UserManagementPage from './pages/UserManagementPage';
import Layout from './components/Layout';  // Import the Layout component
import routesConfig from './common/routesConfig';

function App() {
  const [role, setRole] = useState('unlogged');

  // Function to get the user role from JWT stored in localStorage
  const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return 'unlogged';
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.role || 'unlogged';
    } catch (error) {
      console.error('Error decoding token:', error);
      return 'unlogged';
    }
  };

  // Update role whenever the app loads or localStorage token changes
  useEffect(() => {
    const roleFromToken = getRoleFromToken();
    setRole(roleFromToken);
  }, []);

  // Function to render the correct route based on the user's role
  const renderRoute = (Component, routeKey) => {
    const route = routesConfig.routes[routeKey];
    if (route.roles.includes(role)) {
      return <Component />;
    }
    return <Navigate to={route.roles.includes('unlogged') ? '/login' : '/'} />;
  };

  // Redirect to home after successful login
  const handleLogin = () => {
    const roleFromToken = getRoleFromToken();
    setRole(roleFromToken); // Update role after login
  };

  return (
    <GoogleOAuthProvider clientId={process.env.RACT_APP_GOOGLE_CLIENT_ID}> {/* GoogleOAuthProvider added */}
      <Router>
        <Layout role={role} setRole={setRole}>  {/* Pass setRole to Layout */}
          <Routes>
            <Route path="/" element={renderRoute(HomePage, 'home')} />
            <Route path="/items" element={renderRoute(ItemsPage, 'items')} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />  {/* Pass handleLogin to LoginPage */}
            <Route path="/admin/user-management" element={<UserManagementPage />} />  {/* User Management route */}
          </Routes>
        </Layout>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
