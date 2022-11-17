import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import("@/views/BoardList.vue"),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/UserLogin.vue"),
  },
  {
    path: '/regist',
    name: 'Regist',
    component: () => import("@/views/UserRegist.vue"),
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
