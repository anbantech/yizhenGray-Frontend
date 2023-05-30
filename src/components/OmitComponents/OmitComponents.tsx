import React, { Dispatch, SetStateAction, useState } from 'react'
import more from 'Src/assets/image/icon_more.svg'
import more_hover from 'Src/assets/image/icon_more_hover.svg'
import MenuComponents from '../Menu/Menu'
import styles from './omit.less'

type Data = any | Record<string, any>

interface MenuTypes {
  id: number
  updateMenueFn: (value: number) => void
  status: number
  onChange: (val: string) => void
  // eslint-disable-next-line react/require-default-props
  data?: Data
  // eslint-disable-next-line react/require-default-props
  setData?: Dispatch<SetStateAction<any>>
  // eslint-disable-next-line react/require-default-props
  type?: string
}

function OmitComponents(props: MenuTypes) {
  const { updateMenueFn, status, id, setData, type, data, onChange } = props
  const [isMove, setMoveStatus] = useState(false)
  const [open, setOpen] = useState(false)
  const changeMore = () => {
    setMoveStatus(!isMove)
  }
  return (
    <div
      className={styles.omitCompoentsTarget}
      role='time'
      onClick={() => {
        if (data && setData) {
          setData(data)
        }
        updateMenueFn(id)
        setOpen(true)
      }}
      onMouseEnter={changeMore}
      onMouseLeave={() => {
        changeMore()
      }}
    >
      <div className={styles.omitRounds}>{isMove ? <img src={more_hover} alt='' /> : <img src={more} alt='' />}</div>

      {status === id && open ? <MenuComponents setOpen={setOpen} onMouseLeave={updateMenueFn} type={type} changeTimeType={onChange} /> : null}
    </div>
  )
}

export default OmitComponents
