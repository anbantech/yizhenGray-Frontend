import React from 'react'
import MemoExcitationListHeader from './ExcitaionDropListHeader'
import StyleSheet from '../excitationDraw.less'
import ExcitationDropList from './ExcitationDropList'
import DropHeader from './ExcitationDropHeader'

const Line = () => {
  return <div className={StyleSheet.listLine} />
}

function ExcitationDrop() {
  return (
    <div className={StyleSheet.excitaionDrop_Body}>
      <DropHeader />
      <Line />
      <span className={StyleSheet.sendListTitle}>发送列表</span>
      <MemoExcitationListHeader />
      <ExcitationDropList />
    </div>
  )
}

export default ExcitationDrop
