import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ExcitationDraw from './ExcitationComponents/ExcitationDraw/ExcitationDraw'
import ExcitationLeft from './ExcitationLeft'
import StyleSheet from './NewExcitation.less'

function ExcitationIndex() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={StyleSheet.excitationListBody}>
        <ExcitationLeft />
        <ExcitationDraw />
        {/* <AgreementIndex /> */}
      </div>
    </DndProvider>
  )
}

export default ExcitationIndex
