<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>1:1문의</h3></b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col><b-alert show variant="danger">삭제처리중...</b-alert></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { deleteQuestion } from "@/api/question";

export default {
  name: "QuestionDelete",
  created() {
    let param = this.$route.params.qid;
    deleteQuestion(
      param,
      ({ data }) => {
        let msg = "삭제 처리시 문제가 발생했습니다.";
        if (data === "success") {
          msg = "삭제가 완료되었습니다.";
        }
        alert(msg);
        // 현재 route를 /list로 변경.
        this.$router.push({ name: "questionlist" });
      },
      (error) => {
        console.log(error);
      }
    );
  },
};
</script>

<style></style>
