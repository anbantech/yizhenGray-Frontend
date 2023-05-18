import React, { useCallback, useContext, useState } from 'react'
import { Button, Upload, Modal } from 'antd'
import importb from 'Image/Template/importb.svg'
import importw from 'Image/Template/importw.svg'
import eye_grey from 'Image/Template/eye.svg'
import eye_blue from 'Image/Template/eye1.svg'
import { warn } from 'Src/util/common'
import ExportButton from 'Src/components/Button/ExportButton'
import styles from './createTemplateTitle.less'

import { TemplateContext, TEMPLATE_VERSION } from './templateContext'
import { TemplateStatus } from './createTemplateWrapper'
import Utils from '../TemplateResult/utils'

// 根据状态显示是创建模板，还是修改模板
const generateTitle = (status: TemplateStatus, name?: string) => {
  if (status === TemplateStatus.CREATE) {
    return '创建模板'
  }
  if (status === TemplateStatus.CONFIG) {
    return '修改模板'
  }
  return name
}

/**
 * 过滤后端时间参数，去除点后面的精度
 * 2022-04-12 10:25:20.530227 => 2022-04-12 10:25:20
 * 2022
 * @param time
 * @returns
 */
const normalizeBackendTime = (time: string) => {
  return time && time.split('.')[0]
}

const CreateTemplateTitle: React.FC = () => {
  /**
   * 初始化页面状态
   * 包括模板状态、模板ID、模板基本信息、模板管理和预期模板管理
   */
  const { template, templateDispatch } = useContext(TemplateContext)
  const { status, baseInfo, templateId, templateElements } = template
  const readonly = status === TemplateStatus.READ

  /**
   * 用于控制预览 Dialog 打开关闭和预览内容
   */
  const [previewDialog, setPreviewDialog] = useState(false)
  const [previewDialogContent, setPreviewDialogContent] = useState('')
  const previewDialogFooter = <div className={styles.preview_dialog_footer} />

  /**
   * 为预览对话框填充预览内容
   * 预览内容从页面状态组件中获取
   */
  const previewTemplate = useCallback(async () => {
    // function normalizeExpectedElements(elements: any[] | undefined) {
    //   if (!elements || !Array.isArray(elements) || elements.length === 0) return []
    //   return elements.flat().map(ele => ({
    //     name: ele.name,
    //     size: ele.size,
    //     value: ele.value,
    //     rules: ele.rules
    //   }))
    // }
    const exportJson = {
      name: baseInfo.name,
      description: baseInfo.description,
      createTime: baseInfo.createTime,
      elements: templateElements,
      // expected_elements: normalizeExpectedElements(responseTemplate.elements),
      // parser: responseTemplate.parser,
      exportTime: new Date(),
      version: TEMPLATE_VERSION
    }
    setPreviewDialogContent(JSON.stringify(exportJson, null, 4))
    setPreviewDialog(true)
  }, [baseInfo, templateElements])

  const closePreviewDialog = useCallback(() => {
    setPreviewDialog(false)
  }, [])

  /**
   * 导出模板和批量导出走统一的逻辑
   * 从接口获取模板详情后导出
   */
  const exportTemplate = async () => {
    Utils.templateDataLoader.singleExporter(templateId, baseInfo.name)
  }

  /**
   * 导入模板
   * 1. 把文本内容当作 json 解析
   * 2. 检查单模板格式，是否是有效的模板格式，只校验格式
   * 3. 检查模板管理能否转化为 tdList，检查模板管理的内容是否正确
   *    如果不能成功转化，说明导入的模板格式存在问题
   *    如果转化成功，则将原数据写入页面状态中，在对应的组件观察，并走 init 逻辑
   * 4. 检查预期模板格式是否正确
   */
  type importTemplateFn = (file: File) => false
  const importTemplate: importTemplateFn = file => {
    const reader = new FileReader()
    reader.addEventListener('load', e => {
      let std, elements
      // 解析文本
      try {
        std = JSON.parse(e.target?.result as string)
      } catch {
        warn(true, '导入失败，请检查 JSON 格式是否正确')
        return
      }
      // 检查 json 模板格式
      try {
        Utils.templateDataChecker.singleTemplateChecker(std)
        // eslint-disable-next-line prefer-destructuring
        elements = std.elements
      } catch (error) {
        warn(true, `${error.message}`)
        return
      }
      // 检查模板能否成功转化
      const [, flag1] = Utils.transformElements2TdList(elements, template.ptList)
      // 检查预期模板格式
      // const flag2 = Utils.responseTemplateChecker(std.expected_elements)
      const flag2 = true
      if (flag1 && flag2) {
        templateDispatch({
          type: 'initTemplateDetail',
          value: {
            name: std.name,
            desc: std.description,
            create_time: std.createTime,
            elements: std.elements
            // expected_template: {
            //   parser: std.parser,
            //   elements: std.expected_elements
            // }
          }
        })
      } else {
        warn(true, '导入失败，请检查模板内容是否正确')
      }
    })
    reader.readAsText(file)
    return false
  }

  return (
    <div className={styles.template_title_wrapper}>
      <div>
        <h1 className={styles.template_title}>{generateTitle(status, baseInfo.name)}</h1>
        {readonly && (
          <p>
            <span>{baseInfo.description || '无描述'}</span>
            <span style={{ padding: '0 4px' }}>|</span>
            <span>{normalizeBackendTime(baseInfo.createTime) || '创建时间未知'}</span>
          </p>
        )}
      </div>
      <div>
        {readonly ? (
          <>
            <Button type='default' onClick={previewTemplate} className={styles.eye_button}>
              <img src={eye_grey} alt='export' className={styles.deactive} />
              <img src={eye_blue} alt='export' className={styles.active} />
              预览模板
            </Button>
            <ExportButton name='导出模板' onClick={exportTemplate} />
          </>
        ) : (
          <>
            <Upload accept='.json, .zip' beforeUpload={importTemplate} showUploadList={false} className={styles.export_template_button}>
              <div style={{ padding: '4px 11px' }}>
                <img src={importb} alt='export' className={styles.deactive} />
                <img src={importw} alt='export' className={styles.active} />
                <span className={styles.title}>导入模板</span>
              </div>
            </Upload>
          </>
        )}
      </div>
      <Modal
        title='模板预览'
        visible={previewDialog}
        onCancel={closePreviewDialog}
        footer={previewDialogFooter}
        width={680}
        wrapClassName={styles.preview_dialog}
      >
        <p className={styles.preview_dialog_content}>{previewDialogContent}</p>
      </Modal>
    </div>
  )
}

export default CreateTemplateTitle
