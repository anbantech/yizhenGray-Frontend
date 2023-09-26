import { Button, message, Modal } from 'antd'
import * as React from 'react'
import { createExcitationList } from 'Src/services/api/excitationApi'
import StepComponents from './StepComponents'
import StyleSheet from './stepBaseConfig.less'
import stepStore from './sendListStore'

interface OpenType {
  open: boolean
  cancel: (val?: string) => void
  getContainer: any
}

const StepTitle = ['选择激励 ', '添加到发送序列 ', '新建']

function TaskExcitaionModal({ open, cancel, getContainer }: OpenType) {
  const current = stepStore(state => state.current)
  const btnStatus = stepStore(state => state.btnStatus)
  const preCurrent = stepStore(state => state.preCurrent)
  const baseInfo = stepStore(state => state.baseInfo)
  const excitationList = stepStore(state => state.excitationList)
  const setCurrent = stepStore(state => state.setCurrent)
  const gu_cnt0 = stepStore(state => state.gu_cnt0)
  const gu_w0 = stepStore(state => state.gu_w0)
  const deleteEverything = stepStore(state => state.deleteEverything)
  const btnStatusMemo = React.useCallback(() => {
    if (current === 0) {
      return btnStatus
    }
    if (current === 1) {
      return excitationList.length === 0
    }
    if (current === 2) {
      return excitationList.length === 0
    }
  }, [current, btnStatus, excitationList])
  const createExcitation = React.useCallback(async () => {
    const listArray = excitationList.map((item: any) => {
      return item.sender_id
    })
    const child_id_list = [[], [...listArray], []]
    const params = { name: baseInfo.name.trim(), gu_cnt0, gu_w0, desc: baseInfo.desc ? baseInfo.desc.trim() : '', child_id_list }
    try {
      const res = await createExcitationList(params)
      if (res.code === 0) {
        message.success('创建成功')
        deleteEverything()
        cancel('result')
      }
    } catch (error) {
      message.error(error.message)
    }
  }, [baseInfo.desc, baseInfo.name, cancel, deleteEverything, excitationList, gu_cnt0, gu_w0])
  return (
    <Modal
      centered={Boolean(1)}
      width={632}
      visible={open}
      className={StyleSheet.taskExcitaionModal}
      title='新建激励序列'
      onCancel={() => {
        deleteEverything()
        cancel()
      }}
      getContainer={getContainer}
      destroyOnClose
      footer={[
        <>
          {current > 0 && (
            <Button key='back' style={{ borderRadius: '4px' }} className={StyleSheet.preBtn} onClick={preCurrent}>
              上一步
            </Button>
          )}
        </>,
        <div key='right' className={StyleSheet.taskExcitaionModalFooterRight}>
          {' '}
          <Button
            key='back'
            className={StyleSheet.Btn}
            style={{ borderRadius: '4px' }}
            onClick={() => {
              deleteEverything()
              cancel()
            }}
          >
            取消
          </Button>
          <Button
            className={StyleSheet.Btn}
            key='submit'
            type='primary'
            style={{ borderRadius: '4px' }}
            disabled={btnStatusMemo()}
            onClick={current === 2 ? createExcitation : setCurrent}
          >
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
