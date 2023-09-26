import { Divider, Form, Input, message, Select, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { IconAdd } from '@anban/iconfonts'
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { excitationListFn } from 'Src/services/api/excitationApi'
import { createTaskFn, getSimulateNode, updateTask } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import styles from './stepBaseConfig.less'
import TaskExcitaionModal from './taskExcitation'
import FixTaskModal from './fixTaskModal'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
const request = {
  target_type: 3,
  key_word: '',
  status: null,
  page: 1,
  page_size: 10,
  sort_field: 'create_time',
  sort_order: 'descend'
}

interface projectInfoType {
  id: number
  sender_id: number
  name: string
  port: string
  status: number | null
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}

interface Resparams {
  target_type: number
  key_word?: string
  status?: null | number
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}
interface propsFn {
  onChange: (val: boolean) => void
  id: number
  taskInfo: any
  cancenlForm: () => void
  projectInfo: any
  fromDataTask: any
}
const FirstConfig = React.forwardRef((props: propsFn, myRef) => {
  const { onChange, id, taskInfo, cancenlForm, fromDataTask } = props
  const getContainer = () => {
    return document.querySelector('#myContainer') // 替换为你想要绑定的 DOM 元素的选择器
  }
  const [form] = useForm()
  const { Option } = Select
  const [open, setOpen] = useState(false)
  const charRef = useRef(false)
  const [params, setParams] = useState<Resparams>(request)
  // 弹窗
  const [modalData, setModalData] = useState({ spinning: false, isModalVisible: false })
  //  删除弹出框
  const [excitationList, setExcitationList] = useState<projectInfoType[]>([])
  const [nodeList, setNodeList] = useState<number[]>([])

  // 下拉菜单

  const [dropDownOpen, setDropDownOpen] = useState(false)
  const scrollRef = useRef(-1)
  const pageRef = useRef(0)
  // 删除弹出框函数
  const CommonModleClose = useCallback(
    (value: boolean) => {
      setModalData({ ...modalData, isModalVisible: value })
    },
    [modalData]
  )

  const createOneExcitationFn = React.useCallback(async () => {
    setModalData({ ...modalData, spinning: true })
    const values = await form.validateFields()
    try {
      if (values) {
        const params = {
          name: values.name,
          desc: values.description,
          project_id: id,
          beat_unit: values.beat_unit,
          simu_instance_id: values.simu_instance_id,
          work_time: values.work_time,
          crash_num: values.crash_num,
          sender_id: values.sender_id
        }
        if (taskInfo?.editTaskMode) {
          const result = await updateTask(taskInfo.data.id, params)
          if (result.data) {
            message.success('任务修改成功')
            setModalData({ ...modalData, spinning: false, isModalVisible: false })
            cancenlForm()
          }
        } else {
          const result = await createTaskFn(params)
          if (result.data) {
            message.success('任务创建成功')
            setModalData({ ...modalData, spinning: false })
            return result.data
          }
        }
      }
    } catch (error) {
      throwErrorMessage(error, {
        1004: '该任务不存在',
        1005: '任务名称重复，请修改',
        1006: '任务参数校验失败',
        1007: '操作频繁',
        2013: '激励序列至少包含一个激励',
        1015: taskInfo?.editTaskMode ? '任务更新失败' : '任务创建失败'
      })
      setModalData({ ...modalData, spinning: false })
      return error
    }
  }, [cancenlForm, form, id, modalData, taskInfo?.data?.id, taskInfo?.editTaskMode])

  const matchItem = React.useCallback(async () => {
    setModalData({ ...modalData, isModalVisible: true })
  }, [modalData])

  const getFormData = React.useCallback(async () => {
    const values = await form.validateFields()
    return values
  }, [form])

  useImperativeHandle(myRef, () => ({
    save: () => {
      return taskInfo?.editTaskMode ? matchItem() : createOneExcitationFn()
    },
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))

  const getNode = async () => {
    try {
      const result = await getSimulateNode()
      if (result.data) {
        setNodeList(result.data)
      }
    } catch (error) {
      throwErrorMessage(error, { 3002: '仿真连接失败', 3001: '未找到可用仿真节点', 3000: '仿真通讯异常' })
    }
  }

  const onSearch = useCallback((val: string) => {
    setParams({ ...request, key_word: val })
    charRef.current = true
  }, [])

  const getExcitationList = useCallback(
    async (value: Resparams) => {
      if (scrollRef.current === pageRef.current) return
      try {
        const result = await excitationListFn(value)
        if (result.data !== null && result.data !== undefined) {
          scrollRef.current = result.data.total
          setExcitationList((pre: projectInfoType[]) => {
            if (result.data?.results) {
              const list = pre.concat(result.data.results)
              const uniquePersons = [...new Set(list.map(p => JSON.stringify(p)))].map(p => JSON.parse(p))
              pageRef.current = list.length
              return uniquePersons as projectInfoType[]
            }
            return []
          })
        }
      } catch (error) {
        throwErrorMessage(error, {
          1004: '获取激励列表失败'
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [excitationList]
  )

  const onScrollData = (e: React.UIEvent) => {
    const target = e.target as HTMLLIElement
    if (Math.ceil(target.scrollTop) + target.offsetHeight >= target.scrollHeight) {
      setParams((pre: Resparams) => {
        return { ...pre, page: pre.page + 1 }
      })
    }
  }

  const onValuesChange = async (changedValues: any, allValues: any) => {
    const name = allValues.name?.length >= 2 && allValues.name.length <= 20 && /^[\w\u4E00-\u9FA5]+$/.test(allValues.name)
    const { sender_id, simu_instance_id } = allValues
    if (name && sender_id && simu_instance_id) {
      onChange(false)
    } else {
      onChange(true)
    }
  }

  useEffect(() => {
    getExcitationList(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    getNode()
    const val = fromDataTask && fromDataTask?.isRight ? fromDataTask?.values : taskInfo.data
    if (val) {
      const { name, desc, project_id, sender_id, simu_instance_id, beat_unit, group_name } = val
      const formData = {
        name,
        description: desc,
        project_id,
        sender_id,
        beat_unit,
        simu_instance_id
      }
      form.setFieldsValue(formData)
      getExcitationList({ ...params, key_word: group_name })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, taskInfo.data, fromDataTask])

  // 关闭弹窗
  const cancel = useCallback((val?: string) => {
    if (val === 'result') {
      setExcitationList([])
      scrollRef.current = -1
      pageRef.current = 0
      setParams({ ...request, page: 1 })
    }
    setOpen(false)
  }, [])
  // 新建任务
  const jumpNewCreateTask = async () => {
    setOpen(true)
  }

  return (
    <div className={styles.stepBaseMain} id='myContainer'>
      <Form name='basic' className={styles.stepBaseMain_Form} {...layout} onValuesChange={onValuesChange} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='任务名称'
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                if (typeof value === 'undefined' || value === '') {
                  return Promise.reject(new Error('请输入任务名称'))
                }
                return Promise.resolve()
              }
            },
            {
              required: true,
              max: 20,
              min: 2,
              message: '任务名称长度为2到20个字符'
            },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('任务名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input spellCheck='false' style={{ borderRadius: '4px' }} placeholder='请输入任务名称' />
        </Form.Item>

        <Form.Item label='节拍单元' name='beat_unit' initialValue={200}>
          <Input spellCheck='false' style={{ borderRadius: '4px' }} placeholder='请输入节拍单元' disabled suffix='毫秒' />
        </Form.Item>
        <Form.Item
          label='仿真节点'
          name='simu_instance_id'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[{ required: true, message: '请选择仿真节点' }]}
        >
          <Select placeholder='请选择仿真节点' style={{ borderRadius: '4px' }}>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              nodeList?.map((rate: any) => {
                return (
                  <Option key={rate} disabled={rate.disabled} value={rate}>
                    {rate}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label='激励序列'
          name='sender_id'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[{ required: true, message: '请选择激励序列' }]}
        >
          <Select
            placeholder='请选择激励序列'
            showSearch
            onSearch={onSearch}
            open={dropDownOpen}
            onDropdownVisibleChange={visible => setDropDownOpen(visible)}
            optionFilterProp='children'
            onPopupScroll={e => {
              onScrollData(e)
            }}
            style={{ borderRadius: '4px' }}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <div
                    className={styles.selectRender}
                    role='time'
                    onClick={() => {
                      setDropDownOpen(false)
                      jumpNewCreateTask()
                    }}
                  >
                    <IconAdd className={styles.addImg} />
                    <span className={styles.sendlistTitle}>新建激励序列 </span>
                  </div>
                </Space>
              </div>
            )}
          >
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              excitationList?.map((rate: any) => {
                return (
                  <Option key={rate.sender_id} label={rate.name} disabled={rate.disabled} value={rate.sender_id}>
                    {rate.name}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label='任务描述'
          name='description'
          rules={[{ message: '请输入任务描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            style={{ borderRadius: '4px' }}
            spellCheck='false'
            placeholder='任务描述'
            autoSize={{ minRows: 4, maxRows: 5 }}
            showCount={{
              formatter({ count }) {
                return `${count}/50`
              }
            }}
          />
        </Form.Item>
      </Form>
      {modalData.isModalVisible && (
        <FixTaskModal
          IsModalVisible={modalData.isModalVisible}
          spinning={modalData.spinning}
          CommonModleClose={CommonModleClose}
          cancenlForm={cancenlForm}
          btnName='修改'
          id={id}
          ing='修改中'
          getFormData={getFormData}
          taskId={taskInfo.data.id}
          name='修改任务'
          concent='修改除名称、描述以外的配置项，会停止关联任务，并清空关联任务的测试数据，是否确认修改？'
        />
      )}
      {open && <TaskExcitaionModal open={open} cancel={cancel} getContainer={getContainer} />}
    </div>
  )
})

FirstConfig.displayName = 'FirstConfig'
export default FirstConfig
