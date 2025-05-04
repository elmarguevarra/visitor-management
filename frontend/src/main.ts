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

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const oauth = {
        domain: 'ap-southeast-1scrgvy8xg.auth.ap-southeast-1.amazoncognito.com',
        scope: [
          'openid',
          'email',
          'phone',
          // 'profile',
          'aws.cognito.signin.user.admin',
        ].join(' '), // Join scopes with a space
        redirectSignIn: window.location.origin + to.fullPath,
        responseType: 'code',
        clientId: '3jid0987p3l05ursbrs6gun0oi',
      }

      // const cognitoUrl = `https://${oauth.domain}/login?client_id=${oauth.clientId}&response_type=${oauth.responseType}&scope=${encodeURIComponent(oauth.scope)}&redirect_uri=${encodeURIComponent(oauth.redirectSignIn)}`
      const cognitoUrl = `https://ap-southeast-1scrgvy8xg.auth.ap-southeast-1.amazoncognito.com/login/continue?client_id=3jid0987p3l05ursbrs6gun0oi&redirect_uri=https%3A%2F%2Fvms.alphinecodetech.click&response_type=code&scope=email+openid`
      console.log('cognitoUrl: ', cognitoUrl)
      window.location.href = cognitoUrl
    } catch (error) {
      console.error('Authentication error:', error)
    }
  } else {
    next() // Route does not require authentication
  }
})

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
