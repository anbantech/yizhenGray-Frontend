import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
import ModalpPop from 'Src/components/Modal/projectMoadl/BaseModle'
import Table from 'antd/lib/table'
import ConfigProvider from 'antd/lib/config-provider'
import { useState } from 'react'
import * as React from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import { message } from 'antd'
import { ProList, removeProject } from 'Src/services/api/projectApi'
import { throwErrorMessage } from 'Src/util/message'
import zhCN from 'antd/lib/locale/zh_CN'
import deleteImage from 'Image/Deletes.svg'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import styles from './project.less'

const customizeRender = () => <DefaultValueTips content='暂无项目' />

const request = {
  key_word: '',
  page: 1,
  page_size: 10,
  sort_field: 'create_time',
  sort_order: 'descend'
}

interface Resparams {
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

interface projectListType {
  [key: string]: string | number
}

interface projectInfoType {
  id: number
  name: string
  desc: string
  create_time: string
  create_user: string
  update_time: string
  update_user: string | null
}
const Project: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
  const history = useHistory()
  // 目标列表参数
  const [params, setParams] = useState(request)

  // 项目管理
  const [projectList, setProjectList] = useState<projectListType[]>([])

  // 页码
  const [total, setTotal] = useState<number>()

  // 存储单个项目信息
  const [projectInfo, setProjectInfo] = useState('')

  // 修改,更新 弹出框基本数据集合
  const [modalData, setModalData] = useState({ projectId: '', fixTitle: false, isModalVisible: false })

  //  删除弹出框
  const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)

  // 创建项目 弹出框
  const createProjectModal = () => {
    setModalData({ ...modalData, fixTitle: false, isModalVisible: true })
  }

  // 控制弹出框消失隐藏
  const cancel = (e: boolean) => {
    setModalData({ ...modalData, fixTitle: false, isModalVisible: e })
    setParams({ ...params, key_word: '', page: 1 })
  }

  // 删除弹出框
  const CommonModleClose = (value: boolean) => {
    setCommonModleStatus(value)
  }

  // 修改项目
  const fixProject = (item: any) => {
    setProjectInfo({ ...item })
    setModalData({ ...modalData, projectId: item.id, fixTitle: true, isModalVisible: true })
  }

  // 更新参数获取列表
  const updateParams = (value: string) => {
    setParams({ ...params, key_word: value })
  }

  // 查看详情 跳转任务列表 携带项目Id
  const jumpTask = (value: projectInfoType) => {
    const { id, desc, name } = value
    history.push({
      pathname: '/projects/Tasks',
      state: { projectInfo: { projectId: id, projectDesc: desc, projectName: name } }
    })
  }

  // 删除项目弹出框
  const deleteProject = (id: string, value: boolean) => {
    setModalData({ ...modalData, projectId: id })
    setCommonModleStatus(value)
  }
  // 更改页码
  const changePage = (page: number, pageSize: number) => {
    setParams({ ...params, page, page_size: pageSize })
  }

  const deleteProjectRight = async () => {
    try {
      const res = await removeProject(modalData.projectId)
      if (res.data) {
        setParams({ ...params, key_word: '', page: 1 })
        setCommonModleStatus(false)
        message.success('删除成功')
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }

  // 获取项目管理
  const getProjectList = async (value: Resparams) => {
    try {
      const result = await ProList(value)
      if (result.data) {
        setTotal(result.data.total)
        setProjectList(result.data.results)
      }
    } catch (error) {
      throwErrorMessage(error, { 1004: '请求资源未找到' })
    }
  }

  React.useEffect(() => {
    getProjectList(params)
  }, [params])
  const columns = [
    {
      width: '20%',
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <span
            className={styles.tableProjectName}
            role='time'
            onClick={() => {
              jumpTask(row)
            }}
          >
            {row.name}
          </span>
        )
      }
    },
    {
      width: '30%',
      title: '项目描述',
      dataIndex: 'desc',
      key: 'desc'
    },
    {
      width: '10%',
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <div className={styles.Opera_detaile}>
            <span
              role='button'
              tabIndex={0}
              onClick={() => {
                jumpTask(row)
              }}
            >
              查看详情
            </span>
            <span
              style={{ marginLeft: '10px', marginRight: '10px' }}
              role='button'
              tabIndex={0}
              onClick={() => {
                fixProject(row)
              }}
            >
              修改
            </span>
            <img
              src={deleteImage}
              alt=''
              onClick={() => {
                deleteProject(row.id, true)
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
        <span className={styles.AnBan_header_title}>项目管理</span>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput placeholder='根据名称搜索项目' onChangeValue={updateParams} />
          <CreateButton width='146px' name='新建项目' size='large' type='primary' onClick={createProjectModal} />
        </div>
      </div>
      <div className={styles.tableConcent}>
        <ConfigProvider locale={zhCN} renderEmpty={customizeRender}>
          <Table rowKey='id' dataSource={projectList} columns={columns} pagination={false} />
        </ConfigProvider>
      </div>
      <div className={styles.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={changePage} pagenums={params.page} />
      </div>
      <ModalpPop
        visible={modalData.isModalVisible}
        hideModal={cancel}
        projectInfo={projectInfo}
        fixTitle={modalData.fixTitle}
        id={modalData.projectId}
        width={480}
      />
      <CommonModle
        IsModalVisible={CommonModleStatus}
        deleteProjectRight={deleteProjectRight}
        CommonModleClose={CommonModleClose}
        name='删除项目'
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      />
    </div>
  )
}

export default withRouter(Project)
