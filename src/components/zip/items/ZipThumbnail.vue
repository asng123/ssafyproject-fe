<template>
  <div class="thumbnail" @click="handleThumbnail">
    <div class="img_container">
      <img
        src="https://dynaimage.cdn.cnn.com/cnn/q_auto,w_412,c_fill,g_auto,h_412,ar_1:1/http%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F201231114619-01-oz-ourdomain-student-housing.jpg"
        alt=""
        class="thumb_img"
      />
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
  },
  created() {},
  methods: {
    handleThumbnail() {
      this.$router.push({ name: "zipdetailview", params: { zid: this.zid } });
    },
  },
};
</script>

<style scoped>
.thumbnail {
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
