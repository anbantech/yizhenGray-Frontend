import * as React from 'react'
import TaskDetailModal from 'Src/components/Modal/taskModal/TaskDetailModal'
import { generateUUID } from 'Src/util/common'
import StyleSheet from './Scale.less'

function ScaleDetail(props: any) {
  const data = props.location?.state?.data
  return (
    <div className={StyleSheet.ScaleDetailBodys}>
      <div className={StyleSheet.ScaleDetailBody}>
        {Object.keys(data.crash_type).map(item => {
          return (
            <div key={generateUUID()}>
              {item && <TaskDetailModal value={data.crash_type?.[item]} item={item} msg_index={data.msg_index} create_time={data.create_time} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScaleDetail
