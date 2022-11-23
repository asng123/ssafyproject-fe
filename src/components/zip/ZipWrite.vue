<template>
  <div id="main">
    <div id="submit_btn_container">
      <button class="btn" id="submit_btn" @click="submitBtnHandler">
        <font-awesome-icon icon="fa-solid fa-circle-check" size="3x" />
      </button>
    </div>
    <div id="write_container">
      <div class="section" id="write_section">
        <div class="form">
          <div class="search_bar">
            <!-- <input
            type="text"
            v-model="subtitleVal"
            placeholder="무엇을 하이아닐;ㄴ?"
          /> -->
            <form action="">
              <b-form-input
                id="search"
                v-model="searchValue"
                autocomplete="off"
                :placeholder="searchPlaceholder"
              ></b-form-input>
              <button id="submit_btn" @click.prevent="getSearchResult">
                <font-awesome-icon
                  id="submit_btn_icon"
                  icon="fa-solid fa-magnifying-glass"
                />
              </button>
            </form>
          </div>
          <div class="map_section">
            <div id="map" class="maps"></div>
            <div id="list" class="lists" v-show="isListOpen"></div>
          </div>
          <div v-show="isResident">
            {{ this.introduceValue }}
          </div>
          <div>
            <input
              type="text"
              v-model="subtitleVal"
              placeholder="간단하게 소개해주세요!"
            />
          </div>
          <div>
            <input
              type="number"
              v-model="wantedPrice"
              placeholder="원하는 매매 가격을 적어주세요!"
            />
          </div>
        </div>
      </div>
      <div id="blocks" v-show="blockItemsLength != 0">
        <zip-block-write-item
          v-for="index in blockItemsLength"
          :key="index"
          :index="index"
          :dong="dong"
          :zId="zId"
          @deleteBlocks="deleteBlocks"
        ></zip-block-write-item>
      </div>
      <div class="section" id="makeBtn">
        <button class="btn" id="makeSection" @click.prevent="clickMakeBtn">
          <font-awesome-icon icon="fa-solid fa-circle-plus" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { addZip } from "@/api/zip";
import ZipBlockWriteItem from "@/components/zip/items/ZipBlockWriteItem";
import { mapState, mapGetters, mapActions } from "vuex";
const memberStore = "memberStore";
export default {
  name: "ZipWrite",
  data() {
    return {
      searchValue: "", // 검색
      subtitleVal: "", // 제목
      wantedPrice: null, // 가격
      current: { lat: 37.5, lng: 127.039 },
      map: null, // 지도
      ps: null, // 장소 검색
      geocoder: null,
      searchPlaceholder: "주거 시설을 검색해주세요.",
      isResident: false,
      isListOpen: false,
      dong: "",
      regCode: "",
      residentResults: [],
      introduceValue: "",
      curIntroduceMarker: null,
      blockItemsLength: 1,
      zId: "",
    };
  },
  mounted() {
    this.initMap();
  },
  components: {
    ZipBlockWriteItem,
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "userInfo"]),
  },
  created() {
    console.log(this.isLogin, this.userInfo);
    if (!this.userInfo) {
      alert("로그인이 필요합니다.");
      this.$router.push({ name: "Login" });
    }
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
      const mapContainer = document.querySelector("#map");
      const mapOption = {
        center: new kakao.maps.LatLng(this.current.lat, this.current.lng),
        level: 4,
      };
      this.map = new kakao.maps.Map(mapContainer, mapOption);
      this.ps = new kakao.maps.services.Places();
      this.geocoder = new kakao.maps.services.Geocoder();

      // 마우스 드래그와 모바일 터치를 이용한 지도 이동을 막는다
      this.map.setDraggable(false);

      // 마우스 휠과 모바일 터치를 이용한 지도 확대, 축소를 막는다
      this.map.setZoomable(false);
    },
    getSearchResult() {
      // 검색 결과
      console.log("search", this.searchValue);
      if (this.marker) this.marker.setMap(null);
      this.ps.keywordSearch(this.searchValue, this.placesSearchCB);
    },
    placesSearchCB(data, status) {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        console.log("s", data);
        this.isResident = false;
        let place = null;
        this.residentResults = [];
        const listDiv = data.reduce(
          (
            cur,
            { place_url, place_name, category_name, y, x, address_name }
          ) => {
            console.log(category_name);
            if (category_name.includes("주거시설")) {
              const temp = address_name.split(" ");
              console.log("주소", temp);
              this.residentResults.push({
                place_url,
                place_name,
                category_name,
                y,
                x,
                address_name,
              });
              this.isResident = true;

              // this.dong = currentAddress.split(" ")[2];
              // this.regCode = result[i].code;
              return (
                cur +
                `
              <div class="resident_items" data-x=${x} data-y=${y} data-place=${place_name} >${address_name} ${place_name}</div>
            `
              );
            }
            return cur;
          },
          ""
        );
        if (this.isResident) {
          const list = document.querySelector("#list");
          list.innerHTML = listDiv;
          console.log(list.childNodes);
          this.isListOpen = true;
          list.childNodes.forEach((child) => {
            child.addEventListener("click", () => {
              console.log(
                child.attributes["data-x"].value,
                child.attributes["data-y"].value
              );
              const x = child.attributes["data-x"].value;
              const y = child.attributes["data-y"].value;
              this.address = child.innerText;
              // this.address = child.attributes["data-address"].value;
              this.place = child.attributes["data-place"].value;
              this.introduceValue = this.address;

              var bounds = new kakao.maps.LatLngBounds();
              bounds.extend(new kakao.maps.LatLng(y, x));
              place = { y, x };

              this.current.lng = x;
              this.current.lat = y;
              this.searchAddrFromCoords(this.current, this.getAddressFromRes);
              this.displayMarker({ y, x });
              // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
              this.map.setBounds(bounds);
              this.map.relayout();
              this.map.setCenter(
                new kakao.maps.LatLng(this.current.lat, this.current.lng)
              );
            });
          });
        } else {
          this.searchValue = "";
          this.searchPlaceholder =
            "주거시설이 아니네요 🥹 주거시설을 검색해주세요.";
        }
      } else {
        alert("검색 결과가 없습니다.");
      }
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
        // this.getRecentPrice(); => 가장 최근 가격
      } else {
        this.currentAddress = "실패";
      }
    },
    displayMarker(place) {
      // 마커를 생성하고 지도에 표시합니다
      if (this.curIntroduceMarker) this.curIntroduceMarker.setMap(null);
      this.curIntroduceMarker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });
    },
    async getRecentPrice() {
      console.log("getRecentPrice", this.regCode, this.introduceValue);
      await getHouseDetailInfo(this.regCode, this.introduceValue).then(
        (data) => {
          console.log("price", data);
        }
      );
    },
    clickMakeBtn() {
      if (this.dong === "") {
        alert("소개하실 집부터 골라주세요!");
        return;
      }
      if (this.blockItemsLength < 5) {
        this.blockItemsLength += 1;
      } else {
        alert("더 이상 블럭 추가가 어려워요!");
      }
    },
    deleteBlocks() {
      if (this.blockItemsLength > 0) {
        this.blockItemsLength -= 1;
      } else {
        alert("더 이상 삭제할 블럭이 없습니다.");
      }
    },
    async submitBtnHandler() {
      console.log("clicked");
      if (!this.userInfo) {
        alert("로그인이 필요합니다.");

        this.$router.push({ name: "Login" });
        return;
      }
      if (!this.regCode) {
        return alert("소개할 집을 선택해주세요!");
      }
      if (!this.subtitleVal) {
        return alert("소개할 집을 간단하게 소개해주세요!");
      }
      if (!this.wantedPrice) {
        return alert("소개할 집의 가격을 정해주세요!");
      }
      const date = Date.now();
      const data = {
        zid: `${this.userInfo.uid}${date}`,
        uid: this.userInfo.uid,
        address: this.address,
        aptname: this.place,
        price: Number(this.wantedPrice),
        lat: this.current.lat,
        lng: this.current.lng,
        content: this.subtitleVal,
        regcode: this.regCode,
      };
      console.log("s", this.zId);
      await addZip(data)
        .then((res) => {
          console.log(res);
          this.zId = `${this.userInfo.uid}${date}`;
        })
        .catch((err) => {
          console.log(err);
          this.zId = `${this.userInfo.uid}${date}`;
          console.log("change ㅋzzzid", this.zId);
        });
    },
  },
};
</script>

<style lang="scss">
#main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 70px;
}
#submit_btn_container {
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 40px;
  height: 40px;
}
#submit_btn_container #submit_btn {
  width: 100%;
  height: 100%;
}
#write_container {
  width: 50%;
  min-width: 450px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 50px;
}
.section {
  width: 100%;
  padding: 50px 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  background: #f8f8f8;
  box-shadow: 0px 0px 250px 14px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
}
.section > * {
  width: 70%;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
}
.search_bar {
  height: 5vh;
}
.search_bar form {
  display: flex;
  justify-content: space-between;
}
.search_bar form #search {
  height: 5vh;
  width: 80%;
  border-radius: 10px 0 0 10px;
}
.search_bar form #search:focus {
  border: 0;
}
.search_bar form #submit_btn {
  width: 20%;
  border-style: none;
  background: black;
  border-radius: 0 10px 10px 0;
}
.search_bar form #submit_btn #submit_btn_icon {
  color: $main;
}
.map_section {
  height: 200px;
  display: flex;
  gap: 10px;
}
.map_section .maps {
  width: 100%;
  height: 100%;
}
.map_section .lists {
  overflow: scroll;
}
.map_section .resident_items {
  font-size: 10px;
  border-bottom: 1px solid #000;
  padding: 2px;
}
.map_section .resident_items:hover {
  background: $main;
}
input,
textarea,
#focus {
  border: none;
  border-right: 0px;
  border-top: 0px;
  border-left: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.19);
  background: #f8f8f8;
  width: 100%;
  display: block;
}
input:focus,
textarea:focus,
#search:focus {
  border: none;
  outline: none;
  border-bottom: 1px solid $main;
  transition: border-bottom 1s;
}
#blocks {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
#makeBtn:hover {
  border: 2px solid $main;
  transition: border 0.3s;
}
button.btn {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  border-radius: 10px;
  background: transparent;
}
</style>
