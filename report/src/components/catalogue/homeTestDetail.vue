<template>
    <div class='reportColumn'>
        <span class="reportColumn_title" style="display:block">{{ title }}</span>
        <span class="title">本次测试详情</span>
        <el-table :data="tableData" style="width: 100%; margin-top: 12px" border
            :header-cell-style="{ background: '#F0F0F0 !important' }" header-row-class-name="statisticsTableHeader"
            header-cell-class-name="statisticsTableCell">
            <el-table-column prop="total" label="用例总数"> </el-table-column>
            <el-table-column prop="error_count" label="异常用例数"> </el-table-column>
            <el-table-column prop="defects_count" label="缺陷数量"> </el-table-column>
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
        <div  v-for="(ls, key) in errorCases" :key="key + 'cr'">
        <el-table :data="ls" style="width: 100%; margin-top: 12px" border
            header-row-class-name="statisticsTableHeader" :header-cell-style="{ background: '#F0F0F0 !important' }"
            header-cell-class-name="statisticsTableCell">
            <el-table-column prop="num" label="用例编号" width="100%">
            </el-table-column>
            <el-table-column prop="time" label="发送时间" width="200%">
            </el-table-column>
            <el-table-column prop="frames" label="发送数据" width="400%">
                <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.frames" :key='index'>
                        {{ item }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="kind" label="缺陷结果">
                <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.kind" :key='index'>
                        {{ item }}
                    </div>
                </template>
            </el-table-column>
        </el-table>
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
        tableData: {
            type: Array,
            default: () => []
        }, 
        progress: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            errorCases: [],
            doning: false,
            stop: false,
            reflectProgress: 0
        };
    },
    methods: {
        async sleep(time) {
            return await new Promise((resolve) => setTimeout(resolve, time));
        },

          async injectEc() {
            const ec = this.tableData[0] ? this.tableData[0].this_time_error_cases : [];
            if (ec.length === 0) {
                this.errorCases.push([])
                this.reflectProgress += 100
                this.$emit('update:progress', this.reflectProgress)
                return
            }
            for (let i = 0; i < ec.length; i = i + 100) {
                if (this.stop) return
                this.errorCases.push(ec.slice(i, i + 100));
                this.reflectProgress += ((i + 100 > ec.length ? ec.length - i : 100) / ec.length) * 100
                this.$emit('update:progress', this.reflectProgress)
                await this.sleep(20)
            }
        },
        async init() {
            this.injectEc()
        }
    },
    updated() {
        if (!this.doning) {
            this.init()
        }
        this.doning = true
    },
    beforeDestroy() {
        this.stop = true
    }
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