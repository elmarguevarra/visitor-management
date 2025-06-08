import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory, useRouter } from 'vue-router'
import RegisterVisitorView from './views/RegisterVisitorView.vue'
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
import { useAuthorizationStore } from './stores/authorizationStore'
import RestrictedView from './views/RestrictedView.vue'
import { Action, ACTIONS } from './constants/actions'
import SearchVisitorView from './views/SearchVisitorView.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import { useUiStore } from './stores/uiStore'
import SignOutCallback from './components/SignOutCallback.vue'
import SignInCallback from './components/SignInCallback.vue'

if (process.env.NODE_ENV === 'development') {
  require('./mocks/msw')
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

const pinia = createPinia()
const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingView,
    meta: { requiresAuthentication: false },
  },
  {
    path: '/visitors',
    name: 'ListVisitors',
    component: ListVisitorsView,
    meta: {
      requiresAuthentication: true,
      requiresPermissionOnAction: ACTIONS.BROWSE_VISITORS,
    },
  },
  {
    path: '/register-visitor',
    name: 'RegisterVisitorView',
    component: RegisterVisitorView,
    meta: {
      requiresAuthentication: true,
      requiresPermissionOnAction: ACTIONS.REGISTER_VISITOR,
    },
  },
  {
    path: '/search-visitor',
    name: 'SearchVisitorView',
    component: SearchVisitorView,
    meta: {
      requiresAuthentication: true,
      requiresPermissionOnAction: ACTIONS.SEARCH_VISITOR,
    },
  },
  {
    path: '/invite-visitor',
    name: 'InviteVisitorView',
    component: InviteVisitorView,
    meta: {
      requiresAuthentication: true,
      requiresPermissionOnAction: ACTIONS.INVITE_VISITOR,
    },
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView,
    meta: { requiresAuthentication: true },
  },
  {
    path: '/self-register-visitor/:inviteToken',
    name: 'SelfRegisterVisitorView',
    component: SelfRegisterVisitorView,
    props: true,
    meta: { requiresAuthentication: false },
  },
  {
    path: '/verify-visitor/:registrationId',
    name: 'VerifyVisitorView',
    component: VerifyVisitorView,
    props: true,
    meta: {
      requiresAuthentication: true,
      requiresPermissionOnAction: ACTIONS.VERIFY_VISITOR,
    },
  },
  {
    path: '/restricted',
    name: 'RestrictedAccess',
    component: RestrictedView,
    meta: { requiresAuthentication: true },
  },
  {
    path: '/signin-callback',
    name: 'SignInCallback',
    component: SignInCallback,
    meta: { requiresAuthentication: false },
  },
  {
    path: '/signout-callback',
    name: 'SignOutCallback',
    component: SignOutCallback,
    meta: { requiresAuthentication: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
    meta: { requiresAuthentication: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.use(pinia)

const authenticationStore = useAuthenticationStore()
const authorizationStore = useAuthorizationStore()
const uiStore = useUiStore()

app.mount('#app')

if (process.env.NODE_ENV !== 'development') {
  router.beforeEach(async (to, from, next) => {
    uiStore.isLoading = true
    if (!to.meta.requiresAuthentication) {
      return next()
    }
    await authenticationStore.loadUser()
    if (authenticationStore.isLoggedIn) {
      await authorizationStore.loadUserPermissions()
      const action = to.meta.requiresPermissionOnAction as Action
      if (action && !authorizationStore.hasPermissionOnAction(action)) {
        return next('/restricted')
      }
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
  router.afterEach(() => {
    setTimeout(() => {
      uiStore.isLoading = false
    }, 300) //For percieved performance
  })
}
