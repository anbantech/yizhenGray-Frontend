import React from 'react'
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd'
import styles from 'Src/components/Modal/BaseModle.less'

function LeaveModal(props: any) {
  const { IsModalVisible, onLeave, onCancelLeave } = props

  return (
    <Modal
      className={styles.modleStyle}
      visible={IsModalVisible}
      width='400px'
      title='保存配置'
      onCancel={onCancelLeave}
      footer={[
        <Button className={styles.btn_cancelCrashTable} key='back' style={{ width: '96px' }} onClick={onCancelLeave}>
          取消
        </Button>,
        <Button className={styles.btn_create} key='submit' type='primary' style={{ width: '96px' }} onClick={onLeave}>
          确定
        </Button>
      ]}
    >
      <span className={styles.chartStyle}>当前配置未保存，离开页面将会放弃所有修改数据。</span>
    </Modal>
  )
}

export default LeaveModal
