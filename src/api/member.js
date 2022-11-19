import { apiInstance } from "./index.js";

const api = apiInstance();

async function login(user, success, fail) {
  console.log("member.js", user);
  await api.post(`/user/login`, JSON.stringify(user)).then(success).catch(fail);
}

async function join(user, success, fail) {
  console.log("join", user);
  await api.post(`/user/`, JSON.stringify(user)).then(success).catch(fail);
}
async function findById(userid, success, fail) {
  api.defaults.headers["access-token"] = sessionStorage.getItem("access-token");
  await api.get(`/user/info/${userid}`).then(success).catch(fail);
}
async function idCheck(userid, success, fail) {
  await api.get(`/user/check/${userid}`).then(success).catch(fail);
}

async function tokenRegeneration(user, success, fail) {
  api.defaults.headers["refresh-token"] =
    sessionStorage.getItem("refresh-token"); //axios header에 refresh-token 셋팅
  await api.post(`/user/refresh`, user).then(success).catch(fail);
}

async function logout(userid, success, fail) {
  await api.get(`/user/logout/${userid}`).then(success).catch(fail);
}

<<<<<<< HEAD
async function del(userid, success, fail) {
  await api.delete(`/user/${userid}`).then(success).catch(fail);
=======
async function join(user, success, fail) {
  console.log("join", user);
  await api.post(`/user/`, JSON.stringify(user)).then(success).catch(fail);
>>>>>>> df3f26d ([add] admin 공지사항 기능 추가)
}

async function userupdate(user, success, fail) {
  await api.put(`/user/`, user).then(success).catch(fail);
}

export { join, login, idCheck, findById, tokenRegeneration, logout, del, userupdate };
