import { Radio } from 'antd'
import * as React from 'react'
import LowCodeInput from 'Src/components/Input/LowCodeInput/LowCodeInput'
import StyleSheet from './modelLeft.less'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'

function ModelingInputMemo() {
  const { timerAndHandData, tabs, updateTagOrKeyWord, getList, updateTreeNodeData } = LeftListStore()
  const customAndDefaultPeripheral = LeftListStore(state => state.customAndDefaultPeripheral)
  const ref = React.useRef<any>()
  const whichOneParams = React.useMemo(() => {
    return ['customPeripheral', 'boardPeripheral'].includes(tabs) ? customAndDefaultPeripheral : timerAndHandData
  }, [customAndDefaultPeripheral, tabs, timerAndHandData])

  const setKeyWords = React.useCallback(
    async (val: string) => {
      if (val === '') {
        updateTreeNodeData([])
        updateTagOrKeyWord('0', 'tag', ['customPeripheral', 'boardPeripheral'].includes(tabs))
      }
      updateTagOrKeyWord(val, 'key_word', ['customPeripheral', 'boardPeripheral'].includes(tabs))
      await getList(tabs)
    },
    [getList, tabs, updateTagOrKeyWord, updateTreeNodeData]
  )

  const updateParams = React.useCallback(
    async (val: string) => {
      updateTagOrKeyWord(val, 'tag', ['customPeripheral', 'boardPeripheral'].includes(tabs))
      await getList(tabs)
    },
    [getList, tabs, updateTagOrKeyWord]
  )

  const showTabs = React.useMemo(() => {
    const result = ['customPeripheral', 'boardPeripheral'].includes(tabs) && customAndDefaultPeripheral.key_word
    return result
  }, [tabs, customAndDefaultPeripheral])

  return (
    <div className={StyleSheet.ModelingBodyInput}>
      <LowCodeInput className={StyleSheet.ModelingInput} ref={ref} placeholder='根据名称搜索' setKeyWords={setKeyWords} params={whichOneParams} />
      {showTabs && (
        <>
          <Radio.Group
            defaultValue={customAndDefaultPeripheral.tag}
            className={StyleSheet.radioGroup}
            onChange={e => {
              updateParams(e.target.value)
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
