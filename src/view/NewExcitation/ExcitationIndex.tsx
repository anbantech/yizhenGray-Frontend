import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useHistory, withRouter } from 'react-router'
import { GlobalStatusStore, RouterStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import LeaveModal from 'Src/view/NewExcitation/LeaveModal'
import ExcitationDraw from './ExcitationComponents/ExcitationDraw/ExcitationDraw'
import ExcitationLeft from './ExcitationLeft'
import StyleSheet from './NewExcitation.less'

function ExcitationIndex() {
  const history = useHistory()
  // 更新按钮状态
  const sendBtnStatus = GlobalStatusStore(state => state.sendBtnStatus)
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)

  // todo 状态
  const setUpdateStatus = GlobalStatusStore(state => state.setUpdateStatus)
  const updateStatus = GlobalStatusStore(state => state.updateStatus)

  //  路由
  const setRouterChange = RouterStore(state => state.setRouterChange)
  const reRouterBoolean = RouterStore(state => state.reRouterBoolean)

  // 更新modal状态
  const ModalStatus = RouterStore(state => state.ModalStatus)
  const setShowModal = RouterStore(state => state.setShowModal)

  const [nextLocation, setNextLocation] = React.useState<any>(null)
  const RouterChange = RouterStore(state => state.RouterChange)

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
  }, [history, sendBtnStatus, setShowModal])

  const onCancelLeave = React.useCallback(() => {
    history.block(() => {
      return reRouterBoolean()
    })
    setShowModal(false)
    setSendBtnStatus(true)
    setUpdateStatus(!updateStatus)
    history.push('/Excitataions')
    setRouterChange(!RouterChange)
  }, [RouterChange, history, reRouterBoolean, setRouterChange, setSendBtnStatus, setShowModal, setUpdateStatus, updateStatus])

  const onLeave = React.useCallback(() => {
    history.block(() => {
      return reRouterBoolean()
    })
    setSendBtnStatus(true)
    setShowModal(false)
    history.push(nextLocation?.pathname)
  }, [history, nextLocation?.pathname, reRouterBoolean, setSendBtnStatus, setShowModal])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={StyleSheet.excitationListBody}>
        <ExcitationLeft />
        <ExcitationDraw />
      </div>
      <LeaveModal IsModalVisible={ModalStatus} onLeave={onLeave} onCancelLeave={onCancelLeave} />
    </DndProvider>
  )
}

export default withRouter(ExcitationIndex)
