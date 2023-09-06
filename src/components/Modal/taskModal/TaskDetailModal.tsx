import { Tabs, Tooltip } from 'antd'
import React, { useState } from 'react'
import { getTime } from 'Src/util/baseFn'
import { CrashInfoMapLog } from 'Src/util/DataMap/dataMap'

import registerWrite from 'Src/assets/Contents/registerWrite.svg'

import registereBlue from 'Src/assets/Contents/registerBlue.svg'

import yz_performance_unselect from 'Src/assets/scale/yz_performance_unselect.svg'
import yz_performance_select from 'Src/assets/scale/yz_performance_select.svg'
import RegisterDetail from 'Src/view/Project/taskDetail/Scale/ScaleComponent/RegisterDetail'
import PerformanceDetail from 'Src/view/Project/taskDetail/Scale/ScaleComponent/PerformanceDetail'
import NoShowSizeChangerPagina from 'Src/components/Pagination/NoShowSizeChangerPagina'
import ScaleStyles from 'Src/view/Project/taskDetail/Scale/Scale.less'

import styles from '../BaseModle.less'
import OneUtilCardStyles from './TaskErrorDetail.less'

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

const Close = () => {
  return (
    <div className={OneUtilCardStyles.oneUtilFooter}>
      <div className={OneUtilCardStyles.down} />
      <span style={{ paddingLeft: '5px' }}>展开</span>
    </div>
  )
}
const Open = () => {
  return (
    <div className={OneUtilCardStyles.oneUtilFooter}>
      <div className={OneUtilCardStyles.up} />
      <span style={{ paddingLeft: '5px' }}>收起</span>
    </div>
  )
}
const { TabPane } = Tabs
const convertTo2DArray = (arr: any[], length: number) => {
  const result = []
  for (let i = 0; i < arr.length; i += length) {
    result.push(arr.slice(i, i + length))
  }
  return result
}
const TabsComponetns = (props: Record<string, any>) => {
  const { registeData, performanceData } = props
  const registeData2DAarray = React.useMemo(() => {
    const data = convertTo2DArray(registeData, 20)
    return data
  }, [registeData])
  const performanceDataData2DAarray = React.useMemo(() => {
    const data = convertTo2DArray(performanceData, 6)
    return data
  }, [performanceData])
  const [currentType, setCurrentType] = useState<string>('Register')
  const changePage = (page: number, type: string, pageSize: number) => {}
  const changeCurrentType = (e: any) => {
    setCurrentType(e)
  }
  return (
    <div className={OneUtilCardStyles.TabsCompoents}>
      <Tabs defaultActiveKey={currentType} style={{ width: '100%' }} onChange={changeCurrentType}>
        <TabPane
          tab={
            <span>
              <RegisterSvg type={currentType} />
              寄存器
            </span>
          }
          key='Register'
        >
          {registeData2DAarray.length > 0 && <RegisterDetail registeData={registeData2DAarray[0]} />}
        </TabPane>

        <TabPane
          tab={
            <span>
              <PerformanceSvg type={currentType} />
              性能
            </span>
          }
          key='PerformanceSvg'
        >
          {performanceDataData2DAarray.length > 0 && <PerformanceDetail performanceData={performanceDataData2DAarray[0]} />}
        </TabPane>
      </Tabs>
      <div className={OneUtilCardStyles.TabsCompoentsPageFooter}>
        <NoShowSizeChangerPagina length={10} num={10} getParams={changePage} pagenums={1} />
      </div>
    </div>
  )
}
function TaskDetailModalMemo(props: any) {
  const { value, item, msg_index, create_time } = props
  const { register, performance } = value
  const [isOpen, setOpen] = useState(true)

  return (
    <div className={OneUtilCardStyles.oneUnitCard} style={{ marginBottom: '16px' }}>
      <div className={styles.concent_layout} style={{ backgroundColor: '#fff', border: 'none' }}>
        <div className={styles.concent_layoutLeft}>
          <div className={styles.pc}>
            <span className={styles.detailLeft} style={{ paddingRight: '10px' }}>
              缺陷结果 :{' '}
            </span>{' '}
            <span> {CrashInfoMapLog[+item]}</span>
          </div>
          <div className={styles.pc}>
            <span className={styles.detailLeft} style={{ paddingRight: '10px' }}>
              用例编号 :{' '}
            </span>{' '}
            <span> {msg_index} </span>
          </div>
          <div className={styles.pc}>
            <span className={styles.detailLeft} style={{ paddingRight: '24px' }}>
              文件名 :{' '}
            </span>{' '}
            <Tooltip title={value.crash_type?.payload.fileName} placement='bottom' overlayClassName={styles.overlay}>
              <span className={OneUtilCardStyles.fileName}> {value.crash_type?.payload.fileName} </span>
            </Tooltip>
          </div>

          <div className={styles.pc}>
            <span style={{ paddingRight: '37px' }} className={styles.detailLeft}>
              行号 :{' '}
            </span>{' '}
            <span> {value.crash_type?.payload.lines} </span>
          </div>
        </div>
        <div className={styles.concent_layoutRight}>
          <div className={styles.pc}>
            <span className={styles.detailLeft} style={{ paddingRight: '18px' }}>
              PC指针 :{' '}
            </span>
            <div className={styles.pcRight}>
              {value.crash_type?.payload?.PC.map((item: string) => {
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
              函数名 :{' '}
            </span>{' '}
            <span> {value.crash_type?.payload.funcName} </span>
          </div>
          <div className={styles.pc}>
            <span style={{ paddingRight: '10px' }} className={styles.detailLeft}>
              发现时间 :{' '}
            </span>{' '}
            <span> {`${getTime(create_time)}`} </span>
          </div>
        </div>
      </div>
      <div className={isOpen ? OneUtilCardStyles.cardOpen : OneUtilCardStyles.cardClose}>
        <TabsComponetns registeData={register} performanceData={performance} />
      </div>
      <div
        role='time'
        className={OneUtilCardStyles.footer}
        onClick={() => {
          setOpen(!isOpen)
        }}
      >
        {isOpen ? <Close /> : <Open />}
      </div>
    </div>
  )
}
const TaskDetailModal = React.memo(TaskDetailModalMemo)
export default TaskDetailModal
