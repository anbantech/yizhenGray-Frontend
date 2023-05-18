import React from 'react'
import { RouteComponentProps } from 'react-router'
import CreateTemplateComponent from './createTemplate'
import TemplateContextProvider, { resetDefaultTemplateContextValue } from './templateContext'

interface LocationStateType {
  // 区分模板查看、修改和新建状态
  readonlyBaseTemplate: boolean
  editOriginalTemplate: boolean
  // 新建或修改模板所需信息：模板ID
  templateId: number
  // 新建或修改任务所需信息：是否处于修改状态
  editTaskMode: boolean
  // 从哪里来，新建完，回哪里去
  from: string
  // 模板类型
  templateType: 'user_defined' | 'default' | 'recycle_bin'
  isDetailWeb?: boolean
}

export enum TemplateStatus {
  CREATE = 0, // 新建包括两种：空模板新建和从备份新建
  CONFIG,
  READ
}

/**
 * 根据 props 判断模板对应的状态
 * @param state
 * @returns TemplateStatus
 */
function getTemplateStatusFromLocationState(state: LocationStateType) {
  let status = TemplateStatus.CREATE
  /**
   * 如果存在 editOriginalTemplate 参数，则一定是修改模板
   * 如果存在 readonlyBaseTemplate 参数，则一定是查看模板
   */
  if (state.editOriginalTemplate) {
    status = TemplateStatus.CONFIG
  } else if (state.readonlyBaseTemplate) {
    status = TemplateStatus.READ
  }
  return status
}

const CreateTemplateWrapper: React.FC<RouteComponentProps<any, any, LocationStateType>> = ({ location }) => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 0)
  // 获取模板状态
  const status = getTemplateStatusFromLocationState(location.state)

  // 获取模板ID、协议ID和项目ID
  const { templateId, isDetailWeb } = location.state
  // 模板类型
  const { templateType } = location.state

  const defaultContext = { status, templateId, templateType, isDetailWeb }

  // 清除 context 闭包里的对象
  resetDefaultTemplateContextValue()

  return (
    <TemplateContextProvider defaultContext={defaultContext}>
      <CreateTemplateComponent />
    </TemplateContextProvider>
  )
}

CreateTemplateWrapper.displayName = 'CreateTemplateWrapper'

export default CreateTemplateWrapper
