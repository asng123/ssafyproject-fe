<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>글작성</h3></b-alert>
      </b-col>
    </b-row>
    <question-input-item type="register" />
  </b-container>
</template>

<script>
import QuestionInputItem from "@/components/question/item/QuestionInputItem";

export default {
  name: "QuestionWrite",
  components: {
    QuestionInputItem,
  },
};
</script>

<style></style>
