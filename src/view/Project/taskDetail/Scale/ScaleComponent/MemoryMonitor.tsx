import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useContext, useRef, useState } from 'react'

import RectangleButton from 'Src/components/Button/rectangle'
import { simulateOption } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import styles from '../Scale.less'
import { Context } from '../ScaleIndex'

function MemoryMonitor() {
  const { test_id } = useContext(Context)
  const [form] = useForm<any>()
  // const type = useContext(Context)?.currentType
  // const [buttonStatus, setButtonStatus] = useState(true)
  const [MemoryData, setMemoryData] = useState<number[]>([])
  const timerRef = useRef<any>()
  // 查询内存
  const searchMemory = async (val: number[]) => {
    try {
      const values = await form.validateFields()
      const { addr, length } = values
      if (values) {
        try {
          const res = await simulateOption({
            action: 'read_memory',
            instance_id: test_id,
            addr,
            length
          })
          if (res.data) {
            const pre = val
            if (pre.length >= 20) {
              pre.splice(-1, 1)
            }
            setMemoryData([...res.data, ...pre])
          }
        } catch (error) {
          // setButtonStatus(true)
          throwErrorMessage(error)
        }
      }
    } catch (error) {
      // setButtonStatus(true)
      clearInterval(timerRef.current)
      return error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  // useEffect(() => {
  //   if (!buttonStatus) {
  //     timerRef.current = setInterval(() => {
  //       searchMemory(MemoryData)
  //     }, 5000)
  //     return () => {
  //       clearInterval(timerRef.current)
  //     }
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [buttonStatus, type, MemoryData])
  // useEffect(() => {
  //   if (type !== 'Memory') {
  //     setButtonStatus(true)
  //   }
  // }, [type])
  return (
    <div className={styles.memoryMonitor}>
      <div className={styles.memoryMonitorOptions}>
        <Form className={styles.form_wrappers} autoComplete='off' layout='inline' form={form} size='large'>
          <Form.Item name='addr' label='内存起始地址(HEX)' rules={[{ required: true, min: 8, max: 8, message: '请输入八位16进制数' }]}>
            <Input style={{ width: 236, height: 32 }} />
          </Form.Item>
          <Form.Item
            name='length'
            label='内存大小(HEX)'
            validateFirst
            validateTrigger={['onBlur']}
            rules={[
              { required: true, min: 8, max: 8, message: '请输入八位16进制数' },
              {
                validateTrigger: 'onBlur',
                validator(_, value) {
                  const number = Number.parseInt(value, 16)
                  if (number > 8168) {
                    return Promise.reject(new Error('内存过大，请重新输入'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input style={{ width: 236, height: 32 }} placeholder='00000000-00001fe8' />
          </Form.Item>
        </Form>
        <RectangleButton
          style={styles.btn_top}
          name='查询'
          type='primary'
          onClick={() => {
            searchMemory(MemoryData)
          }}
        />
      </div>
      <div className={styles.cutline} />
      <div className={styles.showInfo}>
        <div className={styles.showInfoLeft} style={{ width: '100%' }}>
          {MemoryData.map((item: any) => {
            return (
              <div key={Math.random()} className={styles.memoryData_main}>
                {item.map((title: string) => {
                  return (
                    <div key={Math.random()} className={styles.memoryData_main_concent}>
                      <span className={styles.memoryData_main_span}>{title}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MemoryMonitor
