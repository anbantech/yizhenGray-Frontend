import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
import Table from 'antd/lib/table'
import ConfigProvider from 'antd/lib/config-provider'
import { useState, useCallback } from 'react'
import * as React from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import { message } from 'antd'
import { throwErrorMessage } from 'Src/until/message'
import zhCN from 'antd/lib/locale/zh_CN'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import API from 'Src/services/api'
import { TemplateListParams } from 'Src/globalType/Param'
import { TemplateListResponse } from 'Src/globalType/Response'
import deleteImage from 'Src/asstes/image/Deletes.svg'
import { useDialog } from 'Src/until/Hooks/useDialog'
import styles from './templateList.less'

const customizeRender = () => <DefaultValueTips content='暂无项目' />

const request: TemplateListParams = {
  key_word: '',
  page: 1,
  page_size: 10,
  sort_field: 'create_time',
  sort_order: 'descend'
}

const Project: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
  const history = useHistory()
  // 目标列表参数
  const [params, setParams] = useState<TemplateListParams>(request)

  // 项目列表
  const [templateList, setTemplateList] = useState<TemplateListResponse['results']>([])

  // 页码
  const [total, setTotal] = useState<number>(0)

  //  删除弹出框
  const { visible: commonModleStatus, changeDialogStatus: changeCommonDialogStatus } = useDialog()

  // 更新参数获取列表
  const changeKeywords = useCallback((value: string) => {
    setParams(params => ({ ...params, key_word: value }))
  }, [])

  // 查看详情 携带模板ID
  const jumpTemplate = useCallback((value?: TemplateListResponse['results'][number]) => {
    const { id: templateId } = value || {}
    history.push({
      pathname: '/templateList/template',
      state: { templateId }
    })
  }, [history])

  // 更改页码
  const changePage = useCallback((page: number, pageSize: number) => {
    setParams(params => ({ ...params, page, page_size: pageSize }))
  }, [])

  // 删除某个项目
  const deleteTemplate = useCallback(async (templateId: number) => {
    try {
      const res = await API.removeTemplate({ templates: [templateId] })
      if (res.data) {
        setParams(params => ({ ...params, key_word: '', page: 1 }))
        changeCommonDialogStatus(false)
        message.success('删除成功')
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }, [changeCommonDialogStatus])

  // 获取项目列表
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

  React.useEffect(() => {
    getTemplateList(params)
  }, [getTemplateList, params])

  const columns = [
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
              jumpTemplate(row)
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
                jumpTemplate(row)
              }}
            >
              查看详情
            </span>
            <span
              style={{ marginLeft: '10px', marginRight: '10px' }}
              role='button'
              tabIndex={0}
              onClick={() => {
                // 修改模板
              }}
            >
              修改
            </span>
            <img
              src={deleteImage}
              alt=''
              onClick={() => {
                // deleteTemplate(row.id, true)
                // 弹出删除框，回调进行删除
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
        <span className={styles.AnBan_header_title}>模板列表</span>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput placeholder='根据名称搜索模板' onChangeValue={changeKeywords} />
          <CreateButton width='146px' name='新建模板' size='large' type='primary' onClick={() => jumpTemplate()} />
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
        name='删除项目'
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      />
    </div>
  )
}

export default withRouter(Project)
