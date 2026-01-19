import { isLoggedIn } from '@/middlewares/isLoggedIn';

export default [
  {
    path: '/signup',
    name: 'RegisterView',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    path: '/signin',
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
