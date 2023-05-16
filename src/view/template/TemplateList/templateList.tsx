import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
import Table from 'antd/lib/table'
import ConfigProvider from 'antd/lib/config-provider'
import { useState, useCallback, useMemo, useEffect } from 'react'
import * as React from 'react'
import { RouteComponentProps, StaticContext, useHistory, useLocation, withRouter } from 'react-router'
import { message } from 'antd'
import { throwErrorMessage } from 'Src/util/message'
import zhCN from 'antd/lib/locale/zh_CN'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import LookUpDependence from 'Src/components/Modal/taskModal/lookUpDependence'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import API from 'Src/services/api'
import { getTemplateDependence } from 'Src/services/api/templateApi'
import { TemplateListParams } from 'Src/globalType/Param'
import { TemplateListResponse } from 'Src/globalType/Response'
import useMenu from 'Src/util/Hooks/useMenu'
import OmitComponents from 'Src/components/OmitComponents/OmitComponents'
import { useDialog } from 'Src/util/Hooks/useDialog'
import inputStyle from 'Src/components/Input/searchInput/searchInput.less'
import styles from './templateList.less'

const customizeRender = () => <DefaultValueTips content='暂无模板' />
type ResparamsType = Record<string, any>
const request: TemplateListParams = {
  key_word: '',
  page: 1,
  page_size: 10,
  sort_field: 'create_time',
  sort_order: 'descend'
}

const Project: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
  const history = useHistory()
  const location = useLocation()
  // 目标列表参数
  const [params, setParams] = useState<TemplateListParams>(request)

  // 项目管理
  const [templateList, setTemplateList] = useState<TemplateListResponse['results']>([])

  // 页码
  const [total, setTotal] = useState<number>(0)

  //  删除弹出框
  const { visible: commonModleStatus, changeDialogStatus: changeCommonDialogStatus } = useDialog()

  //
  const [data, setData] = useState<ResparamsType>(null!)

  // 存储关联任务信息
  const [dependenceInfo, setDependenceInfo] = useState({})

  // 更新参数获取列表
  const changeKeywords = useCallback((value: string) => {
    setParams(params => ({ ...params, key_word: value, page: 1 }))
  }, [])

  const [spinning, setSpinning] = useState(false)
  const chioceBtnLoading = (val: boolean) => {
    setSpinning(val)
  }

  // 查看关联任务
  const { visibility, chioceModalStatus } = useMenu()

  // 查看/修改/创建末班
  const jumpTemplate = useCallback(
    (value?: ResparamsType, editOriginalTemplate = true, readonlyBaseTemplate = true) => {
      const { id: templateId } = value || {}
      history.push({
        pathname: '/templateList/templateDetail',
        state: { templateId, templateType: 'user_defined', readonlyBaseTemplate, editOriginalTemplate, from: location.pathname }
      })
    },
    [history, location.pathname]
  )

  // 展示菜单
  const [updateMenue, setUpdateMenue] = useState<number>(-1)

  // 更改页码
  const changePage = useCallback((page: number, type?: string, pageSize?: number) => {
    setParams(params => ({ ...params, page, page_size: pageSize }))
  }, [])

  // 删除某个项目
  const deleteTemplate = useCallback(async () => {
    chioceBtnLoading(true)
    try {
      const res = await API.removeTemplate({ templates: [updateMenue] })
      if (res.data) {
        setParams(params => ({ ...params, key_word: '', page: 1 }))
        changeCommonDialogStatus(false)
        if (res.data.success_list.length > 0) {
          chioceBtnLoading(false)
          message.success('删除成功')
        } else {
          message.error(res.data.fail_list[0])
        }
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }, [changeCommonDialogStatus, updateMenue])

  // 获取项目管理
  const getTemplateList = useCallback(async (value: TemplateListParams) => {
    try {
      const result = await API.getTemplateList(value)
      if (result.data) {
        setTotal(result.data.total)
        setTemplateList(result.data.results)
      }
    } catch (error) {
      throwErrorMessage(error, { 1004: '请求资源未找到' })
    }
  }, [])

  // 获取关联信息
  const getDependenceInfo = React.useCallback(async () => {
    const res = await getTemplateDependence(updateMenue)
    if (res.data) {
      setDependenceInfo(res.data)
    }
    chioceModalStatus(true)
  }, [chioceModalStatus, updateMenue])

  const onChange = useCallback(
    (val: string) => {
      switch (val) {
        case '删除':
          changeCommonDialogStatus(true)
          break
        case '查看关联信息':
          getDependenceInfo()
          break
        case '修改':
          jumpTemplate(data)
          break
        default:
          return null
      }
    },
    [changeCommonDialogStatus, data, getDependenceInfo, jumpTemplate]
  )

  useEffect(() => {
    getTemplateList(params)
  }, [getTemplateList, params])

  const columns = useMemo(
    () => [
      {
        width: '20%',
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
        // eslint-disable-next-line react/display-name
        render: (_: any, row: any) => {
          return (
            <span
              className={styles.tableProjectName}
              role='time'
              onClick={() => {
                jumpTemplate(row, false, true)
              }}
            >
              {row.name}
            </span>
          )
        }
      },
      {
        width: '30%',
        title: '模板描述',
        dataIndex: 'desc',
        key: 'desc'
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
                role='button'
                tabIndex={0}
                onClick={() => {
                  jumpTemplate(row, false, true)
                }}
              >
                查看详情
              </span>
              <OmitComponents data={row} setData={setData} id={row.id} updateMenue={setUpdateMenue} onChange={onChange} status={updateMenue} />
            </div>
          )
        }
      }
    ],
    [jumpTemplate, onChange, updateMenue]
  )

  return (
    <div className={styles.AnBan_main}>
      <div className={styles.AnBan_header}>
        <span className={styles.AnBan_header_title}>模板列表</span>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput className={inputStyle.searchInput} placeholder='根据名称搜索模板' onChangeValue={changeKeywords} />
          <CreateButton width='146px' name='新建模板' size='large' type='primary' onClick={() => jumpTemplate(undefined, false, false)} />
        </div>
      </div>
      <div className={styles.tableConcent}>
        <ConfigProvider locale={zhCN} renderEmpty={customizeRender}>
          <Table rowKey='id' dataSource={templateList} columns={columns} pagination={false} />
        </ConfigProvider>
      </div>
      <div className={styles.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={changePage} pagenums={params.page} />
      </div>
      <CommonModle
        IsModalVisible={commonModleStatus}
        deleteProjectRight={() => {
          deleteTemplate()
        }}
        CommonModleClose={changeCommonDialogStatus}
        ing='删除中'
        spinning={spinning}
        name='删除模板'
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      />
      <LookUpDependence visibility={visibility as boolean} name='模版关联信息' data={dependenceInfo} choiceModal={chioceModalStatus} width='760px' />
    </div>
  )
}

export default withRouter(Project)
