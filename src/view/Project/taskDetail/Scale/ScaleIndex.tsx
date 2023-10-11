import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { Tabs, Button } from 'antd'
import { useHistory, withRouter } from 'react-router-dom'
import { instanceDetail } from 'Src/services/api/taskApi'
import memoryWrite from 'Src/assets/Contents/memoryWrite.svg'
import registerWrite from 'Src/assets/Contents/registerWrite.svg'
import memoryBlue from 'Src/assets/Contents/memoryBlue.svg'
import registereBlue from 'Src/assets/Contents/registerBlue.svg'
import RectangleButton from 'Src/components/Button/rectangle'
import yz_coverage_select from 'Src/assets/scale/yz_coverage_select.svg'
import TaskDetailModal from 'Src/components/Modal/taskModal/TaskDetailModal'
import yz_performance_unselect from 'Src/assets/scale/yz_performance_unselect.svg'
import yz_performance_select from 'Src/assets/scale/yz_performance_select.svg'
import yz_coverage_unselect from 'Src/assets/scale/yz_coverage_unselect.svg'
import yz_trace_select from 'Src/assets/scale/yz_trace_select.svg'
import yz_trace_unselect from 'Src/assets/scale/yz_trace_unselect.svg'
import Register from './ScaleComponent/Register'
import MemoryMonitor from './ScaleComponent/MemoryMonitor'
import styles from './Scale.less'
import CoveRate from './ScaleComponent/CoveRate'
import Performance from './ScaleComponent/Performance'
import Track from './ScaleComponent/Track'

type TabPosition = 'left' | 'right' | 'top' | 'bottom'
interface propsType {
  type: string | number
}
const RegisterSvg = (props: propsType) => {
  const key = props.type || 0
  return (
    <>
      {key === 'Register' ? (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={registereBlue} alt='' />
      ) : (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={registerWrite} alt='' />
      )}
    </>
  )
}

const PerformanceSvg = (props: propsType) => {
  const key = props.type || 0
  return (
    <>
      {key === 'PerformanceSvg' ? (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={yz_performance_select} alt='' />
      ) : (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={yz_performance_unselect} alt='' />
      )}
    </>
  )
}
type propsNo = {
  loopStatus: number
}

const MemorySvg = (props: propsType) => {
  const key = props.type || 0
  return (
    <>
      {key === 'Memory' ? (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={memoryBlue} alt='' />
      ) : (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={memoryWrite} alt='' />
      )}
    </>
  )
}

const TrackSvg = (props: propsType) => {
  const key = props.type || 0
  return (
    <>
      {key === 'TrackSvg' ? (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={yz_trace_select} alt='' />
      ) : (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={yz_trace_unselect} alt='' />
      )}
    </>
  )
}

const CoverRateSvg = (props: propsType) => {
  const key = props.type || 0
  return (
    <>
      {key === 'CoverRateSvg' ? (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={yz_coverage_select} alt='' />
      ) : (
        <img style={{ width: 18, height: 18, marginRight: 8, marginBottom: 4 }} src={yz_coverage_unselect} alt='' />
      )}
    </>
  )
}
interface contextType {
  test_id: string
  isTesting: boolean
  logId: number
  currentType: string
}

interface sacleMapType {
  [key: string]: string[]
}
export const Context = createContext<contextType>(null!)

function Scale(props: any) {
  const test_id = props.location?.state?.test_Id
  const logId = props.location?.state?.logId
  const isTesting = props.location?.state?.isTesting
  const data = props.location?.state?.data
  const [currentType, setCurrentType] = useState<string>(isTesting ? ' Memory' : 'Register')
  const [loopStatus, setLoopStatus] = useState<number>(2)
  const changeCurrentType = (e: any) => {
    setCurrentType(e)
  }
  const Data = props.location?.state
  const childRef: any = {
    Memory: useRef<any>(null),
    Register: useRef<any>(null),
    CoverRateSvg: useRef<any>(null),
    TrackSvg: useRef<any>(null),
    PerformanceSvg: useRef<any>(null)
  }
  const { TabPane } = Tabs
  const scaleMap: sacleMapType = {
    Memory: ['查询'],
    Register: ['查询'],
    CoverRateSvg: ['查询'],
    TrackSvg: ['查询'],
    PerformanceSvg: ['查询']
  }

  // 获取任务详情
  const getTaskDetail = async (value: string) => {
    // eslint-disable-next-line no-undef
    const getTaskDetails = await instanceDetail(value)
    if (getTaskDetails.data) {
      setLoopStatus(getTaskDetails?.data.status)
    }
  }
  const timerRef = useRef<any>()
  useEffect(() => {
    if (test_id && isTesting) {
      timerRef.current = setInterval(() => {
        getTaskDetail(test_id)
      }, 3000)
    }
    return () => {
      clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test_id])
  const beginOrStopTest = useCallback(() => {
    const ref = childRef[currentType]
    ref.current[currentType]()
  }, [currentType, childRef])

  const history = useHistory()
  const goBack = () => {
    history.push({
      pathname: '/Projects/Tasks/Detail',
      state: Data
    })
  }
  const NoScaleData = (props: propsNo) => {
    const { loopStatus } = props
    return (
      <div className={styles.NoScaleData}>
        {[0, 1].includes(loopStatus) ? <span>任务已结束,请返回实例详情页</span> : <span>任务处于异常暂停状态，无法查看数据，请返回任务详情页</span>}
        <Button
          className={styles.NoScaleButton}
          type='primary'
          onClick={() => {
            goBack()
          }}
        >
          返回
        </Button>
      </div>
    )
  }

  return (
    <>
      <Context.Provider value={{ test_id, isTesting, logId, currentType }}>
        {!isTesting ? <TaskDetailModal name='缺陷详情' value={data} /> : null}
        <div className={styles.Detail}>
          {[0, 1, 4].includes(loopStatus) ? (
            <NoScaleData loopStatus={loopStatus} />
          ) : (
            <div className={styles.DetailHead} style={{ display: data?.case_type || isTesting ? '' : ' none' }}>
              <Tabs defaultActiveKey={isTesting ? 'Memory' : 'Register'} style={{ width: '100%' }} onChange={changeCurrentType}>
                {isTesting && (
                  <TabPane
                    tab={
                      <span>
                        <MemorySvg type={currentType} />
                        内存监控
                      </span>
                    }
                    key='Memory'
                  >
                    <MemoryMonitor />
                  </TabPane>
                )}
                {(data?.case_type || isTesting) && (
                  <TabPane
                    tab={
                      <span>
                        <RegisterSvg type={currentType} />
                        寄存器
                      </span>
                    }
                    key='Register'
                  >
                    <Register ref={childRef.Register} />
                  </TabPane>
                )}
                {isTesting && (
                  <TabPane
                    tab={
                      <span>
                        <CoverRateSvg type={currentType} />
                        覆盖率
                      </span>
                    }
                    key='CoverRateSvg'
                  >
                    <CoveRate ref={childRef.CoverRateSvg} />
                  </TabPane>
                )}
                {isTesting && (
                  <TabPane
                    tab={
                      <span>
                        <PerformanceSvg type={currentType} />
                        性能
                      </span>
                    }
                    key='PerformanceSvg'
                  >
                    <Performance ref={childRef.PerformanceSvg} />
                  </TabPane>
                )}
                {isTesting && (
                  <TabPane
                    tab={
                      <span>
                        <TrackSvg type={currentType} />
                        跟踪
                      </span>
                    }
                    key='TrackSvg'
                  >
                    <Track ref={childRef.TrackSvg} />
                  </TabPane>
                )}
              </Tabs>
              {['Register', 'CoverRateSvg', 'PerformanceSvg', 'TrackSvg'].includes(currentType) && isTesting ? (
                <RectangleButton
                  style={styles.btn}
                  onClick={() => {
                    beginOrStopTest()
                  }}
                  name={scaleMap[currentType][0]}
                  type='primary'
                />
              ) : null}
            </div>
          )}
        </div>
      </Context.Provider>
    </>
  )
}

export default withRouter(Scale)
