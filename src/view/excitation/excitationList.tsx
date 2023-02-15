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

const customizeRender = () => <DefaultValueTips content='暂无项目' />

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
  0: '新建单激励Group',
  1: '新建级联Group',
  2: '新建交互',
  3: '新建激励'
}
const An_ButtonDetailMap = {
  0: '查看单激励Group',
  1: '查看级联激励Group',
  2: '查看交互',
  3: '查看激励'
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
const inputPlaceholder = { 0: '根据名称搜索单激励Group', 1: '根据名称搜索级联激励Group', 2: '根据名称搜索交互', 3: '根据名称搜索激励' }
const ExcitationList: React.FC<RouteComponentProps<any, StaticContext, unknown>> = () => {
  const childRef: ChildRef = {
    inputRef: React.useRef<StepRef | null>(null)
  }

  const state = useLocation()?.state as stateType

  const history = useHistory()

  // 项目管理
  const [excitationList, setExcitationList] = useState<projectInfoType[]>([])

  // 页码
  const [total, setTotal] = useState<number>()

  // 切换tabs
  const [tabs, setTabs] = useState<number>(-1)

  const [status, depCollect, depData] = useDepCollect(request)
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
      const createExcitation = './excitationList/createExcitation'
      history.push({
        pathname: `${
          +value === 0 ? createOneExcitation : +value === 1 ? createDoubleExcitation : +value === 2 ? createGroupExcitation : createExcitation
        }`,
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
  const lookDetail = (item: any, type: number) => {
    history.push({
      pathname: '/excitationList/Deatail',
      state: {
        info: { id: type !== 3 ? item.sender_id : item.stimulus_id },
        type: `${An_tabsMap[tabs as keyof typeof An_tabsMap]}`,
        isFixForm: true,
        name: `${An_ButtonDetailMap[tabs as keyof typeof An_ButtonDetailMap]}`
      }
    })
  }

  // 更新参数获取列表
  const updateParams = React.useCallback(
    (value: string) => {
      depCollect(true, { key_word: value })
    },
    [depCollect]
  )

  // 删除项目弹出框
  //   const deleteProject = (id: string, value: boolean) => {
  //     setModalData({ ...modalData, excitationId: id })
  //     setCommonModleStatus(value)
  //   }

  // 更改页码
  const changePage = (page: number, pageSize: number) => {
    depCollect(true, { page, page_size: pageSize })
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
  const onChange = React.useCallback(
    (e: RadioChangeEvent) => {
      childRef.inputRef.current?.save()
      depCollect(true, { ...request, target_type: `${e.target.value}` })
      setTabs(e.target.value)
    },
    [childRef.inputRef, depCollect]
  )

  React.useEffect(() => {
    if (state === undefined) {
      setTabs(3)
      depCollect(true, { target_type: '3' })
    } else {
      setTabs(callBackAn_tabs[state?.type as keyof typeof callBackAn_tabs])
      depCollect(true, { target_type: `${callBackAn_tabs[state?.type as keyof typeof callBackAn_tabs]}` })
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
        title: '单激励Group名称',
        dataIndex: 'name',
        key: 'name',
        // eslint-disable-next-line react/display-name
        render: (_: any, row: any) => {
          return (
            <span
              className={styles.tableProjectName}
              role='time'
              onClick={() => {
                lookDetail(row, 0)
              }}
            >
              {row.name}
            </span>
          )
        }
      },
      {
        width: '15%',
        title: '端口名称',
        dataIndex: 'port',
        key: 'port'
      },
      {
        width: '20%',
        title: '激励描述 ',
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
        width: '20%',
        title: '级联Group名称',
        dataIndex: 'name',
        key: 'name',
        // eslint-disable-next-line react/display-name
        render: (_: any, row: any) => {
          return (
            <span
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
        width: '30%',
        title: ' 描述    ',
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
        title: '交互名称',
        dataIndex: 'name',
        key: 'name',
        // eslint-disable-next-line react/display-name
        render: (_: any, row: any) => {
          return (
            <span
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
        width: '15%',
        title: '激励名称',
        dataIndex: 'stimulus_name',
        key: 'stimulus_name',
        // eslint-disable-next-line react/display-name
        render: (_: any, row: any) => {
          return (
            <span
              className={styles.tableProjectName}
              role='time'
              onClick={() => {
                lookDetail(row, 3)
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
        <Radio.Group onChange={onChange} buttonStyle='solid' optionType='button' value={`${tabs}`}>
          <Radio.Button value='3'>激励列表</Radio.Button>
          <Radio.Button value='0'>单激励Group列表</Radio.Button>
          <Radio.Button value='1'>级联Group列表</Radio.Button>
          <Radio.Button value='2'>交互列表</Radio.Button>
        </Radio.Group>
        <div className={styles.AnBan_header_bottom}>
          <SearchInput
            ref={childRef.inputRef}
            placeholder={`${inputPlaceholder[tabs as keyof typeof inputPlaceholder]}`}
            onChangeValue={updateParams}
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
          <Table rowKey='id' dataSource={excitationList} columns={cloumnMap[tabs as keyof typeof cloumnMap]} pagination={false} />
        </ConfigProvider>
      </div>
      <div className={styles.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={changePage} pagenums={depData.page} />
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
