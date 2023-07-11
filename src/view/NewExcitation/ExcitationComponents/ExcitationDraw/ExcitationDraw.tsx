import * as React from 'react'
import ExcitationList from './ExcitationDragList'
import StyleSheet from './excitationDraw.less'

function ExcitationDraw() {
  return (
    <div className={StyleSheet.excitationList_body}>
      <div>header</div>
      <div> line</div>
      <div>
        <div> 搜索框</div>
        <ExcitationList />
      </div>
    </div>
  )
}

export default ExcitationDraw
