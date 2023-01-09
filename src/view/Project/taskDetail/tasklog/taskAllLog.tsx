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
  const changeCurrentType = (e: any) => {
    setCurrentType(e.key)
  }
  const RequsetParams = {
    task_id: +taskInfo.task_id,
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend'
  }

  const [params, setParams] = useState(RequsetParams)
  const [total, setTotal] = React.useState(-1)
  const [logData, setLogData] = React.useState([])

  const getParams = (value: number) => {
    setParams({ ...params, page: value })
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
      <Menu.Item key='all' style={{ textAlign: 'center' }}>
        全部
      </Menu.Item>
      <Menu.Item key='yes' style={{ textAlign: 'center' }}>
        是
      </Menu.Item>
      <Menu.Item key='no' style={{ textAlign: 'center' }}>
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
        <div className={styles.funNameing} key={record.id}>
          <Tooltip
            overlayClassName={tableStyle.overlay}
            color='#ffffff'
            title={typeof record.send_data === 'string' ? record.send_data : record.send_data[0] || ''}
            placement='bottomLeft'
          >
            <span className={styles.casetitles}>{typeof record.send_data === 'string' ? record.send_data : record.send_data[0] || ''}</span>
          </Tooltip>
        </div>
      )
    },
    {
      title: '接收数据',
      dataIndex: 'recv_data',
      key: 'recv_data',
      ellipsis: true,
      width: '12.5%',
      render: (text: any, record: any) => (
        <div className={styles.funNameing} key={record.id}>
          <Tooltip
            overlayClassName={tableStyle.overlay}
            color='#ffffff'
            title={typeof record.recv_data === 'string' ? record.recv_data : record.recv_data[0] || ''}
            placement='bottomLeft'
          >
            <span className={styles.casetitles}>{typeof record.recv_data === 'string' ? record.recv_data : record.recv_data[0] || ''} </span>
          </Tooltip>
        </div>
      )
    },
    {
      title: () => {
        return <IsWrongDownMenu />
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
      <span className={styles.useCaseTitle}>用例生成详情</span>
      {/* {[0, 1, 3, 4, 5, 6].includes((status as any) as number) && (
        <div role='time' style={{ marginTop: '16px' }}>
          <span style={{ marginRight: '16px' }}>筛选进制</span>
          <Check Checked={setBase} positionErrorFrameData={base} getPopupContainer={(triggerNode: any) => triggerNode.parentNode} />
        </div>
      )} */}
      <div style={{ marginTop: '24px' }} className={styles.tableBoby}>
        <Table rowKey={(record: any) => `${record.id}_${new Date()}`} pagination={false} dataSource={logData} columns={columns as any} bordered />
      </div>
      <PaginationsAge length={total} num={10} getParams={getParams} pagenums={params.page} />
    </div>
  )
}

export default DetailTestAlLTable
