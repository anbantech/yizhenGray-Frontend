import { Form, Input, Select, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import * as React from 'react'
import { useContext } from 'react'
import { useHistory } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { getPortList, createExcitationFn_1 } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import styles from '../excitation.less'
import { GetDeatilExcitation } from './getDataDetailFn/getDataDetailFn'

// import { RouteComponentProps, StaticContext } from 'react-router'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const ExcitationComponents: React.FC = () => {
  const history = useHistory()
  const { isFixForm, info, type } = useContext(GlobalContexted)
  const { Option } = Select
  const [form] = useForm()
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)
  const [portList, setPortList] = React.useState<string[]>([])
  const Data = GetDeatilExcitation(info?.id)
  // 端口列表
  const fetchPortList = React.useCallback(async () => {
    //  Todo code码
    try {
      const result = await getPortList()
      if (result.data) {
        const results = result.data
        setPortList(results)
      }
      return result
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }, [])

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
          stimulus_name: values.stimulus_name,
          is_enable: values.is_enable,
          stimulus_value: values.stimulus_value
        }
        const result = await createExcitationFn_1(params)
        if (result.data) {
          history.push({
            pathname: '/excitationList',
            state: { type }
          })
        }
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '激励创建失败' })
    }
  }
  const cancelForm = () => {
    history.push({
      pathname: '/excitationList',
      state: { type }
    })
  }
  const onFieldsChange = (changedFields: any, allFields: any) => {
    const disabledData: any = []
    const errors = allFields.every((item: any) => {
      return item.errors.length === 0
    })
    allFields.forEach((item: any) => {
      if (item.name[0] !== 'is_enable') return disabledData.push(item.value)
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

  React.useEffect(() => {
    fetchPortList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    if (Data) {
      const { stimulus_name, is_enable, stimulus_value } = Data as any
      const formData = {
        stimulus_name,
        is_enable,
        stimulus_value
      }
      form.setFieldsValue(formData)
    }
  }, [form, info, Data])
  return (
    <div className={styles.baseForm}>
      <Form name='basic' className={styles.oneForm} {...layout} onFieldsChange={onFieldsChange} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='端口名称'
          name='stimulus_name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                if (typeof value === 'undefined' || value === '') {
                  return Promise.reject(new Error('请输入端口名称'))
                }
                return Promise.resolve()
              }
            },
            {
              required: true,
              max: 20,
              min: 2,
              message: '端口名称为2到20个字符'
            },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('端口名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='请输入端口名称' />
        </Form.Item>
        <Form.Item label='是否生效' name='is_enable' valuePropName='checked' initialValue>
          <Switch disabled={isFixForm} />
        </Form.Item>
        <Form.Item name='stimulus_value' label='端口' rules={[{ required: true, message: '请选择端口' }]}>
          <Select placeholder='请选择端口' disabled={isFixForm}>
            {
              /**
               *  下拉选择端口
               */
              portList?.map(rate => {
                return (
                  <Option key={rate} value={rate}>
                    {rate}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
      </Form>
      <div className={styles.excitaion_footer}>
        <div className={styles.excitaion_footer_footerConcent}>
          {!isFixForm ? (
            <CommonButton
              buttonStyle={styles.stepButton}
              name='取消'
              type='default'
              onClick={() => {
                cancelForm()
              }}
            />
          ) : null}
          {!isFixForm ? (
            <CommonButton
              buttonStyle={styles.stepButton}
              type='primary'
              name='确认'
              disabled={isDisableStatus}
              onClick={() => {
                createOneExcitationFn()
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

ExcitationComponents.displayName = 'ExcitationComponents'

export default ExcitationComponents
