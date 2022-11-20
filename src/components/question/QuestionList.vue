<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>1:1문의</h3></b-alert>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col class="text-right" v-if="userInfo.uid !== `admin`">
        <b-button variant="outline-primary" @click="moveWrite()">글쓰기</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table id="tbquestion" 
        striped 
        hover 
        :items="questions" 
        :per-page="perPage"
        :current-page="currentPage"
        :fields="fields" 
        align="center"
        @row-clicked="detailquestion"
        >
          <template #cell(subject)="data">
            <router-link :to="{ name: 'questionview', params: { qid: data.item.qid } }">
              {{ data.item.subject }}
            </router-link>
          </template>
        </b-table>
        <b-pagination
          v-model="currentPage"
          align="center"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="tbquestion"
        ></b-pagination>
        <p class="mt-3" align="center">현재페이지: {{ currentPage }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { listQuestion } from "@/api/question";
import { mapState } from "vuex";

const memberStore = "memberStore";

export default {
  name: "BoardList",
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      questions: [],
      fields: [
        { key: "qid", label: "글번호", tdClass: "tdClass" },
         { key: "uid", label: "작성자", tdClass: "tdClass" },
        { key: "subject", label: "제목", tdClass: "tdSubject" },
        { key: "regtime", label: "작성일", tdClass: "tdClass" },
      ],
    };
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
    rows() {
      return this.questions.length;
    },
  },
  created() {
    let param = {
      pg: 1,
      spp: 20,
      key: null,
      word: null,
    };
    listQuestion(
      param,
      ({ data }) => {
        this.questions = data;
      },
      (error) => {
        console.log(error);
      }
    );
  },
  methods: {
    moveWrite() {
      this.$router.push({ name: "questionwrite" });
    },
    detailquestion(question) {
      this.$router.push({
        name: "questionview",
        params: { qid: question.qid },
      });
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
