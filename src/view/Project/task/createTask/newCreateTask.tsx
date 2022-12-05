import React, { useRef, useState } from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import FirstConfig from './taskConfigCompents/firstConfig'
import styles from './newCreateTask.less'
import { projectInfoType } from '../taskList/task'

interface taskInfoType {
  editTask: boolean
}
interface taskPropsType<T> {
  taskInfo: T
  projectInfo: projectInfoType
}
export interface StepRef {
  save: () => void
  delete: () => void
  validate: () => boolean
  clearInteraction: () => void
}

interface ChildRef {
  firstForm: React.MutableRefObject<StepRef | null>
}

const firstFormBaseData = {
  description: undefined,
  host: undefined,
  name: undefined,
  password: undefined,
  username: undefined
}
const CreateTask: React.FC<RouteComponentProps<any, StaticContext, taskPropsType<taskInfoType>>> = props => {
  const history = useHistory()

  const childRef: ChildRef = {
    firstForm: useRef<StepRef | null>(null)
  }

  const { taskInfo, projectInfo } = props.location?.state

  const [taskStepDataObj, setTaskStepDataObj] = useState({ firstFormData: firstFormBaseData, secondFormData: {} })

  const createForm = () => {
    history.push({
      pathname: '/projects/Tasks',
      state: { projectInfo }
    })
  }
  const cancenlForm = () => {
    history.push({
      pathname: '/projects/Tasks',
      state: { projectInfo }
    })
  }

  //  步骤一
  // const firstFormFn = () => {
  //   const formData = childRef.firstForm.current?.save()
  //   if (formData) {
  //     setTaskStepDataObj({ ...taskStepDataObj, firstFormData: formData })
  //   }
  // }

  // 下一步...完成 根据current进行不同操作逻辑
  // 上一步...完成 根据current 进行不同操作

  return (
    <div className={styles.taskMain}>
      <div className={styles.taskMain_header}>
        <span className={styles.taskMain_title}>{taskInfo?.editTask ? '修改任务' : '新建任务'}</span>
      </div>
      <div className={styles.taskMain_boby}>
        <FirstConfig ref={childRef.firstForm} />
      </div>
      <div className={styles.taskMain_footer}>
        <div className={styles.taskMain_footerConcent}>
          <CommonButton
            buttonStyle={styles.stepButton}
            name='取消'
            type='default'
            onClick={() => {
              cancenlForm()
            }}
          />
          <CommonButton
            buttonStyle={styles.stepButton}
            type='primary'
            name='创建'
            onClick={() => {
              createForm()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default withRouter(CreateTask)
