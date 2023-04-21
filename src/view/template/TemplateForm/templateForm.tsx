import { ColProps, Form, FormInstance, Input } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ValidatorRule } from 'rc-field-form/lib/interface'
import React, { createRef, CSSProperties, useContext, useEffect, useImperativeHandle, useRef } from 'react'
import MainBorder from 'Src/components/MainBorder/MainBorder'
import StepTag from 'Src/components/StepTag/StepTag'
import { useEffectOnce } from 'Src/util/Hooks/useEffectOnce'
import baseTemplateStyles from 'Src/view/template/BaseTemplate/createTemplate.less'
import { TemplateStatus } from '../BaseTemplate/createTemplateWrapper'
import { CheckerRef, TemplateContext } from '../BaseTemplate/templateContext'
import styles from './templateForm.less'

const containerWrapperStyle: CSSProperties = {
  flexDirection: 'initial',
  justifyContent: 'space-between'
}

const nameRenderFn = () => {
  return (
    <>
      <StepTag step='1' />
      <span style={{ marginLeft: '12px' }}>基础信息</span>
    </>
  )
}

interface LayoutType {
  labelCol: ColProps
  wrapperCol: ColProps
}

const layout: LayoutType = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

const nameValidator: ValidatorRule['validator'] = (_, value, callback) => {
  if (!/^[\dA-Za-z]+$/.test(value)) {
    callback('模板名称由数字、字母组成')
  }
  callback()
}

const TemplateForm: React.FC = () => {
  /**
   * 初始化表单 ref
   * 获取表单实例
   */
  const formRef = createRef<FormInstance>()

  /**
   * 初始化当前组件 ref
   * 暴露给 validator 方法
   * 把 ref 引用存储到 context 中
   */
  const { template, templateDispatch } = useContext(TemplateContext)
  const baseInfoRef = React.useRef<CheckerRef>(null)

  useImperativeHandle(baseInfoRef, () => ({
    validator: async () => {
      try {
        await formRef.current?.validateFields()
        const bf = formRef.current?.getFieldsValue()
        return Promise.resolve([true, bf])
      } catch {
        // 校验错误，定位到表单位置
        const formDom = document.querySelector('#baseInfoForm')
        if (formDom) {
          formDom.scrollIntoView({ behavior: 'smooth', inline: 'start' })
        }
        return Promise.resolve([false])
      }
    }
  }))

  useEffectOnce(() => {
    Object.assign(window, { baseInfoRef })
    templateDispatch({ type: 'setBaseInfoRef', value: baseInfoRef })
  })

  /**
   * 如果修改或者导入数据，监听 context 值，插入表单
   * 模板状态如果是修改，则不需要修改名称
   * 模板状态如果不是修改，则说明是从备份模式创建，需要增加名称后缀
   * 后缀只会在第一次有值状态下渲染，其余时候不渲染
   */
  const { baseInfo, status } = template
  const isConfigMode = status === TemplateStatus.CONFIG
  const isFirstRenderRef = useRef(true)

  useEffect(() => {
    // wait until first several renders finished
    setTimeout(() => {
      isFirstRenderRef.current = false
    }, 2000)
    if (formRef.current) {
      const initValue = { name: '', description: '' }
      if (!isFirstRenderRef.current || isConfigMode) {
        initValue.name = baseInfo.name
        initValue.description = baseInfo.description
      } else {
        initValue.name = baseInfo.name ? `${baseInfo.name}copy` : ''
        initValue.description = baseInfo.description || ''
      }
      formRef.current.setFieldsValue(initValue)
    }
    // 不观察 formRef 和 isConfigMode
    // 由于 formRef 和 isConfigMode 最终的值不会变，只会变引用，所以不观察
    // 否则会影响 isFirstRenderRef 的逻辑
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseInfo])

  return (
    <MainBorder wrapperClass={baseTemplateStyles.template_wrapper} containerWrapperStyle={containerWrapperStyle} name={nameRenderFn}>
      <Form
        ref={formRef}
        id='baseInfoForm'
        {...layout}
        scrollToFirstError
        validateTrigger='onBlur'
        className={styles.form_wrapper}
        autoComplete='off'
      >
        <Form.Item
          label='模板名称'
          name='name'
          validateFirst
          rules={[
            { required: true, type: 'string', message: '请输入模板名称' },
            { min: 2, max: 20, type: 'string', message: '模板名称长度为2到20个字符' },
            { validator: nameValidator }
          ]}
        >
          <Input placeholder='请输入模板名称' />
        </Form.Item>
        <Form.Item label='模板描述' name='description' validateFirst rules={[{ max: 50, type: 'string', message: '模板描述长度不能超过50个字符' }]}>
          <Input.TextArea
            placeholder='请输入模板描述'
            autoSize={{ minRows: 3, maxRows: 3 }}
            showCount={{
              formatter({ count }) {
                return `${count}/50`
              }
            }}
          />
        </Form.Item>
      </Form>
    </MainBorder>
  )
}

TemplateForm.displayName = 'TemplateForm'

export default TemplateForm
