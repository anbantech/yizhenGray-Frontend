import React, { useEffect } from 'react'
import { useDrag, useDragLayer, XYCoord, DndProvider } from 'react-dnd'
import { HTML5Backend, getEmptyImage } from 'react-dnd-html5-backend'
import { generateUUID } from 'Src/util/common'
import { Cmps } from './agreementCompoents'

import styles from './agreementCompoents.less'
import { ComponentsArray } from './agreementsMap'

interface DragCmps {
  type: string
  keys: string
  title: string
  imgTitleSrc: string
  deleteImg: string
  buttonStyle: React.CSSProperties
  Components: ({ imgTitleSrc, type, deleteImg }: Cmps) => JSX.Element | null
}

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0
}

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / 32) * 32
  const snappedY = Math.round(y / 32) * 32
  return [snappedX, snappedY]
}

function getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null, isSnapToGrid: boolean) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    }
  }

  let { x, y } = currentOffset

  if (isSnapToGrid) {
    x -= initialOffset.x
    y -= initialOffset.y
    ;[x, y] = snapToGrid(x, y)
    x += initialOffset.x
    y += initialOffset.y
  }

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform
  }
}

const CustomDragLayer = (props: any) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset()
  }))
  if (!isDragging) {
    return null
  }

  return (
    <div>
      {isDragging && (
        <div style={layerStyles}>
          <div style={getItemStyles(initialOffset, currentOffset, props.snapToGrid)}>
            {item && <item.Components imgTitleSrc={item.imgTitleSrc} deleteImg={item.deleteImg} type={itemType} />}
          </div>
        </div>
      )}
    </div>
  )
}

const Draggable = ({ keys, type, buttonStyle, deleteImg, imgTitleSrc, title, Components }: DragCmps) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item: { Components, deleteImg, imgTitleSrc },
    collect: monitor => {
      const isDragging = monitor.isDragging()
      return {
        isDragging
      }
    }
  }))
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true }) // 隐藏拖拽dom
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div
      ref={drag}
      key={keys}
      style={{ opacity: isDragging ? 0 : 1, height: isDragging ? 0 : '', position: 'relative', ...buttonStyle }}
      className={styles.dragButton}
    >
      <div className={styles.dragImage} />
      <span>{title} </span>
    </div>
  )
}

function AgreementDrag() {
  return (
    <DndProvider backend={HTML5Backend}>
      {/* 在这里放置你的应用组件 */}
      <div className={styles.agreeFooter}>
        <span> 新增协议数据: </span>
        {ComponentsArray.map(item => {
          return (
            <Draggable
              key={generateUUID()}
              keys={item.key}
              type={item.type}
              imgTitleSrc={item.imgTitleSrc}
              deleteImg={item.deleteImg}
              Components={item.Components}
              title={item.title}
              buttonStyle={item.ButtonStyle}
            />
          )
        })}
        <CustomDragLayer />
      </div>
    </DndProvider>
  )
}

export default AgreementDrag
