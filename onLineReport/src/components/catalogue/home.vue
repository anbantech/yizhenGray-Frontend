<!--
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-21 14:14:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-07-25 15:07:46
 * @FilePath: /yizhen-frontend/report/src/components/catalogue/home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class='reportHome'>
        <div class="nav">
            <div class="reportHomeTitle">
                <span> YIZHEN analysis REPORT </span>
                <span>易侦测试报告</span>
            </div>
            <!-- <div class="report_bottom">
                <span class="report_platform">
                    报告时间:{{ homeDataTestOverview.create_time }}
                </span>
            </div> -->
        </div>

        <div style="margin-top: 35px">
            <span class="report_progressName">项目:{{ homeDataTestOverview.project_name }}</span>
            <div style="margin-top:9px">
                <span class="report_platform">被测设备:{{ homeDataTestOverview.device_name }}</span>
                <span class="report_platform">测试平台:{{ homeDataTestOverview.platform }} </span>
            </div>
        </div>


        <div class="bottom_line">   
        </div>
    </div>
</template>

<script>
export default {
    props: {
        homeDataTestOverview: {
            type: [],
            default: ()=>[],
        },
    },
    data() {
      
    },
    methods: {},
};
</script>

<style lang="stylus" scoped>
   .reportHome{
      padding-left:48px
   }
   .nav{
     width:100%;
     display:flex;
     justify-content:space-between;
   }
   .report_progressName{
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 28px;
      color: #222222;
   }

   .report_platform{
     display: inline-block;
     margin-right:24px;
     font-style: normal;
     font-weight: 400;
     font-size: 12px;
     line-height: 20px;
     color: #999999;
   }
   .reportHomeTitle{
     display: flex;
     flex-direction: column;
     margin-top:80px ;
   }
   .reportHomeTitle>span:nth-child(2){
     font-style: normal;
     font-weight: 700;
     font-size: 38px;
     line-height: 46px;
     color: #0077FF;
   }
   .reportHomeTitle>span:nth-child(1){
     font-weight: 400;
     font-size: 12px;
     line-height: 22px;
     text-transform: uppercase;
     color: #999999;
   }
   .report_bottom{
     display:inline-block;
     margin-top:81px;
   }
   .bottom_line{
      width :100%;
      margin:56px 0  0  0 ;
   }
</style>
