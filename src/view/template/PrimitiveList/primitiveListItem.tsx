import * as React from 'react'
import ptImage from 'Image/Template/pt.svg'
import dragImage from 'Image/Template/drag.svg'
import ToolTip from 'Src/components/ToopTip/toolTip'
import { memo } from 'react'
import DraggableWrapper from '../DragSFC/draggableWrapper'
import { Primitive } from './primitiveList'
import styles from './primitiveList.less'

interface PrimitiveListItemProps {
  pt: Primitive
  prefixImage?: any
}

const PrimitiveListItem: React.FC<PrimitiveListItemProps> = ({ pt, prefixImage }) => {
  return (
    <ToolTip tipTitle={pt.type} tipMessage={pt.desc}>
      <DraggableWrapper type={pt.type} item={pt} key={pt.id}>
        <div className={styles.ptList_item}>
          <img src={prefixImage || ptImage} alt='primitive' />
          <span className={styles.prList_item_name}>{pt.type}</span>
          <span className={styles.prList_item_desc}>{pt.desc}</span>
          <img src={dragImage} alt='drag' />
        </div>
      </DraggableWrapper>
    </ToolTip>
  )
}

PrimitiveListItem.displayName = 'PrimitiveListItem'

export default memo(PrimitiveListItem, (prevProps, nextProps) => {
  if (prevProps.prefixImage === nextProps.prefixImage) {
    return prevProps.pt.id === nextProps.pt.id
  }
  return false
})
