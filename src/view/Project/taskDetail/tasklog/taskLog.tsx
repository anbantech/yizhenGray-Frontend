import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Menu, message, Space, Tooltip } from 'antd'
import { useHistory } from 'react-router'
import globalStyle from 'Src/view/Project/project/project.less'
import React, { useCallback, useEffect, useState } from 'react'
import { getTime } from 'Src/util/baseFn'
import { copyText } from 'Src/util/common'
import NoData from 'Src/view/404/NoData/NoData'
import { rePlayTask } from 'Src/services/api/taskApi'
import errorFrameCopy from 'Src/assets/image/errorFrameCopy.svg'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import { CrashInfoMap } from 'Utils/DataMap/dataMap'
import styles from '../taskDetailUtil/Detail.less'
import { taskDetailInfoType } from '../taskDetail'
import { projectInfoType } from '../../task/taskList/task'

interface taskDetailType<S, T> {
  projectInfo: T
  taskInfo: S
}

interface propsType {
  params: any
  logData: any
  task_id: number
  total: number | undefined
  changePage: (page: number, pageSize: number) => void
  testTimeSort: (value: string) => void
  caseSort: (value: string) => void
  infoMap: taskDetailType<taskDetailInfoType, projectInfoType>
  status: number
}

interface DataType {
  case_content: string
  case_type: number
  crash_info: string
  create_time: string
  create_user: string
  id: number
  task_id: number
  error_id: number
  recv_data: string[]
  send_data: string[]
  update_time: string
  update_user: string
}

const DetailTestedTable: React.FC<propsType> = (props: propsType) => {
  const { task_id, params, total, status, logData, changePage, testTimeSort, caseSort } = props
  const { taskInfo, projectInfo } = props.infoMap
  const history = useHistory()
  const [currentOpenId, setCurrentOpenId] = useState<number>(-1)

  const [replayId, setReplayId] = useState<number>(-2)

  const [currentType, setCurrentType] = useState('all')

  const [currentTypeTime, setCurrentTypeTime] = useState('ascend')

  const setOperation = (value1?: any, type?: string, value2?: any) => {
    switch (type) {
      case 'page':
        changePage(value1, value2)
        break
      case 'time':
        testTimeSort(value1)
        break
      case 'case_type':
        caseSort(value1)
        break
      default:
        return null
    }
  }

  const changeCurrentType = (e: any) => {
    setCurrentType(e.key)
    setOperation(e.key, 'case_type')
  }
  const changeTimeType = (e: any) => {
    setCurrentTypeTime(e.key)
    setOperation(e.key, 'time')
  }

  const menu = (
    <Menu selectable onClick={changeCurrentType} selectedKeys={[currentType]}>
      <Menu.Item key='' style={{ textAlign: 'center' }}>
        全部
      </Menu.Item>
      <Menu.Item key={1} style={{ textAlign: 'center' }}>
        是
      </Menu.Item>
      <Menu.Item key={0} style={{ textAlign: 'center' }}>
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

  const changeToggleStatus = (id: number) => {
    setCurrentOpenId(id === currentOpenId ? -1 : id)
  }

  // 单个用例的重放
  const oneCaseReplay = async (taskID: number, caseID: number) => {
    const idArray = {
      task_id: taskID,
      error_id: caseID
    }
    const res = await rePlayTask(idArray)
    if (res.code === 0) {
      setReplayId(caseID)
    }
    if (res.code === 2080) {
      message.error(res.message)
    }
  }

  // 跳转仿真
  const inScale = (id: number, value: boolean) => {
    history.push({
      pathname: '/projects/Tasks/Detail/Scale',
      state: { taskInfo, projectInfo, isTesting: value, logId: id }
    })
  }

  const copyTextFn = useCallback((text: string) => {
    return function c() {
      copyText(text)
      if (text) {
        message.success('复制成功')
      } else {
        message.error('空白文本无需复制')
      }
    }
  }, [])

  useEffect(() => {
    if (status !== 8) {
      setReplayId(-2)
    }
  }, [status])

  const HearConcentArray = ['用例编号', '发送数据 ', '接收数据', '异常用例', '发送时间', '缺陷结果', '操作']

  return (
    <div className={styles.tableList}>
      <div className={styles.tableListleftq}>
        <span className={styles.log}>测试详情</span>
      </div>
      <div className={styles.container}>
        <div className={styles.Header}>
          {HearConcentArray.map((item: string) => {
            return (
              <div className={styles.Header_Main} key={Math.random()}>
                {item === '发送时间' ? <TimeDownMenu /> : item === '异常用例' ? <IsWrongDownMenu /> : <span>{item} </span>}
              </div>
            )
          })}
        </div>
        <div className={styles.Table_Boby}>
          {logData && (
            <>
              {logData.map((item: DataType) => {
                return (
                  <div
                    key={item.id}
                    className={`${styles.Table_concent} ${
                      status === 8 && replayId === item.id ? styles.footerError : item.case_type ? styles.footerDouble : null
                    }`}
                  >
                    <Tooltip title={item.id}>
                      <div>{item.id}</div>
                    </Tooltip>
                    <div>
                      <div className={styles.dataInfoContainer}>
                        <Tooltip title={item.send_data[0]} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                          <span className={styles.dataLongInfo}>{item.send_data[0] || '无'}</span>
                        </Tooltip>
                        <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(item.send_data[0])}>
                          <img src={errorFrameCopy} alt='' />
                        </span>
                      </div>
                      <div style={{ display: currentOpenId === item.id ? 'block' : 'none' }} className={styles.dataShowContainer}>
                        {item.send_data.length > 1 &&
                          item.send_data.slice(1).map((send_data: string) => {
                            return (
                              <div className={styles.dataShowItem} key={`${send_data}_${Math.random()}`}>
                                <Tooltip title={send_data} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                                  <span className={styles.dataLongInfo}>{send_data || '无'}</span>
                                </Tooltip>
                                <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(send_data)}>
                                  <img src={errorFrameCopy} alt='' />
                                </span>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                    <div className={styles.footerresve}>
                      <div className={styles.dataInfoContainer}>
                        <Tooltip title={item.recv_data[0]} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                          <span className={styles.dataLongInfo}>{item.recv_data[0] || '无'}</span>
                        </Tooltip>
                        <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(item.recv_data[0])}>
                          <img src={errorFrameCopy} alt='' />
                        </span>
                      </div>
                      <div style={{ display: currentOpenId === item.id ? 'block' : 'none' }} className={styles.dataShowContainer}>
                        {item.recv_data.length > 1 &&
                          item.recv_data.slice(1).map((recv_data: string) => {
                            return (
                              <div className={styles.dataShowItem} key={`${recv_data}_${Math.random()}`}>
                                <Tooltip title={recv_data} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                                  <span className={styles.dataLongInfo}>{recv_data || '无'}</span>
                                </Tooltip>
                                <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(recv_data)}>
                                  <img src={errorFrameCopy} alt='' />
                                </span>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                    <div>{item.case_type ? '是' : '否'}</div>
                    <div>{getTime(item.update_time)}</div>

                    <div>
                      <Tooltip
                        title={CrashInfoMap[+Object.keys(item.crash_info)[0]]}
                        placement='bottom'
                        color='#ffffff'
                        overlayClassName={styles.overlay}
                      >
                        <span className={styles.dataLongInfo}>{CrashInfoMap[+Object.keys(item.crash_info)[0]]}</span>
                      </Tooltip>
                    </div>

                    <div className={styles.Opera_detaile}>
                      {item.send_data.length >= 1 && (
                        <span role='button' tabIndex={0} className={styles.operate_container} onClick={() => changeToggleStatus(item.id)}>
                          {currentOpenId === item.id ? '收起' : '展开'}
                        </span>
                      )}
                      {item.case_type ? (
                        <span
                          className={styles.operate_containers}
                          role='button'
                          tabIndex={0}
                          onClick={() => {
                            inScale(item.id, false)
                          }}
                        >
                          仿真信息
                        </span>
                      ) : null}
                      {[0, 1].includes(status) ? (
                        <span
                          className={styles.operate_container}
                          role='button'
                          tabIndex={0}
                          onClick={() => {
                            oneCaseReplay(task_id, item.id)
                          }}
                        >
                          重放
                        </span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </>
          )}
          {logData.length === 0 ? <NoData title='暂无数据' /> : null}
        </div>
      </div>
      <div className={globalStyle.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={setOperation} pagenums={params.page} />
      </div>
    </div>
  )
}

DetailTestedTable.displayName = 'DetailTestedTable'

export default DetailTestedTable
