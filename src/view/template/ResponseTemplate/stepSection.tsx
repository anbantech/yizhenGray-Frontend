import { Button } from 'antd'
import { memo } from 'react'
import * as React from 'react'
import styles from './createResponseTemplate.less'

interface StepSection {
  onClickCallback: (...args: any[]) => void
  readonly?: boolean
  label: string
}

const StepSection: React.FC<StepSection> = ({ onClickCallback, readonly, label }) => {
  return (
    <div className={styles.footer}>
      <div />
      <div>
        <Button className={styles.footerBtn} style={{ marginLeft: '8px' }} onClick={onClickCallback}>
          {readonly ? '返回' : label}
        </Button>
      </div>
    </div>
  )
}

StepSection.displayName = 'StepSection'

export default memo(StepSection)
