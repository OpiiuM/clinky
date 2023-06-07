import { isLoggedIn } from '@/middlewares/isLoggedIn';

export default [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/gui',
    name: 'GuiView',
    component: () => import('@/views/GuiView.vue'),
  },
  {
    path: '/signup',
    name: 'RegisterView',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    path: '/auth',
    name: 'AuthView',
    component: () => import('@/views/AuthView.vue'),
  },
  {
    path: '/app',
    name: 'AppView',
    component: () => import('@/views/AppView.vue'),
    meta: {
      layout: 'Main',
      middlewares: [isLoggedIn],
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorView',
    component: () => import('@/views/ErrorView.vue'),
    meta: {
      layout: 'Error',
    },
  },
];
