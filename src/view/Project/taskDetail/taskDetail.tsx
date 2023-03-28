import * as React from 'react'
import { useEffect, useRef } from 'react'
import { Spin } from 'antd'
import { RouteComponentProps, StaticContext, useHistory } from 'react-router'
import { ResTaskDetail } from 'Src/globalType/Response'
import UseWebsocket from 'Src/webSocket/useWebSocket'
import useDepCollect from 'Src/util/Hooks/useDepCollect'
import { TaskDetail } from 'Src/services/api/taskApi'
import globalStyle from 'Src/view/Project/project/project.less'
import { projectInfoType } from '../task/taskList/task'
import DetailTestingTable from './tasklog/DetailTestingTable'
import TaskDetailCard from './taskDetailCompoents/taskDetailCard'
import TaskDetailHead from './taskDetailCompoents/taskDetailHead'
import DetailTestedTable from './tasklog/taskLog'
import { UseGetTestLog } from './taskDetailUtil/getTestLog'

export interface taskDetailInfoType {
  status: boolean
  editTask: false
  task_id: string
}

interface taskDetailType<S, T> {
  projectInfo: T
  taskInfo: S
}

const TaskDetailTask: React.FC<RouteComponentProps<any, StaticContext, taskDetailType<taskDetailInfoType, projectInfoType>>> = props => {
  const { taskInfo, projectInfo } = props.location.state

  const RequsetParams = {
    task_id: +taskInfo.task_id,
    page: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    case_type: '',
    sort_field: 'create_time',
    sort_order: 'descend',
    system: 'hex',
    diagnosis: ''
  }
  const history = useHistory()

  const [taskDetailInfo, setTaskDetailInfo] = React.useState<ResTaskDetail>()
  const [updateStatus, setUpdateStatus] = React.useState(0)
  const timer = useRef<any>()
  const [messageInfo] = UseWebsocket(+taskInfo.task_id)
  const [status, depCollect, depData] = useDepCollect(RequsetParams)
  const [total, logData] = UseGetTestLog(depData, updateStatus)
  const [spinning, setSpinning] = React.useState(false)
  // const updateRef = useRef<any>()
  const getTaskDetail = async (value: string) => {
    const getTaskDetails = await TaskDetail(value)
    if (getTaskDetails.data) {
      setTaskDetailInfo(getTaskDetails.data)
    }
  }

  // 跳转任务详情
  const jumpLookTaskInfo = React.useCallback(() => {
    history.push({
      pathname: '/projects/Tasks/Detail/lookTaskDetailInfo',
      state: { projectInfo, taskInfo, taskDetailInfo }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDetailInfo])

  // 测试降序
  const testTimeSort = (value: string) => {
    depCollect(true, { sort_order: value, page: 1 })
  }

  // 筛选异常用例
  const caseSort = (value: string) => {
    depCollect(true, { case_type: value, page: 1 })
  }

  // 跳转日志
  const lookLog = React.useCallback(() => {
    history.push({
      pathname: '/projects/Tasks/Detail/TaskLog',
      state: { projectInfo, taskInfo }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changePage = (page: number, pageSize: number) => {
    depCollect(true, { page, page_size: pageSize })
  }
  const getMessageStatus = React.useCallback(() => {
    if (messageInfo && messageInfo.task_id) {
      if (+messageInfo.task_id === +taskInfo.task_id) {
        if (updateStatus !== messageInfo.task_status) {
          setUpdateStatus(messageInfo.task_status)
        }
        if (taskInfo.task_id && ![1, 2, 4].includes(messageInfo.task_status)) {
          getTaskDetail(taskInfo.task_id)
        }
      }
    }
  }, [messageInfo, taskInfo.task_id, updateStatus])

  useEffect(() => {
    getMessageStatus()
  }, [getMessageStatus, taskInfo.task_id, updateStatus])

  // useEffect(() => {
  //   if ([1, 4].includes(updateStatus) && [1, 4].includes(+taskInfo.status)) {
  //     setSpinning(true)
  //     if (spinning) {
  //       updateRef.current = setTimeout(() => {
  //         setSpinning(false)
  //       }, 2000)
  //     }
  //   }
  // }, [updateStatus, taskInfo.status, spinning])

  useEffect(() => {
    if (taskInfo.task_id && updateStatus === 2) {
      timer.current = setInterval(() => {
        getTaskDetail(taskInfo.task_id)
      }, 1000)
    }
    return () => {
      clearInterval(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDetailInfo?.status, taskInfo.task_id, updateStatus])

  return (
    <Spin tip='数据重载ing' size='large' spinning={spinning}>
      <div className={globalStyle.AnBan_main}>
        {taskDetailInfo && (
          <>
            <TaskDetailHead taskDetailInfo={taskDetailInfo} infoMap={props.location?.state} jumpLookTaskInfo={jumpLookTaskInfo} />
            <TaskDetailCard taskDetailInfo={taskDetailInfo} lookLog={lookLog} />
            {taskDetailInfo?.status === 2 ? (
              <DetailTestingTable params={depData} status={updateStatus} />
            ) : (
              <DetailTestedTable
                status={updateStatus}
                task_id={+taskInfo.task_id}
                infoMap={props.location?.state}
                testTimeSort={testTimeSort}
                caseSort={caseSort}
                changePage={changePage}
                total={total as number}
                params={depData}
                logData={logData}
              />
            )}
          </>
        )}
      </div>
    </Spin>
  )
}

export default TaskDetailTask
