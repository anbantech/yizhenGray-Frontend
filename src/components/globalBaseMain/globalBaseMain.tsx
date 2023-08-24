import { message } from 'antd'
import * as React from 'react'
import { useHistory, useLocation } from 'react-router'
import { deleteneExcitaionList, deleteneExcitaionListMore, lookUpDependencePeripheral, lookUpDependenceUnit } from 'Src/services/api/excitationApi'
import useMenu from 'Src/util/Hooks/useMenu'
import { throwErrorMessage } from 'Src/util/message'
import styles from 'Src/view/Project/task/createTask/newCreateTask.less'
import CommonModle from '../Modal/projectMoadl/CommonModle'
import LookUpDependence from '../Modal/taskModal/lookUpDependence'

interface ContextProps {
  type?: any
  isFixForm: boolean
  name: string
  info?: any
  propsDatas?: any
  lookDetail: boolean
  fromPathName: string
  from: string
  projectInfo: any
  taskInfo: any
  fromDataTask: any
}

const routerMap = {
  one: '修改端口',
  two: '修改激励单元',
  three: '修改激励嵌套',
  four: '修改交互'
}
const deleteMap = {
  one: '端口删除',
  two: '激励单元删除',
  three: '激励嵌套删除',
  four: '交互删除'
}
const dependceMap = {
  two: '激励单元关联信息',
  three: '激励嵌套关联信息',
  four: '交互关联信息'
}

export const GlobalContexted = React.createContext<ContextProps>(null!)
function GlobalBaseMain(props: any) {
  const { name, type, isFixForm, info, Data, lookDetail, fromPathName, fromDataTask, from, projectInfo, taskInfo } = props
  const history = useHistory()
  const pathname = useLocation()?.pathname.split('/')[1]
  // 存储关联任务信息
  const [spinning, setSpinning] = React.useState(false)
  const chioceBtnLoading = (val: boolean) => {
    setSpinning(val)
  }
  const [dependenceInfo, setDependenceInfo] = React.useState({ id: '', name: '', parents: [] })
  const [visibility, setVisibility] = React.useState(false)
  // 查看关联任务
  const { deleteVisibility, CommonModleClose } = useMenu()
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
        isFixForm: true,
        fromPathName: `/${pathname}/Detail`,
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

  const deleteProjectRight = React.useCallback(async () => {
    chioceBtnLoading(true)
    let res
    try {
      if (type === 'one') {
        res = await deleteneExcitaionList(`${info.id}`)
      } else {
        res = await deleteneExcitaionListMore(`${info.id}`)
      }

      if (res.data) {
        if (res.data.success_list.length > 0) {
          message.success(`${deleteMap[type as keyof typeof deleteMap]}成功`)
        } else {
          message.error(res.data.fail_list[0])
        }
        CommonModleClose(false)
        chioceBtnLoading(false)
        history.push({
          pathname: `/${pathname}`
        })
      }
    } catch (error) {
      CommonModleClose(false)
      chioceBtnLoading(false)
      throwErrorMessage(error, { 1009: `${deleteMap[type as keyof typeof deleteMap]}失败` })
    }
  }, [CommonModleClose, history, info?.id, pathname, type])
  return (
    <GlobalContexted.Provider
      value={{ type, isFixForm, lookDetail, fromDataTask, fromPathName, from, projectInfo, taskInfo, name, info, propsDatas: Data }}
    >
      <div className={styles.taskMain}>
        <div className={styles.taskMain_header}>
          <span className={styles.taskMain_title}>{name}</span>
          {isFixForm && lookDetail && (
            <div className={styles.operationHeader}>
              <span
                className={styles.upDataBtn}
                role='time'
                onClick={() => {
                  CommonModleClose(true)
                }}
              >
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
      {deleteVisibility ? (
        <CommonModle
          IsModalVisible={deleteVisibility}
          deleteProjectRight={() => {
            deleteProjectRight()
          }}
          CommonModleClose={CommonModleClose}
          name={deleteMap[type as keyof typeof deleteMap]}
          ing='删除中'
          spinning={spinning}
          concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
        />
      ) : null}
      <LookUpDependence
        visibility={visibility as boolean}
        name={dependceMap[type as keyof typeof dependceMap]}
        data={dependenceInfo}
        choiceModal={chioceModalStatus}
        width='760px'
      />
    </GlobalContexted.Provider>
  )
}

export default GlobalBaseMain
