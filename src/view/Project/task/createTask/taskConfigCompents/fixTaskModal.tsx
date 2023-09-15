import React, { useCallback } from 'react'
import 'antd/dist/antd.css'
import { Modal, Button, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styles from 'Src/components/Modal/BaseModle.less'
import { throwErrorMessage } from 'Src/util/message'
import { updateTask } from 'Src/services/api/taskApi'

function FixTaskModal(props: any) {
  const { IsModalVisible, CommonModleClose, btnName, ing, getFormData, taskId, id, spinning, concent, name } = props
  const Title = () => {
    return (
      <div>
        <ExclamationCircleOutlined />
        <span style={{ marginLeft: '10px' }}>{name}</span>
      </div>
    )
  }

  const createOneExcitationFn = React.useCallback(async () => {
    const res = await getFormData()
    if (res) {
      const params = {
        name: res.name,
        desc: res.description,
        project_id: id,
        beat_unit: res.beat_unit,
        simu_instance_id: res.simu_instance_id,
        work_time: res.work_time,
        crash_num: res.crash_num,
        sender_id: res.sender_id
      }
      const result = await updateTask(taskId, params)
      return result
    }
  }, [getFormData, id, taskId])

  const getResult = async () => {
    try {
      const res = await createOneExcitationFn()
      if (res?.data) {
        message.success('任务修改成功')
        CommonModleClose(false)
      }
    } catch (error) {
      throwErrorMessage(error, {
        1004: '该任务不存在',
        1005: '任务名称重复，请修改',
        1006: '任务参数校验失败',
        1007: '操作频繁',
        2013: '激励序列至少包含一个激励',
        1015: '任务更新失败'
      })
      CommonModleClose(false)
    }
  }
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
          style={{ width: '96px' }}
          onClick={() => {
            CommonModleClose(false)
          }}
        >
          取消
        </Button>,
        <Button className={styles.btn_create} key='submit' type='primary' style={{ width: '96px' }} loading={spinning} onClick={getResult}>
          {spinning ? `${ing}` : `${btnName}`}
        </Button>
      ]}
    >
      <span className={styles.chartStyle}>{concent}</span>
    </Modal>
  )
}

export default FixTaskModal
