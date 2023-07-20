import React from 'react'
import 'antd/dist/antd.css'
import { Modal } from 'antd'
import AgreementIndex from './agreementIndex'
import StyleSheet from './agreementCompoents.less'
import HeaderForm from './HeaderFrom'

function NewExcitationMoadl(props: any) {
  const { visibility } = props
  return (
    <Modal
      width={720}
      className={StyleSheet.excitaionModal}
      visible={visibility}
      title='新建激励'
      footer={[
        <>
          <span>222</span>
        </>
      ]}
    >
      <div className={StyleSheet.excitationModalBody}>
        <HeaderForm />
        <AgreementIndex />
      </div>
    </Modal>
  )
}

export default NewExcitationMoadl
