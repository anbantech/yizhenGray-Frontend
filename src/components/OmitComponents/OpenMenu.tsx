import React from 'react'
import more from 'Src/assets/image/icon_more.svg'
import more_hover from 'Src/assets/image/icon_more_hover.svg'
import DragComponents from './DragComponents'
import styles from './omit.less'

type Data = any | Record<string, any>

interface MenuTypes {
  onChange: (val: string, id: number) => void
  id: number
  menuId: number
  position: number
}

const OmitExcitation = (props: MenuTypes) => {
  const positionRef = React.useRef<any>()

  const { onChange, id, menuId, position } = props

  return (
    <div style={{ cursor: 'pointer' }} ref={positionRef} className={styles.omitCompoentsTarget} role='time'>
      <div className={styles.omitRounds}>{menuId === id ? <img src={more_hover} alt='' /> : <img src={more} alt='' />}</div>
      {menuId === id ? <DragComponents onChange={onChange} position={position} id={id} /> : null}
    </div>
  )
}

export default OmitExcitation
