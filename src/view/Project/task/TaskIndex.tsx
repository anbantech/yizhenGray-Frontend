import * as React from 'react'
import TaskList from './taskList/task'
import TaskInstances from './TaskInstances/TaskInstances'
import styles from './TaskIndex.less'

function TaskIndex() {
  return (
    <div className={styles.TaskIndexBody}>
      <TaskList />
      <TaskInstances />
    </div>
  )
}

export default TaskIndex
