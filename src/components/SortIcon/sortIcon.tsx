import React, { useEffect, useState } from 'react'
import styles from './sort.less'

interface SortIconComponentProps {
  title: string
  type: string
  isType: string
  // eslint-disable-next-line react/require-default-props
  status?: number
  onChange: (value1?: any, type?: string) => void
}

function SortIconComponent(props: SortIconComponentProps) {
  const { title, onChange, type, status, isType } = props
  const [down, setDown] = useState('')
  const [up, setUp] = useState('')
  const [titleActiveBol, setTitle] = useState(false)

  const upFn = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setUp('ascend')
    setDown('')
    onChange('ascend', type)
  }

  const downFn = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setDown('descend')
    setUp('')
    onChange('descend', type)
  }

  const defaultFn = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setTitle(!titleActiveBol)
  }

  useEffect(() => {
    if (isType !== type) {
      setDown('')
      setUp('')
    }
  }, [isType, type, status])

  useEffect(() => {
    if (type === 'time' && isType === 'time' && up === '') {
      setDown('descend')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isType, up])
  return (
    <div className={styles.sortBody} role='button' tabIndex={0} onClick={defaultFn}>
      <span className={up || down ? styles.titleActive : styles.title}> {title} </span>
      <div role='button' tabIndex={0} className={styles.sort} onClick={defaultFn}>
        <div role='time' className={up === 'ascend' ? styles.upActive : styles.up} onClick={upFn} />
        <div role='time' className={down === 'descend' ? styles.downActive : styles.down} onClick={downFn} />
      </div>
    </div>
  )
}

const SortIconComponenMemo = React.memo(SortIconComponent)

export default SortIconComponenMemo
