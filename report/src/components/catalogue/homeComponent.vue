<!--
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-21 14:14:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-10-08 17:42:55
 * @FilePath: /yizhen-frontend/report/src/components/catalogue/homeComponent.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class='reportColumn'>
        <h1 class="reportColumn_title">{{ title }}</h1>
        <div v-for="(item, index) in homeData" :key="index" class="reportConcent">
            <div v-for="(key,value,number) in item" :key='number' class="reportConcent_row">
                <span>
                    {{key}}
                </span>
                <span style="color: #60688C">
                    {{ value === 'error_rate' ? ( homeDataTestOverview[value] ? `${Number(((homeDataTestOverview[value]) * 100).toFixed(4))}%` : '0%') :
                    homeDataTestOverview[value]}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>


export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        homeDataTestOverview: {
            type: [],
            default: ()=>[],
        },
        cloumnType:{
            type:String,
            default:''
        }
    },
   created() {
        this.cloumnType === 'homeDataTestOverviewType' ?
            this.homeData = [{ 'platform': '测试平台' }, { 'test_time': '测试时间' }, { 'create_time': '报告生成' }]
            : this.cloumnType === 'homeDataTestPlanType'
                ? this.homeData = [{ 'task_name': '任务名称' }, { 'num': '实例编号' }, { 'work_time': '工作时长设定' }]
                : this.cloumnType === 'homeDataTestSummaryType'
                    ? this.homeData = [{ 'statement_coverage': '语句覆盖率' }, { 'branch_coverage': '分支覆盖率' }, { 'total': '用例总数' }, { 'error_count': '异常用例数' }, { 'defects_count': '缺陷数量' }]
                    : []
    },
    data() {
        return {
            homeData :[]
        };
    },
    methods: {},
};
</script>

<style lang="stylus" scoped>
   .reportColumn{
     padding: 0px 48px;
   }
   .reportHeader{
      height:69px;
      display:flex;
      justify-content: space-between;
      align-items: center;
      padding:0 32px;
   }
   .reportColumn_title{
    display:inline-block
    padding: 28px  0 20px 0;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    color: #434343;
   }
  .reportConcent{
   
  }
  .reportConcent:nth-child(even){
    padding:0 8px;
    background: #EEEFF3;
  }
  .reportConcent:nth-child(odd){
    padding:0 8px;
    background:#FFFFFF;
  }
  .reportConcent_row{
    height: 22px;
    display: flex;
    justify-content: space-between;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #595959;
  }
</style>