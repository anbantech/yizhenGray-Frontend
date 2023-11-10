import React from 'react'
import { IconPeripheral, IconYifuRegister, IconCommon, IconDelete } from '@anban/iconfonts'
import { NodeProps } from 'reactflow'
import styles from '../model.less'

const Flag5 = (props: NodeProps) => {
  console.log(props)
  return (
    <div className={styles.Flag5}>
      <IconPeripheral style={{ width: '16px', height: '16px', color: '#666', marginRight: '4px' }} />
      <span> 添加自定义外设 </span>
    </div>
  )
}

const Flag1 = () => {
  return (
    <div className={styles.Flag1}>
      <div className={styles.Flag5}>
        <IconYifuRegister style={{ width: '16px', height: '16px', color: '#666', marginRight: '4px' }} />
        <span>添加寄存器 </span>
      </div>
      <div className={styles.Flag_1}>
        <IconDelete style={{ width: '16px', height: '16px', color: '#000', marginRight: '4px' }} />
        <span>删除</span>
      </div>
    </div>
  )
}

const Flag2 = () => {
  return (
    <div className={styles.Flag3}>
      <div className={styles.Flag5}>
        <IconCommon style={{ width: '16px', height: '16px', color: '#000', marginRight: '4px' }} />
        <span> 添加数据处理器 </span>
      </div>
      <div className={styles.Flag_1}>
        <IconDelete style={{ width: '16px', height: '16px', color: '#000', marginRight: '4px' }} />
        <span>删除</span>
      </div>
    </div>
  )
}

const mapFlagCompoents = {
  5: Flag5,
  1: Flag1,
  2: Flag2
}

const mapFlagCompoentsStyle = {
  5: styles.contextMenu5,
  1: styles.contextMenu1,
  2: styles.contextMenu2
}
export default function ContextMenu(props: { flag: number; Node: NodeProps }) {
  const { flag, Node } = props
  return (
    <div className={mapFlagCompoentsStyle[flag as keyof typeof mapFlagCompoentsStyle]}>
      {mapFlagCompoents[flag as keyof typeof mapFlagCompoents](Node)}
    </div>
  )
}
