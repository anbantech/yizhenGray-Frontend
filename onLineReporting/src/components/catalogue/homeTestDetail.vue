<template>
    <div class='reportColumn'>
        <span class="reportColumn_title" style="display:block">{{ title }}</span>
        <span class="title">本次测试详情</span>
        <el-table :data="tableData" style="width: 100%; margin-top: 12px" border
            :header-cell-style="{ background: '#F0F0F0 !important' }" header-row-class-name="statisticsTableHeader"
            header-cell-class-name="statisticsTableCell">
            <el-table-column prop="this_cases" label="用例数量"> </el-table-column>
            <el-table-column prop="this_error_case_num" label="异常用例"> </el-table-column>
            <el-table-column prop="wraning_num" label="警告用例"> </el-table-column>
            <el-table-column prop="elapsed_time" label="耗时">
                <template slot-scope="scope">
                    <span> {{ scope.row.elapsed_time ? `${scope.row.elapsed_time}` : '0' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <span> {{ scope.row.status ? '异常结束' : '正常结束' }}</span>
                </template>
            </el-table-column>
        </el-table>
        <span class="title">本次异常用例</span>
        <el-table :data="tableData[0].this_time_error_cases" style="width: 100%; margin-top: 12px" border
            header-row-class-name="statisticsTableHeader" :header-cell-style="{ background: '#F0F0F0 !important' }"
            header-cell-class-name="statisticsTableCell">
            <el-table-column prop="time" label="时间" width="200%">
            </el-table-column>
            <el-table-column prop="frames" label="异常情况描述"> </el-table-column>
        </el-table>
        <!-- <span class="title">累计测试详情</span>
        <el-table :data="tableData" style="width: 100%; margin-top: 12px" border
            header-row-class-name="statisticsTableHeader" :header-cell-style="{ background:'#F0F0F0 !important'}"
            header-cell-class-name="statisticsTableCell">
            <el-table-column prop="instance_num" label="实例编号" width="200%">
            </el-table-column>
            <el-table-column prop="cases" label="用例数量"> </el-table-column>
            <el-table-column prop="error_case_num" label="异常用例"> </el-table-column>
        </el-table>
        <span class="title">累计异常用例</span>
        <el-table :data="tableData[0].total_error_frames" style="width: 100%; margin-top: 12px" border
            header-row-class-name="statisticsTableHeader" :header-cell-style="{ background:'#F0F0F0 !important'}"
            header-cell-class-name="statisticsTableCell">
            <el-table-column prop="time" label="时间" width="200%">
            </el-table-column>
            <el-table-column prop="frames" label="异常情况描述"> </el-table-column>
        </el-table> -->
    </div>
</template>

<script>


export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        tableData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            homeData:tableData
        };
    },
};
</script>


<style lang="stylus" scoped>
    .reportColumn{
      padding: 0px 48px;
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


   .title{
    display: inline-block;
    margin: 24px 0px 12px 0px; 
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    color: #434343;
   }


 </style>