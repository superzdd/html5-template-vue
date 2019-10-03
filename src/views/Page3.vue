<template>
    <BasePage @commonclick="nextPageClick">
        <div class="page3-bg">
            <div class="page-hint">Page 3, click go to next page</div>
        </div>
    </BasePage>
</template>

<script>
// @ is an alias to /src
import BasePage from '@/components/BasePage.vue';

export default {
    name: 'page3',
    components: {
        BasePage,
    },
    methods: {
        nextPageClick() {
            this.$router.push({
                name: 'manager',
                params: { pageEvent: 'page3Complete' },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import url('../style/app.scss');
.page3-bg {
    @extend %common-bg;
    background-image: url('../../public/imgs/3.jpg');
}
</style>
