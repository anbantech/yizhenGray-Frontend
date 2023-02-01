/* eslint-disable indent */
/* eslint-disable react/display-name */
import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Menu, Space, Table, Tooltip } from 'antd'
import globalStyle from 'Src/view/Project/project/project.less'
import React, { useState } from 'react'
import { getTime } from 'Src/util/baseFn'

import PaginationsAge from 'Src/components/Pagination/Pagina'
import styles from '../taskDetailUtil/Detail.less'

import tableStyle from '../taskDetail.less'

interface propsType {
  params: any
  logData: any
  total: number | undefined
  changePage: () => void
}
const DetailTestedTable: React.FC<propsType> = (props: propsType) => {
  const { params, total, logData, changePage } = props
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
  const [currentType, setCurrentType] = useState('all')
  const [currentTypeTime, setCurrentTypeTime] = useState('ascend')
  const changeCurrentType = (e: any) => {
    setCurrentType(e.key)
  }
  const changeTimeType = (e: any) => {
    setCurrentTypeTime(e.key)
  }
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

  function TimeDownMenu() {
    return (
      <Dropdown overlay={menuTime}>
        <Space>
          发现时间
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
      width: '15%',
      title: '更多操作',
      dataIndex: 'operations',
      key: 'operations',
      // eslint-disable-next-line react/display-name
      render: () => {
        return (
          <div className={globalStyle.Opera_detaile}>
            <span role='button' tabIndex={0} onClick={() => {}}>
              仿真信息
            </span>
            <span role='button' tabIndex={0} onClick={() => {}}>
              展开
            </span>
            <span style={{ marginRight: '20px' }} role='button' tabIndex={0} onClick={() => {}}>
              重放
            </span>
          </div>
        )
      }
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
      <div className={globalStyle.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={changePage} pagenums={params.page} />
      </div>
    </div>
  )
}

export default DetailTestedTable
