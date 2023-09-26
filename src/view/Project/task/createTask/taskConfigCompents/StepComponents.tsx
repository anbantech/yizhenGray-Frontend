import { Checkbox, Form, Input, Steps, Tooltip } from 'antd'
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
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
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
          { required: true, message: '请输入激励序列名称' },
          { type: 'string', min: 2, max: 20, message: '激励序列名称长度为2到20个字符' },
          {
            validateTrigger: 'onBlur',
            validator(_, value) {
              const reg = /^[\w\u4E00-\u9FA5]+$/
              if (reg.test(value)) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('激励序列名称由汉字、数字、字母和下划线组成'))
            }
          }
        ]}
      >
        <Input placeholder='请输入激励序列名称' />
      </Form.Item>
      <Form.Item name='desc' label='描述' rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}>
        <TextArea
          placeholder='请添加针对激励序列的相关描述'
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

const TwoSteps = ({ List }: Record<string, any>) => {
  const excitationList = stepStore(state => state.excitationList)
  const current = stepStore(state => state.current)
  const { hasMoreData, loadMoreData } = useRequestStore()
  const CheckboxGroup = Checkbox.Group

  const twoCheckList = stepStore(state => state.twoCheckList)
  const twoindeterminate = stepStore(state => state.twoindeterminate)
  const twoAll = stepStore(state => state.twoAll)
  const setExcitation = stepStore(state => state.setExcitation)
  const setTwoCheckList = stepStore(state => state.setTwoCheckList)
  const setTwoindeterminate = stepStore(state => state.setTwoindeterminate)
  const setTwoAll = stepStore(state => state.setTwoAll)

  const GetCheckList = React.useCallback(() => {
    const list = excitationList.map((item: any) => {
      return item.sender_id
    })
    if (list.length === 0) {
      setTwoAll(false)
      setTwoindeterminate(false)
    }
    setTwoCheckList([...list])
  }, [excitationList, setTwoAll, setTwoCheckList, setTwoindeterminate])

  const up = React.useCallback(() => {
    setTwoAll(twoCheckList.length === List.length)
    setTwoindeterminate(!!twoCheckList.length && twoCheckList.length < List.length)
    loadMoreData()
  }, [List.length, loadMoreData, setTwoAll, setTwoindeterminate, twoCheckList.length])

  React.useEffect(() => {
    GetCheckList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  const onChange = React.useCallback(
    (checkedValues: CheckboxValueType[]) => {
      setTwoCheckList([...checkedValues])
      setTwoAll(checkedValues.length === List.length)
      setTwoindeterminate(!!checkedValues.length && checkedValues.length < List.length)
      setExcitation([...checkedValues])

      const listArray = checkedValues
      const array = List.filter((item: any) => {
        return listArray.includes(Number(item.sender_id))
      })
      setExcitation([...array])
    },
    [List, setExcitation, setTwoAll, setTwoCheckList, setTwoindeterminate]
  )

  const onCheckAllChange = React.useCallback(
    (e: CheckboxChangeEvent) => {
      const listArray = List.map((item: any) => {
        return item.sender_id
      })
      setTwoCheckList(e.target.checked ? [...listArray] : [])
      setTwoindeterminate(false)
      setTwoAll(e.target.checked)
      setExcitation(e.target.checked ? [...List] : [])
    },
    [List, setExcitation, setTwoAll, setTwoCheckList, setTwoindeterminate]
  )

  return (
    <div className={StyleSheet.twoSteps}>
      <div className={StyleSheet.twoStepHeader}>
        <span className={StyleSheet.StepTitle}>激励列表</span>
        <Tooltip title='全选' placement='bottom' style={{ width: '100px' }} overlayClassName={StyleSheet.overlay}>
          <Checkbox indeterminate={twoindeterminate} onChange={onCheckAllChange} checked={twoAll} />
        </Tooltip>
      </div>
      {List.length > 0 ? (
        <div id='scrollableDiv' className={StyleSheet.scrollDiv} style={{ height: 208 }}>
          <CheckboxGroup onChange={onChange} style={{ width: '100%' }} value={twoCheckList}>
            <InfiniteScroll
              dataLength={List.length}
              next={up}
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
            style={{ cursor: 'pointer' }}
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
  const setCheckList = stepStore(state => state.setCheckList)
  const excitationList = stepStore(state => state.excitationList)
  const setThreeAll = stepStore(state => state.setThreeAll)
  const setThreeindeterminate = stepStore(state => state.setThreeindeterminate)
  const threeAll = stepStore(state => state.threeAll)
  const threeindeterminatel = stepStore(state => state.threeindeterminate)

  const onCheckAllChange = React.useCallback(
    (e: CheckboxChangeEvent) => {
      const list = excitationList.map((item: any) => {
        return item.sender_id
      })
      setCheckList(e.target.checked ? [...list] : [])
      setThreeindeterminate(false)
      setThreeAll(e.target.checked)
    },
    [excitationList, setCheckList, setThreeAll, setThreeindeterminate]
  )

  React.useEffect(() => {
    if (number > 0) {
      setThreeAll(number === excitationList.length)
      setThreeindeterminate(!!number && number < excitationList.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number, excitationList])

  return (
    <div className={StyleSheet.DelCompoents}>
      <div className={StyleSheet.leftComponents}>
        <Tooltip title='全选' placement='bottom' style={{ width: '100px' }} overlayClassName={StyleSheet.overlay}>
          <Checkbox indeterminate={threeindeterminatel} onChange={onCheckAllChange} checked={threeAll} />
        </Tooltip>
      </div>
      <div className={StyleSheet.rightDelComponents}>
        <span className={StyleSheet.DelCompoentsCharts}>{`已选中 ${number} 项`}</span>
        <div role='time' className={StyleSheet.bottomBtn} style={{ marginLeft: '10px' }} onClick={DeleteCheckItem}>
          批量删除
        </div>
      </div>
    </div>
  )
}
const DeleteCompoentMemo = React.memo(DeleteCompoent)

const ThreeSteps = () => {
  const excitationList = stepStore(state => state.excitationList)
  const setThreeAll = stepStore(state => state.setThreeAll)
  const setThreeindeterminate = stepStore(state => state.setThreeindeterminate)
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
  const setTwoCheckList = stepStore(state => state.setTwoCheckList)
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
        const newValue_2 = Number(gu_cnt0) === 0
        if (newValue_2) {
          setValue(type, 1)
        } else {
          setValue(type, newValue)
        }
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
      setCheckList([])
      const dropCardListCopy = excitationList
      const copy = dropCardListCopy.splice(dragIndex, 1)
      dropCardListCopy.splice(hoverIndex, 0, ...copy)
      setExcitation([...dropCardListCopy])
    },
    [excitationList, setCheckList, setExcitation]
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
      setTwoCheckList([...CheckListFilter])
    },
    [checkList, excitationList, setCheckList, setExcitation, setTwoCheckList]
  )

  const DeleteAllCheckItem = React.useCallback(() => {
    const copyList = excitationList.filter((item: any) => !checkList.includes(item.sender_id))
    setExcitation([...copyList])
    setTwoCheckList([])
    setCheckList([])
  }, [checkList, excitationList, setCheckList, setExcitation, setTwoCheckList])

  const onChange = React.useCallback(
    (list: any[]) => {
      setThreeAll(checkList.length === excitationList.length)
      setThreeindeterminate(!!checkList.length && checkList.length < excitationList.length)
      setCheckList([...list])
    },
    [checkList.length, excitationList.length, setCheckList, setThreeAll, setThreeindeterminate]
  )
  const styleFnTop = React.useMemo(() => {
    return gu_w0 === 100 || gu_w0 === 0
  }, [gu_w0])

  const styleFnDown = React.useMemo(() => {
    return gu_cnt0 === 1 || gu_cnt0 === 20
  }, [gu_cnt0])
  return (
    <div className={StyleSheet.twoSteps}>
      <div className={StyleSheet.ThreeStepTitle}>
        <span className={StyleSheet.StepTitleHeader}>发送序列</span>
        <div style={{ display: 'flex', width: '400px', alignItems: 'center' }}>
          <div className={StyleSheetOther.inputEdit} style={{ display: 'flex', alignItems: 'center' }}>
            <span className={StyleSheetOther.headerDesc} style={{ marginRight: '8px', display: 'flex', width: 65 }}>
              发送次数:
            </span>
            <Input
              className={styleFnDown ? StyleSheetOther.numberInputDisabled : StyleSheetOther.numberInput}
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
              className={styleFnTop ? StyleSheetOther.numberInputDisabled : StyleSheetOther.numberInput}
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

      <div style={{ height: 208 }} ref={drop}>
        <CheckboxGroup onChange={onChange} style={{ width: '100%' }} value={checkList}>
          <div className={StyleSheet.scrollDiv} style={{ height: checkListMemo > 0 ? 170 : 208 }}>
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
          </div>
        </CheckboxGroup>
        {checkListMemo > 0 && <DeleteCompoentMemo number={checkListMemo} DeleteCheckItem={DeleteAllCheckItem} />}
      </div>
    </div>
  )
}

function StepComponents() {
  const current = stepStore(state => state.current)
  const [List, setList] = useState<Record<string, any>>([])
  const { params, setHasMore } = useRequestStore()
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

  React.useEffect(() => {
    getExcitationList(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const { Step } = Steps
  const steps = [
    {
      title: '设置名称',
      content: <OneSteps />
    },
    {
      title: '选择目标激励',
      content: <TwoSteps List={List} />
    },
    {
      title: '编辑发送序列',
      content: <ThreeSteps />
    }
  ]

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className={StyleSheet.stepHeader}>
          <Steps current={current} className={StyleSheet.stepBackground}>
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
