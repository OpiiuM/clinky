import { isLoggedIn } from '@/middlewares/isLoggedIn';

export default [
  {
    path: '/',
    name: 'AuthView',
    component: () => import('@/pages/auth/index.vue'),
  },
  {
    path: '/signup',
    name: 'RegisterView',
    component: () => import('@/pages/auth/register.vue'),
  },
  {
    path: '/app',
    name: 'AppView',
    component: () => import('@/pages/app/index.vue'),
    meta: {
      layout: 'Main',
      middlewares: [isLoggedIn],
    },
  },
  {
    path: '/attention',
    name: 'AttentionView',
    component: () => import('@/pages/attention/index.vue'),
    meta: {
      layout: 'Main',
      middlewares: [isLoggedIn],
    },
  },
  {
    path: '/news',
    name: 'NewsView',
    component: () => import('@/pages/news/index.vue'),
    meta: {
      layout: 'Main',
      middlewares: [isLoggedIn],
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorView',
    component: () => import('@/pages/error/index.vue'),
    meta: {
      layout: 'Error',
    },
  },
];
