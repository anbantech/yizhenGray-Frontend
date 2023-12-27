import React from 'react'
import { Controls, ControlButton, useReactFlow } from 'reactflow'
import { ExpandOutlined } from '@ant-design/icons/lib/icons'
import StyleSheet from '../model.less'

export default function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  //   const { zoom } = useViewport()
  const onZoomInHandler = () => {
    zoomIn({ duration: 800 })
  }

  const onZoomOutHandler = () => {
    zoomOut({ duration: 800 })
  }
  const onFitViewHandler = () => {
    fitView()
  }

  return (
    <Controls className={StyleSheet.controlsButton} showZoom={false} position='bottom-right' showFitView={false} showInteractive={false}>
      <ControlButton style={{ border: 'none' }} className={StyleSheet.zoomOut} onClick={onZoomOutHandler} title='缩小'>
        -
      </ControlButton>
      <ControlButton style={{ border: 'none' }} className={StyleSheet.zoomIn} onClick={onZoomInHandler} title='放大'>
        +
      </ControlButton>
      <ControlButton style={{ border: 'none' }} onClick={onFitViewHandler} title='自适应'>
        <ExpandOutlined style={{ width: '10px', height: '10px' }} />
      </ControlButton>
    </Controls>
  )
}
