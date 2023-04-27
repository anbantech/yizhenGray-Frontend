import * as React from 'react'
import { RouteComponentProps, StaticContext } from 'react-router'
import { ResTaskDetail } from 'Src/globalType/Response'
import TaskList from './taskList/task'
import TaskInstances from './TaskInstances/TaskInstances'

import styles from './TaskIndex.less'
import { GetTaskDetail } from './TaskHookFn/TaskHookFn'

export interface projectInfoType {
  projectId: number
  projectDesc: string
  projectName: string
}

interface projectPropsType<T> {
  projectInfo: T
}
export const InstancesContext = React.createContext<ResTaskDetail>(null!)
const TaskIndex: React.FC<RouteComponentProps<any, StaticContext, projectPropsType<projectInfoType>>> = () => {
  // 获取任务详情信息
  const [task_detail, getDetail] = GetTaskDetail()
  // 查看实例信息
  const checkInstances = (taskId: string) => {
    getDetail(taskId)
  }
  return (
    <div className={styles.TaskIndexBody}>
      <TaskList checkInstances={checkInstances} />
      <InstancesContext.Provider value={task_detail}>
        <TaskInstances />
      </InstancesContext.Provider>
    </div>
  )
}

export default TaskIndex
