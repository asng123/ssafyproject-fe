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
    path: "/user",
    name: "User",
    component: () => import("@/views/User"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/components/users/UserLogin"),
      },
      {
        path: "join",
        name: "Join",
        component: () => import("@/components/users/UserJoin"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
