<template>
    <BasePage @commonclick="nextPageClick">
        <div class="page2-bg">
            <div class="page-hint">Page 2, click go to next page</div>
        </div>
    </BasePage>
</template>

<script>
// @ is an alias to /src
import BasePage from '@/components/BasePage.vue';

export default {
    name: 'page2',
    components: {
        BasePage,
    },
    methods: {
        nextPageClick() {
            this.$router.push({
                name: 'manager',
                params: { pageEvent: 'page2Complete' },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../style/app.scss';
.page2-bg {
    @extend %common-bg;
    flex-direction: column;
    background-image: url('../../public/imgs/2.jpg');
}
</style>
