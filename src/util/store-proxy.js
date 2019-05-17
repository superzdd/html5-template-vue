// var arrayHandler = {
//     get: function (target, property) {
//         if (property === 'push') {
//             console.log(`array push`);
//             return Reflect.get(target, property);
//         }
//     }
// }

var store = {
    debug: true,
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
        process.env.BASE_URL + 'imgs/12.jpg'
    ],
    testArr: [],
};

var proxy = new Proxy(store, {
    get: function (target, property) {
        if (property in target) {
            // console.log(`store: get ${property}`);
            return Reflect.get(target, property);
        } else {
            // throw new ReferenceError("Property \"" + property + "\" does not exist.");
            console.log(`store: cant get property！`);
        }
    },
    set(target, key, value) {
        console.log(`store: set ${key} triggered with ${value}`);
        return Reflect.set(...arguments);
    }
});

export default proxy;