var store = {
    debug: true,
    state: {
        message: 'Hello!',
        pageIndex: 0,
        // 用于加载Loading页的素材列表
        sourceArrayPreLoad: [
            process.env.BASE_URL + 'imgs/bg-loading.jpg'
        ],
        // 用于加载主内容的素材列表
        sourceArrayLoading: [
            process.env.BASE_URL + 'imgs/1.jpg',
            process.env.BASE_URL + 'imgs/2.jpg',
            process.env.BASE_URL + 'imgs/3.jpg',
            process.env.BASE_URL + 'imgs/4.jpg',
            process.env.BASE_URL + 'imgs/5.jpg',
            process.env.BASE_URL + 'imgs/6.jpg',
            process.env.BASE_URL + 'imgs/7.jpg',
            process.env.BASE_URL + 'imgs/8.jpg',
            process.env.BASE_URL + 'imgs/9.jpg',
            process.env.BASE_URL + 'imgs/10.jpg',
            process.env.BASE_URL + 'imgs/11.jpg',
            process.env.BASE_URL + 'imgs/12.jpg',
            process.env.BASE_URL + 'imgs/13.jpg',
            process.env.BASE_URL + 'imgs/14.jpg',
            process.env.BASE_URL + 'imgs/15.jpg',
            process.env.BASE_URL + 'imgs/16.jpg',
            process.env.BASE_URL + 'imgs/17.jpg',
            process.env.BASE_URL + 'imgs/18.jpg',
            process.env.BASE_URL + 'imgs/19.jpg',
            process.env.BASE_URL + 'imgs/20.jpg'
        ],
    },
    setMessageAction(newValue) {
        if (this.debug) console.log('setMessageAction triggered with', newValue);
        this.state.message = newValue;
    },
    clearMessageAction() {
        if (this.debug) console.log('clearMessageAction triggered');
        this.state.message = '';
    },
    setPageIndex(newValue) {
        if (this.debug) console.log('setPageIndexAction triggered with', newValue);
        this.state.pageIndex = newValue;
    },
    setPageIndexAdd() {
        var newValue = this.state.pageIndex + 1;
        if (this.debug) console.log('setPageIndexAction triggered with', newValue);
        this.state.pageIndex = newValue;
    }
};

export default store;