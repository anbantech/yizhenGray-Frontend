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
import styles from './TaskInstance.less'

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

function HeaderComponetsMemo(props: Record<string, any>) {
  const { data, status } = props

  return (
    <>
      {data && (
        <div className={styles.headerBody}>
          <div className={styles.headerLeft}>
            <span className={styles.headerName}>{data.name}</span>
            <div className={styles.headerSubtitle}>
              <span>
                <Tooltip placement='top' title={data.desc}>
                  <span className={data.desc ? styles.descChartMore : styles.descChart}>
                    {data.desc ? `任务描述 : ${data.desc}` : '任务描述 : 暂无描述'}
                  </span>
                </Tooltip>
              </span>
              <div className={styles.cloumnLine} />
              <span className={styles.descChart}>
                {`仿真节点 : ${data.simu_instance_id}
                (${data.processor})`}
              </span>
              <div className={styles.cloumnLine} />
              <span className={styles.descChart}>激励序列 : {data.group_name} </span>
            </div>
          </div>
          <div className={styles.headerright}>
            <img className={styles.headerright} src={ImageMap[status as keyof typeof ImageMap]} alt='' />
          </div>
        </div>
      )}
    </>
  )
}

const HeaderComponets = React.memo(HeaderComponetsMemo)
export default HeaderComponets
