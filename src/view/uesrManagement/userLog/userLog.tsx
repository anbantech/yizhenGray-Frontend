/*
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-08-30 14:03:39
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-04 18:24:39
 * @FilePath: /yizhen-frontend/src/views/uesrManagement/userLog/userLog.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import { Button, ConfigProvider, DatePicker, message, Space, Table } from 'antd'
// import zhCN from 'antd/lib/locale/zh_CN'
// import React, { useEffect, useState } from 'react'
// import { withRouter } from 'react-router-dom'
// import ByPassInput from 'Src/views/ByPass/ByPassComponent/ByPassInput'
// import exportImage_blue from 'Image/Template/export.svg'
// import exportImage_white from 'Image/Template/export1.svg'
// import locale from 'antd/es/date-picker/locale/zh_CN'
// import detailStyle from 'Src/views/project/Detail/Detail.less'
// import PaginationsAge from 'Src/components/Pagination/Pagina'
// import { exportUserLog, userLogInfo } from 'Src/Api/uesrManagementApi'
// import NoProject from 'Src/views/project/NoProject/NoProject'
// import { throwErrorMessage } from 'Src/utils/common'
// import styles from '../../ByPass/ByPass.less'
// import userLogoStyle from '../userLogoStyle.less'

// const request = {
//   key_word: '',
//   page: 1,
//   page_size: 6,
//   sort_field: 'create_time',
//   sort_order: 'descend',
//   start_time: '',
//   end_time: ''
// }
// interface userParamsList {
//   key_word: string
//   page: number
//   page_size: number
//   sort_field: string
//   sort_order: string
//   start_time: string
//   end_time:string
// }
// const { RangePicker } = DatePicker
// function UserLog() {
//   const [imgShow, setImgShow] = useState<boolean>(false)
//   const [isRequest, setIsRequest] = useState<userParamsList>({ ...request })
//   const [total, setTotal] = useState<number>()
//   const [isData, setData] = useState<any>(null!)
//   const cancelChartImg = (value: string) => {
//     setImgShow(false)
//     setIsRequest({ ...isRequest, key_word: value, page: 1 })
//   }
//   const inputChangeValue = (val: string) => {
//     setImgShow(true)
//     setIsRequest({ ...isRequest, key_word: val, page: 1 })
//   }
//   const onChangeTime = (value: any, dateString: any) => {
//     setIsRequest({ ...isRequest, page: 1, start_time: dateString[0], end_time: dateString[1] })
//   }

//   const getUserInfo = async (value:userParamsList) => {
//     try {
//       const res = await userLogInfo(value)
//       if (res.data) {
//         setData(res.data.results)
//         setTotal(res.data.total)
//       }
//     } catch (error) {
//       message.error(error)
//     }
//   }

//   // 导出日志
//   const exportLogTimeOperation = async (value:userParamsList) => {
//     await exportUserLog({ key_word: value.key_word, start_time: value.start_time, end_time: value.end_time })
//       .then((res: any) => {
//         const blob = new Blob([res.data])
//         const src = URL.createObjectURL(blob)
//         if (src && 'download' in document.createElement('a')) {
//           const elink = document.createElement('a')
//           const downloadName = value.start_time && value.end_time ? `操作日志（${value.start_time}-${value.end_time}）.xlsx` : '操作日志.xlsx'
//           elink.download = downloadName
//           elink.href = src
//           elink.click()
//         }
//         return res
//       })
//       .catch((error:any) => {
//         throwErrorMessage(error, { 1000: '未知异常' })
//       })
//   }
//   useEffect(() => {
//     getUserInfo(isRequest)
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isRequest])
//   const customizeRenderEmpty = () => (
//     <NoProject
//       name='未搜索到相关用户信息
//      '
//     />
//   )

//   const columns = [
//     {
//       title: '序号',
//       dataIndex: 'id',
//       key: 'id'
//     },
//     {
//       title: '操作内容',
//       dataIndex: 'content',
//       key: 'content',
//       width: '40%'
//     },
//     {
//       title: '操作用户',
//       dataIndex: 'username',
//       key: 'username'
//     },
//     {
//       title: '操作时间',
//       dataIndex: 'update_time',
//       key: 'update_time',
//       // eslint-disable-next-line react/display-name
//       render: (item:any) => {
//         return (<><span>{item.split('.')[0]}</span></>)
//       }
//     }
//   ]
//   const setPage = (value: number) => {
//     setIsRequest({ ...isRequest, page: value })
//   }
//   const customizeRender = () => <NoProject name='暂无数据' />
//   return (

//     <div className={styles.bypass_container} >
//       <span className={styles.bypass_title}>操作日志</span>
//       <div className={styles.bypass_header}>
//         <div className={styles.bypass_header_LEFT}>
//           <ByPassInput
//             placeholder='搜索操作内容'
//             inputChangeValue={inputChangeValue}
//             chart={isRequest.key_word}
//             imgShow={imgShow}
//             cancelChartImg={cancelChartImg}
//           />
//         </div>
//         <div className = {userLogoStyle.headerRight}>
//           <Space direction='vertical' size={2} style={{ marginLeft: '20px', marginBottom: '2px' }}>
//             <RangePicker
//               showTime={{ format: 'HH:mm' }}
//               format='YYYY-MM-DD HH:mm'
//               onChange={onChangeTime}
//               locale={locale}
//               getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
//             />
//             <p style={{ color: 'rgba(0, 0, 0, 0.55)', marginBottom: '0' }}>* 未筛选时间情况下，默认导出全部操作日志</p>
//           </Space>
//           <Button
//             type='default'
//             onClick={() => {
//               exportLogTimeOperation(isRequest)
//             }}
//             className={detailStyle.export_template_button}
//           >
//             <img src={exportImage_blue} alt='export' className={detailStyle.deactive} />
//             <img src={exportImage_white} alt='export' className={detailStyle.active} />
//             导出日志
//           </Button>
//         </div>
//       </div>

//       <div className={userLogoStyle.tableConcent}>
//         <ConfigProvider locale={zhCN} renderEmpty={isData?.length === 0 && isRequest.key_word.length === 0 ? customizeRender : customizeRenderEmpty}>
//           <Table dataSource={isData} columns={columns} pagination={false} />
//         </ConfigProvider>
//       </div>
//       {isData?.length > 0 && <PaginationsAge length={total} num={6} getParams={setPage} pagenums={isRequest.page} />}
//     </div>

//   )
// }

// export default withRouter(UserLog)

const UserLog = '1'
export default UserLog
