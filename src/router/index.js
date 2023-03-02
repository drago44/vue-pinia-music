import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores';

const Home = () => import('@/views/Home.vue');
const About = () => import('@/views/About.vue');
const Manage = () => import('@/views/Manage.vue');
const Song = () => import('@/views/Song.vue');

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'about',
    path: '/about',
    component: About,
  },
  {
    name: 'manage',
    alias: '/manage',
    path: '/manage-music',
    component: Manage,
    meta: { requiresAuth: true },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song,
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const userStore = useUserStore();

  if (!userStore.userLoggedIn) next({ name: 'home' });
  else next();
});

export default router;
