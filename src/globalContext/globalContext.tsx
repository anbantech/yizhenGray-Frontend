import React, { createContext, useCallback, useEffect, useReducer } from 'react'
import { getUserInfo } from 'Src/services/api/loginApi'
import { throwErrorMessage } from 'Src/until/message'
import { getHiddenPropertyName } from 'Src/until/baseFn'
import { useBindEventListener } from 'Src/until/Hooks/useBindEventListener'

interface UserInfo {
  id: number
  username: string
  roles: string[]
}

const globalConfig = {
  config: {
    connectionMethodList: [] as stringConfigType[],
    bitRateList: [] as stringConfigType[],
    flgasList: [] as stringConfigType[],
    errorHandlerTypes: [] as stringConfigType[],
    engines: [] as stringConfigType[],
    baudRateList: [] as numberConfigType[],
    parserSelectors: [] as stringConfigType[],
    updatingDatabase: false,
    relationship: [] as stringConfigType[],
    member: [] as stringConfigType[],
    condition: [] as stringConfigType[],
    codeMessage: [] as stringConfigType[],
    connectionListInfo: [] as stringConfigType[],
    abirtate: [] as stringConfigType[],
    tc_flags: [] as stringConfigType[],
    dbitrate: [] as stringConfigType[],
    scanList: [] as string[],
    count: 0,
    userInfo: {} as UserInfo
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  globalDispatch: (action: GlobalReducerAction) => {}
}
type GlobalConfig = typeof globalConfig
type stringConfigType = { label: string; value: string }
type numberConfigType = { label: string; value: string }

interface SetUpdatingDatabase {
  type: 'setUpdatingDatabase'
  value: boolean
}

interface SetAll {
  type: 'all'
  value: GlobalConfig['config']
}
interface loopUpdateErrorMessage {
  type: 'loopUpdateErrorMessage'
  value: number
}

interface setUserInfo {
  type: 'setUserInfo'
  value: UserInfo
}

type GlobalReducerAction = SetAll | SetUpdatingDatabase | loopUpdateErrorMessage | setUserInfo

const globalConfigReducer = (state: GlobalConfig, action: GlobalReducerAction) => {
  const configCopy = state.config
  if (action.type === 'all') {
    return { ...state, config: action.value }
  }
  if (action.type === 'setUpdatingDatabase') {
    configCopy.updatingDatabase = action.value
    return { ...state, config: configCopy }
  }
  if (action.type === 'loopUpdateErrorMessage') {
    configCopy.count = action.value
    return { ...state, count: configCopy }
  }
  if (action.type === 'setUserInfo') {
    configCopy.userInfo = action.value
    return { ...state, config: configCopy }
  }
  return state
}

export const GlobalContext = createContext(globalConfig)

const GlobalContextProvider: React.FC = ({ children }) => {
  const [{ config }, globalDispatch] = useReducer(globalConfigReducer, globalConfig)
  // const [gc, setgc] = useState(globalConfig)

  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await getUserInfo()
      globalDispatch({ type: 'setUserInfo', value: res.data })
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [])

  useEffect(() => {
    fetchUserInfo()
  }, [fetchUserInfo])

  const checkUserAndToken = () => {
    const ifHidden = (document as any)[getHiddenPropertyName().property] as boolean
    if (!ifHidden) {
      const globalUserId = config.userInfo.id
      const currentUserId = localStorage.getItem('userId') && +(localStorage.getItem('userId') as string)
      if (globalUserId !== currentUserId) {
        window.location.href = '/'
      }
    }
  }

  useBindEventListener(document, getHiddenPropertyName().eventName, checkUserAndToken)

  return <GlobalContext.Provider value={{ config, globalDispatch }}>{children}</GlobalContext.Provider>
}

export default GlobalContextProvider
