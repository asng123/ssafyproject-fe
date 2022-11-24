<template>
  <div class="zip_side_container">
    <div class="zip_side">
      <div class="zip_side_header">
        <div class="zip_info">
          <div class="zip_address">{{ sideData.address }}</div>
          <div class="zip_apartment_name">{{ sideData.aptname }}</div>
        </div>
        <button class="zip_cancle_btn" @click.prevent="clickBtn">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
      </div>
      <div class="zip_list_container">
        <zip-thumbnail
          v-for="(zip, index) in sideData.zips"
          :key="index"
          :zid="zip.zid"
          :address="zip.address"
          :aptname="zip.aptname"
          :summary="zip.summary"
          :content="zip.content"
          :price="zip.price"
          :idx="zip.pidx"
          :regcode="zip.regcode"
        >
        </zip-thumbnail>
      </div>
    </div>
  </div>
</template>

<script>
import ZipThumbnail from "../zip/items/ZipThumbnail.vue";
export default {
  name: "ZipSide",
  components: {
    ZipThumbnail,
  },
  props: {
    sideData: Object,
  },
  data() {
    return {};
  },
  created() {
    console.log(sideData.zips);
  },
  methods: {
    clickBtn() {
      this.$emit("clickSide");
    },
  },
};
</script>

<style lang="scss">
.zip_side_container {
  position: absolute;
  width: 30%;
  min-width: 300px;
  height: 92vh;
  z-index: 50;
  background: white;
  box-shadow: 3px 3px 3px #00000050;
  border-radius: 10px;
  overflow: scroll;
  scrollbar-width: none; /* Firefox */
}
.zip_side_container::-webkit-scrollbar {
  display: none;
}
.zip_side {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
}
.zip_side .zip_side_header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px;
}
.zip_side .zip_side_header .zip_info {
}
.zip_side .zip_side_header .zip_info .zip_address {
  font-size: 15px;
}
.zip_side .zip_side_header .zip_info .zip_apartment_name {
  font-size: 20px;
}
.zip_side .zip_side_header .zip_cancle_btn {
  width: 30px;
  height: 30px;
  background: 0;
  border: 0;
}
.zip_side .zip_list_container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
</style>
