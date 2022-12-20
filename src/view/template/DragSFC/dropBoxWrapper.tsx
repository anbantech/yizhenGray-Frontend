import * as React from 'react'
import { useState, CSSProperties } from 'react'

import { useDrop } from 'react-dnd'

interface DropBoxWrapperProps {
  type: string | string[]
  greedy: boolean
  uuid: string
  style?: CSSProperties
  full?: boolean
  [key: string]: any
  afterDrop?: (item: any, uuid: string) => void
}

const DropBoxWrapper: React.FC<DropBoxWrapperProps> = ({ type, greedy, afterDrop, uuid, children, full, ...res }) => {
  const [, setHasDropped] = useState(false)
  const [, setHasDroppedOnChild] = useState(false)

  function getStyle(backgroundColor: string): CSSProperties {
    if (full) {
      return {
        width: '100%',
        height: '100%',
        backgroundColor
      }
    }
    return {
      backgroundColor
    }
  }

  const [collected, drop] = useDrop(
    () => ({
      accept: type,
      drop(item: unknown, monitor) {
        const didDrop = monitor.didDrop()
        if (didDrop && !greedy) {
          return
        }
        setHasDropped(true)
        setHasDroppedOnChild(didDrop)
        if (afterDrop) {
          afterDrop(item, uuid)
        }
      },
      collect: monitor => ({

        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop()
      })
    }),
    [greedy, setHasDropped, setHasDroppedOnChild]
  )

  let backgroundColor = 'white'

  if (collected.isOverCurrent || (collected.isOver && greedy)) {
    backgroundColor = '#F7F7F7'
  }

  return (
    <div ref={drop} style={getStyle(backgroundColor)} {...res}>
      {children}
    </div>
  )
}

DropBoxWrapper.displayName = 'DropBoxWrapper'

export default DropBoxWrapper
