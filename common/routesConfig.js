
module.exports = {
  routes: {
    home: {
      path: '/',
      roles: ['unlogged', 'logged'],
      frontendVisible: true,
      icon: 'Home',
      page: 'HomePage',
      children: null,
    },
    login: {
      path: '/login',
      roles: ['unlogged'],
      frontendVisible: true,
      icon: 'Login',
      page: 'LoginPage',
      children: null,
    },
    items: {
      path: '/items',
      roles: ['admin'],
      frontendVisible: true,
      icon: 'List',
      page: 'ItemsPage',
      children: null,
    },
    dashboard: {
      path: '/dashboard',
      roles: ['logged'],
      frontendVisible: true,
      icon: 'Dashboard',
      children: {
        reports: {
          path: '/dashboard/reports',
          roles: ['logged', 'admin'],
          frontendVisible: true,
          icon: 'ListAlt',
          page: 'DefaultPage',
        },
        settings: {
          path: '/dashboard/settings',
          roles: ['logged', 'admin'],
          frontendVisible: true,
          icon: 'SettingsOverscan',
        },
      },
    },
    admin: {
      path: '/admin',
      roles: ['admin'],
      frontendVisible: true,
      icon: 'AdminPanelSettings',
      children: {
        userManagement: {
          path: '/admin/user-management',
          roles: ['admin'],
          frontendVisible: true,
          icon: 'GroupAdd',
          page: 'UserManagementPage',
        },
        recordModel: {
          path: '/admin/record-model',
          roles: ['admin'],
          frontendVisible: true,
          icon: 'AddCircleIcon',
          page: 'RecordForm',
        },
        apiDocs: {  
          external: true,  // New attribute to indicate it's an external link
          url: 'http://localhost:5000/api/apidocs',  // External URL to open
          roles: ['admin'],
          frontendVisible: true,
          icon: 'OpenInNew',
        },
        pgAdmin: {
          url: 'http://localhost:5050', // URL for pgAdmin
          external: true,
          frontendVisible: true,
          roles: ['admin'],
          icon: 'OpenInNew',
        },
      },
    },
    profile: {
      path: '/profile',
      roles: ['logged'],
      frontendVisible: false,
      icon: 'AccountBox',
      page: 'UserProfilePage',
      children: null,
    },
    logout: {
      path: '/logout',
      roles: ['logged'],
      frontendVisible: false,
      icon: 'Logout',
      children: null,
    },
  },
};
