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
      <div id="current">{{ currentAddress }}</div>
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
      currentAddress: "",
      searchValue: "",
      marker: null,
      mapTypeControl: null,
      zoomControl: null,
      regCode: "11140",
      currentPrevAddress: "",
      dong: "",
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
        level: 4,
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
      // 부가
      this.addDragEventControl(); // 드래그 이벤트 등록
      this.getCenter(); // 중앙 위치 장소 가져오기
      this.map.relayout();
      this.map.setCenter(
        new kakao.maps.LatLng(this.current.lat, this.current.lng)
      );
    },
    getCenter() {
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
            this.currentAddress = result[i].address_name;
            const temp = this.currentAddress.split(" ");
            this.currentPrevAddress = `${temp[0]} ${temp[1]}`;
            this.dong = temp[2];
            console.log(result[i].code);
            this.regCode = result[i].code;

            break;
          }
        }
        console.log("sc", this.regCode);
        this.findHouseDealInfo();
      } else {
        this.currentAddress = "실패";
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
      console.log("prevAddress", this.currentPrevAddress);
      // this.convertToLatLng("서울특별시 중구 태평로1가 146-1 삼풍");
      await getHouseInfo(this.regCode.substr(0, 5), "202007").then(
        ({ data }) => {
          console.log(data.response.body.items.item);
          data.response.body.items.item.forEach(({ 지번, 법정동, 아파트 }) => {
            console.log(지번, 법정동, 아파트);
            지번 = 지번 ? 지번 : " ";
            법정동 = 법정동.trim();
            아파트 = 아파트.trim();
            if (법정동 === this.dong) {
              const place = this.convertToLatLng(
                `${this.currentPrevAddress} ${법정동} ${지번} ${아파트}`,`${아파트}`
              );
            }
          });
        }
      );
    },
    convertToLatLng(address, apartname) {
      console.log("ctl", address);
      this.geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          console.log(coords); // 변환된 자표
          
          // 결과값으로 받은 위치를 마커로 표시합니다
          // var marker = new kakao.maps.Marker({
          //   map: this.map,
          //   position: coords,
          //   // image: markerImage,
          // });

          var content = '<div class="customoverlay">' +
                      '  <a href="https://map.kakao.com/link/map/11394059" target="_blank">' +
                      `    <span class="title"> ${apartname} </span>` +
                      '  </a>' +
                      '</div>';
          var customOverlay = new kakao.maps.CustomOverlay({
            map: this.map,
            position: coords,
            content: content,
            yAnchor: 1 
          });

          customOverlay.setMap(this.map);
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        } else {
          console.log("not okay");
        }
      });
    },
    async findRegCode() {
      const temp = this.currentAddress.split(" ");
      console.log(temp, this.currentAddress);
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

<style>
.customoverlay {position:relative;bottom:85px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;}
.customoverlay:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}
.customoverlay a {display:block;text-decoration:none;color:#000;text-align:center;border-radius:6px;font-size:14px;font-weight:bold;overflow:hidden;background: #d95050;background: #d95050 url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat right 14px center;}
.customoverlay .title {display:block;text-align:center;background:#fff;margin-right:35px;padding:10px 15px;font-size:14px;font-weight:bold;}
.customoverlay:after {content:'';position:absolute;margin-left:-12px;left:50%;bottom:-12px;width:22px;height:12px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')}
</style>
