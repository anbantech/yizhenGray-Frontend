import * as React from 'react'
import { useState, useContext } from 'react'
import { Input } from 'antd'
import ptImage from 'Image/Template/pt.svg'
import blcokImage from 'Image/Template/block.svg'
import searchImage from 'Image/Template/search.svg'
import { FileTwoTone } from '@ant-design/icons'
import styles from './primitiveList.less'
import PrimitiveListItem from './primitiveListItem'
import { TemplateContext } from '../BaseTemplate/templateContext'
import { blockNameList } from '../DragSFC/ItemTypes'

interface PrimitiveListProps {
  [key: string]: any
}

interface PrimitiveAttrs {
  value_enum: string
  required: boolean
  name: string
  id: number
  type: string
  desc: string
  [key: string]: any
}

export interface Primitive {
  value_enum: string
  required: boolean
  name: string
  id: number
  type: string
  desc: string
  attrs?: PrimitiveAttrs[]
}

interface FilterOptions {
  filterBy: 'type'
  value: string
}

const PrimitiveList: React.FC<PrimitiveListProps> = () => {
  const { template } = useContext(TemplateContext)
  const [filterOpt, setFilterOpt] = useState<FilterOptions>({ filterBy: 'type', value: '' })

  const generatePtList = (originPtList: Primitive[], options?: FilterOptions) => {
    let blockList: Primitive[] = []
    let primitiveList: Primitive[] = []

    const sortByASC = (a: Primitive, b: Primitive) => {
      return a.type >= b.type ? 1 : -1
    }

    // 将原语和块分成两个列表渲染
    originPtList.forEach(pt => {
      if (blockNameList.has(pt.type)) {
        blockList.push(pt)
      } else {
        primitiveList.push(pt)
      }
    })

    // 根据 options 过滤数据
    if (options?.filterBy && options.value) {
      blockList = blockList.filter(block => {
        return !!(options.value && options.filterBy in block && block[options.filterBy].includes(options.value))
      })
    }
    if (options?.filterBy && options.value) {
      primitiveList = primitiveList.filter(pt => {
        return !!(options.value && options.filterBy in pt && pt[options.filterBy].includes(options.value))
      })
    }

    const rcPtList = (
      <div className={styles.ptList_group}>
        {blockList.length > 0 && (
          <div>
            <h1 className={styles.ptList_title}>块(Block)</h1>
            {blockList.sort(sortByASC).map(block => (
              <PrimitiveListItem key={block.id} prefixImage={blcokImage} pt={block} />
            ))}
          </div>
        )}
        {primitiveList.length > 0 && (
          <div>
            <h1 className={styles.ptList_title}>原语(Primitive)</h1>
            {primitiveList.sort(sortByASC).map(pt => (
              <PrimitiveListItem key={pt.id} prefixImage={ptImage} pt={pt} />
            ))}
          </div>
        )}
      </div>
    )

    return rcPtList
  }

  const searchIcon = React.useMemo(() => <img src={searchImage} alt='search' />, [])

  return (
    <div className={styles.ptList_wrapper}>
      <div className={styles.prList_title_wrapper}>
        <h5>配置项</h5>
        <a href='/help_template.pdf' target='_blank'>
          <FileTwoTone /> 说明文档
        </a>
      </div>
      <div className={styles.prList_hr} />
      <div className={styles.prList_input}>
        <Input
          placeholder='在搜索框中搜索原语或块'
          prefix={searchIcon}
          onChange={e => setFilterOpt({ filterBy: 'type', value: e.target.value })}
          className={styles.input_inner}
        />
      </div>
      {generatePtList(template.ptList, filterOpt)}
    </div>
  )
}

PrimitiveList.displayName = 'PrimitiveList'

export default PrimitiveList
