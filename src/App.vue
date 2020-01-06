<template>
    <div id="app" class="page">
        <PageLoading v-if="pageLoadingShow" @loadComplete="handleLoadComplete"></PageLoading>
        <BasePage :class="pageClass(1)" @commonclick="nextPageClick">
            <div class="page1-bg">
                <div class="page-hint">Page 1, click go to next page</div>
            </div>
        </BasePage>
        <BasePage :class="pageClass(2)">
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
                <div class="page-hint" @click="movieClipPlayClickHandler">
                    {{
                    movieClipInfo.startPlay
                    ? '点击暂停序列帧'
                    : '点击开始序列帧'
                    }}
                </div>
                <div class="page-hint" @click="movieClipLoopClickHandler">
                    {{
                    movieClipInfo.loop
                    ? '点击序列帧单次播放'
                    : '点击序列帧循环播放'
                    }}
                </div>
                <div class="page-hint" @click="movieClipReverseClickHandler">
                    {{
                    movieClipInfo.reversePlay
                    ? '切换到正序播放'
                    : '切换到倒序播放'
                    }}
                </div>
                <div class="page-hint" @click="nextPageClick">Page 2, click go to next page</div>
            </div>
        </BasePage>
        <!-- <BasePage :class="pageClass(3)" @commonclick="nextPageClick">
            <div class="page3-bg">
                <div class="page-hint">Page 3, click go to next page</div>
            </div>
        </BasePage>-->
        <UploadPage :class="pageClass(3)"></UploadPage>
        <BasePage :class="pageClass(4)" @commonclick="page4click">
            <div class="page4-bg">
                <div class="page-hint">Page 4, click back to page1</div>
            </div>
        </BasePage>
        <MusicButton
            @backgroundMusicPause="backgroundMusicPauseHandler"
            @backgroundMusicPlay="backgroundMusicPlayHandler"
        ></MusicButton>

        <div v-if="showBgMusicHint" class="hint-bg-music-box">
            <div class="all-black"></div>

            <div class="dialog-container">
                <p>是否播放背景音乐</p>
                <div class="border-split"></div>
                <div class="button-container">
                    <div class="confirm" @click="bgMusicConfirmHandler">是</div>
                    <div class="cancel" @click="bgMusicCancelHandler">否</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import baiduStatistics from './util/baidu-statistics.js';
import navi from './util/nav-controller.js';
import { getWindowSize } from './util/rem.js';
import pageTurningManager from './util/page-turning-manager.js';
import BGMusicSoundJs from './util/bgMusicSoundJs.js';
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
            bgMusic: null,
            backgroundMusicAutoPlay: true,
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
            showBgMusicHint: false, // 用于在非微信环境打开音乐提示按钮
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

        document.body.style.setProperty('--px-total-height', height + 'px');
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
        startPlayBackgroundMusic() {
            // window.createjs.Sound.registerSound(
            //     process.env.BASE_URL + 'imgs/bgmusic.mp3',
            //     'sound'
            // ); // 注意,这句registerSound必须写在WeixinJSBridgeReady回调函数内才行,否则下方window.createjs.Sound.play就会无效

            // if (!force) {
            //     let intervalInstance = setInterval(function() {
            //         if (app.backgroundInfo.loadComplete) {
            //             clearInterval(intervalInstance);
            //             console.log('play');
            //             app.backgroundInfo.instance = window.createjs.Sound.play(
            //                 'sound'
            //             );
            //             window.store.setBackgroundMusicPlaying();
            //         }
            //     }, 10);
            // } else {
            //     console.log('startPlayBackgroundMusic: force play!');
            //     app.backgroundInfo.instance = window.createjs.Sound.play(
            //         'sound'
            //     );
            //     window.store.setBackgroundMusicPlaying();
            // }

            this.bgMusic.play();
        },
        initBackgroundMusic() {
            // 初始化背景音乐
            // 这里在业务上，主要要区分微信和非微信的浏览器环境的区别。
            // 因为在微信环境里，微信提供了接口可以实现自动播放音乐。
            // 在其他环境里，尤其是移动端手机浏览器环境里，是不能实现自动播放音乐的，这里最起码的做法是弹窗示意用户，是否播放背景音乐
            this.bgMusic = new BGMusicSoundJs();

            if (navi.isWX) {
                document.addEventListener(
                    'WeixinJSBridgeReady',
                    () => {
                        console.log('WeixinJSBridgeReady');
                        this.bgMusic.load();
                    },
                    false
                );
            } else {
                this.showBgMusicHint = true;
                // this.bgMusic.load();
            }

            // if (!navi.isWX) {
            //     window.createjs.Sound.registerSound(
            //         process.env.BASE_URL + 'imgs/bgmusic.mp3',
            //         'sound'
            //     ); // 注意,这句registerSound必须写在WeixinJSBridgeReady回调函数内才行,否则下方window.createjs.Sound.play就会无效
            // } else {
            // }

            // window.createjs.Sound.on('fileload', loadHandler, this);
            // let appInstance = this;
            // function loadHandler(event) {
            //     console.log(`music load complete: ${JSON.stringify(event)}`);
            //     appInstance.backgroundInfo.loadComplete = true;

            //     if (!navi.isWX) {
            //         appInstance.showBgMusicHint = true;
            //     } else {
            //         document.addEventListener(
            //             'WeixinJSBridgeReady',
            //             () => {
            //                 console.log('WeixinJSBridgeReady');
            //                 appInstance.startPlayBackgroundMusic(appInstance);
            //             },
            //             false
            //         );
            //     }
            // }

            // if (navi.isWX) {
            //     document.addEventListener(
            //         'WeixinJSBridgeReady',
            //         () => {
            //             console.log('WeixinJSBridgeReady');
            //             // startPlayBackgroundMusic();
            //             this.startPlayBackgroundMusic(appInstance);
            //         },
            //         false
            //     );
            // } else {
            //     // if (confirm('是否播放背景音乐？')) {
            //     //     let bgMusic = document.getElementById('bg-music');
            //     //     bgMusic.play();
            //     //     console.log('user allow to play music');
            //     //     // 强制播放
            //     //     // this.startPlayBackgroundMusic(appInstance, true);
            //     // }
            //     // this.showBgMusicHint = true;
            // }
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
        bgMusicConfirmHandler() {
            // this.bgMusicCancelHandler();
            // // let bgMusic = document.getElementById('bg-music');
            // // bgMusic.play();
            // this.startPlayBackgroundMusic(this, true);

            this.bgMusicCancelHandler();
            this.bgMusic.load();
            // this.startPlayBackgroundMusic(this, true);
        },
        bgMusicCancelHandler() {
            this.showBgMusicHint = false;
        },
    },
};
</script>

<style lang="scss">
body {
    --rem-total-height: 0rem;
    --px-total-height: 0px;
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

.hint-bg-music-box {
    position: fixed;
    width: 50vw;
    height: 40vw;
    left: 25vw;
    top: calc(0.3 * var(--px-total-height));
    z-index: 99;

    .all-black {
        background-color: #000000;
        opacity: 0.5;
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: -25vw;
        top: calc(-0.3 * var(--px-total-height));
        z-index: 0;
    }

    .dialog-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.3rem;
        background-color: #ffffff;
        border-radius: 10px;
        z-index: 5;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);

        p {
            height: 70%;
            line-height: 70%;
            width: 100%;
            font-weight: bold;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .border-split {
            width: 90%;
            height: 0;
            border-bottom: solid 1px #cccccc;
            transform: translateY(1px);
        }

        .button-container {
            width: 100%;
            height: 30%;
            display: flex;

            div {
                width: 50%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .cancel {
                background-color: #cccccc;
                color: #ffffff;
                border-bottom-right-radius: 10px;
            }
        }
    }
}
</style>
