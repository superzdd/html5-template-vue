<template>
    <BasePage @commonclick="nextPageClick">
        <div class="page1-bg">
            <div class="page-hint">Page 1, click go to next page</div>
        </div>
    </BasePage>
</template>

<script>
// @ is an alias to /src
import BasePage from '@/components/BasePage.vue';

export default {
    name: 'page1',
    components: {
        BasePage,
    },
    methods: {
        nextPageClick() {
            this.$router.push({
                name: 'manager',
                params: { pageEvent: 'page1Complete' },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../style/app.scss';

%common-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    background-size: cover;
}

.page1-bg {
    @extend %common-bg;
    background-image: url('../../public/imgs/1.jpg');
}
</style>
