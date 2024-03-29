/* eslint-disable indent */
import React, { useCallback, useContext, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Breadcrumb, Dropdown, Menu, Space, Modal, Form, Input, message, Button } from 'antd'
import { useHistory, withRouter } from 'react-router-dom'
import { GlobalContext } from 'Src/globalContext/globalContext'
// import { IconAdd } from '@anban/iconfonts'
import { logout as logoutService, resetPassword } from 'Src/services/api/loginApi'
import { ifNeedShowLogo } from 'Src/index'
import sidebarLogo from 'Image/logo.svg'
import { throwErrorMessage } from 'Src/util/message'
import taskStyle from 'Src/view/Project/task/TaskInstances/TaskInstance.less'
import styles from './header.less'

interface ResetPasswordDialogProps {
  visible: boolean
  onOk?: (...args: any[]) => void
  onCancel?: (...args: any[]) => void
}

const Logo: React.FC = () => {
  return <div className={styles.headerLogo}>{ifNeedShowLogo && <img src={sidebarLogo} alt='logo' style={{ paddingLeft: '28px' }} />}</div>
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
    '/Projects': '项目管理',
    '/Projects/Tasks': '任务列表',
    '/Projects/Tasks/Detail': '实例详情',
    '/Projects/Tasks/CreateTask': '新建任务',
    '/Projects/Tasks/FixTask': '修改任务',
    '/Projects/Tasks/Detail/LookTaskDetailInfo': '实例信息',
    '/Projects/Tasks/Detail/TaskLog': '日志',
    '/Projects/Tasks/Detail/Scale': '动态监控',
    '/Projects/Tasks/Detail/ScaleDetail': '缺陷详情',
    '/Projects/Tasks/Detail/InitTask': '缺陷详情',
    '/Modeling': '外设建模',
    '/Modeling/Detailes': `${data?.name}`,
    '/Excitataions': '激励配置'
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
      <Logo />
      <div className={styles.HeaderRight_Layout}>
        <div className={styles.HeaderBread}>
          <div className={taskStyle.headerCloumnLine} />
          <Breadcrumb style={{ marginLeft: '5px' }} className={styles.BreadcrumbStyle}>
            {extraBreadcrumbItems.map((item: string, index: number) => {
              return (
                <Breadcrumb.Item key={item}>
                  <span
                    style={{ cursor: 'pointer', color: '#999999' }}
                    className={index === extraBreadcrumbItems.length - 1 ? styles.BreadcrumItem : null}
                    role='button'
                    tabIndex={index}
                    onClick={() => jumpTest(item)}
                  >
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
    </div>
  )
}

export default withRouter(Header)
