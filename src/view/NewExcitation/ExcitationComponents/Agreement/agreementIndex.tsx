import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import AgreementDrag from './agreementDrag'

function AgreementIndex() {
  return (
    <div>
      <div>
        <span>协议数据:</span>
      </div>
      <div>
        <DndProvider backend={HTML5Backend}>
          <AgreementDrag />
        </DndProvider>
      </div>
    </div>
  )
}

export default AgreementIndex
