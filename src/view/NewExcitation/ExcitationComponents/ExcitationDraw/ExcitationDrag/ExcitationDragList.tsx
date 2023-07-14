import * as React from 'react'
import SearchInput from 'Src/components/Input/searchInput/searchInput'
import styles from 'Src/layout/LeftNav/leftNav.less'
import ExcitationDrag from './ExcitationDrag'
import ExcitationDragHeader from './ExcitationDragHeader'
import StyleSheet from '../excitationDraw.less'
import BtnCompoents from './ExcitationDragHeaderBtn'

// const Line = () => {
//   return <div className={StyleSheet.line} />
// }

function ExcitationList() {
  const [isClose, setClose] = React.useState(true)
  return (
    <div className={isClose ? StyleSheet.rightList : StyleSheet.rightListClose}>
      {isClose && (
        <>
          <BtnCompoents />
          <SearchInput className={StyleSheet.ExictationInput} placeholder='根据名称搜索激励' onChangeValue={() => {}} />
          <ExcitationDragHeader />
          {/* 列表拖拽 */}
          <ExcitationDrag />
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
    </div>
  )
}

export default ExcitationList