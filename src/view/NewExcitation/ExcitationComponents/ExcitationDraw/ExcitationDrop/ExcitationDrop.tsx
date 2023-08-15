import React, { useEffect, useMemo } from 'react'
import { checkListStore, GlobalStatusStore, LeftDropListStore, useExicitationSenderId } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import img_empty from 'Src/assets/drag/img_empty@2x.png'
import { message } from 'antd'
import { getExcitaionDeatilFn } from 'Src/services/api/excitationApi'
import MemoExcitationListHeader from './ExcitaionDropListHeader'
import StyleSheet from '../excitationDraw.less'
import ExcitationDropList from './ExcitationDropList'
import DropHeader from './ExcitationDropHeader'

const Line = React.memo(() => {
  return <div className={StyleSheet.listLine} />
})
Line.displayName = 'Line'

const NoTask = React.memo(() => {
  return (
    <div className={StyleSheet.No}>
      <img className={StyleSheet.imageNo} src={img_empty} alt='' />
      <span className={StyleSheet.chartNo}> 暂无数据</span>
    </div>
  )
})
NoTask.displayName = 'NoTask'

const DeleteCompoent = ({ number, DeleteCheckItem }: { number: number; DeleteCheckItem: () => void }) => {
  return (
    <div className={StyleSheet.DelCompoents}>
      <span className={StyleSheet.DelCompoentsCharts}>{`已选 ${number} 项`}</span>
      <div role='time' className={StyleSheet.DelCompoentsBtn} onClick={DeleteCheckItem}>
        批量删除
      </div>
    </div>
  )
}
const DeleteCompoentMemo = React.memo(DeleteCompoent)

function ExcitationDropMemo() {
  const DropList = LeftDropListStore(state => state.DropList)
  const setLeftList = LeftDropListStore(state => state.setLeftList)
  const setDetailData = LeftDropListStore(state => state.setDetailData)
  // sender_id
  const sender_id = useExicitationSenderId(state => state.sender_id)
  // 筛选逻辑
  const checkAllList = checkListStore(state => state.checkAllList)
  const clearCheckList = checkListStore(state => state.clearCheckList)
  const { setParamsChange } = LeftDropListStore()
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)
  // 实例状态是否更新
  const detailStatus = GlobalStatusStore(state => state.detailStatus)

  const DeleteCheckItem = React.useCallback(() => {
    const copyList = DropList.filter(item => !checkAllList.includes(item.keys))
    setLeftList([...copyList])
    clearCheckList()
    setSendBtnStatus(false)
    setParamsChange(true)
  }, [DropList, setParamsChange, checkAllList, clearCheckList, setLeftList, setSendBtnStatus])

  const checkListMemo = useMemo(() => {
    return checkAllList.length
  }, [checkAllList])

  const DropListLength = useMemo(() => {
    return DropList.length
  }, [DropList])

  // 页面更新
  const getExcitaionDeatilFunction = React.useCallback(
    async (id: number) => {
      try {
        const res = await getExcitaionDeatilFn(id)
        if (res.data) {
          setDetailData(res.data)
        }
      } catch (error) {
        message.error(error.message)
      }
    },
    [setDetailData]
  )

  useEffect(() => {
    if (sender_id) {
      setSendBtnStatus(true)
      getExcitaionDeatilFunction(sender_id)
    }
  }, [getExcitaionDeatilFunction, sender_id, detailStatus, setSendBtnStatus])

  useEffect(() => {
    return () => {
      clearCheckList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={StyleSheet.excitaionDrop_Body}>
      <DropHeader getExcitaionDeatilFunction={getExcitaionDeatilFunction} />
      <Line />
      <span className={StyleSheet.sendListTitle}>发送列表</span>
      <MemoExcitationListHeader />
      {DropListLength ? <ExcitationDropList /> : <NoTask />}
      {checkListMemo ? <DeleteCompoentMemo number={checkListMemo} DeleteCheckItem={DeleteCheckItem} /> : null}
    </div>
  )
}

const ExcitationDrop = React.memo(ExcitationDropMemo)

export default ExcitationDrop
