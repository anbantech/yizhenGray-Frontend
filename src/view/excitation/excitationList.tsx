/* eslint-disable indent */
import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
// import ExcitationModal from 'Src/components/Modal/excitationModal/excitationModal'
import Table from 'antd/lib/table'
import ConfigProvider from 'antd/lib/config-provider'
import { useState } from 'react'
import * as React from 'react'
import { RouteComponentProps, StaticContext, useHistory, useLocation, withRouter } from 'react-router'
// import { message } from 'antd'
import { excitationListFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import zhCN from 'antd/lib/locale/zh_CN'
// import deleteImage from 'Src/assets/image/Deletes.svg'
// import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import { Radio, RadioChangeEvent } from 'antd'
import useDepCollect from 'Src/util/Hooks/useDepCollect'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import styles from 'Src/view/Project/project/project.less'
import style from './excitation.less'
import { StepRef } from '../Project/task/createTask/newCreateTask'
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

const An_ButtonNameMap = {
  0: '新建端口',
  1: '新建激励单元管理',
  2: '新建激励嵌套管理',
  3: '新建交互'
}
const An_ButtonDetailMap = {
  0: '查看端口',
  1: '查看激励单元管理',
  2: '查看激励嵌套管理',
  3: '查看交互'
}
const An_tabsMap = {
  0: 'one',
  1: 'two',
  2: 'three',
  3: 'four'
}

const callBackAn_tabs = {
  one: 0,
  two: 1,
  three: 2,
  four: 3
}
interface ChildRef {
  inputRef: React.MutableRefObject<StepRef | null>
}

type stateType = { [key: string]: string }
const inputPlaceholder = {
  0: '根据名称搜索端口',
  1: '根据名称搜索激励单元管理',
  2: '根据名称搜索激励嵌套管理',
  3: '根据名称搜索交互'
}

type ResparamsType = Record<string, any>
const ExcitationList: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
  const childRef: ChildRef = {
    inputRef: React.useRef<StepRef | null>(null)
  }

  const state = useLocation()?.state as stateType

  const history = useHistory()

  // 项目管理
  const [excitationList, setExcitationList] = useState<ResparamsType[]>([])

  // 页码
  const [total, setTotal] = useState<number>()

  // 切换tabs
  const [tabs, setTabs] = useState<number>(-1)

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
  const createProjectModal = React.useCallback(
    (value: number) => {
      const createDoubleExcitation = '/excitationList/createDoubleExcitation'
      const createOneExcitation = '/excitationList/createOneExcitation'
      const createGroupExcitation = '/excitationList/createGroupExcitation'
      const createExcitation = '/excitationList/createExcitation'
      history.push({
        pathname: `${
          +value === 0 ? createExcitation : +value === 1 ? createOneExcitation : +value === 2 ? createDoubleExcitation : createGroupExcitation
        }`,
        state: {
          type: `${An_tabsMap[tabs as keyof typeof An_tabsMap]}`,
          isFixForm: false,
          name: `${An_ButtonNameMap[tabs as keyof typeof An_ButtonNameMap]}`
        }
      })
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
  const lookDetail = (item: any, type: number) => {
    history.push({
      pathname: '/excitationList/Deatail',
      state: {
        info: { id: type !== 0 ? item.sender_id : item.stimulus_id },
        type: `${An_tabsMap[tabs as keyof typeof An_tabsMap]}`,
        isFixForm: true,
        name: `${An_ButtonDetailMap[tabs as keyof typeof An_ButtonDetailMap]}`
      }
    })
  }
  const updateParams = (value: string) => {
    depCollect(true, { key_word: value, page: 1 })
  }

  const changePage = (page: number, pageSize: number) => {
    depCollect(true, { page, page_size: pageSize })
  }
  // 切换页面
  const onChange = React.useCallback(
    (value: number) => {
      childRef.inputRef.current?.save()
      depCollect(true, { ...depData, target_type: `${value}`, page: 1 })
      setTabs(value)
    },
    [childRef.inputRef, depCollect, depData]
  )
  const setOperation = (value1?: any, type?: string, value2?: any) => {
    setLoading(true)
    switch (type) {
      case 'page':
        changePage(value1, value2)
        break
      case 'key_word':
        updateParams(value1)
        break
      case 'type_tag':
        onChange(value1)
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
    if (state === undefined) {
      setTabs(0)
      depCollect(true, { target_type: '0' })
    } else {
      setTabs(callBackAn_tabs[state?.type as keyof typeof callBackAn_tabs])
      depCollect(true, {
        target_type: state?.type
          ? `${callBackAn_tabs[state?.type as keyof typeof callBackAn_tabs]}`
          : `${An_tabsMap[+state?.target_type as keyof typeof An_tabsMap]}`
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (status) {
      getExcitationList(depData)
    }
  }, [depData, status])

  const cloumnMap = {
    0: [
      {
        width: '15%',
        title: '端口名称',
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
                lookDetail(row, 0)
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
            <div className={style.excitaion_operation}>
              <span
                style={{ marginLeft: '10px', marginRight: '10px' }}
                role='button'
                tabIndex={0}
                onClick={() => {
                  lookDetail(row, 0)
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
        width: '15%',
        title: '激励单元管理名称',
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
                lookDetail(row, 1)
              }}
            >
              {row.name}
            </span>
          )
        }
      },
      {
        width: '15%',
        title: '激励单元管理描述',
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
            <div className={style.excitaion_operation}>
              <span
                style={{ marginLeft: '10px', marginRight: '10px' }}
                role='button'
                tabIndex={0}
                onClick={() => {
                  lookDetail(row, 1)
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
        title: '激励嵌套管理名称',
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
                lookDetail(row, 2)
              }}
            >
              {row.name}
            </span>
          )
        }
      },
      {
        width: '30%',
        title: '激励嵌套管理描述',
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
                  lookDetail(row, 2)
                }}
              >
                查看详情
              </span>
            </div>
          )
        }
      }
    ],
    3: [
      {
        width: '20%',
        title: '交互名称',
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
                lookDetail(row, 3)
              }}
            >
              {row.name}
            </span>
          )
        }
      },
      {
        width: '30%',
        title: '交互描述',
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
                  lookDetail(row, 3)
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
      <div className={(styles.AnBan_header, style.AnBan_headerRadio)}>
        <Radio.Group
          onChange={(e: RadioChangeEvent) => {
            setOperation(e.target.value, 'type_tag')
          }}
          buttonStyle='solid'
          optionType='button'
          value={`${tabs}`}
        >
          <Radio.Button value='0'>端口管理</Radio.Button>
          <Radio.Button value='1'>激励单元管理</Radio.Button>
          <Radio.Button value='2'>激励嵌套管理</Radio.Button>
          <Radio.Button value='3'>交互</Radio.Button>
        </Radio.Group>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput
            ref={childRef.inputRef}
            placeholder={`${inputPlaceholder[tabs as keyof typeof inputPlaceholder]}`}
            onChangeValue={setOperation}
          />
          <CreateButton
            name={`${An_ButtonNameMap[tabs as keyof typeof An_ButtonNameMap]}`}
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
          <Table
            rowKey={record => (record.sender_id ? record.sender_id : record.stimulus_id)}
            dataSource={excitationList}
            loading={loading}
            columns={cloumnMap[tabs as keyof typeof cloumnMap]}
            pagination={false}
          />
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

export default withRouter(ExcitationList)
