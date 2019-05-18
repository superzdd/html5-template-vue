<template>
  <BasePage>
    <div
      class="bg abs page"
      v-bind:style="{backgroundImage: finalImageSrcBg}"
    >Loading {{loadPercent}}%</div>
  </BasePage>
</template>

<script>
import BasePage from "./BasePage.vue";
import imageLoad from "../util/image-load.js";
import store from "../util/store-proxy.js";
export default {
  name: "pageLoading",
  components: {
    BasePage
  },
  data() {
    return {
      sharedState: store,
      loadPercent: 0,
      publicPath: process.env.BASE_URL,
      imageBgSrc: "imgs/bg-loading.jpg"
    };
  },
  computed: {
    finalImageSrcBg() {
      return `url(${this.publicPath}${this.imageBgSrc})`;
    }
  },
  created() {
    let _imageLoad = new imageLoad();
    _imageLoad
      .queueImage(this.sharedState.sourceArrayPreLoad)
      .imageLoadingProgressCallback(
        num => {
          this.preloadPercent = Math.floor(num);
        },
        () => {
          //   store.setPageIndexAdd();
          this.startLoading();
        }
      );
  },
  methods: {
    startLoading() {
      let _imageLoad = new imageLoad();
      _imageLoad
        .queueImage(this.sharedState.sourceArrayLoading)
        .imageLoadingProgressCallback(
          num => {
            this.loadPercent = Math.floor(num);
          },
          () => {
            store.state.pageIndex++;
            store.state.testArr.push("1");
          }
        );
    }
  }
};
</script>

<style lang="scss">
@import url("../style/common.scss");

// $publicPath: process.env.BASE_URL;

.bg {
  display: flex;
  justify-content: center;
  align-items: center;

  //   background-image: url(/public/imgs/bg-loading.jpg);
  background-size: 100% 100%;
}
</style>