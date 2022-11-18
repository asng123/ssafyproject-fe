<template>
  <div
    id="header"
    :class="{ origin_color: scrollPos < 100, change_color: scrollPos > 100 }"
  >
    <div id="logo">내집</div>
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
          <!--v-if="userInfo"-->
          <!-- after login-->
          <li id="profile" @click="dropdown">
            <font-awesome-icon icon="fa-solid fa-user" />
          </li>
          <ul id="profile-content" v-show="isDropOpen">
            <li>로그아웃</li>
            <li>내 정보</li>
          </ul>
          <!-- before login-->
          <!-- <li v-else>로그인</li> -->
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
    };
  },
  created() {
    window.addEventListener("scroll", this.updateScroll);
  },
  methods: {
    updateScroll() {
      this.scrollPos = window.scrollY;
    },
    dropdown() {
      this.isDropOpen = !this.isDropOpen;
      console.log("drop", this.isDropOpen);
    },
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "userInfo"]),
  },
};
</script>

<style lang="scss">
.origin_color {
  background-color: transparent;
}

.change_color {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
#header {
  padding: 3vh;
  position: sticky;
  top: 0vh;
  transition: background-color 0.5s;

  display: grid;
  grid-template-columns: 1fr 10fr;

  font-size: 20px;
  text-align: center;
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
  margin-top: 6vh;
  right: 0;
  width: 150px;
  position: absolute;
  border: 0.5px solid #00000050;
}
</style>
