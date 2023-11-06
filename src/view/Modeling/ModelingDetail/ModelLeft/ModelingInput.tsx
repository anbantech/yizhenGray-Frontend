import { useRequest } from 'ahooks-v2'
import { message, Radio } from 'antd'
import * as React from 'react'
import { useLocation } from 'react-router'
import SearchInput from 'Src/components/Input/searchInput/searchInput'
import { useModelDetailsStore } from '../../Store/ModelStore'
import { LoactionState } from './ModelingLeftIndex'
import StyleSheet from './modelLeft.less'

function ModelingInput() {
  const tabs = useModelDetailsStore(state => state.tabs)
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const { setKeyWord, setTags, baseKeyWordAndTagsGetList, clearKeyWord } = useModelDetailsStore()
  const cusomMadePeripheralListParams = useModelDetailsStore(state => state.cusomMadePeripheralListParams)
  const ref = React.useRef<any>()
  const updateParams = React.useCallback(
    async (val: string, type: string) => {
      if (type === 'tags') {
        setTags(val)
      }
      if (type === 'key_words') {
        setKeyWord(val, tabs)
      }
      const res = await baseKeyWordAndTagsGetList(tabs, platformsIdmemo)
      return res
    },
    [setTags, setKeyWord, tabs, baseKeyWordAndTagsGetList, platformsIdmemo]
  )
  const { run } = useRequest(updateParams, {
    debounceInterval: 300,
    manual: true,
    onError: error => {
      message.error(error.message)
    }
  })
  React.useEffect(() => {
    if (ref.current && ref.current?.save) {
      clearKeyWord(ref.current.save)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const showTabs = React.useMemo(() => {
    const result = ['customMadePeripheral', 'boardLevelPeripherals'].includes(tabs) && cusomMadePeripheralListParams.key_word
    return result
  }, [tabs, cusomMadePeripheralListParams])

  return (
    <div className={StyleSheet.ModelingBodyInput}>
      <SearchInput
        className={StyleSheet.ModelingInput}
        ref={ref}
        placeholder='根据名称搜索'
        onChangeValue={value => {
          run(value, 'key_words')
        }}
      />
      {showTabs && (
        <>
          <Radio.Group
            defaultValue={cusomMadePeripheralListParams.tag}
            className={StyleSheet.radioGroup}
            onChange={e => {
              run(e.target.value, 'tags')
            }}
          >
            <Radio.Button className={StyleSheet.radio} style={{ width: '44px' }} value='0'>
              全部
            </Radio.Button>
            <Radio.Button className={StyleSheet.radio} value='1'>
              外设
            </Radio.Button>
            <Radio.Button className={StyleSheet.radio} value='2'>
              寄存器
            </Radio.Button>
            <Radio.Button className={StyleSheet.radio} value='3'>
              数据处理器
            </Radio.Button>
          </Radio.Group>
        </>
      )}
    </div>
  )
}

export default ModelingInput
