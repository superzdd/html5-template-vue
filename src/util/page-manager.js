// 翻页管理器
class PageManager {
    constructor() {
        this.currentIndex = null; // 当前页面序号
        this.nextIndex = null; // 下一页面序号
        this.nextDuration = 0; // 设置nextIndex后多少毫秒后，nextIndex赋值为currentIndex
    }

    /**
     * 翻到指定页
     * @param {Number} pageIndex
     * @param {Number} duration
     */
    turnToPage(pageIndex, duration = 0) {
        if (duration <= 0) {
            this.currentIndex = pageIndex;
            this.nextIndex = null;
            return new Promise(res => {
                res();
            });
        }

        this.nextIndex = pageIndex;

        return new Promise(res => {
            setTimeout(() => {
                console.log(`this is ${JSON.stringify(this)}`);
                this.nextIndex = null;
                this.currentIndex = pageIndex;
                res();
            }, duration);
        });
    }

    /**
     * 自动翻到下一页，如果上次翻页有动画延时，那这次会继续执行动画延时
     */
    turnToNextPageAutomatically() {
        return this.turnToPage(++this.currentIndex, this.nextDuration);
    }

    /**
     * 设置自动翻到下一页的延迟时间
     */
    setAutoNextDuration(val) {
        this.nextDuration = val;
    }

    /**
     * 返回当前页面是否显示
     * @param {Number} index
     */
    isPageVisible(index) {
        if (isNaN(index)) {
            return false;
        }

        return index == this.currentIndex || index == this.nextIndex;
    }

    toString() {
        console.log(
            `page manager: ${JSON.stringify({
                currentIndex: this.currentIndex,
                nextIndex: this.nextIndex,
                nextDuration: this.nextDuration,
            })}`
        );
    }
}

let _pageManager = new PageManager();

export default _pageManager;
