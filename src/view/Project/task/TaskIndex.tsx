import * as React from 'react'
import { RouteComponentProps, StaticContext } from 'react-router'
import { ResTaskDetail } from 'Src/globalType/Response'
import no from 'Src/assets/image/no.svg'
import TaskList from './taskList/task'
import TaskInstances from './TaskInstances/TaskInstances'

import styles from './TaskIndex.less'
import { GetTaskDetail } from './TaskHookFn/TaskHookFn'

export interface projectInfoType {
  projectId: number
  projectDesc: string
  projectName: string
}

interface ProviederType {
  task_detail: ResTaskDetail
  setInstance: React.Dispatch<React.SetStateAction<boolean>>
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

const TaskIndex: React.FC<RouteComponentProps<any, StaticContext, projectPropsType<projectInfoType>>> = () => {
  // 获取任务详情信息
  const [task_detail, getDetail] = GetTaskDetail()

  // 更新实列界面
  const [isInStance, setInstance] = React.useState(false)

  // 查看实例信息
  const checkInstances = (taskId: string) => {
    getDetail(taskId)
  }

  return (
    <div className={styles.TaskIndexBody}>
      <InstancesContext.Provider value={{ task_detail, setInstance }}>
        <TaskList checkInstances={checkInstances} />
        {isInStance && task_detail ? <TaskInstances /> : <NoTask />}
      </InstancesContext.Provider>
    </div>
  )
}

export default TaskIndex
