import { message } from 'antd'
import * as React from 'react'
import InitTaskInfo from 'Src/components/Modal/taskModal/initTaskInfo'
import { initDetailError } from 'Src/services/api/taskApi'
import { generateUUID } from 'Src/util/common'
import StyleSheet from './Scale.less'

function ScaleInitInfo(props: any) {
  const { id } = props.location?.state?.instanceInfo
  const [data, setData] = React.useState<any>()
  const getInitErrorInfo = React.useCallback(async (id: string) => {
    try {
      const res = await initDetailError(id)
      if (res.data) {
        setData(res.data)
      }
    } catch (error) {
      message.error(error.message)
    }
  }, [])
  React.useEffect(() => {
    if (id) {
      getInitErrorInfo(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  return (
    <div className={StyleSheet.ScaleDetailBodys}>
      {data && (
        <div className={StyleSheet.ScaleDetailBody}>
          {Object.keys(data.crash_type).map(item => {
            return (
              <div key={generateUUID()}>
                {item && <InitTaskInfo value={data.crash_type?.[item]} item={item} msg_index={data.msg_index} create_time={data.create_time} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ScaleInitInfo
