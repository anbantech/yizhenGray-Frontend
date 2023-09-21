import Input from 'antd/lib/input'
import React, { useEffect, useImperativeHandle, useMemo } from 'react'
import clearImage from 'Image/Delete.svg'
import searchImage from 'Image/search.svg'
import useRequestRate from 'Src/util/Hooks/useRequestRate'
import styles from './searchInput.less'

interface searchTypes {
  placeholder: string
  className: string
  onChangeValue: (value: string, tyepe?: string) => void
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
  const { placeholder, className, onChangeValue } = props
  const changeValueFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    onChangeValue(value, 'key_word')
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
      onChangeValue(nowValue, 'key_word')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowValue, isCancel])
  return (
    <div className={className}>
      <Input
        spellCheck='false'
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
