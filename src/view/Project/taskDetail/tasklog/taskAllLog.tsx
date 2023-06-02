/* eslint-disable indent */
/* eslint-disable react/display-name */
import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Menu, Space, Table, Tooltip } from 'antd'
import { getAllTestingLog } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import { RouteComponentProps, StaticContext } from 'react-router'
import React, { useEffect, useState } from 'react'
import { getTime } from 'Src/util/baseFn'
import { testAlllogs } from 'Src/globalType/Param'
import { WarnTip } from 'Src/view/excitation/excitationComponent/Tip'
import { CrashInfoMap } from 'Src/util/DataMap/dataMap'
import style from 'Src/view/Project/project/project.less'
import styles from '../taskDetailUtil/Detail.less'
import tableStyle from '../taskDetail.less'
import { projectInfoType } from '../../task/taskList/task'
import CheckCompoents from '../taskDetailCompoents/CheckCompoents'

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
  const [currentType, setCurrentType] = useState('all')
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
    branch_coverage: ''
  }
  const [params, setParams] = useState(RequsetParams)

  const changeCurrentType = (e: any) => {
    setCurrentType(e.key)
    setParams({ ...RequsetParams, case_type: e.key })
  }

  const [total, setTotal] = React.useState(-1)
  const [logData, setLogData] = React.useState([])

  const [currentTypeTime, setCurrentTypeTime] = useState('descend')

  const [currentTypeBranch, setCurrentTypeBranch] = useState('')

  const [currentTypeStatement, setCurrentTypeStatement] = useState('')

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

  const changeCurrentTypeBranch = (e: any) => {
    setCurrentTypeBranch(e.key)
    setParams({ ...params, branch_coverage: e.key })
  }

  const changeTimeType = (e: any) => {
    setCurrentTypeTime(e.key)
    setParams({ ...params, sort_order: e.key })
  }

  const changeStatementType = (e: any) => {
    setCurrentTypeStatement(e.key)
    setParams({ ...params, statement_coverage: e.key })
  }

  useEffect(() => {
    if (params) {
      getlog(params)
    }
  }, [params])

  const menu = (
    <Menu selectable onClick={changeCurrentType} selectedKeys={[currentType]}>
      <Menu.Item key='' style={{ textAlign: 'center' }}>
        默认
      </Menu.Item>
      <Menu.Item key={1} style={{ textAlign: 'center' }}>
        是
      </Menu.Item>
      <Menu.Item key={0} style={{ textAlign: 'center' }}>
        否
      </Menu.Item>
    </Menu>
  )

  function IsWrongDownMenu() {
    return (
      <Dropdown overlay={menu}>
        <Space>
          异常用例
          <DownOutlined />
        </Space>
      </Dropdown>
    )
  }

  const menuBranch = (
    <Menu selectable onClick={changeCurrentTypeBranch} selectedKeys={[currentTypeBranch]}>
      <Menu.Item key='' style={{ textAlign: 'center' }}>
        默认
      </Menu.Item>
      <Menu.Item key='ascend' style={{ textAlign: 'center' }}>
        升序
      </Menu.Item>
      <Menu.Item key='descend' style={{ textAlign: 'center' }}>
        降序
      </Menu.Item>
    </Menu>
  )

  const menuStatement = (
    <Menu selectable onClick={changeStatementType} selectedKeys={[currentTypeStatement]}>
      <Menu.Item key='' style={{ textAlign: 'center' }}>
        默认
      </Menu.Item>
      <Menu.Item key='ascend' style={{ textAlign: 'center' }}>
        升序
      </Menu.Item>
      <Menu.Item key='descend' style={{ textAlign: 'center' }}>
        降序
      </Menu.Item>
    </Menu>
  )

  const menuTime = (
    <Menu selectable onClick={changeTimeType} selectedKeys={[currentTypeTime]}>
      <Menu.Item key='ascend' style={{ textAlign: 'center' }}>
        升序
      </Menu.Item>
      <Menu.Item key='descend' style={{ textAlign: 'center' }}>
        降序
      </Menu.Item>
    </Menu>
  )

  function BranchMenu() {
    return (
      <Dropdown overlay={menuBranch}>
        <Space>
          分支覆盖率
          <DownOutlined />
        </Space>
      </Dropdown>
    )
  }

  function StatementMenu() {
    return (
      <Dropdown overlay={menuStatement}>
        <Space>
          语句覆盖率
          <DownOutlined />
        </Space>
      </Dropdown>
    )
  }

  function TimeDownMenu() {
    return (
      <Dropdown overlay={menuTime}>
        <Space>
          发送时间
          <DownOutlined />
        </Space>
      </Dropdown>
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
      width: '12.5%',
      render: (text: any, record: any) => {
        return (
          <div className={styles.recv_data} key={record.id}>
            {record.send_data.map((item: string) => {
              return (
                <div key={`${Math.random()}`} className={styles.show_data}>
                  <Tooltip overlayClassName={tableStyle.overlay} color='#ffffff' title={item} placement='bottomLeft'>
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
      width: '12.5%',
      render: (text: any, record: any) => (
        <div className={styles.recv_data} key={record.id}>
          {record.recv_data &&
            record.recv_data?.map((item: string) => {
              return (
                <div key={`${Math.random()}`}>
                  <Tooltip overlayClassName={tableStyle.overlay} color='#ffffff' title={item} placement='bottomLeft'>
                    <span className={styles.casetitles}>{item}</span>
                  </Tooltip>
                </div>
              )
            })}
        </div>
      )
    },
    {
      title: () => {
        return <IsWrongDownMenu />
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
        return <BranchMenu />
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
        return <StatementMenu />
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
        return <TimeDownMenu />
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
                <Tooltip title={CrashInfoMap[+item]} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                  <span>{CrashInfoMap[+item]}</span>
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
        <CheckCompoents system={params.system} Checked={checked} />
      </div>
      <div style={{ marginTop: '24px' }} className={styles.tableBoby}>
        <Table rowKey={(record: any) => `${record.id}_${new Date()}`} pagination={false} dataSource={logData} columns={columns as any} bordered />
      </div>
      <div className={style.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={changePage} pagenums={params.page} />
      </div>
    </div>
  )
}

export default DetailTestAlLTable
