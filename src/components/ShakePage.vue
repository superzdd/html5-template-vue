<template>
    <BasePage>
        <div class="abs page shakePage">
            <h1>摇一摇示意页面</h1>
            <h2>注意IOS环境下，重力感应有两个限制条件</h2>
            <h3>1. https</h3>
            <h3>2. 原生浏览器中，需要调用ios的api,这样才能“安全”的调用</h3>
            <h3>ps: 安卓不会有上面的限制</h3>
            <div class="shake-container">
                <h2>摇一摇手机，如果成功的话，下方图片会晃动</h2>
                <img src="../../public/imgs/logo.png" :class="{shaking:deviceIsShaking}" alt="logo" />
            </div>
            <div class="page-hint">Page Shake, click go to next page</div>
        </div>
    </BasePage>
</template>

<script>
// 摇一摇示意页面
import BasePage from './BasePage.vue';
import navi from '../util/nav-controller.js';
export default {
    name: 'shakePage',
    components: {
        BasePage,
    },
    data() {
        return {
            deviceIsShaking: false, // 标记设备正在晃动
            resetShakingTimeoutHandler: null,
        };
    },
    computed: {},
    created() {},
    mounted() {
        console.log(`shake page: devicemotion init`);
        navi.output();
        if (navi.isIos && !navi.isWX) {
            console.log('shake page: ios device motion permission');
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response == 'granted') {
                        window.addEventListener(
                            'devicemotion',
                            this.deviceMotionHandler,
                            false
                        );
                    }
                })
                .catch(console.error);
        } else {
            if (window.DeviceMotionEvent) {
                window.addEventListener(
                    'devicemotion',
                    this.deviceMotionHandler,
                    false
                );
                console.log(`shake page: devicemotion init success`);
            } else {
                console.log(`shake page: devicemotion init failure`);
            }
        }
    },
    methods: {
        deviceMotionHandler(e) {
            let acc = e.accelerationIncludingGravity;
            //获取devicemotion的xyz变化
            let x = acc.x;
            let y = acc.y;
            let z = acc.z;
            if (x > 30 || y > 30 || z > 30) {
                console.log(`shake page: shaking!!!`);
                this.setShaking();
            }
        },
        setShaking() {
            this.deviceIsShaking = true;
            this.resetShaking();
        },
        resetShaking() {
            if (this.resetShakingTimeoutHandler) {
                window.clearTimeout(this.resetShakingTimeoutHandler);
            }

            this.resetShakingTimeoutHandler = setTimeout(() => {
                this.deviceIsShaking = false;
            }, 1000);
        },
    },
};
</script>

<style lang="scss" scoped>
.shakePage {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-size: 0.2rem;

    h3 {
        width: 60vw;
        text-align: left;
    }
}

.shake-container {
    width: 300px;
    height: 300px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.page-hint {
    position: relative;
    background-color: #ffffff;
    color: #000000;
    width: 75vw;
    height: 10vw;
    font-size: 15px;
    line-height: 10vw;
    text-align: center;
    margin: 2vw;
}

.shaking {
    animation: shake 0.5s infinite 0.5s;
}

@keyframes shake {
    0% {
        transform: rotate(0deg);
    }
    12% {
        transform: rotate(20deg);
    }
    36% {
        transform: rotate(-20deg);
    }
    50% {
        transform: rotate(0deg);
    }
    62% {
        transform: rotate(20deg);
    }
    86% {
        transform: rotate(-20deg);
    }
    100% {
        transform: rotate(0deg);
    }
}
</style>
