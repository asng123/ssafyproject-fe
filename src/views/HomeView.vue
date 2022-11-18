<template>
  <div id="main" :class="{ usual: isFocus, intro: !isFocus }">
    <div id="search_bar" :class="{ focus: isFocus === true }">
      <form action="">
        <b-form-input
          id="search"
          @focus="focused"
          autocomplete="off"
        ></b-form-input>
        <button type="submit" id="submit_btn">
          <font-awesome-icon
            id="submit_btn_icon"
            icon="fa-solid fa-magnifying-glass"
          />
        </button>
      </form>
    </div>
    <div id="map_div" v-show="isFocus">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  components: {
    SearchSection: () => import("@/components/common/searchBar.vue"),
  },
  data() {
    return { isFocus: false, prevRoute: null };
  },
  async created() {
    // ^^
    // console.log(process.env.VUE_APP_UNSPLASH_KEY);
    // axios
    //   .get(
    //     `https://api.unsplash.com/photos/random/?client_id=${process.env.VUE_APP_UNSPLASH_KEY}`
    //   )
    //   .then(({ data }) => {
    //     // var dom = document.getElementById("main");
    //     // console.log(data);
    //     // dom.style.backgroundImage = url(data.links.download);
    //     this.backgroundImg = data.links.download;
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  },
  components: {
    siderbar: () => import("@/components/details/sidebar"),
  },
  methods: {
    focused() {
      this.isFocus = true; // kakao map 초기화
      console.log(process.env.VUE_APP_KAKAO_MAP_KEY);
      this.initMap();
    },
    initMap() {
      if (window.kakao && window.kakao.maps) {
        this.makeMap();
      } else {
        const script = document.createElement("script");
        script.onload = () => kakao.maps.load(this.initMap);
        script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAO_MAP_KEY}`;
        document.head.appendChild(script);
      }
    },
    makeMap() {
      console.log(document);
      const mapContainer = document.querySelector("#map");
      console.log(mapContainer);
      const mapOption = {
        center: new kakao.maps.LatLng(37.56666, 126.978),
        level: 3,
      };
      this.map = new kakao.maps.Map(mapContainer, mapOption);
    },
  },
  mounted() {
    // console.log(this.prevRoute);
    // console.log(this.prevRoute.name);
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
  width: 100%;
  height: 100%;
}
#map_div #map {
  width: 100%;
  height: 100%;
}
</style>
