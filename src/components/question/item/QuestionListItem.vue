<template>
  <b-tr>
    <b-td>{{ bid }}</b-td>
    <b-th class="text-left">
      <router-link :to="{ name: 'boardview', params: { bid: bid } }">{{ subject }}</router-link>
    </b-th>
    <b-td>{{ hit }}</b-td>
    <b-td>admin</b-td>
    <b-td>{{ regtime | dateFormat }}</b-td>
  </b-tr>
</template>

<script>
import moment from "moment";

export default {
  name: "BoardListItem",
  props: {
    bid: Number,
    subject: String,
    hit: Number,
    regtime: String,
  },
  filters: {
    dateFormat(regtime) {
      return moment(new Date(regtime)).format("YY.MM.DD");
    },
  },
};
</script>

<style></style>
