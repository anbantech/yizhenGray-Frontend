import * as React from 'react'
import { useDrag } from 'react-dnd'

interface DraggableWrapperProps {
  type: string
  item: any
  [key: string]: any
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({ type, item, children }) => {
  const [collected, drag] = useDrag(() => ({ type, item }))
  return (
    <div ref={drag} {...collected}>
      {children}
    </div>
  )
}

DraggableWrapper.displayName = 'DraggableWrapper'

export default DraggableWrapper
