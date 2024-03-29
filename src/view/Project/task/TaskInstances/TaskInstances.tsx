import * as React from 'react'
import { Tooltip } from 'antd'
import { ResTaskDetail } from 'Src/globalType/Response'
import testing from 'Src/assets/instanceImage/img_测试中.png'
import stoping from 'Src/assets/instanceImage/img_停止中.png'
import replaying from 'Src/assets/instanceImage/img_重放中.png'
import stop from 'Src/assets/instanceImage/img_正常结束.png'
import Paused from 'Src/assets/instanceImage/img_暂停.png'
import ready from 'Src/assets/instanceImage/img_测试环境验证中.png'
import errorPaused from 'Src/assets/instanceImage/img_异常暂停.png'
import errorStop from 'Src/assets/instanceImage/img_异常结束.png'
import readying from 'Src/assets/instanceImage/img_准备中.png'
import initError from 'Src/assets/instanceImage/img_固件初始化失败.png'
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
  8: replaying,
  10: initError,
  11: ready
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
              <span>
                <Tooltip placement='top' title={InstancesDetail.task_detail.desc}>
                  <span className={InstancesDetail.task_detail.desc ? styles.descChartMore : styles.descChart}>
                    {InstancesDetail.task_detail.desc ? `任务描述 : ${InstancesDetail.task_detail.desc}` : '任务描述 : 暂无描述'}
                  </span>
                </Tooltip>
              </span>
              <div className={styles.cloumnLine} />
              <span className={styles.descChart}>仿真节点 : {InstancesDetail.task_detail.simu_instance_id} </span>
              <div className={styles.cloumnLine} />
              <span className={styles.descChart}>激励序列 : {InstancesDetail.task_detail.group_name} </span>
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
