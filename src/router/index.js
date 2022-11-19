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
    path: "/board",
    name: "board",
    component: () => import("@/views/Board"),
    redirect: "/board/list",
    children: [
      {
        path: "list",
        name: "boardlist",
        component: () => import("@/components/board/BoardList"),
      },
      {
        path: "write",
        name: "boardwrite",
        component: () => import("@/components/board/BoardWrite"),
      },
      {
        path: "view/:bid",
        name: "boardview",
        component: () => import("@/components/board/BoardView"),
      },
      {
        path: "modify",
        name: "boardmodify",
        component: () => import("@/components/board/BoardModify"),
      },
      {
        path: "delete/:bid",
        name: "boarddelete",
        component: () => import("@/components/board/BoardDelete"),
      },
    ],
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
      {
        path: "memberinfo/:uid",
        name: "memberinfo",
        component: () => import("@/components/users/UserMyPage"),
      },
      {
        path: "list",
        name: "list",
        component: () => import("@/components/users/UserList"),
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
