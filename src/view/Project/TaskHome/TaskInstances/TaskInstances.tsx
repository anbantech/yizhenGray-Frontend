import * as React from 'react'
import HeaderComponets from '../TaskHeader/TaskHeaderComponents'
import InstancesTable from '../TaskInstanceTable/InstancesTable'
import styles from '../TaskHeader/TaskInstance.less'

function TaskInstances(props: Record<string, any>) {
  const { data, status } = props

  return (
    <div className={styles.rightBody}>
      <HeaderComponets data={data} status={status} />
      <InstancesTable status={status} />
    </div>
  )
}

export default TaskInstances
