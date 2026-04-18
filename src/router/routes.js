import { isLoggedIn } from '@/middlewares/isLoggedIn';

export default [
  {
    path: '/',
    name: 'AuthView',
    component: () => import('@/views/AuthView.vue'),
  },
  {
    path: '/signup',
    name: 'RegisterView',
    component: () => import('@/views/RegisterView.vue'),
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
    path: '/attention',
    name: 'AttentionView',
    component: () => import('@/views/AttentionView.vue'),
    meta: {
      layout: 'Main',
      middlewares: [isLoggedIn],
    },
  },
  {
    path: '/news',
    name: 'NewsView',
    component: () => import('@/views/NewsView.vue'),
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
