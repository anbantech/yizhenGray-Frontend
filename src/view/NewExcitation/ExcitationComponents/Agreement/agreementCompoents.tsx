import { Form, Input, Select, Tooltip } from 'antd'
import * as React from 'react'
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd'
import dragImg from 'Src/assets/drag/icon_drag.png'
import { ArgeementDropListStore } from '../../ExcitaionStore/ExcitaionStore'
import { DragCmps } from '../../ExcitaionStore/ExcitationStoreParams'
import styles from './agreementCompoents.less'

type Type = { type: string; index: number }
export type Cmps = Type
interface DropCmps {
  index: number
  moveCardHandler: (dragIndex: number, hoverIndex: number) => void
  Item: any
}

const byteLength = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '4', value: '4' },
  { label: '8', value: '8' }
]

const skipMap = [
  { label: '不变异', value: true },
  { label: '变异', value: false }
]

interface PriceValue {
  count?: number
}

interface PriceValue {
  count?: number
}

interface PriceInputProps {
  value?: PriceValue
  onChange?: (value: PriceValue) => void
}

const RegCompare = (str: string, fn: any) => {
  const isOctal = /^0o[0-7]+$/.test(str) || /^0O[0-7]+$/.test(str)
  const isDecimal = /^\d+$/.test(str)
  const isHexadecimal = /^0x[\dA-Fa-f]+$/.test(str) || /^0X[\dA-Fa-f]+$/.test(str)
  if (isOctal || isDecimal || isHexadecimal) {
    return Promise.resolve()
  }
  return fn()
}

const NoValCompare = (cb: (val: boolean) => void, fn: any) => {
  cb(false)
  fn()
}

const canDragBool = (cb: (val: boolean) => void) => {
  cb(false)
}

const canIsDragBool = (cb: (val: boolean) => void) => {
  cb(true)
}

const DeleteItem = (cb: (val: DragCmps[]) => void, val: DragCmps[], index: number, del: (index: number) => void) => {
  const pre = val
  pre.splice(index, 1)
  cb([...pre])
  del(index)
}

const StringComponents = React.forwardRef(({ index, Item, moveCardHandler }: DropCmps, myRef: any) => {
  const setLeftList = ArgeementDropListStore(state => state.setLeftList)
  const deleteDropListRef = ArgeementDropListStore(state => state.deleteDropListRef)
  const [form] = Form.useForm()
  const [formData, setformData] = React.useState<any>({ type: 'string', name: '', skip: true, value: '' })
  const DropList = ArgeementDropListStore(state => state.DropList)
  const ref = React.useRef<HTMLDivElement>(null)
  const [isDragItem, setCanDrag] = React.useState(true)
  const onValuesChange = React.useCallback((changedValues: any, allValues: any) => {
    setformData(allValues)
  }, [])
  const onToggleForbidDrag = React.useCallback(() => {
    setCanDrag(false)
    return Promise.reject(new Error('字段名称由汉字、数字、字母和下划线组成'))
  }, [setCanDrag])

  const noValueFrom = React.useCallback(() => {
    setCanDrag(false)
    return Promise.reject(new Error('请输入字段名称'))
  }, [setCanDrag])

  const IsDrag = React.useCallback(() => {
    setCanDrag(true)
    return Promise.resolve()
  }, [setCanDrag])

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      item() {
        return {
          keys: Item.keys,
          index,
          id: Item.id
        }
      },
      canDrag: () => {
        if (!isDragItem) return isDragItem
        return true
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    }),
    [index, DropList, isDragItem, form]
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
  const validateForm = React.useCallback(async () => {
    let bol
    try {
      await form.validateFields()
      bol = true
    } catch {
      bol = false
    }
    return bol
  }, [form])

  const getPositionRef = React.useCallback(() => {
    if (ref) {
      ref.current?.scrollIntoView()
    }
  }, [ref])

  React.useImperativeHandle(myRef, () => ({
    save: () => {
      return { ...form.getFieldsValue(), type: 'string', context: false }
    },
    delete: () => {},
    validate: () => {
      return validateForm
    },
    clearInteraction: () => {},
    getRef: () => {
      return getPositionRef()
    }
  }))

  React.useEffect(() => {
    if (Item.name) {
      const { name, skip, value, context } = Item
      setformData({ name, skip, value, context })
      form.setFieldsValue({ name, skip, value, context })
    }
  }, [form, Item])

  drag(drop(ref))

  return (
    <div
      key={Item.keys}
      className={styles.cloumnBody}
      style={{ opacity: Item.id === -1 || isDragging ? 0.4 : 1, cursor: 'move' }}
      ref={ref}
      role='time'
      data-handler-id={handlerId}
    >
      <span style={{ display: 'none' }}> {index} </span>
      <div className={styles.cloumnBodyHeader}>
        <img src={dragImg} alt='' />
        <span className={styles.cloumnBodyCharts}>字符串 </span>
      </div>
      <Form form={form} name='Compoents' layout='inline' onValuesChange={onValuesChange} className={styles.StringForm} initialValues={formData}>
        <Tooltip placement='bottom' title={formData.name}>
          <Form.Item
            name='name'
            validateFirst
            validateTrigger={['onBlur']}
            rules={[
              {
                validateTrigger: 'onBlur',
                validator(_, value) {
                  if (value) {
                    const reg = /^[\w\u4E00-\u9FA5]+$/
                    if (value.length > 20) {
                      return Promise.reject(new Error('字段名称长度为2到20个字符'))
                    }
                    if (value.length < 2 && value.length !== 0) {
                      return Promise.reject(new Error('字段名称长度为2到20个字符'))
                    }
                    if (reg.test(value)) {
                      return IsDrag()
                    }
                    return onToggleForbidDrag()
                  }
                  return noValueFrom()
                }
              }
            ]}
          >
            <Input
              placeholder='请输入字段名'
              onFocus={() => {
                canDragBool(setCanDrag)
              }}
              onBlur={() => {
                canIsDragBool(setCanDrag)
              }}
              className={styles.StringInput}
            />
          </Form.Item>
        </Tooltip>
        <Form.Item name='skip' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={skipMap} className={styles.StringSelect} />
        </Form.Item>

        <div className={styles.initValue}>初始值</div>
        <Tooltip placement='bottom' title={formData.value}>
          <Form.Item name='value'>
            <Input
              bordered={false}
              className={styles.StringInputValue}
              onFocus={() => {
                canDragBool(setCanDrag)
              }}
              onBlur={() => {
                canIsDragBool(setCanDrag)
              }}
            />
          </Form.Item>
        </Tooltip>
      </Form>

      <div
        className={styles.imgStyle}
        style={{ cursor: 'pointer' }}
        role='time'
        onClick={() => {
          DeleteItem(setLeftList, DropList, index, deleteDropListRef)
        }}
      />
    </div>
  )
})

const IntCompoents = React.forwardRef(({ index, Item, moveCardHandler }: DropCmps, myRef: any) => {
  const [formData, setformData] = React.useState<any>({
    type: 'byte',
    name: '',
    value: 0,
    context: false,
    skip: true,
    length: 1
  })
  const deleteDropListRef = ArgeementDropListStore(state => state.deleteDropListRef)
  const setLeftList = ArgeementDropListStore(state => state.setLeftList)
  const DropList = ArgeementDropListStore(state => state.DropList)
  const ref = React.useRef<HTMLDivElement>(null)
  const [isDragItem, setCanDrag] = React.useState(true)
  const onToggleForbidDrag = React.useCallback(() => {
    setCanDrag(false)
    return Promise.reject(new Error('字段名称由汉字、数字、字母和下划线组成'))
  }, [setCanDrag])

  const noValueFrom = React.useCallback(() => {
    setCanDrag(false)
    return Promise.reject(new Error('请输入字段名称'))
  }, [setCanDrag])

  const IsDrag = React.useCallback(() => {
    setCanDrag(true)
    return Promise.resolve()
  }, [setCanDrag])

  const onValuesChange = React.useCallback((changedValues: any, allValues: any) => {
    setformData(allValues)
  }, [])

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

  const validateForm = React.useCallback(async () => {
    let bol
    try {
      await form.validateFields()
      bol = true
    } catch {
      bol = false
    }
    return bol
  }, [form])

  const getPositionRef = React.useCallback(() => {
    if (ref) {
      ref.current?.scrollIntoView()
    }
  }, [ref])

  React.useImperativeHandle(myRef, () => ({
    save: () => {
      return { ...form.getFieldsValue(), type: 'byte', context: false }
    },
    delete: () => {},
    validate: () => {
      return validateForm
    },
    clearInteraction: () => {},
    getRef: () => {
      return getPositionRef()
    }
  }))
  const resvertValue = React.useCallback(() => {
    form.setFieldsValue({ value: 0 })
  }, [form])
  React.useEffect(() => {
    if (Item.name) {
      const { name, skip, value, length, context } = Item
      setformData({ name, skip, value, length, context })
      form.setFieldsValue({ name, skip, value, length, context })
    }
  }, [form, Item])

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
      <Form form={form} name='IntCompoents' className={styles.StringForm} onValuesChange={onValuesChange} layout='inline' initialValues={formData}>
        <Tooltip placement='bottom' title={formData.name}>
          <Form.Item
            name='name'
            validateFirst
            validateTrigger={['onBlur']}
            rules={[
              {
                validateTrigger: 'onBlur',
                validator(_, value) {
                  if (value) {
                    const reg = /^[\w\u4E00-\u9FA5]+$/
                    if (value.length > 20) {
                      return Promise.reject(new Error('字段名称长度为2到20个字符'))
                    }
                    if (value.length < 2 && value.length !== 0) {
                      return Promise.reject(new Error('字段名称长度为2到20个字符'))
                    }
                    if (reg.test(value)) {
                      return IsDrag()
                    }
                    return onToggleForbidDrag()
                  }
                  return noValueFrom()
                }
              }
            ]}
          >
            <Input
              placeholder='请输入字段名'
              onFocus={() => {
                canDragBool(setCanDrag)
              }}
              onBlur={() => {
                canIsDragBool(setCanDrag)
              }}
              className={styles.StringInput}
            />
          </Form.Item>
        </Tooltip>
        <div className={styles.FourCharts}> 字节长度</div>
        <Form.Item name='length' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={byteLength} className={styles.IntSelect} />
        </Form.Item>

        <Form.Item name='skip' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={skipMap} className={styles.StringSelect} style={{ borderColor: 'none' }} />
        </Form.Item>

        <div className={styles.initValue}>初始值</div>
        <Tooltip placement='bottom' title={formData.value}>
          <Form.Item
            className={styles.intFormItem}
            name='value'
            validateFirst
            validateTrigger={['onBlur']}
            rules={[
              {
                validateTrigger: 'onBlur',
                validator(_, value) {
                  if (value !== '') {
                    return RegCompare(value, resvertValue)
                  }
                  return NoValCompare(setCanDrag, resvertValue)
                }
              }
            ]}
          >
            <Input
              bordered={false}
              className={styles.IntInputValue}
              onFocus={() => {
                canDragBool(setCanDrag)
              }}
              onBlur={() => {
                canIsDragBool(setCanDrag)
              }}
            />
          </Form.Item>
        </Tooltip>
      </Form>
      <div
        className={styles.imgStyle}
        style={{ cursor: 'pointer' }}
        role='time'
        onClick={() => {
          DeleteItem(setLeftList, DropList, index, deleteDropListRef)
        }}
      />
    </div>
  )
})

const IntArrayCompoents = React.forwardRef(({ index, Item, moveCardHandler }: DropCmps, myRef: any) => {
  const setLeftList = ArgeementDropListStore(state => state.setLeftList)
  const deleteDropListRef = ArgeementDropListStore(state => state.deleteDropListRef)
  const [form] = Form.useForm<any>()
  const DropList = ArgeementDropListStore(state => state.DropList)
  const [val, setVal] = React.useState(10)
  const [formData, setformData] = React.useState<any>({
    name: '',
    type: 'byte_array',
    value: 0,
    context: false,
    count: 10,
    skip: true,
    length: 1
  })
  const ref = React.useRef<HTMLDivElement>(null)
  const [isDragItem, setCanDrag] = React.useState(true)
  const noValueFrom = React.useCallback(() => {
    setCanDrag(false)
    return Promise.reject(new Error('请输入字段名称'))
  }, [setCanDrag])

  const onToggleForbidDrag = React.useCallback(() => {
    setCanDrag(false)
    return Promise.reject(new Error('字段名称由汉字、数字、字母和下划线组成'))
  }, [setCanDrag])

  const IsDrag = React.useCallback(() => {
    setCanDrag(true)
    return Promise.resolve()
  }, [setCanDrag])

  const resvertValue = React.useCallback(() => {
    form.setFieldsValue({ value: 0 })
  }, [form])

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

  const onChangeGu_time = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newNumber = Number.parseInt(e.target.value || '0', 10)
      if (Number.isNaN(newNumber)) {
        return
      }
      form.setFieldsValue({ count: val })
      setVal(newNumber)
    },
    [form, val]
  )

  const onMax = React.useCallback(() => {
    const l1 = typeof val === 'number' && val > 255
    const l2 = typeof val === 'number' && val < 1
    if (l1) {
      setVal(255)
    } else if (l2) {
      setVal(1)
    }
  }, [val, setVal])

  React.useEffect(() => {
    if (Item.name) {
      const { name, skip, value, length, context, count } = Item
      setformData({ name, skip, value, length, context, count })
      form.setFieldsValue({ name, skip, value, length, context, count })
    } else {
      form.setFieldsValue({ count: val })
    }
  }, [val, form, Item])

  drag(drop(ref))

  const validateForm = React.useCallback(async () => {
    let bol
    try {
      await form.validateFields()
      bol = true
    } catch {
      bol = false
    }
    return bol
  }, [form])

  const getPositionRef = React.useCallback(() => {
    if (ref) {
      ref.current?.scrollIntoView()
    }
  }, [ref])

  React.useImperativeHandle(myRef, () => ({
    save: () => {
      return { ...form.getFieldsValue(), type: 'byte_array', context: false }
    },
    delete: () => {},
    validate: () => {
      return validateForm
    },
    clearInteraction: () => {},
    getRef: () => {
      return getPositionRef()
    }
  }))
  const onValuesChange = React.useCallback((changedValues: any, allValues: any) => {
    setformData(allValues)
  }, [])

  return (
    <div
      className={styles.cloumnBody}
      style={{ opacity: Item.id === -1 || isDragging ? 0.4 : 1, cursor: 'move' }}
      ref={ref}
      data-handler-id={handlerId}
    >
      <span style={{ display: 'none' }}> {index} </span>
      <div className={styles.cloumnIntBodyHeader} ref={ref}>
        <img src={dragImg} alt='' />
        <span className={styles.cloumnBodyCharts}>整数数组 </span>
      </div>

      <Form form={form} name='IntArrayCompoents' className={styles.StringForm} onValuesChange={onValuesChange} initialValues={formData}>
        <Tooltip placement='bottom' title={formData.name}>
          <Form.Item
            name='name'
            validateFirst
            validateTrigger={['onBlur']}
            rules={[
              {
                validateTrigger: 'onBlur',
                validator(_, value) {
                  if (value) {
                    const reg = /^[\w\u4E00-\u9FA5]+$/
                    if (value.length > 20) {
                      return Promise.reject(new Error('字段名称长度为2到20个字符'))
                    }
                    if (value.length < 2 && value.length !== 0) {
                      return Promise.reject(new Error('字段名称长度为2到20个字符'))
                    }
                    if (reg.test(value)) {
                      return IsDrag()
                    }
                    return onToggleForbidDrag()
                  }
                  return noValueFrom()
                }
              }
            ]}
          >
            <Input
              placeholder='请输入字段名'
              onFocus={() => {
                canDragBool(setCanDrag)
              }}
              onBlur={() => {
                canDragBool(setCanDrag)
              }}
              className={styles.StringInput}
            />
          </Form.Item>
        </Tooltip>
        <div className={styles.FourCharts} style={{ height: '37px', borderRight: '1px solid #E9E9E9' }}>
          元素个数
        </div>

        <Form.Item name='count' className={styles.IntArrayForm}>
          <Input
            onBlur={() => {
              onMax()
              canIsDragBool(setCanDrag)
            }}
            onChange={e => {
              onChangeGu_time(e)
            }}
            onFocus={() => {
              canDragBool(setCanDrag)
            }}
            className={styles.IntArrayInput}
          />
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
        <Tooltip placement='bottom' title={formData.value}>
          <Form.Item
            className={styles.intArrayFormItem}
            name='value'
            validateFirst
            validateTrigger={['onBlur']}
            rules={[
              {
                validateTrigger: 'onBlur',
                validator(_, value) {
                  if (value !== '') {
                    return RegCompare(value, resvertValue)
                  }
                  return NoValCompare(setCanDrag, resvertValue)
                }
              }
            ]}
          >
            <Input
              bordered={false}
              onFocus={() => {
                canDragBool(setCanDrag)
              }}
              onBlur={() => {
                canIsDragBool(setCanDrag)
              }}
              className={styles.IntArrayInputValue}
            />
          </Form.Item>
        </Tooltip>
      </Form>

      <div
        className={styles.imgStyle}
        style={{ cursor: 'pointer' }}
        role='time'
        onClick={() => {
          DeleteItem(setLeftList, DropList, index, deleteDropListRef)
        }}
      />
    </div>
  )
})

const MemoIntArrayCompoents = React.memo(IntArrayCompoents)
const MemoStringComponents = React.memo(StringComponents)
const MemoIntCompoents = React.memo(IntCompoents)

const ComponentsArray = [
  {
    type: 'byte_array',
    id: 2,
    keys: '2',
    Components: MemoIntArrayCompoents
  },
  {
    type: 'byte',
    id: 1,
    keys: '1',
    Components: MemoIntCompoents
  },
  {
    type: 'string',
    id: 3,
    keys: '3',
    Components: MemoStringComponents
  }
]

export { ComponentsArray }
