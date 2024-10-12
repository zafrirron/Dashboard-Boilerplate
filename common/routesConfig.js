let icons = {};

// Load icons only in the frontend (browser)
if (typeof window !== 'undefined') {
  const HomeIcon = require('@mui/icons-material/Home').default;
  const ListIcon = require('@mui/icons-material/List').default;
  const DashboardIcon = require('@mui/icons-material/Dashboard').default;
  const AccountCircleIcon = require('@mui/icons-material/AccountCircle').default;
  const ExitToAppIcon = require('@mui/icons-material/ExitToApp').default;
  const AdminPanelSettingsIcon = require('@mui/icons-material/AdminPanelSettings').default;
  const GroupIcon = require('@mui/icons-material/Group').default;

  icons = {
    home: HomeIcon,
    login: AccountCircleIcon,
    items: ListIcon,
    apiDocs: DashboardIcon,
    dashboard: DashboardIcon,
    logout: ExitToAppIcon,
    admin: AdminPanelSettingsIcon,
    userManagement: GroupIcon,
  };
}

module.exports = {
  routes: {
    home: {
      path: '/',
      roles: ['unlogged', 'logged', 'admin'],
      frontendVisible: true,
      icon: icons.home ? icons.home : null,
      children: null,
    },
    login: {
      path: '/login',
      roles: ['unlogged'],
      frontendVisible: true,
      icon: icons.login ? icons.login : null,
      children: null,
    },
    items: {
      path: '/items',
      roles: ['admin'],
      frontendVisible: true,
      icon: icons.items ? icons.items : null,
      children: null,
    },
    apiDocs: {
      path: '/api-docs',
      roles: ['admin'],
      frontendVisible: false,
      icon: icons.apiDocs ? icons.apiDocs : null,
      children: null,
    },
    dashboard: {
      path: '/dashboard',
      roles: ['logged', 'admin'],
      frontendVisible: true,
      icon: icons.dashboard ? icons.dashboard : null,
      children: {
        reports: {
          path: '/dashboard/reports',
          roles: ['admin'],
          frontendVisible: true,
          icon: icons.items ? icons.items : null,
        },
        settings: {
          path: '/dashboard/settings',
          roles: ['admin'],
          frontendVisible: true,
          icon: icons.items ? icons.items : null,
        },
      },
    },
    admin: {
      path: '/admin',
      roles: ['admin'],
      frontendVisible: true,
      icon: icons.admin ? icons.admin : null,
      children: {
        userManagement: {
          path: '/admin/user-management',
          roles: ['admin'],
          frontendVisible: true,
          icon: icons.userManagement ? icons.userManagement : null,
        },
      },
    },
    logout: {
      path: '/logout',
      roles: ['logged', 'admin'],
      frontendVisible: false,
      icon: icons.logout ? icons.logout : null,
      children: null,
    },
    profile: {
        path: '/profile',
        roles: ['logged', 'admin'],
        frontendVisible: false,
        icon: null,
    },
  },
};
