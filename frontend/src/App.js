import React, { Suspense, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import routesConfig from './common/routesConfig';
import { AuthProvider, AuthContext } from './context/AuthContext'; // Import AuthProvider and AuthContext

// Function to load the page dynamically based on the `page` field in routesConfig
const getPageComponent = (pageName) => {
  // Default page to load if component not found
  let Component = React.lazy(() => import('./pages/DefaultPage'));
  
  if (!pageName || pageName === undefined) {
    // Use the DefaultPage if pageName is missing or undefined
    return Component;
  }
  try {
    // Dynamically import the component for the given pageName
    Component = React.lazy(() => import(`./pages/${pageName}`));
  } catch (error) {
    console.error(`Component not found for route: ${pageName}, loading DefaultPage.`);
  }
  return Component;
};

// Function to render a route based on the configuration
const renderRoute = (route, role) => {
  // Ensure that only allowed roles can access the route
  if (!route.roles.includes(role) && role !== 'admin') {
    return null; // Role-based access control
  }

  // Load the page component dynamically
  const Component = getPageComponent(route.page);

  return (
    <Route
      key={route.path}
      path={route.path}
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
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
    return renderRoute(route, role); // Render the individual route
  });
};

// Named function for App
const App = () => {
  const { role } = useContext(AuthContext); // Get the current role from AuthContext

  return (
    <Router>
      <Layout role={role}>
        <Routes>
          {generateRoutes(routesConfig.routes, role)}
        </Routes>
      </Layout>
    </Router>
  );
};

// Wrap the App component with AuthProvider here
const WrappedApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default WrappedApp;
