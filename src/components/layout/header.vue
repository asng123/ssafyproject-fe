<template>
  <div id="header" :class="{ home_header: isHome }">
    <div id="logo">
      <a href="/"> <img src="../../assets/logo.png" /></a>
    </div>
    <div id="nav">
      <div id="left">
        <ul>
          <li><a href="/zip/list">내집 찾기</a></li>
          <li><a href="/zip/write">내집 소개</a></li>
        </ul>
      </div>
      <div id="right">
        <ul>
          <li>
            <a href="/board/list"
              ><font-awesome-icon icon="fa-solid fa-bell"
            /></a>
          </li>
          <!-- after login-->
          <li id="profile" @click="dropdown" v-if="userInfo">
            <font-awesome-icon icon="fa-solid fa-user" />
          </li>
          <li v-else><a href="/user/login">로그인</a></li>
          <ul id="profile-content" v-show="isDropOpen" style="z-index: 100">
            <li @click.prevent="onClickLogout">로그아웃</li>
            <li @click.prevent="onClickAdminpage" v-if="isAdmin">회원관리</li>
            <li @click.prevent="onClickUserInfo" v-else>내 정보</li>
          </ul>
          <!-- before login-->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
const memberStore = "memberStore";
export default {
  name: "Header",
  data() {
    return {
      scrollPos: null,
      isDropOpen: false,
      isHome: false,
      isAdmin: false,
    };
  },
  created() {
    console.log(this.userInfo);
    this.isAdmin = this.userInfo ? this.userInfo.uid === "admin" : false;
    // this.isAdmin = this.userInfo.uid === "admin" ? true : false;
    window.addEventListener("scroll", this.updateScroll);
    this.isHome = window.location.pathname === "/";
    console.log("w", window.location.pathname);
  },
  watch: {
    userInfo() {
      this.isAdmin = this.userInfo ? this.userInfo.uid === "admin" : false;
    },
  },
  methods: {
    updateScroll() {
      this.scrollPos = window.scrollY;
    },
    dropdown() {
      this.isDropOpen = !this.isDropOpen;
      console.log("drop", this.isDropOpen);
    },
    ...mapActions(memberStore, ["userLogout"]),
    onClickLogout() {
      if (confirm("정말 로그아웃 하시겠습니까?")) {
        this.userLogout(this.userInfo.uid);
        sessionStorage.removeItem("access-token"); //저장된 토큰 없애기
        sessionStorage.removeItem("refresh-token"); //저장된 토큰 없애기
        if (this.$route.path != "/") this.$router.push({ name: "main" });
        this.dropdown();
        this.$router.push({ name: "home" });
      }
    },
    onClickUserInfo() {
      this.dropdown();
      this.$router.push({ name: "memberinfo" });
    },
    onClickAdminpage() {
      this.dropdown();
      this.$router.push({ name: "list" });
    },
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "userInfo"]),
  },
};
</script>

<style lang="scss">
.origin_color {
  background: #000000d4;
  color: $main;
}

.change_color {
  background: rgb(2, 0, 36);
  background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, $main 100%);
}

#header {
  width: 100%;
  height: 8vh;
  padding: 0 3vh;
  transition: background-color 0.5s;

  display: grid;
  grid-template-columns: 1fr 10fr;

  font-size: 20px;
  line-height: 8vh;
  text-align: center;
  z-index: 100;
  background: #000000d4;
  color: $main;
}
.home_header {
  position: sticky;
}
#header a {
  color: $main;
}
#header:hover {
  transition: background-color 0.5s;
  background: black;
}
#left,
#right {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  text-align: end;
}
ul {
  margin-bottom: 0;
}
#nav {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
li {
  list-style: none;
}
#logo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#logo img {
  width: 20px;
  height: 20px;
  object-fit: cover;
}
#profile {
  float: left;
  position: relative;
  z-index: 1;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
#profile-content {
  padding: 0;
  margin-top: 8vh;
  right: 0;
  width: 150px;
  position: absolute;
  border: 0.5px solid #00000050;

  transition: background-color 0.5s;
  background: #000000d4;
}
#profile-content:hover {
  transition: background-color 0.5s;
  background: black;
}
</style>
