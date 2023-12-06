import * as React from 'react'
import { RouteComponentProps, StaticContext } from 'react-router'
import { ResTaskDetail } from 'Src/globalType/Response'
import no from 'Src/assets/image/no.svg'
import { throwErrorMessage } from 'Src/util/message'
import { taskTest } from 'Src/services/api/taskApi'
import { useWebSocketStore } from 'Src/webSocket/webSocketStore'
import TaskList from './TaskList/task'
import styles from './TaskIndex.less'
import { TaskListDataStore, TaskTableStore } from './TaskStore/TaskStore'
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

const params = {
  task_id: null,
  key_word: '',
  page: 1,
  page_size: 10,
  status: null,
  sort_field: 'create_time',
  sort_order: 'descend'
}
const TaskIndex: React.FC<RouteComponentProps<any, StaticContext, projectPropsType<projectInfoType>>> = props => {
  const { projectInfo } = props.location?.state
  const { getTaskDeatil, getTasKList, setTaskID } = TaskListDataStore()
  const TaskId = TaskListDataStore(state => state.TaskId) as number
  const TaskDetail = TaskListDataStore(state => state.TaskDetail)
  const request = TaskListDataStore(state => state.request)
  const { setTaskList, setTotal, initParams } = TaskTableStore()
  const getTaskInstancesList = React.useCallback(
    async value => {
      if (!value.task_id) return
      try {
        const listResult = await taskTest(value)
        if (listResult.data) {
          initParams(value.task_id)
          setTotal(listResult.data.total)
          setTaskList(listResult.data.results)
        }
        return listResult
      } catch (error) {
        throwErrorMessage(error)
      }
    },
    [initParams, setTaskList, setTotal]
  )

  const { sendMessage, messages } = useWebSocketStore()

  const status = React.useMemo(() => {
    if (messages?.task_id === TaskId) {
      return messages.task_status
    }
  }, [messages, TaskId])

  React.useEffect(() => {
    getTasKList(projectInfo.projectId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectInfo.projectId, request, status])

  React.useEffect(() => {
    if (TaskId) {
      sendMessage(TaskId, 'task')
      getTaskDeatil(TaskId)
        .then(async () => {
          const result = await getTaskInstancesList({ ...params, task_id: TaskId })
          return result
        })
        .catch((error: any) => {
          throwErrorMessage(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TaskId])

  React.useEffect(() => {
    return () => {
      setTaskID(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.TaskIndexBody} style={{ display: 'flex' }}>
      <TaskList status={status as number} />
      {TaskDetail && status !== undefined ? <TaskInstances data={TaskDetail} status={status} /> : <NoTask />}
    </div>
  )
}

export default TaskIndex
