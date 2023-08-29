/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'

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

function Report(props: any) {
  const { search } = props.location
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  const getReportData = async (id: number) => {
    try {
      const reportData = await exportReport(id)
      if (reportData.code === 0) {
        setLoading(true)
        return reportData
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throwErrorMessage(error)
      return error
    }
  }
  const loopRef = useRef<any>()

  const getData = async (id: number) => {
    const res = await getReportData(id)
    if (res?.code === 2016) return
    setReportData(res.data)
    return res
  }
  useEffect(() => {
    const id = search.split('?')[1].split('=')
    if (loading) {
      getData(id[1])
        .then(res => {
          const reportDataElement = document.querySelector('#reportData') as HTMLIFrameElement
          if (reportDataElement && res.data) {
            reportDataElement.addEventListener('load', () => {
              reportDataElement.style.overflowX = 'hidden'
              reportDataElement.contentWindow?.postMessage(JSON.stringify(res.data), '*')
            })
          }
          return res
        })
        .catch(() => {})
    }
  }, [loading])
  useEffect(() => {
    const id = search.split('?')[1].split('=')
    if (!loading) {
      loopRef.current = setInterval(() => {
        if (id) {
          getReportData(id[1])
        }
      }, 3000)
    }
    return () => {
      clearInterval(loopRef.current)
    }
  }, [loading])
  // 下载报告

  const exportReportZip = async () => {
    const name = decodeURIComponent(search).split('?')[2].split('=')
    const datajsFileString = `const reportData=${JSON.stringify(reportData)};window.reportData=reportData;`
    const datajsFileBlob = new Blob([datajsFileString], { type: 'application/javascript' })
    const htmlFileBlob = (await axios.get('/report/index.html', { responseType: 'blob' })).data
    const bundlejsFileBlob = (await axios.get('/report/lib/bundle.js', { responseType: 'blob' })).data
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

  const exportReportPDF = React.useCallback(async () => {
    notification.info({
      key: 'pdf-report',
      message: `PDF 报告正在生成中...`,
      placement: 'bottomLeft',
      duration: null
    })
    try {
      const id = search.split('?')[1].split('=')
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
  }, [search])

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
      {loading ? (
        reportData.length !== 0 && (
          <div className={style.report}>
            <div className={style.positionBtn}>
              <Dropdown overlay={menuItems} placement='bottom'>
                <Button>下载报告</Button>
              </Dropdown>
            </div>
            <iframe id='reportData' src='/onLineReporting/index.html' width='100%' height='100%' allowFullScreen frameBorder='0' title='报告' />
          </div>
        )
      ) : (
        <ReportLoading value='报告正在加载中' />
      )}
    </>
  )
}

export default Report
