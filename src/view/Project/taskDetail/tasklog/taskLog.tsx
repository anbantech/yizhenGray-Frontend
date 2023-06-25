import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Menu, message, Space, Tooltip } from 'antd'
import { useHistory } from 'react-router'
import globalStyle from 'Src/view/Project/project/project.less'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getTime } from 'Src/util/baseFn'
import { WarnTip } from 'Src/view/excitation/excitationComponent/Tip'
import { copyText } from 'Src/util/common'
import SortIconComponent from 'Src/components/SortIcon/sortIcon'
import NoData from 'Src/view/404/NoData/NoData'
import { rePlayTask } from 'Src/services/api/taskApi'
import errorFrameCopy from 'Src/assets/image/errorFrameCopy.svg'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import { CrashInfoMapLog } from 'Utils/DataMap/dataMap'
import styles from '../taskDetailUtil/Detail.less'

import { taskDetailInfoType } from '../taskDetail'
import { projectInfoType } from '../../task/taskList/task'
import CheckCompoents from '../taskDetailCompoents/CheckCompoents'

interface taskDetailType<S, T> {
  projectInfo: T
  taskInfo: S
  instanceInfo: any
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
  // cancelMenu: (e: React.MouseEvent<HTMLDivElement>) => void
  system: string
  Checked: (value: string) => void
  BranchSort: (value: string) => void
  StatementSort: (value: string) => void
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
  msg_index: number
  sent_cnt: number
  statement_coverage: string
  branch_coverage: string
}
type Detail_Type = Record<string, any>
const DetailTestedTable: React.FC<propsType> = (props: propsType) => {
  const { task_id, params, total, system, Checked, status, logData, StatementSort, BranchSort, changePage, testTimeSort, caseSort } = props
  const { taskInfo, projectInfo, instanceInfo } = props.infoMap

  const history = useHistory()
  const [currentOpenId, setCurrentOpenId] = useState<number>(-1)

  const [replayId, setReplayId] = useState<number>(-1)

  const [currentType, setCurrentType] = useState('')
  const [isType, setType] = useState('time')
  const setOperation = (value1?: any, type?: string, value2?: any) => {
    switch (type) {
      case 'page':
        changePage(value1, value2)
        break
      case 'time':
        setType(type as string)
        testTimeSort(value1)
        break
      case 'case_type':
        caseSort(value1)
        break
      case 'Statement':
        setType(type as string)
        StatementSort(value1)
        break
      case 'Branch':
        setType(type as string)
        BranchSort(value1)
        break
      default:
        return null
    }
  }

  const changeCurrentType = (e: any) => {
    setCurrentType(e.key)
    setOperation(e.key, 'case_type')
  }

  const statusMemo = useMemo(() => {
    return status
  }, [status])

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

  const changeToggleStatus = (id: number) => {
    setCurrentOpenId(id === currentOpenId ? -1 : id)
  }

  const changeReplayStatus = (id: number) => {
    setReplayId(id)
  }
  // 单个用例的重放
  const oneCaseReplay = async (taskID: number, caseID: number) => {
    const idArray = {
      instance_id: taskID,
      error_id: caseID
    }
    try {
      const res = await rePlayTask(idArray)
      return res
    } catch (error) {
      message.error(error.message)
    }
  }

  // 跳转仿真
  const inScale = (value: boolean, data: Detail_Type) => {
    history.push({
      pathname: '/projects/Tasks/Detail/ScaleDetail',
      state: { taskInfo, projectInfo, isTesting: value, logId: data.id, data, instanceInfo }
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

  const styleFn = React.useCallback(
    (item: any) => {
      switch (item.case_type) {
        case 0:
          if ((status === 8 && replayId === item.id) || item.status === 1) {
            return styles.footerError
          }
          if (Object.keys(item.crash_info)[0] && !item.case_type) {
            return styles.warninfo
          }
          return null
        case 1:
          if ((status === 8 && replayId === item.id) || item.status === 1) {
            return styles.footerError
          }
          return styles.footerDouble
        default:
          return null
      }
    },
    [status, replayId]
  )

  const Tips = (props: Record<string, string>) => {
    const { title, val } = props
    return (
      <div>
        <span>{title}</span>
        <span> {val} </span>
      </div>
    )
  }

  useEffect(() => {
    setType('time')
  }, [status])

  return (
    <div className={styles.tableList}>
      <div className={styles.tableListleftq}>
        <span className={styles.log}>测试详情</span>
        <CheckCompoents system={system} Checked={Checked} />
      </div>
      <div className={styles.container}>
        <div className={styles.Header}>
          <div className={styles.Header_Main}>
            <span>用例编号</span>
          </div>
          <div className={styles.Header_Main}>
            <span>发送数据</span>
          </div>
          <div className={styles.Header_Main}>
            <span>接收数据</span>
          </div>
          <div className={styles.Header_Main}>
            <IsWrongDownMenu />
          </div>
          <div className={styles.Header_Main}>
            <SortIconComponent title='发送时间' key='2' onChange={setOperation} type='time' isType={isType} />
          </div>
          <div className={styles.Header_Main}>
            <SortIconComponent title='分支覆盖率增幅' key='3' onChange={setOperation} type='Branch' isType={isType} />
          </div>
          <div className={styles.Header_Main}>
            <SortIconComponent title='语句覆盖率增幅' key='4' onChange={setOperation} type='Statement' isType={isType} />
          </div>
          <div style={{ textAlign: 'left' }} className={styles.Header_Main}>
            <span>缺陷结果</span>
            <WarnTip />
          </div>
          {(statusMemo === 1 || statusMemo === 0) && (
            <div className={styles.Header_Main}>
              <span style={{ width: '100%' }}>操作</span>
            </div>
          )}
        </div>

        <div className={styles.Table_Boby}>
          {logData && (
            <>
              {logData.map((item: DataType) => {
                return (
                  <div key={`${item.id}${item.msg_index}${item.create_time}`} className={`${styles.Table_concent} ${styleFn(item)}`}>
                    <Tooltip title={item.msg_index} placement='bottomLeft'>
                      <div>{item.msg_index}</div>
                    </Tooltip>
                    <div>
                      <div className={styles.dataInfoContainer}>
                        <Tooltip
                          title={<Tips val={item.send_data[0]} title={item.sent_cnt === 0 ? '未发送 : ' : '已发送 : '} />}
                          placement='bottom'
                          overlayClassName={styles.overlay}
                        >
                          <span className={styles.dataLongInfo}>{item.send_data[0] || '无'}</span>
                        </Tooltip>
                        <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(item.send_data[0])}>
                          <img src={errorFrameCopy} alt='' />
                        </span>
                      </div>
                      <div style={{ display: currentOpenId === item.id ? 'block' : 'none' }} className={styles.dataShowContainer}>
                        {item.send_data.length > 1 &&
                          item.send_data.slice(1).map((send_data: string, index: number) => {
                            return (
                              <div className={styles.dataShowItem} key={`${send_data}_${Math.random()}`}>
                                <Tooltip
                                  title={<Tips val={send_data} title={item.sent_cnt - 1 > index ? '已发送 : ' : '未发送 : '} />}
                                  placement='bottom'
                                  overlayClassName={styles.overlay}
                                >
                                  <span className={item.send_data ? styles.dataLongInfo : styles.noneDatalog}>{send_data}</span>
                                </Tooltip>
                                <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(send_data)}>
                                  <img src={errorFrameCopy} alt='' />
                                </span>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                    <div>
                      <div className={styles.dataInfoContainer}>
                        <Tooltip title={item.recv_data[0]} placement='bottom' overlayClassName={styles.overlay}>
                          <span className={item.recv_data[0] ? styles.dataLongInfo : styles.noneDatalog}>{item.recv_data[0]}</span>
                        </Tooltip>
                        {item.recv_data[0] && (
                          <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(item.recv_data[0])}>
                            <img src={errorFrameCopy} alt='' />
                          </span>
                        )}
                      </div>
                      <div style={{ display: currentOpenId === item.id ? 'block' : 'none' }} className={styles.dataShowContainer}>
                        {item.recv_data.length > 1 &&
                          item.recv_data.slice(1).map((recv_data: string) => {
                            return (
                              <div className={styles.dataShowItem} key={`${recv_data}_${Math.random()}`}>
                                <Tooltip title={recv_data} placement='bottom' overlayClassName={styles.overlay}>
                                  <span className={item.recv_data ? styles.dataLongInfo : styles.noneDatalog}>{recv_data}</span>
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
                    <div>{item.branch_coverage}</div>
                    <div>{item.statement_coverage}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div className={styles.dataLongInfoResult}>
                        {Object.keys(item.crash_info).map(item => {
                          return (
                            <div key={item} className={styles.crash_infoTitle}>
                              <Tooltip title={CrashInfoMapLog[+item]} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                                <span>{CrashInfoMapLog[+item]}</span>
                              </Tooltip>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {[0, 1].includes(status) && (
                      <div className={styles.Opera_detaile}>
                        {Object.keys(item.crash_info)[0] ? (
                          <span
                            className={styles.operate_containers}
                            role='button'
                            tabIndex={0}
                            onClick={() => {
                              inScale(false, item)
                            }}
                          >
                            详情
                          </span>
                        ) : null}
                        {item.send_data.length > 1 && [0, 1].includes(status) && (
                          <span role='button' tabIndex={0} className={styles.operate_container} onClick={() => changeToggleStatus(item.id)}>
                            {currentOpenId === item.id ? '收起' : '展开'}
                          </span>
                        )}

                        {[0, 1].includes(status) ? (
                          <span
                            className={styles.operate_container}
                            role='button'
                            tabIndex={0}
                            onClick={() => {
                              changeReplayStatus(item.id)
                              oneCaseReplay(task_id, item.id)
                            }}
                          >
                            重放
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
          {logData.length === 0 ? <NoData title='暂无数据' /> : null}
        </div>
      </div>
      <div className={globalStyle.AnBan_PaginationsAge}>
        {params && <PaginationsAge length={total} num={params.page_size} getParams={setOperation} pagenums={params.page} />}
      </div>
    </div>
  )
}

DetailTestedTable.displayName = 'DetailTestedTable'

export default DetailTestedTable
