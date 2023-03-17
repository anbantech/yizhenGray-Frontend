/* eslint-disable indent */
/* eslint-disable react/display-name */
import { ConfigProvider, Table } from 'antd'
import React, { useCallback, useEffect, useRef } from 'react'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import { getTestingLog } from 'Src/services/api/taskApi'
import { getTime } from 'Src/util/baseFn'
import { throwErrorMessage } from 'Src/util/message'

import styles from '../taskDetailUtil/Detail.less'

interface propsType {
  params: any
  status: any
}

const customizeRender = () => <DefaultValueTips content='暂无用例' />
const DetailTestAllTable: React.FC<propsType> = (props: propsType) => {
  const { params, status } = props
  const timer = useRef<any>()

  const [logData, setLogData] = React.useState([])
  const getlog = useCallback(async () => {
    try {
      const log = await getTestingLog(params)
      if (log.data) {
        setLogData(log.data.results as any)
      }
      return log
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [params])
  useEffect(() => {
    console.log(status)
    if (status === 2) {
      timer.current = setInterval(() => {
        getlog()
      }, 3000)
    }
    return () => {
      clearInterval(timer.current)
    }
  }, [status])

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
            <span> {`异常用例${params.case_type === '' ? '(全部)' : params.is_wrong === '0' ? '(否)' : '(是)'}`} </span>
          </div>
        )
      },
      dataIndex: 'case_type',
      key: 'case_type',
      ellipsis: true,
      render: (text: any, record: any) => (
        <div className={styles.checkDetail} key={record.id}>
          {record.case_type ? '是' : '否'}
        </div>
      ),
      width: '10%'
    },
    {
      title: () => {
        return (
          <div>
            <span> {`发送时间${params.sort_order === 'descend' ? '(降序)' : '(升序)'}`} </span>
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
    },
    {
      title: '缺陷结果',
      dataIndex: 'crash_info',
      key: 'crash_info',
      ellipsis: true,
      width: '12.5%',
      render: (text: any, record: any) => (
        <p className={styles.checkDetail} key={record.id}>
          {record.crash_info}
        </p>
      )
    }
  ]
  return (
    <div className={styles.tableList}>
      <div className={styles.tableListleftq}>
        <span className={styles.log}>测试详情</span>
      </div>
      <ConfigProvider renderEmpty={customizeRender}>
        <Table
          rowKey={record => record.id}
          columns={columns}
          rowClassName={record => {
            return record.case_type ? `${styles.tableStyleBackground}` : ''
          }}
          dataSource={logData}
          pagination={false}
        />
      </ConfigProvider>
    </div>
  )
}

export default DetailTestAllTable
