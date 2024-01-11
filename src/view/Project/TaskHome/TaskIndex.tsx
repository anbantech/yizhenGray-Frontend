import * as React from 'react'
import { RouteComponentProps, StaticContext } from 'react-router'
import { ResTaskDetail } from 'Src/globalType/Response'
import no from 'Src/assets/image/no.svg'

import { useWebSocketStore } from 'Src/webSocket/webSocketStore'
import TaskList from './TaskList/task'
import styles from './TaskIndex.less'
import { TaskListDataStore } from './TaskStore/TaskStore'
import TaskInstances from './TaskInstances/TaskInstances'

export interface projectInfoType {
  projectId: number
  projectDesc: string
  projectName: string
}

interface ProviederType {
  task_detail: ResTaskDetail
  setInstance: React.Dispatch<React.SetStateAction<boolean>>
  getDetail: (id: number) => void
}

interface projectPropsType<T> {
  projectInfo: T
}
export const InstancesContext = React.createContext<ProviederType>(null!)

export const NoTask = () => {
  return (
    <div className={styles.noTask}>
      <img src={no} alt='' />
    </div>
  )
}

const TaskIndex: React.FC<RouteComponentProps<any, StaticContext, projectPropsType<projectInfoType>>> = props => {
  const { projectInfo } = props.location?.state

  const TaskDetail = TaskListDataStore(state => state.TaskDetail)
  const request = TaskListDataStore(state => state.request)

  const { getTasKList, initData } = TaskListDataStore()

  const { messages } = useWebSocketStore()

  const status = React.useMemo(() => {
    if (messages?.task_id) {
      return messages.task_status
    }
  }, [messages])

  React.useEffect(() => {
    getTasKList(projectInfo.projectId)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectInfo.projectId, request, status])

  React.useEffect(() => {
    return () => {
      initData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={styles.TaskIndexBody} style={{ display: 'flex' }}>
      <TaskList />
      {TaskDetail ? <TaskInstances data={TaskDetail} status={status} /> : <NoTask />}
    </div>
  )
}

export default TaskIndex
