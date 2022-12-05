import * as React from 'react'
import { RouteComponentProps, StaticContext, withRouter } from 'react-router'
import styles from './taskDetail.less'

const ShowTaskDetail: React.FC<RouteComponentProps<any, StaticContext, any>> = props => {
  //   const history = useHistory()

  return (
    <div className={styles.showTaskDetail_container}>
      <div className={styles.showTaskDetail_container_header}>
        <span className={styles.showTaskDetail_container_header_title}>任务信息</span>
      </div>
      <div className={styles.showTaskDetail_container_boby}>
        <span>111</span>
      </div>
    </div>
  )
}

export default withRouter(ShowTaskDetail)
