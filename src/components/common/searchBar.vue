<template>
  <div id="search_bar">
    <form action="">
      <input
        type="text"
        placeholder="거주하고 싶은 곳이 어딘가요?"
        name="search"
      />
      <button type="submit">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
};
</script>

<style></style>
