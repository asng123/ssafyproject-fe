<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show id="top"><h3>공지사항</h3></b-alert>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col class="text-right" v-if="userInfo.uid === `admin`">
        <b-button variant="outline-primary" @click="moveWrite()"
          >글쓰기</b-button
        >
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          id="tbarticle"
          hover
          :items="articles"
          :per-page="perPage"
          :current-page="currentPage"
          :fields="fields"
          align="center"
          @row-clicked="viewArticle"
        >
          <template #cell(subject)="data">
            <router-link
              :to="{ name: 'boardview', params: { bid: data.item.bid } }"
            >
              {{ data.item.subject }}
            </router-link>
          </template>
        </b-table>
        <b-pagination
          v-model="currentPage"
          align="center"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="tbarticle"
        ></b-pagination>
        <p class="mt-3" align="center">현재페이지: {{ currentPage }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { listArticle } from "@/api/board";
import { mapState } from "vuex";

const memberStore = "memberStore";

export default {
  name: "BoardList",
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      articles: [],
      fields: [
        { key: "bid", label: "글번호", tdClass: "tdClass" },
        { key: "subject", label: "제목", tdClass: "tdSubject" },
        { key: "regtime", label: "작성일", tdClass: "tdClass" },
        { key: "hit", label: "조회수", tdClass: "tdClass" },
      ],
    };
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
    rows() {
      return this.articles.length;
    },
  },
  created() {
    console.log(this.userInfo.uid);
    let param = {
      pg: 1,
      spp: 20,
      key: null,
      word: null,
    };
    listArticle(
      param,
      ({ data }) => {
        this.articles = data;
      },
      (error) => {
        console.log(error);
      }
    );
  },
  methods: {
    moveWrite() {
      this.$router.push({ name: "boardwrite" });
    },
    viewArticle(article) {
      this.$router.push({
        name: "boardview",
        params: { bid: article.bid },
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
#top {
  background: white;
}
</style>
