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
  {
    path: "/question",
    name: "question",
    component: () => import("@/views/Question"),
    redirect: "/question/list",
    children: [
      {
        path: "list",
        name: "questionlist",
        component: () => import("@/components/question/QuestionList"),
      },
      {
        path: "write",
        name: "questionwrite",
        component: () => import("@/components/question/QuestionWrite"),
      },
      {
        path: "view/:qid",
        name: "questionview",
        component: () => import("@/components/question/QuestionView"),
      },
      {
        path: "delete/:qid",
        name: "questiondelete",
        component: () => import("@/components/question/QuestionDelete"),
      },
      {
        path: "modify/:qid",
        name: "questionmodify",
        component: () => import("@/components/question/QuestionModify"),
      },
      {
        path: "writeanswer",
        name: "writeanswer",
        component: () => import("@/components/question/AnswerWrite"),
      },
    ],
  },
  {
    path: "/zip",
    name: "Zip",
    component: () => import("@/views/ZipView"),
    redirect: "/board/list",
    children: [
      {
        path: "list",
        name: "ziplist",
        component: () => import("@/components/zip/ZipList"),
      },
      {
        path: "write",
        name: "zipwrite",
        component: () => import("@/components/zip/ZipWrite"),
      },
      {
        path: "view/:zid",
        name: "zipdetailview",
        component: () => import("@/components/zip/ZipDetail"),
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
