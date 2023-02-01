import * as React from 'react'
import { useEffect, useState } from 'react'
import { RouteComponentProps, StaticContext, useHistory } from 'react-router'
import { ResTaskDetail } from 'Src/globalType/Response'
import { TaskDetail } from 'Src/services/api/taskApi'
import globalStyle from 'Src/view/Project/project/project.less'
import { projectInfoType } from '../task/taskList/task'
import DetailTestingTable from './tasklog/DetailTestingTable'
import TaskDetailCard from './taskDetailCompoents/taskDetailCard'
import TaskDetailHead from './taskDetailCompoents/taskDetailHead'
import DetailTestedTable from './tasklog/taskLog'
import UseGetTestLog from './taskDetailUtil/getTestLog'

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
  const RequsetParams = {
    task_id: +taskInfo.task_id,
    page: 1,
    page_size: 6,
    start_time: '',
    end_time: '',
    is_wrong: '',
    sort_field: 'create_time',
    sort_order: 'descend',
    system: 'hex',
    diagnosis: ''
  }
  const history = useHistory()
  const [params, setParams] = useState(RequsetParams)
  const [taskDetailInfo, setTaskDetailInfo] = React.useState<ResTaskDetail>()
  const [updateStatus, setUpdateStatus] = React.useState(0)
  const [total, logData] = UseGetTestLog(params)
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
  // 跳转日志
  const lookLog = React.useCallback(() => {
    history.push({
      pathname: '/projects/Tasks/Detail/TaskLog',
      state: { projectInfo, taskInfo }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const changePage = () => {}
  useEffect(() => {
    if (taskInfo.task_id) {
      getTaskDetail(taskInfo.task_id)
    }
  }, [taskInfo.task_id, updateStatus])

  return (
    <div className={globalStyle.AnBan_main}>
      {taskDetailInfo && (
        <>
          <TaskDetailHead taskDetailInfo={taskDetailInfo} jumpLookTaskInfo={jumpLookTaskInfo} setUpdateStatus={setUpdateStatus} />
          <TaskDetailCard taskDetailInfo={taskDetailInfo} lookLog={lookLog} />
          {updateStatus === 2 ? (
            <DetailTestingTable params={params} logData={logData} />
          ) : (
            <DetailTestedTable changePage={changePage} total={total as number} params={params} logData={logData} />
          )}
        </>
      )}
    </div>
  )
}

export default TaskDetailTask
