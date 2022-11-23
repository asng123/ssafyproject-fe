<template>
  <div class="side_container" v-show="isSideOpen">
    <div id="side">
      <div id="apartment_name">한강메트로자이 2단지</div>
      <button @click.prevent="clickSide">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <!-- Text slides with image -->
        <b-carousel-slide
          caption="First slide"
          text="Nulla vitae elit libero, a pharetra augue mollis interdum."
          img-src="https://picsum.photos/1024/480/?image=52"
        ></b-carousel-slide>

        <!-- Slides with custom text -->
        <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
          <h1>Hello world!</h1>
        </b-carousel-slide>

        <!-- Slides with image only -->
        <b-carousel-slide
          img-src="https://picsum.photos/1024/480/?image=58"
        ></b-carousel-slide>

        <!-- Slides with img slot -->
        <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->

        <!-- Slide with blank fluid image to maintain slide aspect ratio -->
      </b-carousel>
    </div>
    <div>
      <b-table
        stacked
        :items="houseDetailInfos"
        hover
        :per-page="perPage"
        :current-page="currentPage"
      ></b-table>
      <b-pagination
        v-model="currentPage"
        align="center"
        pills
        :total-rows="rows"
        :per-page="perPage"
        size="sm"
      ></b-pagination>
    </div>
    <div id="chart" v-if="isHouseDetailRendered">
      <trade-chart :houseDetailInfos="houseDetailInfos"></trade-chart>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
