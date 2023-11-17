import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconCommon } from '@anban/iconfonts'
import classNames from 'classnames'
import styles from '../model.less'
import MiddleStore from '../Store/ModelMiddleStore/MiddleStore'
import ContextMenu from './Menus'
import { RightDetailsAttributesStore } from '../Store/ModeleRightListStore/RightListStoreList'

function Custom(Node: NodeProps) {
  const menuStatusObj = MiddleStore(state => state.menuStatusObj)
  const focusNodeId = RightDetailsAttributesStore(state => state.focusNodeId)
  const foucusStatus = React.useMemo(() => {
    return focusNodeId === Node.data.id
  }, [focusNodeId, Node])
  const isOpen = useMemo(() => {
    const idBol = menuStatusObj.id === Node.data.id
    return idBol && menuStatusObj.status
  }, [menuStatusObj, Node])

  const style = classNames({ [styles.customNode]: !foucusStatus }, { [styles.customNodeBorder]: foucusStatus })
  return (
    <>
      <div className={style}>
        <Handle className={styles.handle} type='target' position={Node.sourcePosition || Position.Bottom} />
        <div className={styles.label}>
          {' '}
          <IconCommon style={{ width: '14px', height: '14px', color: '#333333' }} />
          <span className={styles.labelName}> {Node.data.label}</span>
        </div>
      </div>
      {isOpen && <ContextMenu flag={Node.data.flag} Node={Node} />}
    </>
  )
}

export default Custom
