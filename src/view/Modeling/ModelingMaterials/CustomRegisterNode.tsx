import classNames from 'classnames'
import React, { useMemo } from 'react'
import { IconYifuRegister } from '@anban/iconfonts'
import { Handle, NodeProps, Position } from 'reactflow'
import Close from 'Src/assets/drag/icon_close.svg'
import StyleSheet from '../model.less'
import { LeftAndRightStore } from '../Store/ModelLeftAndRight/leftAndRightStore'

function CustomRegisterNode(Node: NodeProps) {
  const selectLeftId = LeftAndRightStore(state => state.selectLeftId)
  const foucsNodeStatus = useMemo(() => {
    if (selectLeftId && Node.id) {
      return String(selectLeftId) === Node.id
    }
    return false
  }, [Node.id, selectLeftId])
  const hasError = React.useMemo(() => {
    return Node.data.error_code === 0
  }, [Node])
  const style = classNames(
    { [StyleSheet.hasErrorRegisterNode]: !hasError },
    { [StyleSheet.borderNone]: !foucsNodeStatus },
    { [StyleSheet.borderShow]: foucsNodeStatus }
  )
  return (
    <div className={style}>
      <div className={StyleSheet.regiseterNode}>
        <Handle type='target' position={Node.targetPosition || Position.Top} />
        <div className={StyleSheet.label}>
          <IconYifuRegister style={{ marginRight: '5px' }} />
          <span className={StyleSheet.labelName}>{Node.data.label}</span>
        </div>
        <div className={StyleSheet.deleteIcon}>
          <img src={Close} alt='' />
        </div>
      </div>
    </div>
  )
}

export default CustomRegisterNode
