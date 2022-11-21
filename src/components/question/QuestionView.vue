<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>문의 글보기</h3></b-alert>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col class="text-left">
        <b-button variant="outline-primary" @click="moveList">목록</b-button>
      </b-col>
      <b-col class="text-right">
        <b-button variant="outline-info" size="sm" @click="moveModifyQuestion" class="mr-2"  v-if="userInfo.uid === question.uid">글수정</b-button>
        <b-button variant="outline-info" size="sm" @click="writeanswer" class="mr-2"  v-if="userInfo.uid === `admin`">답변작성</b-button>
        <b-button variant="outline-danger" size="sm" @click="deletequestion">글삭제</b-button>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col>
        <b-card
          :header-html="`<h3>${question.qid}.
          ${question.subject} </h3><div><h6>${question.uid}</div><div>${question.regtime}</h6></div>`"
          class="mb-2"
          border-variant="dark"
          no-body
        >
          <b-card-body class="text-left">
            <div v-html="message"></div>
          </b-card-body>
        </b-card>
        <b-card
        :header-html="`<h2>answer</h2>`"
        >
          <b-card-body>
            <div v-html="answer"></div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import moment from "moment";
import { questionDetail } from "@/api/question";
import { mapState } from "vuex";

const memberStore = "memberStore";

export default {
  name: "BoardDetail",
  data() {
    return {
      question: {},
    };
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
    message() {
      if (this.question.content) return this.question.content.split("\n").join("<br>");
      return "";
    },
    answer() {
      if (this.question.answer) return this.question.answer.split("\n").join("<br>");
      else return "답변이 곧 달릴 예정입니다."
    },
  },
  created() {
    let param = this.$route.params.qid;
    questionDetail(
      param,
      ({ data }) => {
        this.question = data;
      },
      (error) => {
        console.log(error);
      }
    );
  },
  methods: {
    moveModifyQuestion() {
      this.$router.replace({
        name: "questionmodify",
        params: { qid: this.question.qid },
      });
    },
    writeanswer() {
      this.$router.replace({
        name: "writeanswer",
        params: { qid: this.question.qid },
      });
    },
    deletequestion() {
      if (confirm("정말로 삭제?")) {
        this.$router.replace({
          name: "questiondelete",
          params: { qid: this.question.qid },
        });
      }
    },
    moveList() {
      this.$router.push({ name: "questionlist" });
    },
  },
  // filters: {
  //   dateFormat(regtime) {
  //     return moment(new Date(regtime)).format("YY.MM.DD hh:mm:ss");
  //   },
  // },
};
</script>

<style></style>
