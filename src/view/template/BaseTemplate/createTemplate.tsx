import React, { useContext, CSSProperties } from 'react'
import MainBorder from 'Src/components/MainBorder/MainBorder'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import StepTag from 'Src/components/StepTag/StepTag'
import styles from './createTemplate.less'
import PrimitiveList from '../PrimitiveList/primitiveList'
import CreateResponseTemplate from '../ResponseTemplate/createResponseTemplate'
import TemplateForm from '../TemplateForm/templateForm'
import { TemplateContext } from './templateContext'
import { TemplateStatus } from './createTemplateWrapper'
import CreateTemplateTitle from './createTemplateTitle'
import TemplateResult from '../TemplateResult/templateResult'

const containerWrapperStyle: CSSProperties = {
  flexDirection: 'initial',
  justifyContent: 'space-between'
}

/**
 * 模板组件
 * 当渲染查看组件的页面时，不需要拖拽逻辑及侧边栏逻辑，只渲染模板区域即可
 * 当渲染编辑组件的页面时，需要拖拽逻辑和侧边栏逻辑
 */
const CreateTemplateComponent: React.FC = () => {
  const { template } = useContext(TemplateContext)
  const { status } = template
  const readonly = status === TemplateStatus.READ

  const nameRenderFn = () => {
    return (
      <>
        {!readonly && <StepTag step='2' />}
        <span style={{ marginLeft: '12px' }}>发送模板配置</span>
      </>
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
          <CreateResponseTemplate />
        </>
      ) : (
        <>
          <CreateTemplateTitle />
          <MainBorder wrapperClass={styles.template_wrapper} containerWrapperStyle={containerWrapperStyle} name={nameRenderFn}>
            <TemplateResult />
          </MainBorder>
          <CreateResponseTemplate />
        </>
      )}
    </>
  )
}

CreateTemplateComponent.displayName = 'CreateTemplateComponent'

export default CreateTemplateComponent
