import * as React from 'react'
import ExcitationDrag from './ExcitationDrag'
import ExcitationDragHeader from './ExcitationDragHeader'
// import StyleSheet from './excitationDraw.less'
function ExcitationList() {
  return (
    <div>
      <ExcitationDragHeader />
      {/* 列表拖拽 */}
      <ExcitationDrag />
    </div>
  )
}

export default ExcitationList
