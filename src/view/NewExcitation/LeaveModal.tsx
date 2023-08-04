import React from 'react'
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd'
import styles from 'Src/components/Modal/BaseModle.less'

import { ExclamationCircleOutlined } from '@ant-design/icons'

function LeaveModal(props: any) {
  const { IsModalVisible, CommonModleClose, ing, spinning, concent, name, deleteProjectRight } = props
  const Title = () => {
    return (
      <div>
        <ExclamationCircleOutlined />
        <span style={{ marginLeft: '10px' }}>{name}</span>
      </div>
    )
  }

  const isClose = React.useCallback(() => {
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
      destroyOnClose
      onCancel={isClose}
      footer={[
        <Button
          className={styles.btn_cancelCrashTable}
          key='back'
          disabled={spinning}
          style={{ width: '96px' }}
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
          {spinning ? `${ing}` : '确认离开'}
        </Button>
      ]}
    >
      <span className={styles.chartStyle}>{concent}</span>
    </Modal>
  )
}

export default LeaveModal
