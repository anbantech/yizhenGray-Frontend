import React from 'react'
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd'
import styles from '../BaseModle.less'

function TaskDetailModal(props: any) {
  const { IsModalVisible, modalClose, name, concent } = props
  return (
    <Modal
      className={styles.modleStyle}
      visible={IsModalVisible}
      width='400px'
      title={name}
      onCancel={() => {
        modalClose(false)
      }}
      footer={[
        <Button
          className={styles.btn_cancel}
          key='back'
          onClick={() => {
            modalClose(false)
          }}
        >
          关闭
        </Button>
      ]}
    >
      <div>
        {Object.keys(concent).map((value: string) => {
          return (
            <div key={value}>
              <span>11</span>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

export default TaskDetailModal
