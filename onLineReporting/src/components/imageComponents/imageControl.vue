<template>
    <!-- 过渡动画 -->

    <el-image style="width: 100px; height: 100px" @click="cancelImageShow"  :preview-src-list="img">
    </el-image>

</template>
<script>
export default {
    props: {
      img:{
            type: Array,
            default: () => []
      }  
    },
    methods:{
        cancelImageShow(){
           this.$emit('cancel',false)
        }
    }
}
</script>
<style scoped>
/*动画*/
.fade-enter-active,
.fade-leave-active {
    transition: all .2s linear;
    transform: translate3D(0, 0, 0);
}

.fade-enter,
.fade-leave-active {
    transform: translate3D(100%, 0, 0);
}

/* bigimg */
.img-view {
    position: inherit;
    width: 100%;
    height: 100%;
}

/*遮罩层样式*/
.img-view .img-layer {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    overflow: hidden;
}
/*不限制图片大小，实现居中*/
.img-view .img img {
    width: 1200px;
    height: 500px;
    display: block;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;
}
</style>