import React, { useCallback } from 'react'
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styles from '../BaseModle.less'

function ModalpPop(props: any) {
  const { IsModalVisible, CommonModleClose, ing, spinning, concent, name, deleteProjectRight } = props
  const Title = () => {
    return (
      <div>
        <ExclamationCircleOutlined />
        <span style={{ marginLeft: '10px' }}>{name}</span>
      </div>
    )
  }

  console.log(IsModalVisible)
  const isClose = useCallback(() => {
    if (!spinning) {
      CommonModleClose(false)
    }
    return !spinning
  }, [CommonModleClose, spinning])
  return (
    <Modal
      className={styles.modleStyle}
      visible={IsModalVisible}
      width='400px'
      title={<Title />}
      onCancel={isClose}
      footer={[
        <Button
          className={styles.btn_cancelCrashTable}
          key='back'
          disabled={spinning}
          onClick={() => {
            CommonModleClose(false)
          }}
        >
          取消
        </Button>,
        <Button
          className={styles.btn_create}
          key='submit'
          type='primary'
          style={{ width: '96px' }}
          loading={spinning}
          onClick={() => {
            deleteProjectRight()
          }}
        >
          {spinning ? `${ing}` : '确定'}
        </Button>
      ]}
    >
      <span className={styles.chartStyle}>{concent}</span>
    </Modal>
  )
}

export default ModalpPop
