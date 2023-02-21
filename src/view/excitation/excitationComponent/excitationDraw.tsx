import { MinusSquareTwoTone, PlusSquareTwoTone } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { use } from 'echarts/core'
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import { createGroupFn } from 'Src/services/api/excitationApi'
import { useLatest } from 'Src/util/Hooks/useLast'
import styles from 'Src/view/excitation/excitation.less'
import StyleSheet from './excitationDraw.less'

interface al {
  [key: string]: any
}
type K = number
type V = number
const ExcitationDraw: React.FC = () => {
  const history = useHistory()
  const state = useLocation()?.state as al

  const lineQef = useLatest<any>({})

  const [widths, setWidth] = useState<al>({})

  const [map, setMap] = useState<Map<K, V>>(new Map())
  const getRef = (dom: any, item: number, key: string) => {
    if (item === 0 || item === 1) {
      lineQef.current[key] = dom?.offsetWidth
    }
  }
  useLayoutEffect(() => {
    setWidth(lineQef.current)
  }, [lineQef])

  const meomMap = useCallback(
    (id: number) => {
      return !map.has(id)
    },
    [map]
  )
  const acl = useCallback(
    (type, name) => {
      if (name || type) {
        if (type === 0) {
          return '60px'
        }
        if (type === 1) {
          return `${widths[name] - 20}px`
        }
      }
    },
    [widths]
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
  const Deep = (props: any) => {
    const { value } = props
    return (
      <div className={StyleSheet.drawBody}>
        {value?.map((item: any, index: number) => {
          return (
            <div
              key={item.sender_id}
              className={StyleSheet.drawBody_concentBody}
              ref={el => {
                getRef(el, item.type, item.name)
              }}
            >
              <div className={meomMap(item.sender_id) ? StyleSheet.drawBody_concentBody_Header : StyleSheet.drawBody_concentBody_Headers}>
                <div className={StyleSheet.drawBody_concentBody_Header_position}>
                  <div className={StyleSheet.drawBody_concentBody_Header_title}>
                    <Tooltip title={item.name} placement='bottom'>
                      <span className={StyleSheet.name}>{item.name}</span>{' '}
                    </Tooltip>
                    {item.group_data_list?.length > 0 ? (
                      <div
                        className={StyleSheet.icon}
                        role='time'
                        onClick={() => {
                          showCharts(item.sender_id)
                        }}
                      >
                        {meomMap(item.sender_id) ? <MinusSquareTwoTone /> : <PlusSquareTwoTone />}
                      </div>
                    ) : null}
                  </div>
                  {value.length - 1 !== index ? (
                    <div style={{ width: acl(item.target_type, item.name) }} className={StyleSheet.drawBody_concentBody_line} />
                  ) : null}
                </div>

                {item.group_data_list?.length > 0 && meomMap(item.sender_id) ? <div className={StyleSheet.drawBody_concentBody_cloumn} /> : null}

                {item.group_data_list?.length > 0 && meomMap(item.sender_id) ? <Deep value={item.group_data_list} /> : null}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  const createOneExcitationFn = async () => {
    const result = await createGroupFn(state.Data)
    if (result.data) {
      history.push({
        pathname: '/excitationList',
        state: { type: state.type }
      })
    }
  }
  return (
    <div className={StyleSheet.drawbodys}>
      <div>{state && <Deep value={[state.Data]} />}</div>
      <div className={StyleSheet.footer}>
        {!state.isFixForm ? (
          <CommonButton
            buttonStyle={styles.stepButton}
            type='primary'
            name='确认'
            disabled={state.isFixForm}
            onClick={() => {
              createOneExcitationFn()
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

ExcitationDraw.displayName = 'excitationDraw'

export default ExcitationDraw
