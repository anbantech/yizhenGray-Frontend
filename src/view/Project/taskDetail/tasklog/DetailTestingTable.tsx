/* eslint-disable indent */
/* eslint-disable react/display-name */
import { Table } from 'antd'
import React from 'react'
import { getTime } from 'Src/util/baseFn'

import styles from '../taskDetailUtil/Detail.less'

interface propsType {
  params: any
  logData: any
}
const statusDesc = [
  '未处理',
  '熵过滤通过',
  '熵过滤失败',
  '发送完成',
  '发送失败',
  '异常重试中',
  '处理中',
  '处理完成',
  '诊断错误',
  '处理失败',
  '异常停止'
]
const DetailTestAllTable: React.FC<propsType> = (props: propsType) => {
  const { params, logData } = props
  const columns = [
    {
      title: '用例编号',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      width: '10%'
    },
    {
      title: '发送数据',
      dataIndex: 'send_data',
      key: 'send_data',
      ellipsis: true,
      width: '12.5%',
      render: (text: any, record: any) => (
        <p className={styles.checkDetail} key={record.id}>
          {typeof record.send_data === 'string' ? record.send_data : record.send_data[0] || ''}
        </p>
      )
    },
    {
      title: '接收数据',
      dataIndex: 'recv_data',
      key: 'recv_data',
      ellipsis: true,
      width: '12.5%',
      render: (text: any, record: any) => (
        <p className={styles.checkDetail} key={record.id}>
          {typeof record.recv_data === 'string' ? record.recv_data : record.recv_data[0] || ''}
        </p>
      )
    },
    {
      title: () => {
        return (
          <div>
            <span> {`异常用例${params.is_wrong === '' ? '(全部)' : params.is_wrong === '0' ? '(否)' : '(是)'}`} </span>
          </div>
        )
      },
      dataIndex: 'is_wrong',
      key: 'is_wrong',
      ellipsis: true,
      render: (text: any, record: any) => (
        <div className={styles.checkDetail} key={record.id}>
          {record.is_wrong ? '是' : '否'}
        </div>
      ),
      width: '10%'
    },
    {
      title: '用例状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
      render: (text: any, record: any) => (
        <div className={styles.checkDetail} key={record.id}>
          当前第{record.frame_index}帧{statusDesc[record.status]}
        </div>
      ),
      width: '15%'
    },
    {
      title: () => {
        return (
          <div>
            <span> {`发现时间${params.sort_order === 'descend' ? '(降序)' : '(升序)'}`} </span>
          </div>
        )
      },
      dataIndex: 'update_time',
      key: 'update_time',
      ellipsis: true,
      render: (text: any, record: any) => (
        <div className={styles.checkDetail} key={record.id}>
          {getTime(record.update_time)}
        </div>
      ),
      width: '15%'
    }
  ]
  return (
    <div className={styles.tableList}>
      <div className={styles.tableListleftq}>
        <span className={styles.log}>测试详情</span>
      </div>
      <Table
        rowKey={record => record.id}
        columns={columns}
        rowClassName={record => {
          return record.is_wrong ? `${styles.tableStyleBackground}` : ''
        }}
        dataSource={logData}
        pagination={false}
      />
    </div>
  )
}

export default DetailTestAllTable
