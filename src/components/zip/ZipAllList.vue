<template>
  <div id="main">
    <div id="section">
      <div class="container" id="hottest_container">
        <div class="title">✅ 모두 확인해보세요.</div>
        <div v-show="allZipList.length === 0">{{ message }}</div>
        <div class="thumbs_container">
          <zip-thumbnail
            v-for="(zip, index) in allZipList"
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
    </div>
  </div>
</template>

<script>
import { getAllList } from "@/api/zip";
import ZipThumbnail from "@/components/zip/items/ZipThumbnail";
export default {
  name: "ZipAll",
  data() {
    return {
      message: "글이 아직 없어요!",
      allZipList: [],
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
