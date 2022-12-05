import * as React from 'react'
import { useEffect } from 'react'
import { RouteComponentProps, StaticContext, useHistory } from 'react-router'
import { ResTaskDetail } from 'Src/globalType/Response'
import { TaskDetail } from 'Src/services/api/taskApi'
import globalStyle from 'Src/view/Project/project/project.less'
import { projectInfoType } from '../task/taskList/task'
import TaskDetailCard from './taskDetailCard'
import TaskDetailHead from './taskDetailHead'

export interface taskDetailInfoType {
  editTask: false
  task_id: string
}

interface taskDetailType<S, T> {
  projectInfo: T
  taskInfo: S
}

const TaskDetailTask: React.FC<RouteComponentProps<any, StaticContext, taskDetailType<taskDetailInfoType, projectInfoType>>> = props => {
  const { taskInfo, projectInfo } = props.location.state

  const history = useHistory()

  const [taskDetailInfo, setTaskDetailInfo] = React.useState<ResTaskDetail>()

  const getTaskDetail = async (value: string) => {
    const getTaskDetails = await TaskDetail(value)
    if (getTaskDetails.data) {
      setTaskDetailInfo(getTaskDetails.data)
      console.log(getTaskDetails.data)
    }
  }
  // 跳转任务详情
  const jumpLookTaskInfo = React.useCallback(() => {
    history.push({
      pathname: '/projects/Tasks/lookTaskDetailInfo',
      state: { projectInfo, taskInfo }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // 跳转日志
  const lookLog = React.useCallback(() => {
    history.push({
      pathname: '/projects/Tasks/Detail/TaskLog',
      state: { projectInfo, taskInfo }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (taskInfo.task_id) {
      getTaskDetail(taskInfo.task_id)
    }
  }, [taskInfo.task_id])

  return (
    <div className={globalStyle.AnBan_main}>
      {taskDetailInfo && (
        <>
          <TaskDetailHead taskDetailInfo={taskDetailInfo} jumpLookTaskInfo={jumpLookTaskInfo} />
          <TaskDetailCard taskDetailInfo={taskDetailInfo} lookLog={lookLog} />
        </>
      )}
    </div>
  )
}

export default TaskDetailTask
