<template>
  <v-app>
    <header-section></header-section>

    <v-container class="mt-16 section">
      <router-view></router-view>
    </v-container>

    <footer-section></footer-section>
  </v-app>
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

<style lang="scss"></style>
