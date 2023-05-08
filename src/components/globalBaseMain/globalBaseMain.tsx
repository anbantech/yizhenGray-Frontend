import * as React from 'react'
import { useHistory, useLocation } from 'react-router'
import { lookUpDependencePeripheral, lookUpDependenceUnit } from 'Src/services/api/excitationApi'
import styles from 'Src/view/Project/task/createTask/newCreateTask.less'
import LookUpDependence from '../Modal/taskModal/lookUpDependence'

interface ContextProps {
  type?: any
  isFixForm: boolean
  name: string
  info?: any
  propsDatas?: any
  lookDetail: boolean
}

const routerMap = {
  one: '外设修改',
  two: '激励单元修改',
  three: '激励嵌套修改',
  four: '交互修改'
}

export const GlobalContexted = React.createContext<ContextProps>(null!)
function GlobalBaseMain(props: any) {
  const { name, type, isFixForm, info, Data, lookDetail } = props
  const history = useHistory()
  const pathname = useLocation()?.pathname.split('/')[1]
  // 存储关联任务信息
  const [dependenceInfo, setDependenceInfo] = React.useState({ id: '', name: '', parents: [] })
  const [visibility, setVisibility] = React.useState(false)
  const chioceModalStatus = (val: boolean) => {
    setVisibility(val)
  }
  const jumpUpdateWeb = () => {
    history.push({
      pathname: `/${pathname}/update`,
      state: {
        info,
        type,
        lookDetail: false,
        isFixForm: false,
        name: routerMap[type as keyof typeof routerMap]
      }
    })
  }
  // 获取关联信息
  const getDependenceInfo = React.useCallback(
    async (val: number) => {
      let res
      if (type === 'one') {
        res = await lookUpDependencePeripheral(val)
      } else {
        res = await lookUpDependenceUnit(val)
      }
      if (res.data) {
        setDependenceInfo(res.data)
      }
      chioceModalStatus(true)
    },
    [type]
  )
  return (
    <GlobalContexted.Provider value={{ type, isFixForm, lookDetail, name, info, propsDatas: Data }}>
      <div className={styles.taskMain}>
        <div className={styles.taskMain_header}>
          <span className={styles.taskMain_title}>{name}</span>
          {isFixForm && (
            <div className={styles.operationHeader}>
              <span className={styles.upDataBtn} role='time' onClick={() => {}}>
                删除
              </span>
              <span
                className={styles.lookUpInfo}
                role='time'
                onClick={() => {
                  getDependenceInfo(info.id)
                }}
              >
                查看关联信息
              </span>
              <span
                className={styles.upDataBtn}
                role='time'
                onClick={() => {
                  jumpUpdateWeb()
                }}
              >
                修改
              </span>
            </div>
          )}
        </div>
        {props.children}
      </div>

      <LookUpDependence visibility={visibility as boolean} name='外设关联信息' data={dependenceInfo} choiceModal={chioceModalStatus} width='760px' />
    </GlobalContexted.Provider>
  )
}

export default GlobalBaseMain
