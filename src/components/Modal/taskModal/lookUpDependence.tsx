import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import 'antd/dist/antd.css'
import { Modal, Tooltip } from 'antd'
import testing from 'Src/assets/Contents/Group692.svg'
import styles from '../BaseModle.less'

interface NewTaskInstanceType {
  visibility: boolean
  data: any
  choiceModal: (val: boolean) => void
  width: string
  name: string
}
type K = number
type V = number
type CrashObjType = Record<string, string>
interface mapType {
  status: any
  id: number
  name: string
  type: number
  parents: any[]
  head?: boolean
  project?: any
}

const TypeMap = {
  0: '外设',
  1: '激励单元',
  2: '激励嵌套',
  3: '交互',
  4: '模版',
  5: '任务'
}

interface al {
  [key: string]: any
}

function LookUpDependence(props: NewTaskInstanceType) {
  const { visibility, data, choiceModal, width, name } = props

  const [map, setMap] = useState<Map<K, V>>(new Map())

  const [widths, setWidth] = useState<al>({})
  const lineQef = useRef<any>({})
  const getRef = (dom: any, item: number, key: string) => {
    lineQef.current[key] = dom?.offsetHeight
  }
  const meomMap = useCallback(
    (id: number) => {
      return !map.has(id)
    },
    [map]
  )

  const showCharts = (id: number) => {
    setMap(pre => {
      const temp = new Map(pre)
      if (temp.has(id)) {
        temp.delete(id)
        return temp
      }
      temp.set(id, id)
      return temp
    })
  }
  const acl = useCallback(
    name => {
      if (name && visibility) {
        return `${widths[name]}px`
      }
    },
    [widths, visibility]
  )
  useLayoutEffect(() => {
    setWidth({ ...lineQef.current })
  }, [lineQef, visibility, map])
  // 创建列表
  const ListComponment = (props: any) => {
    const value = props.value as mapType
    return (
      <div className={styles.listComponentsBoby}>
        <div className={styles.rectBox}>
          {value.head ? <div className={styles.drawBody_concentBody_cloumnNone} /> : <div className={styles.drawBody_concentBody_cloumn} />}
          <div className={styles.rectBoxTitle}>
            {value.status === 2 ? (
              <Tooltip title='类型:任务' placement='bottomLeft'>
                <div className={styles.showTestimg}>
                  <img src={testing} alt='' />
                  <span style={{ color: '#11cc66' }}>{value.name}</span>{' '}
                </div>
              </Tooltip>
            ) : (
              <Tooltip title={`类型:${TypeMap[value.type as keyof typeof TypeMap]}`} placement='bottomLeft'>
                <span>{value?.name}</span>
              </Tooltip>
            )}
          </div>
          {value?.project ? (
            <Tooltip title='类型:项目' placement='bottomLeft'>
              <span className={styles.projectCloumnBoby}>
                <span className={styles.projectCloumn} />
                <span> {value.project.name}</span>
              </span>
            </Tooltip>
          ) : null}
          {value?.parents?.length > 0 ? (
            <div className={styles.drawBody_concentBody_cloumn} />
          ) : (
            <div className={styles.drawBody_concentBody_cloumnNone} />
          )}
          {value?.parents?.length > 0 ? (
            <div
              className={styles.lookUpImageBody}
              role='time'
              onClick={() => {
                showCharts(value.id)
              }}
            >
              {meomMap(value.id) ? <div className={styles.lookUpImage} /> : <div className={styles.lookUpOpenImage} />}
            </div>
          ) : null}
        </div>

        {value?.parents && meomMap(value.id) ? (
          <div className={styles.listComponents}>
            {value?.parents.map((item: al, index: number) => {
              return (
                <div
                  key={item.id}
                  className={styles.listComponentsBody}
                  ref={el => {
                    getRef(el, item.type, item.name)
                  }}
                >
                  <ListComponment value={item} />
                  {value?.parents.length - 1 !== index ? (
                    <div style={{ width: acl(item.name) }} className={styles.drawBody_concentBody_line} />
                  ) : null}
                </div>
              )
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
        <ListComponment value={data} />
      </div>
    </Modal>
  )
}

export default LookUpDependence
