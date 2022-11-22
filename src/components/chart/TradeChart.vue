<template>
  <div>
    <LineChartGenerator
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { Line as LineChartGenerator } from "vue-chartjs/legacy";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  name: "LineChart",
  components: {
    LineChartGenerator,
  },
  props: {
    houseDetailInfos: [],
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    chartData() {
      let ret = {
        labels: [
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021",
          "2022",
        ],
        datasets: [{}],
      };

      var aptinfo = Array.from({ length: 8 }, () => 0);
      for (let i = 0; i < this.houseDetailInfos.length; i++) {
        const dealAmount =
          parseInt(this.houseDetailInfos[i].가격.replace(",", "")) / 1000;
        const dealYear = parseInt(this.houseDetailInfos[i].거래일.substr(0, 4));
        aptinfo[dealYear - 2015] = dealAmount;
      }

      ret.datasets[0] = {
        label: "매매가격",
        backgroundColor: "#f87979",
        data: aptinfo,
      };

      return ret;
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
    },
  },
};
</script>
