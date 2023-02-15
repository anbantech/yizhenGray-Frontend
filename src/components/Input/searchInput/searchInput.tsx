import Input from 'antd/lib/input'
import React, { useEffect, useImperativeHandle, useMemo } from 'react'
import clearImage from 'Image/Delete.svg'
import searchImage from 'Image/search.svg'
import useRequestRate from 'Src/util/Hooks/useRequestRate'
import styles from './searchInput.less'

interface searchTypes {
  placeholder: string
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
  const clearInputValue = () => {
    onChangeValue('')
  }

  const changeImageShow = useMemo(() => {
    return inputValue
  }, [inputValue])

  return (
    <div className={styles.clearImage} tabIndex={0} role='button' onClick={clearInputValue}>
      <img className={changeImageShow ? styles.clearImageConcent : styles.clearImageHidden} src={clearImage} alt='clear' />
    </div>
  )
})

const SearchInput = React.forwardRef((props: searchTypes, myRef) => {
  const { placeholder, onChangeValue } = props
  const changeValueFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    onChangeValue(value)
  }

  const [nowValue, isCancel, controlRate] = useRequestRate(changeValueFn, 300)
  useImperativeHandle(myRef, () => ({
    save: () => {
      return controlRate('')
    },
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))
  useEffect(() => {
    if (isCancel) {
      onChangeValue(nowValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowValue, isCancel])
  return (
    <div className={styles.searchInput}>
      <Input
        value={nowValue}
        prefix={<Search />}
        suffix={<ClearSuffix inputValue={nowValue} onChangeValue={controlRate} />}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          controlRate(e.target.value)
        }}
      />
    </div>
  )
})

SearchInput.displayName = 'SearchInput'
export default SearchInput
