<template>
  <div id="app">
    <header-section></header-section>

    <router-view></router-view>
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
</style>
