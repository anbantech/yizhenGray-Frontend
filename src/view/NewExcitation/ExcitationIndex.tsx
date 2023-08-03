import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useHistory, useLocation, withRouter } from 'react-router'
import { checkListStore, GlobalStatusStore, RouterStore, useExicitationSenderId } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import ExcitationDraw from './ExcitationComponents/ExcitationDraw/ExcitationDraw'
import ExcitationLeft from './ExcitationLeft'
import LeaveModal from './LeaveModal'
import StyleSheet from './NewExcitation.less'

function ExcitationIndex() {
  const history = useHistory()
  const pathname = useLocation()?.pathname

  const myRef = React.useRef<any>()
  // 更新按钮状态
  const sendBtnStatus = GlobalStatusStore(state => state.sendBtnStatus)
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)

  // todo 状态
  // const setUpdateStatus = GlobalStatusStore(state => state.setUpdateStatus)
  // const updateStatus = GlobalStatusStore(state => state.updateStatus)

  //  路由
  const setRouterChange = RouterStore(state => state.setRouterChange)
  const reRouterBoolean = RouterStore(state => state.reRouterBoolean)

  // 更新modal状态
  const ModalStatus = RouterStore(state => state.ModalStatus)
  const setShowModal = RouterStore(state => state.setShowModal)
  //
  const [nextLocation, setNextLocation] = React.useState<any>(null)
  const RouterChange = RouterStore(state => state.RouterChange)
  // 清除list
  const clearCheckList = checkListStore(state => state.clearCheckList)
  const setSender_id = useExicitationSenderId(state => state.setSender_id)

  React.useEffect(() => {
    if (sendBtnStatus) {
      return
    }
    const cancel = history.block(nextLocation => {
      if (!sendBtnStatus) {
        setShowModal(true)
      }
      setNextLocation(nextLocation)
      return false
    })
    return () => {
      cancel()
    }
  }, [history, sendBtnStatus, pathname, setShowModal, nextLocation])

  const onCancelLeave = React.useCallback(() => {
    history.block(() => {
      return reRouterBoolean()
    })
    setNextLocation('/Excitataions')
    setShowModal(false)
    setRouterChange(!RouterChange)
    history.push('/Excitataions')
  }, [RouterChange, history, reRouterBoolean, setRouterChange, setShowModal])

  const onLeave = React.useCallback(() => {
    history.block(() => {
      return reRouterBoolean()
    })
    clearCheckList()
    setSender_id(myRef.current?.getId().current)
    setShowModal(false)
    setSendBtnStatus(true)
    history.push(nextLocation?.pathname)
    myRef.current?.openModal()
  }, [clearCheckList, history, nextLocation?.pathname, reRouterBoolean, setSendBtnStatus, setSender_id, setShowModal])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={StyleSheet.excitationListBody}>
        <ExcitationLeft ref={myRef} />
        <ExcitationDraw />
      </div>
      {ModalStatus && (
        <LeaveModal
          IsModalVisible={ModalStatus}
          deleteProjectRight={onLeave}
          CommonModleClose={onCancelLeave}
          name='离开提醒'
          ing='保存中'
          concent='当前配置未保存，离开页面将会放弃所有更改。是否确认离开？'
        />
      )}
    </DndProvider>
  )
}

export default withRouter(ExcitationIndex)
