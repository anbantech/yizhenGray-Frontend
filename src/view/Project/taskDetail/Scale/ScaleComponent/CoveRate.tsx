import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { Table, ConfigProvider } from 'antd'
import 'antd/dist/antd.css'
import zhCN from 'antd/lib/locale/zh_CN'
import { getRegister, simulateOption } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import withRouterForwardRef from 'Src/components/HOC/ForwardRefWithRouter'
import styles from '../Scale.less'
import { Context } from '../ScaleIndex'

const CoveRate: React.FC<any> = forwardRef((props, ref) => {
  const test_id = useContext(Context)?.test_id
  const isTesting = useContext(Context)?.isTesting
  const logId = useContext(Context)?.logId
  const [loading, setLoading] = useState(false)
  const [registerData, setRegisterData] = useState([])
  const type = useContext(Context)?.currentType
  const getTestingData = async () => {
    try {
      const res = await simulateOption({
        action: 'coverage',
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

  const getTestedData = async () => {
    try {
      const res = await getRegister({
        type: 'coverage',
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
      getTestedData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTesting])
  // 向父组件暴露子组件方法
  useImperativeHandle(ref, () => ({
    CoverRateSvg: isTesting && type === 'CoverRateSvg' ? getTestingData : null
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
      title: '语句数',
      dataIndex: 'statements',
      key: 'statements'
    },
    {
      title: '语句覆盖',
      dataIndex: 'statement_override',
      key: 'statement_override'
    },
    {
      title: '语句覆盖率',
      dataIndex: 'statement_override_rate',
      key: 'statement_override_rate',
      // eslint-disable-next-line react/display-name
      render: (text: any, record: any) => <span key=' new Date()'>{`${record.statement_override_rate}%` || '无'}</span>
    },
    {
      title: '分支数',
      dataIndex: 'branch',
      key: 'branch'
    },
    {
      title: '分支覆盖',
      dataIndex: 'branch_override',
      key: 'branch_override'
    },
    {
      title: '分支覆盖率',
      dataIndex: 'branch_override_rate',
      key: 'branch_override_rate',
      // eslint-disable-next-line react/display-name
      render: (text: any, record: any) => <span key=' new Date()'>{`${record.branch_override_rate}%` || '无'}</span>
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
export default withRouterForwardRef(CoveRate)
