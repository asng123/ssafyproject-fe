<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col></b-col>
      <b-col cols="8">
        <b-card class="text-center mt-3" style="max-width: 40rem" align="left">
          <b-form class="text-left">
            <b-alert show variant="danger" v-if="isLoginError"
              >아이디 또는 비밀번호를 확인하세요.</b-alert
            >
            <b-form-group label="아이디:" label-for="userid">
              <b-form-input
                id="userid"
                v-model="user.uid"
                required
                placeholder="아이디 입력...."
                @keyup.enter="confirm"
              ></b-form-input>
              <b-button
                type="button"
                :class="{ checked: isIdChecked }"
                class="m-1"
                @click="idCheckFunc"
                >아이디 확인</b-button
              >
              <span>{{ message }}</span>
            </b-form-group>
            <b-form-group label="이름:" label-for="username">
              <b-form-input
                id="username"
                v-model="user.username"
                required
                placeholder="이름...."
                @keyup.enter="confirm"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="이메일:" label-for="userEmail">
              <b-form-input
                type="email"
                id="userEmail"
                v-model="user.email"
                required
                placeholder="이메일...."
                @keyup.enter="confirm"
              ></b-form-input>
            </b-form-group>
<<<<<<< HEAD
            <b-form-group label="닉네임:" label-for="nickname">
              <b-form-input
                type="text"
                id="nickname"
                v-model="user.nickname"
                required
                placeholder="닉네임...."
                @keyup.enter="confirm"
              ></b-form-input>
            </b-form-group>
            <b-form-input
                type="text"
=======
            <b-form-group label="전화번호:" label-for="userPhoneNumber">
              <b-form-input
                type="email"
>>>>>>> 268263e ([feat] join)
                id="userPhoneNumber"
                v-model="user.phonenumber"
                required
                placeholder="전화번호...."
                @keyup.enter="confirm"
              ></b-form-input>
<<<<<<< HEAD
=======
            </b-form-group>
>>>>>>> 268263e ([feat] join)
            <b-form-group label="비밀번호:" label-for="userpwd">
              <b-form-input
                type="password"
                id="userpwd"
                v-model="user.password"
                required
                placeholder="비밀번호 입력...."
                @keyup.enter="confirm"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="비밀번호 확인:" label-for="userpwdCheck">
              <b-form-input
                type="password"
                id="userpwdCheck"
                v-model="user.passwordCheck"
                required
                placeholder="비밀번호 확인...."
                @keyup.enter="confirm"
              ></b-form-input>
            </b-form-group>
            <b-button
              type="button"
              variant="primary"
              class="m-1"
              @click="confirm"
              >회원가입</b-button
            >
            <span>{{ finalMessage }}</span>
          </b-form>
        </b-card>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { idCheck, join } from "@/api/member";

const memberStore = "memberStore";

export default {
  name: "UserJoin",
  data() {
    return {
      // isLoginError: false,
      user: {
        uid: null,
        username: null,
        nickname: null,
        email: null,
        password: null,
        passwordCheck: null,
        phonenumber: null,
      },
      isIdChecked: false,
      message: "",
      finalMessage: "",
    };
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "isLoginError", "userInfo"]),
  },
  methods: {
    async confirm() {
      if (!this.isIdChecked) {
        this.finalMessage = "아이디 확인을 해주세요.";
        return;
      }
      if (!this.user.username) {
        this.finalMessage = "이름을 적어주세요.";
        return;
      }
      if (!this.user.email) {
        this.finalMessage = "이메일을 적어주세요.";
        return;
      }
      if (!this.user.phonenumber) {
        this.finalMessage = "전화번호를 적어주세요.";
        return;
      }
<<<<<<< HEAD
      if (!this.user.nickname) {
        this.finalMessage = "닉네임을 적어주세요.";
        return;
      }
=======
>>>>>>> 268263e ([feat] join)
      if (!this.user.password) {
        this.finalMessage = "비밀번호를 적어주세요.";
        return;
      }
      if (!this.user.passwordCheck) {
        this.finalMessage = "비밀번호를 한번 더 입력해주세요";
        return;
      }
      if (this.user.password != this.user.passwordCheck) {
        this.finalMessage = "비밀번호가 다릅니다. 확인해주세요.";
        return;
      }
      const user = {
        uid: this.user.uid,
        username: this.user.username,
        email: this.user.email,
        phonenumber: this.user.phonenumber,
        password: this.user.password,
        nickname: this.user.nickname,
      };
      await join(user, ({ data }) => {
        if (data.message === "success") {
          this.$router.push({ name: "Join" });
        } else {
          this.finalMessage = "회원가입에 실패했습니다. 문의해주세요.";
        }
      });
<<<<<<< HEAD
=======
      await this.userConfirm(this.user);
      let token = sessionStorage.getItem("access-token");
      console.log("1. confirm() token >> " + token);
      if (this.isLogin) {
        await this.getUserInfo(token);
        console.log("4. confirm() userInfo :: ", this.userInfo);
        this.$router.push({ name: "home" });
      }
>>>>>>> 268263e ([feat] join)
    },
    movePage() {
      this.$router.push({ name: "Join" });
    },
    async idCheckFunc() {
      if (!this.user.uid) {
        this.message = "아이디를 입력해주세요.";
      } else {
        await idCheck(this.user.uid, ({ data }) => {
          if (data.message === "success") {
            if (data.result === 0) {
              // 중복이 없다
              this.message = "사용 가능한 아이디입니다.";
              this.isIdChecked = true;
            } else {
              // 중복이 있다.
              this.isIdChecked = false;
              this.message = "사용 중인 아이디입니다. 다시 입력해주세요.";
            }
          } else {
            this.message = "오류가 있습니다.";
          }
        });
      }
    },
  },
};
</script>

<style lang="scss">
.checked {
  background-color: green;
}
</style>
