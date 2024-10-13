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
  const ApiIcon = require('@mui/icons-material/Api').default;  // Swagger icon
  const ProfileIcon = require('@mui/icons-material/Info').default;

  icons = {
    home: HomeIcon,
    login: AccountCircleIcon,
    items: ListIcon,
    apiDocs: ApiIcon,  // Swagger icon
    dashboard: DashboardIcon,
    logout: ExitToAppIcon,
    admin: AdminPanelSettingsIcon,
    userManagement: GroupIcon,
    profile: ProfileIcon,
  };
}

module.exports = {
  routes: {
    home: {
      path: '/',
      roles: ['unlogged', 'logged', 'admin'],
      frontendVisible: true,
      icon: icons.home ? icons.home : null,
      page: 'HomePage',
      children: null,
    },
    login: {
      path: '/login',
      roles: ['unlogged'],
      frontendVisible: true,
      icon: icons.login ? icons.login : null,
      page: 'LoginPage',
      children: null,
    },
    items: {
      path: '/items',
      roles: ['admin'],
      frontendVisible: true,
      icon: icons.items ? icons.items : null,
      page: 'ItemsPage',
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
          roles: ['logged', 'admin'],
          frontendVisible: true,
          icon: icons.items ? icons.items : null,
          page: 'DefaultPage',
        },
        settings: {
          path: '/dashboard/settings',
          roles: ['logged', 'admin'],
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
          page: 'UserManagementPage',
        },
        apiDocs: {  
          external: true,  // New attribute to indicate it's an external link
          url: 'http://localhost:5000/api/apidocs',  // External URL to open
          roles: ['admin'],
          frontendVisible: true,
          icon: icons.apiDocs ? icons.apiDocs : null,
        },
      },
    },
    profile: {
      path: '/profile',
      roles: ['logged', 'admin'],
      frontendVisible: true,
      icon: icons.profile ? icons.profile : null,
      page: 'UserProfilePage',
      children: null,
    },
    logout: {
      path: '/logout',
      roles: ['logged', 'admin'],
      frontendVisible: false,
      icon: icons.logout ? icons.logout : null,
      children: null,
    },
  },
};
