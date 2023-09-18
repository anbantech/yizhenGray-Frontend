import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { Table, ConfigProvider } from 'antd'
import 'antd/dist/antd.css'
import zhCN from 'antd/lib/locale/zh_CN'
import { getRegister, simulateOption } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import withRouterForwardRef from 'Src/components/HOC/ForwardRefWithRouter'
import styles from '../Scale.less'
import { Context } from '../ScaleIndex'

const Performance: React.FC<any> = forwardRef((props, ref) => {
  const type = useContext(Context)?.currentType
  const test_id = useContext(Context)?.test_id
  const isTesting = useContext(Context)?.isTesting
  const logId = useContext(Context)?.logId
  const [loading, setLoading] = useState(false)
  const [registerData, setRegisterData] = useState([])
  const performanceData = async () => {
    try {
      const res = await simulateOption({
        action: 'performance',
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

  const performancedData = async () => {
    try {
      const res = await getRegister({
        type: 'performance',
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
      performancedData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTesting])
  // 向父组件暴露子组件方法
  useImperativeHandle(ref, () => ({
    PerformanceSvg: isTesting && type === 'PerformanceSvg' ? performanceData : null
  }))

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
      title: '调用次数',
      dataIndex: 'execute_times',
      key: 'execute_times'
    },
    {
      title: '当前值(ms)',
      dataIndex: 'now',
      key: 'now'
    },
    {
      title: '最小值(ms)',
      dataIndex: 'min',
      key: 'min'
    },
    {
      title: '最大值(ms)',
      dataIndex: 'max',
      key: 'max'
    },
    {
      title: '平均值(ms)',
      dataIndex: 'average',
      key: 'average'
    },
    {
      title: '累计值(ms)',
      dataIndex: 'total',
      key: 'total'
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
export default withRouterForwardRef(Performance)
