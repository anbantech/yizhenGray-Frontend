/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from 'react'

import axios from 'axios'
import JSZip from 'jszip'
import { Button, Dropdown, Menu, message, notification } from 'antd'

import { throwErrorMessage } from 'Src/util/message'
import { warn } from 'Src/util/common'
import { downloadPDFReport, exportReport } from 'Src/services/api/taskApi'
import style from './Report.less'
import ReportLoading from './reportLoading'

// 纯前端创建文件下载
const browserDownload = {
  ifHasDownloadAPI: 'download' in document.createElement('a'),
  createFrontendDownloadAction(name: string, content: Blob) {
    if ('download' in document.createElement('a')) {
      const link = document.createElement('a')
      link.download = `${name}`
      link.href = URL.createObjectURL(content)
      link.click()
    } else {
      warn(true, '您的浏览器不支持下载方法，请更新您的浏览器到最新版本')
    }
  }
}

/**
 * 解析 URL 中的参数
 */
function parseURL<T>() {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const searchParams = {} as Record<string, unknown>
  urlSearchParams.forEach((value, key) => {
    searchParams[key] = value
  })

  return searchParams as T
}

interface ReportURLParams {
  id: string
  name: string
}

function Report(props: any) {
  const reportURLParams = parseURL<ReportURLParams>()
  const { search } = props.location
  const [reportData, setReportData] = useState([])
  const [loadingStatus, setLoadingStatus] = useState<'none' | 'fetching' | 'done' | 'error'>('none')
  const [hasRendered, setHasRendered] = useState(false)
  const loopRef = useRef<any>()

  const postMessageToIframe = useCallback(
    reportData => {
      const reportDataElement = document.querySelector('#reportData') as HTMLIFrameElement
      if (reportDataElement && reportData) {
        reportDataElement.addEventListener('load', () => {
          reportDataElement.style.overflowX = 'hidden'
          reportDataElement.contentWindow?.postMessage(JSON.stringify(reportData), '*')
        })
        window.addEventListener('message', message => {
          if (message.data === '__AB_REPORT_DONE__') {
            setHasRendered(true)
          }
        })
      }
    },
    [reportData]
  )

  const getReportData = useCallback(async (): Promise<void> => {
    const { id } = reportURLParams
    if (!id || ['fetching', 'done'].includes(loadingStatus)) return
    try {
      setLoadingStatus('fetching')
      const res = await exportReport(id)
      if (res.code === 0) {
        setLoadingStatus('done')
        setReportData(res.data)
        postMessageToIframe(res.data)
        return
      }
      setLoadingStatus('error')
    } catch (error) {
      setLoadingStatus('error')
      throwErrorMessage(error)
    }
  }, [loadingStatus])

  useEffect(() => {
    loopRef.current = setInterval(getReportData, 5000)

    return () => {
      clearInterval(loopRef.current)
    }
  }, [getReportData])

  // 下载报告
  const exportReportZip = async () => {
    notification.info({
      key: 'html-report',
      message: `HTML 报告正在生成中...`,
      placement: 'bottomLeft',
      duration: null
    })
    const name = decodeURIComponent(search).split('?')[2].split('=')
    const datajsFileString = `const reportData=${JSON.stringify(reportData)};window.reportData=reportData;`
    const datajsFileBlob = new Blob([datajsFileString], { type: 'application/javascript' })
    const htmlFileBlob = (await axios.get('/HtmlReport/index.html', { responseType: 'blob' })).data
    const bundlejsFileBlob = (await axios.get('/HtmlReport/lib/bundle.js', { responseType: 'blob' })).data
    const zipInstance = new JSZip()
    zipInstance.file('index.html', htmlFileBlob)
    zipInstance.folder('lib')!.file('data.js', datajsFileBlob)
    zipInstance.folder('lib')!.file('bundle.js', bundlejsFileBlob)
    const content = await zipInstance.generateAsync({ type: 'blob' })
    if ('download' in document.createElement('a')) {
      const link = document.createElement('a')
      link.download = `${name[1]}.zip`
      link.href = URL.createObjectURL(content)
      link.click()
    } else {
      message.error('您的浏览器不支持下载功能')
    }
  }

  const exportReportPDF = async () => {
    notification.info({
      key: 'pdf-report',
      message: `PDF 报告正在生成中...`,
      placement: 'bottomLeft',
      duration: null
    })
    try {
      const { id } = reportURLParams
      const res = (await downloadPDFReport(id, {
        onDownloadProgress() {
          notification.info({
            key: 'pdf-report',
            message: 'PDF 报告正在下载中...',
            placement: 'bottomLeft'
          })
        }
      })) as any
      if (res.data) {
        browserDownload.createFrontendDownloadAction(decodeURIComponent(res.fileName), new Blob([res.data]))
      }
      notification.close('pdf-report')
    } catch (error) {
      message.error(error)
    }
  }

  const menuItems = (
    <Menu>
      <Menu.Item key='html'>
        <p style={{ marginBottom: 0 }} onClick={exportReportZip}>
          下载 HTML 报告
        </p>
      </Menu.Item>
      <Menu.Item key='pdf'>
        <p style={{ marginBottom: 0 }} onClick={exportReportPDF}>
          下载 PDF 报告
        </p>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      {loadingStatus === 'done' && reportData.length !== 0 && (
        <div className={style.report}>
          <div className={style.positionBtn}>
            <Dropdown overlay={menuItems} placement='bottom'>
              <Button>下载报告</Button>
            </Dropdown>
          </div>
          <iframe id='reportData' src='/onLineReporting/index.html' width='100%' height='100%' allowFullScreen frameBorder='0' title='报告' />
        </div>
      )}
      {!hasRendered && <ReportLoading value='报告正在生成中' />}
    </>
  )
}

export default Report
