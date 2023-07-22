import * as React from 'react'

import SearchInput from 'Src/components/Input/searchInput/searchInput'
import styles from 'Src/layout/LeftNav/leftNav.less'
import { excitationListFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import { RightDragListStore, useRequestStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import ExcitationDragHeader from './ExcitationDragHeader'
import ExcitationDrag from './ExcitationDrag'
import StyleSheet from '../excitationDraw.less'
import BtnCompoents from './ExcitationDragHeaderBtn'

// import NewExcitationMoadl from '../../Agreement/createModal'

function ExcitationList() {
  const layoutRef = React.useRef<any>()
  const [isClose, setClose] = React.useState(true)
  const { params, setKeyWord, setHasMore } = useRequestStore()
  const { setRightList, DragList } = RightDragListStore()
  // const [visibility, setVisibility] = React.useState(true)

  const getExcitationList = React.useCallback(
    async value => {
      try {
        const result = await excitationListFn(value)
        if (result.data) {
          const newList = [...result.data.results]
          if (newList.length === 0) {
            // InstancesDetail.setInstance(false)
            setHasMore(false)
            return false
          }

          if (newList.length === result.data.total) {
            setHasMore(false)
          }
          setRightList([...newList])
          // InstancesDetail.setInstance(true)
        }
      } catch (error) {
        throwErrorMessage(error, { 1004: '请求资源未找到' })
      }
    },
    [setHasMore, setRightList]
  )
  React.useEffect(() => {
    getExcitationList(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  // 动态设置虚拟列表高度
  const [height, setHeight] = React.useState(700)
  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        let num = 700
        if (height >= 1940 && height >= 2300) {
          num = height * 0.8
        } else if (height >= 1400 && height <= 1940) {
          num = height * 0.5
        } else {
          num = height * 0.2
        }
        setHeight(height - Math.ceil(num as number))
      }
    })

    if (layoutRef.current) {
      resizeObserver.observe(layoutRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])
  return (
    <div className={isClose ? StyleSheet.rightList : StyleSheet.rightListClose} ref={layoutRef}>
      {isClose && (
        <>
          <BtnCompoents />
          <SearchInput className={StyleSheet.ExictationInput} placeholder='根据名称搜索激励' onChangeValue={() => {}} />
          {DragList?.length > 0 && <ExcitationDragHeader />}
          {/* 列表拖拽 */}
          <ExcitationDrag height={height} />
        </>
      )}
      {isClose ? (
        <div
          role='time'
          className={styles.closePositionimgRgiht}
          onClick={() => {
            setClose(!isClose)
          }}
        />
      ) : (
        <div
          role='time'
          className={styles.openPositionimgRgiht}
          onClick={() => {
            setClose(!isClose)
          }}
        />
      )}

      {/* <NewExcitationMoadl visibility={visibility} /> */}
    </div>
  )
}

export default ExcitationList
