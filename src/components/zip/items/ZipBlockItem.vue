<template>
  <div class="db_container">
    <div class="b_divided left">
      <div class="intro_container">#{{ blocksummary }}, {{ type }}</div>
      <div class="place_container">
        {{ place }}
      </div>
      <div class="content_container">{{ blockcontent }}</div>
    </div>
    <div class="b_divided right">
      <div class="roadview" :id="'roadview' + index" v-show="hasRoadView"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ZipBlockItem",
  props: {
    type: String,
    place: String,
    blocksummary: String,
    blockcontent: String,
    index: Number,
    lat: String,
    lng: String,
  },
  data() {
    return {
      roadviewClient: null,
      hasRoadView: false,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
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
      const roadviewContainer = document.getElementById(
        `roadview${this.index}`
      ); //로드뷰를 표시할 div
      const roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
      this.roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

      const position = new kakao.maps.LatLng(
        Number(this.lat),
        Number(this.lng)
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

<style scoped>
.roadview {
  width: 100%;
  height: 100%;
}
.db_container {
  width: 100%;
  height: 300px;
  display: flex;
  gap: 20px;
}
.left {
  width: 70%;
  height: 100%;
}
.right {
  width: 30%;
  height: 100%;
}
.intro_container {
  font-size: 30px;
}
.place_container {
  font-size: 40px;
}
.content_container {
  font-size: 15px;
}
</style>
