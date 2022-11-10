// import { ConfigProvider, message, Table } from 'antd'
// import zhCN from 'antd/lib/locale/zh_CN'
// import React, { useCallback, useEffect, useState } from 'react'
// import { withRouter } from 'react-router-dom'
// import PaginationsAge from 'Src/components/Pagination/Pagina'

// import { getUserList } from 'Src/services/api/uesrManagementApi'
// // import NoProject from 'Src/views/project/NoProject/NoProject'
// // import UserModal from 'Src/components/Modle/userModel'
// // import styles from '../../ByPass/ByPass.less'
// // import userLogoStyle from '../userLogoStyle.less'
// // import BeginButton from '../../../components/Button/Begin'

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
//   end_time: string
// }
// interface roleType {
//   [index: string]: string
// }

// function UserList() {
//   const [isRequest, setIsRequest] = useState<userParamsList>({ ...request })
//   const [total, setTotal] = useState<number>() // 总共表格数据
//   const [isData, setData] = useState<any>(null!) // 表格数据
//   const [isModalVisible, setIsModalVisible] = useState(false) // 控制弹出框
//   const [id, setId] = useState<number>(-1)
//   const [title, setTitle] = useState<string>('')
//   const [user, setuser] = useState<string>('')
//   const getUserInfo = async (value: userParamsList) => {
//     try {
//       const res = await getUserList(value)
//       if (res.data) {
//         setData(res.data.results)
//         setTotal(res.data.total)
//       }
//     } catch (error) {
//       message.error(error)
//     }
//   }

//   const opetation = (type: string, id?: number, name?: string) => {
//     setId(id as number)
//     setuser(name as string)
//     setTitle(type === 'delete' ? '删除用户' : type === 'edit' ? '编辑用户' : type === 'new' ? '新增用户' : '')
//     setIsModalVisible(true)
//   }

//   const control = useCallback(
//     (value: boolean) => {
//       setIsModalVisible(value)
//       setIsRequest({ ...isRequest, page: 1 })
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [isModalVisible]
//   )
//   useEffect(() => {
//     getUserInfo(isRequest)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isRequest])
//   const customizeRenderEmpty = () => (
//     <NoProject
//       name='未搜索到相关用户信息
//      '
//     />
//   )

//   const roleLists: roleType = {
//     common: '普通用户'
//   }
//   const columns = [
//     {
//       title: '用户名',
//       dataIndex: 'username',
//       key: 'username',
//       width: '25%'
//     },
//     {
//       width: '25%',
//       title: '角色',
//       dataIndex: 'roles',
//       key: 'roles',
//       // eslint-disable-next-line react/display-name
//       render: (item: string[]) => {
//         return <div key={Math.random()}>{roleLists[item[0]]}</div>
//       }
//     },
//     {
//       title: '操作时间',
//       dataIndex: 'update_time',
//       key: 'update_time',
//       width: '25%',
//       // eslint-disable-next-line react/display-name
//       render: (item: any) => {
//         return (
//           <div key={Math.random()}>
//             <span>{item.split('.')[0]}</span>
//           </div>
//         )
//       }
//     },
//     {
//       title: '操作',
//       dataIndex: 'operations',
//       key: 'operations',
//       // eslint-disable-next-line react/display-name
//       render: (_: any, row: any) => {
//         return (
//           <div className={userLogoStyle.tableBtn} key={Math.random()}>
//             {' '}
//             <span
//               role='button'
//               tabIndex={0}
//               onClick={() => {
//                 opetation('edit', row.id)
//               }}
//             >
//               编辑
//             </span>
//             <span role='button' tabIndex={0} onClick={() => opetation('delete', row.id, row.username)}>
//               删除
//             </span>
//           </div>
//         )
//       },
//       width: '10%'
//     }
//   ]
//   const setPage = (value: number) => {
//     setIsRequest({ ...isRequest, page: value })
//   }
//   const customizeRender = () => <NoProject name='暂无数据' />
//   return (
//     <div className={styles.bypass_container}>
//       <div className={userLogoStyle.header}>
//         <span className={styles.bypass_title}>用户列表</span>
//         <BeginButton
//           width='146px'
//           name='新增用户'
//           onClick={() => {
//             opetation('new')
//           }}
//           size='large'
//           type='primary'
//         />
//       </div>
//       <div className={userLogoStyle.tableConcent}>
//         <ConfigProvider locale={zhCN} renderEmpty={isData?.length === 0 && isRequest.key_word.length === 0 ? customizeRender : customizeRenderEmpty}>
//           <Table rowKey='id' dataSource={isData} columns={columns} pagination={false} />
//         </ConfigProvider>
//       </div>
//       {isData?.length > 0 && <PaginationsAge length={total} num={6} getParams={setPage} pagenums={isRequest.page} />}
//       <UserModal user={user} control={control} id={id} isModalVisible={isModalVisible} typeTitle={title} />
//     </div>
//   )
// }

// export default withRouter(UserList)
const UserList = '1'
export default UserList
