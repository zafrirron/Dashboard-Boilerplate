import React, { Suspense, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import routesConfig from './common/routesConfig';
import { AuthProvider, AuthContext } from './context/AuthContext'; // Import AuthProvider and AuthContext

// Function to load the page dynamically based on the `page` field in routesConfig
const getPageComponent = (pageName) => {
  //console.log(`Page requested: ${pageName}`)
  let Component = React.lazy(() => import('./pages/DefaultPage'));
  //if (!pageName) {
  //  console.error('Missing route key.');
  //}
  if (!pageName || pageName === undefined) {
    console.error('Missing or undefined route key.');
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
  if (!route.roles.includes(role)) {
    return null; // Role-based access control
  }

  const Component = getPageComponent(route.page);
  //if (!Component) {
  //  return null;
  //}

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

// Recursive function to generate routes
const generateRoutes = (routes, role) => {
  return Object.keys(routes).map((routeKey) => {
    const route = routes[routeKey];
    if (!route.key) {
      route.key = routeKey;
    }
    if (route.children) {
      return generateRoutes(route.children, role);
    }
    return renderRoute(route, role);
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
