<template>
  <v-row class="d-flex justify-center align-center fill-height" style="min-height: 100vh">
    <v-col cols="12" md="6">
      <v-card class="py-6">
        <v-card-title class="d-flex justify-center">
          <div class="text-h4">
            Login
          </div>
        </v-card-title>
        <v-form>
          <v-card-text>
            <v-text-field
                id="id"
                label="ID"
                name="id"
                v-model="user.userid"
                @keyup.enter="confirm"
                prepend-inner-icon="mdi-account"
                outlined
            ></v-text-field>
            <v-text-field
                type="password"
                id="password"
                label="Password"
                name="password"
                v-model="user.userpwd"
                @keyup.enter="confirm"
                prepend-inner-icon="mdi-lock"
                outlined
            ></v-text-field>
            <div class="text-right">
              <v-btn type="button" color="primary" class="mr-2" @click="confirm">
                Login
              </v-btn>
              <v-btn type="button" color="primary" class="mr-2" @click="userRegist">
                Regist
              </v-btn>
            </div>
          </v-card-text>
        </v-form> 
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

const memberStore = "memberStore";

export default {
  name: "UserLogin",
  data() {
    return {
      // isLoginError: false,
      user: {
        userid: null,
        userpwd: null,
      },
    };
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "isLoginError", "userInfo"]),
  },
  methods: {
    ...mapActions(memberStore, ["userConfirm", "getUserInfo"]),
    async confirm() {
      await this.userConfirm(this.user);
      let token = sessionStorage.getItem("access-token");
      // console.log("1. confirm() token >> " + token);
      if (this.isLogin) {
        await this.getUserInfo(token);
        // console.log("4. confirm() userInfo :: ", this.userInfo);
        this.$router.push({ name: "home" });
      }
    },
    userRegist() {
      this.$router.push({ name: "Regist" });
    },
  },
}
</script>
