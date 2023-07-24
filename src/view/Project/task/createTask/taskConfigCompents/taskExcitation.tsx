import { Button, Modal } from 'antd'
import * as React from 'react'
import StepComponents from './StepComponents'
import StyleSheet from './stepBaseConfig.less'
import stepStore from './sendListStore'

interface OpenType {
  open: boolean
  cancel: () => void
  getContainer: any
}

const StepTitle = ['选择激励', '添加到发送列表', '新建']

function TaskExcitaionModal({ open, cancel, getContainer }: OpenType) {
  const current = stepStore(state => state.current)
  const btnStatus = stepStore(state => state.btnStatus)
  const preCurrent = stepStore(state => state.preCurrent)
  const excitationList = stepStore(state => state.excitationList)
  const setCurrent = stepStore(state => state.setCurrent)
  const deleteEverything = stepStore(state => state.deleteEverything)
  const btnStatusMemo = React.useCallback(() => {
    if (current === 0) {
      return btnStatus
    }
    if (current === 1) {
      return excitationList.length === 0 || btnStatus
    }
    if (current === 2) {
      return btnStatus
    }
  }, [current, btnStatus, excitationList])

  return (
    <Modal
      width={632}
      visible={open}
      className={StyleSheet.taskExcitaionModal}
      title='新建激励发送列表'
      onCancel={() => {
        deleteEverything()
        cancel()
      }}
      getContainer={getContainer}
      destroyOnClose
      footer={[
        <>
          {current > 0 && (
            <Button key='back' className={StyleSheet.preBtn} onClick={preCurrent}>
              上一步
            </Button>
          )}
        </>,
        <div key='right' className={StyleSheet.taskExcitaionModalFooterRight}>
          {' '}
          <Button
            key='back'
            onClick={() => {
              deleteEverything()
              cancel()
            }}
          >
            取消
          </Button>
          <Button key='submit' type='primary' disabled={btnStatusMemo()} onClick={setCurrent}>
            {StepTitle[current]}
          </Button>
        </div>
      ]}
    >
      <StepComponents />
    </Modal>
  )
}

export default TaskExcitaionModal
