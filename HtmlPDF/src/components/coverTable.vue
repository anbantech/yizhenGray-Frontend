<!--
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-21 14:14:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-26 10:40:53
 * @FilePath: /yizhen-frontend/report/src/components/coverTable.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="margin-top: 24px">
    <h1 class="tableTitle">1、覆盖统计表</h1>
    <el-table :data="tableData" style="width: 100%; margin-top: 12px" border
      :header-cell-style="{ background:'#F0F0F0 !important'}" header-row-class-name="statisticsTableHeader"
      header-cell-class-name="statisticsTableCell">
      <el-table-column type="index" :index="indexMethod" label="序号" width="80"> </el-table-column>
      <el-table-column width="160%" prop="functionName" label="函数名称"> </el-table-column>
      <el-table-column prop="fileName" label="文件名"> </el-table-column>
      <el-table-column prop="statementsNumber" label="语句数"> </el-table-column>
      <el-table-column prop="statementsCover" label="语句覆盖"> </el-table-column>
      <el-table-column prop="statementsPercent" label="语句覆盖率(%)"> </el-table-column>
      <el-table-column prop="branchNumber" label="分支数"> </el-table-column>
      <el-table-column prop="branchCover" label="分支覆盖"> </el-table-column>
      <el-table-column prop="branchPercent" label="分支覆盖率(%)"> </el-table-column>
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

</style>
