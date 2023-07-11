import { Form, Input, Select } from 'antd'
import * as React from 'react'
import styles from './agreementCompoents.less'

interface CmpsOnly {
  imgTitleSrc: string
  deleteImg: string
}

type Type = { type: string }

export type Cmps = Type & CmpsOnly

const byteLength = [
  { label: '8', value: 'fixed_8' },
  { label: '16', value: 'fixed_16' },
  { label: '32', value: 'fixed_32' },
  { label: '64', value: 'fixed_64' }
]

const skipMap = [
  { label: '不变异', value: false },
  { label: '变异', value: true }
]
const StringComponents = ({ imgTitleSrc, deleteImg }: CmpsOnly) => {
  const [form] = Form.useForm()
  return (
    <div className={styles.cloumnBody}>
      <div>
        <img src={imgTitleSrc} alt='' />
        <span>字节流 </span>
      </div>
      <Form form={form} name='IntCompoents' layout='inline'>
        <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder='Username' />
        </Form.Item>
        <Form.Item name='area' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={skipMap} />
        </Form.Item>
        <div>初始值</div>
        <Form.Item name='skip' rules={[{ required: true, message: 'Please input your password!' }]}>
          <Select defaultValue='false' options={skipMap} />
        </Form.Item>
      </Form>
      <div>
        <img src={deleteImg} alt='' />
      </div>
    </div>
  )
}

const IntCompoents = ({ imgTitleSrc, deleteImg }: CmpsOnly) => {
  const [form] = Form.useForm()
  return (
    <div className={styles.cloumnBody}>
      <div>
        <img src={imgTitleSrc} alt='' />
        <span>整数 </span>
      </div>
      <Form form={form} name='IntCompoents' layout='inline'>
        <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder='Username' />
        </Form.Item>
        <div>元素个数</div>
        <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder='Username' />
        </Form.Item>
        <div>字节长度</div>
        <Form.Item name='area' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={byteLength} />
        </Form.Item>
        <Form.Item name='skip' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={skipMap} />
        </Form.Item>
        <div>初始值</div>
        <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input />
        </Form.Item>
      </Form>
      <div>
        <img src={deleteImg} alt='' />
      </div>
    </div>
  )
}

const IntArrayCompoents = ({ imgTitleSrc, deleteImg }: CmpsOnly) => {
  const [form] = Form.useForm()
  return (
    <div>
      <div>
        <img src={imgTitleSrc} alt='' />
        <span>整数数组 </span>
      </div>
      <Form form={form} name='IntCompoents' layout='inline'>
        <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder='Username' />
        </Form.Item>
        <div>元素个数</div>
        <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder='Username' />
        </Form.Item>
        <div>字节长度</div>
        <Form.Item name='area' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={byteLength} />
        </Form.Item>
        <Form.Item name='skip' rules={[{ required: true, message: 'Missing area' }]}>
          <Select options={skipMap} />
        </Form.Item>
        <div>初始值</div>
        <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input />
        </Form.Item>
      </Form>
      <div>
        <img src={deleteImg} alt='' />
      </div>
    </div>
  )
}

function AgreementComponents({ imgTitleSrc, type, deleteImg }: Cmps) {
  switch (type) {
    case 'StringComponents':
      return <StringComponents imgTitleSrc={imgTitleSrc} deleteImg={deleteImg} />

    case 'IntComponents':
      return <IntCompoents imgTitleSrc={imgTitleSrc} deleteImg={deleteImg} />

    case 'IntArrayComponents':
      return <IntArrayCompoents imgTitleSrc={imgTitleSrc} deleteImg={deleteImg} />

    default:
      return null
  }
}

export default AgreementComponents
