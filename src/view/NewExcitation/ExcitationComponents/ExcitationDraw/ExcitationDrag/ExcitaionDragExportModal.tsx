import React, { useCallback, useMemo, useState } from 'react'
import { Modal, Upload, Button, message } from 'antd'
import { CheckCircleTwoTone, InboxOutlined, CloseCircleTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import { UploadFile } from 'antd/lib/upload/interface'
import { sleep } from 'Src/util/baseFn'
import utils from 'Src/view/template/TemplateResult/utils'
import { saveExcitaionFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'

const { Dragger } = Upload

interface TemplateDialogProps {
  visible: boolean
  onOk: () => void
}

export type rcFile = File & UploadFile & { reponse?: string }

const generateRcFileObject = (file: rcFile, status: UploadFile['status'], message?: string) => {
  return Object.assign(file, { status, response: message })
}

let stopSignal = false

const TemplateDialog: React.FC<TemplateDialogProps> = ({ visible, onOk }) => {
  const [originalFileList, setOriginalFileList] = useState<rcFile[]>([])
  const effectiveFileList = useMemo(() => originalFileList.filter(rcFile => rcFile.status === 'done'), [originalFileList])
  // 0 未上传 1 上传中 2 上传结束
  const [uploading, setUploading] = useState(0)

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

  // 批量上传文件
  const uploadFiles = useCallback(async () => {
    if (effectiveFileList.length === 0) {
      message.error('您还没有选择有效的文件')
      return
    }
    setUploading(1)
    await sleep(1000)
    let list = [] as any[]
    for (const rcFile of effectiveFileList) {
      try {
        const fileText = await utils.templateDataChecker.readFileText(rcFile)
        const std = JSON.parse(fileText)
        if (typeof rcFile === 'object' && (rcFile as rcFile).uid) {
          Object.assign(std, { uid: (rcFile as rcFile).uid })
        }
        list = list.concat([std])
      } catch {
        const index = originalFileList.findIndex(_ => _.uid === rcFile.uid)
        setOriginalFileList(originalFileList => {
          const og = originalFileList
          og[index].status = 'error'
          og[index].response = '导入失败=>目标激励无效，请检查文件内容'
          return [...originalFileList]
        })
        // eslint-disable-next-line no-continue
        continue
      }
    }
    for (const item of list) {
      const params = {
        name: item.name,
        gu_cnt0: item.gu_cnt0,
        gu_w0: item.gu_w0,
        peripheral: item.peripheral,
        template: item.template
      }
      try {
        await saveExcitaionFn(params)
        if (stopSignal) {
          stopSignal = false
          return
        }
        const index = originalFileList.findIndex(rcFile => rcFile.uid === item.uid)
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
        const index = originalFileList.findIndex(rcFile => rcFile.uid === item.uid)
        // if (index < 0) return
        setOriginalFileList(originalFileList => {
          const og = originalFileList
          og[index].status = 'error'
          og[index].response = `导入失败 => ${throwErrorMessage(
            error,
            { 1005: '目标激励已存在', 4003: '该激励无效，请检查激励', 1006: '格式校验不通过，请检查文件内容' },
            false
          ).replace(/name/, '名称')}`
          return [...originalFileList]
        })
      }
    }
    setUploading(2)
  }, [effectiveFileList, originalFileList])

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
    <Modal width={600} title='导入激励' visible={visible} onCancel={closeDialog} footer={null}>
      {uploading === 0 ? (
        <>
          <Dragger multiple beforeUpload={checkFile} fileList={originalFileList} onRemove={removeFile}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>请选择文件或拖动文件到框内</p>
            <p className='ant-upload-hint'>仅支持 json 文件格式</p>
          </Dragger>
          <div
            style={{
              display: 'flex',
              padding: '16px 0',
              justifyContent: 'flex-end'
            }}
          >
            <Button type='primary' disabled={effectiveFileList.length === 0} onClick={uploadFiles}>
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
          <div
            style={{
              display: 'flex',
              padding: '16px 0',
              justifyContent: 'flex-end'
            }}
          >
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
