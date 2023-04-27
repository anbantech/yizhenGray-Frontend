import React, { useState } from 'react'
import detail_icon from 'Src/assets/image/icon_detail.svg'
import delete_icon from 'Src/assets/image/icon_delete.svg'
import info_icon from 'Src/assets/image/icon_info_circle.svg'
import styles from './Menu.less'

interface MenuProps {
  changeTimeType: (val: string) => void
  onMouseLeave: (val: number) => void
}
const menuKey = [
  { src: detail_icon, title: '修改' },
  { src: delete_icon, title: '删除' },
  { src: info_icon, title: '查看关联信息' }
]

interface MenuPropsItem {
  [key: string]: string
}
const MenuComponents: React.FC<MenuProps> = (props: MenuProps) => {
  const { changeTimeType, onMouseLeave } = props
  const [currentType, setCurrentType] = useState('')
  const changeCurrent = (val: string) => {
    setCurrentType(val)
    changeTimeType(val)
  }
  return (
    <div
      className={styles.positionMenu}
      onMouseLeave={() => {
        onMouseLeave(-1)
      }}
    >
      {menuKey.map((item: MenuPropsItem) => {
        return (
          <div
            className={currentType === item.title ? styles.positionMenuItems : styles.positionMenuItem}
            key={Math.random()}
            role='time'
            onClick={() => {
              setCurrentType(item.title)
            }}
          >
            <img src={item.src} alt='' style={{ width: '13px', height: '13px', marginRight: '10px' }} />
            <span className={styles.chart}>{item.title}</span>
          </div>
        )
      })}
    </div>
  )
}

export default MenuComponents
