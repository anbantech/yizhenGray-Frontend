import React from 'react'
import 'antd/dist/antd.css'
import { Modal, Button, message } from 'antd'

import styles from 'Src/components/Modal/newModalOrFixModal/modelingModal.less'
import { deleteConrolsFn } from 'Src/services/api/modelApi'

import { deleteMap } from 'Src/view/Modeling/Store/MapStore'

interface ModelProps {
  visibility: boolean
  onNodesDelete: (node: Node[]) => void
  deleteTreeNode: any
  deleteInfo: any
}

function DeleteNodeModal(props: ModelProps) {
  const { visibility, deleteInfo, onNodesDelete, deleteTreeNode } = props
  const { node } = deleteInfo
  const [loading, setLoading] = React.useState(false)
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
      const response = await deleteConrolsFn(params)
      setLoading(true)
      if (response.code === 0) {
        setLoading(false)
        message.success('删除成功')
        if (node.node.flag !== 4) {
          deleteTreeNode(false)
        }
        onNodesDelete(node.node)
      }
    } catch {
      message.error('删除失败')
      setLoading(false)
    }
  }, [node.node, onNodesDelete])

  return (
    <Modal
      width={400}
      centered={Boolean(1)}
      visible={visibility}
      title={node?.title ? node?.title : '删除节点'}
      className={styles.deleteNodebody}
      onCancel={() => {
        deleteTreeNode(false)
      }}
      footer={[
        <Button
          className={styles.btn_cancel}
          key='back'
          onClick={() => {
            deleteTreeNode(false)
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
