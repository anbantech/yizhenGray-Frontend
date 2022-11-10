<!--
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-07-21 14:14:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-26 10:42:16
 * @FilePath: /yizhen-frontend/report/src/components/memoryTable.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="margin-top: 24px">
    <h1 class="tableTitle">3、内存统计表</h1>
    <el-table :data="tableData" :header-cell-style="{ background:'#F0F0F0 !important'}"
      style="width: 100%; margin-top: 12px" border header-row-class-name="statisticsTableHeader"
      header-cell-class-name="statisticsTableCell">
      <el-table-column type="index" :index="indexMethod" label="序号" width="80"> </el-table-column>
      <el-table-column width="160%" prop="functionName" label="函数名称"> </el-table-column>
      <el-table-column prop="flieName" label="文件名"> </el-table-column>
      <el-table-column prop="rowCount" label="行数"> </el-table-column>
      <el-table-column prop="freeOrAllocation" label="分配/释放"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
      <el-table-column prop="maxByte" label="最小字节数"> </el-table-column>
      <el-table-column prop="minByte" label="最大字节数"> </el-table-column>
      <el-table-column prop="successCount" label="成功次数"> </el-table-column>
      <el-table-column prop="failCount" label="失败次数"> </el-table-column>
      <el-table-column prop="byteCount" label="当前字节数"> </el-table-column>
      <el-table-column prop="isFree" label="是否释放"> </el-table-column>
      <el-table-column prop="total" label="总字节数"> </el-table-column>
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
