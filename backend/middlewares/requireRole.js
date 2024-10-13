const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const routesConfig = require('/usr/src/common/routesConfig');  // Use the common routes config

const findRouteByKey = (routes, routeKey) => {
  // Search through top-level routes
  if (routes[routeKey]) {
    return routes[routeKey];
  }

  // Recursively search through child routes
  for (const key in routes) {
    if (routes[key].children) {
      const childRoute = findRouteByKey(routes[key].children, routeKey);
      if (childRoute) {
        return childRoute;
      }
    }
  }

  return null; // Return null if the route is not found
};

const requireRole = (routeKey) => {
  return (req, res, next) => {
    const route = findRouteByKey(routesConfig.routes, routeKey); 
    if (!route) {
      logger.error(`Route ${routeKey} is not defined in routesConfig`);
      return res.status(500).json({ message: 'Server error' });
    }

    let token = req.headers.authorization?.split(' ')[1];

    if (route.roles.includes('unlogged')) {
      return next();  // Allow unlogged users
    }

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token; // Assuming your cookie is named "token"
    } else {
      logger.info(`No cookie for : ${JSON.stringify(req.route)}`);
    }

    if (!token) {
      logger.warn(`Access denied. No token provided for route ${route.path}`);
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //logger.info(`Decoded token for route ${route.path}: ${JSON.stringify(decoded)}`);

      if (route.roles.includes(decoded.role)) {
        return next();  // User has the correct role
      } else {
        logger.warn(`Access denied: user with role ${decoded.role} attempted to access ${route.path}, allowed roles: ${route.roles.join(', ')}`);
        return res.status(403).json({ message: 'Access denied. You do not have the right role.' });
      }
    } catch (err) {
      logger.error(`Invalid token for route ${route.path}: ${err.message}`);
      return res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

module.exports = requireRole;
