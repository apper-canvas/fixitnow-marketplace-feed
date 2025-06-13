import Home from '../pages/Home';
import TaskCreate from '../pages/TaskCreate';
import BrowsePros from '../pages/BrowsePros';
import JobTracking from '../pages/JobTracking';
import Messages from '../pages/Messages';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  taskCreate: {
    id: 'taskCreate',
    label: 'Create Task',
    path: '/task/create',
    icon: 'Plus',
    component: TaskCreate
  },
  browsePros: {
    id: 'browsePros',
    label: 'Browse Pros',
    path: '/pros',
    icon: 'Users',
    component: BrowsePros
  },
  jobTracking: {
    id: 'jobTracking',
    label: 'Track Job',
    path: '/job/:id',
    icon: 'MapPin',
    component: JobTracking
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: 'MessageCircle',
    component: Messages
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  }
};

export const routeArray = Object.values(routes);