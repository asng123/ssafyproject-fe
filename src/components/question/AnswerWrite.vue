<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>답변작성</h3></b-alert>
      </b-col>
    </b-row>
    <question-input-item type="answer" />
  </b-container>
</template>

<script>
import QuestionInputItem from "@/components/question/item/QuestionInputItem";

export default {
  name: "AnswerWrite",
  components: {
    QuestionInputItem,
  },
};
</script>

<style></style>
