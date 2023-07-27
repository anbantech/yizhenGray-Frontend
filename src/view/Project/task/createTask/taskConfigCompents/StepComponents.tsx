import { Checkbox, Form, Input, Steps } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useHistory, withRouter } from 'react-router'
import { DndProvider, DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useEffect, useState } from 'react'
import img_empty from 'Src/assets/drag/img_empty@2x.png'
import InfiniteScroll from 'react-infinite-scroll-component'
import { excitationListFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/common'
import dragImg from 'Src/assets/drag/icon_drag.png'
import { useRequestStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import { DropTip } from 'Src/view/excitation/excitationComponent/Tip'
import InputNumberSuffixModal from 'Src/components/inputNumbersuffix/inputNumberModal'
import styles from 'Src/view/Project/task/taskList/task.less'
import stepStore from './sendListStore'

import StyleSheetOther from '../../../../NewExcitation/ExcitationComponents/ExcitationDraw/excitationDraw.less'

import StyleSheet from './stepBaseConfig.less'

const layout = {
  wrapperCol: { span: 22 }
}

const CloumnLine = () => {
  return <div className={StyleSheetOther.cloumnLine} />
}
const OneSteps = () => {
  const { TextArea } = Input
  const setButtonStatus = stepStore(state => state.setButtonStatus)
  const setBaseInfo = stepStore(state => state.setBaseInfo)
  const baseInfo = stepStore(state => state.baseInfo)
  const [form] = Form.useForm<any>()
  const onValuesChange = (changedValues: any, allValues: any) => {
    const bol = allValues.desc === undefined || allValues.desc?.length <= 50
    if (allValues.name?.length >= 2 && allValues.name.length <= 20 && /^[\w\u4E00-\u9FA5]+$/.test(allValues.name) && bol) {
      const val = { name: allValues.name, desc: allValues.desc }
      setBaseInfo(val)
      setButtonStatus(false)
    } else {
      setButtonStatus(true)
    }
  }
  useEffect(() => {
    if (baseInfo) {
      const { name, desc } = baseInfo
      const formData = { name, desc }
      form.setFieldsValue(formData)
    }
  }, [baseInfo, form, setBaseInfo])
  return (
    <Form form={form} autoComplete='off' {...layout} className={StyleSheet.oneStepform} onValuesChange={onValuesChange}>
      <Form.Item
        name='name'
        validateFirst
        label='名称'
        validateTrigger={['onBlur']}
        rules={[
          { required: true, message: '请输入项目名称' },
          { type: 'string', min: 2, max: 20, message: '项目名称长度为2到20个字符' },
          {
            validateTrigger: 'onBlur',
            validator(_, value) {
              const reg = /^[\w\u4E00-\u9FA5]+$/
              if (reg.test(value)) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('项目名称由汉字、数字、字母和下划线组成'))
            }
          }
        ]}
      >
        <Input placeholder='请输入项目名称' />
      </Form.Item>
      <Form.Item name='desc' label='描述' rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}>
        <TextArea
          placeholder='请添加针对项目的相关描述'
          autoSize={{ minRows: 4, maxRows: 5 }}
          showCount={{
            formatter({ count }) {
              return `${count}/50`
            }
          }}
        />
      </Form.Item>
    </Form>
  )
}

const Ementy = () => {
  const history = useHistory()
  const deleteEverything = stepStore(state => state.deleteEverything)
  const JumpExcitationList = () => {
    deleteEverything()
    history.push({
      pathname: '/Excitataions'
    })
  }
  return (
    <div className={StyleSheet.noStyles}>
      <img className={StyleSheet.noImg} src={img_empty} alt='' />
      <span className={StyleSheet.chartNoList}> 暂无数据</span>
      <div className={StyleSheet.noTaskBtn} role='time' onClick={JumpExcitationList}>
        点击跳转至激励配置页
      </div>
    </div>
  )
}

const TwoSteps = () => {
  const excitationList = stepStore(state => state.excitationList)
  const current = stepStore(state => state.current)
  const [List, setList] = useState<Record<string, any>>([])
  const [checkListItem, setListMemo] = useState<any[]>([])
  const CheckboxGroup = Checkbox.Group
  const { params, setHasMore, hasMoreData, loadMoreData } = useRequestStore()
  const setExcitation = stepStore(state => state.setExcitation)
  const getExcitationList = React.useCallback(
    async value => {
      try {
        const result = await excitationListFn(value)
        if (result.data) {
          const newList = [...result.data.results]
          if (newList.length === 0) {
            // InstancesDetail.setInstance(false)
            setHasMore(false)
            return false
          }

          if (newList.length === result.data.total) {
            setHasMore(false)
          }
          setList([...newList])
        }
      } catch (error) {
        throwErrorMessage(error, { 1004: '请求资源未找到' })
      }
    },
    [setHasMore]
  )

  const GetCheckList = React.useCallback(() => {
    const list = excitationList.map((item: any) => {
      return item.sender_id
    })
    setListMemo([...list])
  }, [excitationList])

  React.useEffect(() => {
    GetCheckList()
  }, [excitationList, current, GetCheckList])

  React.useEffect(() => {
    getExcitationList(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])
  const onChange = (list: CheckboxValueType[]) => {
    const listArray = list
    setListMemo(list)
    const array = List.filter((item: any) => {
      return listArray.includes(Number(item.sender_id))
    })
    setExcitation([...array])
  }

  return (
    <div className={StyleSheet.twoSteps}>
      <span className={StyleSheet.StepTitle}>激励列表</span>
      {List.length > 0 ? (
        <div id='scrollableDiv' className={StyleSheet.scrollDiv} style={{ height: 208 }}>
          <CheckboxGroup onChange={onChange} style={{ width: '100%' }} value={checkListItem}>
            <InfiniteScroll
              dataLength={List.length}
              next={loadMoreData}
              hasMore={hasMoreData}
              scrollableTarget='scrollableDiv'
              loader={
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                  {/* <div className={styles.listLine} /> */}
                  <div>内容已经加载完毕</div>
                </p>
              }
              endMessage={
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                  {/* <div className={styles.listLine} /> */}
                  <div>内容已经加载完毕</div>
                </p>
              }
            >
              {List?.map((item: any) => {
                return (
                  <div key={`${item.sender_id}`} className={StyleSheet.StepItem}>
                    <span>{item.name}</span>
                    <div className={StyleSheet.checkBoxBody}>
                      <Checkbox value={item.sender_id} />
                    </div>
                  </div>
                )
              })}
            </InfiniteScroll>
          </CheckboxGroup>
        </div>
      ) : (
        <Ementy />
      )}
    </div>
  )
}

const DropableMemo = ({ index, item, moveCardHandler, sender_id, DropList, DeleteCheckItem }: any) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      item: {
        index,
        sender_id
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    }),
    [sender_id, index, DropList]
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

      if (item.index !== undefined) {
        // eslint-disable-next-line no-param-reassign
        item.index = hoverIndex
      }
    }
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={StyleSheet.excitationItemDrop}
      style={{ opacity: isDragging || item.isItemDragging ? 0.4 : 1, cursor: 'move' }}
    >
      <div className={StyleSheet.excitationItemDrop_List}>
        <img className={StyleSheet.img_Body} src={dragImg} alt='' />
      </div>
      <div className={StyleSheet.excitationItemDrop_ListCheckbox}>
        <Checkbox value={item.sender_id} />
      </div>
      <div className={StyleSheet.excitationItemDrop_ListRight}>
        <div className={StyleSheet.excitationItemDrop_ListIndex}>
          <span>{index}</span>
        </div>
        <div className={StyleSheet.excitationItemDrop_ListName}>
          <span>{item.name}</span>
        </div>
        <div className={StyleSheet.excitationItemDrop_Img}>
          <div
            role='time'
            className={styles.taskListLeft_detailImg}
            onClick={() => {
              DeleteCheckItem(item.sender_id)
            }}
          />
        </div>
      </div>
    </div>
  )
}

const Dropable = React.memo(DropableMemo)

const DeleteCompoent = ({ number, DeleteCheckItem }: { number: number; DeleteCheckItem: () => void }) => {
  return (
    <div className={StyleSheet.DelCompoents}>
      <div role='time' className={StyleSheet.bottomBtn} onClick={DeleteCheckItem}>
        批量删除
      </div>
      <span className={StyleSheet.DelCompoentsCharts}>{`已选 ${number} 项`}</span>
    </div>
  )
}
const DeleteCompoentMemo = React.memo(DeleteCompoent)

const ThreeSteps = () => {
  const excitationList = stepStore(state => state.excitationList)
  const CheckboxGroup = Checkbox.Group
  const [, drop] = useDrop(() => ({
    accept: 'DragDropItem'
  }))
  const gu_cnt0 = stepStore(state => state.gu_cnt0)
  const gu_w0 = stepStore(state => state.gu_w0)
  const setCheckList = stepStore(state => state.setCheckList)
  const setValue = stepStore(state => state.setValue)
  const checkList = stepStore(state => state.checkList)
  const setExcitation = stepStore(state => state.setExcitation)

  const checkListMemo = React.useMemo(() => {
    return checkList.length
  }, [checkList])

  const onChangeGu_time = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number.parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newNumber)) {
      return
    }
    setValue(type, newNumber)
  }

  const onMax = React.useCallback(
    (type: string) => {
      if (type === 'gu_cnt0') {
        const newValue = Number(gu_cnt0) > 20 ? 20 : gu_cnt0
        setValue(type, newValue)
      }
      if (type === 'gu_w0') {
        const newValue = Number(gu_w0) > 100 ? 100 : gu_w0
        setValue(type, newValue)
      }
    },
    [gu_cnt0, gu_w0, setValue]
  )

  const moveCardHandler = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dropCardListCopy = excitationList
      dropCardListCopy.splice(dragIndex, 1, ...dropCardListCopy.splice(hoverIndex, 1, dropCardListCopy[dragIndex]))
      setExcitation([...dropCardListCopy])
    },
    [excitationList, setExcitation]
  )

  const DeleteCheckItem = React.useCallback(
    (val: number) => {
      const DropListFilter = excitationList.filter((item: any) => {
        return val !== item.sender_id
      })
      const CheckListFilter = checkList.filter((item: any) => {
        return val !== item
      })
      // const copyList = excitationList.filter((item: any) => !checkList.includes(item.sender_id))
      setExcitation([...DropListFilter])
      setCheckList([...CheckListFilter])
    },
    [checkList, excitationList, setCheckList, setExcitation]
  )

  const DeleteAllCheckItem = React.useCallback(() => {
    const copyList = excitationList.filter((item: any) => !checkList.includes(item.sender_id))
    setExcitation([...copyList])
    setCheckList([])
  }, [checkList, excitationList, setCheckList, setExcitation])

  const onChange = (list: any[]) => {
    setCheckList([...list])
  }

  return (
    <div className={StyleSheet.twoSteps}>
      <div className={StyleSheet.ThreeStepTitle}>
        <span className={StyleSheet.StepTitleHeader}>激励列表</span>
        <div style={{ display: 'flex', width: '400px', alignItems: 'center' }}>
          <div className={StyleSheetOther.inputEdit} style={{ display: 'flex', alignItems: 'center' }}>
            <span className={StyleSheetOther.headerDesc} style={{ marginRight: '8px', display: 'flex', width: 65 }}>
              发送次数:
            </span>
            <Input
              className={StyleSheetOther.numberInput}
              value={gu_cnt0}
              onBlur={() => {
                onMax('gu_cnt0')
              }}
              onChange={e => {
                onChangeGu_time('gu_cnt0', e)
              }}
              suffix={<InputNumberSuffixModal type='gu_cnt0' />}
            />
          </div>
          <CloumnLine />
          <div className={StyleSheetOther.inputEdit} style={{ display: 'flex', alignItems: 'center' }}>
            <span className={StyleSheetOther.headerDesc} style={{ marginRight: '8px', display: 'flex', width: 65 }}>
              发送间隔:
            </span>

            <Input
              className={StyleSheetOther.numberInput}
              onChange={e => {
                onChangeGu_time('gu_w0', e)
              }}
              onBlur={() => {
                onMax('gu_w0')
              }}
              value={gu_w0}
              suffix={<InputNumberSuffixModal type='gu_w0' />}
            />

            <DropTip />
          </div>
        </div>
      </div>

      <div className={StyleSheet.scrollDiv} style={{ height: 208 }} ref={drop}>
        <CheckboxGroup onChange={onChange} style={{ width: '100%' }}>
          {excitationList?.map((item: any, index: number) => {
            return (
              <Dropable
                sender_id={item.sender_id}
                key={`${item.sender_id}`}
                DropList={excitationList}
                moveCardHandler={moveCardHandler}
                index={index}
                DeleteCheckItem={DeleteCheckItem}
                item={item}
              />
            )
          })}
        </CheckboxGroup>
      </div>
      {checkListMemo > 0 && <DeleteCompoentMemo number={checkListMemo} DeleteCheckItem={DeleteAllCheckItem} />}
    </div>
  )
}

function StepComponents() {
  const current = stepStore(state => state.current)
  const { Step } = Steps
  const steps = [
    {
      title: '设置名称',
      content: <OneSteps />
    },
    {
      title: '选择目标激励',
      content: <TwoSteps />
    },
    {
      title: '编辑发送列表',
      content: <ThreeSteps />
    }
  ]

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className={StyleSheet.stepHeader}>
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </div>

        <div className={StyleSheet.concent}>{steps[current].content}</div>
      </DndProvider>
    </div>
  )
}

export default withRouter(StepComponents)
