<template>
    <div id="app" class="page">
        <PageLoading v-if="pageLoadingShow" @loadComplete="handleLoadComplete"></PageLoading>
        <BasePage v-if="isCurrentPage(1)" :class="pageClass(1)" @commonclick="nextPageClick">
            <div class="page1-bg">
                <div class="page-hint">Page 1, click go to next page</div>
            </div>
        </BasePage>
        <BasePage v-if="isCurrentPage(2)" :class="pageClass(2)">
            <div class="page2-bg">
                <MovieClip
                    class="movie-clip-demo"
                    :imageArray="movieClipInfo.imageArray"
                    :fps="movieClipInfo.fps"
                    :startPlay="movieClipInfo.startPlay"
                    :loop="movieClipInfo.loop"
                    :reversePlay="movieClipInfo.reversePlay"
                    :pause="movieClipInfo.pause"
                    @frameEnd="playToEnd"
                ></MovieClip>
                <div
                    class="page-hint"
                    @click="movieClipPlayClickHandler"
                >{{movieClipInfo.startPlay?'点击暂停序列帧':'点击开始序列帧'}}</div>
                <div
                    class="page-hint"
                    @click="movieClipLoopClickHandler"
                >{{movieClipInfo.loop?'点击序列帧单次播放':'点击序列帧循环播放'}}</div>
                <div
                    class="page-hint"
                    @click="movieClipReverseClickHandler"
                >{{movieClipInfo.reversePlay?'切换到正序播放':'切换到倒序播放'}}</div>
                <div class="page-hint" @click="nextPageClick">Page 2, click go to next page</div>
            </div>
        </BasePage>
        <!-- <BasePage :class="pageClass(3)" @commonclick="nextPageClick">
            <div class="page3-bg">
                <div class="page-hint">Page 3, click go to next page</div>
            </div>
        </BasePage>-->
        <UploadPage v-if="isCurrentPage(3)"></UploadPage>
        <BasePage v-if="isCurrentPage(4)" :class="pageClass(4)" @commonclick="page4click">
            <div class="page4-bg">
                <div class="page-hint">Page 4, click back to page1</div>
            </div>
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
// import {wxShare} from './util/wechat-share.js'

import BasePage from './components/BasePage.vue';
import MusicButton from './components/MusicButton.vue';
import PageLoading from './components/PageLoading.vue';
import MovieClip from './components/MovieClip.vue';
import UploadPage from './components/UploadPage.vue';

export default {
    name: 'app',
    components: {
        BasePage,
        PageLoading,
        MusicButton,
        MovieClip,
        UploadPage,
    },
    data: function() {
        return {
            sharedState: window.store.state,
            backgroundInfo: {
                loadComplete: false, // 背景音乐素材是否加载完毕
                instance: null, // 背景音乐实例
            },
            backgroundMusicAutoPlay: false,
            pageTurningManager, // 页面跳转管理器
            publicPath: process.env.BASE_URL,
            movieClipInfo: {
                imageArray: [],
                fps: 30,
                startPlay: false,
                loop: false,
                reversePlay: false,
                pause: false,
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
        this.pageTurningManager.turnToPage(0);
        this.initBadiduStatistics();
        if (this.backgroundMusicAutoPlay) {
            this.initBackgroundMusic();
        }
        this.initMovieClipImageArray();
    },
    mounted: function() {
        const { width, height } = getWindowSize();

        document.body.style.setProperty('--px-height', height + 'px');
        document.body.style.setProperty(
            '--circle-radius',
            Math.ceil(Math.sqrt(height * height + width * width) * 100) / 100 +
                'px'
        );

        // wxShare();
    },
    methods: {
        handleLoadComplete() {
            this.pageTurningManager.turnToPage(1, 500);
        },
        nextPageClick() {
            this.pageTurningManager.turnToNextPageAutomatically();
        },
        isCurrentPage(i) {
            return this.pageTurningManager.isCurrentPage(i);
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
        /**
         * 初始化序列帧数组
         */
        initMovieClipImageArray() {
            let ret = [];
            let imageBaseUrl = this.publicPath + 'imgs/movieclip/mc_';
            for (let i = 1; i <= 10; i++) {
                ret.push(`${imageBaseUrl}${i}.jpg`);
            }

            this.movieClipInfo.imageArray = ret;
        },
        movieClipPlayClickHandler() {
            if (this.movieClipInfo.startPlay) {
                this.movieClipInfo.pause = !this.movieClipInfo.pause;
            } else {
                this.movieClipInfo.startPlay = true;
            }
        },
        movieClipLoopClickHandler() {
            this.movieClipInfo.loop = !this.movieClipInfo.loop;
        },
        movieClipReverseClickHandler() {
            this.movieClipInfo.reversePlay = !this.movieClipInfo.reversePlay;
        },
        playToEnd() {
            if (!this.movieClipInfo.loop) {
                this.movieClipInfo.startPlay = false;
                this.movieClipInfo.pause = false;
            }
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
    flex-direction: column;
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
    margin: 2vw;
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

.movie-clip-demo {
    width: 40vw;
    height: 25vw;
}
</style>
