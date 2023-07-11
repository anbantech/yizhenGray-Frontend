import React, { Dispatch, SetStateAction, useState } from 'react'
import detail_icon from 'Src/assets/image/icon_detail.svg'
import delete_icon from 'Src/assets/image/icon_delete.svg'
import { generateUUID } from 'Src/util/common'
import info_icon from 'Src/assets/image/icon_info_circle.svg'
import styles from './Menu.less'

interface MenuProps {
  changeTimeType: (val: string) => void
  // eslint-disable-next-line react/no-unused-prop-types, react/require-default-props
  onMouseLeave?: (val: number) => void
  setOpen: Dispatch<SetStateAction<boolean>>
  // eslint-disable-next-line react/no-unused-prop-types, react/require-default-props
  type?: string
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
  const { changeTimeType, type, setOpen } = props
  const [currentType, setCurrentType] = useState('')
  const changeCurrent = (val: string) => {
    setCurrentType(val)
    changeTimeType(val)
  }
  return (
    <div
      className={type === 'project' ? styles.positionMenuItemsProject : styles.positionMenu}
      onMouseLeave={() => {
        setOpen(false)
      }}
    >
      {menuKey.map((item: MenuPropsItem) => {
        return (
          <div key={generateUUID()}>
            {type && type === 'project' && item.title === '查看关联信息' ? null : (
              <div
                className={currentType === item.title ? styles.positionMenuItems : styles.positionMenuItem}
                role='time'
                onClick={(e: any) => {
                  e.stopPropagation()
                  setOpen(false)
                  changeCurrent(item.title)
                }}
              >
                <img src={item.src} alt='' style={{ width: '13px', height: '13px', marginRight: '10px' }} />
                <span className={styles.chart}>{item.title}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MenuComponents
