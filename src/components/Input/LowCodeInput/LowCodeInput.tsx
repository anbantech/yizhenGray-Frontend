import Input from 'antd/lib/input'
import React, { useImperativeHandle, useMemo } from 'react'
import { BaseList } from 'Src/view/Modeling/Store/ModeleLeftListStore/LeftListStoreType'
import clearImage from 'Image/Delete.svg'
import searchImage from 'Image/search.svg'
import styles from '../searchInput/searchInput.less'

interface searchTypes {
  placeholder: string
  className: string
  params: BaseList | any
  setKeyWords: (value: string) => void
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
const ClearSuffix = React.memo(function ClearSuffix(isShowProp: {
  length: number | undefined
  onChangeValue: (value: string, type?: string) => void
}) {
  const { length, onChangeValue } = isShowProp
  const clearInputValue = () => {
    onChangeValue('')
  }
  const changeImageShow = useMemo(() => {
    return length ? length > 0 : false
  }, [length])

  return (
    <div className={styles.clearImage} tabIndex={0} role='button' onClick={clearInputValue}>
      <img className={changeImageShow ? styles.clearImageConcent : styles.clearImageHidden} src={clearImage} alt='clear' />
    </div>
  )
})

const LowCodeInputMemo = React.forwardRef((props: searchTypes, myRef) => {
  const { placeholder, className, setKeyWords, params } = props

  const run = (value: string) => {
    setKeyWords(value)
  }
  useImperativeHandle(myRef, () => ({
    save: () => {},
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))
  return (
    <div className={className}>
      <Input
        onChange={e => run(e.target.value)}
        spellCheck='false'
        value={params.key_word}
        prefix={<Search />}
        suffix={<ClearSuffix length={params.key_word?.length} onChangeValue={setKeyWords} />}
        placeholder={placeholder}
      />
    </div>
  )
})

LowCodeInputMemo.displayName = 'LowCodeInputMemo'

const LowCodeInput = React.memo(LowCodeInputMemo)

export default LowCodeInput
