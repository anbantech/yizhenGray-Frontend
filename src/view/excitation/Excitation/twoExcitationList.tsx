/* eslint-disable indent */
import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
import Table from 'antd/lib/table'
import ConfigProvider from 'antd/lib/config-provider'
import { useState } from 'react'
import * as React from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import { message } from 'antd'
import { deleteneExcitaionListMore, excitationListFn, lookUpDependenceUnit } from 'Src/services/api/excitationApi'
import OmitComponents from 'Src/components/OmitComponents/OmitComponents'
import { throwErrorMessage } from 'Src/util/message'
import zhCN from 'antd/lib/locale/zh_CN'
import useDepCollect from 'Src/util/Hooks/useDepCollect'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import { StepRef } from 'Src/view/Project/task/createTask/newCreateTask'
import inputStyle from 'Src/components/Input/searchInput/searchInput.less'
import styles from 'Src/view/Project/project/project.less'
import LookUpDependence from 'Src/components/Modal/taskModal/lookUpDependence'
import useMenu from 'Src/util/Hooks/useMenu'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import style from '../excitation.less'

// import { changeParams } from '../Project/taskDetail/taskDetailUtil/getTestLog'

const customizeRender = () => <DefaultValueTips content='暂无数据' />

const request = {
  target_type: '1',
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
const TwoExcitationList: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
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
  // 存储关联任务信息
  const [dependenceInfo, setDependenceInfo] = useState({ id: '', name: '', parents: [] })

  const [spinning, setSpinning] = useState(false)
  const chioceBtnLoading = (val: boolean) => {
    setSpinning(val)
  }

  // 查看关联任务
  const { visibility, chioceModalStatus, deleteVisibility, CommonModleClose } = useMenu()

  // loading加载
  const [loading, setLoading] = useState(true)

  const createProjectModal = React.useCallback(() => {
    const createOneExcitation = '/TwoExcitationList/createDoubleExcitationGroup'
    history.push({
      pathname: `${createOneExcitation}`,
      state: {
        type: 'two',
        isFixForm: false,
        name: '新建激励单元',
        fromPathName: '/TwoExcitationList'
      }
    })
  }, [history])

  // 查看详情
  const lookDetail = (item: any) => {
    history.push({
      pathname: '/TwoExcitationList/Detail',
      state: {
        info: { id: item.sender_id },
        type: 'two',
        isFixForm: true,
        lookDetail: true,
        name: '激励单元详情',
        fromPathName: '/TwoExcitationList'
      }
    })
  }

  const jumpUpdateWeb = (item: any) => {
    history.push({
      pathname: '/TwoExcitationList/update',
      state: {
        info: { id: item },
        type: 'two',
        lookDetail: false,
        isFixForm: true,
        name: '修改激励单元',
        fromPathName: '/TwoExcitationList'
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
  // 获取关联信息
  const getDependenceInfo = React.useCallback(async () => {
    const res = await lookUpDependenceUnit(updateMenue)
    if (res.data) {
      setDependenceInfo(res.data)
    }
    chioceModalStatus(true)
  }, [chioceModalStatus, updateMenue])

  const onChange = (val: string) => {
    switch (val) {
      case '删除':
        CommonModleClose(true)
        break
      case '查看关联信息':
        getDependenceInfo()
        break
      case '修改':
        jumpUpdateWeb(updateMenue)
        break
      default:
        return null
    }
  }
  const deleteProjectRight = async () => {
    chioceBtnLoading(true)
    try {
      const res = await deleteneExcitaionListMore(`${updateMenue}`)
      if (res.data) {
        if (res.data.success_list.length > 0) {
          depCollect(true, { page: 1, page_size: 10 })
          message.success('激励单元删除成功')
        } else {
          message.error(res.data.fail_list[0])
        }
      }
      CommonModleClose(false)
      chioceBtnLoading(false)
    } catch (error) {
      CommonModleClose(false)
      chioceBtnLoading(false)
      throwErrorMessage(error, { 1009: '激励单元删除失败' })
    }
  }
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
      title: '激励单元名称',
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <span
            key={row.sender_id}
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
      width: '15%',
      title: '激励单元描述',
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
          <div className={style.excitaion_operation}>
            <span
              style={{ marginLeft: '10px', marginRight: '30px' }}
              role='button'
              tabIndex={0}
              onClick={() => {
                lookDetail(row)
              }}
            >
              查看详情
            </span>
            <OmitComponents id={row.sender_id} onChange={onChange} updateMenue={setUpdateMenue} status={updateMenue} />
          </div>
        )
      }
    }
  ]

  return (
    <div className={styles.AnBan_main}>
      <div className={(styles.AnBan_header, style.AnBan_headerRadio)}>
        <span className={styles.AnBan_header_title}>激励单元管理</span>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput ref={childRef.inputRef} className={inputStyle.searchInput} placeholder='根据名称搜索激励单元' onChangeValue={setOperation} />
          <CreateButton
            name='新建激励单元'
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
          <Table
            rowKey={record => (record.sender_id ? record.sender_id : record.stimulus_id)}
            dataSource={excitationList}
            loading={loading}
            columns={cloumnMap}
            pagination={false}
          />
        </ConfigProvider>
      </div>
      <div className={styles.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={depData.page_size} getParams={setOperation} pagenums={depData.page} />
      </div>
      {deleteVisibility ? (
        <CommonModle
          IsModalVisible={deleteVisibility}
          deleteProjectRight={() => {
            deleteProjectRight()
          }}
          CommonModleClose={CommonModleClose}
          ing='删除中'
          name='删除激励单元'
          spinning={spinning}
          concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
        />
      ) : null}
      <LookUpDependence
        visibility={visibility as boolean}
        name='激励单元关联信息'
        data={dependenceInfo}
        choiceModal={chioceModalStatus}
        width='760px'
      />
    </div>
  )
}
export default withRouter(TwoExcitationList)
