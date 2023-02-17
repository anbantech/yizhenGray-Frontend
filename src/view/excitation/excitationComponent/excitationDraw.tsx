import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useLatest } from 'Src/util/Hooks/useLast'
import StyleSheet from './excitationDraw.less'

interface al {
  [key: string]: any
}
const ExcitationDraw: React.FC = () => {
  const lineQef = useLatest<any>({})
  const reslut = [
    {
      id: '1',
      name: '级联Group',
      type: 0,
      children: [
        {
          id: '1-22',
          name: '级联1',
          type: 1,
          children: [
            {
              id: '1-222',
              name: 'group',
              type: 2,
              children: [
                {
                  id: '1-222',
                  name: 'group12',
                  type: 2
                },
                {
                  id: '1-22',
                  name: 'group11',
                  type: 2
                }
              ]
            },
            {
              id: '1-22',
              name: 'group1',
              type: 2
            }
          ]
        },
        {
          id: '1-222',
          name: '级联2',
          type: 1,
          children: [
            {
              id: '1-222嘻嘻2',
              name: 'group3',
              type: 2
            }
          ]
        },
        {
          id: '1-222',
          name: '级联4',
          type: 1,
          children: [
            {
              id: '1-222嘻12',
              name: 'group32',
              type: 21
            }
          ]
        },
        {
          id: '1-22222',
          name: '级联5',
          type: 1,
          children: [
            {
              id: '12嘻12',
              name: 'groupx32',
              type: 21
            }
          ]
        },
        {
          id: '1-22222',
          name: '级联5',
          type: 1,
          children: [
            {
              id: '12嘻12',
              name: 'groupx32',
              type: 21
            }
          ]
        },
        {
          id: '1-22222',
          name: '级联5',
          type: 1,
          children: [
            {
              id: '12嘻12',
              name: 'groupx32',
              type: 21
            }
          ]
        }
      ]
    },
    {
      id: '2',
      type: 0,
      name: '级联group2',
      children: [
        {
          id: '1-222313',
          name: '级联3',
          type: 1
        }
      ]
    }
  ]
  const [widths, setWidth] = useState<al>({})

  const getRef = (dom: any, item: number, key: string) => {
    if (item === 0 || item === 1) {
      lineQef.current[key] = dom?.offsetWidth
    }
  }
  useLayoutEffect(() => {
    setWidth(lineQef.current)
  }, [lineQef])

  const acl = useCallback(
    (type, name) => {
      if (name || type) {
        if (type === 2) {
          return '60px'
        }
        if (type === 1) {
          return `${widths[name] - 20}px`
        }
      }
    },
    [widths]
  )

  const Deep = (props: any) => {
    const { value } = props
    return (
      <div className={StyleSheet.a}>
        {value?.map((item: any, index: number) => {
          return (
            <div
              key={item.id}
              className={StyleSheet.a_body}
              ref={el => {
                getRef(el, item.type, item.name)
              }}
            >
              <div className={StyleSheet.a_1}>
                <div className={StyleSheet.position_1}>
                  <div className={StyleSheet.a_1_1}>
                    {' '}
                    <span>{item.name}</span>{' '}
                  </div>
                  {value.length - 1 !== index ? <div style={{ width: acl(item.type, item.name) }} className={StyleSheet.a_1_line} /> : null}
                </div>

                {item.children?.length > 0 ? <div className={StyleSheet.a_1_cloumn} /> : null}

                {item.children?.length > 0 ? <Deep value={item.children} /> : null}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <div>
        <span>交互</span>
        <Deep value={reslut} />
      </div>
    </div>
  )
}

ExcitationDraw.displayName = 'excitationDraw'

export default ExcitationDraw
