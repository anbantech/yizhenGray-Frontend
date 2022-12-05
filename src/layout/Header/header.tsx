/*
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-08-25 10:06:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-22 16:17:22
 * @FilePath: /yizhen-frontend/src/layout/Header/header.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useCallback, useContext, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Breadcrumb, Dropdown, Menu, Space, Modal, Form, Input, message, Button } from 'antd'
import { useHistory, withRouter } from 'react-router-dom'
import { GlobalContext } from 'Src/globalContext/globalContext'
import { logout as logoutService, resetPassword } from 'Src/services/api/loginApi'
import { throwErrorMessage } from 'Src/until/message'
import styles from './header.less'

interface ResetPasswordDialogProps {
  visible: boolean
  onOk?: (...args: any[]) => void
  onCancel?: (...args: any[]) => void
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({ visible, onOk, onCancel }) => {
  const [form] = Form.useForm()
  const { config: globalConfig } = useContext(GlobalContext)

  const onSuccess = useCallback(async () => {
    try {
      await form.validateFields()
    } catch {
      return
    }
    const values = form.getFieldsValue(true)
    try {
      await resetPassword({
        userId: globalConfig.userInfo.id,
        username: globalConfig.userInfo.username,
        password: values.newPassword,
        admin_password: values.oldPassword,
        confirm_password: values.checkPassword
      })
      message.success('密码修改成功')
      form.resetFields()
      onOk?.()
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [form, globalConfig.userInfo.id, globalConfig.userInfo.username, onOk])
  const [isDisableStatus, setDisabledStatus] = useState(true)
  const onValuesChange = (changedValues: any, allValues: any) => {
    const bol =
      allValues.oldPassword !== undefined &&
      allValues.oldPassword.length > 0 &&
      allValues.newPassword !== undefined &&
      allValues.newPassword.length > 0 &&
      allValues.checkPassword !== undefined &&
      allValues.checkPassword.length > 0
    if (bol) {
      setDisabledStatus(false)
    } else {
      setDisabledStatus(true)
    }
  }

  const onFail = useCallback(() => {
    form.resetFields()
    onCancel?.()
  }, [form, onCancel])

  return (
    <Modal
      className={styles.resetPasswordDialog}
      title='修改密码'
      visible={visible}
      onCancel={onFail}
      footer={[
        <Button key='back' onClick={onFail}>
          取消
        </Button>,
        <Button key='submit' disabled={isDisableStatus} type='primary' onClick={() => onSuccess()}>
          确定
        </Button>
      ]}
    >
      <Form form={form} onValuesChange={onValuesChange} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} autoComplete='off'>
        <Form.Item label='旧密码' name='oldPassword' rules={[{ required: true, message: '请输入旧密码' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          label='新密码'
          name='newPassword'
          rules={[
            { required: true, message: '请输入新密码' },
            {
              validateTrigger: 'onBlur',
              validator(_, value, callback) {
                const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\dA-Za-z]{8,20}$/
                if (reg.test(value)) {
                  return callback()
                }
                return callback('密码是数字、大小写字母组合，长度为8到20个字符')
              }
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label='确认密码'
          name='checkPassword'
          rules={[
            { required: true, message: '请二次确认新密码' },
            {
              validateTrigger: 'onBlur',
              validator(_, value, callback) {
                const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\dA-Za-z]{8,20}$/
                if (reg.test(value)) {
                  return callback()
                }
                return callback('密码是数字、大小写字母组合，长度为8-20个字符')
              }
            },
            {
              validateTrigger: 'onBlur',
              validator(rule, value, callback) {
                if (value === form.getFieldValue('newPassword')) {
                  callback()
                } else {
                  callback('两次输入的新密码不一致，请重新输入')
                }
              }
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  )
}

function Header(props: any) {
  const { config: globalConfig } = useContext(GlobalContext)
  const { userInfo } = globalConfig
  const { username, roles } = userInfo
  const data = props.location.state || null
  const { location } = props
  const { pathname } = props.location
  const pathSnippets = location.pathname.split('/').filter((i: any) => i)
  const extraBreadcrumbItems = pathSnippets.map((_: any, index: number) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    return url
  })
  const name: any = {
    '/projects': '项目列表',
    '/projects/Tasks': '任务列表',
    '/projects/Tasks/Detail': '任务详情',
    '/projects/Tasks/createTask': '新建任务',
    '/projects/Tasks/fixTask': '修改任务',
    '/projects/Tasks/Detail/lookTaskDetailInfo': '任务信息',
    '/projects/Tasks/Detail/TaskLog': '日志',
    '/excitationList': '激励列表',
    '/excitationList/Deatail': '激励详情',
    '/excitationList/createOneExcitation': '新建激励',
    '/excitationList/createDoubleExcitation': '新建级联激励',
    '/excitationList/createGroupExcitation': '新建组',
    '/UseCaseList': '用例列表',
    '/UseCaseList/Detail': '用例详情',
    '/UseCaseList/createUseCase': '创建用例',
    '/byPass': '旁路列表',
    '/UserLog': '操作日志',
    '/UserList': '用户列表',
    '/backupData': '备份设置',
    '/OnlineReport': '报告预览'
  }
  const history = useHistory()
  const jumpTest = (value: any) => {
    if (pathname === `${value}`) {
      return '跳转页面处于当前页面,无需跳转'
    }
    history.push({
      pathname: `${value}`,
      state: data
    })
  }

  // 退出登陆
  const logout = useCallback(async () => {
    await logoutService()
    history.push('/login')
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('userId')
  }, [history])

  const [resetPasswordDialogVisible, setResetPasswordDialogVisible] = useState(false)
  const systemConfig = useCallback(() => {
    setResetPasswordDialogVisible(true)
  }, [])

  const [isRotate, setIsRotate] = useState(false)

  const onDropdownMenuVisibleChange = useCallback((visible: boolean) => {
    setIsRotate(visible)
  }, [])

  // 下拉菜单 action 筛选
  const menuAction = useCallback(
    ({ key }: { key: string }) => {
      const actionMap = {
        logout,
        systemConfig
      }
      actionMap[key as keyof typeof actionMap]?.()
      setIsRotate(false)
    },
    [logout, systemConfig]
  )

  const menu = (
    <Menu className={styles.sys} onClick={menuAction}>
      {roles && roles.includes('admin') && <Menu.Item key='systemConfig'>修改密码</Menu.Item>}
      <Menu.Item key='logout'>退出登录</Menu.Item>
    </Menu>
  )

  return (
    <div className={styles.Header}>
      <div className={styles.HeaderBread}>
        <Breadcrumb>
          {extraBreadcrumbItems.map((item: string, index: number) => {
            return (
              <Breadcrumb.Item key={item}>
                <span style={{ cursor: 'pointer' }} role='button' tabIndex={index} onClick={() => jumpTest(item)}>
                  {name[item]}
                </span>
              </Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
      </div>
      {!!username && (
        <div className={styles.HeaderUser}>
          <Dropdown overlay={menu} placement='bottomRight' trigger={['click']} onVisibleChange={onDropdownMenuVisibleChange}>
            <Space style={{ cursor: 'pointer' }}>
              <span>{username}</span>
              <DownOutlined style={isRotate ? { transform: 'rotate(180deg)', transition: 'all 0.5s ease 0s' } : {}} />
            </Space>
          </Dropdown>
        </div>
      )}
      <ResetPasswordDialog
        visible={resetPasswordDialogVisible}
        onCancel={() => setResetPasswordDialogVisible(false)}
        onOk={() => setResetPasswordDialogVisible(false)}
      />
    </div>
  )
}

export default withRouter(Header)
