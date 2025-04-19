import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ResidentView from './views/ResidentView.vue'; 
import GetVisitorView from './views/GetVisitorView.vue';  
import VerifyVisitorView from './views/VerifyVisitorView.vue';

import './styles/global.css';
import './styles/banner.css';
import './styles/variables.css';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ResidentView  // Now uses dedicated component
  },
  {
    path: '/get-visitor',
    name: 'GetVisitor',
    component: GetVisitorView
  },
  {
    path: '/verify-visitor/:registrationId',
    name: 'VerifyVisitorView',
    component: VerifyVisitorView,
    props: true
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');
