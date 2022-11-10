import Input from 'antd/lib/input'
import React from 'react'
import clearImage from 'Src/asstes/image/Delete.svg'
import searchImage from 'Src/asstes/image/search.svg'
import styles from './searchInput.less'

interface searchTypes {
  placeholder: string
}

type isShowType = boolean

interface isShowProps<T> {
  isShow: T
}
// 输入框左边图标
const Search = () => {
  return (
    <>
      <img style={{ width: '18px', height: '18px' }} src={searchImage} alt='clear' />
    </>
  )
}

function SearchInput(props: searchTypes) {
  const { placeholder } = props
  // 输入框右边图标 根据输入文字进行显示隐藏,点击可以清除文字
  const ClearSuffix = (isShowProp: isShowProps<isShowType>) => {
    const { isShow } = isShowProp
    return (
      <div className={styles.clearImage}>
        <img className={isShow ? styles.clearImageConcent : styles.clearImageHidden} src={clearImage} alt='clear' />
      </div>
    )
  }

  return (
    <div className={styles.searchInput}>
      <Input prefix={<Search />} suffix={<ClearSuffix isShow />} placeholder={placeholder} />
    </div>
  )
}

export default SearchInput
