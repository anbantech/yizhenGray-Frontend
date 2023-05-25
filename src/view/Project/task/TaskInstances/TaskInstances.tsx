import * as React from 'react'

import { ResTaskDetail } from 'Src/globalType/Response'
import testing from 'Src/assets/instanceImage/img_测试中@2x.png'
import stoping from 'Src/assets/instanceImage/img_停止中@2x.png'
import replaying from 'Src/assets/instanceImage/img_重放中@2x.png'
import stop from 'Src/assets/instanceImage/img_正常结束@2x.png'
import Paused from 'Src/assets/instanceImage/img_暂停@2x.png'
import errorPaused from 'Src/assets/instanceImage/img_异常暂停@2x.png'
import errorStop from 'Src/assets/instanceImage/img_异常结束@2x.png'
import readying from 'Src/assets/instanceImage/img_准备中@2x.png'
import { InstancesContext } from '../TaskIndex'

import styles from './TaskInstance.less'
import TaskInstanceTable from './TaskInstanceTable'

interface propsType {
  task_detail: ResTaskDetail
}

const ImageMap = {
  0: stop,
  1: errorStop,
  2: testing,
  3: Paused,
  4: errorPaused,
  5: readying,
  7: stoping,
  8: replaying
}

const HeaderComponets: React.FC = () => {
  const InstancesDetail = React.useContext(InstancesContext)
  return (
    <>
      {InstancesDetail && (
        <div className={styles.headerBody}>
          <div className={styles.headerLeft}>
            <span className={styles.headerName}>{InstancesDetail.task_detail.name}</span>
            <div className={styles.headerSubtitle}>
              <span>任务描述:{InstancesDetail.task_detail.desc}</span>
              <div className={styles.cloumnLine} />
              <span>仿真节点:{InstancesDetail.task_detail.simu_instance_id}节点</span>
              <div className={styles.cloumnLine} />
              <span>交互:{InstancesDetail.task_detail.group_name} </span>
            </div>
          </div>
          <div className={styles.headerright}>
            <img className={styles.headerright} src={ImageMap[InstancesDetail.task_detail.status as keyof typeof ImageMap]} alt='' />
          </div>
        </div>
      )}
    </>
  )
}

function TaskInstances() {
  return (
    <div className={styles.rightBody}>
      <HeaderComponets />
      <TaskInstanceTable />
    </div>
  )
}

export default TaskInstances
