<template>
    <BasePage @commonclick="nextPageClick">
        <div class="page4-bg">
            <div class="page-hint">Page 4, click go back to Page1</div>
        </div>
    </BasePage>
</template>

<script>
// @ is an alias to /src
import BasePage from '@/components/BasePage.vue';

export default {
    name: 'page4',
    components: {
        BasePage,
    },
    methods: {
        nextPageClick() {
            this.$router.push({
                name: 'manager',
                params: { pageEvent: 'page4Complete' },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import url('../style/app.scss');

.page4-bg {
    @extend %common-bg;
    background-image: url('../../public/imgs/4.jpg');
}
</style>
