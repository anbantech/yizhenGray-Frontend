import * as React from 'react'
import globalStyle from 'Src/view/Project/project/project.less'
import TaskDetailCard from './taskDetailCard'
import TaskDetailHead from './taskDetailHead'

const TaskDetailTask: React.FC = () => {
  return (
    <div className={globalStyle.AnBan_main}>
      <TaskDetailHead />
      <TaskDetailCard />
    </div>
  )
}

export default TaskDetailTask
