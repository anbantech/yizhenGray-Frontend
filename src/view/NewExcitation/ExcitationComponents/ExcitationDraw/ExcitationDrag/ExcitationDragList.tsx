import * as React from 'react'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import { useState } from 'react'
import SearchInput from 'Src/components/Input/searchInput/searchInput'
import styles from 'Src/layout/LeftNav/leftNav.less'
import { createExcitationList, deleteneExcitaionListMore, excitationListFn, lookUpDependenceUnit } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import { message, Modal, notification } from 'antd'
import useMenu from 'Src/util/Hooks/useMenu'
import LookUpDependence from 'Src/components/Modal/taskModal/lookUpDependence'
import {
  ArgeementDropListStore,
  RightDragListStore,
  useExicitationSenderId,
  // useExicitationSenderId,
  useRequestStore
} from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import { warn } from 'Src/util/common'
import utils from 'Src/view/template/TemplateResult/utils'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { shallow } from 'zustand/shallow'
import { isEqual } from 'lodash'
import ExcitationDragHeader from './ExcitationDragHeader'
import ExcitationDrag from './ExcitationDrag'
import StyleSheet from '../excitationDraw.less'
import BtnCompoents from './ExcitationDragHeaderBtn'
import TemplateDialog from './ExcitaionDragExportModal'
import NewExcitationMoadl from '../../Agreement/createModal'

const BottomFooterDrag = ({ DeleteCheckItem, exportAll, saveConfig }: any) => {
  const sender_id = useExicitationSenderId(state => state.sender_id)
  const isShowSave = React.useMemo(() => {
    return sender_id === -1
  }, [sender_id])
  return (
    <div className={StyleSheet.BottomFooterDragBody}>
      {isShowSave && (
        <div className={StyleSheet.buleButton} role='time' onClick={saveConfig}>
          添加到发送列表
        </div>
      )}
      <div className={StyleSheet.exportButtn} role='time' onClick={exportAll}>
        导出
      </div>
      <div className={StyleSheet.exportButtn} role='time' onClick={DeleteCheckItem}>
        删除
      </div>
    </div>
  )
}

const BottomFooterDragMemo = React.memo(BottomFooterDrag)

function ExcitationListMemo() {
  const layoutRef = React.useRef<any>()
  const { confirm } = Modal
  const [isClose, setClose] = React.useState(true)
  const [visible, setVsible] = useState(false)
  const { visibility, chioceModalStatus } = useMenu()
  const [newCreate, setNewCreate] = useState(false)
  const [dependenceInfo, setDependenceInfo] = useState({ id: '', name: '', parents: [] })
  const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)
  const [sender_id, setSender_id] = React.useState(-1)
  const { params, setKeyWord, setHasMore, setPage } = useRequestStore()

  const checkAllList = RightDragListStore(
    state => state.checkAllList,
    (pre, old) => isEqual(pre, old)
  )
  const destoryEveryItem = ArgeementDropListStore(state => state.destoryEveryItem)
  const setDeatilStatus = ArgeementDropListStore(state => state.setDeatilStatus)
  const setIndeterminate = RightDragListStore(state => state.setIndeterminate)
  const checkAllSenderIdList = RightDragListStore(state => state.checkAllSenderIdList, shallow)
  const setCheckAll = RightDragListStore(state => state.setCheckAll)

  const DragList = RightDragListStore(
    state => state.DragList,
    (pre, old) => isEqual(pre, old)
  )
  const setRightList = RightDragListStore(state => state.setRightList)

  // 删除弹出框函数
  const CommonModleClose = (value: boolean) => {
    setCommonModleStatus(value)
  }

  const [spinning, setSpinning] = useState(false)

  const getExcitationList = React.useCallback(
    async value => {
      try {
        const result = await excitationListFn(value)
        if (result.data) {
          const newList = [...result.data.results]
          if (newList.length === 0) {
            setHasMore(false)
            return false
          }

          if (newList.length === result.data.total) {
            setHasMore(false)
          }
          setRightList([...newList])
        }
      } catch (error) {
        throwErrorMessage(error, { 1004: '请求资源未找到' })
      }
    },
    [setHasMore, setRightList]
  )

  React.useEffect(() => {
    getExcitationList(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  // 动态设置虚拟列表高度
  const [height, setHeight] = React.useState(700)

  const updateParams = (value: string) => {
    setRightList([])
    setKeyWord(value)
  }

  const DeleteCheckoneItem = React.useCallback(
    (val: number) => {
      const DropListFilter = DragList.filter((item: any) => {
        return val !== item.sender_id
      })
      const CheckListFilter = checkAllList.filter((item: any) => {
        return val !== item
      })
      checkAllSenderIdList([...CheckListFilter])
      setRightList([...DropListFilter])

      if (DropListFilter.length === 0) {
        setCheckAll(false)
      } else {
        setCheckAll(CheckListFilter.length === DropListFilter.length)
      }
      setIndeterminate(!!CheckListFilter.length && CheckListFilter.length < DropListFilter.length)
    },
    [DragList, checkAllList, checkAllSenderIdList, setCheckAll, setIndeterminate, setRightList]
  )

  const allIn = React.useCallback(() => {
    const copyList = DragList.filter(item => !checkAllList.includes(item.sender_id))
    setRightList([...copyList])
    checkAllSenderIdList([])
    setIndeterminate(false)
    setCheckAll(false)
  }, [DragList, checkAllList, checkAllSenderIdList, setCheckAll, setIndeterminate, setRightList])

  const deleteExcitation = React.useCallback(async () => {
    setSpinning(true)
    const val = checkAllList.join(',')
    try {
      const res = await deleteneExcitaionListMore(sender_id === -1 ? val : `${sender_id}`)
      if (res.data) {
        if (res.code === 0) {
          if (sender_id === -1) {
            allIn()
          } else {
            DeleteCheckoneItem(sender_id)
            setSender_id(-1)
          }
          setRightList([])
          message.success('删除成功')
        } else {
          message.error(res.message)
        }
        setPage(1)
      }
      setSpinning(false)
      CommonModleClose(false)
    } catch (error) {
      CommonModleClose(false)
      throwErrorMessage(error, { 1009: '删除失败' })
    }
  }, [DeleteCheckoneItem, allIn, checkAllList, sender_id, setPage, setRightList])

  // 获取关联信息
  const getDependenceInfo = React.useCallback(
    async (id: number) => {
      const res = await lookUpDependenceUnit(id)
      if (res.data) {
        setDependenceInfo(res.data)
      }
      chioceModalStatus(true)
    },
    [chioceModalStatus]
  )

  const onChange = (val: string, id: number) => {
    setSender_id(id)
    switch (val) {
      case 'delete':
        CommonModleClose(true)
        break
      case 'info':
        getDependenceInfo(id)
        break
      case 'detail':
        setNewCreate(true)
        setDeatilStatus(true)
        break
      case 'export':
        utils.templateDataLoader.singleExporter(id)
        break
      default:
        return null
    }
  }

  // 删除框
  const DeleteCheckItem = React.useCallback(() => {
    CommonModleClose(true)
  }, [])

  // 筛选列表 出现底部按钮
  const LengthMemo = React.useMemo(() => {
    return checkAllList.length
  }, [checkAllList])

  // 当新建激励发送列表没有内容时  点击添加到发送列表按钮调用
  const saveConfig = React.useCallback(async () => {
    const child_id_list = [[], [...checkAllList], []]
    const res = await createExcitationList({ name: '默认1', desc: '默认创建', gu_cnt0: 1, gu_w0: 0, child_id_list })
    if (res.code === 0) {
      checkAllSenderIdList([])
      setIndeterminate(false)
      setCheckAll(false)
      message.success('创建成功')
    }
  }, [checkAllList, checkAllSenderIdList, setCheckAll, setIndeterminate])

  // 取消新建
  const cancelNewCreate = React.useCallback(() => {
    setNewCreate(false)
    setPage(1)
  }, [setPage])

  // 打开新建弹窗 清除sender_id
  const opneModal = React.useCallback((value: boolean) => {
    setSender_id(-1)
    setNewCreate(value)
  }, [])

  //  导入导出功能
  const configFn = React.useCallback(() => {
    confirm({
      icon: <ExclamationCircleOutlined style={{ color: '#262626' }} />,
      title: '导出失败',
      content: '模板导出失败，请重新导出',
      okText: '确认',
      cancelText: '取消'
    })
  }, [confirm])

  // 导出单个模板
  const exportTemplate = React.useCallback(
    async (templateIdList: number[]) => {
      if (templateIdList.length === 0) {
        warn(true, '您没有选择激励')
        configFn()
        return
      }
      await utils.templateDataLoader.exporter(checkAllList, '激励合集', (c, a) => {
        if (c < a) {
          notification.info({
            key: '1',
            message: `模板正在下载中 ${c}/${a}`,
            placement: 'bottomLeft',
            duration: null
          })
        } else {
          notification.close('1')
        }
      })
      allIn()
    },

    [allIn, checkAllList, configFn]
  )

  // 导出全部
  const exportAll = () => {
    exportTemplate(checkAllList)
  }

  const onOk = React.useCallback(() => {
    destoryEveryItem()
    setVsible(false)
  }, [destoryEveryItem])

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        let num = 700
        if (height >= 1940 && height >= 2300) {
          num = height * 0.8
        } else if (height >= 1400 && height <= 1940) {
          num = height * 0.5
        } else {
          num = height * 0.3
        }
        setHeight(height - Math.ceil(num as number))
      }
    })

    if (layoutRef.current) {
      resizeObserver.observe(layoutRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])
  return (
    <div className={isClose ? StyleSheet.rightList : StyleSheet.rightListClose} ref={layoutRef}>
      {isClose && (
        <>
          <BtnCompoents setVsible={setVsible} setNewCreate={opneModal} />
          <SearchInput className={StyleSheet.ExictationInput} placeholder='根据名称搜索激励' onChangeValue={updateParams} />
          {DragList?.length && <ExcitationDragHeader />}
          {/* 列表拖拽 */}
          <ExcitationDrag height={height} onChange={onChange} />
          {LengthMemo ? <BottomFooterDragMemo DeleteCheckItem={DeleteCheckItem} exportAll={exportAll} saveConfig={saveConfig} /> : null}
        </>
      )}
      {isClose ? (
        <div
          role='time'
          className={styles.closePositionimgRgiht}
          onClick={() => {
            setClose(!isClose)
          }}
        />
      ) : (
        <div
          role='time'
          className={styles.openPositionimgRgiht}
          onClick={() => {
            setClose(!isClose)
          }}
        />
      )}
      <CommonModle
        IsModalVisible={CommonModleStatus}
        spinning={spinning}
        deleteProjectRight={deleteExcitation}
        CommonModleClose={CommonModleClose}
        ing='删除中'
        name='删除激励'
        concent='是否确认删除？'
      />
      <LookUpDependence visibility={visibility as boolean} name='激励关联信息' data={dependenceInfo} choiceModal={chioceModalStatus} width='760px' />
      {visible && <TemplateDialog visible={visible} onOk={onOk} />}
      {newCreate && <NewExcitationMoadl visibility={newCreate} sender_id={sender_id} onOk={cancelNewCreate} />}
    </div>
  )
}

const ExcitationList = React.memo(ExcitationListMemo)

export default ExcitationList
