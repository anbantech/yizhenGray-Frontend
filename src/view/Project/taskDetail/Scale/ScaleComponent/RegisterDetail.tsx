import React, { useEffect, useState } from 'react'
import { generateUUID } from 'Src/util/common'
import 'antd/dist/antd.css'
import styles from '../Scale.less'

const RegisterDetailMemo: React.FC<any> = props => {
  const { registeData, registeAllData } = props
  const [registerData, setRegisterData] = useState([])
  const appendData = (value: string[]) => {
    const dimensionArray = new Array(Math.ceil(value.length / 5)).fill([])
    const val = [...value]
    dimensionArray.forEach((item: string[], index: number) => {
      dimensionArray[index] = val.splice(0, 5)
    })
    setRegisterData(dimensionArray as any)
  }

  const twoDimensionArray = React.useCallback(
    (value: string[]) => {
      if (registerData.length === 0) {
        appendData(value)
      } else {
        const flagValue = [...value]
        registeAllData.flat().forEach((item: any, index: number) => {
          if (item.name === (flagValue.flat(1)[index] as any)?.name && item.value !== (flagValue.flat(1)[index] as any)?.value) {
            const ele = item
            ele.flag = '11'
          }
        })
        appendData(flagValue)
      }
    },
    [registerData, registeAllData]
  )
  useEffect(() => {
    if (registeData) {
      twoDimensionArray(registeData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeData])
  return (
    <div className={styles.rowTableDetail}>
      {registerData?.map((item: any) => {
        return (
          <div key={`${Math.random()}${generateUUID()}`} className={styles.register_cloumns}>
            {item?.map((ele: any) => {
              return (
                <div key={generateUUID()} className={styles.register_row}>
                  <div className={styles.register_row_data}>
                    <span style={{ color: ele.flag === '11' ? 'red' : '' }}>{ele.name} </span>
                    <div className={styles.register_line} />
                    <span style={{ color: ele.flag === '11' ? 'red' : '' }}>{ele.value} </span>
                  </div>
                  <div className={styles.registerCloumn_lines}> </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
const RegisterDetail = React.memo(RegisterDetailMemo)
export default RegisterDetail
