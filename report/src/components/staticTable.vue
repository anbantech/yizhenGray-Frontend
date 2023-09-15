<!--
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-21 14:14:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-26 10:41:38
 * @FilePath: /yizhen-frontend/report/src/components/staticTable.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="margin-top: 24px">
    <h2 class="tableTitle">5、静态度量表</h2>
    <el-table :data="tableData" style="width: 100%; margin-top: 12px" border
        :header-cell-style="{ background: '#F0F0F0 !important' }" header-row-class-name="statisticsTableHeader"
        header-cell-class-name="statisticsTableCell">
          <el-table-column type="index" :index="indexMethod" label="序号" width="75px"> </el-table-column>
          <el-table-column prop="functionName" label="函数名"  width="137px"> </el-table-column>
          <el-table-column prop="functionDepth" label="函数深度"  width="87px"> </el-table-column>
          <el-table-column prop="statementNums" label="语句数"  width="87px"> </el-table-column>
          <el-table-column prop="branchNums" label="分支数"  width="87px">  </el-table-column>
          <el-table-column prop="MaximumDepth" label="调用深度"  width="87px"> </el-table-column>
          <el-table-column prop="pathNums" label="调用路径数"  width="87px"> </el-table-column>
          <el-table-column prop="annotationRate" label="注释率"  width="87px"> </el-table-column>
          <el-table-column prop="mcdc" label="MC/DC "  width="87px"></el-table-column>
          <el-table-column prop="Complexity" label="圈复杂度 "  width="83px"> </el-table-column>
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
