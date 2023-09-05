import * as React from 'react'
import { useEffect, useRef } from 'react'
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
    level: '',
    statement_coverage: '',
    branch_coverage: '',
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
  const [display, setDisplay] = React.useState(false)
  const updateRef = useRef<any>()

  const getInstanceDetail = React.useCallback(async (value: string) => {
    const getTaskDetails = await instanceDetail(value)
    if (getTaskDetails.data) {
      setTaskDetailInfo(getTaskDetails.data)
    }
  }, [])

  // 测试降序
  const testTimeSort = (value: string) => {
    depCollect(true, { sort_order: value, page: 1, statement_coverage: '', branch_coverage: '' })
  }

  const statementSort = (value: string) => {
    depCollect(true, { sort_order: 'descend', statement_coverage: value, branch_coverage: '', page: 1 })
  }

  const branchSort = (value: string) => {
    depCollect(true, { sort_order: 'descend', branch_coverage: value, statement_coverage: '', page: 1 })
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

  const checkCrashLevel = (value: string) => {
    depCollect(true, { level: value, page: 1 })
  }

  const getMessageStatus = React.useCallback(() => {
    if (messageInfo && messageInfo.instance_id) {
      if (+messageInfo.instance_id === +instanceInfo.id) {
        if (updateStatus !== messageInfo.task_status) {
          setUpdateStatus(messageInfo.task_status)
          setDisplay(messageInfo.dispaly)
          if ([1, 4].includes(messageInfo.task_status)) {
            setSpinning(true)
          }
        }
        getInstanceDetail(instanceInfo.id)
      }
    }
  }, [getInstanceDetail, instanceInfo.id, messageInfo, updateStatus])

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
        <div className={globalStyle.AnBan_main}>
          {taskDetailInfo && (
            <>
              <TaskDetailHead
                taskDetailInfo={taskDetailInfo}
                infoMap={props.location?.state}
                depCollect={depCollect}
                display={display}
                RequsetParams={RequsetParams}
              />
              <TaskDetailCard taskDetailInfo={taskDetailInfo} lookLog={lookLog} />
              {taskDetailInfo?.status === 2 ? (
                <DetailTestingTable params={RequsetParams} taskDetailInfo={taskDetailInfo} status={updateStatus} />
              ) : (
                <DetailTestedTable
                  level={depData.level}
                  system={depData.system}
                  status={updateStatus}
                  Checked={checked}
                  checkCrashLevel={checkCrashLevel}
                  task_id={+instanceInfo.id}
                  infoMap={props.location?.state}
                  testTimeSort={testTimeSort}
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
      ) : (
        <ReportLoading value='数据正在加载ing' />
      )}
    </>
  )
}

export default TaskDetailTask
