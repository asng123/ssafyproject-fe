<template>
  <div id="main" :class="{ usual: isFocus, intro: !isFocus }">
    <div
      id="search_bar"
      :class="{ focus: isFocus === true, go_right: isSideOpen }"
    >
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
      <div class="side_container" v-show="isSideOpen">
        <div class="side">
          <div id="side_header">
            <div id="info">
              <div id="address">하하하하</div>
              <div id="apartment_name">한강메트로자이 2단지</div>
            </div>
            <button id="cancle_btn" @click.prevent="clickSide">
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
          </div>
          <div id="roadview">
            <road-view :houseDetailInfos="houseDetailInfos"></road-view>
          </div>
          <div id="chart" v-if="isHouseDetailRendered">
            <trade-chart :houseDetailInfos="houseDetailInfos"></trade-chart>
          </div>
          <div>
            <b-table
              stacked
              :items="houseDetailInfos"
              hover
              :per-page="perPage"
              :current-page="currentPage"
            ></b-table>
            <b-pagination
              v-model="currentPage"
              align="center"
              pills
              :total-rows="rows"
              :per-page="perPage"
              size="sm"
            ></b-pagination>
          </div>
        </div>
      </div>
      <zip-side
        v-show="isHomeSideOpen"
        :sideData="sideData"
        @clickSide="clickSide"
      ></zip-side>
      <!-- <div id="current">{{ currentAddress }}</div> -->
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getMapInfo, getHouseInfos, getHouseDetailInfos } from "@/api/map";
import { getAllList, getAptZipList } from "@/api/zip";
import Side from "@/components/map/side.vue";
import ZipSide from "@/components/map/zipSide";
import TradeChart from "@/components/chart/TradeChart.vue";
import RoadView from "@/components/roadview/RoadView.vue";
import { set } from "vue";

export default {
  name: "HomeView",
  data() {
    return {
      perPage: 1,
      currentPage: 1,
      isFocus: false,
      prevRoute: null,
      current: { lat: 37.5, lng: 127.039 },
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
      isSideOpen: false,
      houseDetailInfos: [],
      isHouseDetailRendered: false,
      loadedRegion: new Set(),
      isHomeSideOpen: false,
      sideData: {
        address: "",
        aptName: "",
        zips: [],
      },
    };
  },
  computed: {
    rows() {
      return this.houseDetailInfos.length;
    },
  },
  async created() {},
  components: {
    TradeChart,
<<<<<<< HEAD
    RoadView,
=======
    ZipSide,
>>>>>>> 6514e31 ([feat] zip side에 데이터 불러오기)
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
        if (!this.loadedRegion.has(this.regCode)) {
          console.log("doesnt has ", this.regCode);
          this.loadedRegion.add(this.regCode);
          this.findHouseDealInfo();
          this.findnaezipInfo();
        } else {
          console.log("already has ", this.regCode);
        }
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
      await getHouseInfos(this.regCode).then(({ data }) => {
        // console.log(data.response.body.items.item);
        // data.response.body.items.item.forEach(({ 지번, 법정동, 아파트 }) => {
        //   console.log(지번, 법정동, 아파트);
        //   지번 = 지번 ? 지번 : " ";
        //   법정동 = 법정동.trim();
        //   아파트 = 아파트.trim();
        //   if (법정동 === this.dong) {
        //     const place = this.convertToLatLng(
        //       `${this.currentPrevAddress} ${법정동} ${지번} ${아파트}`,`${아파트}`
        //     );
        //   }
        // });
        console.log("res", data);
        data.forEach(({ aptName, jibun, lat, lng, dongCode }) => {
          aptName = aptName.trim();
          this.houseInfoMarker(aptName, jibun, lat, lng, dongCode);
        });
      });
      console.log("findHouseDealInfo finish");
    },
    async findnaezipInfo() {
      // 내집 소개 정보 가져오기

      await getAllList()
        .then(({ data }) => {
          console.log("naezip res", data);
          data.zips.forEach(({ aptname, lat, lng, regcode }) => {
            this.naezipInfoMarker(aptname, lat, lng, regcode);
          });
        })
        .catch((e) => {
          console.log(
            (this.hottest_message =
              "불러오는데 서버에 에러가 있어요. 문의 부탁드립니다!")
          );
        });

      console.log("findnaezipInfo finish");
    },
    naezipInfoMarker(aptname, lat, lng, regcode) {
      console.log("naezip", aptname, lat, lng, regcode);
      let coords = new kakao.maps.LatLng(lat, lng);
      var imageSrc = "https://cdn-icons-png.flaticon.com/512/5385/5385604.png", // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(35, 35), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(10, 30) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      var marker = new kakao.maps.Marker({
        map: this.map,
        position: coords,
        image: markerImage,
      });

      marker.setMap(this.map);
      // 마커에 표시할 인포윈도우를 생성합니다
      var infowindow = new kakao.maps.InfoWindow({
        content: `<div class="infowindow">${aptname}</div>`, // 인포윈도우에 표시할 내용
      });
      let $this = this;
      // 마커에 이벤트를 등록하는 함수 만들고 즉시 호출하여 클로저를 만듭니다
      // 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
      (function (marker, infowindow) {
        // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다
        kakao.maps.event.addListener(marker, "mouseover", function () {
          infowindow.open($this.map, marker);
        });

        // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
        kakao.maps.event.addListener(marker, "mouseout", function () {
          infowindow.close();
        });
      })(marker, infowindow);

      //마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "click", async (e) => {
        this.isHomeSideOpen = true;
        console.log("open");
        this.sideData = {
          address: this.currentAddress,
          aptName: aptname,
          zips: [],
        };
        document.querySelector("#address").innerHTML = this.currentAddress;
        document.querySelector("#apartment_name").innerHTML = aptname;
        await getAptZipList(regcode, aptname).then(({ data }) => {
          console.log("side", data.zips);
          this.sideData.zips = data.zips;
          console.log(this.sideData.zips);
        });
      });
    },
    houseInfoMarker(aptName, jibun, lat, lng, regcode) {
      console.log("ctl", aptName, jibun, lat, lng);
      let coords = new kakao.maps.LatLng(lat, lng);
      var imageSrc = "https://cdn-icons-png.flaticon.com/512/2213/2213900.png", // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(35, 35), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(10, 30) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      var marker = new kakao.maps.Marker({
        map: this.map,
        position: coords,
        image: markerImage,
      });

      marker.setMap(this.map);
      // 마커에 표시할 인포윈도우를 생성합니다
      var infowindow = new kakao.maps.InfoWindow({
        content: `<div class="infowindow">${aptName}</div>`, // 인포윈도우에 표시할 내용
      });
      let $this = this;
      // 마커에 이벤트를 등록하는 함수 만들고 즉시 호출하여 클로저를 만듭니다
      // 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
      (function (marker, infowindow) {
        // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다
        kakao.maps.event.addListener(marker, "mouseover", function () {
          infowindow.open($this.map, marker);
        });

        // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
        kakao.maps.event.addListener(marker, "mouseout", function () {
          infowindow.close();
        });
      })(marker, infowindow);

      // 마커에 클릭이벤트를 등록합니다
      // let regCode = this.regCode;
      kakao.maps.event.addListener(marker, "click", async (e) => {
        this.isSideOpen = true;
        document.querySelector("#address").innerHTML = this.currentAddress;
        document.querySelector("#apartment_name").innerHTML = aptName;
        await getHouseDetailInfos(regcode, aptName).then(({ data }) => {
          this.houseDetailInfos = data.reduce(
            (
              cur,
              {
                apartmentName,
                area,
                buildYear,
                dealAmount,
                dealDay,
                dealMonth,
                dealYear,
                floor,
                jibun,
                roadName,
                lat,
                lng,
              }
            ) => {
              return [
                ...cur,
                {
                  층: floor,
                  면적: area,
                  가격: `${dealAmount}원`,
                  "준공 년도": `${buildYear}년`,
                  거래일: `${dealYear}년 ${dealMonth}월 ${dealDay}일`,
                  위도: lat,
                  경도: lng,
                },
              ];
            },
            []
          );
          this.isHouseDetailRendered = true;
        });
      });
    },
    clickSide() {
      this.isSideOpen = false;
      this.isHomeSideOpen = false;
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
<style lang="scss" scoped>
#main {
  width: 100%;
  height: 92vh;
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
.go_right {
  right: 10vw;
  transition: right 1s;
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
.house_info_marker {
  cursor: pointer;
}
.side_container {
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
.side_container::-webkit-scrollbar {
  display: none;
}
.side {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.side #side_header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px;
}
.side #side_header #info {
}
.side #side_header #info #address {
  font-size: 15px;
}
.side #side_header #info #apartment_name {
  font-size: 20px;
}
.side #side_header #cancle_btn {
  width: 30px;
  height: 30px;
  background: 0;
  border: 0;
}
#chart {
  padding: 20px;
}
</style>

<style>
.customoverlay {
  position: relative;
  bottom: 85px;
  border-radius: 6px;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  z-index: 60;
  float: left;
}
.customoverlay:nth-of-type(n) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}
.customoverlay a {
  display: block;
  text-decoration: none;
  color: #000;
  text-align: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  background: #d95050;
  background: #d95050
    url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png)
    no-repeat right 14px center;
}
.customoverlay .title {
  display: block;
  text-align: center;
  background: #fff;
  margin-right: 35px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
}
.customoverlay:after {
  content: "";
  position: absolute;
  margin-left: -12px;
  left: 50%;
  bottom: -12px;
  width: 22px;
  height: 12px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
}
.infowindow {
  padding: 10px 30px;
}
</style>
