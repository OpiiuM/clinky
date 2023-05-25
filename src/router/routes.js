export default [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('@/views/HomeView.vue'),
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
      requiresAuth: true,
    },
  },
];
