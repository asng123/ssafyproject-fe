<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>회원 목록</h3></b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table id="tbuser" 
        striped 
        hover 
        :items="users" 
        :per-page="perPage"
        :current-page="currentPage"
        :fields="fields" 
        >
        <template #cell(actions)="data">
          <b-button size="sm" @click="DelMember(data.item.uid)" class="mr-1">
            delete
          </b-button>
        </template>
        </b-table>
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          align="center"
          aria-controls="tbuser"
        ></b-pagination>
        <p class="mt-3" align="center">현재페이지: {{ currentPage }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { userlist, del } from "@/api/member";

export default {
  name: "UserList",
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      users: [],
      fields: [
        { key: "uid", label: "아이디", tdClass: "tdClass" },
        { key: "username", label: "이름", tdClass: "tdClass" },
        { key: "email", label: "이메일", tdClass: "tdClass" },
        { key: "password", label: "비밀번호", tdClass: "tdClass" },
        { key: "nickname", label: "닉네임", tdClass: "tdClass" },
        { key: "joindate", label: "가입일", tdClass: "tdClass" },
        { key: "phonenumber", label: "전화번호", tdClass: "tdClass" },
        { key: 'actions', label: 'Delete' },
      ],
    };
  },
  computed: {
    rows() {
      return this.users.length;
    },
  },
  created() {
    userlist(
      ({ data }) => {
        this.users = data.users;
      },
      (error) => {
        console.log(error);
      }
    );
  },
  methods: {
    async DelMember(userid) {
      console.log(userid);
      await del(userid,({data})=>{
        if(data.message=="success"){
          userlist(
            ({ data }) => {
              this.users = data.users;
            },
          (error) => {
            console.log(error);
          }
    );
        }else{
          this.message ="회원 탈퇴에 실패했습니다. 다시 시도해주세요.";
        }
      })
    },
  },
};
</script>

<style scope>
.tdClass {
  width: 50px;
  text-align: center;
}
.tdSubject {
  width: 300px;
  text-align: left;
}
</style>
