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
import PaginationsAge from 'Src/components/Pagination/Pagina'
import API from 'Src/services/api'
import { TemplateListParams } from 'Src/globalType/Param'
import { TemplateListResponse } from 'Src/globalType/Response'
// import deleteImage from 'Image/Deletes.svg'
import { useDialog } from 'Src/util/Hooks/useDialog'
import styles from './templateList.less'

const customizeRender = () => <DefaultValueTips content='暂无模版' />

const request: TemplateListParams = {
  key_word: '',
  page: 1,
  page_size: 10,
  sort_field: 'create_time',
  sort_order: 'descend'
}
// TODO 隐藏 删除,修改功能
const disPlayNone = false
const Project: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
  const history = useHistory()
  const location = useLocation()
  // 目标列表参数
  const [params, setParams] = useState<TemplateListParams>(request)

  // 项目管理
  const [templateList, setTemplateList] = useState<TemplateListResponse['results']>([])

  // 缓存当前点击的模板信息
  const [currentTemplate] = useState<TemplateListResponse['results'][number]>()

  // 页码
  const [total, setTotal] = useState<number>(0)

  //  删除弹出框
  const { visible: commonModleStatus, changeDialogStatus: changeCommonDialogStatus } = useDialog()

  // 更新参数获取列表
  const changeKeywords = useCallback((value: string) => {
    setParams(params => ({ ...params, key_word: value, page: 1 }))
  }, [])

  // 查看/修改/创建末班
  const jumpTemplate = useCallback(
    (value?: TemplateListResponse['results'][number], editOriginalTemplate = false, readonlyBaseTemplate = false) => {
      const { id: templateId } = value || {}
      history.push({
        pathname: '/templateList/template',
        state: { templateId, templateType: 'user_defined', readonlyBaseTemplate, editOriginalTemplate, from: location.pathname }
      })
    },
    [history, location.pathname]
  )

  // 更改页码
  const changePage = useCallback((page: number, type?: string, pageSize?: number) => {
    setParams(params => ({ ...params, page, page_size: pageSize }))
  }, [])

  // 删除某个项目
  const deleteTemplate = useCallback(async () => {
    if (!currentTemplate?.id) return
    try {
      const res = await API.removeTemplate({ templates: [currentTemplate.id] })
      if (res.data) {
        setParams(params => ({ ...params, key_word: '', page: 1 }))
        changeCommonDialogStatus(false)
        if (res.data.success_list.length > 0) {
          message.success('删除成功')
        } else {
          message.error(res.data.fail_list[0])
        }
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }, [changeCommonDialogStatus, currentTemplate])

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
                  jumpTemplate(row, false, true)
                }}
              >
                查看详情
              </span>
              {/* <span
                style={{ marginLeft: '10px', marginRight: '10px' }}
                role='button'
                tabIndex={0}
                onClick={() => {
                  jumpTemplate(row, true, false)
                }}
              >
                修改
              </span>
              <img
                src={deleteImage}
                alt=''
                onClick={() => {
                  setCurrentTemplate(row)
                  // TODO: 具体删除方式待讨论，目前直接点击删除
                  // changeCommonDialogStatus(true)
                  deleteTemplate()
                }}
              /> */}
            </div>
          )
        }
      }
    ],
    [jumpTemplate]
  )

  return (
    <div className={styles.AnBan_main}>
      <div className={styles.AnBan_header}>
        <span className={styles.AnBan_header_title}>模板列表</span>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput placeholder='根据名称搜索模板' onChangeValue={changeKeywords} />
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
        deleteProjectRight={deleteTemplate}
        CommonModleClose={changeCommonDialogStatus}
        name='删除模板'
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      />
    </div>
  )
}

export default withRouter(Project)
