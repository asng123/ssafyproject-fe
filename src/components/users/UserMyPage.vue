<template>
  <b-container class="mt-4" id="mypage" v-if="userInfo">
    <b-row>
      <b-col></b-col>
      <b-col cols="8">
        <b-jumbotron
          bg-variant="white  "
          text-variant="black"
          border-variant="white "
        >
          <template #header>My Page</template>

          <hr class="my-4" />

          <b-container class="mt-4">
            <form
              action="#none"
              method="post"
              id="_frmForm"
              name="frmForm"
              @submit.prevent="userupdate"
            >
              <b-row>
                <b-col cols="2" align-self="end">아이디</b-col
                ><b-input
                  readonly
                  type="text"
                  v-model="userInfo.uid"
                  id="uid"
                  ref="userInfo.uid"
                  cols="4"
                  align-self="start"
                ></b-input>
                <b-col cols="2"></b-col>
              </b-row>
              <hr class="my-5" />
              <b-row>
                <b-col align-self="end">패스워드</b-col
                ><b-input
                  type="password"
                  v-model="userInfo.password"
                  id="password"
                  ref="userInfo.password"
                  cols="4"
                  align-self="start"
                ></b-input>
                <b-col cols="2"></b-col>
              </b-row>
              <hr class="my-5" />
              <b-row>
                <b-col>패스워드 확인</b-col
                ><b-input
                  type="password"
                  v-model="passwordCheck"
                  id="passwordCheck"
                  ref="passwordCheck"
                  cols="4"
                  align-self="start"
                ></b-input>
                <b-col cols="2"></b-col>
              </b-row>
              <hr class="my-5" />
              <b-row>
                <b-col cols="2" align-self="end">이름</b-col
                ><b-input
                  type="text"
                  v-model="userInfo.username"
                  id="username"
                  ref="userInfo.username"
                  cols="4"
                  align-self="start"
                ></b-input>
                <b-col cols="2"></b-col>
              </b-row>
              <hr class="my-5" />
              <b-row>
                <b-col cols="2" align-self="end">닉네임</b-col
                ><b-input
                  type="text"
                  v-model="userInfo.nickname"
                  id="nickname"
                  ref="userInfo.nickname"
                  cols="4"
                  align-self="start"
                ></b-input>
                <b-col cols="2"></b-col>
              </b-row>
              <hr class="my-5" />
              <b-row>
                <b-col cols="2" align-self="end">이메일</b-col
                ><b-input
                  type="text"
                  v-model="userInfo.email"
                  id="email"
                  ref="userInfo.email"
                  cols="4"
                  align-self="start"
                ></b-input>
                <b-col cols="2"></b-col>
              </b-row>
              <hr class="my-5" />
              <b-row>
                <b-col align-self="end">전화번호</b-col
                ><b-input
                  type="text"
                  v-model="userInfo.phonenumber"
                  id="phonenumber"
                  ref="userInfo.phonenumber"
                  cols="4"
                  align-self="start"
                ></b-input>
                <b-col cols="2"></b-col>
              </b-row>
              <hr class="my-5" />
              <b-row>
                <b-col cols="2" align-self="end">가입일</b-col
                ><b-input
                  readonly
                  type="text"
                  v-model="userInfo.joindate"
                  id="joindate"
                  ref="userInfo.joindate"
                  cols="4"
                  align-self="start"
                ></b-input>
                <b-col cols="2"></b-col>
              </b-row>
            </form>
          </b-container>
          <hr class="my-4" />

          <b-button variant="primary" @click.prevent="userupdate" class="mr-1"
            >정보수정</b-button
          >
          <b-button variant="danger" @click.prevent="DelMember"
            >회원탈퇴</b-button
          ><span>{{ message }}</span>
        </b-jumbotron>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

const memberStore = "memberStore";
import { del, userupdate } from "@/api/member";

export default {
  name: "UserMyPage",
  data() {
    return {
      message: "",
      passwordCheck: "",
    };
  },
  components: {},
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },
  methods: {
    ...mapActions(memberStore, ["userLogout", "getUserInfo"]),
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
    },
    async DelMember() {
      if (confirm("정말 탈퇴 하시겠습니까? 되돌릴 수 없습니다")) {
        await del(this.userInfo.uid, ({ data }) => {
          if (data.message == "success") {
            this.onClickLogout();
            this.$router.push({ name: "home" });
          } else {
            this.message = "회원 탈퇴에 실패했습니다. 다시 시도해주세요.";
          }
        });
      }
    },
    async userupdate() {
      let myData = {
        uid: this.userInfo.uid,
        username: this.userInfo.username,
        email: this.userInfo.email,
        nickname: this.userInfo.nickname,
        phonenumber: this.userInfo.phonenumber,
        password: this.userInfo.password,
        joindate: this.userInfo.joindate,
      };
      if (confirm("수정 하시겠습니까?")) {
        if (this.passwordCheck == myData.password) {
          let isUpdated = false;
          console.log("update start");
          await userupdate(myData, ({ data }) => {
            if (data.message == "success") {
              console.log("updated");
              isUpdated = true;
            } else {
              console.log("not updated");
              this.message = "회원 탈퇴에 실패했습니다. 다시 시도해주세요.";
            }
          });
          if (isUpdated) {
            console.log("userInfo start");
            let token = sessionStorage.getItem("access-token");
            await this.getUserInfo(token);
            console.log("userInfo done");
            this.$router.push({ name: "home" });
          }
        } else {
          alert("비밀번호를 확인해주세요");
        }
      }
    },
  },
};
</script>

<style scoped>
#aaa {
  background: white;
}
.my-5 {
  margin-bottom: 0.3rem !important;
  margin-top: 0.3rem !important;
}
.jumbotron {
  padding: 0rem;
}
</style>
