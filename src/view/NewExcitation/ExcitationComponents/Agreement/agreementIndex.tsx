import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ArgeementDropListStore } from '../../ExcitaionStore/ExcitaionStore'
import AgreementDrag from './agreementDrag'
import AgreementDrop from './agreementDrop'

function AgreementIndexMemo(props: { sender_id: number }) {
  const { sender_id } = props
  const detaileStatus = ArgeementDropListStore(state => state.detaileStatus)

  const DragContorlStatus = React.useMemo(() => {
    const bol = sender_id !== -1 && detaileStatus
    return bol
  }, [detaileStatus, sender_id])
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <AgreementDrop />
        {!DragContorlStatus && <AgreementDrag />}
      </DndProvider>
    </>
  )
}

const AgreementIndex = React.memo(AgreementIndexMemo)

export default AgreementIndex
