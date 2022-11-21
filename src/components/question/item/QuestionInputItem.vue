<template>
  <b-row class="mb-1">
    <b-col style="text-align: left">
      <b-form @submit="onSubmit" @reset="onReset">
      
        <b-form-group id="subject-group" label="제목:" label-for="subject" description="제목을 입력하세요.">
          <b-form-input
            id="subject"
            v-model="question.subject"
            type="text"
            required
            placeholder="제목 입력..."
          ></b-form-input>
        </b-form-group>

        <b-form-group id="content-group" label="내용:" label-for="content">
          <b-form-textarea
            id="content"
            v-model="question.content"
            placeholder="내용 입력..."
            rows="10"
            max-rows="15"
          ></b-form-textarea>
        </b-form-group>
        
        <b-form-group id="content-group" label="답변:" label-for="answer" v-if="this.type === 'answer'">
          <b-form-textarea
            id="answer"
            v-model="question.answer"
            placeholder="답변 입력..."
            rows="10"
            max-rows="15"
          ></b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary" class="m-1" v-if="this.type === 'register'">글작성</b-button>
        <b-button type="submit" variant="primary" class="m-1" v-if="this.type === 'modify'">글수정</b-button>
        <b-button type="submit" variant="primary" class="m-1" v-if="this.type === 'answer'">답변작성</b-button>
        <b-button type="reset" variant="danger" class="m-1">초기화</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
import { writeQuestion, questionDetail, updateQnA, writeAnswer } from "@/api/question";
import { mapState } from "vuex";

const memberStore = "memberStore";
export default {
  name: "QuestionInputItem",
  data() {
    return {
      question: {
        qid: 0,
        subject: "",
        content: "",
        answer: "",
      },
      isUserid: false,
    };
  },
  props: {
    type: { type: String },
  },
  created() {
    if (this.type === "modify" || this.type === "answer") {
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
      this.isUserid = true;
    }
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      let err = true;
      let msg = "";
      err && !this.question.subject && ((msg = "제목 입력해주세요"), (err = false), this.$refs.subject.focus());
      err && !this.question.content && ((msg = "내용 입력해주세요"), (err = false), this.$refs.content.focus());

      if (!err) alert(msg);
      else if (this.type === "register") this.writequestion(); 
      else if(this.type === "modify") this.updateqna();
      else if(this.type === "answer") this.writeanswer();
    },
    onReset(event) {
      event.preventDefault();
      this.question.qid = 0;
      this.question.subject = "";
      this.question.content = "";
      this.moveList();
    },
    writequestion() {
      let param = {
        uid: this.userInfo.uid,
        subject: this.question.subject,
        content: this.question.content,
      };
      writeQuestion(
        param,
        ({ data }) => {
          let msg = "등록 처리시 문제가 발생했습니다.";
          if (data === "success") {
            msg = "등록이 완료되었습니다.";
          }
          alert(msg);
          this.moveList();
        },
        (error) => {
          console.log(error);
        }
      );
    },
    writeanswer() {
      let param = {
        qid: this.question.qid,
        answer: this.question.answer,
      };
      writeAnswer(
        param,
        ({ data }) => {
          let msg = "등록 처리시 문제가 발생했습니다.";
          if (data === "success") {
            msg = "등록이 완료되었습니다.";
          }
          alert(msg);
          this.moveList();
        },
        (error) => {
          console.log(error);
        }
      );
    },
    updateqna() {
      let param = {
        qid: this.question.qid,
        subject: this.question.subject,
        content: this.question.content,
      };
      updateQnA(
        param,
        ({ data }) => {
          let msg = "수정 처리시 문제가 발생했습니다.";
          if (data === "success") {
            msg = "수정이 완료되었습니다.";
          }
          alert(msg);
          // 현재 route를 /list로 변경.
          this.moveList();
        },
        (error) => {
          console.log(error);
        }
      );
    },
    moveList() {
      this.$router.push({ name: "questionlist" });
    },
  },
};
</script>

<style></style>
