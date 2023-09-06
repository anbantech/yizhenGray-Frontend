import React from 'react'
import 'antd/dist/antd.css'
import { ConfigProvider, Table } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import styles from '../Scale.less'

const PerformanceDetailMemo: React.FC<any> = props => {
  const { performanceData } = props
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: '函数名称',
      dataIndex: 'func_name',
      key: 'func_name'
    },
    {
      title: '文件名',
      dataIndex: 'file_name',
      key: 'file_name'
    },
    {
      title: '调用次数',
      dataIndex: 'execute_times',
      key: 'execute_times'
    },
    {
      title: '当前值(ms)',
      dataIndex: 'now',
      key: 'now'
    },
    {
      title: '最小值(ms)',
      dataIndex: 'min',
      key: 'min'
    },
    {
      title: '最大值(ms)',
      dataIndex: 'max',
      key: 'max'
    },
    {
      title: '平均值(ms)',
      dataIndex: 'average',
      key: 'average'
    },
    {
      title: '累计值(ms)',
      dataIndex: 'total',
      key: 'total'
    }
  ]
  return (
    <div className={styles.rowTable}>
      <ConfigProvider locale={zhCN}>
        <Table columns={columns} dataSource={performanceData} pagination={false} />
      </ConfigProvider>
    </div>
  )
}
const PerformanceDetail = React.memo(PerformanceDetailMemo)
export default PerformanceDetail
