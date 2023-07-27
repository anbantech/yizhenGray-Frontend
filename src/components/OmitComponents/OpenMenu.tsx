import React, { forwardRef, memo, useImperativeHandle, useState } from 'react'
import more from 'Src/assets/image/icon_more.svg'
import more_hover from 'Src/assets/image/icon_more_hover.svg'
import DragComponents from './DragComponents'
import styles from './omit.less'

type Data = any | Record<string, any>

interface MenuTypes {
  onChange: (val: string, id: number) => void
  id: number
}

const DragComponentsforwardRef = forwardRef(function MemoOmitComponents(props: MenuTypes, ref) {
  const { onChange, id } = props
  const [open, setOpen] = useState(false)
  const openMenu = () => {
    setOpen(!open)
  }
  useImperativeHandle(
    ref,
    () => {
      return {
        closeMenu: () => {
          setOpen(false)
        }
      }
    },
    []
  )

  return (
    <div style={{ cursor: 'pointer' }} className={styles.omitCompoentsTarget} role='time' onClick={openMenu}>
      <div className={styles.omitRounds}>{open ? <img src={more_hover} alt='' /> : <img src={more} alt='' />}</div>
      {open ? <DragComponents setOpen={setOpen} onChange={onChange} id={id} /> : null}
    </div>
  )
})

const OmitExcitation = memo(DragComponentsforwardRef)
export default OmitExcitation
