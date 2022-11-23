<template>
  <div id="main">
    <div id="section">
      <div class="container" id="hottest_container">
        <div class="title">🔥 지금 가장 핫한 내집 🔥</div>
        <div v-show="hottestZipsList.length === 0">{{ hottest_message }}</div>
        <div class="thumbs_container">
          <zip-thumbnail
            v-for="(zip, index) in hottestZipsList"
            :key="index"
            :zid="zip.zid"
            :address="zip.address"
            :aptname="zip.aptname"
            :content="zip.content"
            :price="zip.price"
            :regcode="zip.regcode"
          >
          </zip-thumbnail>
        </div>
      </div>
      <div class="container" id="latest_container">최신순</div>
    </div>
  </div>
</template>

<script>
import { getAllList } from "@/api/zip";
import ZipThumbnail from "@/components/zip/items/ZipThumbnail";

export default {
  name: "ZipList",
  data() {
    return {
      hottest_message: "글이 아직 없어요!",
      hottestZipsList: [{}],
    };
  },
  components: {
    ZipThumbnail,
  },
  created() {
    this.initHottestList();
  },
  methods: {
    async initHottestList() {
      await getAllList()
        .then(({ data }) => {
          if (data.message == "success") {
            this.hottestZipsList = data.zips;
            console.log(this.hottestZipsList);
          } else {
            this.hottest_message = "불러오는데 에러가 있어요.";
          }
        })
        .catch((e) => {
          console.log(
            (this.hottest_message =
              "불러오는데 서버에 에러가 있어요. 문의 부탁드립니다!")
          );
        });
    },
  },
};
</script>

<style>
#main {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 70px;
}
.title {
  font-size: 30px;
}
#section {
  width: 80%;
  min-width: 450px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.container {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  gap: 30px;
}
.thumbs_container {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>
