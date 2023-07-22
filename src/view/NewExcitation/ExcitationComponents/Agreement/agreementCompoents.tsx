import { Form, FormInstance, Input, Select, Tooltip } from 'antd'
import * as React from 'react'
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd'
import dragImg from 'Src/assets/drag/icon_drag.png'
import { ArgeementDropListStore } from '../../ExcitaionStore/ExcitaionStore'
import styles from './agreementCompoents.less'

type Type = { type: string; index: number }
export type Cmps = Type
interface DropCmps {
  index: number
  moveCardHandler: (dragIndex: number, hoverIndex: number) => void
  Item: any
}
const byteLength = [
  { label: '8', value: 'fixed_8' },
  { label: '16', value: 'fixed_16' },
  { label: '32', value: 'fixed_32' },
  { label: '64', value: 'fixed_64' }
]

const skipMap = [
  { label: '不变异', value: false },
  { label: '变异', value: true }
]

interface PriceValue {
  count?: number
}

interface PriceInputProps {
  value?: PriceValue
  onChange?: (value: PriceValue) => void
  onBlur?: (value: PriceValue) => void
}

interface PriceValue {
  count?: number
}

interface PriceInputProps {
  value?: PriceValue
  onChange?: (value: PriceValue) => void
}

const CountInput: React.FC<PriceInputProps> = ({ value = {}, onChange }) => {
  const [number, setNumber] = React.useState(10)
  const triggerChange = (changedValue: { count?: number }) => {
    onChange?.({ ...changedValue })
  }

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number.parseInt(e.target.value || '0', 10)
    if (Number.isNaN(number)) {
      return
    }
    if (!('number' in value)) {
      setNumber(newNumber)
    }
    triggerChange({ count: newNumber })
  }
  const onNumberBlur = (e: any) => {
    const newNumber = Number.parseInt(e.target.value || '10', 10)
    if (newNumber >= 255) {
      setNumber(255)
      onChange?.({ count: 255 })
    }

    if (newNumber === 0) {
      setNumber(1)
      onChange?.({ count: 1 })
    }
  }

  return (
    <Tooltip trigger={['focus']} title={number} placement='topLeft' overlayClassName='numeric-input'>
      <Input type='text' value={value.count || number} onChange={onNumberChange} onBlur={onNumberBlur} className={styles.IntArrayInput} />
    </Tooltip>
  )
}

const StringComponents = ({ index, Item, moveCardHandler }: DropCmps) => {
  // { type: 'string', name: '', skip: false, value: '' }

  const DropList = ArgeementDropListStore(state => state.DropList)
  const ref = React.useRef<HTMLDivElement>(null)
  const [isDragItem, setCanDrag] = React.useState(true)
  const onToggleForbidDrag = React.useCallback(() => {
    setCanDrag(false)
    return Promise.reject(new Error('数据段名称由汉字、数字、字母和下划线组成'))
  }, [setCanDrag])

  const IsDrag = React.useCallback(() => {
    setCanDrag(true)
    return Promise.resolve()
  }, [setCanDrag])
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      canDrag: isDragItem,
      item() {
        return {
          keys: Item.keys,
          index,
          id: Item.id
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    }),
    [index, DropList, isDragItem]
  )

  const [{ handlerId }, drop] = useDrop({
    accept: 'DragDropItem',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
      if (dragIndex === hoverIndex) {
        return
      }

      // 确定屏幕上矩形范围
      const hoverBoundingRect = ref.current!.getBoundingClientRect()

      // 获取中点垂直坐标
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // 确定鼠标位置
      const clientOffset = monitor.getClientOffset()

      // 获取距顶部距离
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      /**
       * 只在鼠标越过一半物品高度时执行移动。
       *
       * 当向下拖动时，仅当光标低于50%时才移动。
       * 当向上拖动时，仅当光标在50%以上时才移动。
       *
       * 可以防止鼠标位于元素一半高度时元素抖动的状况
       */

      // 向下拖动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // 执行 move 回调函数
      moveCardHandler(dragIndex, hoverIndex)

      /**
       * 如果拖拽的组件为 Box，则 dragIndex 为 undefined，此时不对 item 的 index 进行修改
       * 如果拖拽的组件为 Card，则将 hoverIndex 赋值给 item 的 index 属性
       */

      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex
    }
  })

  drag(drop(ref))

  const [form] = Form.useForm()
  return (
    <div
      key={Item.keys}
      className={styles.cloumnBody}
      style={{ opacity: Item.id === -1 || isDragging ? 0.4 : 1, cursor: 'move' }}
      ref={ref}
      data-handler-id={handlerId}
    >
      <span style={{ display: 'none' }}> {index} </span>
      <div className={styles.cloumnBodyHeader}>
        <img src={dragImg} alt='' />
        <span className={styles.cloumnBodyCharts}>字符串 </span>
      </div>
      <Form form={form} name='IntCompoents' layout='inline' className={styles.StringForm}>
        <Form.Item
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            { required: true, message: '请输入数据段名称' },
            { type: 'string', min: 2, max: 20, message: '数据段名称长度为2到20个字符' },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return IsDrag()
                }
                return onToggleForbidDrag()
              }
            }
          ]}
        >
          <Input placeholder='seg_xxx' className={styles.StringInput} />
        </Form.Item>

        <Form.Item name='skip' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={skipMap} className={styles.StringSelect} />
        </Form.Item>

        <div className={styles.initValue}>初始值</div>
        <Form.Item name='value' rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input placeholder='string' bordered={false} className={styles.StringInputValue} />
        </Form.Item>
      </Form>
      <div className={styles.imgStyle} />
    </div>
  )
}

const IntCompoents = ({ index, Item, moveCardHandler }: DropCmps) => {
  const initValue = {
    name: '',
    type: 'byte',
    value: 0,
    context: false,
    skip: false,
    length: 8
  }
  const DropList = ArgeementDropListStore(state => state.DropList)
  const ref = React.useRef<HTMLDivElement>(null)

  const [isDragItem, setCanDrag] = React.useState(true)
  const onToggleForbidDrag = React.useCallback(() => {
    setCanDrag(false)
    return Promise.reject(new Error('数据段名称由汉字、数字、字母和下划线组成'))
  }, [setCanDrag])

  const IsDrag = React.useCallback(() => {
    setCanDrag(true)
    return Promise.resolve()
  }, [setCanDrag])
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      canDrag: isDragItem,
      item() {
        return {
          index,
          id: Item.id
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    }),
    [index, DropList, isDragItem]
  )

  const [{ handlerId }, drop] = useDrop({
    accept: 'DragDropItem',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
      if (dragIndex === hoverIndex) {
        return
      }

      // 确定屏幕上矩形范围
      const hoverBoundingRect = ref.current!.getBoundingClientRect()

      // 获取中点垂直坐标
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // 确定鼠标位置
      const clientOffset = monitor.getClientOffset()

      // 获取距顶部距离
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      /**
       * 只在鼠标越过一半物品高度时执行移动。
       *
       * 当向下拖动时，仅当光标低于50%时才移动。
       * 当向上拖动时，仅当光标在50%以上时才移动。
       *
       * 可以防止鼠标位于元素一半高度时元素抖动的状况
       */

      // 向下拖动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // 执行 move 回调函数
      moveCardHandler(dragIndex, hoverIndex)

      /**
       * 如果拖拽的组件为 Box，则 dragIndex 为 undefined，此时不对 item 的 index 进行修改
       * 如果拖拽的组件为 Card，则将 hoverIndex 赋值给 item 的 index 属性
       */

      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex
    }
  })

  drag(drop(ref))

  const [form] = Form.useForm()
  return (
    <div
      className={styles.cloumnBody}
      data-handler-id={handlerId}
      style={{ opacity: Item.id === -1 || isDragging ? 0.4 : 1, cursor: 'move' }}
      ref={ref}
    >
      <span style={{ display: 'none' }}> {index} </span>
      <div className={styles.cloumnIntBodyHeader}>
        <img src={dragImg} alt='' />
        <span className={styles.cloumnBodyCharts}>整数 </span>
      </div>
      <Form form={form} name='IntCompoents' className={styles.StringForm} layout='inline' initialValues={initValue}>
        <Form.Item
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            { required: true, message: '请输入数据段名称' },
            { type: 'string', min: 2, max: 20, message: '数据段名称长度为2到20个字符' },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return IsDrag()
                }
                return onToggleForbidDrag()
              }
            }
          ]}
        >
          <Input placeholder='seg_xxx' bordered={false} className={styles.IntInput} />
        </Form.Item>

        <div className={styles.FourCharts}> 字节长度</div>
        <Form.Item name='length' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={byteLength} className={styles.IntSelect} />
        </Form.Item>

        <Form.Item name='skip' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={skipMap} className={styles.StringSelect} style={{ borderColor: 'none' }} />
        </Form.Item>

        <div className={styles.initValue}>初始值</div>
        <Form.Item name='value' rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input bordered={false} className={styles.IntInputValue} />
        </Form.Item>
      </Form>
      <div className={styles.imgStyle} />
    </div>
  )
}

interface IntArrayFormInstance {
  name: string
  value: string
  skip: boolean
  count: string
  length: string
}

const IntArrayCompoents = ({ index, Item, moveCardHandler }: DropCmps) => {
  const [form] = Form.useForm<FormInstance>()
  const DropList = ArgeementDropListStore(state => state.DropList)
  const ref = React.useRef<HTMLDivElement>(null)
  const [val, setValue] = React.useState('232')
  const [isDragItem, setCanDrag] = React.useState(true)

  const onToggleForbidDrag = React.useCallback(() => {
    setCanDrag(false)
    return Promise.reject(new Error('数据段名称由汉字、数字、字母和下划线组成'))
  }, [setCanDrag])

  const IsDrag = React.useCallback(() => {
    setCanDrag(true)
    return Promise.resolve()
  }, [setCanDrag])

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      canDrag: isDragItem,
      item() {
        return {
          index,
          id: Item.id
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    }),
    [index, DropList, isDragItem, val]
  )

  const [{ handlerId }, drop] = useDrop({
    accept: 'DragDropItem',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
      if (dragIndex === hoverIndex) {
        return
      }

      // 确定屏幕上矩形范围
      const hoverBoundingRect = ref.current!.getBoundingClientRect()

      // 获取中点垂直坐标
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // 确定鼠标位置
      const clientOffset = monitor.getClientOffset()

      // 获取距顶部距离
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      /**
       * 只在鼠标越过一半物品高度时执行移动。
       *
       * 当向下拖动时，仅当光标低于50%时才移动。
       * 当向上拖动时，仅当光标在50%以上时才移动。
       *
       * 可以防止鼠标位于元素一半高度时元素抖动的状况
       */

      // 向下拖动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // 执行 move 回调函数
      moveCardHandler(dragIndex, hoverIndex)

      /**
       * 如果拖拽的组件为 Box，则 dragIndex 为 undefined，此时不对 item 的 index 进行修改
       * 如果拖拽的组件为 Card，则将 hoverIndex 赋值给 item 的 index 属性
       */

      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex
    }
  })

  const checkPrice = (_: any, value: { count: number }) => {
    if (value.count <= 255 || value.count > 1) {
      return Promise.resolve()
    }
    return Promise.reject()
  }

  const onValuesChange = (value: any, allValues: any) => {
    console.log(allValues)
  }

  drag(drop(ref))

  return (
    <div
      className={styles.cloumnBody}
      style={{ opacity: Item.id === -1 || isDragging ? 0.4 : 1, cursor: 'move' }}
      ref={ref}
      data-handler-id={handlerId}
    >
      <span style={{ display: 'none' }}> {index} </span>
      <div className={styles.cloumnIntBodyHeader}>
        <img src={dragImg} alt='' />
        <span className={styles.cloumnBodyCharts}>整数数组 </span>
      </div>

      <Form
        form={form}
        name='IntArrayCompoents'
        onValuesChange={onValuesChange}
        className={styles.StringForm}
        initialValues={{
          count: {
            count: 0
          }
        }}
      >
        <Form.Item
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            { required: true, message: '请输入数据段名称' },
            { type: 'string', min: 2, max: 20, message: '数据段名称长度为2到20个字符' },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return IsDrag()
                }
                return onToggleForbidDrag()
              }
            }
          ]}
        >
          <Input placeholder='请输入字段名' bordered={false} className={styles.IntInput} />
        </Form.Item>

        <div className={styles.FourCharts} style={{ height: '37px', borderRight: '1px solid #E9E9E9' }}>
          元素个数
        </div>

        <Form.Item name='count' className={styles.IntArrayForm} rules={[{ validator: checkPrice }]}>
          <CountInput />
        </Form.Item>

        <div className={styles.FourCharts} style={{ height: '37px' }}>
          字节长度
        </div>
        <Form.Item name='length' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={byteLength} className={styles.IntSelect} />
        </Form.Item>

        <Form.Item name='skip' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={skipMap} className={styles.StringSelect} />
        </Form.Item>

        <div className={styles.initValue}>初始值</div>
        <Form.Item name='value' rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input bordered={false} className={styles.IntArrayInputValue} />
        </Form.Item>
      </Form>

      <div className={styles.imgStyle} />
    </div>
  )
}

const MemoIntArrayCompoents = React.memo(IntArrayCompoents)
const MemoStringComponents = React.memo(StringComponents)
const MemoIntCompoents = React.memo(IntCompoents)

const ComponentsArray = [
  {
    type: 'IntArrayComponents',
    id: 2,
    keys: '2',
    Components: MemoIntArrayCompoents
  },
  {
    type: 'IntComponents',
    id: 1,
    keys: '1',
    Components: MemoIntCompoents
  },
  {
    type: 'StringComponents',
    id: 3,
    keys: '3',
    Components: MemoStringComponents
  }
]

export { ComponentsArray }
