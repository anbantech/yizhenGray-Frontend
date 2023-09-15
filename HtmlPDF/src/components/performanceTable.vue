<!--
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-21 14:14:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-26 10:41:33
 * @FilePath: /yizhen-frontend/report/src/components/performanceTable.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="margin-top: 24px">
    <h1 class="tableTitle">2、性能统计表</h1>
    <el-table :data="tableData" style="width: 100%; margin-top: 12px" border
      header-row-class-name="statisticsTableHeader" header-cell-class-name="statisticsTableCell"
      :header-cell-style="{ background:'#F0F0F0 !important'}">
      <el-table-column type="index" :index="indexMethod" label="序号" width="80"> </el-table-column>
      <el-table-column width="160%" prop="functionName" label="函数名称"> </el-table-column>
      <el-table-column prop="fileName" label="文件名"> </el-table-column>
      <el-table-column prop="count" label="调用次数"> </el-table-column>
      <el-table-column prop="currentUs" label="当前值(ms)"> </el-table-column>
      <el-table-column prop="minUs" label="最小值(ms)"> </el-table-column>
      <el-table-column prop="maxUs" label="最大值(ms)"> </el-table-column>
      <el-table-column prop="avgUs" label="平均值(ms)"> </el-table-column>
      <el-table-column prop="totalUs" label="累计值(ms)"> </el-table-column>
      <el-table-column prop="totalPercent" label="总百分比(%)"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1
    }
  }
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

</style>
