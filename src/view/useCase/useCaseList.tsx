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
import { throwErrorMessage } from 'Src/until/message'
import zhCN from 'antd/lib/locale/zh_CN'
// import deleteImage from 'Src/asstes/image/Deletes.svg'
// import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import styles from 'Src/view/Project/project/project.less'
import style from 'Src/view/excitation/excitation.less'

const customizeRender = () => <DefaultValueTips content='暂无项目' />

const request = {
  group_type: 3,
  key_word: '',
  status: null,
  page: 1,
  page_size: 10,
  sort_field: 'create_time',
  sort_order: 'descend'
}

interface Resparams {
  group_type: number
  key_word?: string
  status?: null | number
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

interface projectInfoType {
  id: number
  name: string
  port: string
  status: number | null
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}

const ExcitationList: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
  const history = useHistory()
  // 目标列表参数
  const [params, setParams] = useState(request)

  // 项目列表
  const [excitationList, setExcitationList] = useState<any>([])

  // 页码
  const [total, setTotal] = useState<number>()
  // 存储单个项目信息
  //   const [excitationInfo, setExcitationInfo] = useState('')

  // 修改,更新 弹出框基本数据集合
  //   const [modalData, setModalData] = useState({ excitationId: '', fixTitle: false, isModalVisible: false })

  //  删除弹出框基本数据集合
  //   const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)

  // 创建项目 弹出框
  const createProjectModal = () => {
    history.push({
      pathname: '/UseCaseList/createUseCase',
      state: {
        type: 'one',
        isFixForm: false,
        name: '新建用例'
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

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
      pathname: '/UseCaseList/Detail',
      state: {
        type: item,
        isFixForm: true,
        name: '用例详情'
      }
    })
  }

  // 更新参数获取列表
  const updateParams = (value: string) => {
    setParams({ ...params, key_word: value })
  }

  // 删除项目弹出框
  //   const deleteProject = (id: string, value: boolean) => {
  //     setModalData({ ...modalData, excitationId: id })
  //     setCommonModleStatus(value)
  //   }

  // 更改页码
  const changePage = (page: number, pageSize: number) => {
    setParams({ ...params, page, page_size: pageSize })
  }

  //   const deleteProjectRight = async () => {
  //     try {
  //       const res = await removeProject(modalData.projectId)
  //       if (res.data) {
  //         setParams({ ...params, key_word: '', page: 1 })
  //         setCommonModleStatus(false)
  //         message.success('删除成功')
  //       }
  //     } catch (error) {
  //       throwErrorMessage(error, { 1009: '项目删除失败' })
  //     }
  //   }

  // 获取激励列表
  const getExcitationList = async (value: Resparams) => {
    try {
      const result = await excitationListFn(value)
      if (result.data) {
        setTotal(result.data.total)
        setExcitationList(result.data.results)
      }
    } catch (error) {
      throwErrorMessage(error, { 1004: '请求资源未找到' })
    }
  }

  React.useEffect(() => {
    getExcitationList(params)
  }, [params])

  const cloumnMap = [
    {
      width: '20%',
      title: '用例名称',
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <span
            className={styles.tableProjectName}
            role='time'
            onClick={() => {
              lookDetail(row)
            }}
          >
            {row.name}
          </span>
        )
      }
    },
    {
      width: '30%',
      title: '用例描述',
      dataIndex: 'desc',
      key: 'desc'
    },
    {
      width: '8%',
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <div className={style.excitaion_operation}>
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
          </div>
        )
      }
    }
  ]

  return (
    <div className={styles.AnBan_main}>
      <div className={styles.AnBan_header}>
        <span className={styles.AnBan_header_title}>用例列表</span>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput placeholder='根据名称搜索用例' onChangeValue={updateParams} />
          <CreateButton width='146px' name='新建用例 ' size='large' type='primary' onClick={createProjectModal} />
        </div>
      </div>
      <div className={styles.tableConcent}>
        <ConfigProvider locale={zhCN} renderEmpty={customizeRender}>
          <Table rowKey='id' dataSource={excitationList} columns={cloumnMap} pagination={false} />
        </ConfigProvider>
      </div>
      <div className={styles.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={changePage} pagenums={params.page} />
      </div>
    </div>
  )
}

export default withRouter(ExcitationList)
