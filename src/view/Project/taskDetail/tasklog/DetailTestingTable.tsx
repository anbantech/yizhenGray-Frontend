/* eslint-disable indent */
/* eslint-disable react/display-name */
import { ConfigProvider, message, Table, Tooltip } from 'antd'
import React, { useCallback, useEffect } from 'react'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import { WarnTip } from 'Src/view/excitation/excitationComponent/Tip'
import { getTestingLog } from 'Src/services/api/taskApi'
import { CrashInfoMapLog } from 'Utils/DataMap/dataMap'
import { getTime } from 'Src/util/baseFn'
import { throwErrorMessage } from 'Src/util/message'
import { ResTaskDetail } from 'Src/globalType/Response'
import styles from '../taskDetailUtil/Detail.less'

interface propsType {
  params: any
  status: any
  taskDetailInfo: ResTaskDetail
}

const customizeRender = () => <DefaultValueTips content='暂无用例' />
const DetailTestAllTable: React.FC<propsType> = (props: propsType) => {
  const { params, status, taskDetailInfo } = props
  const [spinning, setSpinning] = React.useState(true)
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
    if (status === 2 && (taskDetailInfo.test_num || taskDetailInfo.error_num || taskDetailInfo.warning_count)) {
      getlog()
        .then(res => {
          setSpinning(false)
          return res
        })
        .catch(error => {
          message.error(error.message)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, taskDetailInfo.test_num, taskDetailInfo.error_num, taskDetailInfo.warning_count])

  const columns = [
    {
      title: '用例编号',
      dataIndex: 'msg_index',
      key: 'msg_index',
      ellipsis: true,
      width: '8%'
    },
    {
      title: '发送数据',
      dataIndex: 'send_data',
      key: 'send_data',
      ellipsis: true,
      width: '12%',
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
      width: '10%',
      render: (text: any, record: any) => (
        <div key={record.id} className={styles.recv_datalog}>
          <p className={record.recv_data ? styles.checkDetail : styles.noneDatalog} key={record.id}>
            {typeof record.recv_data === 'string' ? record.recv_data : record.recv_data[0] || '-'}
          </p>
        </div>
      )
    },
    {
      title: () => {
        return (
          <div>
            <span> 异常用例</span>
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
      width: '11%'
    },
    {
      title: () => {
        return (
          <div>
            <span> 发送时间</span>
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
      title: () => {
        return (
          <div>
            <span> 分支覆盖率增幅 </span>
          </div>
        )
      },
      dataIndex: 'branch_coverage',
      key: 'branch_coverage',
      render: (text: any, record: any) => (
        <div className={styles.checkDetail} key={record.id}>
          {record.branch_coverage}
        </div>
      ),
      width: '12%'
    },

    {
      title: () => {
        return (
          <div>
            <span>语句覆盖率增幅</span>
          </div>
        )
      },
      dataIndex: 'statement_coverage',
      key: 'statement_coverage',
      render: (text: any, record: any) => (
        <div className={styles.checkDetail} key={record.id}>
          {record.statement_coverage}
        </div>
      ),
      width: '12%'
    },

    {
      title: () => {
        return (
          <div style={{ display: 'flex' }}>
            <span> 缺陷结果</span>
            <WarnTip />
          </div>
        )
      },
      dataIndex: 'crash_info',
      key: 'crash_info',
      ellipsis: true,
      width: '12.5%',
      render: (text: any, record: any) => (
        <div className={styles.dataLongInfoResult}>
          {Object.keys(record.crash_info).map(item => {
            return (
              <div key={item} className={styles.crash_infoTitle}>
                <Tooltip title={CrashInfoMapLog[+item]} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                  <span>{CrashInfoMapLog[+item]}</span>
                </Tooltip>
              </div>
            )
          })}
        </div>
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
            return record.case_type && Object.keys(record.crash_info)[0]
              ? `${styles.tableStyleBackground}`
              : Object.keys(record.crash_info)[0] && !record.case_type
              ? `${styles.warninfo}`
              : ''
          }}
          loading={spinning}
          dataSource={logData}
          pagination={false}
        />
      </ConfigProvider>
    </div>
  )
}

export default DetailTestAllTable
