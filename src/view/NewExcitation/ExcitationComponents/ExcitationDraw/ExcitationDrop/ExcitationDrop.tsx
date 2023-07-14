import React from 'react'
import MemoExcitationHeader from './ExcitaionDropHeader'
import StyleSheet from '../excitationDraw.less'
import ExcitationDropList from './ExcitationDropList'

function ExcitationDrop() {
  return (
    <div className={StyleSheet.excitaionDrop_Body}>
      <MemoExcitationHeader />
      <ExcitationDropList />
    </div>
  )
}

export default ExcitationDrop
