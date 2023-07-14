import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ExcitationList from './ExcitationDrag/ExcitationDragList'
import StyleSheet from './excitationDraw.less'
import ExcitationDrop from './ExcitationDrop/ExcitationDrop'

function ExcitationDraw() {
  return (
    <div className={StyleSheet.Draw}>
      <DndProvider backend={HTML5Backend}>
        <ExcitationDrop />
        <ExcitationList />
      </DndProvider>
    </div>
  )
}

export default ExcitationDraw
