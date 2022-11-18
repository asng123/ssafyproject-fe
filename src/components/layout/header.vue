<template>
  <div
    id="header"
    :class="{ origin_color: scrollPos < 100, change_color: scrollPos > 100 }"
  >
    <div id="logo">내집</div>
    <div id="nav">
      <div id="left">
        <ul>
          <li>내집 찾기</li>
          <li>내집 소개</li>
        </ul>
      </div>
      <div id="right">
        <ul>
          <li>알림</li>
          <li>프로필</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      scrollPos: null,
    };
  },
  created() {
    window.addEventListener("scroll", this.updateScroll);
  },
  methods: {
    updateScroll() {
      this.scrollPos = window.scrollY;
    },
  },
};
</script>

<style lang="scss">
.origin_color {
  background-color: transparent;
}

.change_color {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
#header {
  padding: 3vh;
  position: sticky;
  top: 0vh;
  transition: background-color 0.5s;

  display: grid;
  grid-template-columns: 1fr 10fr;

  font-size: 20px;
}

#nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
#nav #left > ul {
  display: flex;
  gap: 30px;
}
#nav #right > ul {
  display: flex;
  gap: 30px;
}
li {
  list-style: none;
}
</style>
