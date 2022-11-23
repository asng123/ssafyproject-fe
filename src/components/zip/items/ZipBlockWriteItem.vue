<template>
  <div class="section">
    <div class="section_header">
      <div class="left_header">
        <div class="index_container">#{{ index }}</div>
        <div>
          <select
            class="dropdown"
            v-model="selectedType"
            @change="handleChangeSelect"
          >
            <option
              v-for="(type, index) in types"
              :key="index"
              :value="type.key"
            >
              {{ type.value }}
            </option>
          </select>
        </div>
      </div>
      <div class="right_header">
        <div>
          <button class="delete_btn btn" @click.prevent="clickCancle">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
      </div>
    </div>
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
        <div :id="'map' + index" class="maps"></div>
        <div :id="'list' + index" class="lists"></div>
      </div>
      <div v-show="isType">
        {{ this.introduceValue }}
      </div>
    </div>
    <div>
      <input
        type="text"
        v-model="summary"
        placeholder="간단하게 소개해주세요!"
      />
    </div>
    <div>
      <textarea
        type="text"
        v-model="content"
        placeholder="소개해주세요!"
      ></textarea>
    </div>
  </div>
</template>

<script>
import { addZipBlock } from "@/api/zip";
export default {
  name: "ZipBlockWriteItem",
  data() {
    return {
      searchValue: "", // 검색
      summary: "", // 요약
      content: "", // 내용
      wantedPrice: null, // 가격
      map: null, // 지도
      ps: null, // 장소 검색
      geocoder: null,
      searchPlaceholder: "학교 검색해주세요.",
      isType: false,
      type: "학교",
      regCode: "",
      residentResults: [],
      introduceValue: "",
      curIntroduceMarker: null,
      types: [
        { key: "SC4", value: "학교" },
        { key: "SW8", value: "지하철역" },
        { key: "CT1", value: "문화시설" },
        { key: "FD6", value: "음식점" },
        { key: "CE7", value: "카페" },
        { key: "HP8", value: "병원" },
      ],
      selectedType: "SC4",
      placeName: "",
      address: "",
      place: "",
      lat: 37.5,
      lng: 127.039,
    };
  },
  props: {
    index: Number,
    dong: String,
    zId: String,
  },
  created() {},
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
      const mapContainer = document.querySelector(`#map${this.index}`);
      console.log("item", mapContainer);
      const mapOption = {
        center: new kakao.maps.LatLng(this.lat, this.lng),
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
      console.log("search", `${this.dong} ${this.searchValue}`);
      if (this.marker) this.marker.setMap(null);
      this.ps.keywordSearch(
        `${this.dong} ${this.searchValue}`,
        this.placesSearchCB
      );
    },
    placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        console.log("s", data);
        this.isType = false;
        let place = null;
        this.residentResults = [];
        const listDiv = data.reduce(
          (
            cur,
            {
              place_url,
              place_name,
              category_name,
              y,
              x,
              address_name,
              category_group_code,
            }
          ) => {
            //place_url, place_name, category_name, y, x, address_name,category_group_code
            //   console.log(data);
            if (category_group_code === this.selectedType) {
              console.log(place_name, address_name);
              this.residentResults.push({
                place_url,
                place_name,
                category_name,
                y,
                x,
                address_name,
              });
              this.isType = true;

              // this.dong = currentAddress.split(" ")[2];
              // this.regCode = result[i].code;
              return (
                cur +
                `
            <div class="resident_items" data-x=${x} data-y=${y} data-place=${place_name}>${address_name} ${place_name}</div>
          `
              );
            }
            return cur;
          },
          ""
        );
        if (this.isType) {
          const list = document.querySelector(`#list${this.index}`);
          list.innerHTML = listDiv;
          console.log(list.childNodes);
          list.childNodes.forEach((child) => {
            child.addEventListener("click", () => {
              console.log(
                child.attributes["data-x"].value,
                child.attributes["data-y"].value
              );
              const x = child.attributes["data-x"].value;
              const y = child.attributes["data-y"].value;
              this.lng = x;
              this.lat = y;
              this.address = child.innerText;
              // this.address = child.attributes["data-address"].value;
              this.place = child.attributes["data-place"].value;
              this.introduceValue = this.address;

              var bounds = new kakao.maps.LatLngBounds();
              bounds.extend(new kakao.maps.LatLng(y, x));
              place = { y, x };
              this.searchAddrFromCoords(
                { lat: this.lat, lng: this.lng },
                this.getAddressFromRes
              );
              this.displayMarker({ y, x });
              // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
              this.map.setBounds(bounds);
              this.map.relayout();
              this.map.setCenter(new kakao.maps.LatLng(this.lat, this.lng));
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
            console.log(result[i].code);
            this.regCode = result[i].code;

            break;
          }
        }
        console.log("sc", this.regCode);
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
    handleChangeSelect() {
      console.log("selected ", this.selectedType);
      this.type = this.types.filter(
        (type) => type.key === this.selectedType
      )[0].value;
      this.searchPlaceholder = `${this.type} 검색해주세요!`;
    },
    clickCancle() {
      console.log("delete");
      this.$emit("deleteBlocks");
    },
  },
  watch: {
    async zId() {
      console.log("change zid");
      if (!this.place) {
        return alert(`소개할 ${this.type}을 선택해주세요!`);
      }
      if (!this.content) {
        return alert(`소개할 ${this.type}을 간단하게 소개해주세요!`);
      }
      if (this.zId) {
        console.log(this.zId);
        const data = {
          address: this.address,
          content: this.content,
          order: this.index,
          place: this.place,
          type: this.type,
          zbid: `${this.zId}_${this.index}`,
          zid: this.zId,
          summary: this.summary,
          lat: this.lat,
          lng: this.lng,
        };
        await addZipBlock(data)
          .then((res) => {
            this.$router.push({ name: "ziplist" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$router.push({ name: "ziplist" });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.section_header {
  height: 30px;
  display: flex;
  justify-content: space-between;
}
.section_header .left_header {
  display: flex;
  gap: 20px;
}
.section_header .left_header > * {
  height: 100%;
}
.index_container {
  font-size: 20px;
}
select {
  height: 100%;
}
.section_header .right_header > * {
  height: 100%;
}
.section_header .right_header .delete_btn {
  width: 30px;
  height: 100%;
  border: 0;
  outline: 0;
  border-radius: 10px;
  background: transparent;
}
.section_header .right_header .delete_btn:hover {
  border: 1px solid $main;
}
select {
  border-radius: 10px;
  border: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.19);

  padding: 0 10px;
  background: #f8f8f8;
}
select:hover {
  border: 1px solid $main;
}
option:hover {
}
</style>
