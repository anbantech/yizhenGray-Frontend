/* eslint-disable indent */
import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
// import ExcitationModal from 'Src/components/Modal/excitationModal/excitationModal'
import Table from 'antd/lib/table'
import ConfigProvider from 'antd/lib/config-provider'
import { useState } from 'react'
import * as React from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
// import { message } from 'antd'
import { excitationListFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import zhCN from 'antd/lib/locale/zh_CN'
// import deleteImage from 'Src/assets/image/Deletes.svg'
// import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import { StepRef } from 'Src/view/Project/task/createTask/newCreateTask'
import useDepCollect from 'Src/util/Hooks/useDepCollect'
import PaginationsAge from 'Src/components/Pagination/Pagina'

import OmitComponents from 'Src/components/OmitComponents/OmitComponents'
import inputStyle from 'Src/components/Input/searchInput/searchInput.less'

import styles from 'Src/view/Project/project/project.less'
import style from '../excitation.less'

// import { changeParams } from '../Project/taskDetail/taskDetailUtil/getTestLog'

const customizeRender = () => <DefaultValueTips content='暂无数据' />

const request = {
  target_type: '0',
  key_word: '',
  status: null,
  page: 1,
  page_size: 10,
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

interface ChildRef {
  inputRef: React.MutableRefObject<StepRef | null>
}

type stateType = { [key: string]: string }

type ResparamsType = Record<string, any>
const OneExcitationList: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
  const childRef: ChildRef = {
    inputRef: React.useRef<StepRef | null>(null)
  }

  const history = useHistory()
  // 展示菜单
  const [updateMenue, setUpdateMenue] = useState<number>(-1)

  // 项目管理
  const [excitationList, setExcitationList] = useState<ResparamsType[]>([])

  // 页码
  const [total, setTotal] = useState<number>()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, depCollect, depData] = useDepCollect(request)

  // loading加载

  const [loading, setLoading] = useState(true)
  // 存储单个项目信息
  //   const [excitationInfo, setExcitationInfo] = useState('')

  // 修改,更新 弹出框基本数据集合
  //   const [modalData, setModalData] = useState({ excitationId: '', fixTitle: false, isModalVisible: false })

  //  删除弹出框基本数据集合
  //   const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)

  // 创建项目 弹出框
  const createProjectModal = React.useCallback(() => {
    const createExcitation = '/OneExcitationList/createExcitation'
    history.push({
      pathname: `${createExcitation}`,
      state: {
        type: 'one',
        isFixForm: false,
        name: '新建外设'
      }
    })
  }, [history])

  // 控制弹出框消失隐藏
  //   const cancel = (e: boolean) => {
  //     setParams({ ...params, key_word: '', page: 1 })
  //   }

  // 删除弹出框
  //   const CommonModleClose = (value: boolean) => {
  //     setCommonModleStatus(value)
  //   }

  // 查看详情
  const lookDetail = (item: any) => {
    history.push({
      pathname: '/OneExcitationList/Detail',
      state: {
        info: { id: item.stimulus_id },
        type: 'one',
        isFixForm: true,
        name: '外设详情'
      }
    })
  }
  const updateParams = (value: string) => {
    depCollect(true, { key_word: value, page: 1 })
  }

  const changePage = (page: number, pageSize: number) => {
    depCollect(true, { page, page_size: pageSize })
  }

  const setOperation = (value1?: any, type?: string, value2?: any) => {
    setLoading(true)
    switch (type) {
      case 'page':
        changePage(value1, value2)
        break
      case 'key_word':
        updateParams(value1)
        break
      default:
        return null
    }
  }

  // 更新参数获取列表

  // 删除项目弹出框
  //   const deleteProject = (id: string, value: boolean) => {
  //     setModalData({ ...modalData, excitationId: id })
  //     setCommonModleStatus(value)
  //   }

  // 获取激励列表
  const getExcitationList = async (value: Resparams) => {
    try {
      const result = await excitationListFn(value)
      if (result.data) {
        setTotal(result.data.total)
        setExcitationList(result.data.results)
      }
      setLoading(false)
    } catch (error) {
      throwErrorMessage(error, { 1004: '请求资源未找到' })
    }
  }

  React.useEffect(() => {
    getExcitationList(depData)
  }, [depData])

  const cloumnMap = [
    {
      width: '15%',
      title: '外设名称',
      dataIndex: 'stimulus_name',
      key: 'stimulus_name',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <span
            className={styles.tableProjectName}
            role='time'
            key={row.stimulus_id}
            onClick={() => {
              lookDetail(row)
            }}
          >
            {row.stimulus_name}
          </span>
        )
      }
    },
    {
      width: '15%',
      title: '是否生效',
      dataIndex: 'is_enable',
      key: 'is_enable',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return <span>{row.is_enable ? '是' : '否'}</span>
      }
    },
    {
      width: '15%',
      title: '端口类别',
      dataIndex: 'stimulus_value',
      key: 'stimulus_value'
    },

    {
      width: '10%',
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <div className={style.excitaion_operation} key={row.stimulus_id}>
            <span
              style={{ marginLeft: '10px', marginRight: '10px' }}
              role='button'
              tabIndex={0}
              onClick={() => {
                lookDetail(row)
              }}
            >
              查看详情
            </span>
            <OmitComponents id={row.stimulus_id} updateMenue={setUpdateMenue} status={updateMenue} />
          </div>
        )
      }
    }
  ]

  return (
    <div className={styles.AnBan_main}>
      <div className={(styles.AnBan_header, style.AnBan_headerRadio)}>
        <span className={styles.AnBan_header_title}>外设列表</span>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput ref={childRef.inputRef} className={inputStyle.searchInput} placeholder='根据名称搜索外设' onChangeValue={setOperation} />
          <CreateButton
            name='创建外设'
            size='large'
            type='primary'
            onClick={() => {
              createProjectModal()
            }}
          />
        </div>
      </div>
      <div className={styles.tableConcent}>
        <ConfigProvider locale={zhCN} renderEmpty={customizeRender}>
          <Table rowKey={record => record.stimulus_id} dataSource={excitationList} loading={loading} columns={cloumnMap} pagination={false} />
        </ConfigProvider>
      </div>
      <div className={styles.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={depData.page_size} getParams={setOperation} pagenums={depData.page} />
      </div>
      {/* <ExcitationModal
        visible={modalData.isModalVisible}
        hideModal={cancel}
        projectInfo={excitationInfo}
        fixTitle={modalData.fixTitle}
        id={modalData.excitationId}
        width={480}
      /> */}
      {/* <CommonModle
        IsModalVisible={CommonModleStatus}
        deleteProjectRight={() => {
          deleteExcitationRight()
        }}
        CommonModleClose={CommonModleClose}
        name='删除激励'
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      /> */}
    </div>
  )
}

export default withRouter(OneExcitationList)
