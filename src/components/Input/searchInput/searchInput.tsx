import Input from 'antd/lib/input'
import React, { useEffect, useState } from 'react'
import clearImage from 'Src/asstes/image/Delete.svg'
import searchImage from 'Src/asstes/image/search.svg'
import UseThrorrleWait from 'Src/until/Hooks/useDebounceWait'
import styles from './searchInput.less'

interface searchTypes {
  placeholder: string
  inputValue: string | number
  onChangeValue: (value: string) => void
}

type isShowType = string | number
type fnType = (value: string) => void
interface isShowProps<T, F> {
  inputValue: T
  onChangeValue: F
}
// 输入框左边图标
const Search = () => {
  return (
    <>
      <img style={{ width: '18px', height: '18px' }} src={searchImage} alt='clear' />
    </>
  )
}

// 输入框右边图标 根据输入文字进行显示隐藏,点击可以清除文字
const ClearSuffix = React.memo(function ClearSuffix(isShowProp: isShowProps<isShowType, fnType>) {
  const { inputValue, onChangeValue } = isShowProp
  const [isShow, setIsShow] = useState(false)
  const clearInputValue = () => {
    setIsShow(false)
    onChangeValue('')
  }
  // 如果输入值,取消图标显示
  useEffect(() => {
    if (inputValue) {
      setIsShow(true)
    }
  }, [inputValue])
  return (
    <div className={styles.clearImage} tabIndex={0} role='button' onClick={clearInputValue}>
      <img className={isShow ? styles.clearImageConcent : styles.clearImageHidden} src={clearImage} alt='clear' />
    </div>
  )
})

function SearchInput(props: searchTypes) {
  const { placeholder, inputValue, onChangeValue } = props
  const changeValueFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    onChangeValue(value)
  }
  const { run } = UseThrorrleWait(changeValueFn, { wait: 200 })
  return (
    <div className={styles.searchInput}>
      <Input
        value={inputValue}
        prefix={<Search />}
        suffix={<ClearSuffix inputValue={inputValue} onChangeValue={onChangeValue} />}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          run(e)
        }}
      />
    </div>
  )
}

export default SearchInput
