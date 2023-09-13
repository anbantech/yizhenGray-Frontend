/* eslint-disable indent */
/* eslint-disable react/display-name */
import { Table, TableColumnProps, Tooltip } from 'antd'
import { getAllTestingLog } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import { RouteComponentProps, StaticContext } from 'react-router'
import React, { useEffect, useState } from 'react'
import SortIconComponent from 'Src/components/SortIcon/sortIcon'
import { getTime } from 'Src/util/baseFn'
import { testAlllogs } from 'Src/globalType/Param'
import { WarnTip } from 'Src/view/excitation/excitationComponent/Tip'
import { CrashInfoMapLog } from 'Src/util/DataMap/dataMap'
import style from 'Src/view/Project/project/project.less'
import styles from '../taskDetailUtil/Detail.less'
import tableStyle from '../taskDetail.less'
import { projectInfoType } from '../../task/taskList/task'
import CheckCompoents from '../taskDetailCompoents/CheckCompoents'
import CheckCrashLevelCompoents from '../taskDetailCompoents/CheckCrashLevelCompoents'

interface T {
  align: string
}

type table = TableColumnProps<T>['align']

type l = table extends string ? number : string

interface propsType {
  params: any
  logData: any
}

export interface taskDetailInfoType {
  editTask: false
  task_id: string
}

interface taskDetailType<S, T> {
  projectInfo: T
  taskInfo: S
  instanceInfo: any
}

const DetailTestAlLTable: React.FC<RouteComponentProps<any, StaticContext, taskDetailType<taskDetailInfoType, projectInfoType>>> = props => {
  const { instanceInfo } = props.location.state
  const RequsetParams = {
    instance_id: +instanceInfo.id,
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend',
    case_type: '',
    system: 'hex',
    statement_coverage: '',
    branch_coverage: '',
    level: ''
  }
  const [params, setParams] = useState(RequsetParams)

  const checkCrashLevel = (value: string) => {
    const val = value === '-1' ? '' : value
    setParams({ ...params, level: val })
  }

  const [total, setTotal] = React.useState(-1)
  const [logData, setLogData] = React.useState([])

  const [isType, setType] = useState('time')

  const changePage = (page: number, type: string, pageSize: number) => {
    setParams({ ...params, page, page_size: pageSize })
  }

  const checked = (value: string) => {
    setParams({ ...params, system: value, page: 1 })
  }

  const getlog = async (value: testAlllogs) => {
    try {
      const log = await getAllTestingLog(value)
      if (log.data) {
        setLogData(log.data.results as any)
        setTotal(log.data.total)
      }
      return log
    } catch (error) {
      throwErrorMessage(error)
    }
  }

  const changeCurrentTypeBranch = (val: string) => {
    setType('Branch')
    setParams({ ...params, branch_coverage: val, statement_coverage: '', page: 1 })
  }

  const changeTimeType = (val: string) => {
    setType('time')
    setParams({ ...params, branch_coverage: '', statement_coverage: '', sort_order: val, page: 1 })
  }

  const changeStatementType = (val: string) => {
    setType('Statement')
    setParams({ ...params, statement_coverage: val, branch_coverage: '', page: 1 })
  }

  useEffect(() => {
    if (params) {
      getlog(params)
    }
  }, [params])

  const Tips = (props: Record<string, string>) => {
    const { title, val } = props
    return (
      <div>
        <span>{title}</span>
        <span> {val} </span>
      </div>
    )
  }

  const columns = [
    {
      title: '用例编号',
      dataIndex: ' msg_index',
      key: 'msg_index',
      ellipsis: true,
      width: '10%',
      render: (text: any, record: any) => {
        return (
          <div className={styles.recv_data} key={record.id}>
            <span className={styles.casetitles}>{record.msg_index}</span>
          </div>
        )
      }
    },
    {
      title: '发送数据',
      dataIndex: 'send_data',
      key: 'send_data',
      ellipsis: true,
      width: '10%',
      render: (text: any, record: any) => {
        return (
          <div className={styles.recv_data} key={record.id}>
            {record.send_data.map((item: string, index: number) => {
              return (
                <div key={`${Math.random()}`} className={styles.show_data}>
                  <Tooltip
                    overlayClassName={styles.overlay}
                    title={
                      <Tips
                        val={item}
                        title={(record.sent_cnt - 1 >= index && record.case_type === 1) || record.case_type === 0 ? '已发送 : ' : '未发送 : '}
                      />
                    }
                    placement='bottomLeft'
                  >
                    <span className={styles.casetitles}>{item}</span>
                  </Tooltip>
                </div>
              )
            })}
          </div>
        )
      }
    },
    {
      title: '接收数据',
      dataIndex: 'recv_data',
      key: 'recv_data',
      ellipsis: true,
      width: '10%',
      render: (text: any, record: any) => (
        <div className={styles.recv_data} key={record.id}>
          {record.recv_data ? (
            record.recv_data?.map((item: string) => {
              return (
                <div key={`${Math.random()}`}>
                  <Tooltip overlayClassName={tableStyle.overlay} title={item} placement='bottomLeft'>
                    {item}
                  </Tooltip>
                </div>
              )
            })
          ) : (
            <span>暂无数据</span>
          )}
        </div>
      )
    },

    {
      title: () => {
        return <SortIconComponent title='分支覆盖率增幅' key='3' onChange={changeCurrentTypeBranch} type='Branch' isType={isType} />
      },
      dataIndex: 'branch_coverage',
      key: 'branch_coverage',
      render: (text: any, record: any) => (
        <div className={styles.checkDetail} key={record.id}>
          {record.branch_coverage}
        </div>
      ),
      width: '10%'
    },

    {
      title: () => {
        return <SortIconComponent title='语句覆盖率增幅' key='4' onChange={changeStatementType} type='Statement' isType={isType} />
      },
      dataIndex: 'statement_coverage',
      key: 'statement_coverage',
      render: (text: any, record: any) => (
        <div className={styles.checkDetail} key={record.id}>
          {record.statement_coverage}
        </div>
      ),
      width: '10%'
    },
    {
      title: () => {
        return <SortIconComponent title='发送时间' key='2' onChange={changeTimeType} type='time' isType={isType} />
      },
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: any, record: any) => (
        <div className={styles.checkDetail} key={record.id}>
          {getTime(record.create_time)}
        </div>
      ),
      width: '10%'
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
      dataIndex: 'crash_type',
      key: 'crash_type',
      ellipsis: true,
      width: '10%',
      render: (text: any, record: any) => (
        <div className={styles.dataLongInfoResult}>
          {Object.keys(record.crash_type).map(item => {
            return (
              <div key={item} className={styles.crash_infoTitle}>
                <Tooltip title={CrashInfoMapLog[+item]} placement='bottom' overlayClassName={styles.overlay}>
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
    <div className={styles.Detail}>
      <div className={styles.DetailHeader_allLog}>
        <span className={styles.useCaseTitle}>日志</span>
        <div className={styles.doubleCheck}>
          <CheckCrashLevelCompoents system={params.level} Checked={checkCrashLevel} />
          <CheckCompoents system={params.system} Checked={checked} />
        </div>
      </div>
      <div style={{ marginTop: '24px' }} className={styles.tableBoby}>
        <Table rowKey={(record: any) => `${record.id}_${new Date()}`} pagination={false} dataSource={logData} columns={columns as any} bordered />
      </div>
      <div className={style.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={params.page_size} getParams={changePage} pagenums={params.page} />
      </div>
    </div>
  )
}

export default DetailTestAlLTable
