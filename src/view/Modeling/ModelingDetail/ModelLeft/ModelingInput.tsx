import { useDebounce } from 'ahooks-v2'
import * as React from 'react'
import SearchInput from 'Src/components/Input/searchInput/searchInput'
import StyleSheet from './modelLeft.less'

function ModelingInput() {
  const updateParams = (val: string) => {
    console.log(val)
    return val

    // todo 搜索关键字查询接口
  }

  useDebounce(updateParams, { wait: 500 })
  return (
    <div className={StyleSheet.ModelingBodyInput}>
      <SearchInput className={StyleSheet.ModelingInput} placeholder='根据名称搜索' onChangeValue={updateParams} />
    </div>
  )
}

export default ModelingInput
