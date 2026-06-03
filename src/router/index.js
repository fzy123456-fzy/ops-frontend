import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/visual-screen',
    name: 'VisualScreen',
    component: () => import('../views/VisualScreen.vue')
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'device',
        name: 'Device',
        component: () => import('../views/Device.vue')
      },
      {
        path: 'alarm',
        name: 'Alarm',
        component: () => import('../views/Alarm.vue')
      },
      {
        path: 'task',
        name: 'Task',
        component: () => import('../views/Task.vue')
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('../views/Log.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: 'algorithm',
        name: 'Algorithm',
        component: () => import('../views/Algorithm.vue')
      },
      {
        path: 'digital-twin',
        name: 'DigitalTwin',
        component: () => import('../views/DigitalTwin.vue')
      },
      {
        path: 'llm',
        name: 'Llm',
        component: () => import('../views/Llm.vue')
      },
      {
        path: 'agent',
        name: 'Agent',
        component: () => import('../views/Agent.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
