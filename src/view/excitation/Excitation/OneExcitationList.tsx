/* eslint-disable indent */
import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
import Table from 'antd/lib/table'
import ConfigProvider from 'antd/lib/config-provider'
import { useState } from 'react'
import * as React from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import OmitComponents from 'Src/components/OmitComponents/OmitComponents'
import { excitationListFn, lookUpDependencePeripheral } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import zhCN from 'antd/lib/locale/zh_CN'
import useDelete from 'Src/util/Hooks/useDelete'
import { StepRef } from 'Src/view/Project/task/createTask/newCreateTask'
import useDepCollect from 'Src/util/Hooks/useDepCollect'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import LookUpDependence from 'Src/components/Modal/taskModal/lookUpDependence'
import inputStyle from 'Src/components/Input/searchInput/searchInput.less'
import useMenu from 'Src/util/Hooks/useMenu'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import styles from 'Src/view/Project/project/project.less'
import style from '../excitation.less'

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

  // 查看关联任务
  const { visibility, chioceModalStatus, deleteVisibility, CommonModleClose, spinnig, chioceBtnLoading } = useMenu()

  // 存储关联任务信息
  const [dependenceInfo, setDependenceInfo] = useState({ id: '', name: '', parents: [] })

  // 删除
  const { deleteExcitationRight } = useDelete()

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

  // 查看详情
  const lookDetail = (item: any) => {
    history.push({
      pathname: '/OneExcitationList/Detail',
      state: {
        info: { id: item.stimulus_id },
        type: 'one',
        lookDetail: true,
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

  // 获取关联信息
  const getDependenceInfo = React.useCallback(async () => {
    const res = await lookUpDependencePeripheral(updateMenue)
    if (res.data) {
      setDependenceInfo(res.data)
    }
    chioceModalStatus(true)
  }, [chioceModalStatus, updateMenue])

  const jumpUpdateWeb = (item: any) => {
    history.push({
      pathname: '/OneExcitationList/update',
      state: {
        info: { id: item },
        type: 'one',
        lookDetail: false,
        isFixForm: false,
        name: '外设'
      }
    })
  }

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
      // eslint-disable-next-line react/display-name
      title: () => {
        return <span style={{ display: 'block', width: '100%', textAlign: 'right' }}> 操作</span>
      },
      dataIndex: 'operations',
      key: 'operations',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <div className={style.excitaion_operation} key={row.stimulus_id}>
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
            <OmitComponents id={row.stimulus_id} updateMenue={setUpdateMenue} onChange={onChange} status={updateMenue} />
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
      <CommonModle
        IsModalVisible={deleteVisibility}
        deleteProjectRight={() => {
          deleteExcitationRight()
        }}
        CommonModleClose={CommonModleClose}
        name='删除外设'
        ing='删除中'
        spinnig={spinnig}
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      />
      <LookUpDependence visibility={visibility as boolean} name='外设关联信息' data={dependenceInfo} choiceModal={chioceModalStatus} width='760px' />
    </div>
  )
}

export default withRouter(OneExcitationList)
