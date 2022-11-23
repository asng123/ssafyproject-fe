<template>
  <div id="main">
    <div id="section">
      <div class="d_container" id="main_container">
        <div class="divided" id="left" v-show="hasRoadView">
          <div class="roadview" id="main_roadview"></div>
        </div>
        <div class="divided" id="right">
          <div id="things">
            <div id="main_content">{{ main.summary }}</div>
            <div id="main_aptname">{{ main.aptname }}</div>
            <div id="main_address">{{ main.address }}</div>
          </div>
          <div id="main_price">{{ main.price }}만원</div>
        </div>
      </div>
      <div id="content_container">{{ main.content }}</div>
      <div id="block_container" v-if="blocks.length != 0">
        <zip-block-item
          v-for="(block, index) in blocks"
          :key="index"
          :place="block.place"
          :type="block.type"
          :blockcontent="block.blockcontent"
          :blocksummary="block.blocksummary"
          :index="index"
          :lat="block.blocklat"
          :lng="block.blocklng"
        ></zip-block-item>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetailZip } from "@/api/zip";
import ZipBlockItem from "./items/ZipBlockItem.vue";
export default {
  components: { ZipBlockItem },
  name: "ZipDetail",
  data() {
    return {
      zid: "",
      main: {},
      blocks: [],
      roadviewClient: null,
      hasRoadView: false,
    };
  },
  components: {
    ZipBlockItem,
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
          summary: first.summary,
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
          (
            cur,
            {
              order,
              place,
              type,
              blockcontent,
              blocksummary,
              blocklat,
              blocklng,
            }
          ) => {
            if (place === null) return cur;
            return [
              ...cur,
              {
                order,
                place,
                type,
                blockcontent,
                blocksummary,
                blocklat,
                blocklng,
              },
            ];
          },
          []
        );

        console.log(this.blocks);
        this.initMap();
      });
    },
    initMap() {
      if (window.kakao && window.kakao.maps) {
        this.makeMap();
      } else {
        // kakao map 초기화
        const script = document.createElement("script");
        script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAO_MAP_KEY}&libraries=services`;
        document.head.appendChild(script);
        script.onload = () => kakao.maps.load(this.initMap);
      }
    },
    makeMap() {
      const roadviewContainer = document.getElementById("main_roadview"); //로드뷰를 표시할 div
      const roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
      this.roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

      const position = new kakao.maps.LatLng(
        Number(this.main.lat),
        Number(this.main.lng)
      );

      // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
      this.roadviewClient.getNearestPanoId(position, 100, (panoId) => {
        console.log("pi", panoId);
        if (panoId == null) {
          return;
        }
        this.hasRoadView = true;
        roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
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
.d_container {
  width: 100%;
  display: flex;
  gap: 20px;
}
#main_container {
  height: 400px;
}
#block_container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.divided {
  width: 50%;
}
#right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.roadview {
  width: 100%;
  height: 100%;
}
#main_intro {
  display: flex;
}
#main_content {
  font-size: 40px;
}
#main_aptname {
  font-size: 50px;
}
#main_address {
  font-size: 35px;
}
#main_price {
  font-size: 25px;
}
#content_container {
  font-size: 15px;
}
</style>
