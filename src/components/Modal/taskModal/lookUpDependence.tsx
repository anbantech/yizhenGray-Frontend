import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  uuid: number
}

const TypeMap = {
  0: '端口',
  1: '激励',
  3: '激励序列',
  4: '模板',
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
  const acl = (name: any) => {
    if (name && visibility) {
      return `${widths[name]}px`
    }
  }

  useLayoutEffect(() => {
    setWidth({ ...lineQef.current })
  }, [lineQef, visibility, map])

  useEffect(() => {
    return () => {
      setMap(new Map())
      setWidth({})
    }
  }, [visibility])
  // 新建列表
  const ListComponment = (props: any) => {
    const value = props.value as mapType
    return (
      <div className={styles.listComponentsBoby}>
        <div className={styles.rectBox}>
          {value.head ? <div className={styles.drawBody_concentBody_cloumnNone} /> : <div className={styles.drawBody_concentBody_cloumn} />}
          <div className={styles.rectBoxTitle}>
            {value.status === 2 ? (
              <Tooltip title={`任务:${value.name}`} placement='bottomLeft'>
                <div className={styles.showTestimg}>
                  <img src={testing} alt='' />
                  <span style={{ color: '#11cc66' }} className={styles.GREENTitle}>
                    {value.name}
                  </span>{' '}
                </div>
              </Tooltip>
            ) : (
              <Tooltip title={`${TypeMap[value.type as keyof typeof TypeMap]}:${value.name}`} placement='bottomLeft'>
                <span>{value?.name}</span>
              </Tooltip>
            )}
          </div>
          {value?.project ? (
            <Tooltip title={`项目:${value.project.name}`} placement='bottomLeft'>
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
                showCharts(value.uuid)
              }}
            >
              {meomMap(value.uuid) ? <div className={styles.lookUpImage} /> : <div className={styles.lookUpOpenImage} />}
            </div>
          ) : null}
        </div>

        {value?.parents && meomMap(value.uuid) ? (
          <div className={styles.listComponents}>
            {value?.parents.map((item: al, index: number) => {
              return (
                <div
                  key={item.uuid}
                  className={styles.listComponentsBody}
                  ref={el => {
                    getRef(el, item.type, item.uuid)
                  }}
                >
                  <ListComponment value={item} />
                  {value?.parents.length - 1 !== index ? (
                    <div style={{ width: acl(item.uuid) }} className={styles.drawBody_concentBody_line} />
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
      centered
      onCancel={() => {
        choiceModal(false)
      }}
      footer={[]}
    >
      {visibility ? (
        <div className={styles.main}>
          <ListComponment value={data} />
        </div>
      ) : null}
    </Modal>
  )
}

export default LookUpDependence
