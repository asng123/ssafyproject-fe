import Vue from "vue";
import Vuex from "vuex";
// module import
import memberStore from "@/store/modules/memberStore";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    memberStore,
  },
});
