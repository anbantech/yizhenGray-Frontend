import { Modal } from 'antd'
import * as React from 'react'
import StepComponents from './StepComponents'
import StyleSheet from './stepBaseConfig.less'

interface OpenType {
  open: boolean
}

function TaskExcitaionModal({ open }: OpenType) {
  return (
    <Modal width={632} visible={open} className={StyleSheet.taskExcitaionModal} title='新建激励发送列表' onCancel={() => {}} footer={[<>1</>]}>
      <StepComponents />
    </Modal>
  )
}

export default TaskExcitaionModal
