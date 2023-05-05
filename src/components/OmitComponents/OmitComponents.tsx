import React from 'react'
import MenuComponents from '../Menu/Menu'
import styles from './omit.less'

interface MenuTypes {
  id: number
  updateMenue: (value: number) => void
  status: number
  onChange: (val: string) => void
}

function OmitComponents(props: MenuTypes) {
  const { updateMenue, status, id, onChange } = props
  return (
    <div
      className={styles.omitCompoentsTarget}
      role='time'
      onClick={() => {
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
