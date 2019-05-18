<template>
  <div id="app page">
    <PageLoading v-if="pageLoadingShow"></PageLoading>
    <BasePage v-if="page1Show" v-on:commonclick="page1click"></BasePage>
    <BasePage v-if="page2Show" v-on:commonclick="page1click">
      <div class="page2-bg">this is page 2, click go to next page</div>
    </BasePage>
    <BasePage v-if="page3Show" v-on:commonclick="page1click">
      <div class="page3-bg">this is page 3, click go to next page</div>
    </BasePage>
    <BasePage v-if="page4Show" v-on:commonclick="page4click">
      <div class="page4-bg">this is page 4, click back to page1</div>
    </BasePage>
  </div>
</template>

<script>
import BasePage from "./components/BasePage.vue";
import PageLoading from "./components/PageLoading.vue";
import baiduStatistics from "./util/baidu-statistics.js";
import store from "./util/store-proxy.js";

export default {
  name: "app",
  components: {
    BasePage,
    PageLoading
  },
  data: function() {
    return {
      sharedState: store.state
    };
  },
  computed: {
    pageLoadingShow: function() {
      return this.sharedState.pageIndex == 0;
    },
    page1Show: function() {
      return this.sharedState.pageIndex == 1;
    },
    page2Show: function() {
      return this.sharedState.pageIndex == 2;
    },
    page3Show: function() {
      return this.sharedState.pageIndex == 3;
    },
    page4Show: function() {
      return this.sharedState.pageIndex == 4;
    }
  },
  created: function() {
    baiduStatistics.init("abcdefg");
    baiduStatistics.output();
    baiduStatistics.push("h5-tmpl-vue", "test");
  },
  methods: {
    page1click() {
      // store.setPageIndexAdd();
      store.state.pageIndex++;
    },
    page4click() {
      store.state.pageIndex = 1;
    }
  }
};
</script>

<style lang="scss">
@import url("./style/common.scss");

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.common-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  background-size: cover;
}

.page2-bg {
  @extend .common-bg;
  background-image: url("/imgs/1.jpg");
}

.page3-bg {
  @extend .common-bg;
  background-image: url("/imgs/2.jpg");
}

.page4-bg {
  @extend .common-bg;
  background-image: url("/imgs/3.jpg");
}
</style>
