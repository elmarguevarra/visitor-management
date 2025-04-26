// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import RegisterVisitorView from './views/RegisterVisitorView.vue'
import GetVisitorView from './views/GetVisitorView.vue'
import VerifyVisitorView from './views/VerifyVisitorView.vue'
import ListVisitorsView from './views/ListVisitorsView.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import InviteVisitorView from './views/InviteVisitorView.vue'

if (process.env.NODE_ENV === 'development') {
  require('./mocks/msw')
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

const routes = [
  {
    path: '/',
    name: 'ListVisitors',
    component: ListVisitorsView,
  },
  {
    path: '/register-visitor',
    name: 'Register',
    component: RegisterVisitorView,
  },
  {
    path: '/get-visitor',
    name: 'GetVisitor',
    component: GetVisitorView,
  },
  {
    path: '/invite-visitor',
    name: 'InviteVisitorView',
    component: InviteVisitorView,
  },
  {
    path: '/verify-visitor/:registrationId',
    name: 'VerifyVisitorView',
    component: VerifyVisitorView,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
