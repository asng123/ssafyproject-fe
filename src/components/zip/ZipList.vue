<template>
  <div id="main">
    <div id="section">
      <div class="container" id="hottest_container">
        <div class="title">🔥 지금 가장 핫한 내집 🔥</div>
        <div v-show="hottestZipList.length === 0">{{ message }}</div>
        <div class="thumbs_container">
          <zip-thumbnail
            v-for="(zip, index) in hottestZipList"
            :key="index"
            :zid="zip.zid"
            :address="zip.address"
            :aptname="zip.aptname"
            :summary="zip.summary"
            :content="zip.content"
            :price="zip.price"
            :regcode="zip.regcode"
            :lat="zip.lat"
            :lng="zip.lng"
            :index="zip.zid"
            :idx="zip.pidx"
          >
          </zip-thumbnail>
        </div>
      </div>
      <div class="container" id="latest_container">
        <div class="title">⏱ 방금 올라온 내집 ⏱</div>
        <div v-show="latestZipList.length === 0">{{ message }}</div>
        <div class="thumbs_container">
          <zip-thumbnail
            v-for="(zip, index) in latestZipList"
            :key="index"
            :zid="zip.zid"
            :address="zip.address"
            :aptname="zip.aptname"
            :summary="zip.summary"
            :content="zip.content"
            :price="zip.price"
            :regcode="zip.regcode"
            :lat="zip.lat"
            :lng="zip.lng"
            :index="zip.zid"
            :idx="zip.pidx"
          >
          </zip-thumbnail>
        </div>
      </div>
      <div class="container" id="more_container">
        <a id="go_all" href="/zip/all">👀 더보기</a>
      </div>
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
      message: "글이 아직 없어요!",
      allZipList: [],
      hottestZipList: [{}],
      latestZipList: [],
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
            console.log(data.zips);
            this.allZipList = data.zips;
            console.log(this.allZipList);
            this.hottestZipList = data.zips
              .sort((a, b) => b.hit - a.hit)
              .splice(0, 4);
            this.latestZipList = data.zips
              .sort((a, b) => a.regtime - b.regtime)
              .splice(0, 4);
          } else {
            this.message = "불러오는데 에러가 있어요.";
          }
        })
        .catch((e) => {
          console.log(
            (this.message =
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
#more_container {
  width: 100%;
  font-size: 25px;
}
#more_container #go_all {
  text-align: right;
}
</style>
