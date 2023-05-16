import { Button, Form, Input, message } from 'antd'
import React, { useState, useEffect } from 'react'
import { loginIn } from 'Src/services/api/loginApi'
import LoginImg from 'Image/bg.png'
import { useHistory, withRouter } from 'react-router-dom'
import styles from './login.less'

function Login() {
  // const date = new Date()
  // const year = date.getFullYear()
  const [form] = Form.useForm()
  const history = useHistory()
  const [isDisableStatus, setDisabledStatus] = useState(true)
  const onValuesChange = (changedValues: any, allValues: any) => {
    const bol = allValues.username !== undefined && allValues.username.length > 0 && allValues.password !== undefined && allValues.password.length > 0
    if (bol) {
      setDisabledStatus(false)
    } else {
      setDisabledStatus(true)
    }
  }

  const loginCallback = async () => {
    const values = await form.validateFields()
    if (values) {
      try {
        const res = await loginIn(values)
        if (res.data) {
          localStorage.setItem('access_token', res.data.access_token)
          localStorage.setItem('userId', `${res.data.id}`)
          history.push({
            pathname: '/projects'
          })
          message.success('登录成功')
        } else {
          message.error('系统数据正在导入中，请稍等')
        }
      } catch (error) {
        message.error(error.message)
      }
    }
  }
  useEffect(() => {}, [])
  return (
    <div className={styles.loginBody}>
      <div className={styles.loginLeftBody}>
        <div className={styles.loginLeftConcent}>
          {/* <span>易复协议模糊测试</span>
          <span>易复是一款灵活的黑盒测试产品，通过协议模糊测试帮助用户及时发现软件漏洞，确保软件的安全可靠。</span> */}
        </div>
        <img src={LoginImg} alt='' className={styles.img} />
      </div>
      <div className={styles.loginRightBoby}>
        <div className={styles.loginRightDes}>
          <span>登录</span>
          {/* <span> 欢迎使用网络协议模糊测试工具 </span> */}
          <span>欢迎使用 易复嵌入式模糊测试系统 </span>
        </div>
        <div className={styles.loginRightForm}>
          <Form name='basic' onValuesChange={onValuesChange} layout='vertical' initialValues={{ remember: true }} form={form} autoComplete='off'>
            {/* 紫琼说不要感叹号，2022年9月23日15点54分 */}
            <Form.Item name='username' label='用户名' rules={[{ required: true, message: '请输入用户名' }]}>
              <Input type='text' autoComplete='off' />
            </Form.Item>

            <Form.Item label='密码' name='password' rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password type='text' style={{ borderRadius: '4px' }} autoComplete='new-password' />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                disabled={isDisableStatus}
                htmlType='submit'
                onClick={loginCallback}
                style={{ width: '100%', marginTop: '30px' }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
        {/* <p className={styles.loginBottomtitle}>{`© ${year} Anban All rights reserved`}</p> */}
      </div>
    </div>
  )
}

export default withRouter(Login)
