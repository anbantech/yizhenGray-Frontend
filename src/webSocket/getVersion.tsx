import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

// 读取本地存储的版本号
const localVersion = 'v1.2.009.20231013'

function useGetVersionHook() {
  const timerRef = useRef<any>()
  const [showModal, setShowModal] = useState(false)
  const showModalMemo = React.useMemo(() => showModal, [showModal])
  const versionFn = async () => {
    const versionData = (await axios.get('/version.json')).data
    const { version } = versionData
    // 比较版本号
    if (version === localVersion) {
      return setShowModal(false)
    }
    setShowModal(true)
  }

  useEffect(() => {
    if (!showModalMemo) {
      timerRef.current = setInterval(versionFn, 5000)
    }
    return () => {
      clearInterval(timerRef.current)
    }
  }, [showModalMemo])
  return [showModal]
}

export { useGetVersionHook }
