import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import ScannerPage from '../views/ScannerPage.vue';
import SettingsPage from '../views/SettingsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/home',
  },
  {
    path: '/scanner',
    component: ScannerPage,
  },
  {
    path: '/settings',
    component: SettingsPage,
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue'),
        meta: {
          title: 'Home - QR Transfer'
        }
      },
      {
        path: 'files',
        component: () => import('@/views/FilesPage.vue')
      },
      {
        path: 'about',
        component: () => import('@/views/AboutPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
