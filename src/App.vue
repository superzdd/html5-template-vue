<template>
  <div id="app" class="page">
    <BasePage>
      <canvas id="cvs" width="640" height="1038"></canvas>
    </BasePage>
    <MusicButton></MusicButton>
  </div>
</template>

<script>
import baiduStatistics from './util/baidu-statistics.js';
import navi from './util/nav-controller.js';
import { getWindowSize } from './util/rem.js';
import pageTurningManager from './util/page-turning-manager.js';
import { Stage, Text } from '@createjs/easeljs';
import { Tween } from '@createjs/tweenjs';
import { Ticker } from '@createjs/core';
import BasePage from './components/BasePage.vue';
import MusicButton from './components/MusicButton.vue';
// import PageLoading from './components/PageLoading.vue';

export default {
    name: 'app',
    components: {
        BasePage,
        // PageLoading,
        MusicButton,
    },
    data: function() {
        return {
            sharedState: window.store.state,
            backgroundInfo: {
                loadComplete: false, // 背景音乐素材是否加载完毕
                instance: null, // 背景音乐实例
            },
            pageTurningManager, // 页面跳转管理器
            canvasInfo: {
                stage: null, // createjs的canvas实例对象
                width: 0, // 画布的宽度，指的是画布的逻辑宽度，即屏幕宽度像素数量 * ratio（每像素包含的实际像素）
                height: 0, // 画布的高度，指的是画布的逻辑高度，即屏幕高度像素数量 * ratio（每像素包含的实际像素）
                centerX: 0, // 画布中心点x
                centerY: 0, // 画布中心点y
                distanceToCenter: 0, // 左上角到中心点的距离
            },
        };
    },
    computed: {
        pageLoadingShow: function() {
            return this.pageTurningManager.isCurrentPage(0);
        },
        pageClass: function() {
            return function(index) {
                let ret = '';
                if (this.pageTurningManager.isCurrentPage(index)) {
                    ret = 'page-show';
                } else if (this.pageTurningManager.isNextPage(index)) {
                    ret = 'page-animate';
                } else {
                    ret = 'page-hide';
                }
                return ret;
            };
        },
    },
    created: function() {
        // this.pageTurningManager.turnToPage(0);
        // this.initBadiduStatistics();
        // this.initBackgroundMusic();
    },
    mounted: function() {
        const { width, height } = getWindowSize();

        document.body.style.setProperty('--px-height', height + 'px');
        document.body.style.setProperty(
            '--circle-radius',
            Math.ceil(Math.sqrt(height * height + width * width) * 100) / 100 +
                'px'
        );

        let ratio = window.devicePixelRatio;

        let windowSizeInfo = getWindowSize();

        // 画布基本信息
        let canvasInfo = this.canvasInfo;

        // canvasInfo.stage = new createjs.Stage('cvs');
        // createjs.Touch.enable(canvasInfo.stage); // 定义手机上可以使用手指触发mousemove等鼠标事件
        canvasInfo.width = windowSizeInfo.width * ratio;
        canvasInfo.height = windowSizeInfo.height * ratio;
        canvasInfo.centerX = canvasInfo.width / 2;
        canvasInfo.centerY = canvasInfo.height / 2;
        canvasInfo.distanceToCenter = Math.sqrt(
            canvasInfo.centerX * canvasInfo.centerX +
                canvasInfo.centerY * canvasInfo.centerY
        );

        this.render();
    },
    methods: {
        render: function() {
            let stage = new Stage('cvs');
            let text = new Text('Herdsric', '20px Arial', '#ff7700');
            text.x = 100;
            text.y = 100;
            text.textBaseline = 'alphabetic';

            stage.addChild(text);

            stage.update();

            Tween.get(text, { loop: true }).to({ x: 300 }, 400);

            // window.setInterval(() => {
            //     stage.update();
            // }, 30);

            Ticker.framerate = 120;
            Ticker.addEventListener('tick', stage);
        },
        handleLoadComplete() {
            this.pageTurningManager.turnToPage(1, 500);
        },
        nextPageClick() {
            this.pageTurningManager.turnToNextPageAutomatically();
        },
        page4click() {
            this.pageTurningManager.turnToPage(1, 500);
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
    // margin-top: 60px;
}

#cvs {
    width: 100vw;
    height: 100vh;
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

.page-hint {
    background-color: #ffffff;
    color: #000000;
    width: 75vw;
    height: 10vw;
    font-size: 15px;
    line-height: 10vw;
    text-align: center;
}

.page-show {
    z-index: 5;
    opacity: 1;
}

.page-animate {
    animation: clipCircleIn 0.5s linear forwards;
    z-index: 10;
    opacity: 1;
}

.page-hide {
    z-index: 0;
    opacity: 0;
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
