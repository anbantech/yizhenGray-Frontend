import { ExclamationCircleFilled } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import React from 'react'
import styles from './BaseModle.less'

type VersionType = {
  showModalMemo: boolean
}

const Title = (props: { name: string }) => {
  const { name } = props
  return (
    <div>
      <ExclamationCircleFilled />
      <span style={{ marginLeft: '10px' }}>{name}</span>
    </div>
  )
}
function VersionModal(props: VersionType) {
  const { showModalMemo } = props
  return (
    <Modal
      visible={showModalMemo}
      title={<Title name='版本更新提示' />}
      className={styles.modleStyle}
      closable={Boolean(0)}
      footer={[
        <Button
          key='button'
          onClick={() => {
            window.location.reload()
          }}
        >
          刷新
        </Button>
      ]}
    >
      <p>发现新版本，请点击刷新获取最新功能和修复</p>
    </Modal>
  )
}

export default VersionModal
