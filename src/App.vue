<template>
  <div id="app page">
    <PageLoading v-if="pageLoadingShow"></PageLoading>
    <BasePage v-if="page1Show" @commonclick="page1click"></BasePage>
    <BasePage class="show-circle" v-if="page2Show" @commonclick="page1click">
      <div class="page2-bg">this is page 2, click go to next page</div>
    </BasePage>
    <BasePage v-if="page3Show" @commonclick="page1click">
      <div class="page3-bg">this is page 3, click go to next page</div>
    </BasePage>
    <BasePage v-if="page4Show" @commonclick="page4click">
      <div class="page4-bg">this is page 4, click back to page1</div>
    </BasePage>
    <MusicButton
      @backgroundMusicPause="backgroundMusicPauseHandler"
      @backgroundMusicPlay="backgroundMusicPlayHandler"
    ></MusicButton>
  </div>
</template>

<script>
import BasePage from "./components/BasePage.vue";
import MusicButton from "./components/MusicButton.vue";
import PageLoading from "./components/PageLoading.vue";
import baiduStatistics from "./util/baidu-statistics.js";
import navi from "./util/nav-controller.js";
import { getWindowSize, makeRem750 } from "./util/rem.js";

export default {
  name: "app",
  components: {
    BasePage,
    PageLoading,
    MusicButton
  },
  data: function() {
    return {
      sharedState: window.store.state,
      backgroundInfo: {
        loadComplete: false, // 背景音乐素材是否加载完毕
        instance: null // 背景音乐实例
      }
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
    this.initBadiduStatistics();
    this.initBackgroundMusic();
  },
  mounted: function() {
    const { width, height } = getWindowSize();
    const remUtil = makeRem750();
    // debugger;
    console.log(
      `mounted get params ${JSON.stringify({
        width,
        height,
        remUtil
      })}`
    );
  },
  methods: {
    page1click() {
      // window.store.setPageIndexAdd();
      window.store.state.pageIndex++;
    },
    page4click() {
      window.store.state.pageIndex = 1;
    },
    startPlayBackgroundMusic(app) {
      window.createjs.Sound.registerSound("/imgs/bgmusic.mp3", "sound"); // 注意,这句registerSound必须写在WeixinJSBridgeReady回调函数内才行,否则下方createjs.Sound.play就会无效
      let intervalInstance = setInterval(function() {
        if (app.backgroundInfo.loadComplete) {
          clearInterval(intervalInstance);
          console.log("play");
          app.backgroundInfo.instance = window.createjs.Sound.play("sound");
          window.store.setBackgroundMusicPlaying();
        }
      }, 10);
    },
    initBackgroundMusic() {
      window.createjs.Sound.alternateExtensions = ["mp3"];
      window.createjs.Sound.on("fileload", loadHandler, this);

      function loadHandler(event) {
        console.log(`music load complete: ${JSON.stringify(event)}`);
        this.backgroundInfo.loadComplete = true;
      }

      let appInstance = this;

      // function startPlayBackgroundMusic() {
      //   window.createjs.Sound.registerSound("/imgs/bgmusic.mp3", "sound"); // 注意,这句registerSound必须写在WeixinJSBridgeReady回调函数内才行,否则下方createjs.Sound.play就会无效
      //   let intervalInstance = setInterval(function() {
      //     if (appInstance.backgroundInfo.loadComplete) {
      //       clearInterval(intervalInstance);
      //       console.log("play");
      //       appInstance.backgroundInfo.instance = window.createjs.Sound.play(
      //         "sound"
      //       );
      //       window.store.setBackgroundMusicPlaying();
      //     }
      //   }, 10);
      // }
      if (navi.isWX) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          () => {
            console.log("WeixinJSBridgeReady");
            // startPlayBackgroundMusic();
            this.startPlayBackgroundMusic(appInstance);
          },
          false
        );
      } else {
        // startPlayBackgroundMusic();
        this.startPlayBackgroundMusic(appInstance);
      }
    },
    initBadiduStatistics() {
      baiduStatistics.init("abcdefg");
      baiduStatistics.output();
      baiduStatistics.push("h5-tmpl-vue", "test");
    },
    backgroundMusicPauseHandler() {
      window.store.setBackgroundMusicPause();
      this.backgroundInfo.instance.paused = true;
    },
    backgroundMusicPlayHandler() {
      window.store.setBackgroundMusicPlaying();
      this.backgroundInfo.instance.paused = false;
    }
  }
};
</script>

<style lang="scss">
@import url("./style/common.scss");
#app {
  --rem-height: 0rem;
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

.show-circle {
  animation: clipCircleIn 1s linear forwards;
}

@keyframes clipCircleIn {
  0% {
    clip-path: circle(0 at 50% 50%);
  }
  100% {
    clip-path: circle(100vh at 50% 50%);
  }
}
</style>
