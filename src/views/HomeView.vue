<template>
  <div id="main" :class="{ usual: isFocus, intro: !isFocus }">
    <div id="search_bar" :class="{ focus: isFocus === true }">
      <form action="">
        <b-form-input
          id="search"
          v-model="searchValue"
          @focus="focused"
          autocomplete="off"
        ></b-form-input>
        <button id="submit_btn" @click.prevent="getSearchResult">
          <font-awesome-icon
            id="submit_btn_icon"
            icon="fa-solid fa-magnifying-glass"
          />
        </button>
      </form>
    </div>
    <div id="map_div" v-show="isFocus">
      <div id="current">{{ currentName }}</div>
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getMapInfo, getHouseInfo } from "@/api/map";

export default {
  name: "Home",
  components: {
    SearchSection: () => import("@/components/common/searchBar.vue"),
  },
  data() {
    return {
      isFocus: false,
      prevRoute: null,
      current: { lat: 37.56666, lng: 126.978 },
      map: null,
      ps: null,
      geocoder: null,
      currentName: "",
      searchValue: "",
      marker: null,
      mapTypeControl: null,
      zoomControl: null,
      sidoRegCode: [],
      regCode: "11140",
    };
  },
  async created() {},
  components: {
    siderbar: () => import("@/components/details/sidebar"),
  },
  methods: {
    focused() {
      if (!this.isFocus) {
        this.isFocus = true; // kakao map 초기화
        this.initMap();
        // this.findRegCode();
      } else {
      }
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
      const mapContainer = document.querySelector("#map");
      console.log(mapContainer);
      const mapOption = {
        center: new kakao.maps.LatLng(this.current.lat, this.current.lng),
        level: 3,
      };
      // 필요한 객체 할당
      this.map = new kakao.maps.Map(mapContainer, mapOption);
      console.log("init", this.map);
      this.geocoder = new kakao.maps.services.Geocoder();
      this.ps = new kakao.maps.services.Places();
      this.mapTypeControl = new kakao.maps.MapTypeControl();
      this.map.addControl(
        this.mapTypeControl,
        kakao.maps.ControlPosition.TOPRIGHT
      );
      this.zoomControl = new kakao.maps.ZoomControl();
      this.map.addControl(this.zoomControl, kakao.maps.ControlPosition.RIGHT);
      this.map.relayout();
      this.map.setCenter(
        new kakao.maps.LatLng(this.current.lat, this.current.lng)
      );
      // 부가
      this.addDragEventControl(); // 드래그 이벤트 등록
      this.setCenter(); // 중앙 위치 장소 가져오기
    },
    setCenter() {
      this.searchAddrFromCoords(this.current, this.getAddressFromRes); // 중앙 정보의 이름, regcode 받아오기
    },
    addDragEventControl() {
      kakao.maps.event.addListener(this.map, "dragend", () => {
        // 지도 중심좌표를 얻어옵니다
        console.log("drag", this.map);
        const latlng = this.map.getCenter();

        this.current.lat = latlng.getLat();
        this.current.lng = latlng.getLng();
        this.searchAddrFromCoords(this.current, this.getAddressFromRes);
      });
    },
    searchAddrFromCoords(coords, callback) {
      console.log(coords);
      // 좌표로 행정동 주소 정보를 요청합니다
      this.geocoder.coord2RegionCode(coords.lng, coords.lat, callback);
    },
    getAddressFromRes(result, status) {
      // 주소 정보 파싱
      console.log(this.map);
      if (status === kakao.maps.services.Status.OK) {
        for (var i = 0; i < result.length; i++) {
          // 법정동 region_type 값은 'B' 이므로
          console.log("result address", result);
          if (result[i].region_type === "B") {
            this.currentName = result[i].address_name;
            console.log(result[i].code);
            this.regCode = result[i].code;
            break;
          }
        }
        console.log("sc", this.regCode);
        this.findHouseDealInfo();
      } else {
        this.currentName = "실패";
      }
    },
    getSearchResult() {
      console.log("search", this.searchValue);
      if (this.marker) this.marker.setMap(null);
      this.ps.keywordSearch(this.searchValue, this.placesSearchCB);
    },
    placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        console.log("s", data);
        var bounds = new kakao.maps.LatLngBounds();

        bounds.extend(new kakao.maps.LatLng(data[0].y, data[0].x));
        this.current.lng = data[0].x;
        this.current.lat = data[0].y;
        this.searchAddrFromCoords(this.current, this.getAddressFromRes);

        this.displayMarker(data[0]);
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        this.map.setBounds(bounds);
      } else {
        alert("검색 결과가 없습니다.");
      }
    },
    displayMarker(place) {
      // 마커를 생성하고 지도에 표시합니다
      this.marker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });
    },
    async findHouseDealInfo() {
      // 주택 거래 정보 가져오기
      console.log("find house deal info", this.regCode);
      await getHouseInfo(this.regCode.substr(0, 5), "202007").then(
        ({ data }) => {
          console.log(data);
          console.log(data.response.body.items.item);

          let parser = new DOMParser();
          const xml = parser.parseFromString(data, "application/xml");
          console.log(xml);
          let apts = xml.querySelectorAll("item");
          console.log(apts);
        }
      );
    },
    async findRegCode() {
      const temp = this.currentName.split(" ");
      console.log(temp, this.currentName);
      await getMapInfo("11140*").then((result) => {
        this.regcodes = result.data.regcodes;
        console.log("rg", this.regcodes);
      });
    },
  },
  mounted() {},
  watch: {
    current: function (newCurrent) {
      console.log("watch");
      this.searchAddrFromCoords(this.current, this.getAddressFromRes);
    },
    deep: true,
  },
};
</script>
<style lang="scss">
#main {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  margin: 0;

  display: flex;
  justify-content: center;

  position: absolute;
}
@keyframes searchUp {
  from {
    top: 50vh;
  }
  to {
    top: 12vh;
  }
}
.intro {
  display: flex;
  align-items: center;
  margin-top: 0;
  background-image: url("https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80");
}
.focus {
  top: 12vh;
  animation: searchUp 2s;
}
#search_bar {
  width: 40%;
  height: 5vh;
  z-index: 100;
  position: absolute;
  overflow-y: auto;
}
#search_bar form {
  display: flex;
  justify-content: space-between;
}
#search_bar form #search {
  height: 5vh;
  width: 80%;
  border-radius: 10px 0 0 10px;
}
#search_bar form #search:focus {
  border: 0;
}
#search_bar form #submit_btn {
  width: 20%;
  border-style: none;
  background: black;
  border-radius: 0 10px 10px 0;
}
#search_bar form #submit_btn #submit_btn_icon {
  color: $main;
}
#map_div {
  width: 100vw;
  height: 100vh;
}
#map_div #map {
  width: 100vw;
  height: 100vh;
}
#current {
  position: absolute;
  width: 100px;
  height: 80px;
  z-index: 100;
  background: #00000050;
}
.button-group {
  margin: 10px 0px;
  z-index: 50;
}
</style>
