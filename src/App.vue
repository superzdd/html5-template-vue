<template>
  <div id="app page">
    <PageLoading v-if="pageLoadingShow" @loadComplete="handleLoadComplete"></PageLoading>
    <BasePage class="show-circle" v-if="page1Show" @commonclick="page1click">
      <div class="page1-bg">Page 1, click go to next page</div>
    </BasePage>
    <BasePage class="show-circle" v-if="page2Show" @commonclick="page1click">
      <div class="page2-bg">Page 2, click go to next page</div>
    </BasePage>
    <BasePage class="show-circle" v-if="page3Show" @commonclick="page1click">
      <div class="page3-bg">Page 3, click go to next page</div>
    </BasePage>
    <BasePage class="show-circle" v-if="page4Show" @commonclick="page4click">
      <div class="page4-bg">Page 4, click back to page1</div>
    </BasePage>
    <MusicButton
      @backgroundMusicPause="backgroundMusicPauseHandler"
      @backgroundMusicPlay="backgroundMusicPlayHandler"
    ></MusicButton>
  </div>
</template>

<script>
import baiduStatistics from './util/baidu-statistics.js';
import navi from './util/nav-controller.js';
import { getWindowSize } from './util/rem.js';
import pageManager from './util/page-manager.js';

import BasePage from './components/BasePage.vue';
import MusicButton from './components/MusicButton.vue';
import PageLoading from './components/PageLoading.vue';

export default {
    name: 'app',
    components: {
        BasePage,
        PageLoading,
        MusicButton,
    },
    data: function() {
        return {
            sharedState: window.store.state,
            backgroundInfo: {
                loadComplete: false, // 背景音乐素材是否加载完毕
                instance: null, // 背景音乐实例
            },
            pageManager, // 页面跳转管理器
        };
    },
    computed: {
        pageLoadingShow: function() {
            return this.pageManager.isPageVisible(0);
        },
        page1Show: function() {
            return this.pageManager.isPageVisible(1);
        },
        page2Show: function() {
            return this.pageManager.isPageVisible(2);
        },
        page3Show: function() {
            return this.pageManager.isPageVisible(3);
        },
        page4Show: function() {
            return this.pageManager.isPageVisible(4);
        },
    },
    created: function() {
        this.pageManager.setAutoNextDuration(500);
        this.pageManager.turnToPage(0);
        this.initBadiduStatistics();
        this.initBackgroundMusic();
    },
    mounted: function() {
        const { width, height } = getWindowSize();

        document.body.style.setProperty('--px-height', height + 'px');
        document.body.style.setProperty(
            '--circle-radius',
            Math.ceil(Math.sqrt(height * height + width * width) * 100) / 100 +
                'px'
        );
    },
    methods: {
        handleLoadComplete() {
            this.pageManager.turnToPage(1, 500);
        },
        page1click() {
            this.pageManager.turnToNextPageAutomatically();
        },
        page4click() {
            this.pageManager.turnToPage(1, 500);
        },
        startPlayBackgroundMusic(app) {
            window.createjs.Sound.registerSound(
                process.env.BASE_URL + 'imgs/bgmusic.mp3',
                'sound'
            ); // 注意,这句registerSound必须写在WeixinJSBridgeReady回调函数内才行,否则下方createjs.Sound.play就会无效
            let intervalInstance = setInterval(function() {
                if (app.backgroundInfo.loadComplete) {
                    clearInterval(intervalInstance);
                    console.log('play');
                    app.backgroundInfo.instance = window.createjs.Sound.play(
                        'sound'
                    );
                    window.store.setBackgroundMusicPlaying();
                }
            }, 10);
        },
        initBackgroundMusic() {
            window.createjs.Sound.alternateExtensions = ['mp3'];
            window.createjs.Sound.on('fileload', loadHandler, this);

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
                    'WeixinJSBridgeReady',
                    () => {
                        console.log('WeixinJSBridgeReady');
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
            baiduStatistics.init('abcdefg');
            baiduStatistics.output();
            baiduStatistics.push('h5-tmpl-vue', 'test');
        },
        backgroundMusicPauseHandler() {
            window.store.setBackgroundMusicPause();
            this.backgroundInfo.instance.paused = true;
        },
        backgroundMusicPlayHandler() {
            window.store.setBackgroundMusicPlaying();
            this.backgroundInfo.instance.paused = false;
        },
    },
};
</script>

<style lang="scss">
@import url('./style/common.scss');
body {
    --rem-height: 0rem;
    --px-height: 0px;
    --circle-radius: 0px;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
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

.page1-bg {
    @extend .common-bg;
    background-image: url('../public/imgs/1.jpg');
}

.page2-bg {
    @extend .common-bg;
    background-image: url('../public/imgs/2.jpg');
}

.page3-bg {
    @extend .common-bg;
    background-image: url('../public/imgs/3.jpg');
}

.page4-bg {
    @extend .common-bg;
    background-image: url('../public/imgs/4.jpg');
}

.show-circle {
    animation: clipCircleIn 0.5s linear forwards;
    z-index: 5;
}

@keyframes clipCircleIn {
    0% {
        clip-path: circle(0 at 0% 100%);
    }
    100% {
        clip-path: circle(var(--circle-radius) at 0% 100%);
    }
}
</style>
