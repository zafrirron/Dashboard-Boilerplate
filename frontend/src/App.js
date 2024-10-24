import React, { Suspense, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import routesConfig from './common/routesConfig';
import { AuthProvider, AuthContext } from './context/AuthContext'; // Import AuthProvider and AuthContext

// Function to load the page dynamically based on the `page` field in routesConfig
const getPageComponent = (pageName) => {
  let Component = React.lazy(() => import('./pages/DefaultPage'));

  if (!pageName || pageName === undefined) {
    return Component;
  }
  try {
    Component = React.lazy(() => import(`./pages/${pageName}`));
  } catch (error) {
    console.error(`Component not found for route: ${pageName}, loading DefaultPage.`);
  }
  return Component;
};

// Function to render a route based on the configuration
const renderRoute = (route, role) => {
  if (!route.roles.includes(role) && role !== 'admin') {
    return null; // Role-based access control
  }

  const Component = getPageComponent(route.page);
  const { props: componentProps = {} } = route; 

  return (
    <Route
      key={route.path}
      path={route.path}
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <Component {...componentProps} />
        </Suspense>
      }
    />
  );
};

// Recursive function to generate routes based on the role
const generateRoutes = (routes, role) => {
  return Object.keys(routes).map((routeKey) => {
    const route = routes[routeKey];
    if (!route.key) {
      route.key = routeKey;
    }
    if (route.children) {
      return generateRoutes(route.children, role); // Recursively generate child routes
    }
    return renderRoute(route, role);
  });
};

// Named function for App
const App = () => {
  const { role, handleLogout } = useContext(AuthContext); // Get the current role from AuthContext
  const navigate = useNavigate(); // useNavigate hook for redirection

  // Effect to handle redirect to login page when the user is logged out
  useEffect(() => {
    //console.log('useEffect triggered - Checking token expiry');
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token');
      if (token) {
        //console.log('Token found:', token);
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          //console.log('Decoded token:', decodedToken);
          const currentTime = Date.now() / 1000;
          //console.log('Current time (in seconds):', currentTime);

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            console.log('Token expired, logging out...');
            handleLogout(); // Token expired, logout user
            navigate('/login'); // Redirect to login
          } else {
            //console.log('Token is valid.');
          }
        } catch (error) {
          console.error('Error checking token expiry:', error);
          handleLogout(); // Invalid token, log out the user
          navigate('/login'); // Redirect to login
        }
      } else {
          console.log('No token found, user is unlogged.');
      }
    };
    checkTokenExpiry();

    // Set up an interval to check token expiration periodically (every 60 seconds)
    const intervalId = setInterval(checkTokenExpiry, 60000); // 60 seconds

    return () => clearInterval(intervalId); // Clean up the interval on unmount

  }, [role, handleLogout, navigate]); // Dependency array watches the role changes

  return (
    <Layout role={role}>
      <Routes>
        {generateRoutes(routesConfig.routes, role)}
      </Routes>
    </Layout>
  );
};

// Wrap the App component with AuthProvider and Router here
const WrappedApp = () => (
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);

export default WrappedApp;
