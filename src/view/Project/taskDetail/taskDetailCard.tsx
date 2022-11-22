// import { RightOutlined } from '@ant-design/icons'
import * as React from 'react'
import styles from './taskDetail.less'

function TaskDetailCard() {
  return (
    <div className={styles.taskDetailCard_Main}>
      <div className={styles.taskDetailCard_Main_Header}>
        {/* <span className={styles.taskDetailCard_Main_Header}>{name}</span> */}
        {/* {logo ? (
          <div className={styles.cardOneRight} role='button' tabIndex={0} onClick={() => {}}>
            <span style={{ color: '#0077FF', fontSize: '13px' }}>详情</span>
            <RightOutlined style={{ color: '#0077FF' }} />
          </div>
        ) : null} */}
      </div>
      <span>{}</span>
    </div>
  )
}

export default React.memo(TaskDetailCard)
