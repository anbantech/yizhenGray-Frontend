import * as React from 'react'
import { Input, Radio } from 'antd'
import { memo } from 'react'
import ToolTip from 'Src/components/ToopTip/toolTip'
import DropBoxWrapper from '../DragSFC/dropBoxWrapper'
import styles from './templateResult.less'
import { ItemTypes } from '../DragSFC/ItemTypes'

type Action = {
  type: any
  item?: any
  index: string
  config?: any
}

interface TreeNodeLeafProps {
  tdListDiapatch: React.Dispatch<Action>
  id: string
  ptType: string | null
  ptName: string
  ptDesc: string
  ptValue: string | null
  [key: string]: any
  rules: any
}

function countStringLength(text: string) {
  if (!text) return 0
  const re = /[\u4E00-\u9FA5]/g
  let zhCharacter = 0
  while (re.exec(text) !== null) {
    zhCharacter++
  }
  return text.length + zhCharacter
}

const TreeNodeLeaf: React.FC<TreeNodeLeafProps> = ({ id, ptName, ptType, ptDesc, ptValue, tdListDiapatch, readonly, rules }) => {
  return (
    <>
      {!readonly ? (
        <DropBoxWrapper data-key={id} uuid={id} greedy={false} type={ItemTypes.LEAF} style={{ height: '100%' }}>
          <div className={styles.tree_title_block_leaf}>
            <div className={styles.tree_title}>
              <span style={{ lineHeight: '32px' }} className={rules.required ? styles.tree_required : undefined}>
                {ptName}
              </span>
              {ptType === 'bool' ? (
                <Radio.Group
                  className={styles.tree_radio}
                  onChange={e => tdListDiapatch({ type: 'configNode', index: id, config: { attr: 'ptValue', value: e.target.value } })}
                  value={ptValue || null}
                >
                  <Radio value='true'>TRUE</Radio>
                  <Radio value='false'>FALSE</Radio>
                </Radio.Group>
              ) : (
                <Input
                  className={styles.tree_input}
                  placeholder={ptDesc}
                  value={ptValue || ''}
                  onChange={e => tdListDiapatch({ type: 'configNode', index: id, config: { attr: 'ptValue', value: e.target.value } })}
                />
              )}
              <span className={styles.tree_inputted_value}>{ptValue}</span>
            </div>
          </div>
        </DropBoxWrapper>
      ) : (
        <div className={styles.tree_title_block_leaf_readonly}>
          <div className={styles.tree_title}>
            <span style={{ lineHeight: '32px' }} className={rules.required ? styles.tree_required : undefined}>
              {ptName}
            </span>
            {ptValue && countStringLength(ptValue) > 35 ? (
              <ToolTip tipTitle={ptValue as string} customTipWrapperClass={styles.tooltip_wrapper}>
                <span className={styles.tree_inputted_value_readonly}>{ptValue}</span>
              </ToolTip>
            ) : (
              <span className={styles.tree_inputted_value_readonly}>{ptValue}</span>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default memo(TreeNodeLeaf)
