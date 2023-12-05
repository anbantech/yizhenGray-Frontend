import React, { useEffect, useCallback, useState } from 'react'

import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
import zhCN from 'antd/lib/locale/zh_CN'
import delete_icon from 'Src/assets/image/icon_delete.svg'
import inputStyle from 'Src/components/Input/searchInput/searchInput.less'
import styles from 'Src/view/Project/project/project.less'
import { useNewModelingStore } from 'Src/view/Modeling/Store/ModelStore'
import ModelModal from 'Components/Modal/newModalOrFixModal/newModelOrFoxModel'
import { getTargetDetails } from 'Src/services/api/modelApi'
import { ConfigProvider, message, Table, Tooltip } from 'antd'
import { NoTask } from 'Src/view/NewExcitation/ExcitationComponents/ExcitationDraw/ExcitationDraw'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import { throwErrorMessage } from 'Src/util/common'
import { useHistory } from 'react-router'
import { RightDetailsAttributesStore } from '../../Store/ModeleRightListStore/RightListStoreList'

const customizeRender = () => <DefaultValueTips content='暂无外设建模' />

function ModelingIndex() {
  // 新建的模态框
  const [visible, setVisible] = useState(false)
  const [detailInfo, setDetailInfo] = useState({ name: '', processor: '', desc: '' })
  // 删除的模态框
  const [closeingVisibleModal, setCloseingVisibleModal] = useState(false)
  // 是否修改
  const [isFix, setIsFix] = useState(false)
  // 路由
  const history = useHistory()
  const { setPage, setKeyWords, initParams, getModelTargetList, modelList, deleteModelTarget, setModelId } = useNewModelingStore()

  const params = useNewModelingStore(state => state.params)
  const loading = useNewModelingStore(state => state.loading)
  const total = useNewModelingStore(state => state.total)

  const rightAttributeMap = RightDetailsAttributesStore(state => state.rightAttributeMap)
  // 关键字搜索
  const updateParams = useCallback(
    (value: string) => {
      setKeyWords(value)
    },
    [setKeyWords]
  )
  // 新建建模任务
  const creatModalOrFixModal = useCallback(val => {
    setVisible(val)
  }, [])

  // 删除建模模态框打开,关闭
  const deleteTargetModalStatus = useCallback(
    (val: boolean, id: number) => {
      setModelId(id)
      setCloseingVisibleModal(val)
    },
    [setModelId]
  )

  // 删除目标机
  const deleteTargetModeling = React.useCallback(async () => {
    try {
      const res = await deleteModelTarget()
      if (res.code === 0) {
        initParams()
        message.success('删除成功')
      }
      setCloseingVisibleModal(false)
    } catch (error) {
      setCloseingVisibleModal(false)
      throwErrorMessage(error)
    }
  }, [deleteModelTarget, initParams])

  // 更新页码
  const changePage = (page: number, type: string, pageSize: number) => {
    setPage({ page, page_size: pageSize })
  }

  // 获取建模详情
  const getTargetDetailsIndex = async (id: number) => {
    try {
      const res: any = await getTargetDetails(id)
      setDetailInfo(res.data)
      return res
    } catch (error) {
      throwErrorMessage(error)
    }
  }

  // 修改操作
  const fixTargetModeling = (id: number) => {
    getTargetDetailsIndex(id)
      .then((res: any) => {
        if (res.data) {
          setIsFix(true) // 通知模态框是否是修改操作
          setModelId(id) // 更新store里的建模id
          setVisible(true) // 打开模态框
        }
        return res
      })
      .catch(error => {
        throwErrorMessage(error)
      })
  }

  // 跳转到建模详情
  const jumpModelingDetails = useCallback(
    async (id: number, name: string) => {
      rightAttributeMap('Target', id)
      history.push({
        pathname: '/Modeling/Detailes',
        state: { name, id }
      })
    },
    [rightAttributeMap, history]
  )

  // Todo
  useEffect(() => {
    getModelTargetList()
  }, [getModelTargetList, params])

  // 表格cloumn
  const columns = [
    {
      width: '20%',
      title: '外设建模名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <Tooltip title={row.name} placement='bottomLeft' overlayClassName={styles.overlay}>
            <span
              className={styles.tableProjectName}
              role='time'
              onClick={() => {
                // jumpTask(row)
              }}
            >
              {row.name}
            </span>
          </Tooltip>
        )
      }
    },
    {
      width: '15%',
      title: '处理器类型',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      width: '20%',
      title: '外设建模描述',
      dataIndex: 'desc',
      ellipsis: true,
      key: 'desc',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <Tooltip title={row.name} placement='bottomLeft' overlayClassName={styles.overlay}>
            <span style={{ color: '#333333' }}>{row.desc ? row.desc : '暂无描述'}</span>
          </Tooltip>
        )
      }
    },
    {
      width: '15%',
      // eslint-disable-next-line react/display-name
      title: () => {
        return <span style={{ display: 'block', width: '100%', textAlign: 'right' }}> 操作</span>
      },
      dataIndex: 'operations',
      key: 'operations',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <div className={styles.Opera_detaile}>
            <span
              style={{ marginLeft: '10px', marginRight: '15px' }}
              className={styles.Opera_hover}
              role='button'
              tabIndex={0}
              onClick={() => {
                jumpModelingDetails(row.id, row.name)
              }}
            >
              查看详情
            </span>
            <span className={styles.Opera_hover} role='time' onClick={() => fixTargetModeling(row.id)}>
              修改
            </span>
            <img
              src={delete_icon}
              alt=''
              style={{ marginLeft: '15px' }}
              role='time'
              onClick={() => {
                deleteTargetModalStatus(true, row.id)
              }}
            />
          </div>
        )
      }
    }
  ]

  return (
    <div className={styles.AnBan_main}>
      <div className={styles.AnBan_header}>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput className={inputStyle.searchInput} placeholder='根据名称搜索建模' onChangeValue={updateParams} />
          <CreateButton
            width='146px'
            name='新建建模任务'
            size='large'
            type='primary'
            onClick={() => {
              creatModalOrFixModal(true)
            }}
          />
        </div>
      </div>
      <>
        {modelList?.length >= 1 ? (
          <div>
            <div className={styles.tableConcent}>
              <ConfigProvider locale={zhCN} renderEmpty={customizeRender}>
                <Table rowKey='id' dataSource={modelList} columns={columns} pagination={false} loading={loading} />
              </ConfigProvider>
            </div>
            <div className={styles.AnBan_PaginationsAge}>
              <PaginationsAge length={total} num={params.page_size} getParams={changePage} pagenums={params.page} />
            </div>
          </div>
        ) : (
          <div style={{ height: '700px', display: 'flex' }}>
            <NoTask />
          </div>
        )}
      </>
      <>
        {visible && <ModelModal detailInfo={detailInfo} visible={visible} creatModalOrFixModal={creatModalOrFixModal} isFix={isFix} />}
        <CommonModle
          IsModalVisible={closeingVisibleModal}
          deleteProjectRight={deleteTargetModeling}
          CommonModleClose={deleteTargetModalStatus}
          name='删除建模任务'
          btnName='删除'
          concent='是否确认删除该建模任务？'
        />
      </>
    </div>
  )
}

export default ModelingIndex
