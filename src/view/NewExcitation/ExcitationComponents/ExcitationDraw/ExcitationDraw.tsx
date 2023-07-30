import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useExicitationSenderId } from '../../ExcitaionStore/ExcitaionStore'
import ExcitationList from './ExcitationDrag/ExcitationDragList'
import StyleSheet from './excitationDraw.less'
import ExcitationDrop from './ExcitationDrop/ExcitationDrop'

function ExcitationDrawMemo() {
  const sender_id = useExicitationSenderId(state => state.sender_id)
  return (
    <div className={StyleSheet.Draw}>
      <DndProvider backend={HTML5Backend}>
        {sender_id && <ExcitationDrop />}
        <ExcitationList />
      </DndProvider>
    </div>
  )
}

const ExcitationDraw = React.memo(ExcitationDrawMemo)

export default ExcitationDraw
