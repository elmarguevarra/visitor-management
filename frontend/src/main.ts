import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory, useRouter } from 'vue-router'
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
import LandingView from './views/LandingView.vue'
import { useAuthenticationStore } from './stores/authenticationStore'
import ProfileView from './views/ProfileView.vue'
import UnAssignedView from './views/UnAssignedView.vue'
import { useAuthorizationStore } from './stores/authorizationStore'

if (process.env.NODE_ENV === 'development') {
  require('./mocks/msw')
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

const authenticationStore = useAuthenticationStore()
const authorizationStore = useAuthorizationStore()

const pinia = createPinia()
const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingView,
    meta: { requiresAuth: false },
  },
  {
    path: '/visitors',
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
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/self-register-visitor/:inviteToken',
    name: 'SelfRegisterVisitorView',
    component: SelfRegisterVisitorView,
    props: true,
    meta: { requiresAuth: false },
  },
  {
    path: '/verify-visitor/:registrationId',
    name: 'VerifyVisitorView',
    component: VerifyVisitorView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/unassigned',
    name: 'UnAssignedView',
    component: UnAssignedView,
    meta: { requiresAuth: true },
  },
  {
    path: '/signin-callback',
    name: 'SignInCallback',
    component: {
      template: '<div>Processing login...</div>',
      async created() {
        const router = useRouter()
        try {
          await userManager.signinRedirectCallback().then(async (user) => {
            if (user) {
              await authenticationStore.loadUser(user)
              await authorizationStore.loadUserPermissions()
            }
          })
          const redirectPath =
            sessionStorage.getItem('postLoginRedirectPath') || '/visitors'
          sessionStorage.removeItem('postLoginRedirectPath')
          router.push(redirectPath)
        } catch (error) {
          console.error('Error handling sign-in callback:', error)
          router.push('/login-error')
        }
      },
    },
    meta: { requiresAuth: false },
  },
  {
    path: '/signout-callback',
    name: 'SignOutCallback',
    component: {
      template: '<div>Processing logout...</div>',
      async created() {
        try {
          await userManager.signoutRedirectCallback()
          await userManager.removeUser()

          router.push('/')
        } catch (error) {
          console.error('Error handling sign-out callback:', error)
          router.push('/')
        }
      },
    },
    meta: { requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')

if (process.env.NODE_ENV !== 'development') {
  router.beforeEach(async (to, from, next) => {
    if (!to.meta.requiresAuth) {
      return next()
    }

    if (authenticationStore.isLoggedIn) {
      next()
    } else {
      await authenticationStore.removeUser()
      if (to.name !== 'SignInCallback') {
        sessionStorage.setItem('postLoginRedirectPath', to.fullPath)
        await authenticationStore.signIn()
      } else {
        next()
      }
    }
  })
}
