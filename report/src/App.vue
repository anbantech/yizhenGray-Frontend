<!--
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-21 14:14:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-26 10:39:41
 * @FilePath: /yizhen-frontend/report/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app">
    <reportHeader />
    <div class="main">
      <div class="concentBody">
        <!-- <Home :homeDataTestOverview='homeData' /> -->
        <div>
          <div id='one' style="padding-top: 70px;margin-top: -70px;">
            <HomeComponent :homeDataTestOverview='homeDataTestOverview' title="一、测试概述"
              cloumnType="homeDataTestOverviewType" />
          </div>
          <div id='two' style="padding-top: 70px;margin-top: -70px;">
            <HomeComponent :homeDataTestOverview='homeDataTestPlan' title="二、测试方案" cloumnType="homeDataTestPlanType" />
          </div>
          <div id='three' style="padding-top: 70px;margin-top: -70px;">
            <HomeComponent :homeDataTestOverview='homeDataTestSummary' title="三、测试总结"
              cloumnType="homeDataTestSummaryType" />
          </div>
          <div id='four' style="padding-top: 70px;margin-top: -70px;">
            <HomeTestDetail :table-data="homeDataTestDetail" :progress.sync="progress" title="四、测试详情" />
          </div>
        </div>
        <div class="statistics" v-if='isShow'>
          <div id="five" style="padding-top: 70px;margin-top: -70px;"></div>
          <h1 class="result">五、测试统计结果</h1>
          <div id="first" style="padding-top: 70px;margin-top: -70px;">
            <coverTable  :table-data="tableData.coverData"></coverTable>
          </div>
          <div id="second" style="padding-top: 70px;margin-top: -70px;">
            <performanceTable  :table-data="tableData.performanceData">
            </performanceTable>
          </div>
          <div id="third" style="padding-top: 70px;margin-top: -70px;">
            <memoryTable  :table-data="tableData.memoryData"></memoryTable>
          </div>
          <div id="fourth" style="padding-top: 70px;margin-top: -70px;">
            <trackingTable :table-data="tableData.trackingData">
            </trackingTable>
          </div>
          <div id="fifth" style="padding-top: 70px;margin-top: -70px;">
            <staticTable :table-data="tableData.staticData"></staticTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import coverTable from "./components/coverTable.vue";
import performanceTable from "./components/performanceTable.vue";
import trackingTable from "./components/trackingTable.vue";
import memoryTable from "./components/memoryTable.vue";
import staticTable from "./components/staticTable.vue";
import imageList from "./components/imageList.vue";
import reportHeader from './layout/reportHeader.vue'
import HomeComponent from './components/catalogue/homeComponent.vue'
import HomeTestDetail from './components/catalogue/homeTestDetail.vue'
import Home from './components/catalogue/home.vue'

// import { data } from "../src/Data/data";

@Component<App>({
  components: {
    Home,
    reportHeader,
    HomeComponent,
    HomeTestDetail,
    coverTable,
    performanceTable,
    trackingTable,
    memoryTable,
    staticTable,
    imageList,
  },
})
export default class App extends Vue {
  homeData = [] 
  homeDataTestOverview = []
  homeDataTestPlan = []
  homeDataTestSummary = []
  homeDataTestDetail = []
  tableData = window.reportData.tableData
  urlList = ''
  titleArray = ['一、测试概述','二、测试方案','三、测试总结','四、测试详情']
  titleMenuArray = ['1、覆盖统计表', '2、性能统计表', '3、内存统计表', '4、跟踪统计表', '5、静态度量表', '6、动态调用图']
  isShow = false
  progress = 0
  mounted(){
   this.homeData = window.reportData.cover
   this.homeDataTestOverview = window.reportData.testOverview
   this.homeDataTestPlan = window.reportData.testPlan
   this.homeDataTestSummary = window.reportData.testSummary
   this.homeDataTestDetail = [window.reportData.testDetail]
   this.tableData = window.reportData.tableData
   this.isShow = Object.keys(window.reportData.tableData)?.length > 0 
   this.urlList = window.reportData.tableData.dynamicCallGraph
   this.insertLoadedFlag()
  }
    insertLoadedFlag() {
    function checkLoadingStatus(this: App, clear: () => void) {
      console.log(this.progress)
      if (Math.round(this.progress) >= 100) {
        if (document.querySelector('#__STATIC_REPORT_LOADED__')) {
          clear()
          return
        }
        setTimeout(() => {
          const d = document.createElement('div')
          d.id = '__STATIC_REPORT_LOADED__'
          document.body.append(d)
        }, 3000)
        clear()
      }
    }

    const interval = setInterval(
      checkLoadingStatus.bind(this, () => {
        clearInterval(interval)
      }),
      3000
    )
    this.$once('hook:beforeDestroy', () => {
      clearInterval(interval)
    })
  }
   scroll(index:number){
      if(index === 0){
        const ele = document.querySelector('#one')
        if(!!ele){
          ele?.scrollIntoView({
            behavior: 'smooth',
            block: "start", 
            inline: "nearest"
          })
        }
      } else if (index === 1){
        const ele = document.querySelector('#two')
        if (!!ele) {
          ele?.scrollIntoView({
            behavior: 'smooth'
          })
        }
      }else if(index === 2){
        const ele = document.querySelector('#three')
        if (!!ele) {
          ele?.scrollIntoView({
            behavior: 'smooth'
          })
        }
      }else if(index === 3){
        const ele = document.querySelector('#four')
        if (!!ele) {
          ele?.scrollIntoView({
            behavior: 'smooth'
          })
        }
      } else if (index === 4) {
        const ele = document.querySelector('#five')
        if (!!ele) {
          ele?.scrollIntoView({
            behavior: 'smooth'
          })
        }
      }
   }
  menuScroll(index:number){
    if(index===0){
      const ele = document.querySelector('#first')
      if (!!ele) {
        ele?.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
    if (index === 1) {
      const ele = document.querySelector('#second')
      if (!!ele) {
        ele?.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
    if (index === 2) {
      const ele = document.querySelector('#third')
      if (!!ele) {
        ele?.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
    if (index === 3) {
      const ele = document.querySelector('#fourth')
      if (!!ele) {
        ele?.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
    if (index === 4) {
      const ele = document.querySelector('#fifth')
      if (!!ele) {
        ele?.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
    if (index === 5) {
      const ele = document.querySelector('#sixth')
      if (!!ele) {
        ele?.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
  }
}



</script>

<style lang="stylus" scoped>
#app {  
  margin: 0;
  padding:0;
   background-color:#fff;
}
.concentBody{
  padding-bottom:48px;
  width: 1001px;
  margin: 0 auto;
  background-color:#fff;
}
.statistics{
  padding:0 48px;
}
.main{
  width :100%;
  margin-bottom:32px;
  display:flex;
  justify-content:space-between;
  background-color: #FAFAFA;
}
.left_nav{
   position:fixed;
   top:111px;
   left:32px;
   display:none
}
.left_nav_title{
  display:inline-block;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  color: #0077FF;
  padding-bottom:8px;
}
.title_menu{
  display:inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #595959;
  padding-bottom:8px;
}
.result {
  display:inline-block
  padding: 28px  0 20px 0;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  color: #434343;
}
.left_nav_menu_title{
  margin-left:28px;
}

@media print {
  .reportColumn {
      page-break-before: auto;
  }

  .reportHeader, .left_nav {
    display: none !important;
  }

  .main {
    padding-top: 32px;
  }
}
</style>
