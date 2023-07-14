import React, { Dispatch, forwardRef, memo, SetStateAction, useImperativeHandle, useState } from 'react'
import more from 'Src/assets/image/icon_more.svg'
import more_hover from 'Src/assets/image/icon_more_hover.svg'
import MenuComponents from '../Menu/Menu'
import styles from './omit.less'

type Data = any | Record<string, any>

interface MenuTypes {
  id: number
  updateMenueFn: (value: number) => void

  onChange: (val: string) => void
  // eslint-disable-next-line react/require-default-props
  data?: Data
  // eslint-disable-next-line react/require-default-props
  setData?: Dispatch<SetStateAction<any>>
  // eslint-disable-next-line react/require-default-props
  type?: string
}

const MemoOmitComponentsforwardRef = forwardRef(function MemoOmitComponents(props: MenuTypes, ref) {
  const { updateMenueFn, id, setData, type, data, onChange } = props
  const [open, setOpen] = useState(false)
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
    <div
      key={id}
      style={{ cursor: 'pointer' }}
      className={styles.omitCompoentsTarget}
      role='time'
      onClick={() => {
        if (data && setData) {
          setData(data)
        }
        updateMenueFn(id)
        setOpen(!open)
      }}
    >
      <div className={styles.omitRounds}>{open ? <img src={more_hover} alt='' /> : <img src={more} alt='' />}</div>

      {open ? <MenuComponents type={type} changeTimeType={onChange} setOpen={setOpen} /> : null}
    </div>
  )
})

const OmitExcitationComponents = memo(MemoOmitComponentsforwardRef)
export default OmitExcitationComponents
