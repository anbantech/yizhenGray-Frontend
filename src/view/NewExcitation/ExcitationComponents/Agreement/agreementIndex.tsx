import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import AgreementDrag from './agreementDrag'
import AgreementDrop from './agreementDrop'

function AgreementIndex() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AgreementDrop />
      <AgreementDrag />
    </DndProvider>
  )
}

export default AgreementIndex
