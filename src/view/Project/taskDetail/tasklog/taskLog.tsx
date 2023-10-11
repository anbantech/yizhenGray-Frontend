import { message, Tooltip } from 'antd'
import { useHistory } from 'react-router'
import globalStyle from 'Src/view/Project/project/project.less'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getTime } from 'Src/util/baseFn'
import { copyText, generateUUID, throwErrorMessage } from 'Src/util/common'
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
import CheckCrashLevelCompoents from '../taskDetailCompoents/CheckCrashLevelCompoents'

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
  infoMap: taskDetailType<taskDetailInfoType, projectInfoType>
  status: number
  // cancelMenu: (e: React.MouseEvent<HTMLDivElement>) => void
  system: string
  Checked: (value: string) => void
  BranchSort: (value: string) => void
  StatementSort: (value: string) => void
  level: null | number
  checkCrashLevel: (value: string) => void
}

interface DataType {
  status: number
  case_content: string
  case_type: number
  crash_type: any
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
  level: null | number
}
type Detail_Type = Record<string, any>

interface TipProp {
  data: string
  caseCount: number
  sendCount: number
}
const TipComponents = (props: TipProp) => {
  const { data, caseCount, sendCount } = props
  const isSend = React.useMemo(() => {
    const isSendString = (caseCount === 0 && sendCount === 0) || (caseCount === 1 && sendCount !== 0) ? '已发送' : '未发送'
    return isSendString
  }, [caseCount, sendCount])
  return (
    <>
      <span className={styles.tipsCompoents}>{`${isSend} : ${data}`}</span>
    </>
  )
}
const TipComponentsMemo = React.memo(TipComponents)
const DetailTestedTable: React.FC<propsType> = (props: propsType) => {
  const {
    task_id,
    params,
    total,
    system,
    Checked,
    checkCrashLevel,
    status,
    logData,
    level,
    StatementSort,
    BranchSort,
    changePage,
    testTimeSort
  } = props
  const { taskInfo, projectInfo, instanceInfo } = props.infoMap

  const history = useHistory()
  const [currentOpenId, setCurrentOpenId] = useState<number>(-1)

  const [replayId, setReplayId] = useState<number>(-1)

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

  const statusMemo = useMemo(() => {
    return status
  }, [status])

  const changeToggleStatus = (id: number) => {
    setCurrentOpenId(id === currentOpenId ? -1 : id)
  }

  const changeReplayStatus = (id: number) => {
    setReplayId(id)
  }

  // 单个用例的重放
  const oneCaseReplay = async (taskID: number, caseID: number) => {
    changeReplayStatus(caseID)
    const idArray = {
      instance_id: taskID,
      error_id: caseID
    }
    try {
      const res = await rePlayTask(idArray)
      if (res.message === '固件启动异常') {
        return message.error('固件初始化异常，更多信息请查看状态详情')
      }
      return res
    } catch (error) {
      throwErrorMessage(error, {
        2009: '重放失败',

        3002: '仿真终端无响应，请重启并检查网络',
        2007: '停止失败',
        7015: '固件初始化异常，更多信息请查看状态详情'
      })
    }
  }

  // 跳转仿真
  const inScale = (value: boolean, data: Detail_Type) => {
    history.push({
      pathname: '/Projects/Tasks/Detail/ScaleDetail',
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
          // if (Object.keys(item.crash_type)[0] && !item.case_type) {
          //   return styles.warninfo
          // }
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

  useEffect(() => {
    setType('time')
  }, [status])

  return (
    <div className={styles.tableList}>
      <div className={styles.tableListleftq}>
        <span className={styles.log}>测试详情</span>
        <div className={styles.doubleCheck}>
          <CheckCrashLevelCompoents system={level} Checked={checkCrashLevel} />
          <CheckCompoents system={system} Checked={Checked} />
        </div>
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
          </div>
          {(statusMemo === 1 || statusMemo === 0 || statusMemo === 10) && (
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
                  <div key={`${item.id}${item.msg_index}`} className={`${styles.Table_concent} ${styleFn(item)}`}>
                    <div>{item.msg_index}</div>
                    <div>
                      <div className={styles.dataInfoContainer}>
                        <Tooltip
                          key={item.msg_index}
                          title={<TipComponentsMemo data={item.send_data[0]} caseCount={item.case_type} sendCount={item.sent_cnt} />}
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
                              <div key={`${generateUUID()}${String(index)}`} className={styles.dataShowItem}>
                                <Tooltip
                                  destroyTooltipOnHide={Boolean(1)}
                                  key={String(index)}
                                  title={<TipComponentsMemo data={send_data} caseCount={item.case_type} sendCount={item.sent_cnt} />}
                                  placement='bottom'
                                >
                                  <span className={styles.dataLongInfo}> {send_data || '无'} </span>
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
                          <span>{item.recv_data[0] || '-'}</span>
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
                                  <span>{recv_data || '-'}</span>
                                </Tooltip>
                                {/* <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(recv_data)}>
                                  <img src={errorFrameCopy} alt='' />
                                </span> */}
                              </div>
                            )
                          })}
                      </div>
                    </div>
                    <div>{getTime(item.create_time)}</div>
                    <div>{item.branch_coverage}</div>
                    <div>{item.statement_coverage}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div className={styles.dataLongInfoResult}>
                        {Object.keys(item.crash_type).map(item => {
                          return (
                            <div key={item} className={styles.crash_infoTitle}>
                              <Tooltip title={CrashInfoMapLog[+item]} placement='bottom' style={{ width: '100px' }}>
                                <span>{CrashInfoMapLog[+item]}</span>
                              </Tooltip>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {[0, 1, 10].includes(status) && (
                      <div className={styles.Opera_detaile}>
                        {Object.keys(item.crash_type)[0] ? (
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
                        {item.send_data.length > 1 && [0, 1, 10].includes(status) && (
                          <span role='button' tabIndex={0} className={styles.operate_container} onClick={() => changeToggleStatus(item.id)}>
                            {currentOpenId === item.id ? '收起' : '展开'}
                          </span>
                        )}

                        {[0, 1, 10].includes(status) ? (
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
