import { useRequest } from 'ahooks-v2'
import { message, Radio } from 'antd'
import * as React from 'react'
import LowCodeInput from 'Src/components/Input/LowCodeInput/LowCodeInput'
import { useLeftModelDetailsStore } from '../../Store/ModelStore'
import StyleSheet from './modelLeft.less'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'

function ModelingInputMemo() {
  const { timerAndHandData, tabs, updateTagOrKeyWord, getList } = LeftListStore()
  const cusomMadePeripheralListParams = useLeftModelDetailsStore(state => state.cusomMadePeripheralListParams)
  const ref = React.useRef<any>()
  const whichOneParams = React.useMemo(() => {
    return ['customMadePeripheral', 'boardPeripheral'].includes(tabs) ? {} : timerAndHandData
  }, [tabs, timerAndHandData])

  const setKeyWords = React.useCallback(
    async (val: string) => {
      updateTagOrKeyWord(val, 'key_word', ['customMadePeripheral', 'boardPeripheral'].includes(tabs))
      await getList(tabs)
    },
    [getList, tabs, updateTagOrKeyWord]
  )

  const updateParams = React.useCallback(
    async (val: string) => {
      updateTagOrKeyWord(val, 'tag', ['customMadePeripheral', 'boardPeripheral'].includes(tabs))
      // todo
    },
    [tabs, updateTagOrKeyWord]
  )

  const { run } = useRequest(updateParams, {
    debounceInterval: 20,
    manual: true,
    onError: error => {
      message.error(error.message)
    }
  })

  const showTabs = React.useMemo(() => {
    const result = ['customMadePeripheral', 'boardLevelPeripherals'].includes(tabs) && cusomMadePeripheralListParams.key_word
    return result
  }, [tabs, cusomMadePeripheralListParams])

  return (
    <div className={StyleSheet.ModelingBodyInput}>
      <LowCodeInput className={StyleSheet.ModelingInput} ref={ref} placeholder='根据名称搜索' setKeyWords={setKeyWords} params={whichOneParams} />
      {showTabs && (
        <>
          <Radio.Group
            defaultValue={cusomMadePeripheralListParams.tag}
            className={StyleSheet.radioGroup}
            onChange={e => {
              run(e.target.value)
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
          </Radio.Group>
        </>
      )}
    </div>
  )
}

const ModelingInput = React.memo(ModelingInputMemo)
export default ModelingInput
