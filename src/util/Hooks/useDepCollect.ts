import { useRef, useState } from 'react'

// 参数:bassData:默认数据
// 功能:在一定时间内,收集用户点击的信息,然后返回一个对象
interface Info {
  [index: string]: string
}
function useDepCollect(baseData: any) {
  // 返回收集信息的存储
  const [depData, setDepData] = useState(baseData)
  // 定义定时器
  const timerRef = useRef<any>()
  // 判断时间是否超过
  const [isClose, setIsClose] = useState<boolean>(false)

  const depCollection = (isCollection: boolean, info: Info, time: number) => {
    setIsClose(false)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIsClose(true)
    }, time)
    if (isCollection) {
      setDepData({ ...depData, ...info })
    }
  }
  return [isClose, depCollection, depData]
}

export default useDepCollect
