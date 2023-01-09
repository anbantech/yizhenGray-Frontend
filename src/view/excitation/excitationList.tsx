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
import { Radio, RadioChangeEvent } from 'antd'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import styles from 'Src/view/Project/project/project.less'
import style from './excitation.less'

const customizeRender = () => <DefaultValueTips content='暂无项目' />

const request = {
  group_type: 0,
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

const An_ButtonNameMap = {
  0: '新建激励',
  1: '新建级联激励',
  2: '新建交互'
}
const An_ButtonDetailMap = {
  0: '激励详情',
  1: '级联激励详情',
  2: '交互详情'
}
const An_tabsMap = {
  0: 'one',
  1: 'two',
  2: 'three'
}

const ExcitationList: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
  const history = useHistory()
  // 目标列表参数
  const [params, setParams] = useState(request)

  // 项目列表
  const [excitationList, setExcitationList] = useState<projectInfoType[]>([])

  // 页码
  const [total, setTotal] = useState<number>()

  // 切换tabs
  const [tabs, setTabs] = useState<number>(0)
  // 存储单个项目信息
  //   const [excitationInfo, setExcitationInfo] = useState('')

  // 修改,更新 弹出框基本数据集合
  //   const [modalData, setModalData] = useState({ excitationId: '', fixTitle: false, isModalVisible: false })

  //  删除弹出框基本数据集合
  //   const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)

  // 创建项目 弹出框
  const createProjectModal = React.useCallback(
    (value: number) => {
      const createDoubleExcitation = '/excitationList/createDoubleExcitation'
      const createOneExcitation = '/excitationList/createOneExcitation'
      const createGroupExcitation = '/excitationList/createGroupExcitation'
      history.push({
        pathname: `${+value === 0 ? createOneExcitation : +value === 1 ? createDoubleExcitation : createGroupExcitation}`,
        state: {
          type: `${An_tabsMap[tabs as keyof typeof An_tabsMap]}`,
          isFixForm: false,
          name: `${An_ButtonNameMap[tabs as keyof typeof An_ButtonNameMap]}`
        }
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [history, tabs]
  )

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
      pathname: '/excitationList/Deatail',
      state: {
        info: { id: item.id },
        type: `${An_tabsMap[tabs as keyof typeof An_tabsMap]}`,
        isFixForm: true,
        name: `${An_ButtonDetailMap[tabs as keyof typeof An_ButtonDetailMap]}`
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

  // 切换页面
  const onChange = (e: RadioChangeEvent) => {
    setTabs(e.target.value)
    setParams({ ...params, group_type: e.target.value })
  }

  React.useEffect(() => {
    getExcitationList(params)
  }, [params, tabs])
  const cloumnMap = {
    0: [
      {
        width: '15%',
        title: '激励名称',
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
        width: '20%',
        title: '激励属性',
        dataIndex: 'port',
        key: 'port'
      },
      {
        width: '20%',
        title: '激励描述 ',
        dataIndex: 'port',
        key: 'port'
      },
      {
        width: '15%',
        title: '激励端点名称',
        dataIndex: 'port',
        key: 'port'
      },
      {
        width: '10%',
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
    ],
    1: [
      {
        width: '20%',
        title: '级联激励名称',
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
        title: '级联激励描述    ',
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
    ],
    2: [
      {
        width: '20%',
        title: '组名称',
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
        title: '组描述',
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
  }

  return (
    <div className={styles.AnBan_main}>
      <div className={styles.AnBan_header}>
        <Radio.Group onChange={onChange} defaultValue='0'>
          <Radio.Button value='0'>激励列表</Radio.Button>
          <Radio.Button value='1'>级联列表</Radio.Button>
          <Radio.Button value='2'>交互列表</Radio.Button>
        </Radio.Group>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput placeholder='根据名称搜索激励' onChangeValue={updateParams} />
          <CreateButton
            width='146px'
            name={`${An_ButtonNameMap[tabs as keyof typeof An_ButtonDetailMap]}`}
            size='large'
            type='primary'
            onClick={() => {
              createProjectModal(tabs)
            }}
          />
        </div>
      </div>
      <div className={styles.tableConcent}>
        <ConfigProvider locale={zhCN} renderEmpty={customizeRender}>
          <Table rowKey='id' dataSource={excitationList} columns={cloumnMap[tabs as keyof typeof cloumnMap]} pagination={false} />
        </ConfigProvider>
      </div>
      <div className={styles.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={changePage} pagenums={params.page} />
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

export default withRouter(ExcitationList)
