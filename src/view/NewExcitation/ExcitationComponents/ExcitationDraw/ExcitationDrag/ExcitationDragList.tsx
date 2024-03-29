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
  checkListStore,
  GlobalStatusStore,
  LeftDropListStore,
  RightDragListStore,
  useExicitationSenderId,
  // useExicitationSenderId,
  useRequestStore
} from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import { generateUUID, warn } from 'Src/util/common'
import utils from 'Src/view/template/TemplateResult/utils'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ExcitationDragHeader from './ExcitationDragHeader'
import ExcitationDrag from './ExcitationDrag'
import StyleSheet from '../excitationDraw.less'
import BtnCompoents from './ExcitationDragHeaderBtn'
import TemplateDialog from './ExcitaionDragExportModal'
import NewExcitationMoadl from '../../Agreement/createModal'

const BottomFooterDrag = ({ DeleteCheckItem, exportAll, saveConfig }: any) => {
  return (
    <div className={StyleSheet.BottomFooterDragBody}>
      <div className={StyleSheet.buleButton} role='time' onClick={saveConfig}>
        添加到激励序列
      </div>
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
  const { confirm } = Modal
  const [isClose, setClose] = React.useState(true)
  const [visible, setVsible] = useState(false)
  const { visibility, chioceModalStatus } = useMenu()
  const [newCreate, setNewCreate] = useState(false)
  const [dependenceInfo, setDependenceInfo] = useState({ id: '', name: '', parents: [] })
  const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)
  const [sender_id, setDragList_id] = React.useState(-1)
  const { params, setKeyWord, setHasMore, setPage, initData } = useRequestStore()

  const checkAllList = RightDragListStore(state => state.checkAllList)
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)
  const setUpdateStatus = GlobalStatusStore(state => state.setUpdateStatus)
  // set sender_id
  const setSender_id = useExicitationSenderId(state => state.setSender_id)
  const updateStatus = GlobalStatusStore(state => state.updateStatus)
  const id = useExicitationSenderId(state => state.sender_id)
  const destoryEveryItem = ArgeementDropListStore(state => state.destoryEveryItem)
  const setDeatilStatus = ArgeementDropListStore(state => state.setDeatilStatus)
  const setIndeterminate = RightDragListStore(state => state.setIndeterminate)
  const checkAllSenderIdList = RightDragListStore(state => state.checkAllSenderIdList)
  const setCheckAll = RightDragListStore(state => state.setCheckAll)
  const clearCheckList = RightDragListStore(state => state.clearCheckList)
  const clearCheckDropList = checkListStore(state => state.clearCheckList)
  const DragList = RightDragListStore(state => state.DragList)
  const setRightList = RightDragListStore(state => state.setRightList)
  const DropList = LeftDropListStore(state => state.DropList)
  const { setParamsChange } = LeftDropListStore()
  const setLeftList = LeftDropListStore(state => state.setLeftList)
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
          if (result.data.results.length === 0) {
            return setRightList([])
          }
          const newList = [...result.data.results]
          if (newList.length === 0) {
            setHasMore(false)
          }

          if (newList.length === result.data.total) {
            setHasMore(false)
          } else {
            setHasMore(true)
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

  const close = React.useCallback(() => {
    setSpinning(false)
    CommonModleClose(false)
  }, [])

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
          }
          message.success('删除成功')
        }
        setSender_id(null)
        setDragList_id(-1)
        setUpdateStatus(!updateStatus)
        setPage(1)
      }
      close()
    } catch (error) {
      close()
      throwErrorMessage(error, { 1009: '删除失败' })
    }
  }, [DeleteCheckoneItem, allIn, checkAllList, close, sender_id, setPage, setSender_id, setUpdateStatus, updateStatus])

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
    setDragList_id(id)
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
    if (!id) {
      const child_id_list = [[], [...checkAllList], []]
      try {
        const res = await createExcitationList({ name: '激励序列1', desc: '激励序列1', gu_cnt0: 1, gu_w0: 0, child_id_list })
        if (res.code === 0) {
          clearCheckList()
          setUpdateStatus(!updateStatus)
          message.success('创建成功')
        }
      } catch {
        clearCheckList()
        message.error('创建失败')
      }
    } else {
      clearCheckDropList()
      const DropListFilter = DragList.filter((item: any) => {
        return checkAllList.includes(item.sender_id)
      })

      const DropItem = DropListFilter.map((item: any) => {
        const Item = { ...item, keys: generateUUID() }
        return Item
      })

      const DropListCopy = [...DropList, ...DropItem]
      setLeftList([...DropListCopy])
      clearCheckList()
      setParamsChange(true)
      setSendBtnStatus(false)
    }
  }, [
    DragList,
    DropList,
    setParamsChange,
    checkAllList,
    clearCheckDropList,
    clearCheckList,
    id,
    setLeftList,
    setSendBtnStatus,
    setUpdateStatus,
    updateStatus
  ])

  // 取消新建
  const cancelNewCreate = React.useCallback(() => {
    destoryEveryItem()
    setNewCreate(false)
    setPage(1)
  }, [destoryEveryItem, setPage])

  // 打开新建弹窗 清除sender_id
  const opneModal = React.useCallback((value: boolean) => {
    setDragList_id(-1)
    setNewCreate(value)
  }, [])

  //  导入导出功能
  const configFn = React.useCallback(() => {
    confirm({
      icon: <ExclamationCircleOutlined style={{ color: '#262626' }} />,
      title: '导出失败',
      content: '激励导出失败，请重新导出',
      okText: '确认',
      cancelText: '取消'
    })
  }, [confirm])

  // 导出单个激励
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
            message: `激励正在下载中 ${c}/${a}`,
            placement: 'bottomLeft',
            duration: null
          })
        } else {
          notification.close('1')
        }
      })
      clearCheckList()
    },

    [checkAllList, clearCheckList, configFn]
  )

  // 导出全部
  const exportAll = () => {
    exportTemplate(checkAllList)
  }

  const onOk = React.useCallback(() => {
    destoryEveryItem()
    setVsible(false)
    setPage(1)
  }, [destoryEveryItem, setPage])

  React.useEffect(() => {
    return () => {
      initData()
      clearCheckList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={isClose ? StyleSheet.rightList : StyleSheet.rightListClose}>
      {isClose && (
        <>
          <BtnCompoents setVsible={setVsible} setNewCreate={opneModal} />
          <SearchInput className={StyleSheet.ExictationInput} placeholder='根据名称搜索激励' onChangeValue={updateParams} />
          {DragList?.length ? <ExcitationDragHeader /> : null}
          {/* 列表拖拽 */}
          <ExcitationDrag onChange={onChange} />
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
        btnName='删除'
        name='删除激励'
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      />
      <LookUpDependence visibility={visibility as boolean} name='激励关联信息' data={dependenceInfo} choiceModal={chioceModalStatus} width='520px' />
      {visible && <TemplateDialog visible={visible} onOk={onOk} />}
      {newCreate && <NewExcitationMoadl visibility={newCreate} sender_id={sender_id} onOk={cancelNewCreate} />}
    </div>
  )
}

const ExcitationList = React.memo(ExcitationListMemo)

export default ExcitationList
