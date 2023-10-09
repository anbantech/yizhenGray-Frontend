// import React, { useState } from 'react'
import { useNodes } from 'react-flow-renderer'

// const BoxSelect = () => {
//   const nodes = useStore((state: any) => state.nodes)
//   const setSelectedElements = useStore((actions: any) => actions.setSelectedElements)

//   const [startPos, setStartPos] = useState<any>(null)
//   const [endPos, setEndPos] = useState<any>(null)

//   const handleMouseDown = (event: any) => {
//     const { clientX, clientY } = event
//     setStartPos({ x: clientX, y: clientY })
//     setEndPos({ x: clientX, y: clientY })
//   }

//   const handleMouseMove = (event: any) => {
//     if (!startPos) return
//     const { clientX, clientY } = event
//     setEndPos({ x: clientX, y: clientY })
//   }

//   const handleMouseUp = () => {
//     if (!startPos || !endPos) return

//     const selectedNodes = nodes.filter((node: any) => {
//       const { x, y } = node.position
//       const { x: startX, y: startY } = startPos
//       const { x: endX, y: endY } = endPos

//       return x >= startX && x <= endX && y >= startY && y <= endY
//     })

//     setSelectedElements(selectedNodes.map((node: any) => node.id))

//     setStartPos(null)
//     setEndPos(null)
//   }

//   return (
//     <div
//       role='time'
//       style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     >
//       {startPos && endPos && (
//         <div
//           style={{
//             position: 'absolute',
//             top: startPos.y,
//             left: startPos.x,
//             width: endPos.x - startPos.x,
//             height: endPos.y - startPos.y,
//             border: '1px dashed #000',
//             background: 'rgba(0, 0, 0, 0.1)'
//           }}
//         />
//       )}
//     </div>
//   )
// }

// export default BoxSelect

import React, { useRef, useEffect } from 'react'

const BoxSelector = ({ onSelection }: any) => {
  const boxRef = useRef<any>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const nodes = useNodes()
  const handleMouseDown = (event: any) => {
    startPos.current = { x: event.clientX, y: event.clientY }
    boxRef.current.style.left = `${event.clientX}px`
    boxRef.current.style.top = `${event.clientY}px`
    boxRef.current.style.width = '0'
    boxRef.current.style.height = '0'
    boxRef.current.style.display = 'block'
  }

  const handleMouseMove = (event: any) => {
    event.stopPropagation()
    event.preventDefault()
    const width = event.clientX - startPos.current.x
    const height = event.clientY - startPos.current.y
    boxRef.current.style.width = `${Math.abs(width)}px`
    boxRef.current.style.height = `${Math.abs(height)}px`
    boxRef.current.style.left = `${width > 0 ? startPos.current.x : event.clientX}px`
    boxRef.current.style.top = `${height > 0 ? startPos.current.y : event.clientY}px`
  }

  const handleMouseUp = React.useCallback(() => {
    boxRef.current.style.display = 'none'
    const selectionRect = boxRef.current.getBoundingClientRect()
    onSelection(selectionRect, nodes)
  }, [nodes, onSelection])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={boxRef} role='time' className='box-selector' onMouseDown={handleMouseDown} />
}

export default BoxSelector
