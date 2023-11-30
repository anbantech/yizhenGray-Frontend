import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import img_empty from 'Src/assets/drag/img_empty@2x.png'
import { useExicitationSenderId } from '../../ExcitaionStore/ExcitaionStore'
import ExcitationList from './ExcitationDrag/ExcitationDragList'
import StyleSheet from './excitationDraw.less'
import ExcitationDrop from './ExcitationDrop/ExcitationDrop'

export const NoTask = React.memo(() => {
  return (
    <div className={StyleSheet.No} style={{ margin: 'auto', paddingTop: '0' }}>
      <img className={StyleSheet.imageNo} src={img_empty} alt='' />
      <span className={StyleSheet.chartNo}> 暂无数据</span>
    </div>
  )
})
NoTask.displayName = 'NoTask'

function ExcitationDrawMemo() {
  const sender_id = useExicitationSenderId(state => state.sender_id)

  return (
    <div className={StyleSheet.Draw}>
      <DndProvider backend={HTML5Backend}>
        {sender_id === null ? (
          <div style={{ width: '100%', height: '100%', paddingTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <NoTask />{' '}
          </div>
        ) : (
          <ExcitationDrop />
        )}
        <ExcitationList />
      </DndProvider>
    </div>
  )
}

const ExcitationDraw = React.memo(ExcitationDrawMemo)

export default ExcitationDraw
