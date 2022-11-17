import React from 'react'
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd'
import styles from '../BaseModle.less'

function ModalpPop(props: any) {
  const { IsModalVisible, CommonModleClose, concent, name, deleteProjectRight, sureDelete } = props

  return (
    <Modal
      className={styles.modleStyle}
      visible={IsModalVisible}
      width='400px'
      title={name}
      onCancel={() => {
        CommonModleClose(false)
      }}
      footer={[
        <Button
          className={styles.btn_cancel}
          key='back'
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
          onClick={() => {
            deleteProjectRight()
          }}
        >
          {sureDelete ? '修改' : '删除'}
        </Button>
      ]}
    >
      <span className={styles.chartStyle}>{concent}</span>
    </Modal>
  )
}

export default ModalpPop
