<template>
  <div id="app">
    <header-section></header-section>
    <div id="main_section">
      <router-view></router-view>
    </div>
    <footer-section></footer-section>
  </div>
</template>

<script>
export default {
  name: "App",

  components: {
    HeaderSection: () => import("@/components/layout/header.vue"),
    FooterSection: () => import("@/components/layout/footer.vue"),
  },
  data: () => ({}),
};
</script>

<style lang="scss">
#id {
  margin: 0;
  padding: 0;
}
#main_section {
  min-height: 92vh;
}
</style>
