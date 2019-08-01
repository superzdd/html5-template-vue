<template>
  <div id="app" class="page">
    <PageLoading v-if="pageLoadingShow" @loadComplete="handleLoadComplete"></PageLoading>
    <BasePage :class="pageClass(1)">
      <div class="page1-bg">
        <div class="content page">
          <div class="page-hint">Page 1, click go to next page</div>

          <!-- div background-image 形式 -->
          <!-- <div
          class="rect"
          v-hammer:pinch="pinch"
          v-hammer:pinchstart="pinchstart"
          v-hammer:pinchin="pinchin"
          v-hammer:pinchout="pinchout"
          v-hammer:pinchend="pinchend"
          v-hammer:pinchcancel="pinchend"
          v-hammer:pan="panmove"
          v-hammer:panstart="panstart"
          v-hammer:rotate="rotate"
          v-hammer:rotatestart="rotatestart"
          v-hammer:rotateend="rotateend"
          v-hammer:rotatecancel="rotateend"
          :style="{transform: rectComputed,'transform-origin': rectOrigin}"
          ></div>-->

          <img
            class="rect"
            v-hammer:pinch="pinch"
            v-hammer:pinchstart="pinchstart"
            v-hammer:pinchin="pinchin"
            v-hammer:pinchout="pinchout"
            v-hammer:pinchend="pinchend"
            v-hammer:pinchcancel="pinchend"
            v-hammer:pan="panmove"
            v-hammer:panstart="panstart"
            v-hammer:rotate="rotate"
            v-hammer:rotatestart="rotatestart"
            v-hammer:rotateend="rotateend"
            v-hammer:rotatecancel="rotateend"
            src="../public/imgs/tyx.jpg"
            :style="{transform: rectComputed,'transform-origin': rectOrigin}"
          />

          <div class="page-hint" @click="autoRotate">auto rotate</div>

          <div class="page-hint" @click="snap">snap</div>
        </div>

        <div class="back-content" ref="snapp" id="snapp">
          <img
            class="rect"
            src="../public/imgs/tyx.jpg"
            :style="{transform: rectSnapComputed,'transform-origin': rectOrigin}"
          />
        </div>
      </div>
    </BasePage>
    <BasePage :class="pageClass(2)">
      <div class="page-hint" @click="nextPageClick">长按保存图片</div>
      <img class="snapImage page" :src="src" />
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
import pageTurningManager from './util/page-turning-manager.js';

import html2canvas from 'html2canvas';

import BasePage from './components/BasePage.vue';
import MusicButton from './components/MusicButton.vue';
import PageLoading from './components/PageLoading.vue';
import { setTimeout, setInterval, clearInterval } from 'timers';

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
            pageTurningManager, // 页面跳转管理器
            rectInfo: {
                startScalee: 1,
                scale: 1,
                startX: 0,
                startY: 0,
                x: 0,
                y: 0,
                startAngle: 0,
                lastRotation: 0,
                angle: 0,
                inPinch: false,
                inRotate: false,
                snapScale: 1, // 用于截图元素对比页面显示元素的放大比例，涉及到方块发生位移时，截图元素要对位移进行缩放
            },
            canvasInfo: {
                width: 0,
                height: 0,
            },
            src: '',
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
        rectComputed: function() {
            return `scale(${this.rectInfo.scale})
                translateX(${this.rectInfo.x}px)
                translateY(${this.rectInfo.y}px)
                rotate(${this.rectInfo.angle}deg)`;
        },
        rectSnapComputed: function() {
            let rect = this.rectInfo;

            return `scale(${rect.scale}) 
                translateX(${rect.x * rect.snapScale}px) 
                translateY(${rect.y * rect.snapScale}px) 
                rotate(${rect.angle}deg)`;
        },
        rectOrigin: function() {
            return '50% 50%';
            // let rect = this.rectInfo;
            // return `${50 + rect.x}px ${50 + rect.y}px`;
        },
    },
    created: function() {
        this.pageTurningManager.turnToPage(0);
        this.initBadiduStatistics();
        // this.initBackgroundMusic();
    },
    mounted: function() {
        const { width, height } = getWindowSize();

        // 截图
        let whPercent = Math.round((height / width) * 100) / 100;
        let snapImageWidth = 750;
        this.rectInfo.snapScale =
            Math.round((snapImageWidth / width) * 100) / 100;

        document.body.style.setProperty('--px-height', height + 'px');
        document.body.style.setProperty('--wh-percent', whPercent);
        document.body.style.setProperty(
            '--px-height-snap',
            snapImageWidth * whPercent + 'px'
        );

        document.body.style.setProperty(
            '--px-width-snap',
            snapImageWidth + 'px'
        );

        document.body.style.setProperty(
            '--px-width-snap-rect',
            (100 * snapImageWidth) / width + 'px'
        );

        // 转场动画
        document.body.style.setProperty(
            '--circle-radius',
            Math.ceil(Math.sqrt(height * height + width * width) * 100) / 100 +
                'px'
        );

        // canvas
        const ratio = window.devicePixelRatio;
        this.canvasInfo.width = width * ratio;
        this.canvasInfo.height = height * ratio;
    },
    methods: {
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
        pinch(ev) {
            // console.log('pinch');
            // console.log(ev);
            this.rectInfo.scale = ev.scale * this.rectInfo.startScale;
        },
        pinchin() {
            // console.log('pinchin');
            this.rectInfo.scale = Math.max(0.5, this.rectInfo.scale);
        },
        pinchout() {
            // console.log('pinchout');
            // this.rectInfo.scale = Math.min(2.5, this.rectInfo.scale);
        },
        pinchstart() {
            this.rectInfo.inPinch = true;
            this.rectInfo.startScale = this.rectInfo.scale;
        },
        pinchend() {
            console.log('pinchend');
            setTimeout(() => {
                this.rectInfo.inPinch = false;
            }, 200);
        },
        panmove(ev) {
            if (this.rectInfo.inPinch) {
                return;
            }

            console.log('pan');
            let rect = this.rectInfo;
            // console.log(ev);
            rect.x = rect.startX + ev.deltaX / rect.scale;
            rect.y = rect.startY + ev.deltaY / rect.scale;
        },
        panstart() {
            if (this.rectInfo.inPinch) {
                return;
            }
            console.log('panstart');
            let rect = this.rectInfo;
            rect.startX = rect.x;
            rect.startY = rect.y;
        },
        rotate(ev) {
            // console.log('rotate');
            console.log(`rotate, angle: ${ev.angle} rotation: ${ev.rotation}`);
            let rect = this.rectInfo;
            // rect.angle = rect.startAngle + ev.rotation;
            rect.angle += ev.rotation - rect.lastRotation;
            rect.lastRotation = ev.rotation;
        },
        rotatestart(ev) {
            let rect = this.rectInfo;
            console.log(
                `rotate start, angle: ${ev.angle} rotation: ${ev.rotation}`
            );
            rect.inRotate = true;
            rect.startAngle = rect.angle;
            rect.lastRotation = ev.rotation;
        },
        rotateend(ev) {
            console.log(
                `rotate end, angle: ${ev.angle} rotation: ${ev.rotation}`
            );
            setTimeout(() => {
                this.rectInfo.inRotate = false;
            }, 200);
        },
        autoRotate() {
            if (this.rectInterval) {
                window.clearInterval(this.rectInterval);
                this.rectInterval = null;
            } else {
                this.rectInterval = window.setInterval(() => {
                    this.rectInfo.angle += 1;
                    if (this.rectInfo.angle > 360) {
                        this.rectInfo.angle = 5;
                    }
                }, 1000 / 60);
            }
        },
        snap() {
            console.log(this.$refs.snapp);
            html2canvas(document.getElementById('snapp'), { scale: 2 }).then(
                canvas => {
                    console.log(canvas);
                    // var ctx = this.$refs.canvas.getContext('2d');
                    // var img = new Image();
                    // img.onload = () => {
                    //     console.log('load complete');
                    //     this.pageTurningManager.turnToPage(2, 500);
                    //     ctx.drawImage(img, 0, 0);
                    // };
                    // img.src = canvas.toDataURL();
                    this.src = canvas.toDataURL();
                    this.pageTurningManager.turnToPage(2, 500);
                }
            );
        },
    },
};
</script>

<style lang="scss">
@import url('./style/common.scss');
body {
    --rem-height: 0rem;
    --px-height: 0px;
    --px-width-snap: 0px;
    --px-height-snap: 0px;
    --circle-radius: 0px;
    --wh-percent: 1;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    // margin-top: 60px;
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
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .rect {
        width: 100px;
        height: 100px;
        // background-color: red;
        transform-origin: 50% 50%;
        // background-image: url('../public/imgs/tyx.jpg');
        // background-size: 100% 100%;
    }
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

#canvas {
    width: 100%;
    height: 100%;
}

.content {
    @extend .common-bg;
    background-image: url('../public/imgs/1.jpg');
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    z-index: 5;
    opacity: 1;
    .rect {
        position: absolute;
        left: 50%;
        height: 50%;
        width: 100px;
        height: 100px;
        // background-color: red;
        transform-origin: 50% 50%;
        // background-image: url('../public/imgs/tyx.jpg');
        // background-size: 100% 100%;
    }
}

.back-content {
    @extend .common-bg;
    z-index: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: var(--px-width-snap);
    height: var(--px-height-snap);
    background-image: url('../public/imgs/1.jpg');
    .rect {
        position: absolute;
        left: 50%;
        height: 50%;
        width: var(--px-width-snap-rect);
        height: var(--px-width-snap-rect);
        transform-origin: 50% 50%;
    }
}
</style>
