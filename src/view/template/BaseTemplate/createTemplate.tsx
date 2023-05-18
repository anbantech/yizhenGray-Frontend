import React, { useContext, CSSProperties, useState, useCallback } from 'react'
import MainBorder from 'Src/components/MainBorder/MainBorder'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import { message } from 'antd'
import API from 'Src/services/api'
import { throwErrorMessage } from 'Src/util/message'
import { useHistory } from 'react-router'
import useMenu from 'Src/util/Hooks/useMenu'
import { getTemplateDependence } from 'Src/services/api/templateApi'
import { useDialog } from 'Src/util/Hooks/useDialog'
import LookUpDependence from 'Src/components/Modal/taskModal/lookUpDependence'
import StepTag from 'Src/components/StepTag/StepTag'
import stylesExcitation from 'Src/view/Project/task/createTask/newCreateTask.less'
import styles from './createTemplate.less'
import PrimitiveList from '../PrimitiveList/primitiveList'
import CreateTemplateBottom from './createTemplateBottom'
// import CreateResponseTemplate from '../ResponseTemplate/createResponseTemplate'
import TemplateForm from '../TemplateForm/templateForm'
import { TemplateContext } from './templateContext'
import { TemplateStatus } from './createTemplateWrapper'
import CreateTemplateTitle from './createTemplateTitle'
import TemplateResult from '../TemplateResult/templateResult'

const containerWrapperStyle: CSSProperties = {
  flexDirection: 'initial',
  justifyContent: 'space-between'
}
type ResparamsType = Record<string, any>
/**
 * 模板组件
 * 当渲染查看组件的页面时，不需要拖拽逻辑及侧边栏逻辑，只渲染模板区域即可
 * 当渲染编辑组件的页面时，需要拖拽逻辑和侧边栏逻辑
 */
const CreateTemplateComponent: React.FC = () => {
  const history = useHistory()
  const { template } = useContext(TemplateContext)
  const { status } = template
  const readonly = status === TemplateStatus.READ
  //  删除弹出框
  const { visible: commonModleStatus, changeDialogStatus: changeCommonDialogStatus } = useDialog()
  // 存储关联任务信息
  const [dependenceInfo, setDependenceInfo] = useState({})

  const [spinning, setSpinning] = useState(false)
  const chioceBtnLoading = (val: boolean) => {
    setSpinning(val)
  }

  // 查看关联任务
  const { visibility, chioceModalStatus } = useMenu()

  // 获取关联信息
  const getDependenceInfo = React.useCallback(async () => {
    const res = await getTemplateDependence(template.templateId)
    if (res.data) {
      setDependenceInfo(res.data)
    }
    chioceModalStatus(true)
  }, [chioceModalStatus, template.templateId])

  // 查看/修改/新建末班
  const jumpTemplate = useCallback(
    (value?: ResparamsType, editOriginalTemplate = true, readonlyBaseTemplate = false) => {
      history.push({
        pathname: '/templateList/template',
        state: {
          templateId: template.templateId,
          templateType: 'user_defined',
          readonlyBaseTemplate,
          editOriginalTemplate,
          isDetailWeb: true,
          from: '/templateList/templateDetail'
        }
      })
    },
    [history, template]
  )
  // 删除模板
  const deleteTemplate = useCallback(async () => {
    chioceBtnLoading(true)
    try {
      const res = await API.removeTemplate({ templates: [template.templateId] })
      if (res.data) {
        if (res.data.success_list.length > 0) {
          chioceBtnLoading(false)
          message.success('删除成功')
        } else {
          message.error(res.data.fail_list[0])
        }
        changeCommonDialogStatus(false)
      }
    } catch (error) {
      changeCommonDialogStatus(false)
      throwErrorMessage(error, { 1009: '模板删除失败' })
    }
  }, [changeCommonDialogStatus, template.templateId])
  const nameRenderFn = () => {
    return (
      <div className={styles.headerBody}>
        {!readonly && <StepTag step='2' />}
        <span style={{ marginLeft: '12px' }}>发送模板配置</span>
        {template.status === 2 ? (
          <div className={styles.operationHeader}>
            <span
              className={stylesExcitation.upDataBtn}
              role='time'
              onClick={() => {
                changeCommonDialogStatus(true)
              }}
            >
              删除
            </span>
            <span
              className={stylesExcitation.lookUpInfo}
              role='time'
              onClick={() => {
                getDependenceInfo()
              }}
            >
              查看关联信息
            </span>
            <span
              className={stylesExcitation.upDataBtn}
              role='time'
              onClick={() => {
                jumpTemplate(template)
              }}
            >
              修改
            </span>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <>
      {!readonly ? (
        <>
          <CreateTemplateTitle />
          <TemplateForm />
          <MainBorder wrapperClass={styles.template_wrapper} containerWrapperStyle={containerWrapperStyle} name={nameRenderFn}>
            <DndProvider backend={HTML5Backend}>
              <div className={styles.config_section}>
                <div className={styles.left_section}>
                  <PrimitiveList />
                </div>
                <div className={styles.right_section}>
                  <TemplateResult />
                </div>
              </div>
            </DndProvider>
          </MainBorder>
          <CreateTemplateBottom />
          {/* <CreateResponseTemplate /> */}
        </>
      ) : (
        <>
          <CreateTemplateTitle />
          <MainBorder wrapperClass={styles.template_wrapper} containerWrapperStyle={containerWrapperStyle} name={nameRenderFn}>
            <TemplateResult />
          </MainBorder>
          <CreateTemplateBottom />
          {/* <CreateResponseTemplate /> */}
        </>
      )}
      <CommonModle
        IsModalVisible={commonModleStatus}
        deleteProjectRight={() => {
          deleteTemplate()
        }}
        CommonModleClose={changeCommonDialogStatus}
        ing='删除中'
        spinning={spinning}
        name='删除模板'
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      />
      <LookUpDependence visibility={visibility as boolean} name='模板关联信息' data={dependenceInfo} choiceModal={chioceModalStatus} width='760px' />
    </>
  )
}

CreateTemplateComponent.displayName = 'CreateTemplateComponent'

export default CreateTemplateComponent
