import * as React from 'react'
import { useEffect, useRef } from 'react'
import { Spin } from 'antd'
import { RouteComponentProps, StaticContext, useHistory } from 'react-router'
import { ResTaskDetail } from 'Src/globalType/Response'
import UseWebsocket from 'Src/webSocket/useWebSocket'
import useDepCollect from 'Src/util/Hooks/useDepCollect'
import { instanceDetail } from 'Src/services/api/taskApi'
import globalStyle from 'Src/view/Project/project/project.less'
import { projectInfoType } from '../task/taskList/task'
import DetailTestingTable from './tasklog/DetailTestingTable'
import TaskDetailCard from './taskDetailCompoents/taskDetailCard'
import TaskDetailHead from './taskDetailCompoents/taskDetailHead'
import DetailTestedTable from './tasklog/taskLog'
import { UseGetTestLog } from './taskDetailUtil/getTestLog'
import ReportLoading from './Report/reportLoading'

export interface taskDetailInfoType {
  status: boolean
  editTask: false
  task_id: string
}

interface taskDetailType<S, T> {
  projectInfo: T
  taskInfo: S
  instanceInfo: any
}

const TaskDetailTask: React.FC<RouteComponentProps<any, StaticContext, taskDetailType<taskDetailInfoType, projectInfoType>>> = props => {
  const { taskInfo, projectInfo, instanceInfo } = props.location.state

  const RequsetParams = {
    instance_id: +instanceInfo.id,
    page: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    case_type: '',
    sort_field: 'create_time',
    sort_order: 'descend',
    system: 'hex',
    statement_coverage: 'descend',
    branch_coverage: 'descend',
    diagnosis: ''
  }

  const history = useHistory()
  const [taskDetailInfo, setTaskDetailInfo] = React.useState<ResTaskDetail>()
  const [updateStatus, setUpdateStatus] = React.useState(0)
  const timer = useRef<any>()
  const [messageInfo] = UseWebsocket(+instanceInfo.id)
  const [status, depCollect, depData] = useDepCollect(RequsetParams)
  const [total, logData] = UseGetTestLog(depData, updateStatus)
  const [spinning, setSpinning] = React.useState(true)
  const updateRef = useRef<any>()

  const getInstanceDetail = async (value: string) => {
    const getTaskDetails = await instanceDetail(value)
    if (getTaskDetails.data) {
      setTaskDetailInfo(getTaskDetails.data)
    }
  }

  // 跳转实例详情
  const jumpLookTaskInfo = React.useCallback(() => {
    history.push({
      pathname: '/projects/Tasks/Detail/lookTaskDetailInfo',
      state: { projectInfo, taskInfo, instanceInfo }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceInfo])

  // 测试降序
  const testTimeSort = (value: string) => {
    depCollect(true, { sort_order: value, page: 1 })
  }

  // 筛选异常用例
  const caseSort = (value: string) => {
    depCollect(true, { case_type: value, page: 1 })
  }

  //
  const statementSort = (value: string) => {
    depCollect(true, { statement_coverage: value, page: 1 })
  }

  const branchSort = (value: string) => {
    depCollect(true, { branch_coverage: value, page: 1 })
  }
  // 跳转日志
  const lookLog = React.useCallback(() => {
    history.push({
      pathname: '/projects/Tasks/Detail/TaskLog',
      state: { projectInfo, taskInfo, instanceInfo }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changePage = (page: number, pageSize: number) => {
    depCollect(true, { page, page_size: pageSize })
  }

  const checked = (value: string) => {
    depCollect(true, { system: value, page: 1 })
  }
  const getMessageStatus = React.useCallback(() => {
    if (messageInfo && messageInfo.instance_id) {
      if (+messageInfo.instance_id === +instanceInfo.id) {
        if (updateStatus !== messageInfo.task_status) {
          setUpdateStatus(messageInfo.task_status)
          if ([1, 4].includes(messageInfo.task_status)) {
            setSpinning(true)
          }
        }
        getInstanceDetail(instanceInfo.id)
      }
    }
  }, [instanceInfo.id, messageInfo, updateStatus])

  useEffect(() => {
    getMessageStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMessageStatus, status, taskInfo.task_id, updateStatus])

  useEffect(() => {
    if ([1, 4].includes(updateStatus)) {
      updateRef.current = setTimeout(() => {
        setSpinning(false)
      }, 5000)
      return () => {
        clearTimeout(updateRef.current)
      }
    }
  }, [updateStatus, spinning])

  useEffect(() => {
    if (taskInfo.task_id && updateStatus === 2) {
      timer.current = setInterval(() => {
        getInstanceDetail(instanceInfo.id)
      }, 1000)
    }
    return () => {
      clearInterval(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceInfo?.status, instanceInfo.id, updateStatus])

  return (
    <>
      {taskDetailInfo ? (
        <Spin tip='数据重载ing' size='large' spinning={[1, 4].includes(updateStatus) && spinning}>
          <div className={globalStyle.AnBan_main}>
            {taskDetailInfo && (
              <>
                <TaskDetailHead taskDetailInfo={taskDetailInfo} infoMap={props.location?.state} jumpLookTaskInfo={jumpLookTaskInfo} />
                <TaskDetailCard taskDetailInfo={taskDetailInfo} lookLog={lookLog} />
                {taskDetailInfo?.status === 2 ? (
                  <DetailTestingTable params={depData} taskDetailInfo={taskDetailInfo} status={updateStatus} />
                ) : (
                  <DetailTestedTable
                    system={depData.system}
                    status={updateStatus}
                    Checked={checked}
                    task_id={+instanceInfo.id}
                    infoMap={props.location?.state}
                    testTimeSort={testTimeSort}
                    caseSort={caseSort}
                    changePage={changePage}
                    total={total as number}
                    params={depData}
                    logData={logData}
                    BranchSort={branchSort}
                    StatementSort={statementSort}
                  />
                )}
              </>
            )}
          </div>
        </Spin>
      ) : (
        <ReportLoading value='数据正在加载ing' />
      )}
    </>
  )
}

export default TaskDetailTask
