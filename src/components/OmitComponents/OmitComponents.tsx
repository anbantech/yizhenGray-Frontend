import React, { Dispatch, SetStateAction } from 'react'
import MenuComponents from '../Menu/Menu'
import styles from './omit.less'

type Data = any | Record<string, any>

interface MenuTypes {
  id: number
  updateMenue: (value: number) => void
  status: number
  onChange: (val: string) => void
  // eslint-disable-next-line react/require-default-props
  data?: Data
  // eslint-disable-next-line react/require-default-props
  setData?: Dispatch<SetStateAction<any>>
}

function OmitComponents(props: MenuTypes) {
  const { updateMenue, status, id, setData, data, onChange } = props
  return (
    <div
      className={styles.omitCompoentsTarget}
      role='time'
      onClick={() => {
        if (data && setData) {
          setData(data)
        }
        updateMenue(id)
      }}
    >
      <div className={styles.omitRounds}>
        <span className={styles.omitRoundsSpan} />
        <span className={styles.omitRoundsSpan} />
        <span className={styles.omitRoundsSpan} />
      </div>

      {status === id ? <MenuComponents onMouseLeave={updateMenue} changeTimeType={onChange} /> : null}
    </div>
  )
}

export default OmitComponents
