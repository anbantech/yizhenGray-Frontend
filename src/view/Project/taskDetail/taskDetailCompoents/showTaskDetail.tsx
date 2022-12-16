import * as React from 'react'
import { RouteComponentProps, StaticContext, useLocation, withRouter } from 'react-router'
import TaskForm from './taskForm'
import styles from '../taskDetail.less'

interface LocationType {
  taskDetailInfo: any
}
const ShowTaskDetail: React.FC<RouteComponentProps<any, StaticContext, any>> = () => {
  const location = useLocation()
  const [taskInfo, setTaskInfo] = React.useState()
  React.useEffect(() => {
    if (location) {
      setTaskInfo((location.state as LocationType)?.taskDetailInfo)
    }
  }, [location])
  return (
    <div className={styles.showTaskDetail_container}>
      <div className={styles.showTaskDetail_container_header}>
        <span className={styles.showTaskDetail_container_header_title}>任务信息</span>
      </div>
      <div className={styles.showTaskDetail_container_boby}>
        <TaskForm taskInfo={taskInfo} />
      </div>
    </div>
  )
}

export default withRouter(ShowTaskDetail)
