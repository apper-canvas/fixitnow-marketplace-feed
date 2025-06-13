import HomePage from '@/components/pages/HomePage';
    import TaskCreatePage from '@/components/pages/TaskCreatePage';
    import BrowseProsPage from '@/components/pages/BrowseProsPage';
    import JobTrackingPage from '@/components/pages/JobTrackingPage';
    import MessagesPage from '@/components/pages/MessagesPage';
    import ProfilePage from '@/components/pages/ProfilePage';
    import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
icon: 'Home',
        component: HomePage
  },
  taskCreate: {
    id: 'taskCreate',
    label: 'Create Task',
    path: '/task/create',
    icon: 'Plus',
icon: 'Plus',
        component: TaskCreatePage
  },
  browsePros: {
    id: 'browsePros',
    label: 'Browse Pros',
    path: '/pros',
    icon: 'Users',
icon: 'Users',
        component: BrowseProsPage
  },
  jobTracking: {
    id: 'jobTracking',
    label: 'Track Job',
    path: '/job/:id',
    icon: 'MapPin',
icon: 'MapPin',
        component: JobTrackingPage
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: 'MessageCircle',
icon: 'MessageCircle',
        component: MessagesPage
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
icon: 'User',
        component: ProfilePage
  }
};

export const routeArray = Object.values(routes);