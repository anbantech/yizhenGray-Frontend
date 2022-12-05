import { Form, Input, Select, Tag } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import * as React from 'react'
import { useContext } from 'react'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { excitationListFn } from 'Src/services/api/excitationApi'
import { createUseCaseFn } from 'Src/services/api/useCaseApi'

import { throwErrorMessage } from 'Src/until/message'
import styles from 'Src/view/excitation/excitation.less'
// import { RouteComponentProps, StaticContext } from 'react-router'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

interface OptionPropsType {
  value: string
  lable: string
}

const request = {
  group_type: 2,
  key_word: '',
  status: null,
  page: 1,
  page_size: 999,
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
const useCaseForm: React.FC = () => {
  const { type, name, isFixForm } = useContext(GlobalContexted)
  console.log(type, name, isFixForm)
  const { Option } = Select
  const [form] = useForm()
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)
  const [excitationList, setExcitationList] = React.useState<projectInfoType[]>([])
  const [groupList, setGroupList] = React.useState<string[]>(null!)
  const groupListMemo = React.useMemo(() => {
    if (groupList?.length > 3) {
      return true
    }
    return false
  }, [groupList])
  const onFieldsChange = (changedFields: any, allFields: any) => {
    const disabledData: any = []
    const errors = allFields.every((item: any) => {
      return item.errors.length === 0
    })
    allFields.forEach((item: any) => {
      if (item.name[0] !== 'description') return disabledData.push(item.value)
    })

    const disabledBoolean = disabledData.every((item: any) => {
      return item !== undefined && item !== ''
    })
    if (disabledBoolean && errors) {
      setIsDisableStatus(false)
    } else {
      setIsDisableStatus(true)
    }
  }

  const getExcitationList = async (value: Resparams) => {
    try {
      const result = await excitationListFn(value)
      if (result.data) {
        setExcitationList(result.data.results)
      }
    } catch (error) {
      throwErrorMessage(error, { 1004: '请求资源未找到' })
    }
  }

  // 创建用例
  const createOneExcitationFn = async () => {
    let values
    try {
      values = await form.validateFields()
    } catch {
      setIsDisableStatus(true)
    }
    try {
      if (values) {
        const params = {
          name: values.name,
          desc: values.description,
          group_id_list: values.group_id_list
        }
        const result = await createUseCaseFn(params)
        // ToDo
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }
  React.useEffect(() => {
    getExcitationList(request)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    if (type) {
      const { name, desc, group_id_list } = type
      // cause backend will auto add prefix for queue name
      // thus remove prefix of queue name when editing
      const formData = { name, description: desc, group_id_list }
      form.setFieldsValue(formData)
    }
  }, [form, type])
  const handleChange = (value: string[]) => {
    setGroupList(value)
  }

  return (
    <div className={styles.baseForm}>
      <Form name='basic' className={styles.oneForm} {...layout} onFieldsChange={onFieldsChange} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='用例名称'
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                if (typeof value === 'undefined' || value === '') {
                  return Promise.reject(new Error('请输入用例名称'))
                }
                return Promise.resolve()
              }
            },
            {
              required: true,
              max: 6,
              min: 2,
              message: '用例名称长度为2到6个字符'
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
          <Input placeholder='请输入2到6个字符' disabled={isFixForm} />
        </Form.Item>
        <Form.Item
          label='选择组'
          name='group_id_list'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              message: '请选择组'
            }
          ]}
        >
          <Select
            mode='multiple'
            allowClear
            showSearch={false}
            disabled={isFixForm}
            tagRender={(props: any) => {
              const { label, value, onClose } = props
              const onPreventMouseDown = (event: any) => {
                event.preventDefault()
                event.stopPropagation()
              }
              return (
                <Tag key={value} onMouseDown={onPreventMouseDown} closable={!isFixForm} onClose={onClose} style={{ marginRight: 3 }}>
                  {label}
                </Tag>
              )
            }}
            onChange={handleChange}
            placeholder='请选择组'
            // options={items.map(item => ({ label: item, value: item }))}
          >
            {excitationList?.map((item: projectInfoType) => {
              return (
                <Option key={Math.random()} disabled={groupListMemo} value={item.id}>
                  {item.name}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label='任务描述'
          name='description'
          rules={[{ message: '请输入用例描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            disabled={isFixForm}
            placeholder='用例描述'
            autoSize={{ minRows: 4, maxRows: 5 }}
            showCount={{
              formatter({ count }) {
                return `${count}/50`
              }
            }}
          />
        </Form.Item>
      </Form>
      <div className={styles.excitaion_footer}>
        <div className={styles.excitaion_footer_footerConcent}>
          <CommonButton
            buttonStyle={styles.stepButton}
            name='取消'
            type='default'
            onClick={() => {
              //   cancenlForm()
            }}
          />
          <CommonButton
            buttonStyle={styles.stepButton}
            type='primary'
            name='确认'
            disabled={isDisableStatus}
            onClick={() => {
              createOneExcitationFn()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default useCaseForm
