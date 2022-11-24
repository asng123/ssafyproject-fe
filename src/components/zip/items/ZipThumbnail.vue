<template>
  <div class="thumbnail" @click="handleThumbnail">
    <div class="img_container">
      <img
        :id="'image' + index"
        alt="이미지가 없습니다"
        class="thumb_img"
        :src="imageUrl"
      />

      <!-- <div class="roadview">
        <road-view :lat="lat" :lng="lng" :index="index"></road-view>
      </div> -->
    </div>
    <div class="intro_container">
      <div class="info_section">
        <div class="intro_content">{{ summary }}</div>
        <div class="intro_aptname">{{ aptname }}</div>
      </div>
      <div class="price_section">
        <div class="price">{{ price }}만원</div>
      </div>
    </div>
  </div>
</template>

<script>
import RoadView from "@/components/roadview/RoadView.vue";
import { getImageUrl } from "@/api/zip";

export default {
  name: "ZipThumbnail",
  props: {
    zid: String,
    address: String,
    aptname: String,
    summary: String,
    content: String,
    price: Number,
    regcode: String,
    index: String,
    lat: String,
    lng: String,
    idx: String,
  },
  data() {
    return {
      imageUrl: "https://search2.kakaocdn.net/argon/0x200_85_hr/1pLKMrJqZgP",
    };
  },
  components: {
    RoadView,
  },
  created() {
    this.getImage();
  },
  mounted() {},
  methods: {
    handleThumbnail() {
      this.$router.push({ name: "zipdetailview", params: { zid: this.zid } });
    },
    async getImage() {
      await getImageUrl(this.idx).then(({ data }) => {
        console.log(this.idx, data);
        this.imageUrl = data.imageurl.url;
        console.log(this.imageurl, data.imageurl.url);
      });
    },
  },
};
</script>

<style scoped>
.thumbnail {
  height: 300px;
  background: #f8f8f8;
  border-radius: 20px;
  overflow: hidden;
}
.thumbnail:hover {
  cursor: pointer;
  box-shadow: 0px 0px 45px -13px rgba(0, 0, 0, 0.25);
}
.img_container {
  height: 50%;
}
.roadview {
  width: 100%;
  height: 100%;
}
.img_container .thumb_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.intro_container {
  min-height: 50%;
  font-size: 13px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.intro_container .intro_content {
  font-size: 14px;
}
.intro_container .intro_aptname {
  width: 100%;
  font-size: 20px;
}
.img_container .price_section {
}
.intro_container .price_section .price {
  color: #575757;
  float: right;
}
</style>
