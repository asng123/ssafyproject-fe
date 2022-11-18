<template>
  <div id="footer">
    <div id="nav">
      <div id="left">
        <ul>
          <li>고객센터</li>
        </ul>
      </div>
      <div id="right">
        <ul>
          <li>c 내집</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({}),
};
</script>

<style lang="scss">
#footer {
  width: 100%;
  padding: 3vh;
  bottom: 0;

  background: $main-back;
  color: white;
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
</style>
