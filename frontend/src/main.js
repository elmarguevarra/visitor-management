import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ResidentView from './views/ResidentView.vue'; 
import GuardView from './views/GuardView.vue';  

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ResidentView  // Now uses dedicated component
  },
  {
    path: '/get-visitor',
    name: 'GetVisitor',
    component: GuardView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');
