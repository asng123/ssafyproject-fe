<template>
  <div id="main">
    <div id="section">
      <div class="container" id="main_container">
        <div>{{ main.content }}</div>
        <div>{{ main.aptname }}</div>
        <div>{{ main.address }}</div>
        <div>{{ main.price }}</div>
      </div>
      <div
        class="container block_container"
        v-for="(block, index) in blocks"
        :key="index"
      >
        <div>{{ block.type }}</div>
        <div>
          {{ block.place }}
        </div>
        <div>{{ block.blockcontent }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetailZip } from "@/api/zip";
export default {
  name: "ZipDetail",
  data() {
    return {
      zid: "",
      main: {},
      blocks: [],
    };
  },
  created() {
    this.zid = this.$route.params.zid;
    this.init();
  },
  methods: {
    async init() {
      await getDetailZip(this.zid).then(({ data }) => {
        console.log(data.zips);
        const first = data.zips[0];
        this.main = {
          address: first.address,
          aptname: first.aptname,
          content: first.content,
          lat: first.lat,
          lng: first.lng,
          price: first.price,
          regtime: first.regtime,
          uid: first.uid,
          regcode: first.regcode,
        };
        console.log(this.main);
        this.blocks = data.zips.reduce(
          (cur, { order, place, type, blockcontent }) => {
            return [
              ...cur,
              {
                order,
                place,
                type,
                blockcontent,
              },
            ];
          },
          []
        );

        console.log(this.blocks);
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
</style>
