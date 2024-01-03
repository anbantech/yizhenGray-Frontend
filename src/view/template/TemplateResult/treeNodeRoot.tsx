import * as React from 'react'
import { memo } from 'react'
import deleteIcon from 'Image/Template/delete1.svg'
import closeIcon from 'Image/Template/close.svg'
import openIcon from 'Image/Template/open.svg'
import { QuestionCircleOutlined } from '@ant-design/icons'
import ToolTip from 'Src/components/ToopTip/toolTip'
import DropBoxWrapper from '../DragSFC/dropBoxWrapper'
import styles from './templateResult.less'
import { BlockTips, ItemTypes } from '../DragSFC/ItemTypes'

type Action = {
  type: any
  item?: any
  index: string
  config?: any
}

interface TreeNodeRootProps {
  id: string
  ptName: string
  opening: boolean
  tdListDiapatch: React.Dispatch<Action>
  [key: string]: any
}

function filterAcceptTypes(ptName: string, childrenLength: number) {
  switch (ptName.toUpperCase()) {
    case 'BLOCK':
      return ItemTypes.BLOCK
    case 'LIST':
      return ItemTypes.LIST
    case 'BIT_STRING':
      return ItemTypes.BIT_STRING
    case 'JSON':
      if (childrenLength % 2 === 0) {
        return ItemTypes.JSON_VALUE
      }
      return ItemTypes.JSON_KEY
    default:
      return ItemTypes.LEAF
  }
}

function filterBlockTips(ptName: string) {
  switch (ptName.toUpperCase()) {
    case 'BLOCK':
      return BlockTips.BLOCK
    case 'LIST':
      return BlockTips.LIST
    case 'BIT_STRING':
      return BlockTips.BIT_STRING
    case 'JSON':
      return BlockTips.JSON
    default:
      return ''
  }
}

const TreeNodeRoot: React.FC<TreeNodeRootProps> = ({ id, ptName, opening, tdListDiapatch, children, readonly }) => {
  return (
    <>
      {!readonly ? (
        <DropBoxWrapper
          key={id + React.Children.count(children)}
          uuid={id}
          greedy={false}
          data-key={id}
          afterDrop={(item, index) => tdListDiapatch({ type: 'injectNode', item, index })}
          type={filterAcceptTypes(ptName, React.Children.count(children))}
        >
          <div className={styles.tree_title_block_root}>
            <div className={styles.tree_title}>
              <img
                className={styles.collapse}
                src={opening ? closeIcon : openIcon}
                alt='collapse'
                onClick={() => tdListDiapatch({ type: 'configNode', index: id, config: { attr: 'opening', value: !opening } })}
              />
              <span>
                {ptName}
                {filterBlockTips(ptName) && (
                  <ToolTip tipTitle={ptName} tipMessage={filterBlockTips(ptName)} customWrapperClass={styles.tooltip_wrapper_tip}>
                    <span style={{ marginLeft: '25px' }}>
                      <QuestionCircleOutlined />
                    </span>
                  </ToolTip>
                )}
              </span>
              <img src={deleteIcon} alt='delete' onClick={() => tdListDiapatch({ type: 'deleteNode', index: id })} />
            </div>
            {opening && children}
          </div>
        </DropBoxWrapper>
      ) : (
        <div className={styles.tree_title_block_root}>
          <div className={styles.tree_title}>
            <img
              className={styles.collapse}
              src={opening ? closeIcon : openIcon}
              alt='collapse'
              onClick={() => tdListDiapatch({ type: 'configNode', index: id, config: { attr: 'opening', value: !opening } })}
            />
            <span>
              {ptName}
              {filterBlockTips(ptName) && (
                <ToolTip tipTitle={ptName} tipMessage={filterBlockTips(ptName)} customWrapperClass={styles.tooltip_wrapper_tip}>
                  <span style={{ marginLeft: '25px' }}>
                    <QuestionCircleOutlined />
                  </span>
                </ToolTip>
              )}
            </span>
          </div>
          {opening && children}
        </div>
      )}
    </>
  )
}

export default memo(TreeNodeRoot, (prevProps, nextProps) => {
  let equal = true
  if (
    prevProps.id !== nextProps.id ||
    prevProps.ptName !== nextProps.ptName ||
    prevProps.opening !== nextProps.opening ||
    prevProps.tdListDiapatch !== nextProps.tdListDiapatch ||
    prevProps.children !== nextProps.children
  ) {
    equal = false
  }

  return equal
})
