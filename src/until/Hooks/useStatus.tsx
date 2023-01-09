import { useState, useRef } from 'react'
import useIsSameObject from './useDfs'

function useStatus(initData: any) {
  const statusRef = useRef(initData)
  const [state, setStatusRef] = useState(statusRef.current)
  const setStatus = (type: string, status: boolean) => {
    const objStatus = statusRef.current
    const baseObjStatus = { [type]: status }
    const objStatusCopy = { ...objStatus, ...baseObjStatus }
    statusRef.current = objStatusCopy
    setStatusRef(statusRef.current)
  }
  console.log(statusRef, state)
  return [setStatus]
}

useStatus.displayName = 'useStatus'

export default useStatus
