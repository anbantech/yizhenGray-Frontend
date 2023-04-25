import * as React from 'react'
import styles from './TaskInstance.less'

const HeaderComponets: React.FC = () => {
  return (
    <div className={styles.headerBody}>
      <div className={styles.headerLeft}>
        <span>项目名称</span>
        <span>描述:xxxxxxxxx </span>
      </div>
    </div>
  )
}

const TableComponets: React.FC = () => {
  return (
    <div className={styles.rightBody}>
      <HeaderComponets />
    </div>
  )
}

function TaskInstances() {
  return (
    <div className={styles.rightBody}>
      <HeaderComponets />
      <TableComponets />
    </div>
  )
}

export default TaskInstances
