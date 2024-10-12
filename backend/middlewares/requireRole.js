const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const routesConfig = require('/usr/src/common/routesConfig');  // Use the common routes config

const requireRole = (routeKey) => {
  return (req, res, next) => {
    const route = routesConfig.routes[routeKey];
    if (!route) {
      logger.error(`Route ${routeKey} is not defined in routesConfig`);
      return res.status(500).json({ message: 'Server error' });
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (route.roles.includes('unlogged')) {
      return next();  // Allow unlogged users
    }

    if (!token) {
      logger.warn(`Access denied. No token provided for route ${route.path}`);
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.info(`Decoded token for route ${route.path}: ${JSON.stringify(decoded)}`);

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
