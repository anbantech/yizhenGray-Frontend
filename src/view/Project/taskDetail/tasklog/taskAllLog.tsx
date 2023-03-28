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
import style from 'Src/view/Project/project/project.less'
import styles from '../taskDetailUtil/Detail.less'
import tableStyle from '../taskDetail.less'
import { projectInfoType } from '../../task/taskList/task'

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
}

const DetailTestAlLTable: React.FC<RouteComponentProps<any, StaticContext, taskDetailType<taskDetailInfoType, projectInfoType>>> = props => {
  const [currentType, setCurrentType] = useState('all')
  const { taskInfo } = props.location.state
  const RequsetParams = {
    task_id: +taskInfo.task_id,
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend',
    case_type: ''
  }
  const [params, setParams] = useState(RequsetParams)

  const changeCurrentType = (e: any) => {
    setCurrentType(e.key)
    setParams({ ...RequsetParams, case_type: e.key })
  }

  const [total, setTotal] = React.useState(-1)
  const [logData, setLogData] = React.useState([])

  const changePage = (page: number, type: string, pageSize: number) => {
    setParams({ ...params, page, page_size: pageSize })
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

  useEffect(() => {
    if (params) {
      getlog(params)
    }
  }, [params])

  const menu = (
    <Menu selectable onClick={changeCurrentType} selectedKeys={[currentType]}>
      <Menu.Item key='' style={{ textAlign: 'center' }}>
        全部
      </Menu.Item>
      <Menu.Item key={0} style={{ textAlign: 'center' }}>
        否
      </Menu.Item>
      <Menu.Item key={1} style={{ textAlign: 'center' }}>
        是
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
      title: '发现时间',
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
    <div className={styles.Detail}>
      <span className={styles.useCaseTitle}>日志</span>
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
