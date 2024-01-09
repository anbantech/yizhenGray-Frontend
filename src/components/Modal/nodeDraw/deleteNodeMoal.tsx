import React from 'react'
import 'antd/dist/antd.css'
import { Modal, Button, message } from 'antd'

import styles from 'Src/components/Modal/newModalOrFixModal/modelingModal.less'
import { deleteConrolsFn } from 'Src/services/api/modelApi'

import { deleteMap } from 'Src/view/Modeling/Store/MapStore'
import { LeftAndRightStore } from 'Src/view/Modeling/Store/ModelLeftAndRight/leftAndRightStore'
import { LeftListStore } from 'Src/view/Modeling/Store/ModeleLeftListStore/LeftListStore'

interface ModelProps {
  visibility: boolean
  onNodesDelete: (node: Node[], error_codeArray?: { error_code: number; id: string }[]) => void
  setDeleNodeInfo: any
  deleteNodeInfo: any
}

function DeleteNodeModal(props: ModelProps) {
  const { visibility, deleteNodeInfo, onNodesDelete, setDeleNodeInfo } = props
  const { node } = deleteNodeInfo
  const [loading, setLoading] = React.useState(false)
  const platform_id = LeftAndRightStore(state => state.platform_id)
  const filterNode = (data: any) => {
    const allIds = new Set(data.map((item: { id: string }) => item.id))
    const flagIdObject: { [key: string]: string[] } = {}

    // Filter and group elements in a single iteration
    data.forEach((item: any) => {
      const {
        parentId,
        data: { flag },
        id
      } = item
      if ((!parentId || !allIds.has(parentId)) && flag !== undefined && id !== undefined) {
        const flagKey = deleteMap[flag as keyof typeof deleteMap] as keyof typeof flagIdObject
        if (!flagIdObject[flagKey]) {
          flagIdObject[flagKey] = []
        }
        flagIdObject[flagKey].push(id)
      }
    })

    // Convert arrays to comma-separated strings
    const result: { [key: string]: string } = {}
    for (const key in flagIdObject) {
      if (Object.prototype.hasOwnProperty.call(flagIdObject, key)) {
        result[key] = flagIdObject[key].join(',')
      }
    }
    return result
  }

  const asyncDeleteControlsFn = React.useCallback(async () => {
    const params = filterNode(node.node)
    try {
      await onNodesDelete(node.node)
      const response = await deleteConrolsFn({ ...params, platform_id })
      setLoading(true)
      if (response.code === 0 && platform_id) {
        setLoading(false)
        message.success('删除成功')
        setDeleNodeInfo({}, false)
        await LeftAndRightStore.getState().getTargetDetail(platform_id)
        LeftListStore.getState().getModelListDetails(platform_id)
      }
    } catch {
      message.error('删除失败')
      setLoading(false)
    }
  }, [node.node, onNodesDelete, platform_id, setDeleNodeInfo])

  return (
    <Modal
      width={400}
      centered={Boolean(1)}
      visible={visibility}
      title={node?.title ? node?.title : '删除节点'}
      className={styles.deleteNodebody}
      onCancel={() => {
        setDeleNodeInfo({}, false)
      }}
      footer={[
        <Button
          className={styles.btn_cancel}
          key='back'
          onClick={() => {
            setDeleNodeInfo({}, false)
          }}
        >
          取消
        </Button>,
        <Button className={styles.btn_create} key='submit' type='primary' onClick={asyncDeleteControlsFn} loading={loading}>
          删除
        </Button>
      ]}
    >
      <span>{node?.content ? node?.content : '是否删除节点'}</span>
    </Modal>
  )
}

export default DeleteNodeModal
