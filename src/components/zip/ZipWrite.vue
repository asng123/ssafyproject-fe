<template>
  <div id="main">
    <div id="write_section">
      <div class="form">
        <div id="search_bar">
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
            ></b-form-input>
            <button id="submit_btn" @click.prevent="getSearchResult">
              <font-awesome-icon
                id="submit_btn_icon"
                icon="fa-solid fa-magnifying-glass"
              />
            </button>
          </form>
        </div>
        <div>
          <div id="map"></div>
        </div>
        <div>
          <input
            type="text"
            v-model="subtitleVal"
            placeholder="무엇을 소개하시나요?"
          />
        </div>
        <div>
          <input
            type="text"
            v-model="subtitleVal"
            placeholder="무엇을 소개하시나요?"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ZipWrite",
  data() {
    return { subtitleVal: "", searchValue: "" };
  },
};
</script>

<style lang="scss">
#main {
  display: flex;
  justify-content: center;
}
#write_section {
  width: 50%;
  min-height: 100vh;
  margin-top: 50px;
  box-shadow: 3px 3px 3px 3px #00000050;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  width: 70%;
}
#search_bar {
  height: 5vh;
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
input {
  border: none;
  border-right: 0px;
  border-top: 0px;
  border-left: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.19);
  width: 100%;
  display: block;
}
input:focus {
  border: none;
  outline: none;
  border-bottom: 1px solid $main;
  transition: border-bottom 1s;
}
</style>
