import { message } from 'antd'
import React, { useContext, useCallback } from 'react'
import { sleep } from 'Src/util/common'
import { throwErrorMessage } from 'Src/util/message'
import API from 'Src/services/api'
import { useHistory, useLocation } from 'react-router'
import { CreateTemplateParams } from 'Src/globalType/Param'
import StepSection from '../ResponseTemplate/stepSection'
import styles from './createTemplateBottom.less'
import { TemplateStatus } from './createTemplateWrapper'
import { TemplateContext } from './templateContext'

const CreateTemplateBottom: React.FC = () => {
  const history = useHistory()
  const location = useLocation<any>()

  /**
   * 初始化页面变量
   * responseTemplate 解析模板数据和 status 模板状态
   * baseInfoRef 和 templateRef 用于调用兄弟组件的 validator 函数
   * templateId
   * 模板状态如果是修改，则需要调用修改接口
   * 模板状态如果不是修改，则需要调用创建接口
   */
  const { template } = useContext(TemplateContext)
  const { status, baseInfoRef, templateRef, templateId } = template
  const editOriginalTemplate = status === TemplateStatus.CONFIG
  const readonlyBaseTemplate = status === TemplateStatus.READ

  const routerPush = useCallback(() => {
    history.push({
      pathname: location.state.from
    })
  }, [history, location.state.from])

  const createTemplate = useCallback(
    async (eidt: boolean, createTemplateParams: CreateTemplateParams) => {
      // wait event loop to update tempalte
      await sleep(0)

      if (eidt) {
        try {
          const updateTemplateParams = Object.assign(createTemplateParams, { templates_id: templateId })
          await API.updateTemplate(updateTemplateParams)
          message.success('修改成功')
          routerPush()
        } catch (error) {
          throwErrorMessage(error, { 1005: '校验错误 => 模板名称重复，请修改', 4003: '校验错误 => 该模板无效，请检查模板' })
        }
      } else {
        try {
          await API.createTemplate(createTemplateParams)
          message.success('创建成功')
          routerPush()
        } catch (error) {
          throwErrorMessage(error, { 1005: '校验错误 => 模板名称重复，请修改', 4003: '校验错误 => 该模板无效，请检查模板' })
        }
      }
    },
    [routerPush, templateId]
  )

  /**
   * 创建或修改模板
   * 1. 依次校验基础信息、模板信息和解析模板信息
   * 2. 加载基础信息：模板名称和模板描述
   * 3. 加载模板配置信息：模板结果列表
   * 4. 初始化接口内置信息：引擎参数、协议参数、模板参数
   * 5. 合并基础信息、模板配置信息、解析模板配置信息和接口内置信息
   * 6. 调用接口创建模板或修改模板整体
   */
  const nextStep = useCallback(async () => {
    if (readonlyBaseTemplate) {
      routerPush()
    } else if (baseInfoRef && templateRef) {
      // 按顺序校验，有错就停止
      const [result1, bf] = await baseInfoRef.current?.validator()
      if (!result1) return
      const [result2, el] = await templateRef.current?.validator()
      if (!result2) return
      // 组装各个参数
      const params = {
        name: bf.name,
        desc: bf.description,
        elements: el.elements
      }
      await createTemplate(editOriginalTemplate, params)
    }
  }, [baseInfoRef, createTemplate, editOriginalTemplate, readonlyBaseTemplate, routerPush, templateRef])

  return (
    <div className={styles.footerOpations}>
      <StepSection onClickCallback={nextStep} label={editOriginalTemplate ? '修改' : '创建'} readonly={readonlyBaseTemplate} />
    </div>
  )
}

export default CreateTemplateBottom
