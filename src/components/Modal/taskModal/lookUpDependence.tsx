import React from 'react'
import 'antd/dist/antd.css'
import { Modal } from 'antd'
import { statusMap } from 'Src/util/DataMap/dataMap'
import styles from '../BaseModle.less'

interface NewTaskInstanceType {
  visibility: boolean
  data: any
  choiceModal: (val: boolean) => void
  width: string
  name: string
  titleName: string[]
}

type CrashObjType = Record<string, string>
interface mapType {
  status: any
  id: number
  name: string
  type: number
  parents: any[]
}

function LookUpDependence(props: NewTaskInstanceType) {
  const { visibility, data, titleName, choiceModal, width, name } = props

  // 创建列表

  const ListComponment = (props: any) => {
    const value = props.value as mapType
    return (
      <div className={styles.rowList_Element}>
        <div className={+value.status ? styles.listTitleStatus : styles.listTitle}>
          {' '}
          <span>{value?.name}</span>
          {+value.status ? <span style={{ paddingLeft: '50px' }}> {statusMap[value.status as keyof typeof statusMap].label} </span> : null}
        </div>

        {value?.parents ? (
          <div className={styles.rowList_nextElement}>
            {value?.parents.map(item => {
              return <ListComponment key={item.id} value={item} />
            })}
          </div>
        ) : null}
      </div>
    )
  }
  return (
    <Modal
      className={styles.lookUpDependenceModal}
      width={width}
      visible={visibility}
      title={name}
      onCancel={() => {
        choiceModal(false)
      }}
      footer={[]}
    >
      <div className={styles.main}>
        <div className={styles.main_header}>
          {titleName?.map((item: string) => {
            return <div key={item}>{item}</div>
          })}
        </div>
        <div className={styles.listBody}>
          {data?.parents.map((item: any) => {
            return (
              <div key={item.id} className={styles.rowList}>
                <ListComponment value={item} />
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

export default LookUpDependence
