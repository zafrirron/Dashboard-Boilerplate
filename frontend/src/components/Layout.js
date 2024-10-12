import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Avatar, CssBaseline, Divider, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import routesConfig from '../common/routesConfig';

const drawerWidth = 240;
const collapsedWidth = 100;

const Layout = ({ role, setRole, children }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
  const [openMenu, setOpenMenu] = useState({}); // Track which menu items are expanded

  // Recalculate role on login/logout or when the token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setRole('unlogged');
    } else {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setRole(decodedToken.role || 'unlogged');
    }
  }, [setRole]);

  // Toggle menu open/close state
  const handleToggleMenu = (menuKey) => {
    setOpenMenu((prevOpen) => ({
      ...prevOpen,
      [menuKey]: !prevOpen[menuKey],
    }));
  };

  // Get user info from the JWT token
  const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (!token) return { name: '', email: '' };
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return {
      name: decodedToken.name || 'User',
      email: decodedToken.email || 'user@example.com',
    };
  };

  const { name, email } = getUserInfo(); // Extract user info from JWT token

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the dropdown menu
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT token
    setRole('unlogged'); // Update the role to 'unlogged'
    navigate('/login'); // Redirect to login page after logout
    handleMenuClose();
  };

  const renderMenuItems = (routes) => {
    if (!routes || typeof routes !== 'object') return null; // Safeguard to avoid undefined or null

    return Object.keys(routes).map((routeKey) => {
      const route = routes[routeKey];
      const IconComponent = route?.icon;
      const hasChildren = route?.children && typeof route.children === 'object';

      if (route.roles.includes(role) && route.frontendVisible) {
        return (
          <React.Fragment key={route.path}>
            <ListItem button onClick={hasChildren ? () => handleToggleMenu(routeKey) : () => handleNavigation(route.path)} sx={{ cursor: 'pointer' }}>
              {IconComponent && <ListItemIcon><IconComponent /></ListItemIcon>}
              {!isCollapsed && <ListItemText primary={routeKey.charAt(0).toUpperCase() + routeKey.slice(1)} />}
              {hasChildren && (openMenu[routeKey] ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {/* Render children as a collapsible list */}
            {hasChildren && (
              <Collapse in={openMenu[routeKey]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {renderMenuItems(route.children)}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        );
      }
      return null;
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Header */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${isCollapsed ? collapsedWidth : drawerWidth}px)`, ml: `${isCollapsed ? collapsedWidth : drawerWidth}px` }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleToggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>

          {role === 'unlogged' && <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>}
          {role !== 'unlogged' && (
            <>
              <IconButton color="inherit" onClick={handleMenuClick}>
                <Avatar>{name.charAt(0).toUpperCase()}</Avatar> {/* Display the first letter of the user's name */}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {/* User Info */}
                <MenuItem disabled>
                  <Typography variant="subtitle1">{name}</Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="body2">{email}</Typography>
                </MenuItem>
                <Divider />
                {/* Action Links */}
                <MenuItem onClick={() => handleNavigation('/profile')}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: isCollapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isCollapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {renderMenuItems(routesConfig.routes)}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
