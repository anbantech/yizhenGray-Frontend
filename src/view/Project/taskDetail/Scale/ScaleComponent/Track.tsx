import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { Table, ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import 'antd/dist/antd.css'
import { throwErrorMessage } from 'Src/util/message'
import { getRegister, simulateOption } from 'Src/services/api/taskApi'
import withRouterForwardRef from 'Src/components/HOC/ForwardRefWithRouter'
import styles from '../Scale.less'
import { Context } from '../ScaleIndex'

const Track: React.FC<any> = forwardRef((props, ref) => {
  // const { buttonStatus } = props
  const type = useContext(Context)?.currentType
  const test_id = useContext(Context)?.test_id
  const isTesting = useContext(Context)?.isTesting
  const logId = useContext(Context)?.logId
  const [loading, setLoading] = useState(false)
  const [registerData, setRegisterData] = useState([])

  const getTestingTrackData = async () => {
    try {
      const res = await simulateOption({
        action: 'track',
        instance_id: test_id
      })
      if (res.data) {
        setRegisterData(res.data)
      }
      setLoading(false)
    } catch (error) {
      throwErrorMessage(error)
    }
  }

  const getTestedTrackData = async () => {
    try {
      const res = await getRegister({
        type: 'track',
        test_log_id: logId
      })
      if (res.data) {
        setRegisterData(res.data)
      }
      setLoading(false)
    } catch (error) {
      throwErrorMessage(error)
    }
  }

  useEffect(() => {
    if (!isTesting) {
      getTestedTrackData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTesting])
  // 向父组件暴露子组件方法
  useImperativeHandle(ref, () => ({
    TrackSvg: isTesting && type === 'TrackSvg' ? getTestingTrackData : null
  }))

  // useEffect(() => {
  //   if (!isTesting) {
  //     setLoading(true)
  //     getTestedTrackData()
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [test_id, isTesting, logId])
  // const trackRef = useRef<any>()
  // useEffect(() => {
  //   trackRef.current = setInterval(() => {
  //     if (!buttonStatus && type === 'TrackSvg') {
  //       getTestingTrackData()
  //     }
  //   }, 5000)
  //   return () => {
  //     clearInterval(trackRef.current)
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [buttonStatus, type])
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: '函数名',
      dataIndex: 'func_name',
      key: 'func_name'
    },
    {
      title: '文件名',
      dataIndex: 'file_name',
      key: 'file_name'
    },
    {
      title: '代码行',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '运行时间(ms)',
      dataIndex: 'time',
      key: 'time'
    }
  ]
  return (
    <div className={styles.rowTable}>
      <ConfigProvider locale={zhCN}>
        <Table columns={columns} loading={loading} dataSource={registerData} pagination={false} />
      </ConfigProvider>
    </div>
  )
})
export default withRouterForwardRef(Track)
