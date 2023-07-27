import React, { useEffect, useMemo } from 'react'
import { checkListStore, GlobalStatusStore, LeftDropListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
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
  const { updateStatus } = GlobalStatusStore()
  const DropList = LeftDropListStore(state => state.DropList)
  const setLeftList = LeftDropListStore(state => state.setLeftList)
  const { sender_id, setDetailData } = LeftDropListStore()
  // 筛选逻辑
  const { checkAllSenderIdList, setIndeterminate, setCheckAll } = checkListStore()
  const checkAllList = checkListStore(state => state.checkAllList)
  const DeleteCheckItem = React.useCallback(() => {
    const copyList = DropList.filter(item => !checkAllList.includes(item.keys))
    setLeftList([...copyList])
    checkAllSenderIdList([])
    setIndeterminate(false)
    setCheckAll(false)
  }, [DropList, checkAllList, checkAllSenderIdList, setLeftList, setCheckAll, setIndeterminate])

  const LengthMemo = useMemo(() => {
    return checkAllList.length
  }, [checkAllList])

  // 页面更新
  const getExcitaionDeatilFunction = React.useCallback(
    async (id: number) => {
      try {
        const res = await getExcitaionDeatilFn(id)
        if (res.data) {
          // const keysList = res.data.map((item: any) => item.keys)
          setDetailData(res.data)
        }
      } catch (error) {
        message.error(error.message)
      }
    },
    [setDetailData]
  )
  useEffect(() => {
    if (sender_id !== -1) {
      getExcitaionDeatilFunction(sender_id)
    }
  }, [getExcitaionDeatilFunction, sender_id, updateStatus])
  return (
    <div className={StyleSheet.excitaionDrop_Body}>
      <DropHeader />
      <Line />
      <span className={StyleSheet.sendListTitle}>发送列表</span>
      <MemoExcitationListHeader />
      {DropList.length > 0 ? <ExcitationDropList /> : <NoTask />}
      {LengthMemo ? <DeleteCompoentMemo number={LengthMemo} DeleteCheckItem={DeleteCheckItem} /> : null}
    </div>
  )
}

const ExcitationDrop = React.memo(ExcitationDropMemo)

export default ExcitationDrop
