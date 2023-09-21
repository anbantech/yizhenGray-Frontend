<!--
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-09-23 10:20:37
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-26 10:42:27
 * @FilePath: /yizhen-frontend/onLineReport/src/components/imageList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="margin-top: 24px;text-align: center">
    <h1 class="tableTitle">6、动态调用图</h1>
    <el-image class="img" :fit="scale-down" :src="imgUrl" :preview-src-list="imgList"></el-image>
    <span class="footerTitle ">点击查看大图</span>
  </div>
</template>

<script>
import imageControl from './imageComponents/imageControl.vue'
export default {
  components: {
    imageControl
  },
  props: {
    urlList: {
      type:String,
      default:''
    }
  },
  data() {
    return {
      showImg: false,
      // imgList: ['data:image/jpg;base64,' + this.urlList]
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    changeImage(){
      this.showImg = true
    },
    cancel(val){
      this.showImg = val
    }
  },
  computed:{
    imgUrl(){
      return 'data:image/jpg;base64,' + this.urlList
    },
    imgList(){
      return ['data:image/jpg;base64,' + this.urlList]
    }
  },
}
</script>

<style lang="stylus" scoped>
.tableTitle{ 
  text-align: left !important;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
}
.footerTitle{
  text-align: center;
  display: inline-block;
  margin:15px auto;
  font-style: normal;
  font-weight: 400;
  font-size: 6px;
  line-height: 150%;
  text-align: center;
  color: #333333;
}
.img{
  width:100%;
  height:100%;
  overflow-x: scroll;
}
</style>
