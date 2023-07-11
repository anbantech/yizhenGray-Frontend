import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ExcitationModal from 'Src/components/Modal/excitationModal/excitationModal'

import AgreementComponents from './ExcitationComponents/Agreement/agreementCompoents'
import AgreementIndex from './ExcitationComponents/Agreement/agreementIndex'
import ExcitationDraw from './ExcitationComponents/ExcitationDraw/ExcitationDraw'
import ExcitationLeft from './ExcitationLeft'
import StyleSheet from './NewExcitation.less'

function ExcitationIndex() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={StyleSheet.excitationListBody}>
        {/* <ExcitationLeft /> */}
        {/* <AgreementIndex /> */}

        <ExcitationDraw />
        {/* <AgreementComponents type='StringComponents' imgTitleSrc='' deleteImg='' /> */}
      </div>
      {/* <ExcitationModal /> */}
    </DndProvider>
  )
}

export default ExcitationIndex
