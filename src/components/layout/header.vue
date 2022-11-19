<template>
  <div id="header" :class="{ home_header: isHome }">
    <div id="logo"><a href="/">내집</a></div>
    <div id="nav">
      <div id="left">
        <ul>
          <li>내집 찾기</li>
          <li>내집 소개</li>
        </ul>
      </div>
      <div id="right">
        <ul>
          <li><font-awesome-icon icon="fa-solid fa-bell" /></li>
          <!-- after login-->
          <li id="profile" @click="dropdown" v-if="userInfo">
            <font-awesome-icon icon="fa-solid fa-user" />
          </li>
          <li v-else><a href="/user/login">로그인</a></li>
          <ul id="profile-content" v-show="isDropOpen">
            <li @click.prevent="onClickLogout">로그아웃</li>
            <li>내 정보</li>
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
    };
  },
  created() {
    window.addEventListener("scroll", this.updateScroll);
    this.isHome = window.location.pathname === "/";
    console.log("w", window.location.pathname);
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
      // this.SET_IS_LOGIN(false);
      // this.SET_USER_INFO(null);
      // sessionStorage.removeItem("access-token");
      // if (this.$route.path != "/") this.$router.push({ name: "main" });
      console.log(this.userInfo);
      //vuex actions에서 userLogout 실행(Backend에 저장 된 리프레시 토큰 없애기
      //+ satate에 isLogin, userInfo 정보 변경)
      // this.$store.dispatch("userLogout", this.userInfo.userid);
      this.userLogout(this.userInfo.uid);
      sessionStorage.removeItem("access-token"); //저장된 토큰 없애기
      sessionStorage.removeItem("refresh-token"); //저장된 토큰 없애기
      if (this.$route.path != "/") this.$router.push({ name: "main" });
      this.dropdown();
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
  padding: 0 2vh;
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
  position: fixed;
  top: 0vh;
}
#header a {
  color: $main;
}
#header:hover {
  transition: background-color 0.5s;
  background: black;
}

#nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
li {
  list-style: none;
}
#profile {
  float: left;
  position: relative;
  z-index: 1;
  cursor: pointer;
}
#profile-content {
  padding: 0;
  margin-top: 8vh;
  right: 0;
  width: 150px;
  position: absolute;
  border: 0.5px solid #00000050;
}
</style>
