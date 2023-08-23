import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
import ModalpPop from 'Src/components/Modal/projectMoadl/BaseModle'
import Table from 'antd/lib/table'
import OmitComponents from 'Src/components/OmitComponents/OmitComponents'
import ConfigProvider from 'antd/lib/config-provider'
import * as React from 'react'
import { useState } from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import { message, Tooltip } from 'antd'
import { ProList, removeProject } from 'Src/services/api/projectApi'
import { throwErrorMessage } from 'Src/util/message'
import zhCN from 'antd/lib/locale/zh_CN'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import inputStyle from 'Src/components/Input/searchInput/searchInput.less'
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

  // 展示菜单
  const [updateMenue, setUpdateMenue] = useState<number>(-1)

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

  // 存储项目信息
  const [data, setData] = useState()

  // 新建项目 弹出框
  const createProjectModal = () => {
    setModalData({ ...modalData, fixTitle: false, isModalVisible: true })
  }

  // 控制弹出框消失隐藏
  const cancel = (e: boolean) => {
    setModalData({ ...modalData, fixTitle: false, isModalVisible: e })
    setParams({ ...params, page: 1 })
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
    setParams({ ...params, key_word: value, page: 1 })
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
  const changePage = (page: number, type: string, pageSize: number) => {
    setParams({ ...params, page, page_size: pageSize })
  }

  const onChange = (val: string) => {
    switch (val) {
      case '删除':
        deleteProject(`${updateMenue}`, true)
        break
      case '修改':
        fixProject(data)
        break
      default:
        return null
    }
  }

  const deleteProjectRight = async () => {
    try {
      const res = await removeProject(modalData.projectId)
      if (res.data) {
        setParams({ ...params, page: 1 })
        setCommonModleStatus(false)
      }
      if (res.code === 0) {
        message.success('项目删除成功')
      }
    } catch (error) {
      CommonModleClose(false)
      throwErrorMessage(error, { 1009: '项目删除失败', 1007: '操作频繁' })
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
      ellipsis: true,
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <Tooltip title={row.name} placement='bottomLeft' overlayClassName={styles.overlay}>
            <span
              className={styles.tableProjectName}
              role='time'
              onClick={() => {
                jumpTask(row)
              }}
            >
              {row.name}
            </span>
          </Tooltip>
        )
      }
    },
    {
      width: '25%',
      title: '项目描述',
      dataIndex: 'desc',
      ellipsis: true,
      key: 'desc',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <Tooltip title={row.name} placement='bottomLeft' overlayClassName={styles.overlay}>
            <span>{row.desc}</span>
          </Tooltip>
        )
      }
    },
    {
      width: '10%',
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
              style={{ marginLeft: '10px', marginRight: '30px' }}
              role='button'
              tabIndex={0}
              onClick={() => {
                jumpTask(row)
              }}
            >
              查看详情
            </span>
            <OmitComponents
              data={row}
              setData={setData}
              id={row.id}
              type='project'
              onChange={onChange}
              updateMenueFn={setUpdateMenue}
              status={updateMenue}
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
          <SearchInput className={inputStyle.searchInput} placeholder='根据名称搜索项目' onChangeValue={updateParams} />
          <CreateButton width='146px' name='新建项目' size='large' type='primary' onClick={createProjectModal} />
        </div>
      </div>
      <div className={styles.tableConcent}>
        <ConfigProvider locale={zhCN} renderEmpty={customizeRender}>
          <Table rowKey='id' dataSource={projectList} columns={columns} pagination={false} />
        </ConfigProvider>
      </div>
      <div className={styles.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={params.page_size} getParams={changePage} pagenums={params.page} />
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
        btnName='删除'
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      />
    </div>
  )
}

export default withRouter(Project)
