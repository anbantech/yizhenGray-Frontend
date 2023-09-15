<!--
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-21 14:14:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-07-25 17:18:59
 * @FilePath: /yizhen-frontend/report/src/layout/reportHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class='reportHeader'>
    <div class='reportHeader_left'>
      <img :src='leftLogo' alt="">
    </div>
    <div class="line">

    </div>
    <span class="header_titilechart">易复测试报告</span>
  </div>
</template>

<script>
export default {
  props: {
    urlList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      leftLogo: require('../image/leftLogo.svg'),
        rightLogo:require('../image/rightLogo.svg'),
    };
  },
  methods: {},
};
</script>

<style lang="stylus" scoped>
   .reportHeader{
      width :100%;
      height:69px;
      display:flex;
      position: fixed;
      top:0;
      align-items: center;
      padding:0 32px;
      border-style:solid;
      border-top:none;
      border-left:none;
      border-right:none;
      border-bottom:solid 1px #d9d9d9;
      background:#fff;
      z-index :999;
   }
   .line{
     height:14px;
     background: #8C8C8C;
     border: 1px solid #8C8C8C;
     margin:0 12px;
     margin-bottom:5px;
   }
  .header_titilechart{
    display:inline-block;
    margin-bottom:3px;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #8C8C8C;
   }
</style>
