import SearchInput from 'Src/components/Input/searchInput/searchInput'
import CreateButton from 'Src/components/Button/createButton'
import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from 'Src/view/Project/task/taskList/task.less'
import { deleteneExcitaionListMore, excitationListFn, lookUpDependenceUnit } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import ExcitationModal from 'Src/components/Modal/excitationModal/excitationModal'
import LookUpDependence from 'Src/components/Modal/taskModal/lookUpDependence'
import useMenu from 'Src/util/Hooks/useMenu'
import { message } from 'antd'
import Leftstyles from './NewExcitation.less'
import StyleSheet from './ExcitationComponents/ExcitationDraw/excitationDraw.less'
import { checkListStore, GlobalStatusStore, RouterStore, useExicitationSenderId } from './ExcitaionStore/ExcitaionStore'

const request = {
  target_type: '3',
  key_word: '',
  status: null,
  page: 1,
  page_size: 12,
  sort_field: 'create_time',
  sort_order: 'descend'
}

interface Resparams {
  target_type: number | string
  key_word?: string
  status?: null | number
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}
type ResparamsType = Record<string, any>

const ExcitationLeftMemo = React.forwardRef((props, myRef) => {
  const layoutRef = useRef<any>()
  const sender_idRef = useRef<number | null>()
  const updateStatus = GlobalStatusStore(state => state.updateStatus)
  const sendBtnStatus = GlobalStatusStore(state => state.sendBtnStatus)
  // 保存moadl
  const setShowModal = RouterStore(state => state.setShowModal)
  // get sender_id curd
  const sender_id = useExicitationSenderId(state => state.sender_id)
  // set sender_id
  const setSender_id = useExicitationSenderId(state => state.setSender_id)
  // 清除筛选框
  const clearCheckList = checkListStore(state => state.clearCheckList)

  const [params, setParams] = useState<Resparams>({ ...request })
  // 任务列表参数
  const [excitationList, setExcitationList] = useState<ResparamsType[]>([])
  // 动态设置虚拟列表高度
  const [height, setHeight] = useState(700)

  // 数据是否还有更多
  const [hasMoreData, setHasMore] = useState(true)

  // 弹窗
  const [modalData, setModalData] = useState({ fixTitle: false, isModalVisible: false, excitationInfo: {} })

  //  删除弹出框
  const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)

  //
  const [spinning, setSpinning] = useState(false)

  // 新建任务
  const createNewExcitationList = React.useCallback(() => {
    setModalData({ ...modalData, fixTitle: false, isModalVisible: true })
  }, [modalData])

  // 更新参数获取列表
  const updateParams = (value: string) => {
    setExcitationList([])
    setParams({ ...params, key_word: value, page: 1 })
  }

  //  更改页码
  const loadMoreData = () => {
    const newPage = params.page_size + 10
    setParams({ ...params, page_size: newPage })
  }

  // 删除弹出框函数
  const CommonModleClose = React.useCallback(
    (value: boolean) => {
      setCommonModleStatus(value)
      if (!value) {
        setParams({ ...params, page: 1 })
      }
    },
    [params]
  )

  const deleteExcitation = React.useCallback(async () => {
    setSpinning(true)
    try {
      const res = await deleteneExcitaionListMore(`${sender_id}`)
      if (res.code === 0) {
        setExcitationList([])
        setSender_id(null)
        setSpinning(false)
        CommonModleClose(false)
        message.success('删除成功')
      }
    } catch (error) {
      setSpinning(false)
      CommonModleClose(false)
      throwErrorMessage(error, { 1009: '删除失败' })
    }
  }, [CommonModleClose, sender_id, setSender_id])

  const keepCheckTask = React.useCallback(
    (id: number) => {
      if (id) {
        setSender_id(id)
      }
    },
    [setSender_id]
  )

  // 获取激励列表
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
          if (!sender_id) {
            keepCheckTask(sender_id as number)
          } else {
            keepCheckTask(newList[0].sender_id)
          }

          if (newList.length === result.data.total) {
            setHasMore(false)
          }
          setExcitationList([...newList])
        }
      } catch (error) {
        throwErrorMessage(error, { 1004: '请求资源未找到' })
      }
    },
    [keepCheckTask, sender_id]
  )

  // 跳转修改任务
  const fixExcitation = (item: Record<string, any>) => {
    const Item = { ...modalData, fixTitle: true, isModalVisible: true, excitationInfo: item }
    setModalData({ ...Item })
  }

  useEffect(() => {
    getExcitationList({ ...params })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, updateStatus])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        let num = 700
        if (height >= 1940 && height >= 2300) {
          num = height * 0.8
        } else if (height >= 1400 && height <= 1940) {
          num = height * 0.5
        } else {
          num = height * 0.2
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

  const leaveModalFn = React.useCallback(
    (id: number) => {
      sender_idRef.current = id
      if (!sendBtnStatus) {
        setShowModal(true)
      } else {
        clearCheckList()
        setSender_id(id)
      }
    },
    [clearCheckList, sendBtnStatus, setSender_id, setShowModal]
  )

  // 控制弹出框消失隐藏
  const cancel = React.useCallback(
    (e: boolean) => {
      setParams({ ...params, key_word: '', page: 1 })
      setModalData({ ...modalData, fixTitle: false, isModalVisible: e, excitationInfo: {} })
    },
    [modalData, params]
  )

  const { visibility, chioceModalStatus } = useMenu()

  // 存储关联任务信息
  const [dependenceInfo, setDependenceInfo] = useState({ id: '', name: '', parents: [] })

  // 获取依赖信息
  const getDependenceInfo = React.useCallback(
    async item => {
      const res = await lookUpDependenceUnit(item.sender_id)
      if (res.data) {
        setDependenceInfo(res.data)
      }
      chioceModalStatus(true)
    },
    [chioceModalStatus]
  )

  React.useImperativeHandle(myRef, () => ({
    getId: () => {
      return sender_idRef
    },
    clearId: () => {
      sender_idRef.current = null
    }
  }))
  const operationFn = React.useCallback(
    (item: any, cb: (item: any) => void, type: string) => {
      if (sender_id !== item.sender_id && !sendBtnStatus) {
        setShowModal(true)
      } else {
        setSender_id(item.sender_id)
        if (type === 'boolean') {
          return cb(true)
        }
        cb(item)
      }
    },
    [sendBtnStatus, sender_id, setSender_id, setShowModal]
  )
  return (
    <div className={Leftstyles.excitationLeftBoby} ref={layoutRef}>
      <div className={StyleSheet.btn_header}>
        <CreateButton
          width='100%'
          height='36px'
          borderRadius='4px'
          name='新建激励发送列表'
          size='small'
          type='primary'
          onClick={createNewExcitationList}
        />
      </div>
      <SearchInput className={StyleSheet.ExictationInputLeft} placeholder='根据名称搜索激励' onChangeValue={updateParams} />
      <div className={styles.concentBody}>
        <InfiniteScroll
          dataLength={excitationList.length}
          next={loadMoreData}
          hasMore={hasMoreData}
          height={height}
          style={{ overflowX: 'hidden' }}
          loader={
            <p style={{ textAlign: 'center', width: '216px' }}>
              <span className={styles.listLine} />
              <span className={styles.concentList}>内容已经加载完毕</span>
            </p>
          }
          endMessage={
            <p style={{ textAlign: 'center', width: '216px' }}>
              <span className={styles.listLine} />
              <span className={styles.concentList}>内容已经加载完毕</span>
            </p>
          }
        >
          {excitationList.map((item: any) => {
            return (
              <div
                tabIndex={item.sender_id}
                role='button'
                className={sender_id === item.sender_id ? Leftstyles.itemActive : Leftstyles.item}
                onClick={() => {
                  leaveModalFn(item.sender_id)
                }}
                key={item.sender_id}
              >
                <span>{item.name}</span>
                <div className={Leftstyles.icon_layout}>
                  <div
                    role='time'
                    onClick={e => {
                      e.stopPropagation()
                      operationFn(item, fixExcitation, 'fn')
                    }}
                    className={styles.taskListLeft_editImg}
                  />
                  <div
                    role='time'
                    className={styles.taskListLeft_detailImg}
                    onClick={e => {
                      e.stopPropagation()
                      operationFn(item, CommonModleClose, 'boolean')
                    }}
                  />
                  <div
                    role='time'
                    className={styles.taskListLeft_linkInfo}
                    onClick={e => {
                      e.stopPropagation()
                      operationFn(item, getDependenceInfo, 'fn')
                    }}
                  />
                </div>
              </div>
            )
          })}
        </InfiniteScroll>
      </div>
      <>
        {CommonModleStatus && (
          <CommonModle
            IsModalVisible={CommonModleStatus}
            spinning={spinning}
            deleteProjectRight={deleteExcitation}
            CommonModleClose={CommonModleClose}
            ing='删除中'
            name='删除激励发送列表'
            concent='是否确认删除？'
          />
        )}
        {modalData.isModalVisible && (
          <ExcitationModal
            visible={modalData.isModalVisible}
            hideModal={cancel}
            excitationInfo={modalData.excitationInfo}
            fixTitle={modalData.fixTitle}
            sender_id={sender_id}
            width={480}
          />
        )}
        {visibility && (
          <LookUpDependence
            visibility={visibility as boolean}
            name='激励发送列表关联信息'
            data={dependenceInfo}
            choiceModal={chioceModalStatus}
            width='760px'
          />
        )}
      </>
    </div>
  )
})

const ExcitationLeft = React.memo(ExcitationLeftMemo)
export default ExcitationLeft
