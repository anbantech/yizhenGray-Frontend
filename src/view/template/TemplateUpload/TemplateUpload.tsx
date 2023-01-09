import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Modal, Upload, Button, message } from 'antd'
import { CheckCircleTwoTone, InboxOutlined, CloseCircleTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import { UploadFile } from 'antd/lib/upload/interface'
import { sleep, throwErrorMessage } from 'Utils/common'
import utils from 'Src/view/template/TemplateResult/utils'
import API from 'Src/services/api'
import { GlobalContext } from 'Src/globalContext/globalContext'

const { Dragger } = Upload

interface TemplateDialogProps {
  visible: boolean
  onOk: () => void
  protocolId: number
}

export type rcFile = File & UploadFile & { reponse?: string }

const generateRcFileObject = (file: rcFile, status: UploadFile['status'], message?: string) => {
  return Object.assign(file, { status, response: message })
}

let stopSignal = false

const TemplateDialog: React.FC<TemplateDialogProps> = ({ visible, onOk, protocolId }) => {
  const [originalFileList, setOriginalFileList] = useState<rcFile[]>([])
  const effectiveFileList = useMemo(() => originalFileList.filter(rcFile => rcFile.status === 'done'), [originalFileList])
  // 0 未上传 1 上传中 2 上传结束
  const [uploading, setUploading] = useState(0)
  const {
    config: { parserSelectors }
  } = useContext(GlobalContext)
  const parserSelectorValues = useMemo(() => parserSelectors.map(parser => parser.value), [parserSelectors])

  // checkFile 校验文件类型，非 json 格式不接受
  const checkFile = useCallback(async (file: rcFile) => {
    if (file.type === 'application/json') {
      setOriginalFileList(originalFileList => originalFileList.concat([generateRcFileObject(file, 'done')]))
    } else {
      setOriginalFileList(originalFileList => originalFileList.concat([generateRcFileObject(file, 'error', '文件格式错误')]))
    }
    return false
  }, [])

  // 从上传列表中删除单个文件
  const removeFile = useCallback(file => {
    setOriginalFileList(originalFileList => originalFileList.filter(rcFile => rcFile.uid !== file.uid))
  }, [])

  // 清空上传列表
  const clearFiles = useCallback(() => {
    setOriginalFileList([])
  }, [])

  // 批量上传文件
  const uploadFiles = useCallback(async () => {
    if (effectiveFileList.length === 0) {
      message.error('您还没有选择有效的文件')
      return
    }
    setUploading(1)
    await sleep(1000)
    let templateList = [] as any[]
    // 解析文件，解析模板 json，解析失败的不做上传
    for (const rcFile of effectiveFileList) {
      try {
        const fileText = await utils.templateDataChecker.readFileText(rcFile)
        const std = JSON.parse(fileText)
        utils.templateDataChecker.singleTemplateChecker(std, {
          validator(std) {
            return parserSelectorValues.includes(std.parser)
          },
          message: `已支持的解析器类型中不存在 ${std.parser}`
        })
        const flag = utils.responseTemplateChecker(std.expected_elements)
        if (!flag) {
          throw new Error('预期模板校验失败')
        }
        if (typeof rcFile === 'object' && (rcFile as rcFile).uid) {
          Object.assign(std, { uid: (rcFile as rcFile).uid })
        }
        templateList = templateList.concat([std])
      } catch (error) {
        const index = originalFileList.findIndex(_ => _.uid === rcFile.uid)
        setOriginalFileList(originalFileList => {
          const og = originalFileList
          og[index].status = 'error'
          og[index].response = error.message === '校验失败 => 模板与当前版本不匹配' ? error.message : '模板格式不正确'
          return [...originalFileList]
        })
        // eslint-disable-next-line no-continue
        continue
      }
      // const template = await utils.templateDataLoader.importer('json', rcFile)
      // templateList = templateList.concat([std])
    }
    // 模板上传
    for (const template of templateList) {
      const params = {
        desc: template.description,
        elements: template.elements,
        engine_id: 1,
        name: template.name,
        expected_name: template.name,
        expected_elements: template.expected_elements,
        parser: template.parser,
        protocol_id: protocolId
      }
      try {
        await API.createTemplate(params)
        if (stopSignal) {
          stopSignal = false
          return
        }
        const index = originalFileList.findIndex(rcFile => rcFile.uid === template.uid)
        setOriginalFileList(originalFileList => {
          const og = originalFileList
          og[index].status = 'success'
          og[index].response = '上传成功'
          return [...originalFileList]
        })
      } catch (error) {
        if (stopSignal) {
          stopSignal = false
          return
        }
        const index = originalFileList.findIndex(rcFile => rcFile.uid === template.uid)
        // if (index < 0) return
        setOriginalFileList(originalFileList => {
          const og = originalFileList
          og[index].status = 'error'
          og[index].response = `上传失败 => ${throwErrorMessage(
            error,
            { 1005: '模板名称与已创建的模板重复', 4003: '该模板无效，请检查模板' },
            false
          ).replace(/name/, '模板名称')}`
          return [...originalFileList]
        })
      }
    }
    setUploading(2)
  }, [effectiveFileList, originalFileList, parserSelectorValues, protocolId])

  const closeDialog = useCallback(async () => {
    // 如果关闭弹窗的行为发生在上传过程中，发送停止信号量给 uploadFiles 函数
    if (uploading === 1) {
      stopSignal = true
      // 在 uploadFiles 函数修复状态前，阻塞
      // eslint-disable-next-line no-unmodified-loop-condition
      while (stopSignal) {
        await sleep(100)
      }
    }
    onOk()
    clearFiles()
    setUploading(0)
  }, [clearFiles, onOk, uploading])

  const back2UploadStatus = useCallback(() => {
    setUploading(0)
  }, [])

  return (
    <Modal width={600} title='导入模板' visible={visible} onCancel={closeDialog} footer={null}>
      {uploading === 0 ? (
        <>
          <Dragger multiple beforeUpload={checkFile} fileList={originalFileList} onRemove={removeFile}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>请选择文件或拖动文件到框内</p>
            <p className='ant-upload-hint'>仅支持 json 文件格式</p>
          </Dragger>
          <div style={{ display: 'flex', padding: '16px 0', justifyContent: 'flex-end' }}>
            <Button type='primary' onClick={uploadFiles}>
              上传
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            {originalFileList.map(rcFile => (
              <p key={rcFile.uid}>
                {rcFile.status === 'done' && <ExclamationCircleOutlined />}
                {rcFile.status === 'success' && <CheckCircleTwoTone twoToneColor='#52c41a' />}
                {rcFile.status === 'error' && <CloseCircleTwoTone twoToneColor='#eb2f96' />}
                <span style={{ paddingLeft: '18px' }}>{rcFile.name}</span>
                <span style={{ paddingLeft: '18px' }}>{rcFile.response}</span>
              </p>
            ))}
          </div>
          <div style={{ display: 'flex', padding: '16px 0', justifyContent: 'flex-end' }}>
            <Button disabled={uploading === 1} onClick={back2UploadStatus} style={{ marginRight: '16px' }}>
              返回
            </Button>
            <Button type='primary' disabled={uploading === 1} onClick={closeDialog}>
              关闭
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default TemplateDialog
