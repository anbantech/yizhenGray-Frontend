import { MinusSquareTwoTone, PlusSquareTwoTone } from '@ant-design/icons'
import { message, Steps, Tooltip } from 'antd'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import CommonButton from 'Src/components/Button/commonButton'
import { useHistory, useLocation } from 'react-router'
import { createGroupFn, updatFourWork } from 'Src/services/api/excitationApi'
import { sleep } from 'Src/util/baseFn'
import { useLatest } from 'Src/util/Hooks/useLast'
import styles from 'Src/view/excitation/excitation.less'
import StyleSheet from './excitationDraw.less'

interface al {
  [key: string]: any
}
type K = number
type V = number
const SetUp: React.FC<al> = (props: al) => {
  const { state } = props
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
              key={`${item.sender_id}${Math.random()}`}
              className={StyleSheet.drawBody_concentBody}
              ref={el => {
                getRef(el, item.target_type, item.name)
              }}
            >
              <div className={meomMap(item.sender_id) ? StyleSheet.drawBody_concentBody_Header : StyleSheet.drawBody_concentBody_Headers}>
                <div className={StyleSheet.drawBody_concentBody_Header_position}>
                  <div className={StyleSheet.drawBody_concentBody_Header_title}>
                    <Tooltip title={item.name} placement='bottomLeft'>
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

  return (
    <div className={StyleSheet.drawbodys}>
      <div>{state && <Deep value={[state]} />}</div>
    </div>
  )
}

const Fuzzing: React.FC<al> = (props: al) => {
  const { state } = props
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
              key={`${item.sender_id}${Math.random()}`}
              className={StyleSheet.drawBody_concentBody}
              ref={el => {
                getRef(el, item.target_type, item.name)
              }}
            >
              <div className={meomMap(item.sender_id) ? StyleSheet.drawBody_concentBody_Header : StyleSheet.drawBody_concentBody_Headers}>
                <div className={StyleSheet.drawBody_concentBody_Header_position}>
                  <div className={StyleSheet.drawBody_concentBody_Header_title}>
                    <Tooltip title={item.name} placement='bottomLeft'>
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

  return (
    <div className={StyleSheet.drawbodys}>
      <div>{state && <Deep value={[state]} />}</div>
    </div>
  )
}

const TearDown: React.FC<al> = (props: al) => {
  const { state } = props

  const [map, setMap] = useState<Map<K, V>>(new Map())
  const [widths, setWidth] = useState<al>({})
  const lineQef = useLatest<any>({})
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
      <div className={StyleSheet.drawBody} key={`${Math.random()}`}>
        {value?.map((item: any, index: number) => {
          return (
            <div
              key={`${item.sender_id}${Math.random()}`}
              className={StyleSheet.drawBody_concentBody}
              ref={el => {
                getRef(el, item.target_type, item.name)
              }}
            >
              <div className={meomMap(item.sender_id) ? StyleSheet.drawBody_concentBody_Header : StyleSheet.drawBody_concentBody_Headers}>
                <div className={StyleSheet.drawBody_concentBody_Header_position}>
                  <div className={StyleSheet.drawBody_concentBody_Header_title}>
                    <Tooltip title={item.name} placement='bottomLeft'>
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

  return (
    <div className={StyleSheet.drawbodys}>
      <div>{state && <Deep value={[state]} />}</div>
    </div>
  )
}

const ExcitationDraw: React.FC = () => {
  const { Step } = Steps

  const history = useHistory()

  const state = useLocation()?.state as al

  const [spinning, setSpinning] = React.useState(false)
  const [visibility, setVisibility] = React.useState(false)
  const [current, setCurrent] = useState(0)
  const stepData = (value: number, state: any) => {
    return { name: state.Data.name, desc: state.Data.desc, group_data_list: state.Data.group_data_list[value].group_data_list }
  }
  const CommonModleClose = (val: boolean) => {
    setVisibility(val)
  }
  const goBackHistory = useCallback(() => {
    if (state?.fromDataLoaction) {
      const { taskInfo, fromDataTask, projectInfo, from } = state?.fromDataLoaction
      history.push({
        pathname: `${from}`,
        state: {
          taskInfo,
          projectInfo,
          fromDataTask
        }
      })
    }
  }, [history, state?.fromDataLoaction])
  const createOneExcitationFn = async () => {
    const { child_id_list } = state.child_id_list
    const params = {
      name: state.Data.name,
      desc: state.Data.desc,
      child_id_list
    }
    try {
      const result = await createGroupFn(params)
      if (result.data) {
        message.success('交互创建成功')
        if (state?.fromDataLoaction) {
          goBackHistory()
        } else {
          history.push({
            pathname: '/FourExcitationList'
          })
        }
      }
    } catch (error) {
      message.error(error.message)
      await sleep(300)
      setSpinning(false)
      CommonModleClose(false)
    }
  }
  const goBack = () => {
    history.push({
      pathname: '/FourExcitationList'
    })
  }
  const updatFourWorkFn = React.useCallback(async () => {
    setSpinning(true)
    const { isFixForm, info, fromPathName, type } = state
    const { child_id_list } = state.child_id_list
    const params = {
      name: state.Data.name,
      desc: state.Data.desc,
      child_id_list
    }
    try {
      const result = await updatFourWork(state.Data.sender_id, params)
      if (result.data) {
        if (result.data) {
          message.success('交互修改成功')
          setSpinning(false)
          history.push({
            state: { isFixForm, info, type, name: '交互详情', lookDetail: true },
            pathname: fromPathName === '/FourExcitationList' ? '/FourExcitationList' : '/FourExcitationList/Deatail'
          })
        }
      }
    } catch (error) {
      message.error(error.message)
      await sleep(300)
      setSpinning(false)
      CommonModleClose(false)
    }
  }, [history, state])
  const goBackGroupList = async () => {
    history.push({
      pathname: '/FourExcitationList'
    })
  }
  const steps = [
    {
      title: '准备阶段',
      content: <SetUp state={stepData(current, state)} />
    },
    {
      title: '发送阶段',
      content: <Fuzzing state={stepData(current, state)} />
    },
    {
      title: '销毁阶段',
      content: <TearDown state={stepData(current, state)} />
    }
  ]

  const next = async () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const oepenModal = () => {
    setVisibility(true)
  }
  return (
    <div className={StyleSheet.DrawBody}>
      <div className={StyleSheet.DrawBody_headers}>
        <div className={StyleSheet.stepHeader_concent}>
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </div>
      </div>

      <div className={StyleSheet.DrawBody_Main} style={{ width: '100% ' }}>
        {steps[current].content}
      </div>
      <div className={StyleSheet.footer}>
        <div className={StyleSheet.footerConcent}>
          {state?.fromDataLoaction?.from && (
            <CommonButton
              buttonStyle={styles.stepButton}
              name='取消'
              type='default'
              onClick={() => {
                goBack()
              }}
            />
          )}
          <div className={StyleSheet.footerConcentRight}>
            {current > 0 && (
              <CommonButton
                buttonStyle={styles.stepButton}
                name='上一步'
                type='default'
                onClick={() => {
                  prev()
                }}
              />
            )}
            {current < steps.length - 1 && (
              <CommonButton
                buttonStyle={styles.stepButton}
                name='下一步'
                type='default'
                onClick={() => {
                  next()
                }}
              />
            )}
            {current === steps.length - 1 && (
              <CommonButton
                buttonStyle={styles.stepButton}
                name={state?.lookDetail ? '返回' : state?.isFixForm ? '修改' : '新建'}
                type='default'
                onClick={state?.lookDetail ? goBackGroupList : state?.isFixForm ? oepenModal : createOneExcitationFn}
              />
            )}
          </div>
        </div>
      </div>
      <CommonModle
        IsModalVisible={visibility}
        spinning={spinning}
        deleteProjectRight={updatFourWorkFn}
        CommonModleClose={CommonModleClose}
        ing='修改中'
        name='修改交互'
        concent='修改除名称、描述以外的配置项，会停止关联任务，并清空关联任务的测试数据，是否确认修改？'
      />
    </div>
  )
}
ExcitationDraw.displayName = 'excitationDraw'

export default ExcitationDraw
