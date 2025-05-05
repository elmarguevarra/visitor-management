// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import RegisterVisitorView from './views/RegisterVisitorView.vue'
import GetVisitorView from './views/GetVisitorView.vue'
import VerifyVisitorView from './views/VerifyVisitorView.vue'
import ListVisitorsView from './views/ListVisitorsView.vue'
import InviteVisitorView from './views/InviteVisitorView.vue'
import SelfRegisterVisitorView from './views/SelfRegisterVisitorView.vue'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { userManager } from './auth/authConfig'

if (process.env.NODE_ENV === 'development') {
  require('./mocks/msw')
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

const pinia = createPinia()
const routes = [
  {
    path: '/',
    name: 'ListVisitors',
    component: ListVisitorsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/register-visitor',
    name: 'Register',
    component: RegisterVisitorView,
    meta: { requiresAuth: true },
  },
  {
    path: '/get-visitor',
    name: 'GetVisitor',
    component: GetVisitorView,
    meta: { requiresAuth: true },
  },
  {
    path: '/invite-visitor',
    name: 'InviteVisitorView',
    component: InviteVisitorView,
    meta: { requiresAuth: true },
  },
  {
    path: '/self-register-visitor/:inviteToken',
    name: 'SelfRegisterVisitorView',
    component: SelfRegisterVisitorView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/verify-visitor/:registrationId',
    name: 'VerifyVisitorView',
    component: VerifyVisitorView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach(async (to, from, next) => {
//   if (to.meta.requiresAuth) {
//     const user = await userManager.getUser()
//     if (user) {
//       next()
//     } else {
//       await userManager.signinRedirect()
//     }
//   }
// })

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
