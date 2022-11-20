<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>문의글수정</h3></b-alert>
      </b-col>
    </b-row>
    <question-input-item type="modify" />
  </b-container>
</template>

<script>
import QuestionInputItem from "@/components/question/item/QuestionInputItem";

export default {
  name: "QuestionModify",
  components: {
    QuestionInputItem,
  },
};
</script>

<style></style>
