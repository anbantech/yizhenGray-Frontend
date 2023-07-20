import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import StyleSheet from './agreementCompoents.less'
import AgreementDrag from './agreementDrag'
import AgreementDrop from './agreementDrop'

function AgreementIndex() {
  return (
    <div className={StyleSheet.agreementDragDrop}>
      <DndProvider backend={HTML5Backend}>
        <AgreementDrop />
        <AgreementDrag />
      </DndProvider>
    </div>
  )
}

export default AgreementIndex
