import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import PageLoading from './views/PageLoading.vue';
import Page1 from './views/Page1.vue';
import Page2 from './views/Page2.vue';
// import Page3 from './views/Page3.vue';
// import Page4 from './views/Page4.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'loading',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: PageLoading,
        },
        {
            path: '/manager',
            name: 'manager',
            redirect: to => {
                console.log(`manager triggered: ${JSON.stringify(to)}`);

                const eventName = to.params.pageEvent;

                switch (eventName) {
                    case 'loadComplete':
                        return '/p1';
                    case 'page1Complete':
                        return '/p2';
                    // case 'page2Complete':
                    //     return '/p3';
                    // case 'page3Complete':
                    //     return '/p4';
                    // case 'page4Complete':
                    //     return '/p1';
                    default:
                        return '/about';
                }
            },
        },
        {
            path: '/p1',
            name: 'p1',
            component: Page1,
        },
        {
            path: '/p2',
            name: 'p2',
            component: Page2,
        },
        // {
        //     path: '/p3',
        //     name: 'p3',
        //     component: Page3,
        // },
        // {
        //     path: '/p4',
        //     name: 'p4',
        //     component: Page4,
        // },
        {
            path: '/home',
            name: 'home',
            component: Home,
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "about" */ './views/About.vue'),
        },
    ],
});
