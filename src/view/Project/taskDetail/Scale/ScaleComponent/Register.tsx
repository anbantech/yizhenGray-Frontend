import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import 'antd/dist/antd.css'
import { getRegister, simulateOption } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import withRouterForwardRef from 'Src/components/HOC/ForwardRefWithRouter'
import styles from '../Scale.less'
import { Context } from '../ScaleIndex'

const Register: React.FC<any> = forwardRef((props, ref) => {
  // const { buttonStatus } = props
  const test_id = useContext(Context)?.test_id
  const isTesting = useContext(Context)?.isTesting
  const type = useContext(Context)?.currentType
  const logId = useContext(Context)?.logId

  const [registerData, setRegisterData] = useState([])
  const nowDate = new Date().getTime

  const appendData = (value: string[]) => {
    const dimensionArray = new Array(Math.ceil(value.length / 5)).fill([])
    const val = value
    dimensionArray.forEach((item: string[], index: number) => {
      dimensionArray[index] = val.splice(0, 5)
    })
    setRegisterData(dimensionArray as any)
  }

  const twoDimensionArray = (value: string[]) => {
    if (registerData.length === 0) {
      appendData(value)
    } else {
      const flagValue = value
      flagValue.flat().forEach((item: any, index: number) => {
        if (item.name === (registerData.flat(1)[index] as any).name && item.value !== (registerData.flat(1)[index] as any).value) {
          const ele = item
          ele.flag = '11'
        }
      })
      appendData(flagValue)
    }
  }
  const simulateOptionRegister = async () => {
    try {
      const res = await simulateOption({
        action: 'read_register',
        instance_id: test_id
      })
      if (res.data) {
        twoDimensionArray(res.data)
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }
  useImperativeHandle(ref, () => ({
    Register: isTesting && type === 'Register' ? simulateOptionRegister : null
  }))

  const getRegisterData = async () => {
    try {
      const res = await getRegister({
        type: 'register',
        test_log_id: logId
      })
      if (res.data) {
        twoDimensionArray(res.data)
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }
  // // 向父组件暴露子组件方法
  useEffect(() => {
    if (!isTesting) {
      getRegisterData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTesting])

  return (
    <div className={styles.rowTableRe}>
      {registerData?.map((item: any, index: number) => {
        return (
          <div key={`${index}${Math.random()}`} className={styles.register_cloumn}>
            {item?.map((ele: any) => {
              return (
                <div key={`${nowDate}${Math.random()}`} className={styles.register_row}>
                  <div className={styles.register_row_data}>
                    <span style={{ color: ele.flag === '11' ? 'red' : '' }}>{ele.name} </span>
                    <div className={styles.register_line} />
                    <span style={{ color: ele.flag === '11' ? 'red' : '' }}>{ele.value} </span>
                  </div>
                  <div className={styles.registerCloumn_line}> </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
})
Register.displayName = 'Register'
export default withRouterForwardRef(Register)
