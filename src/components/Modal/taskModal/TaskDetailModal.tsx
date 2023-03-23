import React from 'react'
import 'antd/dist/antd.css'
import { CrashInfoMap } from 'Src/util/DataMap/dataMap'
import { Modal, Button } from 'antd'
import styles from '../BaseModle.less'

function TaskDetailModal(props: any) {
  const { IsModalVisible, modalClose, name, concent } = props

  const getFileName = (value: string) => {
    if (!value) return ''
    const splitArray = value.split('\\')
    return splitArray[splitArray.length - 1]
  }
  return (
    <Modal
      className={styles.modleDeatilStyle}
      visible={IsModalVisible}
      width='460px'
      title={name}
      onCancel={() => {
        modalClose(false)
      }}
      footer={[
        <Button
          className={styles.btn_cancel}
          key='back'
          onClick={() => {
            modalClose(false)
          }}
        >
          关闭
        </Button>
      ]}
    >
      {Object.keys(concent).length >= 1 && (
        <div>
          <div className={styles.pc}>
            <span className={styles.detailLeft} style={{ paddingRight: '10px' }}>
              缺陷结果 :{' '}
            </span>{' '}
            <span> {CrashInfoMap[+Object.keys(concent)[0]]}</span>
          </div>
          <div className={styles.pc}>
            <span className={styles.detailLeft} style={{ paddingRight: '20px' }}>
              PC指针 :{' '}
            </span>
            <div className={styles.pcRight}>
              {concent[Object.keys(concent)[0]]?.payload?.PC.map((item: string) => {
                return (
                  <div key={item} className={styles.pcRightConcent}>
                    <span className={styles.pcRightConcentChart}> {item}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={styles.pc}>
            <span className={styles.detailLeft} style={{ paddingRight: '24px' }}>
              文件名 :{' '}
            </span>{' '}
            <span> {getFileName(concent[Object.keys(concent)[0]]?.payload.fileName)}</span>
          </div>
          <div className={styles.pc}>
            <span className={styles.detailLeft} style={{ paddingRight: '25px' }}>
              函数名 :{' '}
            </span>{' '}
            <span> {concent[Object.keys(concent)[0]]?.payload.funcName} </span>
          </div>
          <div className={styles.pc}>
            <span style={{ paddingRight: '37px' }} className={styles.detailLeft}>
              行号 :{' '}
            </span>{' '}
            <span> {concent[Object.keys(concent)[0]]?.payload.lines} </span>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default TaskDetailModal
